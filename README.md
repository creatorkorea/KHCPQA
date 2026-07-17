# KHCPQA Global Web App

KHCPQA 글로벌 웹사이트/앱 1차 개발본이다. 한국어, 영어, 스페인어 공개 사이트와 회원 영역, 자격 조회, 관리자 CMS, Supabase 연동 구조를 포함한다.

## Current Status

- 구현/검증 기준: 1차 개발 완료 상태
- GitHub branch: `main`
- Framework: Next.js 14
- Backend: Supabase Auth/Postgres/RLS
- Deployment handoff: `docs/deployment-handoff.md`
- Launch readiness index: `docs/launch-readiness.md`

## Local Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run qa:ops
```

`npm run qa:ops`는 `QA_BASE_URL` 또는 `NEXT_PUBLIC_SITE_URL`을 기준으로 주요 공개 라우트, 보호 라우트 응답, Supabase 공개 연결 상태를 점검한다.

## Implemented Scope

- `/ko`, `/en`, `/es` 다국어 라우팅
- 홈, 협회 소개, 과정 목록/상세, 활동/커뮤니티, Contact
- 회원가입, 로그인, 비밀번호 찾기
- My Page, Profile, Certification Inquiry
- 파트너 문의 제출
- 관리자 대시보드
- 관리자 콘텐츠 CRUD, 문의 관리, 자격 데이터 관리, 배너 관리
- Supabase 마이그레이션과 RLS 정책
- SEO metadata, `hreflang`, `sitemap.xml`, `robots.txt`
- 모바일 375px, 태블릿 768px, 데스크톱 QA

## Key Documents

| Document | Purpose |
| --- | --- |
| `docs/checklist.md` | 전체 개발/오픈 체크리스트 |
| `docs/qa-release.md` | QA 결과와 릴리즈 기준 |
| `docs/launch-readiness.md` | 검수/오픈 준비 인덱스 |
| `docs/deployment-handoff.md` | Vercel 배포 인계 절차 |
| `docs/operations-qa-checklist.md` | 운영 배포/Auth/법무/SNS/실기기 검수 순서 |
| `docs/client-action-items.md` | 발주사/운영자 액션 아이템 |
| `docs/client-review-request.md` | 발주사 검수 요청 범위 |
| `docs/scope-confirmation.md` | 1차 포함/제외 범위 확인 |
| `docs/data-import-runbook.md` | 운영 데이터 import 절차 |
| `docs/supabase-migration-runbook.md` | Supabase 마이그레이션/검증 절차 |
| `docs/source-url-inventory.md` | SMC365 출처 URL 현황 |
| `docs/cms-section-guide.md` | 관리자 CMS 입력 규칙 |

## GitHub Issue Templates

Use the issue templates in `.github/ISSUE_TEMPLATE` to track launch blockers:

- Client approval / external decision
- Deployment / review URL
- Content / data import

## Client Input Templates

| Template | Purpose |
| --- | --- |
| `docs/templates/certification-data-template.csv` | 자격 데이터 샘플 |
| `docs/templates/admin-users-template.csv` | 초기 관리자 목록 |
| `docs/templates/content-source-url-template.csv` | 콘텐츠별 원본 URL |
| `docs/templates/asset-rights-template.csv` | 이미지/로고/보도자료 권리 확인 |
| `docs/templates/legal-policy-request.md` | 개인정보처리방침/이용약관 원문 요청 |
| `docs/templates/client-approval-form.md` | 발주사 최종 승인 양식 |
| `docs/templates/review-feedback-template.csv` | 검수 수정 요청 목록 |

## Required Environment Variables

Use `.env.example` as the source template.

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_DEFAULT_LOCALE=ko
NEXT_PUBLIC_SUPPORTED_LOCALES=ko,en,es
GA_MEASUREMENT_ID=
GOOGLE_SITE_VERIFICATION=
NAVER_SITE_VERIFICATION=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed to browser code.

## Remaining External Decisions

- 계약 범위와 제외 범위 최종 승인
- SMC365 콘텐츠/이미지/후기/보도자료/강사 사진 사용 권리 승인
- 도메인, 호스팅, SSL 계정 명의 확정
- 개인정보처리방침과 이용약관 최종 원문 제공
- 실제 자격 데이터 샘플 제공
- 전체 실운영 콘텐츠 `source_url` 확정
- 운영자가 Vercel 배포 후 검수 URL 공유

## Deployment

Direct deployment from this workspace may be blocked by environment policy. Use `docs/deployment-handoff.md` to connect GitHub `main` to Vercel, configure environment variables, and register Supabase Auth redirect URLs.
