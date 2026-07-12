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
      <PageIntro eyebrow={t.signup.eyebrow} title={t.signup.title} lead={t.signup.lead} />
      <section className="auth-section">
        <SignupForm locale={locale} />
      </section>
    </>
  );
}
