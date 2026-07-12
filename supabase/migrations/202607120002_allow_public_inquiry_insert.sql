grant insert on public.inquiries to anon;

create policy "inquiries_insert_public"
on public.inquiries
for insert
to anon
with check (
  user_id is null
  and status = 'new'
  and manager_note is null
);
