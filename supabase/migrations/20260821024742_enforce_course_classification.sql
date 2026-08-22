alter table public.courses
  drop constraint if exists courses_category_template_pair_check;

alter table public.courses
  add constraint courses_category_template_pair_check
  check (
    (category_key = 'certification' and template_key = 'certification')
    or (category_key = 'professional' and template_key in ('career', 'startup', 'hobby'))
    or (category_key = 'practical' and template_key in ('practical', 'instructor'))
  );
