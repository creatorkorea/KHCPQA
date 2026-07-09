import type { Metadata } from "next";
import { getCopy, locales, type Locale } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://khcpqa.vercel.app";

function getLocalizedPath(locale: Locale, path = "") {
  return path.length > 0 ? `/${locale}/${path}` : `/${locale}`;
}

export function buildLocaleMetadata({
  locale,
  path = "",
  title,
  description,
  noIndex = false
}: {
  locale: Locale;
  path?: string;
  title?: string;
  description?: string;
  noIndex?: boolean;
}): Metadata {
  const t = getCopy(locale);
  const pageTitle = title ?? t.seo.title;
  const pageDescription = description ?? t.seo.description;
  const canonicalPath = getLocalizedPath(locale, path);

  return {
    metadataBase: new URL(siteUrl),
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalPath,
      languages: Object.fromEntries(locales.map((item) => [item, getLocalizedPath(item, path)]))
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      locale,
      siteName: "KHCPQA",
      type: "website",
      url: `${siteUrl}${canonicalPath}`
    },
    robots: noIndex ? { index: false, follow: false } : undefined
  };
}
