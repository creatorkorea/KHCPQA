# KHCPQA 글로벌 웹앱 개발 기획서

작성일: 2026-07-05  
프로젝트명: KHCPQA 글로벌 홈페이지 및 웹앱형 플랫폼 구축  
기준 문서:
- `6_23_KHCPQA_Global_Website_App_Blueprint_KO_Revised_EN_ES.docx`
- `260704_홈페이지 제작 계약서.pdf`
- 기존 콘텐츠 출처: https://www.smc365.ac/index.asp

## 1. 프로젝트 개요

본 프로젝트는 기존 SMC아카데미/한국건강관리사자격협회 사이트의 콘텐츠를 기반으로, KHCPQA를 국제 협회 및 글로벌 교육기관으로 재정비하는 반응형 웹앱형 플랫폼을 구축하는 것이다.

새 사이트는 기존 `smc365.ac`의 협회 소개, 과정, 후기, 공지, 합격 현황, 갤러리, 심사위원/수상경력, 국제미용대회, 방송/언론, 봉사활동, 취업/창업 콘텐츠를 가져오되, 글로벌 사용자에게 맞는 정보 구조와 디자인 언어로 재구성한다.

핵심 방향은 다음과 같다.

- 국제 협회형 브랜드 이미지 구축
- 한국어, 영어, 스페인어 3개 국어 콘텐츠 구조 지원
- 모바일 우선 반응형 웹앱 UI
- 로그인 후 My Page 및 자격 취득 조회 제공
- 관리자 페이지에서 콘텐츠와 자격 데이터를 관리
- 공개 사이트와 로그인 후 개인 영역을 명확히 분리
- 기존 사이트 콘텐츠를 CMS 데이터로 이관 가능한 구조 설계

## 2. 개발 기준과 우선순위

### 2.1 계약 기준

계약서상 제작 범위는 기획서 전체 아이디어가 아니라 계약서 본문 및 별첨 A, B, C, D에 명시된 범위로 한정한다.

포함 범위:
- 반응형 홈페이지
- 모바일 우선 UX
- 화이트 + 그린 기관형 디자인 시스템
- 한국어, 영어, 스페인어 3개 국어 페이지 구성
- 협회 소개 페이지
- 과정 목록 및 과정 상세 템플릿
- 커뮤니티 목록 및 상세 관리 구조
- 회원가입, 로그인, 비밀번호 찾기
- 회원정보 수정
- My Page
- 자격 취득 조회
- 관리자 페이지
- 공지사항, 문의, 팝업, 배너, 회원, 게시글, 자격 데이터 관리
- 호스팅 환경 배포 및 검수 URL 제공

제외 또는 별도 견적 범위:
- PG 결제
- 문자/카카오 알림
- 실시간 채팅
- 외부 CRM/ERP 연동
- 네이티브 iOS/Android 앱
- 앱스토어 등록
- 푸시 알림
- 고급 통계 대시보드
- GA4/Search Console 운영 대행
- 대량 데이터 정제
- 엑셀 업로드 자동화
- 기존 시스템 마이그레이션 자동화
- 전문 법률 검토
- 개인정보 영향평가
- 보안 컨설팅
- 촬영, 영상 제작
- 유료 이미지, 폰트, 플러그인 구매
- 증명서 자동 발급
- 자동 번역 시스템
- 전문 번역 감수

### 2.2 콘텐츠 기준

모든 원천 콘텐츠는 기존 사이트 `https://www.smc365.ac/index.asp` 및 내부 링크에서 가져온다.

콘텐츠 이관 방식:
- 기존 페이지의 텍스트, 이미지, 게시글, 과정명, 연락처, 주소, 후기, 합격 현황, 갤러리 자료를 신규 CMS 구조에 맞게 재분류한다.
- 기존 문구를 그대로 복사하는 것을 기본으로 하되, 글로벌 사이트의 첫 화면과 주요 CTA 문구는 블루프린트의 영어/스페인어 방향에 맞게 재작성한다.
- 영어/스페인어 콘텐츠는 번역 초안을 제공하되, 최종 감수는 발주사 확인 사항으로 둔다.
- 법적·의료적 효능, 자격 공신력, 인증기관 표현은 확인되지 않은 확대 표현을 사용하지 않는다.

## 3. 목표 사용자

