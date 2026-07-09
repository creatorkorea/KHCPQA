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
    features: FeatureCopy[];
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
      contact: "연락처",
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
        "SMC아카데미와 한국건강관리사자격협회의 기존 소개, 인사말, 수석강사, 연혁, 조직도 콘텐츠를 국제 협회형 정보 구조로 재정리합니다.",
      features: [
        { title: "기관 프로필", body: "소개, 인사말, 연혁, 조직도를 하나의 신뢰 중심 스토리로 구성합니다." },
        { title: "수석강사", body: "수석강사 프로필과 전문 분야를 글로벌 파트너가 이해하기 쉽게 보여줍니다." },
        { title: "글로벌 포지셔닝", body: "한국 기반 전문 교육기관이라는 포지션을 영어/스페인어 사용자에게 전달합니다." },
        { title: "신뢰 요소", body: "수상경력, 대회, 언론, 봉사활동 콘텐츠를 신뢰 요소로 연결합니다." }
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
      audienceTitle: "교육 대상",
      certificationTitle: "수료/자격 안내",
      sourceTitle: "원본 URL"
    },
    activitiesPage: {
      eyebrow: "글로벌 활동",
      lead: "공지, 합격현황, 갤러리, 수상경력, 국제미용대회, 방송/언론, 봉사활동을 글로벌 신뢰 콘텐츠로 재배치합니다."
    },
    contact: {
      eyebrow: "연락처",
      lead: "기존 SMC365 하단의 본사, 본점, 지점, 캠퍼스 연락처를 신규 Contact 페이지와 푸터에 반영합니다."
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
        professional: "전문 트랙",
        practical: "실무 프로그램"
      },
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
        "Existing academy introductions, greetings, senior instructor profiles, history, and organization content are reorganized into an international association-style information structure.",
      features: [
        { title: "Institutional Profile", body: "Introduction, greeting, history, and organization content are shaped into one trust-focused story." },
        { title: "Senior Instructors", body: "Senior instructor profiles and specialties are presented for global partners to understand quickly." },
        { title: "Global Positioning", body: "The page communicates KHCPQA as a Korea-based professional education institution for English and Spanish users." },
        { title: "Trust Signals", body: "Awards, competitions, media, and volunteer activity content are connected as credibility signals." }
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
      audienceTitle: "Audience",
      certificationTitle: "Completion / Certification",
      sourceTitle: "Source URL"
    },
    activitiesPage: {
      eyebrow: "Global Activities",
      lead: "Notices, pass records, galleries, awards, international beauty competitions, media, and volunteer activities are reorganized as global trust content."
    },
    contact: {
      eyebrow: "Contact",
      lead: "Headquarters, main branch, campus, and branch contact details from the existing SMC365 footer are reflected in the new Contact page and footer."
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
        professional: "Professional Track",
        practical: "Practical Program"
      },
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
        "La información existente de presentación, saludo, instructores principales, historia y organización se reorganiza como una estructura informativa de asociación internacional.",
      features: [
        { title: "Perfil institucional", body: "La presentación, el saludo, la historia y la organización se convierten en una narrativa centrada en la confianza." },
        { title: "Instructores principales", body: "Los perfiles y especialidades de los instructores se presentan para que los socios globales los comprendan con facilidad." },
        { title: "Posicionamiento global", body: "La página comunica a KHCPQA como una institución profesional de educación basada en Corea." },
        { title: "Señales de confianza", body: "Premios, concursos, medios y actividades de voluntariado se conectan como elementos de credibilidad." }
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
      audienceTitle: "Dirigido a",
      certificationTitle: "Finalización / Certificación",
      sourceTitle: "URL de origen"
    },
    activitiesPage: {
      eyebrow: "Actividades Globales",
      lead: "Avisos, resultados, galerías, premios, concursos internacionales de belleza, medios y voluntariado se reorganizan como contenido global de confianza."
    },
    contact: {
      eyebrow: "Contacto",
      lead: "Los datos de contacto de la sede, sucursal principal, campus y sedes del pie de página existente de SMC365 se reflejan en la nueva página de Contacto y en el footer."
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
        professional: "Ruta Profesional",
        practical: "Programa Práctico"
      },
      emptyState: "Ningún programa coincide con los filtros. Ajuste la palabra clave o la categoría.",
      viewDetails: "Ver Detalles"
    }
  }
} satisfies Record<Locale, Copy>;

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

