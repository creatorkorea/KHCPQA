export const translationStatuses = ["draft", "translated", "reviewed", "published", "archived"] as const;
export type TranslationStatus = (typeof translationStatuses)[number];
export type TranslationFreshness = "source" | "missing-source-version" | "current" | "stale";

export type TranslationMetadata = {
  locale: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  sourceLocale?: string;
  sourceUpdatedAt?: string | null;
  translatedFromUpdatedAt?: string | null;
};

export function getTranslationFreshness({
  locale,
  sourceUpdatedAt,
  translatedFromUpdatedAt
}: TranslationMetadata): TranslationFreshness {
  if (locale === "ko") {
    return "source";
  }
  if (!sourceUpdatedAt || !translatedFromUpdatedAt) {
    return "missing-source-version";
  }
  return Date.parse(sourceUpdatedAt) > Date.parse(translatedFromUpdatedAt) ? "stale" : "current";
}

export function canPublishTranslation(input: {
  freshness: TranslationFreshness;
  isHighRisk: boolean;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  title: string;
}) {
  if (!input.title.trim()) {
    return { ok: false as const, message: "공개할 번역 제목을 입력해 주세요." };
  }
  if (input.freshness === "stale" || input.freshness === "missing-source-version") {
    return { ok: false as const, message: "최신 한국어 원문을 기준으로 번역을 다시 검수해 주세요." };
  }
  if (input.isHighRisk && (!input.reviewedBy || !input.reviewedAt)) {
    return { ok: false as const, message: "법무·자격·건강 콘텐츠는 지정 검수자의 승인이 필요합니다." };
  }
  return { ok: true as const };
}
