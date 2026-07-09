import Image from "next/image";
import { AboutSubnav } from "@/components/AboutSubnav";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "about/organization",
    title: `${t.organizationPage.title} | KHCPQA`,
    description: t.organizationPage.lead
  });
}

export default async function OrganizationPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        eyebrow={t.organizationPage.eyebrow}
        title={t.organizationPage.title}
        lead={t.organizationPage.lead}
      />
      <AboutSubnav locale={locale} activeKey="organization" />
      <section className="content-section organization-section">
        <div className="organization-card">
          <div className="organization-chart">
            <Image
              src="/assets/organization-chart.jpg"
              alt={t.organizationPage.imageAlt}
              width={915}
              height={600}
              sizes="(max-width: 920px) 100vw, 915px"
              priority
            />
          </div>
        </div>
        <div className="organization-unit-grid">
          {t.organizationPage.units.map((unit) => (
            <article key={unit.title}>
              <h2>{unit.title}</h2>
              <p>{unit.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
