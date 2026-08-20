alter table public.admin_content_items
  add column if not exists source_locale text not null default 'ko',
  add column if not exists source_updated_at timestamptz,
  add column if not exists translated_from_updated_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists image_alt text;

alter table public.admin_content_items
  drop constraint if exists admin_content_items_locale_check,
  drop constraint if exists admin_content_items_status_check,
  drop constraint if exists admin_content_items_source_locale_check;

alter table public.admin_content_items
  add constraint admin_content_items_locale_check
    check (locale in ('ko', 'en', 'es', 'zh-CN')),
  add constraint admin_content_items_status_check
    check (status in ('draft', 'translated', 'reviewed', 'published', 'archived')),
  add constraint admin_content_items_source_locale_check
    check (source_locale in ('ko', 'en', 'es', 'zh-CN'));

update public.admin_content_items
set source_updated_at = updated_at,
    translated_from_updated_at = updated_at
where locale = 'ko'
  and (source_updated_at is null or translated_from_updated_at is null);

update public.admin_content_items target
set source_updated_at = source.updated_at
from public.admin_content_items source
where source.content_type = target.content_type
  and source.slug = target.slug
  and source.locale = 'ko'
  and target.locale <> 'ko'
  and target.source_updated_at is null;

alter table public.course_localizations
  add column if not exists source_locale text not null default 'ko',
  add column if not exists source_updated_at timestamptz,
  add column if not exists translated_from_updated_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists image_alt text;

alter table public.course_localizations
  drop constraint if exists course_localizations_locale_check,
  drop constraint if exists course_localizations_status_check,
  drop constraint if exists course_localizations_source_locale_check;

alter table public.course_localizations
  add constraint course_localizations_locale_check
    check (locale in ('ko', 'en', 'es', 'zh-CN')),
  add constraint course_localizations_status_check
    check (status in ('draft', 'translated', 'reviewed', 'published', 'archived')),
  add constraint course_localizations_source_locale_check
    check (source_locale in ('ko', 'en', 'es', 'zh-CN'));

update public.course_localizations
set source_updated_at = updated_at,
    translated_from_updated_at = updated_at
where locale = 'ko'
  and (source_updated_at is null or translated_from_updated_at is null);

update public.course_localizations target
set source_updated_at = source.updated_at
from public.course_localizations source
where source.course_id = target.course_id
  and source.locale = 'ko'
  and target.locale <> 'ko'
  and target.source_updated_at is null;

drop policy if exists "admin_content_items_insert_admin" on public.admin_content_items;
drop policy if exists "admin_content_items_update_admin" on public.admin_content_items;

create policy "admin_content_items_insert_admin"
on public.admin_content_items for insert
to authenticated
with check (
  public.has_admin_role(array['content_manager', 'course_manager', 'super_admin'])
  and (status <> 'published' or public.has_admin_role(array['super_admin']))
);

create policy "admin_content_items_update_admin"
on public.admin_content_items for update
to authenticated
using (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']))
with check (
  public.has_admin_role(array['content_manager', 'course_manager', 'super_admin'])
  and (status <> 'published' or public.has_admin_role(array['super_admin']))
);

drop policy if exists "course_localizations_insert_admin" on public.course_localizations;
drop policy if exists "course_localizations_update_admin" on public.course_localizations;

create policy "course_localizations_insert_admin"
on public.course_localizations for insert
to authenticated
with check (
  public.has_admin_role(array['content_manager', 'course_manager', 'super_admin'])
  and (status <> 'published' or public.has_admin_role(array['super_admin']))
);

create policy "course_localizations_update_admin"
on public.course_localizations for update
to authenticated
using (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']))
with check (
  public.has_admin_role(array['content_manager', 'course_manager', 'super_admin'])
  and (status <> 'published' or public.has_admin_role(array['super_admin']))
);

create index if not exists admin_content_items_translation_queue_idx
on public.admin_content_items (content_type, slug, locale, status, source_updated_at, translated_from_updated_at);

create index if not exists course_localizations_translation_queue_idx
on public.course_localizations (course_id, locale, status, source_updated_at, translated_from_updated_at);
