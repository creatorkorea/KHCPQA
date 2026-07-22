# Data Import Runbook

이 문서는 발주사로부터 받은 운영 CSV를 Supabase에 반영할 때 사용하는 절차다. 실제 개인정보와 자격 데이터는 발주사 책임 하에 검수된 파일만 사용한다.

## Input Files

| 데이터 | 템플릿 | 대상 테이블 |
| --- | --- | --- |
| 자격 데이터 | `docs/templates/certification-data-template.csv` | `public.profiles`, `public.certifications` |
| 관리자 계정 | `docs/templates/admin-users-template.csv` | `public.profiles` |
| 콘텐츠 출처 URL | `docs/templates/content-source-url-template.csv` | `public.admin_content_items` |
| 자산 권리 | `docs/templates/asset-rights-template.csv` | 문서 검수용, DB 직접 import 대상 아님 |

## Certification Data Import

필수 컬럼:

- `email`
- `full_name`
- `country`
- `course_title`
- `certificate_number`
- `issued_at`
- `status`
- `verification_code`

권장 절차:

1. Supabase Auth에 대상 회원이 존재하는지 확인한다.
2. 회원이 없으면 회원가입 또는 관리자 생성 절차로 계정을 먼저 만든다.
3. `public.profiles.email`과 CSV `email`이 일치하는지 확인한다.
4. `certificate_number`와 `verification_code`가 중복되지 않는지 확인한다.
5. `certifications`에 upsert한다.

검증 SQL:

```sql
select p.email, c.course_title, c.certificate_number, c.issued_at, c.status
from public.certifications c
join public.profiles p on p.id = c.user_id
order by c.issued_at desc;
```

## Admin User Role Setup

역할 값:

- `user`
- `viewer`
- `content_manager`
- `course_manager`
- `certification_manager`
- `inquiry_manager`
- `super_admin`

상태 값:

- `active`
- `suspended`
- `deleted`

관리자 권한 부여 전 확인:

- 이메일 소유자 확인
- 최소 권한 원칙 적용
- `super_admin`은 1-2명으로 제한
- 퇴사/외주 종료 시 `suspended` 처리

검증 SQL:

```sql
select email, full_name, role, status, updated_at
from public.profiles
where role <> 'user'
order by role, email;
```

## Content Source URL / Image URL Update

CSV의 `content_type`, `locale`, `slug` 조합은 CMS의 고유 키와 일치해야 한다.
대표 이미지가 있는 항목은 `image_url`에 공개 접근 가능한 `/assets/...` 경로 또는 `https://...` URL을 입력한다.

검증 SQL:

```sql
select content_type, locale, slug, title, source_url, image_url
from public.admin_content_items
where source_url is null or source_url = ''
order by content_type, locale, slug;
```

위 쿼리가 0건이면 현재 CMS 등록 콘텐츠의 출처 URL 입력은 완료된 상태다.

## Safety Rules

- 서비스 롤 키를 CSV, 문서, 채팅에 붙여넣지 않는다.
- 실제 주민등록번호, 여권번호, 민감정보는 import하지 않는다.
- 검증 전 자격 데이터를 production에 대량 반영하지 않는다.
- import 전 CSV 원본을 발주사 승인본으로 보관한다.
- import 후 표본 회원으로 로그인해 자격 조회 화면을 확인한다.
