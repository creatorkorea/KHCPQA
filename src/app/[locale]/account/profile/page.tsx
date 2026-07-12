import { AccountNav, AccountSection } from "@/components/AccountShell";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "account/profile",
    title: `${t.account.profile.title} | KHCPQA`,
    description: t.account.profile.lead,
    noIndex: true
  });
}

export default async function AccountProfilePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro eyebrow={t.account.eyebrow} title={t.account.profile.title} lead={t.account.profile.lead} />
      <section className="content-section">
        <AccountNav locale={locale} activeHref="account/profile" />
        <AccountSection title={t.account.profile.title} lead={t.account.profile.lead}>
          <dl className="account-detail-list">
            {t.account.profile.fields.map((field) => (
              <div key={field.label}>
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>
        </AccountSection>
      </section>
    </>
  );
}
