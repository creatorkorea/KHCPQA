# Content Migration

기존 콘텐츠 출처는 `https://www.smc365.ac/index.asp` 및 내부 링크다.

## 이관 원칙

- 기존 콘텐츠를 신규 글로벌 IA에 맞게 재분류한다.
- 모든 이관 콘텐츠에는 원본 URL을 `source_url`로 저장한다.
- 이미지 사용 권한은 발주사가 확인한다.
- 오래된 콘텐츠는 최신순, 대표성, 신뢰도 순으로 우선 이관한다.
- 한국어 원문을 먼저 정리하고 영어/스페인어 초안을 연결한다.
- CMS 상태는 `draft`, `translated`, `reviewed`, `published`, `archived`로 관리한다.
- 영어/스페인어 초안 번역은 `translated` 또는 `reviewed` 상태로 보관하고, 전문 검수 완료 후 `published`로 전환한다.
- 공개 페이지는 한국어 원문을 조용히 대체 표시하지 않고 각 언어별 콘텐츠 데이터를 사용한다.
- 전문 번역 감수는 1차 범위가 아니므로 공개 전 발주사 확인이 필요하다.

## 협회 소개

| 기존 URL | 신규 라우트 |
| --- | --- |
| `/academy/academy01.asp` | `/[locale]/about` |
| `/academy/academy02.asp` | `/[locale]/about/greeting` |
| `/academy/academy03.asp` | `/[locale]/about/senior-instructors` |
| `/academy/academy04.asp` | `/[locale]/about/history` |
| `/academy/academy05.asp` | `/[locale]/about/organization` |
| `/academy/academy06.asp` | `/[locale]/contact` |

## 과정 콘텐츠

기존 과정명:

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

신규 라우트:

- `/[locale]/curriculum`
- `/[locale]/curriculum/[courseSlug]`

## 후기 콘텐츠

| 기존 boardName | 의미 | 신규 카테고리 |
| --- | --- | --- |
| `review5` | 실무교육 수강생 후기 | practical |
| `review1` | 자격증취득 수강생 후기 | certification |
| `review2` | 선택합격자 수강생 후기 | pass |
| `review3` | 필기합격 수강생 후기 | written-pass |
| `review4` | 외국인 수강생 후기 | international |
| `review6` | 졸업 후 나도 한마디 | alumni |
| `review7` | 아카데미 이야기 | academy-story |

## 활동/커뮤니티 콘텐츠

| 기존 boardName | 신규 라우트 |
| --- | --- |
| `notice` | `/[locale]/activities/notices` |
| `pass` | `/[locale]/activities/passing-status` |
| `photo` | `/[locale]/activities/gallery` |
| `awards` | `/[locale]/activities/judges-awards` |
| `beauty` | `/[locale]/activities/competitions` |
| `companyevent` | `/[locale]/activities/corporate-events` |
| `media` | `/[locale]/activities/media` |
| `volunteer` | `/[locale]/activities/volunteer` |
| `qna` | `/[locale]/community/qna` |
| `smcevent` | `/[locale]/community/events` |

## 연락처

| 구분 | 주소 | 연락처 |
| --- | --- | --- |
| 한국건강관리사자격협회 서울본사 | 서울시 종로구 수표로 120 내인빌딩 8층 | TEL 02-763-1271, FAX 02-747-1273, H.P 010-7712-3362 |
| SMC아카데미 본점 | 서울시 종로구 수표로 120 내인빌딩 7층 | H.P 010-6283-1206, FAX 02-747-1273 |
| 강남SMC아카데미 구로디지털단지역점 | 서울시 관악구 시흥대로 558-1 G밸리마인드 5층 505호 | TEL 02-867-2280, H.P 010-6283-1206 |
| 한국건강관리사자격협회 구로디지털단지역점 | 서울시 관악구 시흥대로 558-1 G밸리마인드 5층 503호 | TEL 02-867-2281, H.P 010-6283-1206 |
| 한국건강관리사자격협회 대림캠퍼스 | 서울시 영등포구 대림로 23길 30-1 골든타워 6층 | H.P 010-5589-9812 |

## 1차 우선 이관

- 협회 소개 5개 페이지
- 과정 목록과 주요 과정 상세
- 공지/시험일정
- 합격현황/합격률
- 포토갤러리
- 심사위원/수상경력
- 국제미용대회
- 방송/언론
- 봉사활동
- 주요 수강 후기
- 연락처/지점 정보
