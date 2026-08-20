import type { Metadata } from "next";
import {
  buildLanguageAlternates,
  localeOpenGraph,
  type Locale
} from "@/i18n/config";
import { getCopy } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://khcpqa.vercel.app";

function getLocalizedPath(locale: Locale, path = "") {
  return path.length > 0 ? `/${locale}/${path}` : `/${locale}`;
}

export function buildLocaleMetadata({
  locale,
  path = "",
  title,
  description,
  noIndex = false,
  availableLocales
}: {
  availableLocales?: readonly Locale[];
  locale: Locale;
  path?: string;
  title?: string;
  description?: string;
  noIndex?: boolean;
}): Metadata {
  const t = getCopy(locale);
  const isPendingLocale = (locale as string) === "zh-CN";
  const pageTitle = isPendingLocale ? "翻译内容准备中 | KAHC" : title ?? t.seo.title;
  const pageDescription = isPendingLocale
    ? "KAHC 简体中文内容正在进行人工审核，审核通过后将分阶段发布。"
    : description ?? t.seo.description;
  const canonicalPath = getLocalizedPath(locale, path);
  const publishedLocales: readonly Locale[] =
    availableLocales ?? (isPendingLocale ? ["ko"] : ["ko", "en", "es"]);

  return {
    metadataBase: new URL(siteUrl),
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalPath,
      languages: buildLanguageAlternates(path, publishedLocales)
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      locale: localeOpenGraph[locale],
      siteName: "KAHC",
      type: "website",
      url: `${siteUrl}${canonicalPath}`
    },
    robots: noIndex || isPendingLocale ? { index: false, follow: false } : undefined
  };
}
