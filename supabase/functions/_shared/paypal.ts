// Shared helpers for PayPal + Supabase Edge Functions (Deno).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

export const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? 'https://za.cumpani.fun',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

export const PAYPAL_BASE =
  Deno.env.get('PAYPAL_ENV') === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

export const serviceClient = () =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

/** Resolve the calling user from their JWT. Throws if not authenticated. */
export async function requireUser(req: Request) {
  const auth = req.headers.get('Authorization') ?? '';
  const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: auth } },
  });
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Response('Unauthorized', { status: 401, headers: corsHeaders });
  return data.user;
}

export async function paypalToken(): Promise<string> {
  const id = Deno.env.get('PAYPAL_CLIENT_ID')!;
  const secret = Deno.env.get('PAYPAL_CLIENT_SECRET')!;
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: 'Basic ' + btoa(`${id}:${secret}`), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error('PayPal auth failed');
  return (await res.json()).access_token;
}

// ---- FX: USD per 1 ZAR, cached 5 minutes in memory ----
let cache: { rate: number; at: number } | null = null;

/** Returns ZAR per 1 USD. */
export async function zarPerUsd(): Promise<number> {
  if (cache && Date.now() - cache.at < 5 * 60_000) return cache.rate;
  const res = await fetch('https://open.er-api.com/v6/latest/USD');
  if (!res.ok) throw new Error('FX provider unavailable');
  const rate = (await res.json()).rates?.ZAR as number | undefined;
  if (!rate || rate < 5 || rate > 60) throw new Error('FX rate out of expected range');
  cache = { rate, at: Date.now() };
  return rate;
}

/** 1 credit = R1. Top-up bounds are enforced server-side. */
export const MIN_TOPUP_ZAR = 20;
export const MAX_TOPUP_ZAR = 5000;