| 사용자 | 목적 | 주요 기능 |
| --- | --- | --- |
| 해외 파트너 기관 | 협회 신뢰도와 협업 가능성 확인 | 협회 소개, 글로벌 활동, 파트너 문의 |
| 국내외 교육생 | 과정 정보 확인 및 문의 | 과정 목록, 과정 상세, 문의, 후기 |
| 자격 취득자 | 취득 내역 확인 | 로그인, My Page, 자격 취득 조회 |
| 강사/심사위원 | 대외 프로필과 활동 확인 | 수석강사 프로필, 심사위원/수상경력, 대회 자료 |
| 내부 관리자 | 콘텐츠와 자격 데이터 운영 | 관리자 대시보드, 게시글/과정/자격/문의 관리 |

## 4. 정보 구조

### 4.1 공개 상단 메뉴

My Page는 공개 메뉴에 노출하지 않는다. 로그인 전 공개 메뉴는 아래 항목 중심으로 구성한다.

| 메뉴 | 목적 | 대표 라우트 |
| --- | --- | --- |
| About KHCPQA | 협회 소개 및 신뢰도 구축 | `/ko/about`, `/en/about`, `/es/about` |
| Curriculum | 자격 및 실무 과정 안내 | `/ko/curriculum`, `/en/curriculum`, `/es/curriculum` |
| Global Activities | 활동성과 커뮤니티 자료 | `/ko/activities`, `/en/activities`, `/es/activities` |
| Partner Inquiry | 협업 및 파트너 문의 | `/ko/partner-inquiry`, `/en/partner-inquiry`, `/es/partner-inquiry` |
| Language | 한국어/English/Español 전환 | 현재 페이지의 같은 언어 라우트 |
| Login | 로그인 진입 | `/ko/login`, `/en/login`, `/es/login` |

Contact와 오시는 길 정보는 공개 헤더 1차 메뉴에서는 제외하고, 푸터와 문의/상담 진입 흐름에서 제공한다.

### 4.2 로그인 후 메뉴

로그인 후 우측 상단 계정 메뉴 또는 모바일 계정 탭에서만 노출한다.

| 메뉴 | 목적 | 대표 라우트 |
| --- | --- | --- |
| My Page | 개인 요약 화면 | `/ko/account`, `/en/account`, `/es/account` |
| Profile | 개인정보 확인 및 수정 | `/ko/account/profile` |
| Certification Inquiry | 자격 취득 조회 | `/ko/account/certifications` |
| Inquiry History | 문의 내역 확인 | `/ko/account/inquiries` |
| Logout | 로그아웃 | 공통 기능 |

로그인 후 페이지는 모두 인증이 필요하며 검색엔진에 노출되지 않도록 `noindex` 처리한다.

## 5. 기존 SMC365 콘텐츠 매핑

### 5.1 협회 소개

기존 출처:
- `/academy/academy01.asp` 소개
- `/academy/academy02.asp` 인사말
- `/academy/academy03.asp` 수석강사 프로필
- `/academy/academy04.asp` 연혁
- `/academy/academy05.asp` 조직도
- `/academy/academy06.asp` 찾아오시는 길

신규 구조:
- `/[locale]/about`
- `/[locale]/about/greeting`
- `/[locale]/about/senior-instructors`
- `/[locale]/about/history`
- `/[locale]/about/organization`
- `/[locale]/contact`

### 5.2 커리큘럼

기존 사이트에서 확인된 과정명:
- 피부미용사 국가자격증
- 강사과정교육
- 취업전문과정
- 창업전문과정
- 주말반/취미반
- 얼굴축소경락
- 메디컬 스킨케어
- 아로마 테라피
- 경락 마사지
- 스포츠 마사지
- 발 마사지
- 산모 마사지
- 베이비 마사지
- 타이 마사지
- 카이로프랙틱
- 스웨디시
- 스파 테라피
- 브라질리언 왁싱
- 병원코디네이터

신규 구조:
- `/[locale]/curriculum`
- `/[locale]/curriculum/[courseSlug]`

과정 상세 필드:
- 과정명
- 카테고리
- 대표 이미지
- 과정 요약
- 대상자
- 교육 내용
- 취득/수료 정보
- 문의 CTA
- 기존 콘텐츠 출처 URL
- 언어별 제목/요약/본문
- 게시 상태

### 5.3 수강 후기

