# Deployment Handoff

현재 작업 환경에서는 외부 호스팅 서비스로 프로젝트를 직접 업로드하는 배포 작업이 정책상 차단되어 있다. 대신 운영자는 GitHub에 푸시된 `main` 브랜치를 기준으로 Vercel에서 배포를 연결하면 된다.

## Repository

- GitHub: `https://github.com/creatorkorea/KHCPQA`
- Branch: `main`
- Latest verified commit: `bdfc29c`

## Vercel Project Setup

1. Vercel Dashboard에서 New Project를 선택한다.
2. GitHub repository `creatorkorea/KHCPQA`를 import한다.
3. Framework Preset은 `Next.js`로 설정한다.
4. Build Command는 기본값 `npm run build`를 사용한다.
5. Install Command는 기본값 `npm install`을 사용한다.
6. Output Directory는 비워둔다.

## Required Environment Variables

Vercel Project Settings > Environment Variables에 아래 값을 등록한다.

| Name | Scope | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production, Preview | 배포 URL 또는 운영 도메인 |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production only if needed | 서버 전용, 브라우저 노출 금지 |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Production, Preview | `ko` |
| `NEXT_PUBLIC_SUPPORTED_LOCALES` | Production, Preview | `ko,en,es` |
| `GA_MEASUREMENT_ID` | Production | 선택 |
| `GOOGLE_SITE_VERIFICATION` | Production | 선택 |
| `NAVER_SITE_VERIFICATION` | Production | 선택 |

## Supabase Auth URL Settings

Vercel Preview URL 또는 운영 도메인이 생성되면 Supabase Dashboard > Authentication > URL Configuration에 추가한다.

- Site URL: 운영 도메인 또는 대표 검수 URL
- Redirect URL: `https://배포도메인/auth/callback`

Preview URL로 회원가입/로그인 검수를 진행할 경우 해당 Preview URL의 `/auth/callback`도 Redirect URL에 추가한다.

## Pre-Review Verification

배포 완료 후 아래를 확인한다.

- `/ko`, `/en`, `/es` 접속
- `/ko/curriculum`에서 과정 상세 페이지 진입
- `/ko/partner-inquiry` 문의 제출 후 관리자 문의함 확인
- `/ko/login` 로그인
- `/ko/account/certifications` 자격 조회
- `/admin` 비로그인 접근 시 로그인 리다이렉트
- `/sitemap.xml`
- `/robots.txt`

## Known Remaining Client Inputs

- 도메인, 호스팅, SSL 계정 명의 확정
- 개인정보처리방침과 이용약관 원문
- 기존 SMC365 이미지와 콘텐츠 사용 권리
- 전체 실운영 콘텐츠 `source_url`
- 실제 자격 데이터 샘플
