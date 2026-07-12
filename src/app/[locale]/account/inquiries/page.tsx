import { AccountNav, AccountSection } from "@/components/AccountShell";
import { InquiryHistoryPanel } from "@/components/InquiryHistoryPanel";
import { PageIntro } from "@/components/SiteShell";
import { getAccountData } from "@/lib/account-data";
import { getCopy, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "account/inquiries",
    title: `${t.account.inquiries.title} | KHCPQA`,
    description: t.account.inquiries.lead,
    noIndex: true
  });
}

export default async function AccountInquiriesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const accountData = await getAccountData(locale);

  return (
    <>
      <PageIntro eyebrow={t.account.eyebrow} title={t.account.inquiries.title} lead={t.account.inquiries.lead} />
      <section className="content-section">
        <AccountNav locale={locale} activeHref="account/inquiries" />
        <AccountSection title={t.account.inquiries.title} lead={t.account.inquiries.lead}>
          <InquiryHistoryPanel items={accountData.inquiries} locale={locale} />
        </AccountSection>
      </section>
    </>
  );
}
