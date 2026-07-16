# Open Questions

사용자가 놓치기 쉬운 결정 사항과 오픈 전 확인이 필요한 항목이다. 개발 관점에서 완료된 결정과 발주사/운영자 확인이 필요한 결정을 분리한다.

## 완료된 결정

| 항목 | 결정 |
| --- | --- |
| 언어 정책 | 한국어, 영어, 스페인어 3개 국어를 1차 정식 공개 언어로 운영 |
| 회원가입 방식 | 누구나 회원가입할 수 있는 공개 가입 방식 |
| 자격 조회 방식 | 로그인 회원의 My Page에서 자격번호와 검증 코드를 조회 |
| 1차 제외 기능 | 결제, 알림, 앱, 자동 업로드, 고급 통계, 증명서 자동 발급 등은 후속 단계 |

## 반드시 확인할 사항

| 항목 | 필요한 결정 | 기준 문서/템플릿 |
| --- | --- | --- |
| 최종 브랜드명 | `KHCPQA`, `한국건강관리사자격협회`, `SMC아카데미` 병기 규칙 | `docs/client-action-items.md` |
| 도메인 | 신규 도메인, 기존 `smc365.ac` 하위, 또는 대체 도메인 중 선택 | `docs/deployment-handoff.md` |
| 콘텐츠 권리 | 기존 사이트의 사진, 후기, 보도자료, 강사 프로필 이미지 사용 가능 여부 | `docs/templates/asset-rights-template.csv` |
| 번역 책임 | 영어/스페인어 최종 감수 담당자와 승인 프로세스 | `docs/client-review-request.md` |
| 자격 데이터 형식 | 실제 운영 CSV/엑셀 제공 및 import 승인 | `docs/templates/certification-data-template.csv` |
| 관리자 계정 정책 | 초기 관리자 수, 역할, 활성 상태, 비밀번호 정책 | `docs/templates/admin-users-template.csv` |
| 이미지 저장 방식 | 기존 이미지 URL 참조 또는 새 스토리지 복사 | `docs/templates/asset-rights-template.csv` |
| 법무 원문 | 개인정보처리방침과 이용약관 최종 원문 | `docs/templates/legal-policy-request.md` |
| 공개 검증 기능 | 로그인 없이 검증 코드만으로 유효/무효 조회를 제공할지 여부 | 후속 단계 후보 |

## 있으면 좋은 추가 자료

- 브랜드 로고 원본 파일
- 관리자 역할별 운영 매뉴얼
- 번역 용어집
- 게시판 카테고리별 우선 이관 목록
- 런칭 후 유지보수 계약서
- 정식 오픈 후 GA4/Search Console 운영 담당자

## 후속 단계 후보

- 증명서 PDF 발급
- 공개 검증 코드 조회
- 이메일 알림
- 관리자 대량 업로드
- 고급 통계
- 검색 기능 고도화
- 파트너 기관 전용 랜딩 페이지
- 국가별 캠페인 페이지
- Vercel/GA4/Search Console 운영 리포트
