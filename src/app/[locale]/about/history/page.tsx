import Image from "next/image";
import { AboutSubnav } from "@/components/AboutSubnav";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

type HistoryItem = {
  date: string;
  title: string;
};

const historyByYear: Array<{ year: string; items: HistoryItem[] }> = [
  {
    year: "2025",
    items: [
      { date: "2025년 03월", title: "한국건강관리사자격협회 건강관리사 교육" },
      { date: "2025년 05월", title: "제37회 한국휴먼 (미용,건강,문화,예술) 올림픽대회" }
    ]
  },
  {
    year: "2024",
    items: [
      { date: "2024년 11월", title: "제36회 국제휴먼 (미용,건강,문화,예술) 올림픽대회" },
      { date: "2024년 12월", title: "국제미용건강신문-2024 최우수 교육기관 대상" }
    ]
  },
  {
    year: "2023",
    items: [
      { date: "2023년 10월", title: "제35회 국제휴먼 (미용,건강,문화,예술) 올림픽" },
      { date: "2023년 12월", title: "국제지도자 명인대상-SMC아카데미 회장 황인근" },
      { date: "2023년 5월", title: "제35회 한국휴먼 (미용,건강,문화,예술) 올림픽" }
    ]
  },
  {
    year: "2019",
    items: [
      { date: "2019년 04월", title: "(사) 세계뷰티문화산업진흥원 표창장" },
      { date: "2019년 05월", title: "국제휴먼(미용&건강)올림픽대회 카이로프랙틱 심사위원" },
      { date: "2019년 06월", title: "세계뷰티문화산업진흥원 서울특별시 구로구 지부장 임명장" },
      { date: "2019년 10월", title: "제31회 국제휴먼 (미용,건강,문화,예술) 올림픽" }
    ]
  },
  {
    year: "2017",
    items: [
      { date: "2017년 03월", title: "국제미용기능경기대회 심사위원장" },
      { date: "2017년 04월", title: "국제미용건강총연합회 심사위원" },
      { date: "2017년 08월", title: "미래에셋 20주년 기념 VIP고객 초청행사 핸드마사지" },
      { date: "2017년 10월", title: "경기도 노인사회활동 활성화 대회 발마사지" },
      { date: "2017년 10월", title: "BGF 골프대회 행사 핸드마사지" }
    ]
  },
  {
    year: "2016",
    items: [
      { date: "2016년 03월", title: "일간스포츠 대한민국 고객만족 브랜드 대상" },
      { date: "2016년 04월", title: "국제휴먼(미용&건강)올림픽대회 위원장" },
      { date: "2016년 11월", title: "국제휴먼(미용&건강)올림픽대회 심사위원" }
    ]
  },
  {
    year: "2015",
    items: [
      { date: "2015년 04월", title: "한류FESTIVAL & K-BEAUTY WORLD FESTIVAL 심사위원" }
    ]
  },
  {
    year: "2014",
    items: [
      { date: "2014년 03월", title: "그랜드힐튼 호텔에서 엔자임 Eucerin 핸드마사지" },
      { date: "2014년 05월", title: "경기도 여주 렉스필드 골프장 서울대학교 보건대학원 총동문회장배 골프첼린지" },
      { date: "2014년 05월", title: "송도 힐웨이 건강센터 발마사지" },
      { date: "2014년 06월", title: "도쿄일렉트론 코리아 DTKS 청려수려원 행사 초청" },
      { date: "2014년 06월", title: "사이퍼스 유저 3주년 간담회 일산 원마운트 핸드마사지" },
      { date: "2014년 06월", title: "스킨 Rx 개업 핸드마사지" },
      { date: "2014년 10월", title: "대한정형외과학회 홍은동 그랜드 힐튼 호텔 체어마사지" },
      { date: "2014년 10월", title: "2014 대한민국 국제 농기계자재박람회 천안 삼거리공원 체어마사지" },
      { date: "2014년 11월", title: "이천 휘닉스 스프링스cc 골프대회 체어마사지" },
      { date: "2014년 11월", title: "파주 헤이리마을 포레스타 체어마사지" }
    ]
  },
  {
    year: "2013",
    items: [
      { date: "2013년 02월", title: "K-BEAUTY DESIGN WORLD CONTEST 세계조직위원회" },
      { date: "2013년 02월", title: "SMC아카데미 대림캠퍼스 오픈" },
      { date: "2013년 09월", title: "여의도 63빌딩 롯데카드 VIP고객 초청 아스타리프트 화장품 핸드마사지" },
      { date: "2013년 10월", title: "가로수길 갤러리카페 '코노이스페이스'에서 진행된 Dr.G 런칭행사 핸드마사지" },
      { date: "2013년 10월", title: "BGF리테일 골프대회 이천 휘닉스스프링스 골프장 VIP선수 체어마사지" },
      { date: "2013년 11월", title: "중앙일보 마라톤대회 잠실종합운동장" }
    ]
  },
  {
    year: "2012",
    items: [
      { date: "2012년 01월", title: "아모레퍼시픽 신제품 발표회 VIP고객 마사지" },
      { date: "2012년 01월", title: "전우마라톤대회 스포츠마사지" },
      { date: "2012년 05월", title: "존슨&존슨 국제성형미용엑스포 코엑스 행사 VIP고객 마사지" },
      { date: "2012년 05월", title: "로에알 한국지사 코엑스 아셈타워 마사지" },
      { date: "2012년 05월", title: "한국 노총 마라톤 대회 스포츠마사지" },
      { date: "2012년 07월", title: "서울특별시주최 여성주간 개막행사 베이비마사지" },
      { date: "2012년 07월", title: "세계미용기능대회 조직위원 임명" },
      { date: "2012년 08월", title: "카톨릭대학교 부평성모병원 의사 발마사지 서비스 지원활동" },
      { date: "2012년 10월", title: "BGF리테일 골프대회 마사지 서비스 지원활동" },
      { date: "2012년 10월", title: "가평 크리스탈 밸리 골프장 EMC CLASSIC 2011 골프대회 VIP고객 마사지" },
      { date: "2012년 10월", title: "코엑스 대한피부과학회 추계학술대회 VIP고객 마사지" },
      { date: "2012년 11월", title: "잭니클라우스 골프장 LEXUS 도요타자동차 All New LS Launching 골프대회 마사지" },
      { date: "2012년 11월", title: "블랙스톤 골프장 SPC GREEN SUMMIT 2012 골프대회 마사지" },
      { date: "2012년 11월", title: "중앙일보 마라톤 대회 CU선수 전용마사지" },
      { date: "2012년 12월", title: "피부미용사 국가자격증 저작권 심의위원회 저작권 등록" },
      { date: "2012년 12월", title: "무통경락 저작권 심의위원회 저작권 등록" }
    ]
  },
  {
    year: "2011",
    items: [
      { date: "2011년 11월", title: "피부미용사 대회 심사위원 임명" }
    ]
  },
  {
    year: "2010",
    items: [
      { date: "2010년 03월", title: "SMC아카데미 전문가과정 저작권 심의위원회 저작권 등록" },
      { date: "2010년 04월", title: "SMC아카데미 / 사단법인 한국건강관리사자격협회 홈페이지 저작권 심의위원회 저작권 등록" },
      { date: "2010년 05월", title: "국제미용심사위원 임명" },
      { date: "2010년 05월", title: "노동절 마라톤대회 잠실 종합운동장 스포츠마사지" },
      { date: "2010년 05월", title: "대림 e-편한세상 브랜드 홍보관 발마사지" },
      { date: "2010년 05월", title: "AK프라자 가족사랑더하기 걷기 대회 마사지" },
      { date: "2010년 05월", title: "대한민국 국회 우수지도사 표창장 수상" },
      { date: "2010년 07월", title: "한솔 오크밸리 리조트 마사지" },
      { date: "2010년 08월", title: "가평 잣 축제 서울 명동 홍보행사 마사지" },
      { date: "2010년 09월", title: "가평 크리스탈 밸리 골프장 EMC CLASSIC 2010 골프대회 VIP고객 마사지" }
    ]
  },
  {
    year: "2009",
    items: [
      { date: "2009년 02월", title: "문화체육관광부 문화로 따뜻한 겨울나기 정선프란치스코집 봉사활동" },
      { date: "2009년 02월", title: "문화체육관광부 문화로 따뜻한 겨울나기 태안볏가리마을 봉사활동" },
      { date: "2009년 02월", title: "문화체육부 문화로 따뜻한 겨울나기 정선 마사지" },
      { date: "2009년 04월", title: "롯데백화점 VIP고객 마사지" },
      { date: "2009년 05월", title: "제3회 국제헤어피부미용기능경진대회 피부미용부분 그랑프리수상" },
      { date: "2009년 08월", title: "이로와지 프레스 화장품 런칭 행사 경락마사지" },
      { date: "2009년 09월", title: "BMW자동차 신차 발표회 VIP고객 마사지" }
    ]
  },
  {
    year: "2008",
    items: [
      { date: "2008년 01월", title: "롯데백화점 화장품 런칭 이벤트 마사지 서비스 지원활동" },
      { date: "2008년 02월", title: "한국헤어피부미용중앙회 부회장 임명" },
      { date: "2008년 02월", title: "벽성대학교 산학협동약정" },
      { date: "2008년 03월", title: "리첸시아 스킨케어 서비스 VIP고객 지원활동" },
      { date: "2008년 04월", title: "대한펄프 매직스 봄맞이 페스티발 VIP고객" },
      { date: "2008년 05월", title: "캘빈클라인 스킨케어 VIP고객 마사지" },
      { date: "2008년 06월", title: "LG생활용품 VIP고객 마사지" },
      { date: "2008년 06월", title: "한국건강관리사자격협회 부산점오픈" },
      { date: "2008년 09월", title: "수원여자전문대학 산학협동약정" },
      { date: "2008년 10월", title: "마이크로소프트 20주년 기념행사 마사지" },
      { date: "2008년 10월", title: "국방마라톤 대회 장병들 스포츠마사지" },
      { date: "2008년 10월", title: "신림순대축제 마사지" },
      { date: "2008년 10월", title: "노동부 한국사회적기업협의회 청계천 광장 봉사활동" },
      { date: "2008년 10월", title: "노동부와 한국사회적기업협의회 마사지" },
      { date: "2008년 11월", title: "서울디자인 행사 마사지" },
      { date: "2008년 11월", title: "교원 워크샵 마사지" },
      { date: "2008년 11월", title: "대한민국 국회 윤리특별위원회 표창장 수상" },
      { date: "2008년 12월", title: "서울국제미용건강 올림픽대회 출전 대상 수상" }
    ]
  },
  {
    year: "2007",
    items: [
      { date: "2007년 01월", title: "현대기술학교 산학협동약정" },
      { date: "2007년 03월", title: "무주리조트 캐나디언클럽 스노우 캠프 위스키 VIP고객 마사지" },
      { date: "2007년 03월", title: "용인 에버렌드 스피드웨이 자동차경주 VIP고객 마사지" },
      { date: "2007년 03월", title: "애경백화점 VIP고객 마사지" },
      { date: "2007년 04월", title: "아스트라 제네카 제약회사 아타칸데이 행사 마사지" },
      { date: "2007년 05월", title: "제14회 서울국제미용경연대회 그랑프리수상" },
      { date: "2007년 05월", title: "인하대학교 봄 축제 봉사활동" },
      { date: "2007년 05월", title: "인하대학교 봄축제 마사지" },
      { date: "2007년 05월", title: "대구 동아백화점 VIP고객 피부관리 마사지" },
      { date: "2007년 06월", title: "서울여자간호전문대학 산학협동약정" },
      { date: "2007년 06월", title: "서울호서전문대학 산학협동약정" },
      { date: "2007년 06월", title: "대구 롯데백화점 VIP고객 피부관리" },
      { date: "2007년 09월", title: "뉴트로지나 풋크림 샘플링 이벤트 마사지" },
      { date: "2007년 09월", title: "에버랜드 BAT Korea Company Event VIP고객 마사지 서비스" },
      { date: "2007년 10월", title: "제34회 일본큐슈이미용경연대회 대상 수상" },
      { date: "2007년 10월", title: "KBS 해피투게더 TV방송출연" },
      { date: "2007년 10월", title: "제23회 국제미용경연대회 대상수상" },
      { date: "2007년 11월", title: "2007 국제헤어피부미용대회 최다수상" },
      { date: "2007년 11월", title: "국제미용뉴스사 주체 국제미용문화제 예술대상 수상" },
      { date: "2007년 11월", title: "대한민국국회 보건복지위원회 표창장 수상" },
      { date: "2007년 11월", title: "직능정책본부 행정자치위원회 헤어피부미용특별위원회부위원장 임명" },
      { date: "2007년 11월", title: "LG전자 VIP초청 마사지" },
      { date: "2007년 12월", title: "창조문학신문사 대한민국 CEO대상" },
      { date: "2007년 12월", title: "제17대 대통령선거 중앙선거 대책위원회 부위원장 임명" },
      { date: "2007년 12월", title: "강남 인터컨티넨탈호텔 뉴트로지나 스킨케어 아카데미 마사지" }
    ]
  },
  {
    year: "2006",
    items: [
      { date: "2006년 02월", title: "삼성프라자 백화점 VIP고객 마사지" },
      { date: "2006년 02월", title: "부천 LG백화점 VIP고객 마사지" },
      { date: "2006년 02월", title: "이화여자대학교 축제 건강관리 봉사활동" },
      { date: "2006년 02월", title: "포스포건설 인천 송도 모델하우스 VIP고객 마사지" },
      { date: "2006년 03월", title: "한국건강관리사자격협회 압구정점 오픈" },
      { date: "2006년 03월", title: "CJ증권 VIP고객 마사지" },
      { date: "2006년 03월", title: "한국건강관리사자격협회 수원점 오픈" },
      { date: "2006년 04월", title: "건강백화점 오픈 마사지" },
      { date: "2006년 05월", title: "한국건강관리사자격협회 대구점 오픈" },
      { date: "2006년 05월", title: "특허청 SMC 서비스표 상표등록" },
      { date: "2006년 05월", title: "수유시장 상인회 봉사활동" },
      { date: "2006년 05월", title: "서울 수유시장 발마사지" },
      { date: "2006년 06월", title: "GM대우 신차 발표회 무주리조트 VIP고객 마사지" },
      { date: "2006년 07월", title: "프리미엄 위스키 SINGLETON 런칭파티 VIP고객 건강" },
      { date: "2006년 07월", title: "코엑스 화장품 박람회 VIP고객 피부미용마사지" },
      { date: "2006년 08월", title: "롯데캐슬 아파트 선정 마사지 서비스 지원활동" },
      { date: "2006년 08월", title: "KBS, MBC, SBS '티라소테라피' TV방영" },
      { date: "2006년 10월", title: "서경대학교 산학협동약정" },
      { date: "2006년 10월", title: "압구정 갤러리아 백화점 Aesop 화장품 브랜드 VIP고객 마사지" },
      { date: "2006년 10월", title: "동북사범대학 산학협동약정" },
      { date: "2006년 12월", title: "한국건강관리사자격협회 국제 사단법인 등록" }
    ]
  },
  {
    year: "2005",
    items: [
      { date: "2005년 01월", title: "경문대학 산학협동약정" },
      { date: "2005년 10월", title: "SMC아카데미 종로총본부 오픈" },
      { date: "2005년 12월", title: "한국건광관리사자격협회 인천점 오픈" }
    ]
  },
  {
    year: "2004",
    items: [
      { date: "2004년 04월", title: "스포츠마사지 저작권 심사위원회 저작권 등록" }
    ]
  },
  {
    year: "2003",
    items: [
      { date: "2003년 02월", title: "연세대학교 의과대학 학생실습 지도 산학협동약정" }
    ]
  },
  {
    year: "2001",
    items: [
      { date: "2001년 09월", title: "SMC아카데미 / 한국건강관리사자격협회 서울총본부 창립" }
    ]
  }
];

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "about/history",
    title: `${t.historyPage.title} | KHCPQA`,
    description: t.historyPage.lead
  });
}

