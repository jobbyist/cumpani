# Admin, reels and orientation filter: setup

Nothing here runs until a Supabase project exists. Steps, in order:

1. Create the Supabase project; apply every file in `supabase/migrations/` in order; deploy `supabase/functions/*`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel.
3. **Create the administrator** (password is read from the environment and is never stored in the repo):
   ```bash
   SUPABASE_URL=https://<ref>.supabase.co SUPABASE_SERVICE_ROLE_KEY=<service role key> \
   ADMIN_EMAIL=admin@cumpani.fun ADMIN_PASSWORD='<the password>' node scripts/create-admin.mjs
   ```
   The admin is treated as verified and subscribed by every route guard, RLS policy and RPC, can message and unlock
   content without credits, and has the `/admin` console (verification, moderation queues, reports, reel tags/audiences).
   **Change the password after first login and enable MFA**: it was shared in plain text in a chat.
4. **Reels**: `scripts/prepare-reels.sh clip1.mp4 ... clip5.mp4` (writes `./reels-out`, git-ignored), then
   `SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-reels.mjs ./reels-out`.
   Full clips go to the private `reels` bucket (verified subscribers and admins only). Logged-out visitors get the
   baked-blur preview from the public `reels-preview` bucket; the unblurred clips are never sent to them.
5. Keep the creators' written authorisation for the reel footage on file.

## Orientation filter
The bottom nav's Filter tab sets "I'm interested in" (women / men / trans / everyone). It filters reels (`audiences`)
and companion profiles (`presents_as`, self-declared). The choice is kept in the browser; it is saved to the member's
profile only if they gave special-personal-information consent at signup (POPIA).