기존 출처:
- `review5`: 실무교육 수강생 후기
- `review1`: 자격증취득 수강생 후기
- `review2`: 선택합격자 수강생 후기
- `review3`: 필기합격 수강생 후기
- `review4`: 외국인 수강생 후기
- `review6`: 졸업 후 나도 한마디
- `review7`: 아카데미 이야기

신규 구조:
- `/[locale]/activities/reviews`
- 카테고리 필터: practical, certification, pass, written-pass, international, alumni, academy-story

### 5.4 커뮤니티 및 글로벌 활동

기존 출처:
- `notice`: 공지/시험일정
- `pass`: 합격현황/합격률
- `photo`: 포토갤러리
- `awards`: 심사위원/수상경력
- `beauty`: 국제미용대회
- `companyevent`: 대기업 초청이벤트
- `media`: 방송/언론
- `volunteer`: 봉사활동
- `qna`: 질문/답변
- `smcevent`: 이벤트

신규 구조:
- `/[locale]/activities/notices`
- `/[locale]/activities/passing-status`
- `/[locale]/activities/gallery`
- `/[locale]/activities/judges-awards`
- `/[locale]/activities/competitions`
- `/[locale]/activities/corporate-events`
- `/[locale]/activities/media`
- `/[locale]/activities/volunteer`
- `/[locale]/community/qna`
- `/[locale]/community/events`

### 5.5 취업/창업 및 외부 활동

기존 출처:
- `/employ/employ_list.asp`: 구인/구직
- `/employ/smc_coop_list.asp?view=2`: 취업/창업
- `view=3`: 아르바이트
- `view=4`: 피부/마사지
- `view=5`: 네일아트
- `view=6`: 병원
- `view=7`: 한의원
- `view=8`: 산후조리원
- `view=9`: 일본취업 & 해외취업
- `/sboard/board_list.asp?boardName=branch`: 지부모집/업무협약

신규 구조:
- `/[locale]/career`
- `/[locale]/career/jobs`
- `/[locale]/career/startup`
- `/[locale]/partner-inquiry`

계약상 필수 공개 메뉴에서는 취업/창업을 별도 대메뉴로 두지 않고, Global Activities 또는 Partner Inquiry 하위로 배치한다.

### 5.6 연락처 및 지점 정보

기존 사이트 하단에서 확인된 연락처:

| 구분 | 주소 | 연락처 |
| --- | --- | --- |
| 한국건강관리사자격협회 서울본사 | 서울시 종로구 수표로 120 내인빌딩 8층 | TEL 02-763-1271, FAX 02-747-1273, H.P 010-7712-3362 |
| SMC아카데미 본점 | 서울시 종로구 수표로 120 내인빌딩 7층 | H.P 010-6283-1206, FAX 02-747-1273 |
| 강남SMC아카데미 구로디지털단지역점 | 서울시 관악구 시흥대로 558-1 G밸리마인드 5층 505호 | TEL 02-867-2280, H.P 010-6283-1206 |
| 한국건강관리사자격협회 구로디지털단지역점 | 서울시 관악구 시흥대로 558-1 G밸리마인드 5층 503호 | TEL 02-867-2281, H.P 010-6283-1206 |
| 한국건강관리사자격협회 대림캠퍼스 | 서울시 영등포구 대림로 23길 30-1 골든타워 6층 | H.P 010-5589-9812 |

신규 사이트에서는 지점 정보를 Contact 페이지와 푸터에 노출한다.

## 6. 핵심 화면 기획

### 6.1 홈페이지

홈페이지 섹션:
1. Hero
2. 신뢰 지표 및 핵심 CTA
3. 협회 미션
4. 과정 미리보기
5. 글로벌 활동 미리보기
6. 수석강사/전문가 네트워크
7. 자격 취득 조회 안내
8. 파트너 문의 CTA
9. 최신 공지 및 활동
10. 푸터

Hero 메시지 방향:
- KO: 한국에서 시작되는 글로벌 전문 자격 교육
- EN: Global Professional Qualification Education from Korea
- ES: Educación Global de Cualificaciones Profesionales desde Corea

CTA:
- 과정 보기
- 파트너 문의
- 로그인 후 자격 조회

### 6.2 과정 목록

요구사항:
- 전체 과정 카드 목록
- 카테고리 필터
- 검색
- 모바일 1열 카드
- 데스크톱 3열 또는 4열 카드
- 각 카드에 과정명, 요약, 카테고리, CTA 표시

