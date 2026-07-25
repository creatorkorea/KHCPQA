# 고객 제공 이미지 적용 보고서

작성일: 2026-07-25

## 요약

고객 제공 이미지 84장은 신규 사이트에서 `신뢰 형성`, `교육과정 설명`, `시설 증명`, `글로벌 활동/수상 실적`, `대표/협약 소개`의 다섯 축으로 활용하는 것이 가장 적합하다. 기존 사이트 IA 기준으로는 홈, 협회 소개, 교육과정, 글로벌 활동, 파트너 문의 화면에 나누어 적용한다.

우선 적용용 대표 이미지는 `public/assets/client-smc/`에 선별 복사했다. 전체 원본은 `/Users/manseokko/Downloads/이미지파일/`에 있다.

## 1차 적용 우선순위

| 우선순위 | 적용 위치 | 추천 자산 | 적용 의도 |
| --- | --- | --- | --- |
| 1 | 홈 Hero, About 상단 | `/assets/client-smc/smc-reception-hero.jpg`, `/assets/client-smc/smc-signage-corridor.jpg` | 실제 기관 공간과 브랜드 노출로 첫 신뢰 확보 |
| 2 | `/[locale]/curriculum` Hero 및 과정 카드 | `/assets/client-smc/practical-massage-training.jpg`, `/assets/client-smc/facial-skincare-device.jpg`, `/assets/client-smc/aroma-spa-therapy.jpg` | 실무 중심 교육기관 이미지를 강화 |
| 3 | `/[locale]/about` 및 Contact | `/assets/client-smc/training-room-beds-wide.jpg`, `/assets/client-smc/smc-lobby-sofa.jpg`, `/assets/client-smc/awards-books-consulting-room.jpg` | 시설, 실습실, 상담 공간의 실재감 전달 |
| 4 | `/[locale]/activities/competition`, `/[locale]/activities/awards` | `/assets/client-smc/global-competition-hall-wide.jpg`, `/assets/client-smc/competition-award-stage.jpg`, `/assets/client-smc/global-judges-group-stage.jpg` | 국제 대회, 심사, 수상 실적을 증명 |
| 5 | `/[locale]/about/greeting`, `/[locale]/activities/media`, `/[locale]/partner-inquiry` | `/assets/client-smc/mou-leadership-table.jpg`, `/assets/client-smc/mou-handshake.jpg`, `/assets/client-smc/chairman-profile-seated.jpg` | 대표성, 협약, 외부 파트너십 신뢰도 보강 |

## 화면별 적용안

### 홈

| 섹션 | 적용 이미지 | 비고 |
| --- | --- | --- |
| Hero | `smc-reception-hero.jpg` 또는 `smc-signage-corridor.jpg` | 현재 생성형 이미지보다 실제 공간 이미지가 더 신뢰감 있음 |
| 주요 교육과정 | `facial-skincare-device.jpg`, `practical-massage-training.jpg`, `sports-massage-practice.jpg` | 교육 카드 대표 이미지로 사용 |
| KHCPQA가 특별한 이유 | `awards-books-consulting-room.jpg` | 수상/교재/상담실 조합으로 공신력 전달 |
| 하단 CTA | `mou-leadership-table.jpg` | 파트너 문의 CTA와 잘 맞음 |

### 협회 소개

| 라우트 | 적용 이미지 | 비고 |
| --- | --- | --- |
| `/[locale]/about` | `smc-signage-corridor.jpg`, `smc-lobby-sofa.jpg` | 기관 공간과 브랜드 노출 |
| `/[locale]/about/greeting` | `chairman-profile-seated.jpg`, `chairman-profile-arms.jpg` | 협회장/대표 프로필 후보 |
| `/[locale]/about/history` | `global-judges-group-stage.jpg`, `competition-award-stage.jpg` | 활동 연혁과 성과 설명에 적합 |
| `/[locale]/about/instructors` | 대회 심사위원 이미지 일부 | 인물 동의 확인 후 사용 |
| `/[locale]/about/organization` | `mou-handshake.jpg` | 조직/협약/공식 네트워크 이미지 |

### 교육과정

| 과정/카테고리 | 적용 이미지 | 비고 |
| --- | --- | --- |
| 피부미용사, 메디컬 스킨케어 | `facial-skincare-device.jpg`, `spa-hands-closeup.jpg` | 피부/페이스 케어 대표 컷 |
| 경락 마사지, 얼굴축소경락 | `practical-massage-training.jpg`, `meridian-chart-reference.jpg` | 실습과 이론 설명 병행 |
| 스포츠 마사지, 카이로프랙틱 | `sports-massage-practice.jpg` | 강한 실습 이미지 |
| 아로마/스파 테라피 | `aroma-spa-therapy.jpg` | 부드러운 스파 이미지 |
| 취업/창업/강사 과정 | `training-room-beds-wide.jpg`, `awards-books-consulting-room.jpg` | 교육 환경과 성과 중심 |

### 글로벌 활동

| 활동 키 | 적용 이미지 | 비고 |
| --- | --- | --- |
| `photo` | `global-competition-hall-wide.jpg` | 대규모 현장감 |
| `awards` | `competition-award-stage.jpg`, `k-beauty-master-certificate.jpg` | 심사/수상/위촉 증명 |
| `competition` | `global-judges-group-stage.jpg`, `global-competition-hall-wide.jpg` | 국제대회 대표 이미지 |
| `media` | `president-speech.jpg`, `mou-handshake.jpg` | 대외 발표/협약 이미지 |
| `pass` | `k-beauty-master-certificate.jpg` | 자격/수료/인증 성격 보강 |

### 파트너 문의

| 섹션 | 적용 이미지 | 비고 |
| --- | --- | --- |
| 상단/CTA | `mou-leadership-table.jpg` | 협회, 기업, 파트너십 문맥과 가장 자연스러움 |
| 협력 실적 | `mou-handshake.jpg` | 협약 체결 신뢰도 |

## 사용 주의

- 얼굴이 식별되는 행사, 수상, 단체 사진은 공개 사용 동의 여부를 확인해야 한다.
- `KakaoTalk_20260703_113007658_*` 계열 중 일부는 워터마크, 기존 전화번호, 영상 자막이 포함되어 있어 메인/광고용으로는 부적합하다. 필요 시 상세 본문 보조 이미지 또는 크롭 후 사용한다.
- 파란 배너형 이미지들은 문구가 오래된 인상을 줄 수 있다. 원본 사진만 추출하거나 신규 타이포그래피로 재제작하는 편이 좋다.
- 2026년 4월 협약 사진은 최신성과 신뢰도가 높으므로 파트너십/협회 소개에 우선 사용한다.

## 다음 작업

1. 발주사에 공개 사용 가능 여부와 초상권 확인을 요청한다.
2. 승인된 이미지만 CMS `대표 이미지 URL`에 `/assets/client-smc/...` 경로로 등록한다.
3. 홈과 커리큘럼 기본 이미지는 승인 후 코드 기본값 또는 CMS published 콘텐츠로 교체한다.
4. 광고 소재는 기존 파란 배너를 그대로 쓰기보다 신규 배너로 재디자인한다.
