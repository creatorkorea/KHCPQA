alter table public.admin_content_items
add column if not exists image_url text;

alter table public.banners
add column if not exists image_url text;
