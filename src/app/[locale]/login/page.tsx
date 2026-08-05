import { PageIntro } from "@/components/SiteShell";
import { LoginForm } from "@/components/LoginForm";
import { getCopy, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "login",
    title: `${t.nav.login} | KHCPQA`,
    description: t.login.lead
  });
}

export default async function LoginPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        className="login-page-intro"
        eyebrow={t.login.eyebrow}
        title={t.nav.login}
        lead={t.login.lead}
      />
      <section className="auth-section login-auth-section">
        <div className="login-auth-shell">
          <div className="login-auth-summary">
            <span className="eyebrow">{t.account.eyebrow}</span>
            <h2>{t.accountTitle}</h2>
            <p>{t.login.note}</p>
            <div>
              {t.account.nav.slice(1).map((item) => (
                <article key={item.href}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </article>
              ))}
            </div>
          </div>
          <LoginForm locale={locale} />
        </div>
      </section>
    </>
  );
}