export default async function HistoryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        eyebrow={t.historyPage.eyebrow}
        title={t.historyPage.title}
        lead={t.historyPage.lead}
      />
      <AboutSubnav locale={locale} activeKey="history" />
      <section className="content-section history-section">
        <div className="history-hero">
          <Image
            src="/assets/history-hero.jpg"
            alt={t.historyPage.imageAlt}
            width={760}
            height={220}
            sizes="(max-width: 900px) 100vw, 760px"
            priority
          />
        </div>
        <nav className="history-years" aria-label={t.historyPage.yearsLabel}>
          {historyByYear.map((group) => (
            <a href={`#history-${group.year}`} key={group.year}>
              {group.year}
            </a>
          ))}
        </nav>
        <div className="history-heading">
          <h2>{t.historyPage.timelineLabel}</h2>
          <p>{t.historyPage.detailNote}</p>
        </div>
        <div className="history-timeline">
          {historyByYear.map((group) => (
            <section className="history-year-block" id={`history-${group.year}`} key={group.year}>
              <h3>{group.year}</h3>
              <div className="history-table" role="table" aria-label={`${group.year} ${t.historyPage.timelineLabel}`}>
                <div className="history-row history-row-head" role="row">
                  <span role="columnheader">{t.historyPage.dateLabel}</span>
                  <span role="columnheader">{t.historyPage.titleLabel}</span>
                </div>
                {group.items.map((item) => (
                  <div className="history-row" role="row" key={`${item.date}-${item.title}`}>
                    <time role="cell">{item.date}</time>
                    <strong role="cell">{item.title}</strong>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
