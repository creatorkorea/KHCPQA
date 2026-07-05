# Information Architecture

## 공개 메뉴

My Page는 공개 메뉴에 노출하지 않는다.

| 메뉴 | 목적 | 라우트 |
| --- | --- | --- |
| About KHCPQA | 협회 소개 및 신뢰도 구축 | `/[locale]/about` |
| Curriculum | 과정 및 자격 프로그램 안내 | `/[locale]/curriculum` |
| Global Activities | 활동성과 커뮤니티 자료 | `/[locale]/activities` |
| Partner Inquiry | 해외 기관 및 협업 문의 | `/[locale]/partner-inquiry` |
| Contact | 지점, 연락처, 오시는 길 | `/[locale]/contact` |
| Language | 한국어/English/Español 전환 | 현재 페이지의 같은 언어 라우트 |
| Login | 로그인 진입 | `/[locale]/login` |

## 로그인 후 계정 메뉴

| 메뉴 | 목적 | 라우트 |
| --- | --- | --- |
| My Page | 개인 요약 | `/[locale]/account` |
| Profile | 개인정보 확인/수정 | `/[locale]/account/profile` |
| Certification Inquiry | 자격 취득 조회 | `/[locale]/account/certifications` |
| Inquiry History | 문의 내역 | `/[locale]/account/inquiries` |
| Logout | 로그아웃 | 공통 액션 |

## 라우트 구조

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
/ko/activities/reviews
/ko/partner-inquiry
/ko/contact
/ko/login
/ko/register
/ko/password-reset
/ko/account
/ko/account/profile
/ko/account/certifications
/ko/account/inquiries
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

## 화면 우선순위

1. 홈
2. 협회 소개
3. 커리큘럼 목록
4. 과정 상세 템플릿
5. Global Activities 목록
6. 게시글 상세 템플릿
7. 파트너 문의
8. Contact
9. 로그인/회원가입
10. My Page
11. 자격 조회
12. 관리자 대시보드

## 홈 섹션

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
