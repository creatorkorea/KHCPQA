import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { SiteFooter, SiteHeader } from "@/components/SiteShell";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { buildLocaleMetadata } from "@/lib/seo";
import { getPublishedFooterSettings } from "@/lib/footer-settings";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  return buildLocaleMetadata({ locale, noIndex: locale === "zh-CN" });
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
  setRequestLocale(activeLocale);
  const messages = await getMessages();
  const pending = await getTranslations("pending");
  const footerSettings = await getPublishedFooterSettings(activeLocale);

  return (
    <NextIntlClientProvider locale={activeLocale} messages={messages}>
      <SiteHeader locale={activeLocale} />
      <main>
        {activeLocale === "zh-CN" ? (
          <section className="page-intro translation-pending-page">
            <span className="eyebrow">{pending("eyebrow")}</span>
            <h1>{pending("title")}</h1>
            <p>{pending("body")}</p>
            <Link className="primary-button" href="/ko">{pending("back")}</Link>
          </section>
        ) : children}
      </main>
      <SiteFooter locale={activeLocale} settings={footerSettings} />
    </NextIntlClientProvider>
  );
}
