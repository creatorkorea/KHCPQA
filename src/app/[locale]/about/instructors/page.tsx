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
        <div className="instructor-grid" id="instructors">
          {t.instructorsPage.instructors.map((instructor, index) => {
            const modalId = `instructor-${index + 1}`;
            return (
            <article className="instructor-card" key={instructor.name}>
              <a href={`#${modalId}`} aria-label={`${instructor.name} profile`}>
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
              </a>
              <div className="instructor-modal" id={modalId}>
                <a className="instructor-modal-backdrop" href="#instructors" aria-label="Close profile" />
                <div className="instructor-modal-panel" role="dialog" aria-modal="true" aria-label={`${instructor.name} profile`}>
                  <a className="instructor-modal-close" href="#instructors" aria-label="Close profile">Close</a>
                  <Image
                    src={instructor.profileImageUrl}
                    alt={`${instructor.name} ${instructor.role}`}
                    width={915}
                    height={1320}
                    sizes="(max-width: 720px) 94vw, 920px"
                  />
                </div>
              </div>
            </article>
          );
          })}
        </div>
      </section>
    </>
  );
}
