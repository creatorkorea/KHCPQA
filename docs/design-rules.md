# Design Rules

## Reference Asset

기준 이미지:
- `/public/assets/design-reference.png`
- `/public/assets/design-reference-uiux.png`

이 이미지는 KHCPQA 글로벌 웹앱의 1차 디자인 기준이다. 화면 구성, 여백, 카드 반경, 로고 톤, 그린 버튼, 교육 이미지 사용 방식을 이 기준에 맞춘다.

## 브랜드 방향

- 국제 협회
- 글로벌 교육기관
- 공식적이고 신뢰감 있는 톤
- 화이트 + 그린 기반
- 깨끗한 여백, 명확한 계층, 높은 가독성

## Visual Direction

- Clean institutional editorial
- White desktop canvas
- Deep green identity
- Formal hero headline with strong Korean sans typography
- Minimal iconography
- Soft shadows
- Rounded 8px cards
- Education/healthcare imagery
- Global network motif

첫 화면은 좌측 브랜드 설명 레일과 우측 메인 웹앱 캔버스가 함께 보이는 구성을 기준으로 한다. 사용자가 기억해야 할 인상은 “한국 기반 글로벌 전문 자격 교육기관”이다.

## 색상 규칙

- 배경은 흰색을 기본으로 한다.
- 주요 액센트는 딥 그린을 사용한다.
- 보조 액센트는 소프트 그린 또는 밝은 중립색을 사용한다.
- 본문은 다크 그레이를 사용한다.
- 한 화면이 전부 초록색 계열로만 보이지 않도록 중립색과 이미지 콘텐츠를 충분히 사용한다.
- 경고, 오류, 성공 상태는 의미 색상을 분리한다.

권장 토큰:
- Primary Green: `#006B35`
- Deep Green: `#004225`
- Background: `#F6F8F5`
- Surface: `#FFFFFF`
- Soft Green: `#E2F0E8`
- Ink: `#07140F`
- Muted Text: `#66736D`
- Line: `#DFE7E2`
- Accent Gold: `#B78B3B`
- Accent Coral: `#D96B52`

## 타이포그래피

- 한국어, 영어, 스페인어 모두 읽기 쉬운 산세리프를 기본으로 사용한다.
- 한국어 hero headline은 굵고 단정한 산세리프로 고정해 전문 교육기관의 신뢰감을 만든다.
- Georgia 계열 세리프는 KHCPQA 로고형 텍스트와 영문 editorial 강조에 제한적으로 사용한다.
- 본문 최소 16px.
- 모바일에서도 줄간격을 넉넉하게 유지한다.
- 버튼과 카드 안 텍스트는 길어져도 넘치지 않도록 줄바꿈을 허용한다.
- 스페인어 문장이 길어지는 경우를 고려해 버튼 폭과 카드 레이아웃을 설계한다.

## 레이아웃

- 모바일 우선으로 설계한다.
- 주요 콘텐츠 최대 폭을 제한해 긴 줄을 만들지 않는다.
- 페이지 섹션은 카드처럼 겹겹이 감싸지 않는다.
- 반복 아이템에는 카드 사용 가능.
- 카드는 8px 이하의 절제된 radius를 기본으로 한다.
- 홈 첫 화면에는 협회명, 글로벌 교육, 자격 프로그램, CTA가 명확히 보여야 한다.
- 데스크톱 홈은 좌측 브랜드 레일 + 우측 대형 화이트 캔버스를 기준으로 한다.
- Hero 이미지와 CTA는 첫 화면 안에서 함께 보여야 한다.
- 통계/신뢰 지표는 hero 하단에 낮은 높이의 가로 카드로 배치한다.

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
- `/assets/design-reference.png`
- `/assets/design-reference-uiux.png`
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
