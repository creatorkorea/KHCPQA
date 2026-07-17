import Link from "next/link";
import { ArrowRight, BadgeCheck, FileText, Lock, UserRound } from "lucide-react";
import { AccountNav, AccountSection } from "@/components/AccountShell";
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

  return (
    <>
      <PageIntro
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
                <Icon size={28} />
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
              </div>
            ))
          ) : (
            <p className="cert-empty-state">{t.account.certifications.emptyState}</p>
          )}
        </div>
        <div className="account-action-row">
          {t.account.nav.slice(1).map((item) => (
            <Link key={item.href} href={`/${locale}/${item.href}`}>
              <span>{item.title}</span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
