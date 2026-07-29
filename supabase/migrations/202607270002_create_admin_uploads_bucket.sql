insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'admin-uploads',
  'admin-uploads',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admin_uploads_public_select" on storage.objects;
drop policy if exists "admin_uploads_admin_insert" on storage.objects;
drop policy if exists "admin_uploads_admin_update" on storage.objects;
drop policy if exists "admin_uploads_admin_delete" on storage.objects;

create policy "admin_uploads_public_select"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'admin-uploads');

create policy "admin_uploads_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'admin-uploads'
  and public.has_admin_role(array['content_manager', 'course_manager', 'super_admin'])
);

create policy "admin_uploads_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'admin-uploads'
  and public.has_admin_role(array['content_manager', 'course_manager', 'super_admin'])
)
with check (
  bucket_id = 'admin-uploads'
  and public.has_admin_role(array['content_manager', 'course_manager', 'super_admin'])
);

create policy "admin_uploads_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'admin-uploads'
  and public.has_admin_role(array['content_manager', 'course_manager', 'super_admin'])
);
