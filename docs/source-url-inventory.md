# Source URL Inventory

기존 SMC365 콘텐츠를 이관한 항목은 가능한 한 `source_url`을 함께 보관한다. 현재 앱 코드의 과정 데이터는 각 과정별 원본 URL을 `source` 값으로 가지고 있으며, 관리자 CMS seed는 대표 항목의 `source_url`을 포함한다.

## CMS Seed Source URLs

| 유형 | Locale | Slug | Source URL | 상태 |
| --- | --- | --- | --- | --- |
| Page | ko | `about` | `https://www.smc365.ac/academy/academy01.asp` | 입력 완료 |
| Page | ko | `contact` | `https://www.smc365.ac/academy/academy06.asp` | 입력 완료 |
| Course | ko | `피부미용사-국가자격증` | `https://www.smc365.ac/curriculum/skin-national-certification.asp` | 임시 경로, 발주사 확인 필요 |
| Activity | ko | `notice` | `https://www.smc365.ac/index.asp` | 입력 완료 |

## Course Source URLs In Code

| 과정 | Source URL |
| --- | --- |
| 취업전문과정 | `https://www.smc365.ac/curriculum/curriculum05.asp` |
| 창업전문과정 | `https://www.smc365.ac/curriculum/curriculum06.asp` |
| 주말반/취미반 | `https://www.smc365.ac/curriculum/curriculum07.asp` |
| 얼굴축소경락 | `https://www.smc365.ac/curriculum/curriculum08.asp` |
| 메디컬 스킨케어 | `https://www.smc365.ac/curriculum/curriculum09.asp` |
| 아로마 마사지 | `https://www.smc365.ac/curriculum/curriculum10.asp` |
| 경락 마사지 | `https://www.smc365.ac/curriculum/curriculum11.asp` |
| 스포츠 마사지 | `https://www.smc365.ac/curriculum/curriculum12.asp` |
| 발 마사지 | `https://www.smc365.ac/curriculum/curriculum13.asp` |
| 산모 마사지 | `https://www.smc365.ac/curriculum/curriculum14.asp` |
| 베이비 마사지 | `https://www.smc365.ac/curriculum/curriculum15.asp` |
| 타이 마사지 | `https://www.smc365.ac/curriculum/curriculum16.asp` |
| 카이로프랙틱 | `https://www.smc365.ac/curriculum/curriculum17.asp` |
| 피부미용사 국가자격증 | `https://www.smc365.ac/curriculum/curriculum01.asp` |
| 스웨디시 | `https://www.smc365.ac/curriculum/curriculum19.asp` |
| 스파 테라피 | `https://www.smc365.ac/curriculum/curriculum20.asp` |
| 브라질리언 왁싱 | `https://www.smc365.ac/curriculum/curriculum21.asp` |
| 병원 코디네이터 | `https://www.smc365.ac/curriculum/curriculum22.asp` |

## Remaining Source URL Work

- 활동/커뮤니티 게시글별 실제 원본 게시판 URL 확정
- 후기 콘텐츠별 원본 게시판 URL 확정
- 사진/방송/언론/수상경력 콘텐츠별 원본 URL 확정
- 영어/스페인어 번역 콘텐츠가 한국어 원문과 같은 `source_url`을 공유할지 확정
- 관리자 CMS에 실제 운영 콘텐츠 등록 시 모든 항목의 `source_url` 입력

## Verification SQL

```sql
select content_type, locale, slug, status, source_url
from public.admin_content_items
where source_url is null or source_url = ''
order by content_type, locale, slug;
```

위 쿼리가 0건이 되면 CMS 운영 콘텐츠 기준 `source_url` 입력을 완료로 본다.
