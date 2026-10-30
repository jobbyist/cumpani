// Creates (or updates) the site administrator. Run once after the Supabase project and migrations exist.
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... ADMIN_EMAIL=admin@cumpani.fun ADMIN_PASSWORD='...' node scripts/create-admin.mjs
// The password is read from the environment and is never stored in the repository.
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL and ADMIN_PASSWORD.');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

let userId;
const created = await sb.auth.admin.createUser({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  email_confirm: true,
  // the signup trigger requires a 21+ date of birth
  user_metadata: { display_name: 'Admin', dob: '1990-01-01' },
});
if (created.error) {
  if (!/already|registered|exists/i.test(created.error.message)) throw created.error;
  // existing user: find it, reset the password, and continue
  let page = 1;
  while (!userId) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    userId = data.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())?.id;
    if (data.users.length < 200) break;
    page++;
  }
  if (!userId) throw new Error('Admin user exists but could not be found');
  const upd = await sb.auth.admin.updateUserById(userId, { password: ADMIN_PASSWORD, email_confirm: true });
  if (upd.error) throw upd.error;
} else {
  userId = created.data.user.id;
}

const { error } = await sb.from('profiles')
  .update({ role: 'admin', verification_status: 'verified', age_verified_at: new Date().toISOString() })
  .eq('id', userId);
if (error) throw error;
console.log(`Admin ready: ${ADMIN_EMAIL} (${userId}). Change the password and enable MFA after first login.`);
