import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/SiteShell";
import { isLocale, type Locale } from "@/lib/content";

export function generateStaticParams() {
  return [{ locale: "ko" }, { locale: "en" }, { locale: "es" }];
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

  return (
    <>
      <SiteHeader locale={locale as Locale} />
      <main>{children}</main>
      <SiteFooter locale={locale as Locale} />
    </>
  );
}
