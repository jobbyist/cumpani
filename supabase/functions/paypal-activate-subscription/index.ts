import { corsHeaders, json, requireUser, paypalToken, PAYPAL_BASE, serviceClient } from '../_shared/paypal.ts';

// After PayPal approval, verify the subscription server-side before marking it active.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const user = await requireUser(req);
    const { subscriptionId } = await req.json();
    if (typeof subscriptionId !== 'string' || !/^[A-Za-z0-9-]{8,40}$/.test(subscriptionId)) return json({ error: 'Invalid subscription' }, 400);

    const token = await paypalToken();
    const res = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}`, { headers: { Authorization: `Bearer ${token}` } });
    const sub = await res.json();
    if (!res.ok) return json({ error: 'Subscription lookup failed' }, 502);
    if (sub.plan_id !== Deno.env.get('PAYPAL_PLAN_ID')) return json({ error: 'Unexpected plan' }, 400);
    if (sub.custom_id && sub.custom_id !== user.id) return json({ error: 'Subscription belongs to another user' }, 403);
    if (sub.status !== 'ACTIVE' && sub.status !== 'APPROVED') return json({ error: `Subscription is ${sub.status}` }, 402);

    const { error } = await serviceClient().from('subscriptions').update({
      status: sub.status === 'ACTIVE' ? 'active' : 'pending',
      paypal_subscription_id: subscriptionId,
      current_period_end: sub.billing_info?.next_billing_time ?? null,
      updated_at: new Date().toISOString(),
    }).eq('user_id', user.id);
    if (error) return json({ error: 'Could not save subscription' }, 500);
    return json({ ok: true, status: sub.status });
  } catch (e) {
    if (e instanceof Response) return e;
    return json({ error: (e as Error).message }, 500);
  }
});
