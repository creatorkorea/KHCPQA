import { BadgeCheck, FileText, Lock, UserRound } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
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
  const moduleIcons = [UserRound, BadgeCheck, FileText, Lock];

  return (
    <>
      <PageIntro
        eyebrow={t.account.eyebrow}
        title={t.accountTitle}
        lead={t.account.lead}
      />
      <section className="content-section">
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
        <div className="cert-table">
          {t.account.certificates.map((certificate) => (
            <div key={certificate.number}>
              <strong>{certificate.title}</strong>
              <span>{certificate.number}</span>
              <em>{certificate.status}</em>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
