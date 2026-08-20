export const translationQueueLocales = ["ko", "en", "es", "zh-CN"] as const;
export type TranslationQueueLocale = (typeof translationQueueLocales)[number];

export type TranslationQueueInput = {
  key: string;
  locale: string;
  sourceUpdatedAt?: string | null;
  status: string;
  title: string;
  translatedFromUpdatedAt?: string | null;
  type: string;
};

export type TranslationQueueLocaleState = {
  freshness: "current" | "missing-source-version" | "source" | "stale";
  status: string;
  title: string;
};

function getFreshness(item: TranslationQueueInput) {
  if (item.locale === "ko") return "source" as const;
  if (!item.sourceUpdatedAt || !item.translatedFromUpdatedAt) return "missing-source-version" as const;
  return Date.parse(item.sourceUpdatedAt) > Date.parse(item.translatedFromUpdatedAt)
    ? "stale" as const
    : "current" as const;
}

export function buildTranslationQueue(items: TranslationQueueInput[]) {
  const groups = new Map<string, TranslationQueueInput[]>();
  for (const item of items) groups.set(item.key, [...(groups.get(item.key) ?? []), item]);

  return Array.from(groups.entries()).map(([key, groupItems]) => {
    const source = groupItems.find((item) => item.locale === "ko") ?? groupItems[0];
    const localeStates = Object.fromEntries(
      translationQueueLocales.map((locale) => {
        const item = groupItems.find((candidate) => candidate.locale === locale);
        return [locale, item
          ? { freshness: getFreshness(item), status: item.status, title: item.title }
          : { freshness: "missing-source-version", status: "missing", title: "" }];
      })
    ) as Record<TranslationQueueLocale, TranslationQueueLocaleState>;
    const completedCount = translationQueueLocales.filter((locale) => {
      const item = localeStates[locale];
      return ["translated", "reviewed", "published"].includes(item.status) && item.freshness !== "stale";
    }).length;

    return {
      completedCount,
      key,
      locales: localeStates,
      title: source?.title ?? key,
      type: source?.type ?? "Content"
    };
  });
}
