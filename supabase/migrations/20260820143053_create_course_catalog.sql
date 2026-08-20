create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_key text not null
    check (category_key in ('certification', 'professional', 'practical')),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.course_localizations (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  locale text not null check (locale in ('ko', 'en', 'es')),
  title text not null,
  summary text,
  overview text,
  duration text,
  curriculum_items text[] not null default '{}',
  recommended_for text[] not null default '{}',
  certification_note text,
  image_url text,
  pdf_url text,
  pdf_file_name text,
  status text not null default 'draft'
    check (status in ('draft', 'reviewed', 'published', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (course_id, locale)
);

create index if not exists courses_active_sort_idx
on public.courses (is_active, sort_order, created_at);

create index if not exists course_localizations_locale_status_idx
on public.course_localizations (locale, status, course_id);

create trigger set_courses_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

create trigger set_course_localizations_updated_at
before update on public.course_localizations
for each row execute function public.set_updated_at();

alter table public.courses enable row level security;
alter table public.course_localizations enable row level security;

grant select on public.courses to anon, authenticated;
grant select on public.course_localizations to anon, authenticated;
grant insert, update, delete on public.courses to authenticated;
grant insert, update, delete on public.course_localizations to authenticated;

create policy "courses_select_public_active"
on public.courses for select
to anon, authenticated
using (is_active = true);

create policy "courses_select_admin"
on public.courses for select
to authenticated
using (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']));

create policy "courses_insert_admin"
on public.courses for insert
to authenticated
with check (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']));

create policy "courses_update_admin"
on public.courses for update
to authenticated
using (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']))
with check (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']));

create policy "courses_delete_admin"
on public.courses for delete
to authenticated
using (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']));

create policy "course_localizations_select_public_published"
on public.course_localizations for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1 from public.courses
    where courses.id = course_localizations.course_id
      and courses.is_active = true
  )
);

create policy "course_localizations_select_admin"
on public.course_localizations for select
to authenticated
using (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']));

create policy "course_localizations_insert_admin"
on public.course_localizations for insert
to authenticated
with check (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']));

create policy "course_localizations_update_admin"
on public.course_localizations for update
to authenticated
using (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']))
with check (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']));

create policy "course_localizations_delete_admin"
on public.course_localizations for delete
to authenticated
using (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']));
