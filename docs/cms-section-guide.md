# CMS Section Input Guide

관리자 CMS에서 공개 페이지 문구를 교체할 때 사용하는 slug 규칙이다. 상태가 `published`인 항목만 공개 화면에서 우선 적용된다.

## 공통 필드

| 필드 | 입력 기준 |
| --- | --- |
| 콘텐츠 유형 | `Page`, `Course`, `Activity`, `Review` 중 선택 |
| 언어 | `ko`, `en`, `es` 중 선택 |
| Slug | 아래 규칙에 맞는 영문/한글 식별자 |
| 제목 | 공개 화면 제목 또는 카드 제목 |
| 게시 상태 | `draft`, `translated`, `reviewed`, `published`, `archived` 중 선택. 공개 화면 우선 적용은 `published`만 해당 |
| 원본 URL | 기존 SMC365 출처 URL이 있으면 입력 |
| 대표 이미지 URL | 공개 접근 가능한 `/assets/...` 경로 또는 `https://...` URL |
| 본문 요약 | 카드 요약, 목록 요약, SEO 보조 문구 |
| 상세 본문 | 상세 페이지 소개 문단 또는 섹션 본문 |

## Page

| 화면 | 콘텐츠 유형 | Slug |
| --- | --- | --- |
| 홈 | `Page` | `home` |
| 협회 소개 | `Page` | `about` |
| 과정 목록 | `Page` | `curriculum` |
| 활동/커뮤니티 | `Page` | `activities` |
| Contact | `Page` | `contact` |
| 개인정보처리방침 | `Page` | `privacy` |
| 이용약관 | `Page` | `terms` |

법무 페이지(`privacy`, `terms`)는 `published` 상태인 상세 본문을 실제 공개 원문으로 사용한다. 문단은 빈 줄로 구분해 입력한다.

## Course

과정 목록 카드와 상세 첫 화면을 교체하려면 과정 slug를 그대로 사용한다.

| 용도 | 콘텐츠 유형 | Slug 예시 |
| --- | --- | --- |
| 과정 대표 문구 | `Course` | `피부미용사-국가자격증` |
| 상세 진행 흐름 | `Course` | `[courseSlug]-flow-1` |
| 상세 강조 패널 | `Course` | `[courseSlug]-panel-1` |
| 상세 테크닉 카드 | `Course` | `[courseSlug]-technique-1` |
| 상세 프로세스 | `Course` | `[courseSlug]-process-1` |

숫자 suffix는 노출 순서로 사용한다. 예: `aroma-therapy-flow-1`, `aroma-therapy-flow-2`.

## Activity

활동 목록 카드와 상세 첫 화면은 활동 key를 그대로 사용한다.

| 용도 | 콘텐츠 유형 | Slug 예시 |
| --- | --- | --- |
| 활동 대표 문구 | `Activity` | `notice` |
| 상세 운영 섹션 | `Activity` | `[activityKey]-section-1` |
| 상세 게시글 | `Activity` | `[activityKey]-post-1` |

## Banner

홈 운영 CTA는 `placement`가 `home` 또는 `global`이고 상태가 `published`인 배너를 노출한다. 내부 링크는 `/ko/partner-inquiry`처럼 locale을 포함하고, 외부 링크는 `https://`로 시작하게 입력한다.

## 공개 전 확인

- 원본 URL이 있는 콘텐츠는 `source_url`을 비워두지 않는다.
- 외부 이미지는 사용 권리가 확인된 URL만 `image_url`에 입력한다.
- 한국어, 영어, 스페인어 문구를 각각 별도 항목으로 등록한다.
- 자동 번역 초안은 `translated` 또는 `reviewed`에 두고, 최종 검수 후 `published`로 변경한다.
- 개인정보, 자격번호, 내부 메모는 공개 콘텐츠 본문에 입력하지 않는다.
