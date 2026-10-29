import { corsHeaders, json, zarPerUsd } from '../_shared/paypal.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const rate = await zarPerUsd();
    return json({ zarPerUsd: rate, asOf: new Date().toISOString() });
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }
});
