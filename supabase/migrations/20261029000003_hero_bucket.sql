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
