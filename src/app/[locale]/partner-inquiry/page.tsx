import { PageIntro } from "@/components/SiteShell";
import { PartnerInquiryForm } from "@/components/PartnerInquiryForm";
import { getCopy, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "partner-inquiry",
    title: `${t.nav.partner} | KHCPQA`,
    description: t.partnerInquiry.lead
  });
}

export default async function PartnerInquiryPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        eyebrow={t.partnerInquiry.eyebrow}
        title={t.nav.partner}
        lead={t.partnerInquiry.lead}
      />
      <section className="form-section">
        <PartnerInquiryForm locale={locale} />
      </section>
    </>
  );
}
