import { LegalPage } from "@/components/LegalPage";
import { getCopy, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "terms",
    title: `${t.legal.termsTitle} | KHCPQA`,
    description: t.legal.lead,
    noIndex: true
  });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return <LegalPage locale={locale} kind="terms" />;
}
