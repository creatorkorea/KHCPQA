import { PageIntro } from "@/components/SiteShell";
import { SignupForm } from "@/components/SignupForm";
import { getCopy, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "signup",
    title: `${t.signup.title} | KHCPQA`,
    description: t.signup.lead
  });
}

export default async function SignupPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro className="signup-page-intro" eyebrow={t.signup.eyebrow} title={t.signup.title} lead={t.signup.lead} />
      <section className="auth-section signup-auth-section">
        <div className="signup-auth-shell">
          <div className="signup-auth-summary">
            <span className="eyebrow">{t.account.eyebrow}</span>
            <h2>{t.account.overviewTitle}</h2>
            <p>{t.signup.note}</p>
            <div>
              {t.account.nav.slice(1).map((item) => (
                <article key={item.href}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </article>
              ))}
            </div>
          </div>
          <SignupForm locale={locale} />
        </div>
      </section>
    </>
  );
}
