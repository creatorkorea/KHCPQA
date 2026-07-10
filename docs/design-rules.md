# Design Rules

## Reference Asset

기준 이미지:
- `/public/assets/design-reference-premium.png`
- `/public/assets/design-reference.png`
- `/public/assets/design-reference-uiux.png`

`design-reference-premium.png`를 최신 우선 기준으로 사용한다. 이전 그린 레퍼런스는 협회 신뢰감, 정보 밀도, 콘텐츠 섹션 구조를 확인하는 보조 기준으로만 사용한다.

## 브랜드 방향

- 국제 협회
- 취업과 창업을 지원하는 전문 교육기관
- 공식적이지만 부드러운 프리미엄 톤
- 화이트 + 라벤더 퍼플 기반, 딥그린을 신뢰 보조색으로 사용
- 깨끗한 여백, 명확한 계층, 높은 가독성
- 수강 상담과 과정 탐색이 자연스럽게 이어지는 랜딩 흐름

## Visual Direction

- Premium wellness education
- White and soft-lavender desktop canvas
- Deep purple primary identity with deep green trust accent
- Large confident Korean sans headline
- Thin-line iconography with soft purple icon containers
- Soft shadows and subtle glass surfaces
- Rounded 8px cards; large hero media can use asymmetric oval/arc masking
- Real education, beauty, wellness, massage, and skin-care imagery
- Course exploration, consultation, employment, and startup support motif

첫 화면은 좌측 강한 교육 메시지와 우측 실제 시술/교육 이미지를 함께 보여준다. 사용자가 기억해야 할 인상은 “나의 기술이 취업과 창업으로 이어지는 프리미엄 전문 교육기관”이다.

## 색상 규칙

- 배경은 흰색을 기본으로 하고, 섹션 전환에 아주 옅은 라벤더/웜그레이 그라데이션을 사용한다.
- 주요 액센트는 프리미엄 퍼플을 사용한다.
- 딥그린은 협회 신뢰, 공식성, 자격/검증 정보에 보조 액센트로 사용한다.
- 보조 액센트는 라벤더, 라일락, 아주 밝은 중립색을 사용한다.
- 본문은 다크 그레이를 사용한다.
- 한 화면이 전부 보라색 계열로만 보이지 않도록 화이트, 딥그린, 사진, 얇은 라인을 충분히 사용한다.
- 경고, 오류, 성공 상태는 의미 색상을 분리한다.

권장 토큰:
- Primary Purple: `#6F45C7`
- Deep Purple: `#4B2E83`
- Soft Purple: `#EFE8FF`
- Lavender Surface: `#F8F5FF`
- Trust Green: `#006B35`
- Deep Green: `#004225`
- Background: `#FBFAFF`
- Surface: `#FFFFFF`
- Soft Green: `#E7F3EC`
- Ink: `#181622`
- Muted Text: `#6F6A7B`
- Line: `#E8E2F3`
- Accent Gold: `#B78B3B`
- Accent Coral: `#D96B52`

## 타이포그래피

- 한국어, 영어, 스페인어 모두 읽기 쉬운 산세리프를 기본으로 사용한다.
- 한국어 hero headline은 굵고 단정한 산세리프로 고정해 전문 교육기관의 신뢰감을 만든다.
- KHCPQA 로고형 텍스트는 굵은 세리프 또는 고급감 있는 표시용 폰트 느낌을 유지한다.
- 본문 최소 16px.
- 모바일에서도 줄간격을 넉넉하게 유지한다.
- 버튼과 카드 안 텍스트는 길어져도 넘치지 않도록 줄바꿈을 허용한다.
- 스페인어 문장이 길어지는 경우를 고려해 버튼 폭과 카드 레이아웃을 설계한다.

### 글꼴 크기 기준

레퍼런스 디자인에 맞춰 텍스트는 크기보다 위계와 여백으로 강조한다. 페이지마다 임의로 hero-scale 글자를 남용하지 않는다.

