import { Building2, Globe2, ShieldCheck, Users } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "about",
    title: `${t.nav.about} | KHCPQA`,
    description: t.about.lead
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        eyebrow={t.about.eyebrow}
        title={t.nav.about}
        lead={t.about.lead}
      />
      <section className="content-section">
        <div className="feature-row">
          {t.about.features.map((feature, index) => {
            const Icon = [Building2, Users, Globe2, ShieldCheck][index];
            return (
              <div key={feature.title}>
                <Icon size={28} />
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
