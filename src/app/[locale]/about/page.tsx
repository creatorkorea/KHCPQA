import Image from "next/image";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

const aboutImages = [
  "/assets/about-certification-training.jpg",
  "/assets/about-certification-coaching.jpg",
  "/assets/about-career-practice.jpg",
  "/assets/about-psl-learning.jpg",
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

  return (
    <>
      <PageIntro
        eyebrow={t.about.eyebrow}
        title={t.nav.about}
        lead={t.about.lead}
      />
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
