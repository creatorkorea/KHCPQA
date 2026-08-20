export const courseLocales = ["ko", "en", "es", "zh-CN"] as const;
export const courseCategories = ["certification", "professional", "practical"] as const;
export const courseStatuses = ["draft", "translated", "reviewed", "published", "archived"] as const;

export type CourseLocale = (typeof courseLocales)[number];
export type CourseCategoryKey = (typeof courseCategories)[number];
export type CoursePublishStatus = (typeof courseStatuses)[number];

export function getCourseFallbackPolicy(locale: string, hasSupabase: boolean) {
  if (locale === "ko") return "static" as const;
  if (!hasSupabase && (locale === "en" || locale === "es")) return "static" as const;
  return "none" as const;
}

export type PublishedCourse = {
  category: string;
  categoryKey: CourseCategoryKey;
  certificationNote: string;
  curriculumItems: string[];
  duration: string;
  id?: string;
  imageUrl: string;
  overview: string;
  pdfFileName?: string;
  pdfUrl?: string;
  recommendedFor: string[];
  slug: string;
  sortOrder: number;
  summary: string;
  title: string;
  updatedAt?: string;
};

export type AdminCourseLocalization = {
  certificationNote: string;
  courseId: string;
  curriculumItems: string[];
  duration: string;
  id: string;
  imageAlt: string;
  imageUrl: string;
  locale: CourseLocale;
  overview: string;
  pdfFileName: string;
  pdfUrl: string;
  recommendedFor: string[];
  reviewedAt: string;
  reviewedBy: string;
  seoDescription: string;
  seoTitle: string;
  sourceUpdatedAt: string;
  status: CoursePublishStatus;
  summary: string;
  title: string;
  translatedFromUpdatedAt: string;
  updatedAt: string;
};

export type AdminCourseRecord = {
  categoryKey: CourseCategoryKey;
  createdAt: string;
  id: string;
  isActive: boolean;
  localizations: AdminCourseLocalization[];
  slug: string;
  sortOrder: number;
  updatedAt: string;
};

export function createCourseSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export function splitCourseLines(value: string) {
  return Array.from(
    new Set(
      value
        .split("\n")
        .map((line) => line.replace(/^[-*]\s*/, "").trim())
        .filter(Boolean)
    )
  );
}

export function buildCourseLocalizationPayload(input: {
  certificationNote: string;
  courseId: string;
  curriculumText: string;
  duration: string;
  imageUrl: string;
  locale: string;
  overview: string;
  pdfFileName: string;
  pdfUrl: string;
  recommendedText: string;
  status: string;
  summary: string;
  title: string;
}) {
  const payload = {
    certificationNote: input.certificationNote.trim(),
    courseId: input.courseId.trim(),
    curriculumItems: splitCourseLines(input.curriculumText),
    duration: input.duration.trim(),
    imageUrl: input.imageUrl.trim(),
    locale: input.locale.trim(),
    overview: input.overview.trim(),
    pdfFileName: input.pdfFileName.trim(),
    pdfUrl: input.pdfUrl.trim(),
    recommendedFor: splitCourseLines(input.recommendedText),
    status: input.status.trim(),
    summary: input.summary.trim(),
    title: input.title.trim()
  };

  if (!payload.courseId || !payload.title) {
    return { ok: false as const, message: "과정과 제목을 확인해 주세요." };
  }

  if (!courseLocales.includes(payload.locale as CourseLocale)) {
    return { ok: false as const, message: "언어 값을 확인해 주세요." };
  }

  if (!courseStatuses.includes(payload.status as CoursePublishStatus)) {
    return { ok: false as const, message: "게시 상태를 확인해 주세요." };
  }

  if (payload.status === "published" && (!payload.summary || !payload.overview)) {
    return { ok: false as const, message: "공개 과정은 요약과 과정 개요가 필요합니다." };
  }

  return {
    ok: true as const,
    payload: {
      ...payload,
      locale: payload.locale as CourseLocale,
      status: payload.status as CoursePublishStatus
    }
  };
}
