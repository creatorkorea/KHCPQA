# Data Model

초기 데이터 모델 초안이다. 실제 구현 시 사용하는 DB에 맞게 필드 타입과 인덱스를 조정한다.

## locales

지원 언어:
- `ko`
- `en`
- `es`

## pages

| 필드 | 설명 |
| --- | --- |
| id | 고유 ID |
| slug | URL slug |
| locale | ko/en/es |
| title | 제목 |
| body | 본문 |
| status | draft/published/archived |
| translation_status | ready/reviewing/draft |
| seo_title | SEO 제목 |
| seo_description | SEO 설명 |
| source_url | 기존 사이트 원본 URL |
| updated_at | 수정일 |

## courses

| 필드 | 설명 |
| --- | --- |
| id | 고유 ID |
| slug | 과정 slug |
| locale | ko/en/es |
| title | 과정명 |
| category | 카테고리 |
| summary | 요약 |
| body | 상세 본문 |
| image_url | 대표 이미지 |
| translation_status | ready/reviewing/draft |
| status | 게시 상태 |
| source_url | 기존 사이트 원본 URL |

## posts

| 필드 | 설명 |
| --- | --- |
| id | 고유 ID |
| board_type | notice/pass/photo/awards/beauty/media 등 |
| locale | ko/en/es |
| title | 제목 |
| body | 본문 |
| thumbnail_url | 썸네일 |
| published_at | 게시일 |
| translation_status | ready/reviewing/draft |
| status | 게시 상태 |
| source_url | 기존 사이트 원본 URL |

## users

| 필드 | 설명 |
| --- | --- |
| id | 고유 ID |
| name | 이름 |
| email | 이메일 |
| phone | 연락처 |
| country | 국가 |
| preferred_locale | 선호 언어 |
| role | user/admin role |
| status | active/suspended/deleted |
| created_at | 가입일 |

## certifications

| 필드 | 설명 |
| --- | --- |
| id | 고유 ID |
| user_id | 사용자 ID |
| course_id | 과정 ID |
| certificate_number | 자격 번호 |
| issued_at | 발급일 |
| status | active/expired/revoked/pending |
| verification_code | 검증 코드 |

## inquiries

| 필드 | 설명 |
| --- | --- |
| id | 고유 ID |
| type | partner/student/course/general |
| locale | ko/en/es |
| name | 이름 |
| organization | 기관명 |
| email | 이메일 |
| phone | 연락처 |
| country | 국가 |
| message | 메시지 |
| status | new/in_progress/done/archived |
| created_at | 생성일 |

## media_assets

| 필드 | 설명 |
| --- | --- |
| id | 고유 ID |
| file_url | 파일 URL |
| alt_text_ko | 한국어 alt |
| alt_text_en | 영어 alt |
| alt_text_es | 스페인어 alt |
| source_url | 원본 URL |
| uploaded_at | 업로드일 |

## banners

| 필드 | 설명 |
| --- | --- |
| id | 고유 ID |
| locale | ko/en/es |
| title | 제목 |
| image_url | 이미지 |
| link_url | 링크 |
| position | 노출 위치 |
| status | 게시 상태 |
| starts_at | 시작일 |
| ends_at | 종료일 |
