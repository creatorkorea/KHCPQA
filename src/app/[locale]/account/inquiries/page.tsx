import { AccountNav, AccountSection } from "@/components/AccountShell";
import { PageIntro } from "@/components/SiteShell";
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

  return (
    <>
      <PageIntro eyebrow={t.account.eyebrow} title={t.account.inquiries.title} lead={t.account.inquiries.lead} />
      <section className="content-section">
        <AccountNav locale={locale} activeHref="account/inquiries" />
        <AccountSection title={t.account.inquiries.title} lead={t.account.inquiries.lead}>
          <div className="inquiry-list">
            {t.account.inquiries.items.map((item) => (
              <article key={`${item.title}-${item.submittedAt}`}>
                <strong>{item.title}</strong>
                <dl>
                  <div>
                    <dt>{t.account.inquiries.submittedLabel}</dt>
                    <dd>{item.submittedAt}</dd>
                  </div>
                  <div>
                    <dt>{t.account.inquiries.statusLabel}</dt>
                    <dd>{item.status}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </AccountSection>
      </section>
    </>
  );
}
