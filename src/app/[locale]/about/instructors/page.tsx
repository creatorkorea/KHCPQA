import Image from "next/image";
import { AboutSubnav } from "@/components/AboutSubnav";
import { DirectorProfileTabs } from "@/components/DirectorProfileTabs";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";
import { getPublishedContentSections } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";

type DirectorProfile = {
  imageUrl: string;
  name: string;
  profileBody?: string;
  profileImageUrl: string;
  role: string;
};

function getProfileLines(body: string) {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function renderProfileLineList(lines: string[]) {
  return (
    <ul>
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}

function renderDirectorProfileSections(instructor: DirectorProfile) {
  const profileBody = instructor.profileBody;

  if (!profileBody) {
    return null;
  }

  const sections = profileBody
    .split(/\n\n+/)
    .map((section) => {
      const [title = "", ...bodyLines] = section.split("\n");
      const body = bodyLines.join("\n").trim();

      return {
        body,
        lines: getProfileLines(body),
        title: title.trim()
      };
    })
    .filter((section) => section.title && section.body && section.lines.length > 0);

  if (sections.length === 0) {
    const lines = getProfileLines(profileBody);

    return (
      <div className="instructor-profile-details">
        <header className="instructor-profile-summary">
          <h2>{instructor.name}</h2>
          <p>{instructor.role}</p>
        </header>
        <section className="instructor-profile-section-card">
          <h3>상세정보</h3>
          {renderProfileLineList(lines)}
        </section>
      </div>
    );
  }

  return (
    <div className="instructor-profile-details">
      <header className="instructor-profile-summary">
        <h2>{instructor.name}</h2>
        <p>{instructor.role}</p>
      </header>
      <DirectorProfileTabs sections={sections} />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "about/instructors",
    title: `${t.instructorsPage.title} | KAHC`,
    description: t.instructorsPage.lead
  });
}

export default async function InstructorsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const publishedDirectors = await getPublishedContentSections({
    contentType: "Page",
    locale,
    slugPrefix: "director-"
  });
  const directors: DirectorProfile[] =
    publishedDirectors.length > 0
      ? publishedDirectors.map((director) => ({
          imageUrl: director.imageUrl || "/assets/instructor-profile-kim-moonsun.jpg",
          name: director.title,
          profileImageUrl: director.imageUrl || "/assets/instructor-profile-kim-moonsun.jpg",
          profileBody: director.body,
          role: director.lead || "국제 디렉터"
        }))
      : t.instructorsPage.instructors.map((instructor) => ({
          ...instructor,
          profileBody: undefined
        }));

  return (
    <>
      <PageIntro
        className="about-visual-intro instructors-page-intro"
        eyebrow={t.instructorsPage.eyebrow}
        title={t.instructorsPage.title}
        lead={t.instructorsPage.lead}
      />
      <AboutSubnav locale={locale} activeKey="instructors" />
      <section className="content-section">
        <div className="instructor-grid" id="instructors">
          {directors.map((instructor, index) => {
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
                  <div className="instructor-modal-layout">
                    <Image
                      src={instructor.profileImageUrl}
                      alt={`${instructor.name} ${instructor.role}`}
                      width={915}
                      height={1320}
                      sizes="(max-width: 720px) 94vw, 440px"
                    />
                    {renderDirectorProfileSections(instructor)}
                  </div>
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
