import { json, paypalToken, PAYPAL_BASE, serviceClient } from '../_shared/paypal.ts';

// Subscription lifecycle webhooks. Signature is verified with PayPal before any state changes.
Deno.serve(async (req) => {
  const raw = await req.text();
  const token = await paypalToken();
  const verify = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_algo: req.headers.get('paypal-auth-algo'),
      cert_url: req.headers.get('paypal-cert-url'),
      transmission_id: req.headers.get('paypal-transmission-id'),
      transmission_sig: req.headers.get('paypal-transmission-sig'),
      transmission_time: req.headers.get('paypal-transmission-time'),
      webhook_id: Deno.env.get('PAYPAL_WEBHOOK_ID'),
      webhook_event: JSON.parse(raw),
    }),
  });
  if (!verify.ok || (await verify.json()).verification_status !== 'SUCCESS') return json({ error: 'bad signature' }, 400);

  const event = JSON.parse(raw);
  const id: string | undefined = event.resource?.id;
  const map: Record<string, 'active' | 'past_due' | 'cancelled'> = {
    'BILLING.SUBSCRIPTION.ACTIVATED': 'active',
    'BILLING.SUBSCRIPTION.RE-ACTIVATED': 'active',
    'PAYMENT.SALE.COMPLETED': 'active',
    'BILLING.SUBSCRIPTION.PAYMENT.FAILED': 'past_due',
    'BILLING.SUBSCRIPTION.SUSPENDED': 'past_due',
    'BILLING.SUBSCRIPTION.CANCELLED': 'cancelled',
    'BILLING.SUBSCRIPTION.EXPIRED': 'cancelled',
  };
  const status = map[event.event_type];
  const subId = event.event_type === 'PAYMENT.SALE.COMPLETED' ? event.resource?.billing_agreement_id : id;
  if (status && subId) {
    await serviceClient().from('subscriptions').update({
      status, updated_at: new Date().toISOString(),
      ...(status === 'active' ? { current_period_end: new Date(Date.now() + 32 * 86400_000).toISOString() } : {}),
    }).eq('paypal_subscription_id', subId);
  }
  return json({ ok: true });
});