const courseTitleTranslations = [
  {
    ko: "피부미용사 국가자격증",
    en: "National Esthetician Certification",
    es: "Certificación Nacional de Estética"
  },
  { ko: "강사과정교육", en: "Instructor Training Program", es: "Formación de Instructores" },
  { ko: "취업전문과정", en: "Employment Preparation Track", es: "Ruta de Preparación Laboral" },
  { ko: "창업전문과정", en: "Business Startup Track", es: "Ruta de Emprendimiento" },
  { ko: "주말반/취미반", en: "Weekend and Hobby Class", es: "Clase de Fin de Semana y Hobby" },
  { ko: "얼굴축소경락", en: "Facial Contouring Meridian Care", es: "Cuidado Meridiano de Contorno Facial" },
  { ko: "메디컬 스킨케어", en: "Medical Skin Care", es: "Cuidado Médico de la Piel" },
  { ko: "아로마 테라피", en: "Aromatherapy", es: "Aromaterapia" },
  { ko: "경락 마사지", en: "Meridian Massage", es: "Masaje Meridiano" },
  { ko: "스포츠 마사지", en: "Sports Massage", es: "Masaje Deportivo" },
  { ko: "발 마사지", en: "Foot Massage", es: "Masaje de Pies" },
  { ko: "산모 마사지", en: "Maternity Massage", es: "Masaje para Embarazadas" },
  { ko: "베이비 마사지", en: "Baby Massage", es: "Masaje Infantil" },
  { ko: "타이 마사지", en: "Thai Massage", es: "Masaje Tailandés" },
  { ko: "카이로프랙틱", en: "Chiropractic", es: "Quiropráctica" },
  { ko: "스웨디시", en: "Swedish Massage", es: "Masaje Sueco" },
  { ko: "스파 테라피", en: "Spa Therapy", es: "Terapia de Spa" },
  { ko: "브라질리언 왁싱", en: "Brazilian Waxing", es: "Depilación Brasileña" },
  { ko: "병원코디네이터", en: "Hospital Coordinator", es: "Coordinador Hospitalario" }
] satisfies Array<Record<Locale, string>>;

const courseTextByLocale: Record<
  Locale,
  Record<Exclude<CourseCategory, "all">, {
    category: string;
    summary: string;
    overview: string;
    audience: string;
    curriculum: string[];
    certificationNote: string;
  }>
> = {
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
      category: "전문 트랙",
      summary: "취업, 창업, 주말 학습 등 목표별 실무 역량을 체계적으로 준비합니다.",
      overview:
        "목표별 학습 흐름을 중심으로 기존 교육 콘텐츠를 재구성한 전문 트랙입니다. 상담, 실습, 포트폴리오 준비까지 단계별 안내를 제공합니다.",
      audience: "취업·창업·시간제 학습을 목표로 하는 예비 전문가",
      curriculum: ["목표 진단과 과정 설계", "핵심 실무 기술 훈련", "취업·창업 적용 사례", "수료 후 상담 및 운영 체크"],
      certificationNote: "수료 기준과 후속 자격 안내는 과정별 운영 정책과 관리자 등록 데이터에 따라 안내됩니다."
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
      category: "Professional Track",
      summary: "A structured track for employment, startup preparation, weekend study, and other goal-based practical skills.",
      overview:
        "This professional track reorganizes existing education content around goal-based learning flows, including consultation, practice, and portfolio preparation.",
      audience: "Prospective professionals preparing for employment, startup, or part-time learning goals",
      curriculum: ["Goal assessment and program planning", "Core practical skill training", "Employment and startup application cases", "Post-completion consultation and operating checks"],
      certificationNote: "Completion criteria and follow-up certification guidance are provided according to each program's operating policy."
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
      category: "Ruta Profesional",
      summary: "Una ruta estructurada para empleo, emprendimiento, estudio de fin de semana y habilidades prácticas por objetivo.",
      overview:
        "Esta ruta profesional reorganiza el contenido educativo existente alrededor de flujos de aprendizaje por objetivo, incluyendo consulta, práctica y preparación de portafolio.",
      audience: "Futuros profesionales que se preparan para empleo, emprendimiento o aprendizaje parcial",
      curriculum: ["Evaluación de objetivos y planificación del programa", "Entrenamiento de habilidades prácticas centrales", "Casos de aplicación laboral y empresarial", "Consulta posterior y revisión operativa"],
      certificationNote: "Los criterios de finalización y la guía de certificación posterior se ofrecen según la política operativa de cada programa."
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

function getCategoryKey(index: number): Exclude<CourseCategory, "all"> {
  if (index < 2) {
    return "certification";
  }

  if (index < 5) {
    return "professional";
  }

  return "practical";
}

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
  source: string;
};

function getActiveLocale(locale: string): Locale {
  return isLocale(locale) ? locale : defaultLocale;
}

export function getCourses(locale: string): Course[] {
  const activeLocale = getActiveLocale(locale);

  return courseTitleTranslations.map((titles, index) => {
    const categoryKey = getCategoryKey(index);
    const text = courseTextByLocale[activeLocale][categoryKey];

    return {
      title: titles[activeLocale],
      slug: getSlug(titles.ko),
      categoryKey,
      category: text.category,
      summary: text.summary,
      imageUrl: courseImages[index % courseImages.length],
      overview: text.overview,
      audience: text.audience,
      curriculum: text.curriculum,
      certificationNote: text.certificationNote,
      source: `https://www.smc365.ac/curriculum/curriculum${String(index + 1).padStart(2, "0")}.asp`
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
