import { LegalPage } from "@/components/LegalPage";
import { getCopy, type Locale } from "@/lib/content";
import { getPublishedContentIntro } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const content = await getPublishedContentIntro({
    contentType: "Page",
    fallback: {
      lead: t.legal.lead,
      title: t.legal.termsTitle
    },
    locale,
    slug: "terms"
  });

  return buildLocaleMetadata({
    locale,
    path: "terms",
    title: `${content.title} | KHCPQA`,
    description: content.lead,
    noIndex: true
  });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return <LegalPage locale={locale} kind="terms" />;
}
