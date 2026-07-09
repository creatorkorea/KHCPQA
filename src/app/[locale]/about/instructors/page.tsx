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
    path: "about/instructors",
    title: `${t.instructorsPage.title} | KHCPQA`,
    description: t.instructorsPage.lead
  });
}

export default async function InstructorsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        eyebrow={t.instructorsPage.eyebrow}
        title={t.instructorsPage.title}
        lead={t.instructorsPage.lead}
      />
      <AboutSubnav locale={locale} activeKey="instructors" />
      <section className="content-section">
        <div className="instructor-grid">
          {t.instructorsPage.instructors.map((instructor) => (
            <article className="instructor-card" key={instructor.name}>
              <div className="instructor-photo">
                <Image
                  src={instructor.imageUrl}
                  alt={instructor.name}
                  width={275}
                  height={376}
                  sizes="(max-width: 720px) 48vw, (max-width: 1120px) 30vw, 20vw"
                />
              </div>
              <div>
                <h2>{instructor.name}</h2>
                <p>{instructor.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
