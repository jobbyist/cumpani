-- Cumpani multi-role accounts and onboarding preferences.
-- Additive migration: legacy profiles.role remains for backwards compatibility.
create table if not exists public.profile_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('companion','creator','seeker')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);
alter table public.profile_roles enable row level security;
create policy "Users can read their own roles"
  on public.profile_roles for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can add their own roles"
  on public.profile_roles for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users can remove their own roles"
  on public.profile_roles for delete to authenticated
  using ((select auth.uid()) = user_id);

create table if not exists public.onboarding_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  dating_preferences jsonb not null default '{}'::jsonb,
  content_preferences jsonb not null default '{}'::jsonb,
  profile_preferences jsonb not null default '{}'::jsonb,
  onboarding_completed_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.onboarding_preferences enable row level security;
create policy "Users can read own onboarding preferences"
  on public.onboarding_preferences for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can create own onboarding preferences"
  on public.onboarding_preferences for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users can update own onboarding preferences"
  on public.onboarding_preferences for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, delete on public.profile_roles to authenticated;
grant select, insert, update on public.onboarding_preferences to authenticated;

-- Backfill existing companion accounts; member accounts become seekers.
insert into public.profile_roles (user_id, role)
select id, case when role = 'companion' then 'companion' else 'seeker' end
from public.profiles
on conflict (user_id, role) do nothing;
