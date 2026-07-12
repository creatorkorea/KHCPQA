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
- 환경변수가 없을 때는 기존 검수용 프리뷰 흐름 유지
- `/[locale]/account/**`, `/admin/**` 보호 미들웨어 추가
- `profiles`, `inquiries`, `certifications` 테이블과 RLS 정책 마이그레이션 초안 추가

남은 구현:
1. Supabase 프로젝트 생성 및 환경변수 주입
2. Supabase 마이그레이션 적용 및 실제 프로젝트에서 RLS 검증
3. account/profile, inquiries, certifications 화면을 Supabase 데이터로 연결
4. 관리자 role 조회 및 `/admin/**` role 제한 강화
5. 관리자 화면에서 회원 role/status 관리 기능 추가
