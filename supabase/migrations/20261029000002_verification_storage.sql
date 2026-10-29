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
