import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("APP_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { identifier, password } = await req.json();
    if (typeof identifier !== "string" || typeof password !== "string" ||
        identifier.trim().length < 3 || identifier.trim().length > 80 || password.length < 1 || password.length > 256) {
      return json({ error: "Invalid email, username or password." }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    let email = identifier.trim();

    // Usernames are scoped to Cumpanion profiles; never return the mapped email to the caller.
    if (!email.includes("@")) {
      const username = identifier.trim().replace(/^@/, "");
      if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username)) return json({ error: "Invalid email, username or password." }, 401);
      const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      const { data: profile, error: lookupError } = await admin
        .from("companion_profiles")
        .select("user_id")
        .ilike("username", username)
        .maybeSingle();
      if (lookupError || !profile?.user_id) return json({ error: "Invalid email, username or password." }, 401);

      const { data: userData, error: userError } = await admin.auth.admin.getUserById(profile.user_id);
      if (userError || !userData.user?.email) return json({ error: "Invalid email, username or password." }, 401);
      email = userData.user.email;
    }

    // Delegate password verification and token issuance to Supabase Auth (including its rate limits).
    const tokenResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: anonKey },
      body: JSON.stringify({ email, password }),
    });
    const payload = await tokenResponse.json();
    if (!tokenResponse.ok) return json({ error: "Invalid email, username or password." }, 401);
    return json({ access_token: payload.access_token, refresh_token: payload.refresh_token });
  } catch {
    return json({ error: "Unable to sign in right now. Please try again." }, 500);
  }
});
