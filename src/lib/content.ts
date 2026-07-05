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

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const localeLabels: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  es: "Español"
};

export const navItems = [
  { key: "about", href: "about" },
  { key: "curriculum", href: "curriculum" },
  { key: "activities", href: "activities" },
  { key: "partner", href: "partner-inquiry" },
  { key: "contact", href: "contact" }
] as const;

export const copy = {
  ko: {
    brand: "KHCPQA",
    brandFull: "Korea Health Care Professional Qualification Association",
    nav: {
      about: "협회 소개",
      curriculum: "커리큘럼",
      activities: "글로벌 활동",
      partner: "파트너 문의",
      contact: "연락처",
      login: "로그인"
    },
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
    formSubmit: "문의 저장"
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
    formSubmit: "Save Inquiry"
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
    formSubmit: "Guardar Consulta"
  }
} satisfies Record<Locale, Record<string, unknown>>;

const courseImages = [
  "/assets/course-thumb-skincare.png",
  "/assets/course-thumb-instructor-class.png",
  "/assets/course-thumb-business-planning.png",
  "/assets/course-thumb-business-planning.png",
  "/assets/course-thumb-aromatherapy.png",
  "/assets/course-thumb-skincare.png",
  "/assets/course-thumb-skincare.png",
  "/assets/course-thumb-aromatherapy.png",
  "/assets/course-thumb-massage-training.png",
  "/assets/course-thumb-massage-training.png",
  "/assets/course-thumb-foot-reflexology.png",
  "/assets/course-thumb-foot-reflexology.png"
];

export const courses = [
  "피부미용사 국가자격증",
  "강사과정교육",
  "취업전문과정",
  "창업전문과정",
  "주말반/취미반",
  "얼굴축소경락",
  "메디컬 스킨케어",
  "아로마 테라피",
  "경락 마사지",
  "스포츠 마사지",
  "발 마사지",
  "산모 마사지",
  "베이비 마사지",
  "타이 마사지",
  "카이로프랙틱",
  "스웨디시",
  "스파 테라피",
  "브라질리언 왁싱",
  "병원코디네이터"
].map((title, index) => ({
  title,
  slug: title
    .replace(/[^\w가-힣]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase(),
  category: index < 2 ? "Certification" : index < 5 ? "Professional Track" : "Practical Program",
  summary:
    index < 2
      ? "자격 취득과 강사 역량을 함께 준비하는 KHCPQA 기준 교육 과정입니다."
      : index < 5
        ? "취업, 창업, 주말 학습 등 목표별 실무 역량을 체계적으로 준비합니다."
        : "건강·미용·웰니스 현장에서 활용할 수 있는 실습 중심 프로그램입니다.",
  imageUrl: courseImages[index % courseImages.length],
  overview:
    "기존 SMC365 교육 콘텐츠를 KHCPQA 글로벌 플랫폼 구조에 맞춰 정리한 과정입니다. 과정 개요, 실습 흐름, 자격 또는 수료 안내를 한 화면에서 확인할 수 있도록 설계합니다.",
  audience:
    index < 2
      ? "전문 자격 취득을 준비하는 교육생, 현직 종사자, 강사 과정 지원자"
      : index < 5
        ? "취업·창업·시간제 학습을 목표로 하는 예비 전문가"
        : "현장 실무 기술을 보완하려는 웰니스·뷰티·헬스케어 분야 교육생",
  curriculum: [
    "과정 오리엔테이션과 기본 이론",
    "전문 실습 시연 및 단계별 훈련",
    "현장 적용 사례와 고객 응대 기준",
    "수료 또는 자격 취득 준비 체크"
  ],
  certificationNote:
    "자격 취득 또는 수료 기준은 과정별 운영 정책과 관리자 등록 데이터에 따라 안내됩니다.",
  source: `https://www.smc365.ac/curriculum/curriculum${String(index + 1).padStart(2, "0")}.asp`
}));

export function getCourseBySlug(slug: string) {
  return courses.find((course) => course.slug === slug);
}

export const activityGroups = [
  {
    title: "공지/시험일정",
    key: "notice",
    icon: CalendarDays,
    source: "boardName=notice",
    imageUrl: "/assets/activity-training.png"
  },
  {
    title: "합격현황/합격률",
    key: "pass",
    icon: BadgeCheck,
    source: "boardName=pass",
    imageUrl: "/assets/course-medical-skincare.png"
  },
  {
    title: "포토갤러리",
    key: "photo",
    icon: Image,
    source: "boardName=photo",
    imageUrl: "/assets/activity-wellness.png"
  },
  {
    title: "심사위원/수상경력",
    key: "awards",
    icon: Award,
    source: "boardName=awards",
    imageUrl: "/assets/partner-network.png"
  },
  {
    title: "국제미용대회",
    key: "competition",
    icon: Globe2,
    source: "boardName=beauty",
    imageUrl: "/assets/hero-professionals.png"
  },
  {
    title: "방송/언론",
    key: "media",
    icon: Newspaper,
    source: "boardName=media",
    imageUrl: "/assets/course-aroma-therapy.png"
  }
];

export const stats = [
  { label: "Years of Excellence", value: "25+" },
  { label: "Countries", value: "48+" },
  { label: "Certified Professionals", value: "6,200+" },
  { label: "Partner Institutions", value: "320+" }
];

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

export const locations = [
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
    name: "한국건강관리사자격협회 대림캠퍼스",
    address: "서울시 영등포구 대림로 23길 30-1 골든타워 6층",
    phone: "010-5589-9812"
  }
];

export function getCopy(locale: string) {
  return copy[isLocale(locale) ? locale : "ko"] as (typeof copy)["ko"];
}
