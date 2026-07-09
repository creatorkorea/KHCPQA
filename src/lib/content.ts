import {
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  Globe2,
  GraduationCap,
  Handshake,
  Image,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";

export const locales = ["ko", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export const translationStatuses = ["ready", "reviewing", "draft"] as const;
export type TranslationStatus = (typeof translationStatuses)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const localeLabels: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  es: "Español"
};

export const translationStatusLabels: Record<Locale, Record<TranslationStatus, string>> = {
  ko: {
    ready: "번역 완료",
    reviewing: "번역 검수 중",
    draft: "번역 준비 중"
  },
  en: {
    ready: "Translation ready",
    reviewing: "Translation under review",
    draft: "Translation in preparation"
  },
  es: {
    ready: "Traducción lista",
    reviewing: "Traducción en revisión",
    draft: "Traducción en preparación"
  }
};

export const pageTranslationStatus: Record<Locale, TranslationStatus> = {
  ko: "ready",
  en: "reviewing",
  es: "reviewing"
};

export function getTranslationStatus(locale: string): TranslationStatus {
  return pageTranslationStatus[isLocale(locale) ? locale : defaultLocale];
}

export function getTranslationStatusLabel(locale: Locale, status: TranslationStatus) {
  return translationStatusLabels[locale][status];
}

export const navItems = [
  { key: "about", href: "about" },
  { key: "curriculum", href: "curriculum" },
  { key: "activities", href: "activities" },
  { key: "partner", href: "partner-inquiry" },
  { key: "contact", href: "contact" }
] as const;

type FeatureCopy = {
  title: string;
  body: string;
};

type GreetingCopy = {
  name: string;
  role: string;
  meta?: string;
  imageUrl: string;
  paragraphs: string[];
  contact?: string;
};

type InstructorCopy = {
  name: string;
  role: string;
  imageUrl: string;
  profileImageUrl: string;
};

type AboutSubnavItem = {
  key: string;
  title: string;
  href?: string;
  disabled?: boolean;
};

type Copy = {
  brand: string;
  brandFull: string;
  nav: Record<(typeof navItems)[number]["key"] | "login", string>;
  heroBadge: string;
  heroTitle: string;
  heroLead: string;
  primaryCta: string;
  secondaryCta: string;
  secureCta: string;
  trustTitle: string;
  curriculumTitle: string;
  activitiesTitle: string;
  pageReady: string;
  accountTitle: string;
  adminTitle: string;
  formSubmit: string;
  menuOpen: string;
  menuClose: string;
  seo: {
    title: string;
    description: string;
  };
  home: {
    heroImageAlt: string;
    platformEyebrow: string;
    platformLead: string;
    learnMore: string;
    viewCurriculum: string;
    platformFeatures: FeatureCopy[];
    curriculumEyebrow: string;
    curriculumLead: string;
    activitiesEyebrow: string;
    activitiesLead: string;
    viewAll: string;
    viewDetails: string;
    certificationEyebrow: string;
    certificationTitle: string;
    certificationLead: string;
    certificationCta: string;
    certificateLabel: string;
  };
  about: {
    eyebrow: string;
    lead: string;
    greetingCta: string;
    features: FeatureCopy[];
  };
  aboutSubnav: AboutSubnavItem[];
  greetingPage: {
    eyebrow: string;
    title: string;
    lead: string;
    greetings: GreetingCopy[];
  };
  instructorsPage: {
    eyebrow: string;
    title: string;
    lead: string;
    instructors: InstructorCopy[];
  };
  historyPage: {
    eyebrow: string;
    title: string;
    lead: string;
    imageAlt: string;
    yearsLabel: string;
    timelineLabel: string;
    detailNote: string;
    dateLabel: string;
    titleLabel: string;
  };
  organizationPage: {
    eyebrow: string;
    title: string;
    lead: string;
    imageAlt: string;
    units: Array<{ title: string; body: string }>;
  };
  curriculumPage: {
    eyebrow: string;
    lead: string;
  };
  courseDetail: {
    inquiryCta: string;
    allCoursesCta: string;
    overviewEyebrow: string;
    overviewTitle: string;
    curriculumEyebrow: string;
    curriculumTitle: string;
    goalOverviewTitle: string;
    goalPlanTitle: string;
    goalOutcomeTitle: string;
    durationTitle: string;
    detailGroupTraining: string;
    detailGroupCareer: string;
    detailGroupSchedule: string;
    midCtaTitle: string;
    midCtaLead: string;
    sideSummaryTitle: string;
    audienceTitle: string;
    certificationTitle: string;
    sourceTitle: string;
  };
  activitiesPage: {
    eyebrow: string;
    lead: string;
  };
  contact: {
    eyebrow: string;
    lead: string;
  };
  partnerInquiry: {
    eyebrow: string;
    lead: string;
    successTitle: string;
    successMessage: string;
    validation: {
      required: string;
      email: string;
      consent: string;
    };
    fields: {
      name: string;
      namePlaceholder: string;
      organization: string;
      organizationPlaceholder: string;
      email: string;
      emailPlaceholder: string;
      country: string;
      countryPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      consent: string;
    };
  };
  login: {
    eyebrow: string;
    lead: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    previewCta: string;
    forgotPassword: string;
    backToLogin: string;
    resetCta: string;
    note: string;
    successTitle: string;
    successMessage: string;
    resetSuccessTitle: string;
    resetSuccessMessage: string;
    validation: {
      emailRequired: string;
      emailInvalid: string;
      passwordRequired: string;
      passwordLength: string;
    };
  };
  account: {
    eyebrow: string;
    lead: string;
    modules: FeatureCopy[];
    certificates: Array<{
      title: string;
      number: string;
      status: string;
    }>;
  };
  curriculumCatalog: {
    searchLabel: string;
    searchPlaceholder: string;
    categoryLabel: string;
    categories: Record<CourseCategory, string>;
    goalTitle: string;
    goalLead: string;
    catalogTitle: string;
    catalogLead: string;
    emptyState: string;
    viewDetails: string;
  };
};

export type CourseCategory = "all" | "certification" | "professional" | "practical";

export const copy = {
  ko: {
    brand: "KHCPQA",
    brandFull: "Korea Health Care Professional Qualification Association",
    nav: {
      about: "협회 소개",
      curriculum: "커리큘럼",
      activities: "글로벌 활동",
      partner: "파트너 문의",
      contact: "찾아오시는 길",
      login: "로그인"
    },
    heroBadge: "KHCPQA 글로벌 교육",
    heroTitle: "한국에서 시작되는 글로벌 전문 자격 교육",
    heroLead:
      "SMC아카데미와 한국건강관리사자격협회의 기존 교육 콘텐츠를 기반으로, 국제 파트너와 교육생을 위한 다국어 웹앱 플랫폼을 구축합니다.",
    primaryCta: "과정 보기",
    secondaryCta: "파트너 문의",
    secureCta: "로그인 후 자격 조회",
    trustTitle: "교육, 자격, 글로벌 활동을 하나의 플랫폼으로",
    curriculumTitle: "주요 과정",
    activitiesTitle: "글로벌 활동",
    pageReady: "번역 및 콘텐츠 검수 상태를 관리자에서 관리합니다.",
    accountTitle: "My Page",
    adminTitle: "관리자 대시보드",
    formSubmit: "문의 저장",
    menuOpen: "메뉴 열기",
    menuClose: "메뉴 닫기",
    seo: {
      title: "KHCPQA 글로벌 전문 자격 교육",
      description: "한국 기반 헬스케어·뷰티 전문 자격 교육, 과정 안내, 글로벌 활동, 파트너 문의를 제공하는 KHCPQA 플랫폼입니다."
    },
    home: {
      heroImageAlt: "글로벌 전문 교육을 상징하는 KHCPQA 교육생과 전문가 이미지",
      platformEyebrow: "플랫폼",
      platformLead:
        "SMC아카데미의 교육 콘텐츠와 KHCPQA의 자격 운영 기준을 연결해, 해외 교육생과 파트너가 과정 탐색부터 자격 조회까지 일관된 흐름으로 이용할 수 있게 합니다.",
      learnMore: "자세히 보기",
      viewCurriculum: "커리큘럼 보기",
      platformFeatures: [
        {
          title: "비공개 회원 영역",
          body: "My Page는 공개 메뉴에서 제외하고 로그인 후 계정 메뉴에서만 접근합니다."
        },
        {
          title: "구조화된 콘텐츠",
          body: "기존 SMC365 콘텐츠를 출처와 함께 정리해 과정, 활동, 공지로 운영합니다."
        },
        {
          title: "자격 조회 흐름",
          body: "로그인 후 자격 취득 내역을 확인하는 흐름으로 확장할 수 있게 설계합니다."
        }
      ],
      curriculumEyebrow: "커리큘럼",
      curriculumLead: "대표 교육 과정을 먼저 살펴보고 전체 과정 목록에서 세부 프로그램을 확인하세요.",
      activitiesEyebrow: "글로벌 활동",
      activitiesLead: "공지, 합격 현황, 갤러리, 국제 활동을 한 곳에서 확인할 수 있도록 연결합니다.",
      viewAll: "전체 보기",
      viewDetails: "상세 보기",
      certificationEyebrow: "자격 조회",
      certificationTitle: "자격 취득 내역을 로그인 후 확인하세요.",
      certificationLead:
        "개인별 자격 상태, 수료 기록, 발급 정보를 안전한 계정 영역에서 조회할 수 있게 확장합니다.",
      certificationCta: "자격 조회하기",
      certificateLabel: "자격 검증"
    },
    about: {
      eyebrow: "KHCPQA 소개",
      lead:
        "한국건강관리사자격협회는 건강미용 교육의 새로운 틀을 세우고, 자격증 취득부터 취업과 창업까지 이어지는 실무 중심 교육을 운영합니다.",
      greetingCta: "인사말 보기",
      features: [
        {
          title: "국가자격증 합격과 맞춤형 교육",
          body: "건강미용 산업의 성장에 맞춰 글로벌 시대와 스마트 시대에 앞선 교육을 진행합니다. 국가자격증 시험 합격을 목표로 효율적인 수업을 운영하고, 자격증 취득 노하우 영상과 수강생 맞춤형 지도를 통해 체계적인 학습을 제공합니다. 풍부한 경험을 갖춘 전임 강사진이 자격증 합격자를 원활하게 배출할 수 있도록 준비되어 있습니다."
        },
        {
          title: "취업을 위한 실무 중심 교육",
          body: "수강생들의 취업을 돕기 위해 건강미용 산업 트렌드에 앞선 기술과 취업교육 체계를 마련했습니다. SMC만의 전문 기술과 실무 위주의 교육 프로그램을 바탕으로 기초부터 전문가 과정까지 이해하기 쉽게 교육하며, 상담과 교류를 통해 원하는 취업 방향에 맞는 지원을 제공합니다."
        },
        {
          title: "문제 해결 학습 PSL",
          body: "주입식 이론교육에서 벗어나 실무를 중심으로 원리와 이론을 자연스럽게 익히는 실습 지향 문제 해결 학습을 도입했습니다. 수강생은 고객의 입장을 체험하는 모델과 실무 관리사의 입장을 체험하는 시술자로 함께 실습하며, 단계적으로 실력을 높이는 맞춤식 교육을 받습니다."
        },
        {
          title: "목표 달성을 위한 단계 교육",
          body: "수강생이 목적을 가지고 목표를 달성할 수 있도록 단계적인 실무교육, 소양교육, 예절교육을 진행합니다. 전임 강사진은 바른 실무 지도와 마음가짐을 함께 전달하며, 서비스 교육과 고객 관리 방법까지 교육해 자격증 취득, 취업, 대입, 창업으로 이어질 수 있도록 지원합니다."
        },
        {
          title: "만족도 10의 교육 시스템",
          body: "수강생이 1에서 10까지 평가했을 때 10을 받을 수 있는 교육을 목표로 수업의 질과 깊이를 높입니다. 전임강사의 밀착형 담당 지도, 요구사항 점검, 체계적인 조직 관리를 통해 지도부터 접수, 취업, 창업까지 지원하며 수강생과 꾸준히 소통하는 만족도 높은 교육을 지향합니다."
        }
      ]
    },
    aboutSubnav: [
      { key: "intro", title: "소개", href: "about" },
      { key: "greeting", title: "인사말", href: "about/greeting" },
      { key: "instructors", title: "수석강사 프로필", href: "about/instructors" },
      { key: "history", title: "연혁", href: "about/history" },
      { key: "organization", title: "조직도", href: "about/organization" },
      { key: "location", title: "찾아오시는 길", href: "contact" }
    ],
    greetingPage: {
      eyebrow: "인사말",
      title: "협회 인사말",
      lead: "건강미용 교육의 발전과 수강생의 성공을 위해 함께 성장하겠습니다.",
      greetings: [
        {
          name: "황인근",
          role: "한국건강관리사자격협회 협회장",
          meta: "연세대학교 의과대학 특성화 학생실습 지도교수",
          imageUrl: "/assets/greeting-hwang-ingeun.jpg",
          contact: "H : 010-6283-1206",
          paragraphs: [
            "협회는 한류의 성장과 함께 무한한 잠재력을 지닌 대체의학과 서비스 산업의 발전에 발맞춰 건강미용 산업 교육의 시너지를 만들 수 있는 체계를 갖추고 있습니다.",
            "수강생 여러분이 현재에서 미래로 성장할 수 있도록 함께 협력하고 상부상조하는 교류 시스템을 마련했으며, 세계 수준의 교육시스템과 체계적인 조직 관리로 맡은 역할에 충실하겠습니다.",
            "한국건강관리사자격협회는 새로운 가능성의 프로그램을 지속적으로 개발하며 회원 여러분과 동반성장을 목표로 운영합니다. 최고의 기술과 일류 교육기관으로 자리매김하며, 분명한 목표의식을 갖춘 기관으로 여러분과 함께 성장하겠습니다."
          ]
        },
        {
          name: "문순영",
          role: "한국건강관리사자격협회 부회장 / 서울총본부 본원 원장",
          imageUrl: "/assets/greeting-moon-soonyoung.jpg",
          contact: "H : 010-7712-3362",
          paragraphs: [
            "한국건강관리사자격협회 서울총본부는 지하철 1, 3, 5호선이 환승되는 종로3가역 인근, 교통이 편리한 서울 중심지에 위치하고 있습니다.",
            "전문 피부미용사, 네일미용사, 메이크업미용사, 헤어미용사, 마사지사로 취업과 창업을 준비한다면 처음 학원 선택이 중요합니다. 서울총본부는 국가기술자격 이론과 실기 교육은 물론 현장 실무용 살롱테크닉, 메디컬 스킨케어, 아로마, 경락, 스포츠, 발 마사지까지 기초부터 전문가 과정까지 체계적으로 교육합니다.",
            "수강생의 자부심과 실력이 최고가 되어야 한다는 생각으로 일류 기술 교육을 지향하며, 수강생들이 이루고자 하는 꿈을 반드시 이룰 수 있도록 지도하고 양성합니다."
          ]
        },
        {
          name: "황유진",
          role: "대림캠퍼스 원장",
          meta: "Skin-care Management Consultant",
          imageUrl: "/assets/greeting-hwang-yujin.jpg",
          contact: "T : 02-845-8820",
          paragraphs: [
            "한국건강관리사자격협회 대림캠퍼스는 지하철 2, 7호선이 환승되는 대림역 12번 출구 1분 거리에 위치해 교통이 매우 편리하며, 넓고 쾌적한 교육 환경을 제공합니다.",
            "대림캠퍼스는 피부미용사, 네일아트미용사, 헤어미용사, 전문 마사지사의 취업과 창업에 필요한 국가자격증 단기 속성 교육과 취업 실무 교육을 운영합니다. 피부관리와 마사지 교육뿐 아니라 전문관리사가 갖춰야 할 기본 소양교육과 예절교육도 철저히 진행합니다.",
            "핵심과 요약을 접목한 1~2개월 단기 특수교육을 통해 많은 수강생이 단기간에 피부미용사 국가자격증을 취득하고 있습니다. 졸업생들이 다양한 현장에서 자신감을 가지고 활동하듯, 대림캠퍼스에서 공부하고 전문관리사로 성공하시기를 기원합니다."
          ]
        },
        {
          name: "이용호",
          role: "강남마사지교육원 교육부장",
          imageUrl: "/assets/greeting-lee-yongho.jpg",
          contact: "T : 02-845-8890",
          paragraphs: [
            "강남마사지교육원은 대림역 12번 출구 1분 거리에 위치한 마사지 전문 교육원입니다. 국제화 시대와 서비스 산업 발전에 맞춰 스포츠마사지, 경락마사지, 피부마사지, 발마사지 교육을 진행합니다.",
            "피부관리실, 스파, 마사지샵, 호텔, 사우나 등 취업 알선과 창업 상담, 해외취업 추천 및 유학 컨설팅까지 지원하며, 국내외에서 인정받는 기술력과 체계적인 교육으로 높은 취업률을 지향합니다.",
            "취업을 원하는 수강생에게는 일대일 개인상담을 통해 적성, 희망 근무처, 근무시간, 보수, 지역 등을 파악하고 적합한 취업처를 최대한 빠르게 연결합니다. 마사지 전문관리사 취업과 창업을 준비하는 분들을 성심껏 상담하겠습니다."
          ]
        }
      ]
    },
    instructorsPage: {
      eyebrow: "수석강사 프로필",
      title: "수석강사 프로필",
      lead: "건강미용 실무교육과 자격증 교육을 이끄는 수석강사 프로필입니다.",
      instructors: [
        { name: "이정화", role: "수석강사", imageUrl: "/assets/instructor-lee-junghwa.jpg", profileImageUrl: "/assets/instructor-profile-lee-junghwa.jpg" },
        { name: "이유지", role: "수석강사", imageUrl: "/assets/instructor-lee-yuji.jpg", profileImageUrl: "/assets/instructor-profile-lee-yuji.jpg" },
        { name: "윤인은", role: "수석강사", imageUrl: "/assets/instructor-yoon-euneun.jpg", profileImageUrl: "/assets/instructor-profile-yoon-euneun.jpg" },
        { name: "남태현", role: "수석강사", imageUrl: "/assets/instructor-nam-taehyun.jpg", profileImageUrl: "/assets/instructor-profile-nam-taehyun.jpg" },
        { name: "차영일", role: "수석강사", imageUrl: "/assets/instructor-cha-youngil.jpg", profileImageUrl: "/assets/instructor-profile-cha-youngil.jpg" },
        { name: "이다연", role: "수석강사", imageUrl: "/assets/instructor-lee-dayeon.jpg", profileImageUrl: "/assets/instructor-profile-lee-dayeon.jpg" },
        { name: "심은아", role: "수석강사", imageUrl: "/assets/instructor-shim-euna.jpg", profileImageUrl: "/assets/instructor-profile-shim-euna.jpg" },
        { name: "조은진", role: "수석강사", imageUrl: "/assets/instructor-jo-eunjin.jpg", profileImageUrl: "/assets/instructor-profile-jo-eunjin.jpg" },
        { name: "주미현", role: "수석강사", imageUrl: "/assets/instructor-ju-mihyun.jpg", profileImageUrl: "/assets/instructor-profile-ju-mihyun.jpg" },
        { name: "김문선", role: "수석강사", imageUrl: "/assets/instructor-kim-moonsun.jpg", profileImageUrl: "/assets/instructor-profile-kim-moonsun.jpg" },
        { name: "이선화", role: "수석강사", imageUrl: "/assets/instructor-lee-seonhwa.jpg", profileImageUrl: "/assets/instructor-profile-lee-seonhwa.jpg" },
        { name: "이용호", role: "수석강사", imageUrl: "/assets/instructor-lee-yongho.jpg", profileImageUrl: "/assets/instructor-profile-lee-yongho.jpg" },
        { name: "김해림", role: "수석강사", imageUrl: "/assets/instructor-kim-haerim.jpg", profileImageUrl: "/assets/instructor-profile-kim-haerim.jpg" },
        { name: "박재영", role: "수석강사", imageUrl: "/assets/instructor-park-jaeyoung.jpg", profileImageUrl: "/assets/instructor-profile-park-jaeyoung.jpg" },
        { name: "송진화", role: "수석강사", imageUrl: "/assets/instructor-song-jinhwa.jpg", profileImageUrl: "/assets/instructor-profile-song-jinhwa.jpg" }
      ]
    },
    historyPage: {
      eyebrow: "연혁",
      title: "KHCPQA 연혁",
      lead: "한국건강관리사자격협회와 SMC아카데미가 걸어온 주요 교육, 수상, 산학협력, 행사 이력입니다.",
      imageAlt: "SMC아카데미 연혁 대표 이미지",
      yearsLabel: "연도 선택",
      timelineLabel: "연도별 주요 연혁",
      detailNote: "원본 연혁자료의 연도별 항목을 기준으로 정리했습니다.",
      dateLabel: "년월",
      titleLabel: "제목"
    },
    organizationPage: {
      eyebrow: "조직도",
      title: "KHCPQA 조직도",
      lead: "협회와 아카데미 운영 체계를 한눈에 확인할 수 있는 조직도입니다.",
      imageAlt: "한국건강관리사자격협회 SMC아카데미 조직도",
      units: [
        { title: "협회 운영", body: "한국건강관리사자격협회를 중심으로 교육, 자격, 지부 운영 체계를 관리합니다." },
        { title: "교육 운영", body: "SMC아카데미와 각 캠퍼스가 자격증 교육과 실무 교육을 담당합니다." },
        { title: "현장 지원", body: "수강 상담, 취업·창업 지원, 대외 행사와 협력 활동을 연결합니다." }
      ]
    },
    curriculumPage: {
      eyebrow: "커리큘럼",
      lead: "기존 SMC365 과정 콘텐츠를 글로벌 교육기관형 과정 카드와 상세 템플릿으로 재구성합니다."
    },
    courseDetail: {
      inquiryCta: "문의하기",
      allCoursesCta: "전체 과정 보기",
      overviewEyebrow: "개요",
      overviewTitle: "과정 개요",
      curriculumEyebrow: "커리큘럼",
      curriculumTitle: "주요 교육 내용",
      goalOverviewTitle: "목표별 과정 개요",
      goalPlanTitle: "목표 달성 학습 설계",
      goalOutcomeTitle: "상담 및 진로 안내",
      durationTitle: "교육 기간",
      detailGroupTraining: "교육과정 구성",
      detailGroupCareer: "취업 및 수익 안내",
      detailGroupSchedule: "수강 안내",
      midCtaTitle: "내 목표에 맞는 과목 조합 상담",
      midCtaLead: "취업 희망 분야와 현재 역량에 맞춰 필요한 과목과 수강 순서를 상담합니다.",
      sideSummaryTitle: "상담 요약",
      audienceTitle: "교육 대상",
      certificationTitle: "수료/자격 안내",
      sourceTitle: "원본 URL"
    },
    activitiesPage: {
      eyebrow: "글로벌 활동",
      lead: "공지, 합격현황, 갤러리, 수상경력, 국제미용대회, 방송/언론, 봉사활동을 글로벌 신뢰 콘텐츠로 재배치합니다."
    },
    contact: {
      eyebrow: "찾아오시는 길",
      lead: "서울총본부, 강남SMC아카데미, 대림캠퍼스의 주소와 지하철·버스 이용 안내입니다."
    },
    partnerInquiry: {
      eyebrow: "파트너 문의",
      lead: "해외 기관, 교육 파트너, 교육생 문의를 관리자 문의함으로 저장하는 폼입니다. 이메일/문자 자동 발송은 1차 범위에서 제외합니다.",
      successTitle: "문의가 접수 준비되었습니다.",
      successMessage: "실제 저장은 관리자 문의함 연동 후 활성화됩니다. 입력 내용은 검수용 화면 흐름에서 확인되었습니다.",
      validation: {
        required: "필수 항목을 입력해 주세요.",
        email: "올바른 이메일 주소를 입력해 주세요.",
        consent: "개인정보 수집 및 문의 처리에 동의해 주세요."
      },
      fields: {
        name: "이름",
        namePlaceholder: "이름을 입력하세요",
        organization: "기관/회사",
        organizationPlaceholder: "기관 또는 회사명",
        email: "이메일",
        emailPlaceholder: "name@example.com",
        country: "국가",
        countryPlaceholder: "국가",
        message: "문의 내용",
        messagePlaceholder: "파트너십 관심 분야를 알려주세요",
        consent: "개인정보 수집 및 문의 처리에 동의합니다."
      }
    },
    login: {
      eyebrow: "보안 로그인",
      lead: "Supabase Auth 연결 전 UI 단계입니다. 로그인 후 My Page와 자격 조회 메뉴가 노출되는 정책을 화면에 반영합니다.",
      email: "이메일",
      emailPlaceholder: "name@example.com",
      password: "비밀번호",
      passwordPlaceholder: "비밀번호",
      previewCta: "My Page 미리보기",
      forgotPassword: "비밀번호를 잊으셨나요?",
      backToLogin: "로그인으로 돌아가기",
      resetCta: "비밀번호 재설정 안내 받기",
      note: "실제 인증은 Supabase 환경변수 설정 후 연결합니다.",
      successTitle: "데모 로그인이 준비되었습니다.",
      successMessage: "잠시 후 My Page 미리보기로 이동합니다.",
      resetSuccessTitle: "재설정 안내가 준비되었습니다.",
      resetSuccessMessage: "실제 이메일 발송은 Supabase Auth 연결 후 활성화됩니다.",
      validation: {
        emailRequired: "이메일을 입력해 주세요.",
        emailInvalid: "올바른 이메일 주소를 입력해 주세요.",
        passwordRequired: "비밀번호를 입력해 주세요.",
        passwordLength: "비밀번호는 6자 이상 입력해 주세요."
      }
    },
    account: {
      eyebrow: "보호된 계정 영역",
      lead: "공개 메뉴에는 노출되지 않는 로그인 후 사용자 전용 영역입니다. 실제 배포 전 서버 인증 보호를 연결합니다.",
      modules: [
        { title: "프로필", body: "이름, 이메일, 국가, 선호 언어를 확인하고 수정합니다." },
        { title: "자격 조회", body: "샘플 자격 데이터 기준으로 과정명, 발급일, 상태를 표시합니다." },
        { title: "문의 내역", body: "사용자가 남긴 문의 내역을 확인합니다." },
        { title: "검색엔진 비노출", body: "계정 페이지는 검색엔진 노출을 금지합니다." }
      ],
      certificates: [
        { title: "피부미용사 국가자격증", number: "자격 번호 SMC-2026-001", status: "활성" },
        { title: "아로마 테라피", number: "자격 번호 SMC-2026-014", status: "검수 대기" }
      ]
    },
    curriculumCatalog: {
      searchLabel: "커리큘럼 검색",
      searchPlaceholder: "과정 검색",
      categoryLabel: "과정 카테고리",
      categories: {
        all: "전체",
        certification: "자격 과정",
        professional: "목표별 과정",
        practical: "실무 프로그램"
      },
      goalTitle: "목표별 추천 과정",
      goalLead: "취업, 창업, 시간 제약 등 수강 목적에 맞춰 과목 조합과 학습 흐름을 설계하는 과정입니다.",
      catalogTitle: "실무·자격 교육과정",
      catalogLead: "현장에서 활용할 수 있는 기술 과목과 자격 과정을 확인하세요.",
      emptyState: "조건에 맞는 과정이 없습니다. 검색어 또는 카테고리를 조정해 주세요.",
      viewDetails: "상세 보기"
    }
  },
  en: {
    brand: "KHCPQA",
    brandFull: "Korea Health Care Professional Qualification Association",
    nav: {
      about: "About",
      curriculum: "Curriculum",
      activities: "Global Activities",
      partner: "Partner Inquiry",
      contact: "Contact",
      login: "Login"
    },
    heroBadge: "KHCPQA Global Education",
    heroTitle: "Global Professional Qualification Education from Korea",
    heroLead:
      "A multilingual webapp platform for international partners and trainees, built from the existing SMC Academy and KHCPQA education content.",
    primaryCta: "Explore Programs",
    secondaryCta: "Request Partnership",
    secureCta: "Login to Check Certification",
    trustTitle: "Education, certification, and global activities in one platform",
    curriculumTitle: "Featured Programs",
    activitiesTitle: "Global Activities",
    pageReady: "Translation and content review status is managed in the admin.",
    accountTitle: "My Page",
    adminTitle: "Admin Dashboard",
    formSubmit: "Save Inquiry",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    seo: {
      title: "KHCPQA Global Professional Qualification Education",
      description: "A Korea-based multilingual platform for healthcare and beauty professional qualification education, programs, global activities, and partner inquiries."
    },
    home: {
      heroImageAlt: "KHCPQA trainees and professionals representing global qualification education",
      platformEyebrow: "Platform",
      platformLead:
        "The platform connects SMC Academy education content with KHCPQA qualification standards so international trainees and partners can move from program discovery to certification inquiry in one consistent flow.",
      learnMore: "Learn more",
      viewCurriculum: "View curriculum",
      platformFeatures: [
        {
          title: "Private Member Area",
          body: "My Page stays out of the public menu and is available only after login through the account menu."
        },
        {
          title: "Structured Content",
          body: "Existing SMC365 content is organized with source references across programs, activities, and notices."
        },
        {
          title: "Certification Flow",
          body: "The experience is designed to expand into a secure login-based certification history lookup."
        }
      ],
      curriculumEyebrow: "Curriculum",
      curriculumLead: "Review featured programs first, then explore the full catalog for detailed course information.",
      activitiesEyebrow: "Global Activities",
      activitiesLead: "Notices, pass records, galleries, and international activities are connected in one place.",
      viewAll: "View all",
      viewDetails: "View details",
      certificationEyebrow: "Certification Inquiry",
      certificationTitle: "Check certification records after login.",
      certificationLead:
        "Individual certification status, completion records, and issuance details can be expanded into a secure account area.",
      certificationCta: "Check certification",
      certificateLabel: "Certificate Verification"
    },
    about: {
      eyebrow: "About KHCPQA",
      lead:
        "KHCPQA builds a practical education pathway for health and beauty learners, connecting certification, employment, and business goals.",
      greetingCta: "Read greetings",
      features: [
        {
          title: "Certification Success and Tailored Training",
          body: "KHCPQA responds to the growth of the health and beauty industry with forward-looking education for national certification success. Learners receive efficient classes, certification know-how videos, tailored guidance, and support from experienced full-time instructors."
        },
        {
          title: "Practice-Based Employment Education",
          body: "The academy provides SMC's professional techniques and hands-on programs to support employment. Learners build practical skills from fundamentals to expert-level training, with counseling and career support aligned to their goals."
        },
        {
          title: "PSL Problem-Solving Learning",
          body: "KHCPQA moves beyond lecture-only theory and applies practice-oriented PSL education. Learners understand principles through hands-on work, alternate between client and practitioner perspectives, and develop skills step by step."
        },
        {
          title: "Step-by-Step Goal Achievement",
          body: "Learners receive practical training, character education, and etiquette education so they can pursue clear goals. Instructors guide technical skills, service mindset, customer care, certification, employment, admission, and business preparation."
        },
        {
          title: "A Satisfaction-Focused System",
          body: "The academy aims for education that learners can rate highly in both quality and depth. Close instructor guidance, careful feedback checks, and organized support cover training, enrollment, employment, and business preparation."
        }
      ]
    },
    aboutSubnav: [
      { key: "intro", title: "Introduction", href: "about" },
      { key: "greeting", title: "Greetings", href: "about/greeting" },
      { key: "instructors", title: "Senior Instructor Profiles", href: "about/instructors" },
      { key: "history", title: "History", href: "about/history" },
      { key: "organization", title: "Organization", href: "about/organization" },
      { key: "location", title: "Location", href: "contact" }
    ],
    greetingPage: {
      eyebrow: "Greetings",
      title: "Leadership Greetings",
      lead: "We grow together with learners through professional health and beauty education.",
      greetings: [
        {
          name: "Hwang In-geun",
          role: "President, Korea Health Manager Approved Association",
          meta: "Specialized student practice advisor, Yonsei University College of Medicine",
          imageUrl: "/assets/greeting-hwang-ingeun.jpg",
          contact: "H : 010-6283-1206",
          paragraphs: [
            "The association is structured to create new educational synergy for the health and beauty industry in step with the growth of alternative medicine and service industries.",
            "KHCPQA maintains an exchange system that helps learners grow from the present into the future, and it will continue to fulfill its role through a world-class education system and organized management.",
            "The association develops programs with new possibilities and aims for shared growth with its members. It will grow as an institution with clear goals, advanced techniques, and first-class education."
          ]
        },
        {
          name: "Moon Soon-young",
          role: "Vice President / Director, Seoul Headquarters",
          imageUrl: "/assets/greeting-moon-soonyoung.jpg",
          contact: "H : 010-7712-3362",
          paragraphs: [
            "The Seoul Headquarters is located in central Seoul near Jongno 3-ga Station, where subway lines 1, 3, and 5 connect.",
            "For learners preparing for careers and business in skincare, nail, makeup, hair, and massage fields, the first academy choice is important. Seoul Headquarters provides national certification theory and practical training as well as salon techniques, medical skincare, aroma, meridian, sports, and foot massage from fundamentals to expert levels.",
            "The headquarters pursues first-class technical education so learners can build both pride and skill, and it guides students toward achieving their professional dreams."
          ]
        },
        {
          name: "Hwang Yu-jin",
          role: "Director, Daerim Campus",
          meta: "Skin-care Management Consultant",
          imageUrl: "/assets/greeting-hwang-yujin.jpg",
          contact: "T : 02-845-8820",
          paragraphs: [
            "Daerim Campus is located one minute from Exit 12 of Daerim Station, where subway lines 2 and 7 connect, offering convenient access and a clean, comfortable learning environment.",
            "The campus provides accelerated national certification education and practical employment training for skincare, nail art, hair, and massage careers, along with character and etiquette education required of professional practitioners.",
            "Through focused one- to two-month special programs, many students earn skincare national certification quickly. The campus hopes learners will study with confidence and succeed as professional practitioners."
          ]
        },
        {
          name: "Lee Yong-ho",
          role: "Education Director, Gangnam Massage Institute",
          imageUrl: "/assets/greeting-lee-yongho.jpg",
          contact: "T : 02-845-8890",
          paragraphs: [
            "Gangnam Massage Institute is a professional massage education center located one minute from Exit 12 of Daerim Station. It teaches sports massage, meridian massage, skincare massage, and foot massage for the global service industry.",
            "The institute supports employment placement, business consulting, overseas employment recommendations, and study-abroad consulting for spas, massage shops, hotels, saunas, and skincare workplaces.",
            "Through one-on-one counseling, the institute identifies each learner's aptitude, desired workplace, schedule, compensation, and region, then connects them to suitable employment as quickly as possible."
          ]
        }
      ]
    },
    instructorsPage: {
      eyebrow: "Senior Instructors",
      title: "Senior Instructor Profiles",
      lead: "Senior instructors leading practical health and beauty training and certification education.",
      instructors: [
        { name: "Lee Jung-hwa", role: "Senior Instructor", imageUrl: "/assets/instructor-lee-junghwa.jpg", profileImageUrl: "/assets/instructor-profile-lee-junghwa.jpg" },
        { name: "Lee Yu-ji", role: "Senior Instructor", imageUrl: "/assets/instructor-lee-yuji.jpg", profileImageUrl: "/assets/instructor-profile-lee-yuji.jpg" },
        { name: "Yoon Eun-eun", role: "Senior Instructor", imageUrl: "/assets/instructor-yoon-euneun.jpg", profileImageUrl: "/assets/instructor-profile-yoon-euneun.jpg" },
        { name: "Nam Tae-hyun", role: "Senior Instructor", imageUrl: "/assets/instructor-nam-taehyun.jpg", profileImageUrl: "/assets/instructor-profile-nam-taehyun.jpg" },
        { name: "Cha Young-il", role: "Senior Instructor", imageUrl: "/assets/instructor-cha-youngil.jpg", profileImageUrl: "/assets/instructor-profile-cha-youngil.jpg" },
        { name: "Lee Da-yeon", role: "Senior Instructor", imageUrl: "/assets/instructor-lee-dayeon.jpg", profileImageUrl: "/assets/instructor-profile-lee-dayeon.jpg" },
        { name: "Shim Eun-a", role: "Senior Instructor", imageUrl: "/assets/instructor-shim-euna.jpg", profileImageUrl: "/assets/instructor-profile-shim-euna.jpg" },
        { name: "Jo Eun-jin", role: "Senior Instructor", imageUrl: "/assets/instructor-jo-eunjin.jpg", profileImageUrl: "/assets/instructor-profile-jo-eunjin.jpg" },
        { name: "Ju Mi-hyun", role: "Senior Instructor", imageUrl: "/assets/instructor-ju-mihyun.jpg", profileImageUrl: "/assets/instructor-profile-ju-mihyun.jpg" },
        { name: "Kim Moon-sun", role: "Senior Instructor", imageUrl: "/assets/instructor-kim-moonsun.jpg", profileImageUrl: "/assets/instructor-profile-kim-moonsun.jpg" },
        { name: "Lee Seon-hwa", role: "Senior Instructor", imageUrl: "/assets/instructor-lee-seonhwa.jpg", profileImageUrl: "/assets/instructor-profile-lee-seonhwa.jpg" },
        { name: "Lee Yong-ho", role: "Senior Instructor", imageUrl: "/assets/instructor-lee-yongho.jpg", profileImageUrl: "/assets/instructor-profile-lee-yongho.jpg" },
        { name: "Kim Hae-rim", role: "Senior Instructor", imageUrl: "/assets/instructor-kim-haerim.jpg", profileImageUrl: "/assets/instructor-profile-kim-haerim.jpg" },
        { name: "Park Jae-young", role: "Senior Instructor", imageUrl: "/assets/instructor-park-jaeyoung.jpg", profileImageUrl: "/assets/instructor-profile-park-jaeyoung.jpg" },
        { name: "Song Jin-hwa", role: "Senior Instructor", imageUrl: "/assets/instructor-song-jinhwa.jpg", profileImageUrl: "/assets/instructor-profile-song-jinhwa.jpg" }
      ]
    },
    historyPage: {
      eyebrow: "History",
      title: "KHCPQA History",
      lead: "Major education, awards, partnerships, and event records of KHCPQA and SMC Academy.",
      imageAlt: "SMC Academy history representative image",
      yearsLabel: "Years",
      timelineLabel: "Timeline by year",
      detailNote: "Organized from the year-by-year records on the original history page.",
      dateLabel: "Date",
      titleLabel: "Title"
    },
    organizationPage: {
      eyebrow: "Organization",
      title: "KHCPQA Organization",
      lead: "An overview of the association and academy operating structure.",
      imageAlt: "KHCPQA and SMC Academy organization chart",
      units: [
        { title: "Association Operations", body: "KHCPQA manages the education, certification, and branch operating framework." },
        { title: "Education Operations", body: "SMC Academy and campus teams deliver certification training and practical education." },
        { title: "Field Support", body: "Counseling, employment and business support, public events, and partner activities are coordinated together." }
      ]
    },
    curriculumPage: {
      eyebrow: "Curriculum",
      lead: "Existing SMC365 program content is reorganized into global education program cards and detail templates."
    },
    courseDetail: {
      inquiryCta: "Inquire",
      allCoursesCta: "All programs",
      overviewEyebrow: "Overview",
      overviewTitle: "Program Overview",
      curriculumEyebrow: "Curriculum",
      curriculumTitle: "Key Training Content",
      goalOverviewTitle: "Goal-Based Program Overview",
      goalPlanTitle: "Goal Achievement Learning Plan",
      goalOutcomeTitle: "Advising and Career Path",
      durationTitle: "Training Duration",
      detailGroupTraining: "Program Structure",
      detailGroupCareer: "Career and Income Guidance",
      detailGroupSchedule: "Class Guidance",
      midCtaTitle: "Get a Course Mix Consultation",
      midCtaLead: "We help plan subjects and sequence around your target role and current skill level.",
      sideSummaryTitle: "Consultation Summary",
      audienceTitle: "Audience",
      certificationTitle: "Completion / Certification",
      sourceTitle: "Source URL"
    },
    activitiesPage: {
      eyebrow: "Global Activities",
      lead: "Notices, pass records, galleries, awards, international beauty competitions, media, and volunteer activities are reorganized as global trust content."
    },
    contact: {
      eyebrow: "Location",
      lead: "Addresses and subway, bus, and parking guidance for Seoul Headquarters, Gangnam SMC Academy, and Daerim Campus."
    },
    partnerInquiry: {
      eyebrow: "Partner Inquiry",
      lead: "International institutions, education partners, and trainees can submit inquiries to the admin inbox. Automated email and SMS replies are outside the first release.",
      successTitle: "Inquiry ready for submission.",
      successMessage: "Actual storage will be enabled after the admin inquiry inbox is connected. This confirms the review-stage form flow.",
      validation: {
        required: "Please complete this required field.",
        email: "Please enter a valid email address.",
        consent: "Please agree to personal information collection and inquiry processing."
      },
      fields: {
        name: "Name",
        namePlaceholder: "Your name",
        organization: "Organization",
        organizationPlaceholder: "Institution or company",
        email: "Email",
        emailPlaceholder: "name@example.com",
        country: "Country",
        countryPlaceholder: "Country",
        message: "Message",
        messagePlaceholder: "Tell us about your partnership interest",
        consent: "I agree to the collection of personal information and inquiry processing."
      }
    },
    login: {
      eyebrow: "Secure Login",
      lead: "This is the UI stage before Supabase Auth is connected. After login, My Page and certification inquiry access will be shown according to policy.",
      email: "Email",
      emailPlaceholder: "name@example.com",
      password: "Password",
      passwordPlaceholder: "Password",
      previewCta: "Preview My Page",
      forgotPassword: "Forgot password?",
      backToLogin: "Back to login",
      resetCta: "Send reset instructions",
      note: "Real authentication will be connected after Supabase environment variables are configured.",
      successTitle: "Demo login is ready.",
      successMessage: "Redirecting to the My Page preview shortly.",
      resetSuccessTitle: "Reset instructions are ready.",
      resetSuccessMessage: "Actual email delivery will be enabled after Supabase Auth is connected.",
      validation: {
        emailRequired: "Please enter your email.",
        emailInvalid: "Please enter a valid email address.",
        passwordRequired: "Please enter your password.",
        passwordLength: "Password must be at least 6 characters."
      }
    },
    account: {
      eyebrow: "Protected Account Area",
      lead: "This login-only user area is not shown in the public menu. Server-side authentication protection will be connected before production release.",
      modules: [
        { title: "Profile", body: "Review and edit name, email, country, and preferred language." },
        { title: "Certification Inquiry", body: "Display program name, issue date, and status from sample certification data." },
        { title: "Inquiry History", body: "Review inquiries submitted by the user." },
        { title: "Noindex", body: "Account pages are blocked from search engine indexing." }
      ],
      certificates: [
        { title: "National Esthetician Certification", number: "Certificate No. SMC-2026-001", status: "Active" },
        { title: "Aromatherapy", number: "Certificate No. SMC-2026-014", status: "Pending review" }
      ]
    },
    curriculumCatalog: {
      searchLabel: "Search curriculum",
      searchPlaceholder: "Search courses",
      categoryLabel: "Course categories",
      categories: {
        all: "All",
        certification: "Certification",
        professional: "Goal-Based Programs",
        practical: "Practical Program"
      },
      goalTitle: "Goal-Based Recommended Programs",
      goalLead: "Programs designed around employment, startup preparation, schedule constraints, and each learner's purpose.",
      catalogTitle: "Practical and Certification Programs",
      catalogLead: "Explore technical training and certification programs for field use.",
      emptyState: "No programs match your filters. Adjust the keyword or category.",
      viewDetails: "View Details"
    }
  },
  es: {
    brand: "KHCPQA",
    brandFull: "Korea Health Care Professional Qualification Association",
    nav: {
      about: "Acerca de",
      curriculum: "Currículo",
      activities: "Actividades Globales",
      partner: "Consulta de Asociación",
      contact: "Contacto",
      login: "Iniciar Sesión"
    },
    heroBadge: "Educación Global KHCPQA",
    heroTitle: "Educación Global de Cualificaciones Profesionales desde Corea",
    heroLead:
      "Una plataforma web multilingüe para socios internacionales y estudiantes, basada en el contenido educativo existente de SMC Academy y KHCPQA.",
    primaryCta: "Explorar Programas",
    secondaryCta: "Solicitar Alianza",
    secureCta: "Consultar Certificación",
    trustTitle: "Educación, certificación y actividades globales en una plataforma",
    curriculumTitle: "Programas Principales",
    activitiesTitle: "Actividades Globales",
    pageReady: "El estado de traducción y revisión se gestiona desde el administrador.",
    accountTitle: "My Page",
    adminTitle: "Panel de Administración",
    formSubmit: "Guardar Consulta",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    seo: {
      title: "KHCPQA Educación Global de Cualificaciones Profesionales",
      description: "Plataforma multilingüe basada en Corea para educación profesional en salud y belleza, programas, actividades globales y consultas de asociación."
    },
    home: {
      heroImageAlt: "Estudiantes y profesionales de KHCPQA que representan la educación global de cualificaciones",
      platformEyebrow: "Plataforma",
      platformLead:
        "La plataforma conecta el contenido educativo de SMC Academy con los estándares de certificación de KHCPQA para que estudiantes y socios internacionales avancen desde la búsqueda de programas hasta la consulta de certificaciones en un flujo coherente.",
      learnMore: "Más información",
      viewCurriculum: "Ver currículo",
      platformFeatures: [
        {
          title: "Área privada de miembros",
          body: "My Page no aparece en el menú público y solo se accede después de iniciar sesión desde el menú de cuenta."
        },
        {
          title: "Contenido estructurado",
          body: "El contenido existente de SMC365 se organiza con referencias de origen en programas, actividades y avisos."
        },
        {
          title: "Flujo de certificación",
          body: "La experiencia está diseñada para ampliarse a una consulta segura del historial de certificaciones con inicio de sesión."
        }
      ],
      curriculumEyebrow: "Currículo",
      curriculumLead: "Revise primero los programas destacados y luego explore el catálogo completo para ver detalles.",
      activitiesEyebrow: "Actividades Globales",
      activitiesLead: "Avisos, resultados, galerías y actividades internacionales se conectan en un solo lugar.",
      viewAll: "Ver todo",
      viewDetails: "Ver detalles",
      certificationEyebrow: "Consulta de Certificación",
      certificationTitle: "Consulte los registros de certificación después de iniciar sesión.",
      certificationLead:
        "El estado de certificación, los registros de finalización y los datos de emisión pueden ampliarse dentro de un área segura de cuenta.",
      certificationCta: "Consultar certificación",
      certificateLabel: "Verificación de Certificado"
    },
    about: {
      eyebrow: "Acerca de KHCPQA",
      lead:
        "KHCPQA ofrece una ruta educativa práctica para salud y belleza, conectando certificación, empleo y preparación para emprendimiento.",
      greetingCta: "Ver saludos",
      features: [
        {
          title: "Certificación y formación personalizada",
          body: "KHCPQA responde al crecimiento de la industria de salud y belleza con educación orientada a la certificación nacional. Los estudiantes reciben clases eficientes, videos de know-how, guía personalizada y apoyo de instructores con experiencia."
        },
        {
          title: "Educación práctica para empleo",
          body: "La academia ofrece técnicas profesionales de SMC y programas prácticos para apoyar el empleo. Los estudiantes desarrollan habilidades desde lo básico hasta un nivel experto, con asesoría y apoyo profesional según sus objetivos."
        },
        {
          title: "Aprendizaje PSL",
          body: "KHCPQA supera la educación teórica tradicional y aplica aprendizaje práctico de resolución de problemas. Los estudiantes comprenden principios mediante práctica, alternan perspectivas de cliente y profesional, y desarrollan habilidades paso a paso."
        },
        {
          title: "Logro de objetivos por etapas",
          body: "Los estudiantes reciben formación práctica, educación de actitud y etiqueta para avanzar hacia metas claras. Los instructores guían técnica, servicio, atención al cliente, certificación, empleo, admisión y preparación de negocio."
        },
        {
          title: "Sistema centrado en satisfacción",
          body: "La academia busca una educación valorada por su calidad y profundidad. La guía cercana de instructores, la revisión de necesidades y el soporte organizado cubren formación, inscripción, empleo y emprendimiento."
        }
      ]
    },
    aboutSubnav: [
      { key: "intro", title: "Introducción", href: "about" },
      { key: "greeting", title: "Saludos", href: "about/greeting" },
      { key: "instructors", title: "Instructores principales", href: "about/instructors" },
      { key: "history", title: "Historia", href: "about/history" },
      { key: "organization", title: "Organización", href: "about/organization" },
      { key: "location", title: "Ubicación", href: "contact" }
    ],
    greetingPage: {
      eyebrow: "Saludos",
      title: "Saludos de la Dirección",
      lead: "Crecemos junto con los estudiantes mediante educación profesional en salud y belleza.",
      greetings: [
        {
          name: "Hwang In-geun",
          role: "Presidente de Korea Health Manager Approved Association",
          meta: "Profesor guía de práctica estudiantil especializada, Yonsei University College of Medicine",
          imageUrl: "/assets/greeting-hwang-ingeun.jpg",
          contact: "H : 010-6283-1206",
          paragraphs: [
            "La asociación cuenta con un sistema educativo diseñado para crear sinergia en la formación de salud y belleza junto con el crecimiento de la medicina alternativa y la industria de servicios.",
            "KHCPQA mantiene un sistema de intercambio para ayudar a los estudiantes a crecer desde el presente hacia el futuro, y seguirá cumpliendo su papel mediante educación de nivel mundial y gestión organizada.",
            "La asociación desarrolla programas con nuevas posibilidades y busca crecer junto con sus miembros como una institución con objetivos claros, tecnología avanzada y educación de primer nivel."
          ]
        },
        {
          name: "Moon Soon-young",
          role: "Vicepresidenta / Directora de la Sede Central de Seúl",
          imageUrl: "/assets/greeting-moon-soonyoung.jpg",
          contact: "H : 010-7712-3362",
          paragraphs: [
            "La sede central de Seúl está ubicada en el centro de la ciudad, cerca de la estación Jongno 3-ga, donde conectan las líneas 1, 3 y 5 del metro.",
            "Para quienes preparan empleo o emprendimiento en estética, uñas, maquillaje, peluquería y masaje, la primera elección de academia es importante. La sede ofrece teoría y práctica para certificación nacional, además de técnicas de salón, skincare médico, aroma, meridiano, deportes y masaje de pies desde nivel básico hasta experto.",
            "La sede busca una educación técnica de primer nivel para que los estudiantes desarrollen orgullo y capacidad, y los guía para alcanzar sus sueños profesionales."
          ]
        },
        {
          name: "Hwang Yu-jin",
          role: "Directora del Campus Daerim",
          meta: "Skin-care Management Consultant",
          imageUrl: "/assets/greeting-hwang-yujin.jpg",
          contact: "T : 02-845-8820",
          paragraphs: [
            "El Campus Daerim está a un minuto de la salida 12 de la estación Daerim, donde conectan las líneas 2 y 7, con acceso cómodo y un ambiente amplio, limpio y agradable.",
            "El campus ofrece educación intensiva para certificaciones nacionales y formación práctica para empleo en estética, uñas, peluquería y masaje, junto con educación de actitud y etiqueta profesional.",
            "Mediante programas especiales de uno a dos meses, muchos estudiantes obtienen rápidamente la certificación nacional de estética. El campus desea que los estudiantes aprendan con confianza y tengan éxito como profesionales."
          ]
        },
        {
          name: "Lee Yong-ho",
          role: "Director de Educación, Gangnam Massage Institute",
          imageUrl: "/assets/greeting-lee-yongho.jpg",
          contact: "T : 02-845-8890",
          paragraphs: [
            "Gangnam Massage Institute es un centro especializado en masaje ubicado a un minuto de la salida 12 de la estación Daerim. Enseña masaje deportivo, meridiano, facial/corporal y de pies para la industria global de servicios.",
            "El instituto apoya colocación laboral, consultoría de emprendimiento, recomendaciones de empleo en el extranjero y consultoría de estudios para spas, centros de masaje, hoteles, saunas y espacios de skincare.",
            "Mediante asesoría individual, identifica la aptitud, lugar de trabajo deseado, horario, remuneración y zona de cada estudiante para conectarlo con oportunidades adecuadas lo antes posible."
          ]
        }
      ]
    },
    instructorsPage: {
      eyebrow: "Instructores principales",
      title: "Perfiles de instructores principales",
      lead: "Instructores principales que dirigen la formación práctica en salud, belleza y certificación.",
      instructors: [
        { name: "Lee Jung-hwa", role: "Instructora principal", imageUrl: "/assets/instructor-lee-junghwa.jpg", profileImageUrl: "/assets/instructor-profile-lee-junghwa.jpg" },
        { name: "Lee Yu-ji", role: "Instructora principal", imageUrl: "/assets/instructor-lee-yuji.jpg", profileImageUrl: "/assets/instructor-profile-lee-yuji.jpg" },
        { name: "Yoon Eun-eun", role: "Instructora principal", imageUrl: "/assets/instructor-yoon-euneun.jpg", profileImageUrl: "/assets/instructor-profile-yoon-euneun.jpg" },
        { name: "Nam Tae-hyun", role: "Instructor principal", imageUrl: "/assets/instructor-nam-taehyun.jpg", profileImageUrl: "/assets/instructor-profile-nam-taehyun.jpg" },
        { name: "Cha Young-il", role: "Instructor principal", imageUrl: "/assets/instructor-cha-youngil.jpg", profileImageUrl: "/assets/instructor-profile-cha-youngil.jpg" },
        { name: "Lee Da-yeon", role: "Instructora principal", imageUrl: "/assets/instructor-lee-dayeon.jpg", profileImageUrl: "/assets/instructor-profile-lee-dayeon.jpg" },
        { name: "Shim Eun-a", role: "Instructora principal", imageUrl: "/assets/instructor-shim-euna.jpg", profileImageUrl: "/assets/instructor-profile-shim-euna.jpg" },
        { name: "Jo Eun-jin", role: "Instructora principal", imageUrl: "/assets/instructor-jo-eunjin.jpg", profileImageUrl: "/assets/instructor-profile-jo-eunjin.jpg" },
        { name: "Ju Mi-hyun", role: "Instructora principal", imageUrl: "/assets/instructor-ju-mihyun.jpg", profileImageUrl: "/assets/instructor-profile-ju-mihyun.jpg" },
        { name: "Kim Moon-sun", role: "Instructora principal", imageUrl: "/assets/instructor-kim-moonsun.jpg", profileImageUrl: "/assets/instructor-profile-kim-moonsun.jpg" },
        { name: "Lee Seon-hwa", role: "Instructora principal", imageUrl: "/assets/instructor-lee-seonhwa.jpg", profileImageUrl: "/assets/instructor-profile-lee-seonhwa.jpg" },
        { name: "Lee Yong-ho", role: "Instructor principal", imageUrl: "/assets/instructor-lee-yongho.jpg", profileImageUrl: "/assets/instructor-profile-lee-yongho.jpg" },
        { name: "Kim Hae-rim", role: "Instructora principal", imageUrl: "/assets/instructor-kim-haerim.jpg", profileImageUrl: "/assets/instructor-profile-kim-haerim.jpg" },
        { name: "Park Jae-young", role: "Instructor principal", imageUrl: "/assets/instructor-park-jaeyoung.jpg", profileImageUrl: "/assets/instructor-profile-park-jaeyoung.jpg" },
        { name: "Song Jin-hwa", role: "Instructora principal", imageUrl: "/assets/instructor-song-jinhwa.jpg", profileImageUrl: "/assets/instructor-profile-song-jinhwa.jpg" }
      ]
    },
    historyPage: {
      eyebrow: "Historia",
      title: "Historia de KHCPQA",
      lead: "Principales registros de educación, premios, alianzas y eventos de KHCPQA y SMC Academy.",
      imageAlt: "Imagen representativa de la historia de SMC Academy",
      yearsLabel: "Años",
      timelineLabel: "Cronología por año",
      detailNote: "Organizado a partir de los registros por año de la página original.",
      dateLabel: "Fecha",
      titleLabel: "Título"
    },
    organizationPage: {
      eyebrow: "Organización",
      title: "Organización de KHCPQA",
      lead: "Una vista general de la estructura operativa de la asociación y la academia.",
      imageAlt: "Organigrama de KHCPQA y SMC Academy",
      units: [
        { title: "Operación de la asociación", body: "KHCPQA gestiona el marco de educación, certificación y operación de sedes." },
        { title: "Operación educativa", body: "SMC Academy y los campus imparten formación de certificación y educación práctica." },
        { title: "Soporte de campo", body: "La asesoría, el apoyo laboral y de emprendimiento, los eventos y las alianzas se coordinan de forma integrada." }
      ]
    },
    curriculumPage: {
      eyebrow: "Currículo",
      lead: "El contenido existente de programas SMC365 se reorganiza en tarjetas y plantillas detalladas para una institución educativa global."
    },
    courseDetail: {
      inquiryCta: "Consultar",
      allCoursesCta: "Todos los programas",
      overviewEyebrow: "Resumen",
      overviewTitle: "Resumen del Programa",
      curriculumEyebrow: "Currículo",
      curriculumTitle: "Contenido Principal de Formación",
      goalOverviewTitle: "Resumen del Programa por Objetivo",
      goalPlanTitle: "Plan de Aprendizaje por Objetivo",
      goalOutcomeTitle: "Asesoría y Ruta Profesional",
      durationTitle: "Duración de Formación",
      detailGroupTraining: "Estructura del Programa",
      detailGroupCareer: "Guía de Empleo e Ingresos",
      detailGroupSchedule: "Guía de Clases",
      midCtaTitle: "Consulta de Combinación de Cursos",
      midCtaLead: "Planificamos materias y secuencia según su campo objetivo y nivel actual.",
      sideSummaryTitle: "Resumen de Consulta",
      audienceTitle: "Dirigido a",
      certificationTitle: "Finalización / Certificación",
      sourceTitle: "URL de origen"
    },
    activitiesPage: {
      eyebrow: "Actividades Globales",
      lead: "Avisos, resultados, galerías, premios, concursos internacionales de belleza, medios y voluntariado se reorganizan como contenido global de confianza."
    },
    contact: {
      eyebrow: "Ubicación",
      lead: "Direcciones e información de metro, autobús y estacionamiento para la sede de Seúl, Gangnam SMC Academy y el Campus Daerim."
    },
    partnerInquiry: {
      eyebrow: "Consulta de Asociación",
      lead: "Instituciones internacionales, socios educativos y estudiantes pueden enviar consultas al buzón del administrador. Las respuestas automáticas por email/SMS quedan fuera de la primera versión.",
      successTitle: "Consulta lista para enviar.",
      successMessage: "El guardado real se activará después de conectar el buzón de consultas del administrador. Esto confirma el flujo del formulario en revisión.",
      validation: {
        required: "Complete este campo obligatorio.",
        email: "Ingrese una dirección de email válida.",
        consent: "Acepte la recopilación de información personal y el procesamiento de la consulta."
      },
      fields: {
        name: "Nombre",
        namePlaceholder: "Su nombre",
        organization: "Organización",
        organizationPlaceholder: "Institución o empresa",
        email: "Email",
        emailPlaceholder: "name@example.com",
        country: "País",
        countryPlaceholder: "País",
        message: "Mensaje",
        messagePlaceholder: "Cuéntenos su interés de colaboración",
        consent: "Acepto la recopilación de información personal y el procesamiento de la consulta."
      }
    },
    login: {
      eyebrow: "Inicio Seguro",
      lead: "Esta es la etapa de UI antes de conectar Supabase Auth. Después del inicio de sesión, My Page y la consulta de certificación se mostrarán según la política.",
      email: "Email",
      emailPlaceholder: "name@example.com",
      password: "Contraseña",
      passwordPlaceholder: "Contraseña",
      previewCta: "Vista previa de My Page",
      forgotPassword: "¿Olvidó su contraseña?",
      backToLogin: "Volver al inicio de sesión",
      resetCta: "Enviar instrucciones de restablecimiento",
      note: "La autenticación real se conectará después de configurar las variables de entorno de Supabase.",
      successTitle: "Inicio de sesión demo listo.",
      successMessage: "Redirigiendo pronto a la vista previa de My Page.",
      resetSuccessTitle: "Instrucciones de restablecimiento listas.",
      resetSuccessMessage: "El envío real por email se activará después de conectar Supabase Auth.",
      validation: {
        emailRequired: "Ingrese su email.",
        emailInvalid: "Ingrese una dirección de email válida.",
        passwordRequired: "Ingrese su contraseña.",
        passwordLength: "La contraseña debe tener al menos 6 caracteres."
      }
    },
    account: {
      eyebrow: "Área de Cuenta Protegida",
      lead: "Esta área exclusiva para usuarios con sesión iniciada no aparece en el menú público. La protección de autenticación del servidor se conectará antes del lanzamiento.",
      modules: [
        { title: "Perfil", body: "Revise y edite nombre, email, país e idioma preferido." },
        { title: "Consulta de Certificación", body: "Muestra nombre del programa, fecha de emisión y estado a partir de datos de certificación de muestra." },
        { title: "Historial de Consultas", body: "Revise las consultas enviadas por el usuario." },
        { title: "Noindex", body: "Las páginas de cuenta se bloquean para indexación en motores de búsqueda." }
      ],
      certificates: [
        { title: "Certificación Nacional de Estética", number: "Certificado No. SMC-2026-001", status: "Activo" },
        { title: "Aromaterapia", number: "Certificado No. SMC-2026-014", status: "Revisión pendiente" }
      ]
    },
    curriculumCatalog: {
      searchLabel: "Buscar currículo",
      searchPlaceholder: "Buscar cursos",
      categoryLabel: "Categorías de curso",
      categories: {
        all: "Todo",
        certification: "Certificación",
        professional: "Programas por Objetivo",
        practical: "Programa Práctico"
      },
      goalTitle: "Programas Recomendados por Objetivo",
      goalLead: "Programas diseñados según empleo, emprendimiento, limitaciones de horario y objetivos de cada estudiante.",
      catalogTitle: "Programas Prácticos y de Certificación",
      catalogLead: "Explore formación técnica y programas de certificación para aplicación en campo.",
      emptyState: "Ningún programa coincide con los filtros. Ajuste la palabra clave o la categoría.",
      viewDetails: "Ver Detalles"
    }
  }
} satisfies Record<Locale, Copy>;

const courseImages = [
  "/assets/course-employment-consulting.jpg",
  "/assets/course-startup-consulting.jpg",
  "/assets/course-weekend-hobby.jpg",
  "/assets/course-facial-contouring.jpg",
  "/assets/course-thumb-aromatherapy.png",
  "/assets/course-thumb-skincare.png",
  "/assets/course-thumb-skincare.png",
  "/assets/course-thumb-aromatherapy.png",
  "/assets/course-thumb-massage-training.png",
  "/assets/course-thumb-massage-training.png",
  "/assets/course-thumb-foot-reflexology.png",
  "/assets/course-thumb-foot-reflexology.png"
];

const courseTitleTranslations = [
  { ko: "취업전문과정", en: "Employment Preparation Track", es: "Ruta de Preparación Laboral", sourcePath: "curriculum05.asp", categoryKey: "professional" },
  { ko: "창업전문과정", en: "Business Startup Track", es: "Ruta de Emprendimiento", sourcePath: "curriculum06.asp", categoryKey: "professional" },
  { ko: "주말반/취미반", en: "Weekend and Hobby Class", es: "Clase de Fin de Semana y Hobby", sourcePath: "curriculum07.asp", categoryKey: "professional" },
  { ko: "얼굴축소경락", en: "Facial Contouring Meridian Care", es: "Cuidado Meridiano de Contorno Facial", sourcePath: "curriculum08.asp", categoryKey: "practical" },
  { ko: "메디컬 스킨케어", en: "Medical Skin Care", es: "Cuidado Médico de la Piel", sourcePath: "curriculum09.asp", categoryKey: "practical" },
  { ko: "아로마 마사지", en: "Aroma Massage", es: "Masaje Aromático", sourcePath: "curriculum10.asp", categoryKey: "practical" },
  { ko: "경락 마사지", en: "Meridian Massage", es: "Masaje Meridiano", sourcePath: "curriculum11.asp", categoryKey: "practical" },
  { ko: "스포츠 마사지", en: "Sports Massage", es: "Masaje Deportivo", sourcePath: "curriculum12.asp", categoryKey: "practical" },
  { ko: "발 마사지", en: "Foot Massage", es: "Masaje de Pies", sourcePath: "curriculum13.asp", categoryKey: "practical" },
  { ko: "산모 마사지", en: "Maternity Massage", es: "Masaje para Embarazadas", sourcePath: "curriculum14.asp", categoryKey: "practical" },
  { ko: "베이비 마사지", en: "Baby Massage", es: "Masaje Infantil", sourcePath: "curriculum15.asp", categoryKey: "practical" },
  { ko: "타이 마사지", en: "Thai Massage", es: "Masaje Tailandés", sourcePath: "curriculum16.asp", categoryKey: "practical" },
  { ko: "카이로프랙틱", en: "Chiropractic", es: "Quiropráctica", sourcePath: "curriculum17.asp", categoryKey: "practical" },
  { ko: "스웨디시", en: "Swedish Massage", es: "Masaje Sueco", sourcePath: "curriculum19.asp", categoryKey: "practical" },
  { ko: "스파 테라피", en: "Spa Therapy", es: "Terapia de Spa", sourcePath: "curriculum20.asp", categoryKey: "practical" },
  { ko: "브라질리언 왁싱", en: "Brazilian Waxing", es: "Depilación Brasileña", sourcePath: "curriculum21.asp", categoryKey: "practical" },
  { ko: "병원 코디네이터", en: "Hospital Coordinator", es: "Coordinador Hospitalario", sourcePath: "curriculum22.asp", categoryKey: "practical" },
  {
    ko: "피부미용사",
    en: "Esthetician",
    es: "Estética",
    sourcePath: "curriculum01.asp",
    categoryKey: "certification"
  }
] satisfies Array<Record<Locale, string> & { sourcePath: string; categoryKey: Exclude<CourseCategory, "all"> }>;

type CourseDetailSection = {
  title: string;
  items: string[];
  variant?: "cards" | "chips" | "income" | "schedule";
};

type CourseText = {
  category: string;
  summary: string;
  overview: string;
  audience: string;
  curriculum: string[];
  certificationNote: string;
  durationHighlights?: string[];
  keyMetrics?: Array<{ label: string; value: string }>;
  detailSections?: CourseDetailSection[];
};

const courseTextByLocale: Record<Locale, Record<Exclude<CourseCategory, "all">, CourseText>> = {
  ko: {
    certification: {
      category: "자격 과정",
      summary: "자격 취득과 강사 역량을 함께 준비하는 KHCPQA 기준 교육 과정입니다.",
      overview:
        "기존 SMC365 교육 콘텐츠를 KHCPQA 글로벌 플랫폼 구조에 맞춰 정리한 과정입니다. 과정 개요, 실습 흐름, 자격 또는 수료 안내를 한 화면에서 확인할 수 있도록 설계합니다.",
      audience: "전문 자격 취득을 준비하는 교육생, 현직 종사자, 강사 과정 지원자",
      curriculum: ["과정 오리엔테이션과 기본 이론", "전문 실습 시연 및 단계별 훈련", "현장 적용 사례와 고객 응대 기준", "수료 또는 자격 취득 준비 체크"],
      certificationNote: "자격 취득 또는 수료 기준은 과정별 운영 정책과 관리자 등록 데이터에 따라 안내됩니다."
    },
    professional: {
      category: "목표별 과정",
      summary: "취업, 창업, 주말 학습처럼 수강 목적에 맞춰 실무 과목과 학습 흐름을 설계합니다.",
      overview:
        "단일 기술 과목이 아니라 수강생의 목적에 맞춰 필요한 실무 과목, 학습 기간, 상담 방향을 조합하는 목표형 과정입니다. 취업 준비, 창업 준비, 시간 제약이 있는 입문 학습을 서로 다른 흐름으로 안내합니다.",
      audience: "취업·창업·시간제 학습을 목표로 하는 예비 전문가",
      curriculum: ["수강 목적과 현재 역량 진단", "목표에 맞는 실무 과목 조합 설계", "취업·창업·주말 학습별 실습 플랜", "상담을 통한 진로와 후속 과정 안내"],
      certificationNote: "목표별 과정은 상담을 통해 포함 과목과 운영 기간이 달라질 수 있으며, 세부 수료 기준은 선택 과목에 따라 안내됩니다."
    },
    practical: {
      category: "실무 프로그램",
      summary: "건강·미용·웰니스 현장에서 활용할 수 있는 실습 중심 프로그램입니다.",
      overview:
        "현장에서 바로 활용할 수 있는 테크닉을 중심으로 구성한 실습 프로그램입니다. 기술 이해, 시연, 반복 훈련, 고객 응대 기준을 함께 다룹니다.",
      audience: "현장 실무 기술을 보완하려는 웰니스·뷰티·헬스케어 분야 교육생",
      curriculum: ["기술 원리와 안전 기준", "전문가 시연 및 단계별 실습", "고객 유형별 적용 사례", "현장 적용 체크리스트"],
      certificationNote: "수료 또는 자격 연계 여부는 과정별 운영 정책에 따라 안내됩니다."
    }
  },
  en: {
    certification: {
      category: "Certification",
      summary: "A KHCPQA-standard program designed to prepare trainees for certification and instructor-level capability.",
      overview:
        "This program reorganizes existing SMC365 education content for the KHCPQA global platform, presenting the program overview, practice flow, and certification or completion guidance in one place.",
      audience: "Trainees preparing for professional certification, active practitioners, and instructor-track applicants",
      curriculum: ["Program orientation and core theory", "Professional demonstrations and step-by-step practice", "Field application cases and client response standards", "Completion or certification readiness check"],
      certificationNote: "Certification or completion requirements are guided by each program's operating policy and admin-managed data."
    },
    professional: {
      category: "Goal-Based Program",
      summary: "A goal-based pathway that combines practical subjects around employment, startup preparation, or weekend study.",
      overview:
        "This is not a single technique course. It combines practical subjects, learning duration, and advising according to each learner's goal, including employment preparation, startup preparation, or schedule-friendly introductory study.",
      audience: "Prospective professionals preparing for employment, startup, or part-time learning goals",
      curriculum: ["Goal and current-skill assessment", "Practical subject combination by objective", "Practice plan for employment, startup, or weekend learning", "Advising for career direction and follow-up programs"],
      certificationNote: "Included subjects and duration may differ after consultation. Completion criteria are guided according to the selected subjects."
    },
    practical: {
      category: "Practical Program",
      summary: "A practice-centered program for techniques used in health, beauty, and wellness settings.",
      overview:
        "This hands-on program focuses on field-ready techniques, covering technical understanding, demonstrations, repeated practice, and client response standards.",
      audience: "Wellness, beauty, and healthcare trainees who want to strengthen practical field techniques",
      curriculum: ["Technical principles and safety standards", "Expert demonstrations and step-by-step practice", "Application cases by client type", "Field application checklist"],
      certificationNote: "Completion or certification linkage is guided by the operating policy for each program."
    }
  },
  es: {
    certification: {
      category: "Certificación",
      summary: "Un programa con estándar KHCPQA para preparar la certificación y capacidades de nivel instructor.",
      overview:
        "Este programa reorganiza el contenido educativo existente de SMC365 para la plataforma global KHCPQA, presentando resumen, flujo de práctica y guía de certificación o finalización en un solo lugar.",
      audience: "Estudiantes que preparan una certificación profesional, profesionales activos y aspirantes a instructor",
      curriculum: ["Orientación del programa y teoría central", "Demostraciones profesionales y práctica paso a paso", "Casos de aplicación en campo y estándares de atención", "Revisión de preparación para finalización o certificación"],
      certificationNote: "Los requisitos de certificación o finalización se guían por la política operativa de cada programa y los datos gestionados por administración."
    },
    professional: {
      category: "Programa por Objetivo",
      summary: "Una ruta que combina asignaturas prácticas según empleo, emprendimiento o estudio de fin de semana.",
      overview:
        "No es un curso de una sola técnica. Combina asignaturas prácticas, duración de aprendizaje y asesoría según el objetivo de cada estudiante: empleo, emprendimiento o estudio introductorio con limitaciones de horario.",
      audience: "Futuros profesionales que se preparan para empleo, emprendimiento o aprendizaje parcial",
      curriculum: ["Evaluación de objetivo y nivel actual", "Combinación de asignaturas prácticas por objetivo", "Plan de práctica para empleo, emprendimiento o fin de semana", "Asesoría sobre ruta profesional y programas posteriores"],
      certificationNote: "Las asignaturas incluidas y la duración pueden variar tras la consulta. Los criterios de finalización se guían según las asignaturas seleccionadas."
    },
    practical: {
      category: "Programa Práctico",
      summary: "Un programa centrado en práctica para técnicas usadas en salud, belleza y bienestar.",
      overview:
        "Este programa práctico se centra en técnicas listas para el campo, cubriendo comprensión técnica, demostraciones, práctica repetida y estándares de atención al cliente.",
      audience: "Estudiantes de bienestar, belleza y salud que desean fortalecer técnicas prácticas de campo",
      curriculum: ["Principios técnicos y estándares de seguridad", "Demostraciones expertas y práctica paso a paso", "Casos de aplicación por tipo de cliente", "Lista de verificación para aplicación en campo"],
      certificationNote: "La finalización o vinculación con certificación se guía por la política operativa de cada programa."
    }
  }
};

const courseOverridesByLocale: Record<Locale, Partial<Record<string, Partial<CourseText>>>> = {
  ko: {
    "취업전문과정": {
      summary: "취업 경쟁력을 높이기 위해 현장 실무 테크닉, 고객 응대, 매너까지 함께 훈련하는 목표형 과정입니다.",
      overview:
        "취업전문과정은 취업 현장에서 바로 고객 관리를 맡을 수 있도록 종목별 실무 테크닉을 집중적으로 익히는 과정입니다. 고급 기술 습득과 함께 고객 관리, 예의, 매너를 함께 다루어 실무 직장 적응력을 높이는 흐름으로 구성됩니다.",
      audience: "뷰티·웰니스 분야 취업을 준비하며 여러 실무 테크닉을 조합해 경쟁력을 만들고 싶은 교육생",
      curriculum: [
        "취업 목표와 희망 분야 상담",
        "아로마경락, 스웨디시, 스포츠, 발 관리 등 실무 테크닉 조합 설계",
        "고객 관리, 응대 매너, 현장 실습 기준 훈련",
        "취업 가능 분야와 후속 과정 상담"
      ],
      certificationNote:
        "교육 기간은 2주 단기, 1개월 속성, 2개월 정규 과정으로 안내되며 세부 운영은 상담과 선택 과목에 따라 달라질 수 있습니다.",
      durationHighlights: ["2주 단기 교육", "1개월 속성 교육", "2개월 정규 교육"],
      keyMetrics: [
        { label: "교육 형태", value: "취업 전문" },
        { label: "기간", value: "2주~2개월" },
        { label: "연계 분야", value: "12개 영역" }
      ],
      detailSections: [
        {
          title: "주요 교육 종목",
          variant: "chips",
          items: [
            "아로마경락 마사지",
            "산모 마사지",
            "국가자격증",
            "스웨디시 마사지",
            "얼굴축소경락",
            "브라질리언 왁싱",
            "스포츠 마사지",
            "피부관리 샬롱테크닉",
            "병원 코디네이터",
            "발 마사지",
            "메디컬 스킨케어",
            "카이로 체형관리"
          ]
        },
        {
          title: "추천 과목 조합",
          items: [
            "스웨디시 + 왁싱 + 아로마경락 + 스포츠",
            "아로마경락 + 아로마테라피 + 스킨케어",
            "스포츠 + 경락 + 발 + 스웨디시",
            "산모 + 아로마경락 + 얼굴축소"
          ]
        },
        {
          title: "취업 및 진로 방향",
          items: [
            "고급 스웨디시, 호텔 스파샵, 전문 스포츠마사지샵 취업 연계",
            "전문 마사지샵, 뷰티샵, 병원·산부인과, 산후조리원 분야 진출",
            "프리랜서 활동 또는 1인 마사지샵 운영 상담"
          ]
        },
        {
          title: "취업 월 예상 수입",
          variant: "income",
          items: [
            "A타입 상담 기준: 월 800만원 ~ 1,000만원 안내",
            "B타입 상담 기준: 월 500만원 ~ 800만원 안내",
            "예상 수입은 샵 지역, 시설, 마케팅, 운영 방식에 따라 달라질 수 있습니다."
          ]
        },
        {
          title: "진출분야 및 활동영역",
          items: [
            "1인 샵 또는 출장 산후마사지 관리 오픈 운영",
            "고급 스웨디시, 호텔 스파샵, 스포츠마사지샵 취업",
            "병원, 산부인과, 산후조리원, 타이마사지샵, 대형 스파찜질방 연계"
          ]
        },
        {
          title: "강의시간 안내",
          variant: "schedule",
          items: [
            "속성반: 월~금 10시~13시 또는 14시~17시",
            "오전반: 월~금 10시~13시 / 오후반: 월~금 14시~17시",
            "야간반: 월·수·금 19시~21시"
          ]
        },
        {
          title: "연계 강의안내",
          items: [
            "피부미용사 국가자격증, 얼굴축소경락, 아로마 테라피",
            "경락 마사지, 스포츠 마사지, 발 마사지",
            "스웨디시, 산모 마사지 등 취업 목적에 맞춰 선택 상담"
          ]
        }
      ]
    },
    "창업전문과정": {
      summary: "창업에 필요한 실무 테크닉, 입지 선정, 마케팅, 운영 노하우를 함께 설계하는 목표형 과정입니다.",
      overview:
        "창업전문과정은 고급 실무기술과 고객 관리 역량을 기반으로 샵 콘셉트, 입지 선정, 인테리어, 비품·재료 선택, 직원 수급과 서비스 교육, 운영관리까지 신규 오픈에 필요한 흐름을 종합적으로 안내합니다. 졸업생 창업 사례와 샵 운영 노하우를 참고해 현실적인 창업 준비를 돕습니다.",
      audience: "1인 창업, 신규 샵 오픈, 기존 샵 인수를 준비하며 실무와 운영을 함께 배우고 싶은 교육생",
      curriculum: [
        "창업 목표와 희망 업종 진단",
        "고객 선호도가 높은 인기 관리 프로그램 조합 설계",
        "입지 선정, 비용 절감 인테리어, 비품·재료 선택 체크",
        "운영관리, 직원 교육, 마케팅과 경영 노하우 상담"
      ],
      certificationNote:
        "창업 준비 범위와 예상 수익은 지역, 시설, 상권, 마케팅, 운영 방식에 따라 달라질 수 있으며 세부 내용은 상담을 통해 안내됩니다.",
      durationHighlights: ["창업 준비 상담", "샵 오픈 설계", "운영관리 코칭"],
      keyMetrics: [
        { label: "교육 형태", value: "창업 전문" },
        { label: "준비 범위", value: "16개 체크" },
        { label: "오픈 유형", value: "1인·샵 오픈" }
      ],
      detailSections: [
        {
          title: "주요 교육 종목",
          variant: "chips",
          items: [
            "아로마경락 마사지",
            "산모 마사지",
            "국가자격증",
            "스웨디시 마사지",
            "얼굴축소경락",
            "브라질리언 왁싱",
            "스포츠 마사지",
            "피부관리 샬롱테크닉",
            "병원 코디네이터",
            "발 마사지",
            "메디컬 스킨케어",
            "카이로 체형관리"
          ]
        },
        {
          title: "창업 준비 체크포인트",
          items: [
            "경쟁력 있는 기술과 단골고객 확보·관리 방법",
            "수익형 콘셉트와 프로그램 설계, 입지·점포 위치 선정",
            "사업자등록, 비용절감 마케팅, 인테리어와 비품·재료 선택",
            "직원 수급·기술점검, 힐링프로그램 시스템, 경영 노하우와 운영관리"
          ]
        },
        {
          title: "오픈 형태",
          items: [
            "스웨디시 + 왁싱 + 아로마경락 + 스포츠",
            "아로마경락 + 아로마테라피 + 스킨케어",
            "스포츠 + 경락 + 발 + 스웨디시",
            "오피스텔 오픈, 일반상가 오픈, 신규 샵 또는 기존 샵 인수"
          ]
        },
        {
          title: "샵 창업 월 예상 매출",
          variant: "income",
          items: [
            "A타입 상담 기준: 월 8,000만원 ~ 1억원 안내",
            "B타입 상담 기준: 월 5,000만원 ~ 8,000만원 안내",
            "예상 매출은 샵 지역, 시설, 마케팅, 운영 방식에 따라 달라질 수 있습니다."
          ]
        },
        {
          title: "1인 창업 월 예상 수입",
          variant: "income",
          items: [
            "A타입 상담 기준: 월 1,500만원 ~ 2,000만원 안내",
            "B타입 상담 기준: 월 1,000만원 ~ 1,500만원 안내",
            "예상 수입은 운영 형태와 고객 확보 방식에 따라 달라질 수 있습니다."
          ]
        },
        {
          title: "강의시간 안내",
          variant: "schedule",
          items: [
            "속성반: 월~금 10시~13시 또는 14시~17시",
            "오전반: 월~금 10시~13시 / 오후반: 월~금 14시~17시",
            "야간반: 월·수·금 19시~21시"
          ]
        },
        {
          title: "연계 강의안내",
          items: [
            "피부미용사 국가자격증, 얼굴축소경락, 아로마 테라피",
            "경락 마사지, 스포츠 마사지, 발 마사지",
            "스웨디시, 산모 마사지 등 창업 콘셉트에 맞춰 선택 상담"
          ]
        }
      ]
    },
    "주말반/취미반": {
      summary: "평일 시간이 어려운 수강생과 취미로 실무 관리를 배우고 싶은 입문자를 위한 주말 집중 과정입니다.",
      overview:
        "주말반/취미반은 이직을 준비하거나 취미로 피부·마사지 실무를 배우고 싶은 분들이 토요일 또는 일요일에 집중적으로 수강할 수 있도록 구성한 과정입니다. 오전·오후 시간대를 나누어 생활 일정에 맞춰 기본 실무와 관심 과목을 선택해 배울 수 있습니다.",
      audience: "평일 수강이 어려운 직장인, 이직 준비생, 취미로 뷰티·웰니스 관리를 배우려는 입문자",
      curriculum: [
        "수강 목적과 가능한 요일·시간 상담",
        "피부미용, 아로마, 경락, 스포츠, 발 관리 등 관심 과목 선택",
        "주말 오전·오후 집중 실습",
        "취미 학습 또는 후속 취업·창업 과정 연계 상담"
      ],
      certificationNote:
        "주말반/취미반은 토요일 또는 일요일 오전·오후 시간대로 운영되며, 세부 과목과 수료 기준은 선택 과목과 상담 결과에 따라 안내됩니다.",
      durationHighlights: ["토요일반", "일요일반", "오전·오후 선택"],
      keyMetrics: [
        { label: "교육 형태", value: "주말 집중" },
        { label: "요일", value: "토·일" },
        { label: "시간", value: "10시~17시" }
      ],
      detailSections: [
        {
          title: "추천 대상",
          items: [
            "평일 수업 참여가 어려운 직장인과 예비 전직자",
            "피부·마사지 관리를 취미로 배우고 싶은 입문자",
            "후속 취업·창업 과정 전 기초 실무를 경험해보고 싶은 수강생"
          ]
        },
        {
          title: "선택 가능 과목",
          variant: "chips",
          items: [
            "피부미용사",
            "얼굴축소경락",
            "메디컬 스킨케어",
            "아로마 테라피",
            "경락 마사지",
            "스포츠 마사지",
            "발 마사지",
            "스웨디시",
            "산모 마사지"
          ]
        },
        {
          title: "학습 흐름",
          items: [
            "관심 과목과 수강 목적 상담",
            "기본 이론과 관리 순서 이해",
            "전문가 시연 후 단계별 실습",
            "취미 활용 또는 심화 과정 연결"
          ]
        },
        {
          title: "활용 방향",
          items: [
            "가족·지인 케어를 위한 취미 실습",
            "뷰티·웰니스 분야 이직 전 기초 경험",
            "취업전문과정 또는 창업전문과정으로 확장 상담"
          ]
        },
        {
          title: "연계 강의안내",
          items: [
            "피부미용사 국가자격증, 얼굴축소경락, 아로마 테라피",
            "경락 마사지, 스포츠 마사지, 발 마사지",
            "스웨디시, 산모 마사지 등 관심 분야에 맞춰 선택 상담"
          ]
        },
        {
          title: "주말 강의시간 안내",
          variant: "schedule",
          items: [
            "토요일반: 10시~13시 또는 14시~17시",
            "일요일반: 10시~13시 또는 14시~17시",
            "상담 안내: 과목별 운영 시간은 개설 일정에 따라 달라질 수 있습니다."
          ]
        }
      ]
    },
    "얼굴축소경락": {
      summary: "피부 유형 분석부터 얼굴축소 경락마사지, 매뉴얼 테크닉, 고객 응대까지 연결하는 실무 과정입니다.",
      overview:
        "얼굴축소경락은 피부 상태와 얼굴 윤곽 고민을 분석하고, 클렌징·딥 클렌징·팩·미용기기·경락마사지·매뉴얼 테크닉을 단계적으로 익히는 과정입니다. 원본의 정규·속성 커리큘럼 흐름을 살려 이론보다 현장 실습과 고객 관리 능력에 집중하도록 구성했습니다.",
      audience: "피부관리실 취업, 피부미용 샵 창업, 얼굴 윤곽·피부관리 실무 역량을 준비하는 수강생",
      curriculum: [
        "피부 유형 분석과 고객 상담 차트 작성",
        "클렌징, 딥 클렌징, 팩·마스크, 기능성 제품 선택",
        "얼굴축소 경락마사지와 매뉴얼 테크닉 2인 1조 실습",
        "고객 응대, 예절, 위생, 이미지 관리와 취업·창업 진로 상담"
      ],
      certificationNote:
        "정규코스는 2개월, 속성코스는 1개월 기준으로 안내되며 교육시간은 10시~13시, 14시~17시, 19시~21시 시간대에서 상담 후 조정됩니다.",
      durationHighlights: ["정규 2개월", "속성 1개월", "10시·14시·19시"],
      keyMetrics: [
        { label: "교육 형태", value: "실무 테크닉" },
        { label: "기간", value: "1~2개월" },
        { label: "실습 방식", value: "2인 1조" }
      ],
      detailSections: [
        {
          title: "정규 코스 로드맵",
          variant: "schedule",
          items: [
            "1개월: 피부미용 분석·상담, 클렌징과 딥 클렌징, 피부유형별 화장품 선택, 팩·마스크 관리",
            "2개월: 미용기기 사용, 얼굴축소 경락마사지와 매뉴얼 테크닉, 기능성 제품 특수관리, 관리사 기본교육",
            "교육시간: 10시~13시, 14시~17시, 19시~21시"
          ]
        },
        {
          title: "속성 코스 로드맵",
          variant: "schedule",
          items: [
            "1주차: 오리엔테이션, 피부유형 분석, 고객 상담, 클렌징과 딥 클렌징",
            "2~3주차: 화장품·팩·마스크 선택, 미용기기 사용, 얼굴축소 경락마사지 집중 실습",
            "4주차: 미백·주름·얼굴축소·비타민·한방 팩 등 특수관리와 관리사 이미지 교육"
          ]
        },
        {
          title: "핵심 실무 테크닉",
          variant: "chips",
          items: [
            "피부유형 분석",
            "고객 상담 차트",
            "클렌징",
            "딥 클렌징",
            "팩·마스크",
            "미용기기 사용",
            "얼굴축소 경락마사지",
            "매뉴얼 테크닉",
            "기능성 제품",
            "예절·이미지 관리"
          ]
        },
        {
          title: "교육 특징",
          items: [
            "단체 지도, 일대일 개인지도, 2인 1조 상호 실습을 병행",
            "실무 중심 문제 해결 학습으로 원리와 이론을 자연스럽게 연결",
            "취업 시 필요한 고객 응대, 소양교육, 예절교육까지 함께 훈련"
          ]
        },
        {
          title: "피부 고민 대응",
          items: [
            "여드름, 모공, 기미·색소침착, 잔주름과 노화 피부 관리 이해",
            "민감성·건성 피부의 자극 요인과 타입별 제품 선택",
            "수분 공급, 혈액순환, 탄력 유지, 피부 톤 개선을 목표로 한 관리 흐름"
          ]
        },
        {
          title: "관리 태도와 위생",
          items: [
            "고객이 편안한 자세를 취하도록 안내하고 압의 강약을 확인",
            "관리사는 손톱, 손 위생, 복장, 호흡과 자세를 안정적으로 유지",
            "얼굴축소경락 관리 시 속도, 힘의 원리, 호흡 조절을 반복 훈련"
          ]
        },
        {
          title: "진출 분야",
          items: [
            "피부미용전문관리샵, 피부미용학원 강사, 한의원·피부과·성형외과 부속 관리실",
            "산후조리원 부설 관리실, 뷰티샵·마사지샵 창업, 토탈미용실",
            "호텔·스파·스포츠센터 관리실, 개인관리실 창업, 해외취업 및 해외창업 상담"
          ]
        }
      ]
    }
  },
  en: {
    "취업전문과정": {
      summary: "A job-focused pathway for practical techniques, client care, and workplace readiness.",
      overview:
        "This track prepares trainees to enter beauty and wellness workplaces with practical technique combinations, client-care standards, and professional manners. The program is planned around the learner's target field and current skill level.",
      audience: "Trainees preparing for employment in beauty, wellness, massage, spa, or related service fields",
      curriculum: [
        "Employment goal and target-field consultation",
        "Practical technique plan across aroma meridian, Swedish, sports, foot care, and related subjects",
        "Client-care, communication, and workplace-manner training",
        "Career-field guidance and follow-up program consultation"
      ],
      certificationNote:
        "Program duration may be guided as short-term, one-month intensive, or two-month regular training depending on consultation and selected subjects.",
      durationHighlights: ["Short-term training", "1-month intensive", "2-month regular"],
      keyMetrics: [
        { label: "Track", value: "Employment" },
        { label: "Duration", value: "2 weeks-2 months" },
        { label: "Fields", value: "12 areas" }
      ],
      detailSections: [
        {
          title: "Core Training Subjects",
          variant: "chips",
          items: [
            "Aroma meridian massage",
            "Maternity massage",
            "National certification",
            "Swedish massage",
            "Facial contouring care",
            "Brazilian waxing",
            "Sports massage",
            "Skin-care salon technique",
            "Hospital coordinator",
            "Foot massage",
            "Medical skin care",
            "Chiropractic body care"
          ]
        },
        {
          title: "Recommended Combinations",
          items: [
            "Swedish + waxing + aroma meridian + sports",
            "Aroma meridian + aromatherapy + skin care",
            "Sports + meridian + foot + Swedish",
            "Maternity + aroma meridian + facial contouring"
          ]
        },
        {
          title: "Career Direction",
          items: [
            "Premium Swedish, hotel spa, and sports massage shop employment",
            "Massage shops, boutique beauty shops, hospitals, maternity clinics, and postpartum care centers",
            "Freelance work or one-person shop operation consultation"
          ]
        },
        {
          title: "Expected Monthly Income",
          variant: "income",
          items: [
            "Type A consultation guide: KRW 8,000,000 to 10,000,000 per month",
            "Type B consultation guide: KRW 5,000,000 to 8,000,000 per month",
            "Actual income may vary by shop location, facilities, marketing, and operation."
          ]
        },
        {
          title: "Employment Fields",
          items: [
            "One-person shop operation or mobile postpartum care service",
            "Premium Swedish, hotel spa, and sports massage shop employment",
            "Hospitals, maternity clinics, postpartum care centers, Thai massage shops, and large spa facilities"
          ]
        },
        {
          title: "Class Time Guide",
          variant: "schedule",
          items: [
            "Intensive class: Mon-Fri 10:00-13:00 or 14:00-17:00",
            "Morning class: Mon-Fri 10:00-13:00 / Afternoon class: Mon-Fri 14:00-17:00",
            "Evening class: Mon, Wed, Fri 19:00-21:00"
          ]
        },
        {
          title: "Linked Course Guidance",
          items: [
            "National esthetician certification, facial contouring meridian care, aromatherapy",
            "Meridian massage, sports massage, and foot massage",
            "Swedish and maternity massage can be selected according to employment goals"
          ]
        }
      ]
    },
    "창업전문과정": {
      summary: "A startup-focused pathway covering practical techniques, shop planning, marketing, and operation.",
      overview:
        "This track combines advanced practical techniques with startup planning, including shop concept, location selection, interior planning, supplies, staffing, service training, marketing, and daily operation. It helps learners prepare a realistic opening plan using field-oriented guidance.",
      audience: "Trainees preparing for one-person business, new shop opening, or acquisition of an existing shop",
      curriculum: [
        "Startup goal and target business diagnosis",
        "Service menu planning around high-demand care programs",
        "Location, cost-conscious interior, supplies, and material checklist",
        "Operation, staff training, marketing, and business know-how consultation"
      ],
      certificationNote:
        "Startup scope and projected revenue may vary by location, facilities, trade area, marketing, and operation model. Details are guided through consultation.",
      durationHighlights: ["Startup consultation", "Shop opening plan", "Operation coaching"],
      keyMetrics: [
        { label: "Track", value: "Startup" },
        { label: "Checklist", value: "16 items" },
        { label: "Opening Type", value: "Solo / Shop" }
      ],
      detailSections: [
        {
          title: "Core Training Subjects",
          variant: "chips",
          items: [
            "Aroma meridian massage",
            "Maternity massage",
            "National certification",
            "Swedish massage",
            "Facial contouring care",
            "Brazilian waxing",
            "Sports massage",
            "Skin-care salon technique",
            "Hospital coordinator",
            "Foot massage",
            "Medical skin care",
            "Chiropractic body care"
          ]
        },
        {
          title: "Startup Checklist",
          items: [
            "Competitive technique and repeat-customer acquisition",
            "Revenue-oriented concept, program planning, and location selection",
            "Business registration, cost-conscious marketing, interior, supplies, and materials",
            "Staffing, skill checks, healing program system, business know-how, and operation management"
          ]
        },
        {
          title: "Opening Models",
          items: [
            "Swedish + waxing + aroma meridian + sports",
            "Aroma meridian + aromatherapy + skin care",
            "Sports + meridian + foot + Swedish",
            "Officetel opening, commercial shop opening, new shop or existing shop acquisition"
          ]
        },
        {
          title: "Projected Monthly Shop Revenue",
          variant: "income",
          items: [
            "Type A consultation guide: KRW 80,000,000 to 100,000,000 per month",
            "Type B consultation guide: KRW 50,000,000 to 80,000,000 per month",
            "Projected revenue may vary by shop location, facilities, marketing, and operation."
          ]
        },
        {
          title: "Projected Monthly Solo Income",
          variant: "income",
          items: [
            "Type A consultation guide: KRW 15,000,000 to 20,000,000 per month",
            "Type B consultation guide: KRW 10,000,000 to 15,000,000 per month",
            "Projected income may vary by operation model and customer acquisition."
          ]
        },
        {
          title: "Class Time Guide",
          variant: "schedule",
          items: [
            "Intensive class: Mon-Fri 10:00-13:00 or 14:00-17:00",
            "Morning class: Mon-Fri 10:00-13:00 / Afternoon class: Mon-Fri 14:00-17:00",
            "Evening class: Mon, Wed, Fri 19:00-21:00"
          ]
        },
        {
          title: "Linked Course Guidance",
          items: [
            "National esthetician certification, facial contouring meridian care, aromatherapy",
            "Meridian massage, sports massage, and foot massage",
            "Swedish and maternity massage can be selected according to the startup concept"
          ]
        }
      ]
    },
    "주말반/취미반": {
      summary: "A weekend-focused track for learners with weekday constraints or hobby-oriented practical study.",
      overview:
        "The Weekend and Hobby Class is designed for learners who want to prepare for a career change or study skin and massage care as a hobby while keeping weekday schedules. Saturday and Sunday morning or afternoon sessions allow learners to choose practical subjects around their interests.",
      audience: "Working adults, career-change learners, and beginners who want to study beauty and wellness care as a hobby",
      curriculum: [
        "Consultation on learning goal, available day, and schedule",
        "Subject selection across esthetics, aroma, meridian, sports, and foot care",
        "Focused weekend morning or afternoon practice",
        "Guidance toward hobby use or follow-up employment and startup tracks"
      ],
      certificationNote:
        "Weekend classes operate on Saturday or Sunday morning and afternoon blocks. Detailed subjects and completion standards are guided according to selected subjects and consultation.",
      durationHighlights: ["Saturday class", "Sunday class", "Morning / afternoon"],
      keyMetrics: [
        { label: "Track", value: "Weekend" },
        { label: "Days", value: "Sat / Sun" },
        { label: "Time", value: "10:00-17:00" }
      ],
      detailSections: [
        {
          title: "Recommended For",
          items: [
            "Working adults and career-change learners who cannot attend weekday classes",
            "Beginners who want to learn skin and massage care as a hobby",
            "Learners who want to experience practical basics before employment or startup tracks"
          ]
        },
        {
          title: "Selectable Subjects",
          variant: "chips",
          items: [
            "Esthetician",
            "Facial contouring care",
            "Medical skin care",
            "Aromatherapy",
            "Meridian massage",
            "Sports massage",
            "Foot massage",
            "Swedish massage",
            "Maternity massage"
          ]
        },
        {
          title: "Learning Flow",
          items: [
            "Consultation on interests and learning purpose",
            "Basic theory and care sequence understanding",
            "Expert demonstration and step-by-step practice",
            "Connection to hobby use or advanced courses"
          ]
        },
        {
          title: "How It Can Be Used",
          items: [
            "Hobby practice for family and acquaintances",
            "Introductory experience before career change in beauty and wellness",
            "Consultation toward employment or startup programs"
          ]
        },
        {
          title: "Linked Course Guidance",
          items: [
            "National esthetician certification, facial contouring meridian care, aromatherapy",
            "Meridian massage, sports massage, and foot massage",
            "Swedish and maternity massage can be selected by interest"
          ]
        },
        {
          title: "Weekend Class Time Guide",
          variant: "schedule",
          items: [
            "Saturday class: 10:00-13:00 or 14:00-17:00",
            "Sunday class: 10:00-13:00 or 14:00-17:00",
            "Consultation note: Subject schedules may vary by opening calendar."
          ]
        }
      ]
    },
    "얼굴축소경락": {
      summary: "A practical course connecting skin analysis, facial contouring meridian massage, manual technique, and client care.",
      overview:
        "Facial Contouring Meridian Care trains learners to analyze skin condition and facial-contour concerns, then practice cleansing, deep cleansing, masks, beauty devices, meridian massage, and manual techniques step by step. The original regular and intensive course flow is reorganized into a modern practical learning path.",
      audience: "Learners preparing for skin-care salon employment, beauty shop startup, or facial contouring and skin-care practice",
      curriculum: [
        "Skin-type analysis and client consultation chart practice",
        "Cleansing, deep cleansing, masks, and functional product selection",
        "Two-person practice for facial contouring meridian massage and manual techniques",
        "Client response, etiquette, hygiene, image management, and career guidance"
      ],
      certificationNote:
        "The regular course is guided as a two-month track and the intensive course as a one-month track. Class times are arranged through consultation around 10:00-13:00, 14:00-17:00, and 19:00-21:00 blocks.",
      durationHighlights: ["2-month regular", "1-month intensive", "10 / 14 / 19 time blocks"],
      keyMetrics: [
        { label: "Track", value: "Practical" },
        { label: "Duration", value: "1-2 months" },
        { label: "Practice", value: "Pair work" }
      ],
      detailSections: [
        {
          title: "Regular Course Roadmap",
          variant: "schedule",
          items: [
            "Month 1: skin analysis and consultation, cleansing and deep cleansing, skin-type cosmetics, pack and mask care",
            "Month 2: beauty-device use, facial contouring meridian massage and manual technique, functional product special care, therapist basics",
            "Class times: 10:00-13:00, 14:00-17:00, 19:00-21:00"
          ]
        },
        {
          title: "Intensive Course Roadmap",
          variant: "schedule",
          items: [
            "Week 1: orientation, skin-type analysis, client consultation, cleansing and deep cleansing",
            "Weeks 2-3: cosmetics, packs, masks, beauty-device practice, focused facial meridian massage practice",
            "Week 4: whitening, wrinkle, facial contouring, vitamin, herbal pack special care and therapist image training"
          ]
        },
        {
          title: "Core Practical Techniques",
          variant: "chips",
          items: [
            "Skin analysis",
            "Client chart",
            "Cleansing",
            "Deep cleansing",
            "Packs and masks",
            "Beauty devices",
            "Facial meridian massage",
            "Manual technique",
            "Functional products",
            "Etiquette and image"
          ]
        },
        {
          title: "Training Features",
          items: [
            "Group instruction, one-to-one coaching, and two-person mutual practice",
            "Problem-solving practice that connects technique principles with theory",
            "Client response, professional attitude, and etiquette training for employment"
          ]
        },
        {
          title: "Skin Concerns Covered",
          items: [
            "Acne, pores, pigmentation, fine lines, and aging skin-care concepts",
            "Sensitive and dry skin factors with type-specific product selection",
            "Care flow focused on moisture, circulation, elasticity, and clearer skin tone"
          ]
        },
        {
          title: "Therapist Conduct and Hygiene",
          items: [
            "Guide clients into a comfortable posture and check preferred pressure level",
            "Keep nails, hand hygiene, clothing, breathing, and posture controlled",
            "Practice stable speed, pressure principles, and breathing during facial contouring care"
          ]
        },
        {
          title: "Career Fields",
          items: [
            "Skin-care salons, beauty academy instructor roles, oriental clinic, dermatology, and plastic-surgery care rooms",
            "Postpartum care center treatment rooms, beauty and massage shop startup, total beauty salons",
            "Hotel, spa, and sports-center care rooms, private salon startup, overseas employment and startup consultation"
          ]
        }
      ]
    }
  },
  es: {
    "취업전문과정": {
      summary: "Ruta orientada al empleo con técnicas prácticas, atención al cliente y preparación laboral.",
      overview:
        "Esta ruta prepara a los estudiantes para incorporarse al trabajo en belleza y bienestar mediante combinaciones de técnicas prácticas, atención al cliente y modales profesionales. El plan se ajusta al objetivo laboral y al nivel actual.",
      audience: "Estudiantes que preparan empleo en belleza, bienestar, masaje, spa o servicios relacionados",
      curriculum: [
        "Consulta sobre objetivo laboral y campo deseado",
        "Plan de técnicas prácticas con masaje aroma meridiano, sueco, deportivo, pies y materias relacionadas",
        "Entrenamiento en atención al cliente, comunicación y modales profesionales",
        "Orientación de carrera y consulta sobre programas posteriores"
      ],
      certificationNote:
        "La duración puede orientarse como formación corta, intensiva de un mes o regular de dos meses según consulta y materias seleccionadas.",
      durationHighlights: ["Formación corta", "Intensivo de 1 mes", "Regular de 2 meses"],
      keyMetrics: [
        { label: "Ruta", value: "Empleo" },
        { label: "Duración", value: "2 semanas-2 meses" },
        { label: "Campos", value: "12 áreas" }
      ],
      detailSections: [
        {
          title: "Materias Principales",
          variant: "chips",
          items: [
            "Masaje aroma meridiano",
            "Masaje para maternidad",
            "Certificación nacional",
            "Masaje sueco",
            "Contorno facial",
            "Depilación brasileña",
            "Masaje deportivo",
            "Técnica de salón",
            "Coordinador hospitalario",
            "Masaje de pies",
            "Cuidado médico de la piel",
            "Cuidado quiropráctico"
          ]
        },
        {
          title: "Combinaciones Recomendadas",
          items: [
            "Sueco + waxing + aroma meridiano + deportivo",
            "Aroma meridiano + aromaterapia + cuidado de la piel",
            "Deportivo + meridiano + pies + sueco",
            "Maternidad + aroma meridiano + contorno facial"
          ]
        },
        {
          title: "Ruta Profesional",
          items: [
            "Empleo en sueco premium, spa de hotel y centros de masaje deportivo",
            "Centros de masaje, boutiques de belleza, hospitales, clínicas de maternidad y centros posparto",
            "Consulta para trabajo freelance u operación de salón individual"
          ]
        },
        {
          title: "Ingreso Mensual Estimado",
          variant: "income",
          items: [
            "Guía de consulta tipo A: KRW 8.000.000 a 10.000.000 al mes",
            "Guía de consulta tipo B: KRW 5.000.000 a 8.000.000 al mes",
            "El ingreso real puede variar por ubicación, instalaciones, marketing y operación."
          ]
        },
        {
          title: "Campos de Empleo",
          items: [
            "Operación de salón individual o servicio móvil de cuidado posparto",
            "Empleo en sueco premium, spa de hotel y centros de masaje deportivo",
            "Hospitales, clínicas de maternidad, centros posparto, centros de masaje tailandés y grandes spas"
          ]
        },
        {
          title: "Horario de Clase",
          variant: "schedule",
          items: [
            "Clase intensiva: lun-vie 10:00-13:00 o 14:00-17:00",
            "Clase matutina: lun-vie 10:00-13:00 / tarde: lun-vie 14:00-17:00",
            "Clase nocturna: lun, mie, vie 19:00-21:00"
          ]
        },
        {
          title: "Cursos Relacionados",
          items: [
            "Certificación nacional de estética, cuidado meridiano facial y aromaterapia",
            "Masaje meridiano, deportivo y de pies",
            "Masaje sueco y de maternidad según el objetivo laboral"
          ]
        }
      ]
    },
    "창업전문과정": {
      summary: "Ruta para emprendimiento que cubre técnicas prácticas, planificación de salón, marketing y operación.",
      overview:
        "Esta ruta combina técnicas prácticas avanzadas con planificación de emprendimiento: concepto del salón, ubicación, interior, materiales, personal, formación de servicio, marketing y operación diaria. Ayuda a preparar un plan realista de apertura.",
      audience: "Estudiantes que preparan negocio individual, apertura de nuevo salón o adquisición de un salón existente",
      curriculum: [
        "Diagnóstico de objetivo de emprendimiento y tipo de negocio",
        "Diseño de menú de servicios con programas de alta demanda",
        "Lista de ubicación, interior con control de costos, suministros y materiales",
        "Consulta sobre operación, formación de personal, marketing y gestión"
      ],
      certificationNote:
        "El alcance de apertura y los ingresos proyectados pueden variar por ubicación, instalaciones, zona comercial, marketing y modelo operativo.",
      durationHighlights: ["Consulta de emprendimiento", "Plan de apertura", "Coaching operativo"],
      keyMetrics: [
        { label: "Ruta", value: "Emprendimiento" },
        { label: "Lista", value: "16 puntos" },
        { label: "Tipo", value: "Individual / Salón" }
      ],
      detailSections: [
        {
          title: "Materias Principales",
          variant: "chips",
          items: [
            "Masaje aroma meridiano",
            "Masaje para maternidad",
            "Certificación nacional",
            "Masaje sueco",
            "Contorno facial",
            "Depilación brasileña",
            "Masaje deportivo",
            "Técnica de salón",
            "Coordinador hospitalario",
            "Masaje de pies",
            "Cuidado médico de la piel",
            "Cuidado quiropráctico"
          ]
        },
        {
          title: "Lista de Preparación",
          items: [
            "Técnica competitiva y captación de clientes frecuentes",
            "Concepto rentable, diseño de programas y selección de ubicación",
            "Registro comercial, marketing económico, interior, suministros y materiales",
            "Personal, revisión técnica, sistema de programas, gestión y operación"
          ]
        },
        {
          title: "Modelos de Apertura",
          items: [
            "Sueco + waxing + aroma meridiano + deportivo",
            "Aroma meridiano + aromaterapia + cuidado de la piel",
            "Deportivo + meridiano + pies + sueco",
            "Apertura en officetel, local comercial, nuevo salón o adquisición"
          ]
        },
        {
          title: "Ingreso Mensual Proyectado del Salón",
          variant: "income",
          items: [
            "Guía de consulta tipo A: KRW 80.000.000 a 100.000.000 al mes",
            "Guía de consulta tipo B: KRW 50.000.000 a 80.000.000 al mes",
            "La proyección puede variar por ubicación, instalaciones, marketing y operación."
          ]
        },
        {
          title: "Ingreso Mensual Proyectado Individual",
          variant: "income",
          items: [
            "Guía de consulta tipo A: KRW 15.000.000 a 20.000.000 al mes",
            "Guía de consulta tipo B: KRW 10.000.000 a 15.000.000 al mes",
            "El ingreso puede variar por modelo operativo y captación de clientes."
          ]
        },
        {
          title: "Horario de Clase",
          variant: "schedule",
          items: [
            "Clase intensiva: lun-vie 10:00-13:00 o 14:00-17:00",
            "Clase matutina: lun-vie 10:00-13:00 / tarde: lun-vie 14:00-17:00",
            "Clase nocturna: lun, mie, vie 19:00-21:00"
          ]
        },
        {
          title: "Cursos Relacionados",
          items: [
            "Certificación nacional de estética, cuidado meridiano facial y aromaterapia",
            "Masaje meridiano, deportivo y de pies",
            "Masaje sueco y de maternidad según el concepto de emprendimiento"
          ]
        }
      ]
    },
    "주말반/취미반": {
      summary: "Ruta de fin de semana para quienes tienen poco tiempo entre semana o desean aprender como hobby.",
      overview:
        "La clase de fin de semana y hobby está diseñada para personas que preparan un cambio de carrera o desean aprender cuidado de piel y masaje como hobby manteniendo su agenda semanal. Las sesiones de sábado o domingo por la mañana y tarde permiten elegir materias prácticas según el interés.",
      audience: "Adultos trabajadores, estudiantes que preparan cambio de carrera y principiantes interesados en belleza y bienestar",
      curriculum: [
        "Consulta sobre objetivo, día disponible y horario",
        "Selección de materias de estética, aroma, meridiano, deportivo y pies",
        "Práctica intensiva de fin de semana por la mañana o tarde",
        "Orientación hacia uso como hobby o rutas de empleo y emprendimiento"
      ],
      certificationNote:
        "Las clases de fin de semana operan en bloques de sábado o domingo por la mañana y tarde. Las materias y criterios de finalización se guían según selección y consulta.",
      durationHighlights: ["Clase sábado", "Clase domingo", "Mañana / tarde"],
      keyMetrics: [
        { label: "Ruta", value: "Fin de semana" },
        { label: "Días", value: "Sáb / Dom" },
        { label: "Horario", value: "10:00-17:00" }
      ],
      detailSections: [
        {
          title: "Recomendado Para",
          items: [
            "Adultos trabajadores y estudiantes que no pueden asistir entre semana",
            "Principiantes que desean aprender cuidado de piel y masaje como hobby",
            "Personas que desean probar práctica básica antes de empleo o emprendimiento"
          ]
        },
        {
          title: "Materias Seleccionables",
          variant: "chips",
          items: [
            "Estética",
            "Contorno facial",
            "Cuidado médico de la piel",
            "Aromaterapia",
            "Masaje meridiano",
            "Masaje deportivo",
            "Masaje de pies",
            "Masaje sueco",
            "Masaje de maternidad"
          ]
        },
        {
          title: "Flujo de Aprendizaje",
          items: [
            "Consulta sobre intereses y propósito",
            "Comprensión de teoría básica y secuencia de cuidado",
            "Demostración experta y práctica paso a paso",
            "Conexión con uso como hobby o cursos avanzados"
          ]
        },
        {
          title: "Formas de Uso",
          items: [
            "Práctica como hobby para familia y conocidos",
            "Experiencia inicial antes de cambiar a belleza y bienestar",
            "Consulta hacia programas de empleo o emprendimiento"
          ]
        },
        {
          title: "Cursos Relacionados",
          items: [
            "Certificación nacional de estética, cuidado meridiano facial y aromaterapia",
            "Masaje meridiano, deportivo y de pies",
            "Masaje sueco y de maternidad según interés"
          ]
        },
        {
          title: "Horario de Fin de Semana",
          variant: "schedule",
          items: [
            "Clase sábado: 10:00-13:00 o 14:00-17:00",
            "Clase domingo: 10:00-13:00 o 14:00-17:00",
            "Nota de consulta: El horario por materia puede variar según calendario."
          ]
        }
      ]
    },
    "얼굴축소경락": {
      summary: "Curso práctico que conecta análisis de piel, masaje meridiano de contorno facial, técnica manual y atención al cliente.",
      overview:
        "El cuidado meridiano de contorno facial enseña a analizar el estado de la piel y las necesidades del rostro, y practica limpieza, limpieza profunda, mascarillas, equipos de belleza, masaje meridiano y técnicas manuales paso a paso. El flujo original regular e intensivo se reorganiza como una ruta práctica moderna.",
      audience: "Estudiantes que preparan empleo en cabinas de estética, apertura de salón o práctica de contorno facial y cuidado de piel",
      curriculum: [
        "Análisis de tipo de piel y práctica de ficha de consulta",
        "Limpieza, limpieza profunda, mascarillas y selección de productos funcionales",
        "Práctica en pareja de masaje meridiano de contorno facial y técnica manual",
        "Atención al cliente, etiqueta, higiene, imagen profesional y orientación laboral"
      ],
      certificationNote:
        "El curso regular se orienta como ruta de dos meses y el intensivo como ruta de un mes. Los horarios se coordinan por consulta en bloques de 10:00-13:00, 14:00-17:00 y 19:00-21:00.",
      durationHighlights: ["Regular 2 meses", "Intensivo 1 mes", "Bloques 10 / 14 / 19"],
      keyMetrics: [
        { label: "Ruta", value: "Práctica" },
        { label: "Duración", value: "1-2 meses" },
        { label: "Práctica", value: "En pareja" }
      ],
      detailSections: [
        {
          title: "Mapa del Curso Regular",
          variant: "schedule",
          items: [
            "Mes 1: análisis de piel y consulta, limpieza y limpieza profunda, cosméticos por tipo de piel, packs y mascarillas",
            "Mes 2: uso de equipos, masaje meridiano facial y técnica manual, cuidados especiales con productos funcionales, bases del terapeuta",
            "Horarios: 10:00-13:00, 14:00-17:00, 19:00-21:00"
          ]
        },
        {
          title: "Mapa del Curso Intensivo",
          variant: "schedule",
          items: [
            "Semana 1: orientación, análisis de tipo de piel, consulta de cliente, limpieza y limpieza profunda",
            "Semanas 2-3: cosméticos, packs, mascarillas, equipos de belleza y práctica intensiva de masaje facial",
            "Semana 4: blanqueamiento, arrugas, contorno facial, vitamina, pack herbal y entrenamiento de imagen"
          ]
        },
        {
          title: "Técnicas Principales",
          variant: "chips",
          items: [
            "Análisis de piel",
            "Ficha de cliente",
            "Limpieza",
            "Limpieza profunda",
            "Packs y mascarillas",
            "Equipos de belleza",
            "Masaje meridiano facial",
            "Técnica manual",
            "Productos funcionales",
            "Etiqueta e imagen"
          ]
        },
        {
          title: "Características de Formación",
          items: [
            "Instrucción grupal, guía individual y práctica mutua en pareja",
            "Aprendizaje práctico de resolución de problemas que conecta principios y teoría",
            "Atención al cliente, actitud profesional y etiqueta para el empleo"
          ]
        },
        {
          title: "Problemas de Piel Cubiertos",
          items: [
            "Acné, poros, pigmentación, líneas finas y conceptos de piel envejecida",
            "Factores de piel sensible y seca con selección de productos por tipo",
            "Flujo de cuidado centrado en hidratación, circulación, elasticidad y tono más claro"
          ]
        },
        {
          title: "Conducta e Higiene",
          items: [
            "Guiar al cliente a una postura cómoda y confirmar la presión deseada",
            "Mantener uñas, higiene de manos, ropa, respiración y postura controladas",
            "Practicar velocidad estable, principios de presión y respiración durante el cuidado facial"
          ]
        },
        {
          title: "Campos Profesionales",
          items: [
            "Salones de estética, instructor de academia, clínicas orientales, dermatología y salas de cirugía plástica",
            "Centros posparto, apertura de beauty shop y massage shop, salones integrales",
            "Hoteles, spas, centros deportivos, salón privado, empleo y emprendimiento en el exterior"
          ]
        }
      ]
    }
  }
};

function getSlug(title: string) {
  return title
    .replace(/[^\w가-힣]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export type Course = {
  title: string;
  slug: string;
  categoryKey: Exclude<CourseCategory, "all">;
  category: string;
  summary: string;
  imageUrl: string;
  overview: string;
  audience: string;
  curriculum: string[];
  certificationNote: string;
  detailSections?: CourseDetailSection[];
  durationHighlights?: string[];
  keyMetrics?: Array<{ label: string; value: string }>;
  source: string;
};

function getActiveLocale(locale: string): Locale {
  return isLocale(locale) ? locale : defaultLocale;
}

export function getCourses(locale: string): Course[] {
  const activeLocale = getActiveLocale(locale);

  return courseTitleTranslations.map((titles, index) => {
    const categoryKey = titles.categoryKey;
    const text = courseTextByLocale[activeLocale][categoryKey];
    const override = courseOverridesByLocale[activeLocale][titles.ko] ?? {};
    const courseText = { ...text, ...override };

    return {
      title: titles[activeLocale],
      slug: getSlug(titles.ko),
      categoryKey,
      category: courseText.category,
      summary: courseText.summary,
      imageUrl: courseImages[index % courseImages.length],
      overview: courseText.overview,
      audience: courseText.audience,
      curriculum: courseText.curriculum,
      certificationNote: courseText.certificationNote,
      detailSections: courseText.detailSections,
      durationHighlights: courseText.durationHighlights,
      keyMetrics: courseText.keyMetrics,
      source: `https://www.smc365.ac/curriculum/${titles.sourcePath}`
    };
  });
}

export function getCourseSlugs() {
  return courseTitleTranslations.map((titles) => getSlug(titles.ko));
}

export function getCourseBySlug(slug: string, locale: string) {
  return getCourses(locale).find((course) => course.slug === slug);
}

const activityGroupsByLocale: Record<Locale, Array<{
  title: string;
  key: string;
  icon: typeof CalendarDays;
  source: string;
  summary: string;
  imageUrl: string;
}>> = {
  ko: [
  {
    title: "공지/시험일정",
    key: "notice",
    icon: CalendarDays,
    source: "관리자 입력 게시판",
    summary: "운영자가 관리자에서 공지와 시험일정 게시글을 직접 등록합니다.",
    imageUrl: "/assets/activity-training.png"
  },
  {
    title: "합격현황/합격률",
    key: "pass",
    icon: BadgeCheck,
    source: "관리자 입력 게시판",
    summary: "운영자가 관리자에서 합격자 명단과 합격률 관련 소식을 직접 등록합니다.",
    imageUrl: "/assets/course-medical-skincare.png"
  },
  {
    title: "포토갤러리",
    key: "photo",
    icon: Image,
    source: "관리자 입력 게시판",
    summary: "운영자가 관리자에서 업무협약, 대회, 수료자, 교육 현장 사진을 직접 등록합니다.",
    imageUrl: "/assets/activity-wellness.png"
  },
  {
    title: "심사위원/수상경력",
    key: "awards",
    icon: Award,
    source: "관리자 입력 게시판",
    summary: "운영자가 관리자에서 심사위원 위촉, 표창, 수상 이력 콘텐츠를 직접 등록합니다.",
    imageUrl: "/assets/partner-network.png"
  },
  {
    title: "국제미용대회",
    key: "competition",
    icon: Globe2,
    source: "관리자 입력 게시판",
    summary: "운영자가 관리자에서 한국휴먼 올림픽대회와 국제 미용·건강 대회 활동을 직접 등록합니다.",
    imageUrl: "/assets/hero-professionals.png"
  },
  {
    title: "방송/언론",
    key: "media",
    icon: Newspaper,
    source: "관리자 입력 게시판",
    summary: "운영자가 관리자에서 방송국, 언론사 취재와 미디어 노출 이력을 직접 등록합니다.",
    imageUrl: "/assets/course-aroma-therapy.png"
  }
  ],
  en: [
    { title: "Notices / Exam Schedule", key: "notice", icon: CalendarDays, source: "Admin-managed board", summary: "Operators will manually publish notices and exam schedule posts from the admin area.", imageUrl: "/assets/activity-training.png" },
    { title: "Pass Records / Pass Rate", key: "pass", icon: BadgeCheck, source: "Admin-managed board", summary: "Operators will manually publish pass lists and pass-rate updates from the admin area.", imageUrl: "/assets/course-medical-skincare.png" },
    { title: "Photo Gallery", key: "photo", icon: Image, source: "Admin-managed board", summary: "Operators will manually publish partnership, competition, completion, and training photos from the admin area.", imageUrl: "/assets/activity-wellness.png" },
    { title: "Judges / Awards", key: "awards", icon: Award, source: "Admin-managed board", summary: "Operators will manually publish judge appointments, commendations, and award history from the admin area.", imageUrl: "/assets/partner-network.png" },
    { title: "International Beauty Competitions", key: "competition", icon: Globe2, source: "Admin-managed board", summary: "Operators will manually publish Korea Human Olympic and international competition records from the admin area.", imageUrl: "/assets/hero-professionals.png" },
    { title: "Media Coverage", key: "media", icon: Newspaper, source: "Admin-managed board", summary: "Operators will manually publish broadcast and media coverage records from the admin area.", imageUrl: "/assets/course-aroma-therapy.png" }
  ],
  es: [
    { title: "Avisos / Calendario de Exámenes", key: "notice", icon: CalendarDays, source: "Tablero administrado", summary: "Los operadores publicarán manualmente avisos y calendarios de exámenes desde el área de administración.", imageUrl: "/assets/activity-training.png" },
    { title: "Resultados / Tasa de Aprobación", key: "pass", icon: BadgeCheck, source: "Tablero administrado", summary: "Los operadores publicarán manualmente listas de aprobados y actualizaciones de tasas desde el área de administración.", imageUrl: "/assets/course-medical-skincare.png" },
    { title: "Galería de Fotos", key: "photo", icon: Image, source: "Tablero administrado", summary: "Los operadores publicarán manualmente fotos de alianzas, competencias, finalizaciones y formación desde el área de administración.", imageUrl: "/assets/activity-wellness.png" },
    { title: "Jueces / Premios", key: "awards", icon: Award, source: "Tablero administrado", summary: "Los operadores publicarán manualmente designaciones de jueces, reconocimientos e historial de premios desde el área de administración.", imageUrl: "/assets/partner-network.png" },
    { title: "Concursos Internacionales de Belleza", key: "competition", icon: Globe2, source: "Tablero administrado", summary: "Los operadores publicarán manualmente registros de Korea Human Olympic y competencias internacionales desde el área de administración.", imageUrl: "/assets/hero-professionals.png" },
    { title: "Cobertura en Medios", key: "media", icon: Newspaper, source: "Tablero administrado", summary: "Los operadores publicarán manualmente registros de televisión y prensa desde el área de administración.", imageUrl: "/assets/course-aroma-therapy.png" }
  ]
};

export function getActivityGroups(locale: string) {
  return activityGroupsByLocale[getActiveLocale(locale)];
}

const statsByLocale: Record<Locale, Array<{ label: string; value: string }>> = {
  ko: [
    { label: "운영 경력", value: "25+" },
    { label: "연결 국가", value: "48+" },
    { label: "자격 전문가", value: "6,200+" },
    { label: "파트너 기관", value: "320+" }
  ],
  en: [
    { label: "Years of Excellence", value: "25+" },
    { label: "Countries", value: "48+" },
    { label: "Certified Professionals", value: "6,200+" },
    { label: "Partner Institutions", value: "320+" }
  ],
  es: [
    { label: "Años de Excelencia", value: "25+" },
    { label: "Países", value: "48+" },
    { label: "Profesionales Certificados", value: "6,200+" },
    { label: "Instituciones Socias", value: "320+" }
  ]
};

export function getStats(locale: string) {
  return statsByLocale[getActiveLocale(locale)];
}

export const adminModules = [
  { title: "페이지 관리자", icon: BookOpen, status: "CMS" },
  { title: "과정 관리자", icon: GraduationCap, status: "CMS" },
  { title: "커뮤니티 관리자", icon: Newspaper, status: "CMS" },
  { title: "문의 관리자", icon: Handshake, status: "Lead" },
  { title: "사용자 관리자", icon: Users, status: "Auth" },
  { title: "자격 데이터", icon: ShieldCheck, status: "Secure" },
  { title: "팝업/배너", icon: Sparkles, status: "Content" },
  { title: "번역 상태", icon: Globe2, status: "i18n" }
];

const locationsByLocale: Record<Locale, Array<{ name: string; address: string; phone: string }>> = {
  ko: [
    {
      name: "한국건강관리사자격협회 서울본사",
      address: "서울시 종로구 수표로 120 내인빌딩 8층",
      phone: "02-763-1271 / 010-7712-3362"
    },
    {
      name: "SMC아카데미 본점",
      address: "서울시 종로구 수표로 120 내인빌딩 7층",
      phone: "010-6283-1206"
    },
    {
      name: "강남SMC아카데미 구로디지털단지역점",
      address: "서울시 관악구 시흥대로 558-1 G밸리마인드 5층 505호",
      phone: "02-867-2280 / 010-6283-1206"
    },
    {
      name: "한국건강관리사자격협회 구로디지털단지역점",
      address: "서울시 관악구 시흥대로 558-1 G밸리마인드 5층 503호",
      phone: "02-867-2281 / 010-6283-1206"
    },
    {
      name: "한국건강관리사자격협회 대림캠퍼스",
      address: "서울시 영등포구 대림로 23길 30-1 골든타워 6층",
      phone: "010-5589-9812"
    }
  ],
  en: [
    {
      name: "KHCPQA Seoul Headquarters",
      address: "8F Naein Building, 120 Supyo-ro, Jongno-gu, Seoul",
      phone: "02-763-1271 / 010-7712-3362"
    },
    {
      name: "SMC Academy Main Campus",
      address: "7F Naein Building, 120 Supyo-ro, Jongno-gu, Seoul",
      phone: "010-6283-1206"
    },
    {
      name: "Gangnam SMC Academy Guro Digital Complex Branch",
      address: "5F 505, G Valley Mind, 558-1 Siheung-daero, Gwanak-gu, Seoul",
      phone: "02-867-2280 / 010-6283-1206"
    },
    {
      name: "KHCPQA Guro Digital Complex Branch",
      address: "5F 503, G Valley Mind, 558-1 Siheung-daero, Gwanak-gu, Seoul",
      phone: "02-867-2281 / 010-6283-1206"
    },
    {
      name: "KHCPQA Daerim Campus",
      address: "6F Golden Tower, 30-1 Daerim-ro 23-gil, Yeongdeungpo-gu, Seoul",
      phone: "010-5589-9812"
    }
  ],
  es: [
    {
      name: "Sede Central de KHCPQA en Seúl",
      address: "8F Naein Building, 120 Supyo-ro, Jongno-gu, Seúl",
      phone: "02-763-1271 / 010-7712-3362"
    },
    {
      name: "Campus Principal de SMC Academy",
      address: "7F Naein Building, 120 Supyo-ro, Jongno-gu, Seúl",
      phone: "010-6283-1206"
    },
    {
      name: "Sucursal Gangnam SMC Academy Guro Digital Complex",
      address: "5F 505, G Valley Mind, 558-1 Siheung-daero, Gwanak-gu, Seúl",
      phone: "02-867-2280 / 010-6283-1206"
    },
    {
      name: "Sucursal KHCPQA Guro Digital Complex",
      address: "5F 503, G Valley Mind, 558-1 Siheung-daero, Gwanak-gu, Seúl",
      phone: "02-867-2281 / 010-6283-1206"
    },
    {
      name: "Campus Daerim de KHCPQA",
      address: "6F Golden Tower, 30-1 Daerim-ro 23-gil, Yeongdeungpo-gu, Seúl",
      phone: "010-5589-9812"
    }
  ]
};

export function getLocations(locale: string) {
  return locationsByLocale[getActiveLocale(locale)];
}

export function getCopy(locale: string) {
  return copy[isLocale(locale) ? locale : defaultLocale];
}