- 데스크톱 헤더 로고: `24px-28px`, 서브텍스트 `10px-11px`, 메뉴 `12px-13px`, 버튼 `13px`.
- 메인/섹션 hero H1: 데스크톱 `48px-64px`, 아주 넓은 화면에서도 `72px`를 넘기지 않는다.
- 일반 페이지 H1: 데스크톱 `40px-56px`.
- 섹션 H2: 데스크톱 `28px-40px`.
- 카드 제목: `18px-24px`, 카드 내부에서 hero급 크기를 쓰지 않는다.
- 카드/목록 본문: `14px-16px`, 긴 설명은 `line-height: 1.55-1.75`.
- 버튼/칩/퀵 메뉴: `12px-14px`, 짧은 명령형 텍스트만 사용한다.
- 모바일 H1: `34px-46px` 범위에서 줄바꿈을 우선하고, viewport width 기반으로 과하게 키우지 않는다.
- 한 화면에서 H1, H2, 카드 제목이 같은 크기로 보이지 않도록 최소 8px 이상의 단계 차이를 둔다.

## 레이아웃

- 모바일 우선으로 설계한다.
- 주요 콘텐츠 최대 폭을 제한해 긴 줄을 만들지 않는다.
- 페이지 섹션은 카드처럼 겹겹이 감싸지 않는다.
- 반복 아이템에는 카드 사용 가능.
- 카드는 8px 이하의 절제된 radius를 기본으로 한다.
- 홈 첫 화면에는 협회명, 전문 교육, 취업/창업 지원, CTA가 명확히 보여야 한다.
- 데스크톱 홈은 상단 헤더 아래 hero가 바로 시작되고, 좌측 텍스트와 우측 실제 시술/교육 이미지가 균형을 이루어야 한다.
- Hero 이미지와 CTA, 3개 내외의 핵심 신뢰 지표가 첫 화면 안에서 함께 보여야 한다.
- Hero 하단에는 과정/상담/수강신청 등 주요 진입점을 낮은 높이의 가로 퀵 메뉴로 배치한다.
- 교육과정 목록은 좌측 탭/카테고리와 우측 카드 그리드를 조합하되, 모바일에서는 가로 스크롤 칩 또는 select로 바꾼다.
- 하단에는 공지, 강의시간, 상담 CTA처럼 실제 운영에 필요한 정보를 카드형으로 배치한다.

## 교육 상세/콘텐츠 페이지 작업 원칙

과정 상세, 협회 소개, 오시는 길처럼 기존 SMC365 원본을 옮기는 페이지는 `frontend-design` 관점으로 다시 구성한다. 원본의 섹션감과 정보 밀도는 살리되, 낡은 이미지형 표나 단순 박스 나열은 그대로 복제하지 않는다.

- 작업 전 원본 페이지의 섹션 흐름, 핵심 정보, CTA 위치, 이미지 역할을 먼저 파악한다.
- 원본에 있는 정보는 빠뜨리지 않되 최신 교육 상세 페이지처럼 재구성한다.
- 교육 상품 페이지는 상단에서 목적, 대상, 기간, 결과를 바로 이해할 수 있게 만든다.
- 낡은 표 스타일은 반응형 정보 카드, 비교 가능한 칩, 요약 패널, 섹션형 그리드로 변환한다.
- 단순 3열 카드 반복으로 끝내지 말고, 중요도에 따라 hero, 핵심 지표, 강조 섹션, 보조 정보, 하단 CTA의 위계를 만든다.
- 원본 이미지가 의미 있는 경우 사용하되, 흐릿하거나 시대감이 강하면 최신 톤의 생성 이미지 또는 로컬 assets로 보완한다.
- 페이지마다 KHCPQA의 프리미엄 퍼플/화이트 톤을 유지하되, 협회 신뢰와 자격 검증 정보에는 딥그린을 보조로 사용한다. 정보가 모두 같은 보라 박스로 보이지 않도록 중립색, 이미지, 여백, 얇은 라인, 제한적인 강조색을 섞는다.
- 모바일에서는 원본 표 구조를 유지하지 말고, 한 손으로 읽기 쉬운 순서형 카드와 CTA 흐름으로 바꾼다.
- 사용자에게 노출할 필요 없는 원본 URL, 내부 출처, 작업 메모는 화면에 표시하지 않는다.
- 검증은 `npm run lint`, `git diff --check`, 가능하면 `npm run build`까지 수행한다.

