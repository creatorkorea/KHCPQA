create table if not exists public.admin_content_items (
  id uuid primary key default gen_random_uuid(),
  content_type text not null
    check (content_type in ('Page', 'Course', 'Activity', 'Review')),
  locale text not null
    check (locale in ('ko', 'en', 'es')),
  slug text not null,
  title text not null,
  status text not null default 'draft'
    check (status in ('draft', 'translated', 'reviewed', 'published', 'archived')),
  source_url text,
  summary text,
  body text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists admin_content_items_type_locale_status_idx
on public.admin_content_items (content_type, locale, status);

create unique index if not exists admin_content_items_type_locale_slug_idx
on public.admin_content_items (content_type, locale, slug);

create trigger set_admin_content_items_updated_at
before update on public.admin_content_items
for each row execute function public.set_updated_at();

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  placement text not null
    check (placement in ('home', 'curriculum', 'activities', 'global')),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  starts_at date,
  ends_at date,
  target_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_publish_events (
  id uuid primary key default gen_random_uuid(),
  item_type text not null
    check (item_type in ('content', 'banner')),
  item_id uuid,
  action text not null
    check (action in ('created', 'updated', 'deleted', 'published', 'archived')),
  title text not null,
  status text not null,
  actor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists banners_placement_status_idx
on public.banners (placement, status);

create index if not exists admin_publish_events_item_idx
on public.admin_publish_events (item_type, item_id, created_at desc);

create index if not exists admin_publish_events_created_at_idx
on public.admin_publish_events (created_at desc);

create trigger set_banners_updated_at
before update on public.banners
for each row execute function public.set_updated_at();

alter table public.admin_content_items enable row level security;
alter table public.banners enable row level security;
alter table public.admin_publish_events enable row level security;

create policy "admin_content_items_select_admin"
on public.admin_content_items
for select
to authenticated
using (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']));

create policy "admin_content_items_select_published"
on public.admin_content_items
for select
to anon, authenticated
using (status = 'published');

create policy "admin_content_items_insert_admin"
on public.admin_content_items
for insert
to authenticated
with check (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']));

create policy "admin_content_items_update_admin"
on public.admin_content_items
for update
to authenticated
using (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']))
with check (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']));

create policy "admin_content_items_delete_admin"
on public.admin_content_items
for delete
to authenticated
using (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']));

create policy "banners_select_admin"
on public.banners
for select
to authenticated
using (public.has_admin_role(array['content_manager', 'super_admin']));

create policy "banners_select_published"
on public.banners
for select
to anon, authenticated
using (status = 'published');

create policy "banners_insert_admin"
on public.banners
for insert
to authenticated
with check (public.has_admin_role(array['content_manager', 'super_admin']));

create policy "banners_update_admin"
on public.banners
for update
to authenticated
using (public.has_admin_role(array['content_manager', 'super_admin']))
with check (public.has_admin_role(array['content_manager', 'super_admin']));

create policy "banners_delete_admin"
on public.banners
for delete
to authenticated
using (public.has_admin_role(array['content_manager', 'super_admin']));

create policy "admin_publish_events_select_admin"
on public.admin_publish_events
for select
to authenticated
using (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']));

create policy "admin_publish_events_insert_admin"
on public.admin_publish_events
for insert
to authenticated
with check (public.has_admin_role(array['content_manager', 'course_manager', 'super_admin']));
