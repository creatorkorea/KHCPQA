import Image from "next/image";
import { AboutSubnav } from "@/components/AboutSubnav";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";
import { getPublishedContentIntro } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";

const aboutImages = [
  "/assets/about-certification-training.jpg",
  "/assets/about-career-practice.jpg",
  "/assets/about-psl-learning.jpg",
  "/assets/about-certification-coaching.jpg",
  "/assets/about-goal-achievement.jpg"
];

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
  const intro = await getPublishedContentIntro({
    contentType: "Page",
    fallback: {
      lead: t.about.lead,
      title: t.nav.about
    },
    locale,
    slug: "about"
  });

  return (
    <>
      <PageIntro
        eyebrow={t.about.eyebrow}
        title={intro.title}
        lead={intro.lead}
      />
      <section className="about-photo-hero" aria-label={intro.title}>
        <Image
          src="/assets/about-hero-leadership.jpg"
          alt="KHCPQA leadership partnership ceremony"
          width={2000}
          height={1429}
          sizes="(max-width: 900px) 100vw, 1120px"
          priority
        />
      </section>
      <AboutSubnav locale={locale} activeKey="intro" />
      <section className="content-section">
        <div className="about-story">
          {t.about.features.map((feature, index) => {
            const imageUrl = aboutImages[index % aboutImages.length];
            const step = String(index + 1).padStart(2, "0");
            return (
              <article className="about-feature" key={feature.title}>
                <div className="about-feature-media">
                  <Image
                    src={imageUrl}
                    alt={feature.title}
                    width={1586}
                    height={992}
                    sizes="(max-width: 820px) 100vw, 48vw"
                    priority={index === 0}
                  />
                </div>
                <div className="about-feature-copy">
                  <span>{step}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
