import { corsHeaders, json, requireUser, paypalToken, PAYPAL_BASE, zarPerUsd, MIN_TOPUP_ZAR, MAX_TOPUP_ZAR } from '../_shared/paypal.ts';

// Creates a USD PayPal order for a ZAR wallet top-up, converted at the live rate.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const user = await requireUser(req);
    const { zar } = await req.json();
    if (!Number.isInteger(zar) || zar < MIN_TOPUP_ZAR || zar > MAX_TOPUP_ZAR) {
      return json({ error: `Top-up must be a whole number between R${MIN_TOPUP_ZAR} and R${MAX_TOPUP_ZAR}` }, 400);
    }
    const rate = await zarPerUsd();
    const usdCents = Math.ceil((zar / rate) * 100);
    const token = await paypalToken();
    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          // custom_id binds the order to the user + ZAR amount + rate; verified again on capture
          custom_id: JSON.stringify({ u: user.id, zar, rate, usdCents }),
          description: `Cumpani wallet top-up R${zar}`,
          amount: { currency_code: 'USD', value: (usdCents / 100).toFixed(2) },
        }],
      }),
    });
    const order = await res.json();
    if (!res.ok) return json({ error: 'PayPal order failed' }, 502);
    return json({ id: order.id, zar, usd: usdCents / 100, rate });
  } catch (e) {
    if (e instanceof Response) return e;
    return json({ error: (e as Error).message }, 500);
  }
});
