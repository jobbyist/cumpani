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
