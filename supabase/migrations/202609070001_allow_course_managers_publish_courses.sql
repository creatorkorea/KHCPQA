drop policy if exists "course_localizations_insert_admin" on public.course_localizations;
drop policy if exists "course_localizations_update_admin" on public.course_localizations;

create policy "course_localizations_insert_admin"
on public.course_localizations for insert
to authenticated
with check (
  public.has_admin_role(array['content_manager', 'course_manager', 'super_admin'])
);

create policy "course_localizations_update_admin"
on public.course_localizations for update
to authenticated
using (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']))
with check (
  public.has_admin_role(array['content_manager', 'course_manager', 'super_admin'])
);
