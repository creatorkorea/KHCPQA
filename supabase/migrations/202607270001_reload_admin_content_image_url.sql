alter table public.admin_content_items
add column if not exists image_url text;

comment on column public.admin_content_items.image_url
is 'Representative image or thumbnail URL for admin-managed content items.';

notify pgrst, 'reload schema';
