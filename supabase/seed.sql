insert into public.admin_content_items (
  content_type,
  locale,
  slug,
  title,
  status,
  source_url,
  summary,
  body
)
values
  (
    'Page',
    'ko',
    'about',
    '한국건강관리사자격협회 소개',
    'published',
    'https://www.smc365.ac/academy/academy01.asp',
    '기존 협회 소개 콘텐츠를 글로벌 사이트 구조에 맞춰 정리한 검수용 항목입니다.',
    '한국건강관리사자격협회는 전문 교육, 자격 관리, 현장 중심 실무 역량 강화를 연결하는 교육 운영 체계를 제공합니다.'
  ),
  (
    'Page',
    'ko',
    'contact',
    '오시는 길',
    'published',
    'https://www.smc365.ac/academy/academy06.asp',
    '서울본부, SMC아카데미, 대림캠퍼스 연락처와 교통 안내 검수용 항목입니다.',
    '서울본부와 캠퍼스별 주소, 연락처, 지하철·버스·주차 안내를 운영 콘텐츠로 관리합니다.'
  ),
  (
    'Course',
    'ko',
    '피부미용사-국가자격증',
    '피부미용사 국가자격증',
    'published',
    'https://www.smc365.ac/curriculum/skin-national-certification.asp',
    '피부미용사 국가자격증 과정의 소개와 실기·필기 준비 흐름을 정리한 샘플입니다.',
    '국가기술자격 취득을 목표로 이론, 실기, 고객 응대, 현장 준비 과정을 함께 다루는 대표 자격 과정입니다.'
  ),
  (
    'Activity',
    'ko',
    'notice',
    '공지/시험일정',
    'published',
    'https://www.smc365.ac/index.asp',
    '공지와 시험일정 게시판 이관을 위한 샘플 운영 콘텐츠입니다.',
    '관리자는 시험일정, 모집 안내, 검수 공지를 등록하고 공개 상태를 관리합니다.'
  )
on conflict (content_type, locale, slug) do update
set
  title = excluded.title,
  status = excluded.status,
  source_url = excluded.source_url,
  summary = excluded.summary,
  body = excluded.body;

insert into public.banners (
  title,
  placement,
  status,
  starts_at,
  ends_at,
  target_url
)
select
  '해외 파트너 상담 접수 중',
  'home',
  'published',
  current_date,
  current_date + interval '30 days',
  '/ko/partner-inquiry'
where not exists (
  select 1
  from public.banners
  where title = '해외 파트너 상담 접수 중'
    and placement = 'home'
);

insert into public.inquiries (
  inquiry_type,
  locale,
  name,
  organization,
  email,
  phone,
  country,
  message,
  status
)
select
  'partnership',
  'ko',
  'KHCPQA Demo Partner',
  'Global Wellness Institute',
  'partner@example.com',
  '+82-10-0000-0000',
  'Korea',
  '해외 교육기관 제휴 가능성과 커리큘럼 운영 조건을 문의합니다.',
  'new'
where not exists (
  select 1
  from public.inquiries
  where email = 'partner@example.com'
    and organization = 'Global Wellness Institute'
);

do $$
declare
  demo_user_id uuid;
begin
  select id
  into demo_user_id
  from public.profiles
  where email = 'member@example.com'
  limit 1;

  if demo_user_id is not null then
    insert into public.certifications (
      user_id,
      course_title,
      certificate_number,
      issued_at,
      status,
      verification_code
    )
    values
      (
        demo_user_id,
        '피부미용사 국가자격증',
        'SMC-2026-001',
        date '2026-05-18',
        'issued',
        'PUBLIC-CODE-001'
      ),
      (
        demo_user_id,
        '아로마 테라피',
        'SMC-2026-014',
        date '2026-06-21',
        'issued',
        'PUBLIC-CODE-014'
      )
    on conflict (certificate_number) do update
    set
      course_title = excluded.course_title,
      issued_at = excluded.issued_at,
      status = excluded.status,
      verification_code = excluded.verification_code,
      user_id = excluded.user_id;
  end if;
end $$;
