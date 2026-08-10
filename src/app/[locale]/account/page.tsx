import Link from "next/link";
import { ArrowRight, BadgeCheck, FileText, Lock, UserRound } from "lucide-react";
import { AccountNav, AccountSection } from "@/components/AccountShell";
import { CertificateDownloadActions } from "@/components/CertificateDownloadActions";
import { PageIntro } from "@/components/SiteShell";
import { getAccountData } from "@/lib/account-data";
import { getCopy, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "account",
    title: `${t.accountTitle} | KHCPQA`,
    description: t.account.lead,
    noIndex: true
  });
}

export default async function AccountPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const accountData = await getAccountData(locale);
  const moduleIcons = [UserRound, BadgeCheck, FileText, Lock];
  const moduleMetrics = [
    accountData.profileForm.name || accountData.profileForm.email ? t.account.profileStatus.ready : t.account.profileStatus.empty,
    `${accountData.certificates.length}${t.account.countSuffix}`,
    `${accountData.inquiries.length}${t.account.countSuffix}`,
    t.account.noindexStatus
  ];

  return (
    <>
      <PageIntro
        className="account-page-intro"
        eyebrow={t.account.eyebrow}
        title={t.accountTitle}
        lead={t.account.lead}
      />
      <section className="content-section">
        <AccountNav locale={locale} activeHref="account" />
        <AccountSection title={t.account.overviewTitle} lead={t.account.overviewLead}>
        <div className="account-grid">
          {t.account.modules.map((module, index) => {
            const Icon = moduleIcons[index];
            return (
              <article key={module.title}>
                <div className="account-card-head">
                  <Icon size={28} />
                  <strong>{moduleMetrics[index]}</strong>
                </div>
                <h3>{module.title}</h3>
                <p>{module.body}</p>
              </article>
            );
          })}
        </div>
        </AccountSection>
        <div className="cert-table">
          {accountData.certificates.length > 0 ? (
            accountData.certificates.map((certificate) => (
              <div key={certificate.number}>
                <strong>{certificate.title}</strong>
                <span>{certificate.number} · {certificate.issuedAt}</span>
                <em>{certificate.status}</em>
                <CertificateDownloadActions
                  certificate={certificate}
                  holderName={accountData.profileForm.name}
                  variant="compact"
                />
              </div>
            ))
          ) : (
            <div className="cert-empty-state account-empty-state" role="status">
              <div>
                <strong>{t.account.certifications.emptyState}</strong>
                <span>{t.account.certifications.emptyGuide}</span>
              </div>
              <div className="account-empty-actions">
                <Link href={`/${locale}/account/certifications`}>
                  <span>{t.account.certifications.lookupTitle}</span>
                  <ArrowRight size={15} />
                </Link>
                <Link href={`/${locale}/curriculum`}>
                  <span>{t.curriculumTitle}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
