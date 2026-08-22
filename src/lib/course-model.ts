export const courseLocales = ["ko", "en", "es", "zh-CN"] as const;
export const courseCategories = ["certification", "professional", "practical"] as const;
export const courseStatuses = ["draft", "translated", "reviewed", "published", "archived"] as const;
export const courseTemplateKeys = ["certification", "practical", "career", "startup", "hobby", "instructor"] as const;
export const courseSectionTypes = [
  "learning_method",
  "goals",
  "theory",
  "practice",
  "exam",
  "precautions",
  "benefits",
  "careers",
  "programs",
  "gallery"
] as const;

export type CourseLocale = (typeof courseLocales)[number];
export type CourseCategoryKey = (typeof courseCategories)[number];
export type CoursePublishStatus = (typeof courseStatuses)[number];
export type CourseTemplateKey = (typeof courseTemplateKeys)[number];
export type CourseSectionType = (typeof courseSectionTypes)[number];

export const courseTemplatesByCategory: Record<CourseCategoryKey, readonly CourseTemplateKey[]> = {
  certification: ["certification"],
  professional: ["career", "startup", "hobby"],
  practical: ["practical", "instructor"]
};

export function getDefaultCourseTemplateKey(categoryKey: CourseCategoryKey) {
  return courseTemplatesByCategory[categoryKey][0];
}

export function isCourseClassificationValid(categoryKey: string, templateKey: string) {
  if (!courseCategories.includes(categoryKey as CourseCategoryKey)) return false;
  if (!courseTemplateKeys.includes(templateKey as CourseTemplateKey)) return false;
  return courseTemplatesByCategory[categoryKey as CourseCategoryKey].includes(templateKey as CourseTemplateKey);
}

export type CourseCurriculumItem = {
  items: string[];
  label: string;
  period: string;
  title: string;
};

export type CourseScheduleTrack = {
  duration: string;
  id: string;
  items: CourseCurriculumItem[];
  label: string;
  times: string[];
};

export function groupCurriculumItemsByPeriod(items: CourseCurriculumItem[]) {
  return items.reduce<Array<{ items: CourseCurriculumItem[]; period: string; startIndex: number }>>((groups, item, index) => {
    const previous = groups[groups.length - 1];
    if (previous && previous.period === item.period) {
      previous.items.push(item);
      return groups;
    }
    groups.push({ items: [item], period: item.period, startIndex: index });
    return groups;
  }, []);
}

export function moveCourseCurriculumItem<T>(items: T[], fromIndex: number, toIndex: number) {
  if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) return items;
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export type CourseSectionImage = {
  alt: string;
  caption: string;
  url: string;
};

export type CourseContentSection = {
  body: string;
  id: string;
  images: CourseSectionImage[];
  items: string[];
  title: string;
  type: CourseSectionType;
};

export function getCourseFallbackPolicy(locale: string, hasSupabase: boolean) {
  if (locale === "ko") return "static" as const;
  if (!hasSupabase && (locale === "en" || locale === "es")) return "static" as const;
  return "none" as const;
}

export type PublishedCourse = {
  category: string;
  categoryKey: CourseCategoryKey;
  certificationNote: string;
  contentSections: CourseContentSection[];
  curriculumItems: string[];
  duration: string;
  id?: string;
  imageUrl: string;
  overview: string;
  pdfFileName?: string;
  pdfUrl?: string;
  recommendedFor: string[];
  scheduleTracks: CourseScheduleTrack[];
  slug: string;
  sortOrder: number;
  summary: string;
  templateKey: CourseTemplateKey;
  title: string;
  updatedAt?: string;
};

export type AdminCourseLocalization = {
  certificationNote: string;
  contentSections: CourseContentSection[];
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
  scheduleTracks: CourseScheduleTrack[];
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
  templateKey: CourseTemplateKey;
  updatedAt: string;
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map(cleanString).filter(Boolean)));
}

export function normalizeScheduleTracks(value: unknown): CourseScheduleTrack[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((track, trackIndex) => {
    if (!track || typeof track !== "object") return [];
    const record = track as Record<string, unknown>;
    const label = cleanString(record.label);
    if (!label) return [];
    const rawItems = Array.isArray(record.items)
      ? record.items
      : Array.isArray(record.weeks)
        ? record.weeks
        : [];
    const items = rawItems.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const itemRecord = item as Record<string, unknown>;
      const period = cleanString(itemRecord.period);
      const itemLabel = cleanString(itemRecord.label);
      const title = cleanString(itemRecord.title);
      const details = cleanStringArray(itemRecord.items);
      if (!period && !itemLabel && !title && details.length === 0) return [];
      return [{ items: details, label: itemLabel, period, title }];
    });
    return [{
      duration: cleanString(record.duration),
      id: cleanString(record.id) || `track-${trackIndex + 1}`,
      items,
      label,
      times: cleanStringArray(record.times)
    }];
  });
}

export function normalizeCourseSections(value: unknown): CourseContentSection[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((section, sectionIndex) => {
    if (!section || typeof section !== "object") return [];
    const record = section as Record<string, unknown>;
    const type = cleanString(record.type);
    if (!courseSectionTypes.includes(type as CourseSectionType)) return [];
    const rawImages = Array.isArray(record.images) ? record.images : [];
    const images = rawImages.flatMap((image) => {
      if (!image || typeof image !== "object") return [];
      const imageRecord = image as Record<string, unknown>;
      const url = cleanString(imageRecord.url);
      return url ? [{ alt: cleanString(imageRecord.alt), caption: cleanString(imageRecord.caption), url }] : [];
    });
    const title = cleanString(record.title);
    const body = cleanString(record.body);
    const items = cleanStringArray(record.items);
    if (!title && !body && items.length === 0 && images.length === 0) return [];
    return [{
      body,
      id: cleanString(record.id) || `section-${sectionIndex + 1}`,
      images,
      items,
      title,
      type: type as CourseSectionType
    }];
  });
}

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
  contentSections?: unknown;
  courseId: string;
  curriculumText: string;
  duration: string;
  imageUrl: string;
  locale: string;
  overview: string;
  pdfFileName: string;
  pdfUrl: string;
  recommendedText: string;
  scheduleTracks?: unknown;
  status: string;
  summary: string;
  title: string;
}) {
  const payload = {
    certificationNote: input.certificationNote.trim(),
    contentSections: normalizeCourseSections(input.contentSections),
    courseId: input.courseId.trim(),
    curriculumItems: splitCourseLines(input.curriculumText),
    duration: input.duration.trim(),
    imageUrl: input.imageUrl.trim(),
    locale: input.locale.trim(),
    overview: input.overview.trim(),
    pdfFileName: input.pdfFileName.trim(),
    pdfUrl: input.pdfUrl.trim(),
    recommendedFor: splitCourseLines(input.recommendedText),
    scheduleTracks: normalizeScheduleTracks(input.scheduleTracks),
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
