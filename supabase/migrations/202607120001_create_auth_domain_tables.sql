create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  country text,
  preferred_locale text not null default 'ko'
    check (preferred_locale in ('ko', 'en', 'es')),
  role text not null default 'user'
    check (
      role in (
        'user',
        'viewer',
        'content_manager',
        'course_manager',
        'certification_manager',
        'inquiry_manager',
        'super_admin'
      )
    ),
  status text not null default 'active'
    check (status in ('active', 'suspended', 'deleted')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.has_admin_role(required_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and status = 'active'
      and role = any(required_roles)
  );
$$;

revoke all on function public.has_admin_role(text[]) from public;
grant execute on function public.has_admin_role(text[]) to authenticated;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    country,
    preferred_locale,
    role
  )
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'country', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'preferred_locale', ''), 'ko'),
    'user'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    country = coalesce(public.profiles.country, excluded.country),
    preferred_locale = excluded.preferred_locale;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;

create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  inquiry_type text not null default 'general'
    check (inquiry_type in ('general', 'course', 'certification', 'partnership')),
  locale text not null default 'ko'
    check (locale in ('ko', 'en', 'es')),
  name text not null,
  organization text,
  email text not null,
  phone text,
  country text,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'in_review', 'answered', 'closed')),
  manager_note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists inquiries_user_id_created_at_idx
on public.inquiries (user_id, created_at desc);

create trigger set_inquiries_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_title text not null,
  certificate_number text not null unique,
  issued_at date not null,
  expires_at date,
  status text not null default 'issued'
    check (status in ('issued', 'expired', 'revoked')),
  verification_code text not null unique,
  admin_note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists certifications_user_id_issued_at_idx
on public.certifications (user_id, issued_at desc);

create trigger set_certifications_updated_at
before update on public.certifications
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.inquiries enable row level security;
alter table public.certifications enable row level security;

create policy "profiles_select_self_or_admin"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.has_admin_role(array['viewer', 'super_admin'])
);

create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (id = auth.uid() and role = 'user' and status = 'active')
with check (id = auth.uid() and role = 'user' and status = 'active');

create policy "profiles_update_admin"
on public.profiles
for update
to authenticated
using (public.has_admin_role(array['super_admin']))
with check (public.has_admin_role(array['super_admin']));

create policy "inquiries_insert_self"
on public.inquiries
for insert
to authenticated
with check (user_id = auth.uid());

create policy "inquiries_select_self_or_manager"
on public.inquiries
for select
to authenticated
using (
  user_id = auth.uid()
  or public.has_admin_role(array['inquiry_manager', 'super_admin'])
);

create policy "inquiries_update_manager"
on public.inquiries
for update
to authenticated
using (public.has_admin_role(array['inquiry_manager', 'super_admin']))
with check (public.has_admin_role(array['inquiry_manager', 'super_admin']));

create policy "certifications_select_self_or_manager"
on public.certifications
for select
to authenticated
using (
  user_id = auth.uid()
  or public.has_admin_role(array['certification_manager', 'super_admin'])
);

create policy "certifications_insert_manager"
on public.certifications
for insert
to authenticated
with check (public.has_admin_role(array['certification_manager', 'super_admin']));

create policy "certifications_update_manager"
on public.certifications
for update
to authenticated
using (public.has_admin_role(array['certification_manager', 'super_admin']))
with check (public.has_admin_role(array['certification_manager', 'super_admin']));
