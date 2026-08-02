alter table public.admin_content_items
add column if not exists author_name text not null default '관리자',
add column if not exists view_count integer not null default 0
  check (view_count >= 0);

create or replace function public.increment_admin_content_item_view_count(
  item_locale text,
  item_slug text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.admin_content_items
  set view_count = view_count + 1
  where content_type = 'Activity'
    and locale = item_locale
    and slug = item_slug
    and status = 'published';
end;
$$;

grant execute on function public.increment_admin_content_item_view_count(text, text) to anon, authenticated;
