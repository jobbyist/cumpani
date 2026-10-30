-- Pre-launch: early-access waitlist, companion/creator applications, report priority, profile blur thumbnails.

-- ---------- waitlist ----------
create table public.early_access_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null check (char_length(name) between 2 and 80),
  city text check (char_length(city) <= 60),
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now(),
  constraint ea_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254)
);
create unique index early_access_email_key on public.early_access_signups (lower(email));
alter table public.early_access_signups enable row level security;
create policy ea_insert_anyone on public.early_access_signups for insert to anon, authenticated with check (true);
create policy ea_admin_select on public.early_access_signups for select using (public.is_admin());
create policy ea_admin_delete on public.early_access_signups for delete using (public.is_admin());

-- ---------- companion / creator applications (window enforced server-side) ----------
create table public.companion_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null,
  dob date not null,
  city text check (char_length(city) <= 60),
  role text not null check (role in ('companion', 'creator')),
  links text check (char_length(links) <= 1000),
  consent boolean not null check (consent),
  status public.moderation_status not null default 'pending',
  created_at timestamptz not null default now(),
  constraint ca_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  constraint ca_21_plus check (dob <= ((now() at time zone 'Africa/Johannesburg')::date - interval '21 years'))
);
create unique index companion_applications_email_key on public.companion_applications (lower(email));
alter table public.companion_applications enable row level security;
create policy ca_insert_in_window on public.companion_applications for insert to anon, authenticated
  with check (status = 'pending'
              and now() >= timestamptz '2026-11-02 00:00:00+02'
              and now() <  timestamptz '2026-12-01 00:00:00+02');
create policy ca_admin_select on public.companion_applications for select using (public.is_admin());
create policy ca_admin_update on public.companion_applications for update using (public.is_admin());

-- Inserts are write-only for the public: no SELECT policy for anon, so duplicates are reported by the unique index.

-- ---------- reports: categories + priority (hate / outing / extortion are reviewed first) ----------
alter table public.reports add column category text
  check (category in ('hate_harassment', 'outing_threat', 'blackmail_extortion', 'fake_profile', 'underage', 'other'));
alter table public.reports add column priority boolean not null default false;
create or replace function public.set_report_priority() returns trigger language plpgsql as $$
begin
  new.priority := new.category in ('hate_harassment', 'outing_threat', 'blackmail_extortion', 'underage');
  return new;
end $$;
create trigger reports_priority before insert on public.reports
  for each row execute function public.set_report_priority();

-- ---------- blurred profile thumbnails (safe to serve to logged-out visitors) ----------
alter table public.companion_profiles add column blur_path text;
insert into storage.buckets (id, name, public) values ('profile-blur', 'profile-blur', true) on conflict (id) do nothing;
create policy "profile blur public read" on storage.objects for select to anon, authenticated using (bucket_id = 'profile-blur');
create policy "profile blur write own or admin" on storage.objects for insert to authenticated
  with check (bucket_id = 'profile-blur' and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text));

-- Public, non-sensitive projection for the logged-out homepage: names, city and the BLURRED thumbnail only.
create view public.featured_companions_public as
  select user_id, username, city, province, blur_path, is_available
  from public.companion_profiles
  where moderation = 'approved' and blur_path is not null;
grant select on public.featured_companions_public to anon, authenticated;

-- Only admins (or the service role / SQL editor, where auth.uid() is null) may approve a companion profile.
-- Without this, any signed-in user could insert their own row as 'approved' and appear in the public view.
create or replace function public.guard_companion_moderation() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.moderation := 'pending';
      new.is_sample := false;
    else
      new.moderation := old.moderation;
      new.is_sample := old.is_sample;
    end if;
  end if;
  return new;
end $$;
create trigger companion_moderation_guard before insert or update on public.companion_profiles
  for each row execute function public.guard_companion_moderation();
