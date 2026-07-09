import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader, TranslationNotice } from "@/components/SiteShell";
import { getTranslationStatus, isLocale, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return [{ locale: "ko" }, { locale: "en" }, { locale: "es" }];
}

export const dynamicParams = false;

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  return buildLocaleMetadata({ locale });
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const activeLocale = locale as Locale;

  return (
    <>
      <SiteHeader locale={activeLocale} />
      <TranslationNotice locale={activeLocale} status={getTranslationStatus(activeLocale)} />
      <main>{children}</main>
      <SiteFooter locale={activeLocale} />
    </>
  );
}
