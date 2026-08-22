alter table public.courses
  add column if not exists template_key text not null default 'practical';

alter table public.courses
  drop constraint if exists courses_template_key_check;

alter table public.courses
  add constraint courses_template_key_check
  check (template_key in ('certification', 'practical', 'career', 'startup', 'hobby', 'instructor'));

alter table public.course_localizations
  add column if not exists schedule_tracks jsonb not null default '[]'::jsonb,
  add column if not exists content_sections jsonb not null default '[]'::jsonb,
  add column if not exists content_schema_version integer not null default 1;

alter table public.course_localizations
  drop constraint if exists course_localizations_schedule_tracks_array_check,
  drop constraint if exists course_localizations_content_sections_array_check,
  drop constraint if exists course_localizations_content_schema_version_check;

alter table public.course_localizations
  add constraint course_localizations_schedule_tracks_array_check
    check (jsonb_typeof(schedule_tracks) = 'array'),
  add constraint course_localizations_content_sections_array_check
    check (jsonb_typeof(content_sections) = 'array'),
  add constraint course_localizations_content_schema_version_check
    check (content_schema_version >= 1);

update public.courses
set template_key = case
  when category_key = 'certification' then 'certification'
  when slug = '취업전문과정' then 'career'
  when slug = '창업전문과정' then 'startup'
  when slug = '주말반-취미반' or slug = '주말반/취미반' then 'hobby'
  else 'practical'
end;
