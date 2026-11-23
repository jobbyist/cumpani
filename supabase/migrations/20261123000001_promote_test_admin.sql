-- Promote the designated test administrator only when the Auth user has already been
-- created in Supabase. Never store an administrator password in source control.
do $$
begin
  update public.profiles p
     set role = 'admin'
    from auth.users u
   where p.id = u.id
     and lower(u.email) = lower('admin@cumpani.fun');
end $$;