### 6.3 과정 상세

요구사항:
- 과정명과 대표 이미지
- 과정 개요
- 교육 대상
- 주요 교육 내용
- 수료/자격 관련 안내
- 문의 CTA
- 관련 후기 또는 활동 콘텐츠
- 관리자에서 언어별 수정 가능

### 6.4 Global Activities

요구사항:
- 공지/시험일정
- 합격현황/합격률
- 포토갤러리
- 심사위원/수상경력
- 국제미용대회
- 대기업 초청이벤트
- 방송/언론
- 봉사활동
- 수강생 후기

게시글 목록은 카테고리, 썸네일, 제목, 날짜, 언어 상태를 지원한다.

### 6.5 Partner Inquiry

요구사항:
- 파트너 기관 문의 폼
- 교육생 문의 폼과 구분
- 이름, 기관명, 국가, 이메일, 연락처, 관심 분야, 메시지 입력
- 개인정보 동의 체크
- 제출 후 관리자 문의함에 저장

문자/카카오 알림, 이메일 발송 연동은 계약 범위 밖이므로 1차에서는 관리자 문의함 저장까지만 필수로 한다.

### 6.6 Login / My Page

로그인 전:
- Login / Register만 표시
- 공개 메뉴에 My Page 노출 금지

로그인 후:
- 계정 메뉴 표시
- My Page, Profile, Certification Inquiry, Inquiry History, Logout 제공

My Page 구성:
- 사용자 이름
- 선호 언어
- 최근 자격 조회 결과
- 문의 내역 바로가기
- 프로필 수정 바로가기

### 6.7 자격 취득 조회

요구사항:
- 로그인 사용자는 본인 자격 취득 내역 조회
- 관리자 등록 데이터 기준으로 과정명, 자격번호, 발급일, 상태 표시
- 공개 검증 기능이 필요할 경우 별도 확정 필요
- 불필요한 개인정보 노출 금지

증명서 자동 발급은 계약 제외 항목이므로 1차에서는 제공하지 않는다.

## 7. 관리자 페이지 기획

관리자 메뉴:
- 대시보드
- 페이지 관리자
- 과정 관리자
- 커뮤니티 관리자
- 후기 관리자
- 갤러리/미디어 관리자
- 문의 관리자
- 사용자 관리자
- 자격/수료증 데이터 관리자
- 팝업/배너 관리자
- 번역 상태 관리자

### 7.1 관리자 권한

| 역할 | 권한 |
| --- | --- |
| Super Admin | 전체 관리 |
| Content Manager | 페이지, 게시글, 갤러리 관리 |
| Course Manager | 과정 콘텐츠 관리 |
| Certification Manager | 자격 데이터 관리 |
| Inquiry Manager | 문의 확인 및 상태 변경 |
| Viewer | 읽기 전용 |

### 7.2 번역 상태

모든 공개 콘텐츠는 언어별 상태를 가진다.

상태값:
- draft
- translated
- reviewed
- published
- archived

영어/스페인어 번역 초안이 없거나 검수되지 않은 경우, 해당 언어 페이지에는 “번역 준비 중” 상태를 표시하거나 비공개 처리한다.

## 8. 데이터 모델 초안

### 8.1 주요 테이블

| 테이블 | 주요 필드 |
| --- | --- |
| pages | id, slug, locale, title, body, status, translation_status, seo_title, seo_description |
| courses | id, slug, locale, title, category, summary, body, image_url, status, source_url |
| posts | id, board_type, locale, title, body, thumbnail_url, published_at, status, source_url |
| instructors | id, locale, name, title, profile, photo_url, country, specialties, display_order |
| users | id, name, email, phone, country, preferred_locale, role, created_at |
| certifications | id, user_id, course_id, certificate_number, issued_at, status, verification_code |
| inquiries | id, type, locale, name, organization, email, phone, country, message, status, created_at |
| media_assets | id, file_url, alt_text_ko, alt_text_en, alt_text_es, source_url, uploaded_at |
| banners | id, locale, title, image_url, link_url, position, status, starts_at, ends_at |

### 8.2 콘텐츠 출처 필드

기존 사이트 콘텐츠를 가져오므로 모든 주요 콘텐츠에는 `source_url`을 저장한다. 추후 저작권, 원문 대조, 재수집, 이미지 교체 작업에 필요하다.

