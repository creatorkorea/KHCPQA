# Launch Readiness

이 문서는 현재 프로젝트가 검수/오픈 준비에서 어느 단계에 있는지 한눈에 확인하기 위한 인덱스다.

## Technical Readiness

| 항목 | 상태 | 기준 문서 |
| --- | --- | --- |
| 구현 범위 | 완료 | `docs/checklist.md` |
| 반응형 QA | 완료 | `docs/qa-release.md` |
| Supabase 마이그레이션 | 완료 | `docs/supabase-migration-runbook.md` |
| 문의 제출 E2E | 완료 | `docs/qa-release.md` |
| 로그인/자격 조회 E2E | 완료 | `docs/qa-release.md` |
| GitHub 최신화 | 완료 | `main` branch |
| Vercel 직접 배포 | 작업 환경 정책상 직접 수행 불가 | `docs/deployment-handoff.md` |

## Handoff Documents

| 문서 | 용도 |
| --- | --- |
| `docs/client-review-request.md` | 발주사 검수 요청 범위 |
| `docs/client-action-items.md` | 발주사/운영자 확인 항목 |
| `docs/scope-confirmation.md` | 1차 포함/제외 범위 확인 |
| `docs/deployment-handoff.md` | Vercel 배포 인계 |
| `docs/data-import-runbook.md` | 자격/관리자/CMS 데이터 import 절차 |
| `docs/source-url-inventory.md` | 기존 SMC365 출처 URL 현황 |
| `docs/cms-section-guide.md` | 관리자 CMS 입력 규칙 |
| `docs/qa-release.md` | QA 결과와 릴리즈 기준 |
| `README.md` | GitHub 첫 화면용 프로젝트/인계 요약 |

## Client Input Templates

| 템플릿 | 용도 |
| --- | --- |
| `docs/templates/certification-data-template.csv` | 자격 데이터 샘플 |
| `docs/templates/admin-users-template.csv` | 초기 관리자 목록 |
| `docs/templates/content-source-url-template.csv` | 콘텐츠별 원본 URL |
| `docs/templates/asset-rights-template.csv` | 이미지/로고/보도자료 권리 확인 |
| `docs/templates/legal-policy-request.md` | 개인정보처리방침/이용약관 원문 요청 |
| `docs/templates/client-approval-form.md` | 발주사 최종 승인 양식 |
| `docs/templates/review-feedback-template.csv` | 검수 수정 요청 목록 |

## Remaining External Decisions

- 계약 범위와 제외 범위 최종 승인
- SMC365 콘텐츠/이미지/후기/보도자료/강사 사진 사용 권리 승인
- 도메인, 호스팅, SSL 계정 명의 확정
- 개인정보처리방침과 이용약관 최종 원문 제공
- 실제 자격 데이터 샘플 제공
- 전체 실운영 콘텐츠 `source_url` 확정
- 운영자가 Vercel 배포 후 검수 URL 공유

## Recommended Next Step

운영자는 `docs/deployment-handoff.md`에 따라 Vercel 프로젝트를 생성하고, 생성된 검수 URL을 Supabase Auth Redirect URL에 등록한다. 이후 발주사는 `docs/client-review-request.md`와 `docs/client-action-items.md` 기준으로 검수한다.

GitHub에서 남은 항목을 추적할 때는 `.github/ISSUE_TEMPLATE`의 client approval, deployment, data import 템플릿을 사용한다.
