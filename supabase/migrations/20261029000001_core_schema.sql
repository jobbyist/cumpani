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
