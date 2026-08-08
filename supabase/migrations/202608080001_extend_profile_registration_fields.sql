alter table public.profiles
  add column if not exists phone text,
  add column if not exists interested_course text,
  add column if not exists marketing_opt_in boolean not null default false;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_marketing_opt_in boolean := false;
begin
  next_marketing_opt_in :=
    lower(coalesce(new.raw_user_meta_data ->> 'marketing_opt_in', 'false')) in ('true', '1', 'yes', 'on');

  insert into public.profiles (
    id,
    email,
    full_name,
    phone,
    country,
    interested_course,
    marketing_opt_in,
    preferred_locale,
    role
  )
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    nullif(new.raw_user_meta_data ->> 'country', ''),
    nullif(new.raw_user_meta_data ->> 'interested_course', ''),
    next_marketing_opt_in,
    coalesce(nullif(new.raw_user_meta_data ->> 'preferred_locale', ''), 'ko'),
    'user'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    phone = coalesce(public.profiles.phone, excluded.phone),
    country = coalesce(public.profiles.country, excluded.country),
    interested_course = coalesce(public.profiles.interested_course, excluded.interested_course),
    marketing_opt_in = public.profiles.marketing_opt_in or excluded.marketing_opt_in,
    preferred_locale = excluded.preferred_locale;

  return new;
end;
$$;
