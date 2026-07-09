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
        eyebrow={t.login.eyebrow}
        title={t.nav.login}
        lead={t.login.lead}
      />
      <section className="auth-section">
        <LoginForm locale={locale} />
      </section>
    </>
  );
}