## 9. 기술 스택

권장 스택:
- Frontend: Next.js App Router
- Styling: Tailwind CSS
- i18n: next-intl 또는 동등한 라우팅 기반 다국어 라이브러리
- Backend/Auth/DB: Supabase 또는 Firebase
- Storage: Supabase Storage 또는 Firebase Storage
- Hosting: Vercel
- Analytics: GA4, Search Console 설정만 지원. 운영 대행은 별도

라우트 구조 예시:

```txt
/ko
/ko/about
/ko/about/greeting
/ko/about/senior-instructors
/ko/about/history
/ko/about/organization
/ko/curriculum
/ko/curriculum/[courseSlug]
/ko/activities
/ko/activities/notices
/ko/activities/passing-status
/ko/activities/gallery
/ko/activities/judges-awards
/ko/activities/competitions
/ko/activities/corporate-events
/ko/activities/media
/ko/activities/volunteer
/ko/partner-inquiry
/ko/contact
/ko/login
/ko/account
/ko/account/profile
/ko/account/certifications
/admin
/admin/pages
/admin/courses
/admin/posts
/admin/inquiries
/admin/users
/admin/certifications
/admin/banners
/admin/translations
```

영어와 스페인어는 동일한 구조에서 `/en`, `/es` prefix를 사용한다.

## 10. 콘텐츠 이관 계획

### 10.1 1차 이관 대상

1차 납품에서는 기존 사이트 전체를 자동 마이그레이션하기보다 계약 범위와 검수 가능한 범위에 맞춰 우선순위를 둔다.

우선 이관:
- 협회 소개 5개 페이지
- 커리큘럼 과정 목록 및 주요 과정 상세
- 공지/시험일정
- 합격현황/합격률
- 포토갤러리
- 심사위원/수상경력
- 국제미용대회
- 방송/언론
- 봉사활동
- 주요 수강 후기
- 연락처/지점 정보

### 10.2 이관 방식

- 기존 HTML에서 텍스트와 이미지 URL을 추출한다.
- 이미지 파일은 신규 스토리지에 업로드하거나 기존 URL 참조 방식 중 하나를 선택한다.
- 이미지 저작권과 사용 권한은 발주사가 확인한다.
- 오래된 게시글은 최신순 우선으로 가져온다.
- 상세 페이지가 많은 커뮤니티 자료는 목록 페이지와 업로드 가능한 관리자 구조를 먼저 구축한다.

## 11. 반응형 UX 기준

필수 검수 해상도:
- 모바일 375px
- 태블릿 768px
- 데스크톱 1280px 이상

공통 기준:
- 본문 최소 16px
- 터치 영역 최소 44px 이상
- 스페인어 문장이 길어져도 버튼/카드에서 텍스트가 넘치지 않도록 처리
- 테이블은 모바일에서 카드형 또는 가로 스크롤로 전환
- Header의 언어 선택기는 모든 주요 화면에서 접근 가능
- My Page는 로그인 후에만 표시

## 12. SEO 기준

공개 페이지는 언어별 SEO 메타데이터를 가진다.

필수 항목:
- title
- description
- Open Graph title/description/image
- canonical
- hreflang
- sitemap.xml
- robots.txt

주의:
- 로그인 후 My Page, Profile, Certification Inquiry는 `noindex`
- 자격 데이터와 개인정보가 검색엔진에 노출되지 않도록 처리
- 검증되지 않은 국제 인증, 의료 효과, 법적 효력 표현 금지

## 13. 검수 기준

계약서 별첨 B 기준을 반영한다.

| 항목 | 합격 기준 |
| --- | --- |
| 반응형 | 모바일 375px, 태블릿 768px, 데스크톱에서 주요 화면을 읽고 버튼 사용 가능 |
| 페이지 | 계약 범위의 주요 라우트가 존재하고 404 없이 접근 가능 |
| 콘텐츠 | 발주사가 제공하거나 기존 사이트에서 가져온 최종 문구와 이미지 반영 |
| 회원/자격 조회 | 테스트 계정과 샘플 자격 데이터 기준으로 기본 흐름 작동 |
| 관리자 | 관리자 전용 접근, 주요 콘텐츠 등록/수정/목록 확인 가능 |
| 다국어 | 한국어/영어/스페인어 라우트와 언어 선택기 작동 |
| 보안 | 관리자와 My Page는 비로그인 접근 차단 |

