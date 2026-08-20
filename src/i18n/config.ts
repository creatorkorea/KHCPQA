export const locales = ["ko", "en", "es", "zh-CN"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";
export const localeCookieName = "KAHC_LOCALE";

export const localeLabels: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  es: "Español",
  "zh-CN": "简体中文"
};

export const localeHtmlLang: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en",
  es: "es",
  "zh-CN": "zh-CN"
};

export const localeOpenGraph: Record<Locale, string> = {
  ko: "ko_KR",
  en: "en_US",
  es: "es_ES",
  "zh-CN": "zh_CN"
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : null;
}

export function getLocalizedPath(pathname: string, targetLocale: Locale) {
  const segments = pathname.split("/");

  if (isLocale(segments[1] ?? "")) {
    segments[1] = targetLocale;
    return segments.join("/") || `/${targetLocale}`;
  }

  return `/${targetLocale}`;
}

export function getPreferredLocale(acceptLanguage: string | null, savedLocale: string | null): Locale {
  if (savedLocale && isLocale(savedLocale)) {
    return savedLocale;
  }

  const requested = (acceptLanguage ?? "")
    .split(",")
    .map((item) => item.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);

  for (const language of requested) {
    if (language === "ko" || language?.startsWith("ko-")) return "ko";
    if (language === "es" || language?.startsWith("es-")) return "es";
    if (language === "zh" || language?.startsWith("zh-")) return "zh-CN";
    if (language === "en" || language?.startsWith("en-")) return "en";
  }

  return defaultLocale;
}

export function buildLanguageAlternates(
  path: string,
  availableLocales: readonly Locale[],
  baseUrl?: string
) {
  const suffix = path ? `/${path.replace(/^\/+/, "")}` : "";
  const toHref = (locale: Locale) => {
    const localizedPath = `/${locale}${suffix}`;
    return baseUrl ? new URL(localizedPath, baseUrl).toString() : localizedPath;
  };
  const languages = Object.fromEntries(
    availableLocales.map((locale) => [locale, toHref(locale)])
  ) as Record<string, string>;
  const defaultSuffix = availableLocales.includes(defaultLocale) ? suffix : "";
  const relativeDefaultPath = `/${defaultLocale}${defaultSuffix}`;
  const defaultPath = baseUrl
    ? new URL(relativeDefaultPath, baseUrl).toString()
    : relativeDefaultPath;

  return { ...languages, "x-default": defaultPath };
}
