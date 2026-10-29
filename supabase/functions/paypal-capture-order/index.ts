import { corsHeaders, json, requireUser, paypalToken, PAYPAL_BASE, serviceClient } from '../_shared/paypal.ts';

// Captures the order, then credits the wallet idempotently (paypal_order_id is UNIQUE).
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const user = await requireUser(req);
    const { orderId } = await req.json();
    if (typeof orderId !== 'string' || !/^[A-Za-z0-9-]{8,40}$/.test(orderId)) return json({ error: 'Invalid order' }, 400);

    const token = await paypalToken();
    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    let order = await res.json();
    if (!res.ok) {
      // Already captured (e.g. retry)? fetch the order and fall through to idempotent credit.
      const again = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` } });
      order = await again.json();
    }
    if (order.status !== 'COMPLETED') return json({ error: 'Payment not completed' }, 402);

    const unit = order.purchase_units?.[0];
    const meta = JSON.parse(unit?.payments?.captures?.[0]?.custom_id ?? unit?.custom_id ?? '{}');
    if (meta.u !== user.id) return json({ error: 'Order does not belong to this user' }, 403);
    const paid = unit?.payments?.captures?.[0]?.amount;
    if (paid?.currency_code !== 'USD' || paid?.value !== (meta.usdCents / 100).toFixed(2)) {
      return json({ error: 'Captured amount mismatch' }, 400);
    }

    const { error } = await serviceClient().rpc('credit_topup', {
      p_user: user.id,
      p_credits: meta.zar,
      p_zar_cents: meta.zar * 100,
      p_usd_cents: meta.usdCents,
      p_fx_rate: meta.rate,
      p_paypal_order_id: orderId,
    });
    if (error) return json({ error: 'Could not credit wallet' }, 500);
    return json({ ok: true, credits: meta.zar });
  } catch (e) {
    if (e instanceof Response) return e;
    return json({ error: (e as Error).message }, 500);
  }
});
