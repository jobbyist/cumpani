-- ===== 20261029000001_core_schema.sql =====
-- Cumpani core schema. Apply to a dedicated Supabase project.
-- All money-affecting writes go through SECURITY DEFINER functions; clients never write balances.

create extension if not exists pgcrypto;

-- ---------- enums ----------
create type public.user_role as enum ('member', 'companion', 'admin');
create type public.verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type public.subscription_status as enum ('none', 'pending', 'active', 'past_due', 'cancelled');
create type public.wallet_tx_type as enum ('topup', 'spend', 'earn', 'refund');
create type public.moderation_status as enum ('pending', 'approved', 'rejected');

-- ---------- profiles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'member',
  display_name text not null check (char_length(display_name) between 2 and 40),
  dob date not null,
  city text,
  province text,
  avatar_url text,
  verification_status public.verification_status not null default 'unverified',
  age_verified_at timestamptz,
  created_at timestamptz not null default now(),
  constraint profiles_21_plus check (dob <= (current_date - interval '21 years'))
);

-- ---------- helper predicates (SECURITY DEFINER, stable) ----------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_verified() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles
    where id = auth.uid() and verification_status = 'verified');
$$;

create or replace function public.has_active_subscription() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.subscriptions
    where user_id = auth.uid() and status = 'active'
      and (current_period_end is null or current_period_end > now()));
$$;

-- ---------- subscriptions ----------
create table public.subscriptions (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  status public.subscription_status not null default 'none',
  paypal_subscription_id text unique,
  zar_price_cents integer not null default 9900,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

-- ---------- wallet ----------
create table public.wallets (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  balance_credits bigint not null default 0 check (balance_credits >= 0),
  updated_at timestamptz not null default now()
);

create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.wallet_tx_type not null,
  credits bigint not null check (credits > 0),
  reason text,
  zar_cents integer,
  usd_cents integer,
  fx_rate numeric(12,6),
  paypal_order_id text unique,        -- idempotency key for top-ups
  related_id uuid,                    -- message / content_item / post
  created_at timestamptz not null default now()
);
create index on public.wallet_transactions (user_id, created_at desc);

-- ---------- companion profiles (no rate / pricing fields by design) ----------
create table public.companion_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  username text not null unique,
  bio text check (char_length(bio) <= 1000),
  city text not null,
  province text not null,
  photos text[] not null default '{}',
  is_available boolean not null default true,
  is_sample boolean not null default false,   -- demo/seed profile, labelled in UI
  moderation public.moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  id_document_path text not null,   -- private storage bucket 'verification'
  selfie_path text not null,
  status public.verification_status not null default 'pending',
  reviewer uuid references public.profiles(id),
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

-- ---------- messaging ----------
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  companion_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (member_id, companion_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index on public.messages (conversation_id, created_at);

-- ---------- community ----------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 140),
  body text check (char_length(body) <= 5000),
  image_path text,
  is_adult boolean not null default false,
  moderation public.moderation_status not null default 'pending',
  score integer not null default 0,
  created_at timestamptz not null default now()
);
create index on public.posts (moderation, created_at desc);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table public.votes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  primary key (post_id, user_id)
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null default 'highlight' check (kind in ('popular', 'promoted', 'highlight')),
  media_path text not null,
  caption text check (char_length(caption) <= 140),
  moderation public.moderation_status not null default 'pending',
  expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now()
);

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  media_path text not null,           -- private bucket 'exclusive'
  price_credits integer not null check (price_credits >= 0),
  moderation public.moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.content_unlocks (
  content_id uuid not null references public.content_items(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (content_id, user_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post', 'comment', 'message', 'profile', 'content')),
  target_id uuid not null,
  reason text not null check (char_length(reason) between 3 and 1000),
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('terms', 'privacy', 'marketing', 'special_personal_information')),
  version text not null,
  granted boolean not null,
  created_at timestamptz not null default now()
);

-- ---------- auto-provision on signup ----------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_dob date := (new.raw_user_meta_data ->> 'dob')::date;
  v_name text := coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1));
