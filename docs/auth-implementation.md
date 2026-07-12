# Auth Implementation

## 가입 정책

회원가입 방식은 공개 가입으로 확정한다.

- 사용자는 관리자 승인 없이 직접 회원가입할 수 있다.
- 이메일/비밀번호 기반 가입을 기본으로 한다.
- 가입 후 로그인 세션이 생성되면 `/[locale]/account` 영역을 이용할 수 있다.
- 관리자 권한은 공개 가입으로 부여하지 않고, 관리자 화면에서 별도 role로 관리한다.

## Supabase Auth 연결 기준

필수 환경변수:

| 변수 | 용도 | 노출 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | 클라이언트 가능 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | 클라이언트 가능 |
| `SUPABASE_SERVICE_ROLE_KEY` | 관리자 서버 작업 | 서버 전용 |

주의:
- `SUPABASE_SERVICE_ROLE_KEY`는 브라우저 번들에 포함되면 안 된다.
- 공개 가입이어도 관리자 role은 클라이언트에서 직접 설정하지 않는다.
- 프로필 생성, 자격 조회, 문의 내역 조회는 로그인 사용자 ID 기준으로 제한한다.

Supabase Auth URL 설정:
- Site URL: 배포 도메인 또는 로컬 개발 주소
- Redirect URLs: `https://도메인/auth/callback`, `http://localhost:3000/auth/callback`
- 이메일 확인을 켠 경우 확인 링크는 `/auth/callback?next=/[locale]/account`로 돌아와 세션 쿠키를 생성한다.

마이그레이션 적용 순서와 검증 SQL은 `docs/supabase-migration-runbook.md`를 따른다.

## 가입 흐름

1. 사용자가 `/[locale]/signup`에서 이름, 이메일, 국가, 비밀번호, 동의 여부를 입력한다.
2. Supabase Auth `signUp`으로 계정을 생성한다.
3. `users` 또는 `profiles` 테이블에 `id`, `name`, `email`, `country`, `preferred_locale`, `role=user`를 저장한다.
4. 이메일 확인 정책을 사용할 경우 확인 전 안내 상태를 표시한다.
5. 세션이 있으면 `/[locale]/account`로 이동한다.

## 로그인 흐름

1. 사용자가 `/[locale]/login`에서 이메일과 비밀번호를 입력한다.
2. Supabase Auth `signInWithPassword`로 세션을 생성한다.
3. 성공 시 `/[locale]/account`로 이동한다.
4. 실패 시 언어별 오류 메시지를 표시한다.

## 보호 라우트

사용자 영역:
- `/ko/account`
- `/en/account`
- `/es/account`
- `/[locale]/account/profile`
- `/[locale]/account/certifications`
- `/[locale]/account/inquiries`

관리자 영역:
- `/admin`
- 추후 `/admin/**`

보호 기준:
- 사용자 영역은 로그인 세션이 필요하다.
- 관리자 영역은 로그인 세션과 관리자 role이 필요하다.
- 비로그인 접근 시 현재 locale의 `/login`으로 이동한다.

## 권한 모델

기본 가입 사용자는 항상 `user` role로 생성한다.

관리자 role:
- `viewer`
- `content_manager`
- `course_manager`
- `certification_manager`
- `inquiry_manager`
- `super_admin`

role 변경은 관리자 UI 또는 서버 전용 작업에서만 수행한다.

## 다음 구현 단위

완료:
- `@supabase/supabase-js`, `@supabase/ssr` 설치
- `src/lib/supabase/client.ts`와 `src/lib/supabase/server.ts` 추가
- 환경변수가 있을 때 signup/login/reset form이 Supabase Auth를 호출하도록 연결
- 회원가입 이메일 확인 링크를 `/auth/callback`에서 세션으로 교환하도록 연결
- 회원가입 성공 시 즉시 세션이 있으면 `/[locale]/account`로 이동하고, 이메일 확인이 필요하면 확인 안내 표시
- 환경변수가 없을 때는 기존 검수용 프리뷰 흐름 유지
- `/[locale]/account/**`, `/admin/**` 보호 미들웨어 추가
- `profiles`, `inquiries`, `certifications` 테이블과 RLS 정책 마이그레이션 초안 추가
- `/admin/**` 접근 시 `profiles.role`과 `profiles.status` 기준 관리자 role 제한 추가
- 관리자 화면에 회원 role/status 변경 검수 UI 추가
- `super_admin` 전용 회원 role/status 저장 server action 추가
- 공개 파트너 문의를 `inquiries` 테이블에 저장하는 server action과 anon insert RLS 추가
- 자격 관리자/최고 관리자용 자격 데이터 저장 server action 추가
- 문의 관리자/최고 관리자용 문의 처리 상태와 담당자 메모 저장 server action 추가
- 콘텐츠/배너 관리자 저장 테이블과 server action 추가
- 관리자 콘텐츠 목록이 `admin_content_items`와 `banners` 데이터를 읽도록 연결
- `/[locale]/about` PageIntro가 published 관리자 콘텐츠(`Page/about`)를 우선 사용하도록 연결
- `/[locale]/contact`, `/[locale]/activities`, `/[locale]/curriculum` 첫 화면 문구도 published 관리자 콘텐츠를 우선 사용하도록 연결
- 활동 카드(`Activity/[key]`)와 과정 카드(`Course/[slug]`) 제목/요약이 published 관리자 콘텐츠를 우선 사용하도록 연결
- 활동 상세와 과정 상세의 제목/요약/개요가 published 관리자 콘텐츠를 우선 사용하도록 연결
- 관리자 콘텐츠 상세 본문(`body`)을 저장하고 공개 상세 소개 문단에 우선 적용
- 활동 상세 게시글 목록이 `Activity/[key]-...` published 관리자 콘텐츠를 우선 사용하도록 연결
- 홈 첫 화면에서 published `home/global` 배너를 운영 CTA로 노출하도록 연결
- 관리자 입력 폼에서 기존 콘텐츠/배너 항목을 불러와 수정·삭제할 수 있도록 연결
- 콘텐츠/배너 저장·수정·삭제·발행 이벤트를 `admin_publish_events`에 기록하고 관리자 화면에 최근 이력 표시
- 과정 상세 고급 섹션이 `Course/[courseSlug]-flow-*`, `Course/[courseSlug]-panel-*`, `Course/[courseSlug]-technique-*`, `Course/[courseSlug]-process-*` published 콘텐츠를 우선 사용하도록 연결
- 활동 상세 고급 섹션이 `Activity/[activityKey]-section-*` published 콘텐츠를 카드형 운영 콘텐츠로 표시하도록 연결

남은 구현:
1. Supabase 프로젝트 생성 및 환경변수 주입
2. Supabase 마이그레이션 적용 및 실제 프로젝트에서 RLS 검증
3. 실제 Supabase 프로젝트에서 회원가입/이메일 확인/로그인/계정 접근 E2E 검증
4. 공개 상세 페이지 CMS 섹션 입력 가이드와 샘플 데이터 정리
5. 관리자 발행 이력 상세 필터와 작업자 이름 표시 개선
