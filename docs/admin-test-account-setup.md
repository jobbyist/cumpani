# Cumpani administrator setup

The application grants the full admin experience through the existing `profiles.role = 'admin'` authorization path. The test administrator email is `admin@cumpani.fun`.

For security, the initial password supplied for this account is not stored in this repository, a migration, or client-side code.

1. In the Supabase Dashboard for the Cumpani project, create or invite `admin@cumpani.fun` under Authentication → Users. Set the temporary password there using the dashboard's secure controls.
2. Confirm the user exists and has completed any required email confirmation.
3. Run the following SQL in the Supabase SQL Editor (or re-run migration `20261123000001_promote_test_admin.sql` after the user exists):

```sql
update public.profiles p
set role = 'admin'
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('admin@cumpani.fun');
```

4. Sign in at `/login`. Admin accounts bypass the normal verification and subscription gates through the existing `is_admin()` policies and application guards.
5. Immediately change the temporary password, enable MFA, and use a unique password manager-generated credential. Do not reuse the password shared during setup.

The migration is intentionally idempotent and only promotes the account if it already exists. It does not create an Auth user or attempt to set a password.