begin
  if v_dob is null or v_dob > (current_date - interval '21 years') then
    raise exception 'Members must be 21 or older';
  end if;
  -- role is always 'member' at signup; companions are promoted by an admin after verification
  insert into public.profiles (id, display_name, dob) values (new.id, v_name, v_dob);
  insert into public.wallets (user_id) values (new.id);
  insert into public.subscriptions (user_id) values (new.id);
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- wallet RPCs ----------
-- Credit a top-up. Called ONLY by the service role (Edge Function) after PayPal capture.
create or replace function public.credit_topup(
  p_user uuid, p_credits bigint, p_zar_cents integer, p_usd_cents integer,
  p_fx_rate numeric, p_paypal_order_id text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.wallet_transactions
    (user_id, type, credits, reason, zar_cents, usd_cents, fx_rate, paypal_order_id)
  values (p_user, 'topup', p_credits, 'PayPal top-up', p_zar_cents, p_usd_cents, p_fx_rate, p_paypal_order_id)
  on conflict (paypal_order_id) do nothing;     -- duplicate webhook/capture = no double credit
  if found then
    update public.wallets set balance_credits = balance_credits + p_credits, updated_at = now()
      where user_id = p_user;
  end if;
end $$;
revoke all on function public.credit_topup from public, anon, authenticated;

-- Spend credits as the calling user. Optionally pays an earner (companion) 70%.
create or replace function public.spend_credits(
  p_credits bigint, p_reason text, p_related uuid default null, p_earner uuid default null
) returns bigint language plpgsql security definer set search_path = public as $$
declare v_balance bigint;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if p_credits <= 0 then raise exception 'invalid amount'; end if;
  select balance_credits into v_balance from public.wallets where user_id = auth.uid() for update;
  if v_balance is null or v_balance < p_credits then raise exception 'insufficient credits'; end if;
  update public.wallets set balance_credits = balance_credits - p_credits, updated_at = now()
    where user_id = auth.uid();
  insert into public.wallet_transactions (user_id, type, credits, reason, related_id)
    values (auth.uid(), 'spend', p_credits, p_reason, p_related);
  if p_earner is not null and p_earner <> auth.uid() then
    update public.wallets set balance_credits = balance_credits + (p_credits * 70 / 100), updated_at = now()
      where user_id = p_earner;
    if (p_credits * 70 / 100) > 0 then
      insert into public.wallet_transactions (user_id, type, credits, reason, related_id)
        values (p_earner, 'earn', p_credits * 70 / 100, p_reason, p_related);
    end if;
  end if;
  return v_balance - p_credits;
end $$;
grant execute on function public.spend_credits to authenticated;

-- Unlock paid content (idempotent).
create or replace function public.unlock_content(p_content uuid) returns void
language plpgsql security definer set search_path = public as $$
declare v_price integer; v_author uuid;
begin
  if not public.has_active_subscription() then raise exception 'subscription required'; end if;
  if exists (select 1 from public.content_unlocks where content_id = p_content and user_id = auth.uid()) then
    return;
  end if;
  select price_credits, author_id into v_price, v_author from public.content_items
    where id = p_content and moderation = 'approved';
  if v_author is null then raise exception 'content not found'; end if;
  if v_price > 0 then
    perform public.spend_credits(v_price, 'Unlock content', p_content, v_author);
  end if;
  insert into public.content_unlocks (content_id, user_id) values (p_content, auth.uid());
end $$;
grant execute on function public.unlock_content to authenticated;

-- Start/send a message (requires subscription + verified; 1 credit per message to the companion).
create or replace function public.send_message(p_conversation uuid, p_body text) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_conv public.conversations; v_id uuid;
begin
  if not (public.has_active_subscription() and public.is_verified()) then
    raise exception 'active subscription and verified account required';
  end if;
  select * into v_conv from public.conversations
    where id = p_conversation and (member_id = auth.uid() or companion_id = auth.uid());
  if v_conv.id is null then raise exception 'conversation not found'; end if;
  if v_conv.member_id = auth.uid() then
    perform public.spend_credits(1, 'Message', p_conversation, v_conv.companion_id);
  end if;
  insert into public.messages (conversation_id, sender_id, body)
    values (p_conversation, auth.uid(), p_body) returning id into v_id;
  return v_id;
end $$;
grant execute on function public.send_message to authenticated;

-- ---------- row level security ----------
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.companion_profiles enable row level security;
alter table public.verification_requests enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.votes enable row level security;
alter table public.stories enable row level security;
alter table public.content_items enable row level security;
alter table public.content_unlocks enable row level security;
alter table public.reports enable row level security;
alter table public.consents enable row level security;

-- profiles: own row + verified members see other profiles' public fields via view-level use; admins see all
create policy profiles_select_own on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_select_verified on public.profiles for select
  using (public.is_verified() and verification_status = 'verified');
-- users may edit display fields only; role / verification / dob locked via column grants below
create policy profiles_update_own on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (display_name, city, province, avatar_url) on public.profiles to authenticated;
create policy profiles_admin_all on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy subs_select_own on public.subscriptions for select using (user_id = auth.uid() or public.is_admin());
create policy wallets_select_own on public.wallets for select using (user_id = auth.uid());
create policy wtx_select_own on public.wallet_transactions for select using (user_id = auth.uid());
-- (no insert/update/delete policies on subscriptions, wallets, wallet_transactions => service role / RPC only)

create policy cp_select on public.companion_profiles for select
  using ((moderation = 'approved' and public.is_verified() and public.has_active_subscription())
         or user_id = auth.uid() or public.is_admin());
create policy cp_upsert_own on public.companion_profiles for insert with check (user_id = auth.uid());
create policy cp_update_own on public.companion_profiles for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy vr_select_own on public.verification_requests for select using (user_id = auth.uid() or public.is_admin());
create policy vr_insert_own on public.verification_requests for insert with check (user_id = auth.uid() and status = 'pending');
create policy vr_admin_update on public.verification_requests for update using (public.is_admin());

create policy conv_select on public.conversations for select using (member_id = auth.uid() or companion_id = auth.uid());
create policy conv_insert on public.conversations for insert
  with check (member_id = auth.uid() and public.has_active_subscription() and public.is_verified());
create policy msg_select on public.messages for select using (
  exists (select 1 from public.conversations c where c.id = conversation_id
          and (c.member_id = auth.uid() or c.companion_id = auth.uid())));
-- messages are inserted only through send_message()

create policy posts_select on public.posts for select
  using ((moderation = 'approved' and public.is_verified()) or author_id = auth.uid() or public.is_admin());
create policy posts_insert on public.posts for insert
  with check (author_id = auth.uid() and public.is_verified() and moderation = 'pending');
create policy posts_admin_update on public.posts for update using (public.is_admin());
create policy comments_select on public.comments for select using (public.is_verified());
create policy comments_insert on public.comments for insert with check (author_id = auth.uid() and public.is_verified());
create policy votes_all_own on public.votes for all using (user_id = auth.uid()) with check (user_id = auth.uid() and public.is_verified());

create policy stories_select on public.stories for select
  using ((moderation = 'approved' and expires_at > now() and public.is_verified()) or author_id = auth.uid() or public.is_admin());
create policy stories_insert on public.stories for insert with check (author_id = auth.uid() and moderation = 'pending');
create policy stories_admin_update on public.stories for update using (public.is_admin());

create policy ci_select on public.content_items for select
  using ((moderation = 'approved' and public.is_verified()) or author_id = auth.uid() or public.is_admin());
create policy ci_insert on public.content_items for insert with check (author_id = auth.uid() and moderation = 'pending');
create policy cu_select_own on public.content_unlocks for select using (user_id = auth.uid());

create policy reports_insert on public.reports for insert with check (reporter_id = auth.uid());
create policy reports_admin on public.reports for select using (public.is_admin());
create policy reports_admin_update on public.reports for update using (public.is_admin());

create policy consents_select_own on public.consents for select using (user_id = auth.uid());
create policy consents_insert_own on public.consents for insert with check (user_id = auth.uid());

-- keep post score in sync with votes
create or replace function public.refresh_post_score() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_post uuid := coalesce(new.post_id, old.post_id);
begin
  update public.posts set score = coalesce((select sum(value) from public.votes where post_id = v_post), 0)
    where id = v_post;
  return null;
end $$;
create trigger votes_score after insert or update or delete on public.votes
  for each row execute function public.refresh_post_score();

-- realtime for chat
alter publication supabase_realtime add table public.messages;


-- ===== 20261029000002_verification_storage.sql =====
-- Verification workflow, companion promotion and storage buckets/policies.

alter table public.verification_requests
  add column kind text not null default 'member' check (kind in ('member', 'companion'));

-- When a request is submitted, mark the profile pending.
create or replace function public.on_verification_submitted() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set verification_status = 'pending'
    where id = new.user_id and verification_status in ('unverified', 'rejected');
  return new;
end $$;
create trigger verification_submitted after insert on public.verification_requests
  for each row execute function public.on_verification_submitted();

-- Admin decision. Approving also promotes to companion when the request kind says so.
create or replace function public.review_verification(p_request uuid, p_approve boolean, p_notes text default null)
returns void language plpgsql security definer set search_path = public as $$
declare r public.verification_requests;
begin
  if not public.is_admin() then raise exception 'admin only'; end if;
  select * into r from public.verification_requests where id = p_request for update;
  if r.id is null then raise exception 'request not found'; end if;
  update public.verification_requests
    set status = case when p_approve then 'verified' else 'rejected' end::public.verification_status,
        reviewer = auth.uid(), reviewed_at = now(), notes = p_notes
    where id = p_request;
  update public.profiles
    set verification_status = case when p_approve then 'verified' else 'rejected' end::public.verification_status,
        age_verified_at = case when p_approve then now() else age_verified_at end,
        role = case when p_approve and r.kind = 'companion' then 'companion' else role end
    where id = r.user_id;
end $$;
grant execute on function public.review_verification to authenticated;

-- ---------- storage ----------
insert into storage.buckets (id, name, public) values
  ('verification', 'verification', false),
  ('stories', 'stories', false),
  ('posts', 'posts', false),
  ('exclusive', 'exclusive', false),
  ('avatars', 'avatars', false)
on conflict (id) do nothing;

-- Convention: object name = '<user_id>/<file>'.
create policy "own folder upload" on storage.objects for insert to authenticated
  with check (bucket_id in ('verification', 'stories', 'posts', 'exclusive', 'avatars')
              and (storage.foldername(name))[1] = auth.uid()::text);

create policy "verification read own or admin" on storage.objects for select to authenticated
  using (bucket_id = 'verification' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

create policy "member media read" on storage.objects for select to authenticated
  using (bucket_id in ('stories', 'posts', 'avatars')
         and (public.is_verified() or (storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

create policy "exclusive read if owner or unlocked" on storage.objects for select to authenticated
  using (bucket_id = 'exclusive' and (
    (storage.foldername(name))[1] = auth.uid()::text or public.is_admin() or exists (
      select 1 from public.content_items ci
      join public.content_unlocks cu on cu.content_id = ci.id
      where ci.media_path = storage.objects.name and cu.user_id = auth.uid())));


-- ===== 20261029000003_hero_bucket.sql =====
-- Private bucket for the members-only homepage hero video.
-- Upload 'hero.mp4' (and optionally 'hero.webm') as an admin; see docs/hero-video.md.
insert into storage.buckets (id, name, public) values ('hero', 'hero', false)
on conflict (id) do nothing;

create policy "hero read for verified subscribers" on storage.objects for select to authenticated
  using (bucket_id = 'hero' and (public.is_admin() or (public.is_verified() and public.has_active_subscription())));

create policy "hero admin write" on storage.objects for insert to authenticated
  with check (bucket_id = 'hero' and public.is_admin());
create policy "hero admin update" on storage.objects for update to authenticated
  using (bucket_id = 'hero' and public.is_admin());
create policy "hero admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'hero' and public.is_admin());


-- ===== 20261029000004_reels_orientation_admin.sql =====
-- Reels, orientation preferences, and admin super-access.

create type public.orientation_pref as enum ('women', 'men', 'trans', 'everyone');

-- Viewer preference ("I'm interested in"). POPIA special personal information: only written with consent.
alter table public.profiles add column interested_in public.orientation_pref[];
revoke update on public.profiles from authenticated;
grant update (display_name, city, province, avatar_url, interested_in) on public.profiles to authenticated;

-- Companion self-declared labels (optional), e.g. straight / gay / lesbian / bisexual / trans.
alter table public.companion_profiles add column orientation_tags text[] not null default '{}';
-- Self-declared category used by the viewer's "I'm interested in" filter (null = shown to everyone).
alter table public.companion_profiles add column presents_as public.orientation_pref;

-- ---------- admin treated as verified + subscribed everywhere ----------
create or replace function public.is_verified() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles
    where id = auth.uid() and (verification_status = 'verified' or role = 'admin'));
$$;

create or replace function public.has_active_subscription() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
      or exists (select 1 from public.subscriptions
    where user_id = auth.uid() and status = 'active'
      and (current_period_end is null or current_period_end > now()));
$$;

-- Admins spend nothing (free messaging/unlocks); others unchanged.
create or replace function public.spend_credits(
  p_credits bigint, p_reason text, p_related uuid default null, p_earner uuid default null
) returns bigint language plpgsql security definer set search_path = public as $$
declare v_balance bigint;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if p_credits <= 0 then raise exception 'invalid amount'; end if;
  if public.is_admin() then
    select balance_credits into v_balance from public.wallets where user_id = auth.uid();
    return coalesce(v_balance, 0);
  end if;
  select balance_credits into v_balance from public.wallets where user_id = auth.uid() for update;
  if v_balance is null or v_balance < p_credits then raise exception 'insufficient credits'; end if;
  update public.wallets set balance_credits = balance_credits - p_credits, updated_at = now()
    where user_id = auth.uid();
  insert into public.wallet_transactions (user_id, type, credits, reason, related_id)
    values (auth.uid(), 'spend', p_credits, p_reason, p_related);
  if p_earner is not null and p_earner <> auth.uid() then
    update public.wallets set balance_credits = balance_credits + (p_credits * 70 / 100), updated_at = now()
      where user_id = p_earner;
    if (p_credits * 70 / 100) > 0 then
      insert into public.wallet_transactions (user_id, type, credits, reason, related_id)
        values (p_earner, 'earn', p_credits * 70 / 100, p_reason, p_related);
    end if;
  end if;
  return v_balance - p_credits;
end $$;

-- Admins read everything their policies already allow; make wallet/consent/message visibility explicit for support.
create policy wallets_admin_read on public.wallets for select using (public.is_admin());
create policy wtx_admin_read on public.wallet_transactions for select using (public.is_admin());
create policy messages_admin_read on public.messages for select using (public.is_admin());
create policy conv_admin_read on public.conversations for select using (public.is_admin());
create policy comments_admin_all on public.comments for all using (public.is_admin()) with check (public.is_admin());
create policy posts_admin_delete on public.posts for delete using (public.is_admin());
create policy ci_admin_update on public.content_items for update using (public.is_admin());
create policy cp_admin_update on public.companion_profiles for update using (public.is_admin());

-- ---------- reels ----------
create table public.reels (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  title text not null default '',
  tags text[] not null default '{}',
  audiences public.orientation_pref[] not null default '{everyone}',
  video_path text not null,       -- private bucket 'reels'
  preview_path text not null,     -- public bucket 'reels-preview' (baked-blur clip)
  moderation public.moderation_status not null default 'pending',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index on public.reels (moderation, sort_order, created_at desc);
alter table public.reels enable row level security;

-- Metadata and blurred preview path are public so logged-out visitors can see the teaser.
create policy reels_select_public on public.reels for select using (moderation = 'approved');
create policy reels_select_own on public.reels for select using (author_id = auth.uid() or public.is_admin());
create policy reels_insert_own on public.reels for insert
  with check (author_id = auth.uid() and moderation = 'pending' and public.is_verified());
create policy reels_admin_all on public.reels for all using (public.is_admin()) with check (public.is_admin());

-- ---------- storage ----------
insert into storage.buckets (id, name, public) values
  ('reels', 'reels', false),
  ('reels-preview', 'reels-preview', true)
on conflict (id) do nothing;

create policy "reels full read for verified subscribers" on storage.objects for select to authenticated
  using (bucket_id = 'reels' and (public.is_admin() or (public.is_verified() and public.has_active_subscription())));
create policy "reels write own folder or admin" on storage.objects for insert to authenticated
  with check (bucket_id in ('reels', 'reels-preview')
              and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text));
create policy "reels admin update delete" on storage.objects for update to authenticated
  using (bucket_id in ('reels', 'reels-preview') and public.is_admin());
create policy "reels admin delete" on storage.objects for delete to authenticated
  using (bucket_id in ('reels', 'reels-preview') and public.is_admin());
create policy "reels preview public read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'reels-preview');


-- ===== 20261030000005_prelaunch.sql =====
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