## 네비게이션

- 공개 메뉴에는 My Page를 넣지 않는다.
- 모바일에서는 햄버거 메뉴와 드롭다운 언어 선택기를 명확히 제공한다.
- 로그인 후에는 사용자 아이콘/이름 메뉴에서 My Page를 제공한다.
- 언어 선택은 `한국어`, `English`, `Español` 풀네임 드롭다운으로 제공하고, 선택 시 같은 페이지의 해당 언어 라우트로 이동한다.

## 컴포넌트 규칙

- 버튼에는 가능한 경우 아이콘을 함께 사용한다.
- 상태값은 배지로 표시한다.
- 필터는 세그먼트 컨트롤 또는 select를 사용한다.
- 관리자 화면은 조밀하지만 읽기 쉬운 테이블/리스트 중심으로 만든다.
- 폼은 라벨, 도움말, 오류 메시지를 명확히 제공한다.
- 파일 업로드, 이미지 미리보기, 게시 상태 변경 UI를 관리자에서 쉽게 찾을 수 있게 한다.

## 이미지

- 디자인에 사용되는 이미지는 반드시 `/public/assets`에 저장한 뒤 참조한다.
- 기존 SMC365 이미지 콘텐츠 또는 생성된 참고 이미지는 로컬 assets로 복사/가공해 사용한다.
- 글로벌 신뢰감을 보여주는 사진을 홈과 활동 섹션에 배치한다.
- 이미지 alt text는 언어별로 관리한다.
- 흐릿하거나 저해상도 이미지는 대표 이미지로 쓰지 않는다.

현재 1차 assets:
- `/assets/design-reference-premium.png`
- `/assets/design-reference.png`
- `/assets/design-reference-uiux.png`
- `/assets/premium-hero-wellness-education.png`
- `/assets/premium-course-aroma.png`
- `/assets/premium-course-facial-contouring.png`
- `/assets/premium-course-medical-skincare.png`
- `/assets/premium-course-meridian.png`
- `/assets/premium-course-sports.png`
- `/assets/premium-course-foot.png`
- `/assets/premium-course-maternity.png`
- `/assets/premium-course-swedish.png`
- `/assets/hero-professionals.png`
- `/assets/course-medical-skincare.png`
- `/assets/course-aroma-therapy.png`
- `/assets/course-sports-massage.png`
- `/assets/course-foot-massage.png`
- `/assets/activity-training.png`
- `/assets/activity-wellness.png`
- `/assets/partner-network.png`

## 접근성

- 텍스트와 배경 대비를 충분히 확보한다.
- 키보드 포커스 상태를 보이게 한다.
- 모든 폼 입력에는 라벨이 있어야 한다.
- 이미지에는 alt를 제공한다.
- 아이콘 단독 버튼에는 tooltip 또는 aria-label을 제공한다.

## 금지 사항

- My Page를 공개 메뉴에 노출 금지
- 검증되지 않은 의료 효과 또는 법적 효력 표현 금지
- 자동 번역을 최종 콘텐츠처럼 공개 금지
- 모바일에서 가로폭을 넘는 고정 테이블 금지
- 버튼 안 텍스트가 잘리는 디자인 금지
- 관리자 화면을 마케팅 랜딩 페이지처럼 크게 꾸미는 것 금지