검수 요청일로부터 7영업일 이내 승인 또는 구체적 수정 요청이 필요하다. 미응답 시 재요청 후 추가 3영업일 내 응답이 없으면 조건부 승인으로 간주한다는 계약 조건을 따른다.

## 14. 개발 일정

계약 기준 납기는 발주사의 필수 자료 제공 완료일로부터 45영업일이다.

### Phase 1. 착수 및 설계

- 기존 문서와 계약 범위 확인
- 기존 사이트 메뉴/콘텐츠 인벤토리 작성
- 데이터 모델 설계
- 디자인 토큰과 라우트 구조 확정

### Phase 2. 프론트엔드 구축

- 글로벌 레이아웃
- 홈
- 공개 메뉴
- 과정 목록/상세 템플릿
- 활동/게시판 목록/상세 템플릿
- 문의 폼
- 로그인/회원가입/비밀번호 찾기

### Phase 3. 관리자 및 데이터

- 관리자 대시보드
- 페이지/과정/게시글 CRUD
- 문의 관리
- 사용자 관리
- 자격 데이터 관리
- 팝업/배너 관리

### Phase 4. 콘텐츠 이관

- 기존 사이트 콘텐츠 수집
- 우선 콘텐츠 등록
- 이미지/썸네일 정리
- 언어별 초안 등록

### Phase 5. QA 및 배포

- 반응형 QA
- 언어 전환 QA
- 로그인/권한 QA
- 자격 조회 QA
- SEO 메타 QA
- 검수 URL 제공

## 15. 오픈 전 체크리스트

- 공개 메뉴에 My Page가 노출되지 않는다.
- 로그인 후 계정 메뉴에서 My Page와 Certification Inquiry가 표시된다.
- `/ko`, `/en`, `/es` 라우트가 작동한다.
- 기존 SMC365 주요 콘텐츠가 신규 구조에 맞게 반영되어 있다.
- 과정 목록에 주요 과정이 표시된다.
- 관리자에서 콘텐츠를 수정할 수 있다.
- 문의 폼 제출 데이터가 관리자에 저장된다.
- 자격 조회 샘플 데이터가 정상 표시된다.
- 개인정보처리방침과 이용약관 페이지가 존재한다.
- 도메인, 호스팅, SSL 비용과 계정 명의가 확정되어 있다.
- 검색엔진에 비공개 페이지가 노출되지 않는다.

## 16. 주요 리스크 및 확인 필요 사항

1. 한국어 포함 여부  
   블루프린트는 영어/스페인어 중심이나 계약서는 한국어·영어·스페인어 3개 국어를 명시한다. 최종 언어 범위를 3개 국어로 확정한다.

2. 콘텐츠 권리  
   기존 사이트의 이미지, 강사 사진, 후기, 보도자료, 로고 사용 권리는 발주사가 확인해야 한다.

3. 번역 품질  
   영어/스페인어는 초안 제공 가능하나 전문 감수는 계약 제외 항목이다. 최종 공개 전 발주사 검수가 필요하다.

4. 상세 페이지 수량  
   계약서 별첨 D에는 상세 페이지 약 783개가 언급된다. 1차에서는 관리자 구조와 주요 콘텐츠 이관을 우선하고, 모든 상세 콘텐츠 수동 정리는 별도 일정 확인이 필요하다.

5. 자격 데이터  
   실제 자격 데이터의 정확성, 적법성, 개인정보 처리 책임은 발주사에 있다.

6. 유지보수  
   제작 후 수정/운영 지원은 별도 유지보수 계약 또는 건별 견적에 따른다.

## 17. 개발자 전달 요약

기존 `smc365.ac`의 콘텐츠를 원천으로 사용하여 KHCPQA 글로벌 웹앱을 구축한다. 공개 사이트는 국제 협회형 브랜드로 재구성하고, 한국어/영어/스페인어 3개 국어 라우팅을 지원한다. My Page는 공개 메뉴에서 제외하고 로그인 후 계정 메뉴에서만 표시한다. 주요 기능은 과정/활동 콘텐츠, 문의, 회원가입/로그인, 자격 취득 조회, 관리자 CMS이다. 결제, 알림, 네이티브 앱, 자동 번역, 증명서 자동 발급, 고급 통계, 대량 마이그레이션은 1차 계약 범위에서 제외한다.
