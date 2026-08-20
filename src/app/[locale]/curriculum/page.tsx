import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCopy, type Locale } from "@/lib/content";
import { CurriculumCatalog } from "@/components/CurriculumCatalog";
import { getPublishedCourses } from "@/lib/course-repository";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "curriculum",
    title: `${t.curriculumTitle} | KAHC`,
    description: t.curriculumPage.lead
  });
}

export default async function CurriculumPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const courses = await getPublishedCourses(locale);
  return (
    <>
      <section className="curriculum-hero">
        <div className="curriculum-hero-copy">
          <span className="eyebrow">{t.curriculumPage.eyebrow}</span>
          <h1>
            {t.curriculumPage.heroTitlePrefix}
            <br />
            <span>{t.curriculumPage.heroTitleHighlight}</span>
          </h1>
          <div className="hero-actions">
            <Link className="primary-button" href={`/${locale}/partner-inquiry`}>
              {t.courseDetail.inquiryCta}
              <ArrowRight size={18} />
            </Link>
            <Link className="secondary-button" href={`/${locale}/curriculum#curriculum-list`}>
              {t.courseDetail.allCoursesCta}
            </Link>
          </div>
        </div>

      </section>
      <section className="content-section">
        <div id="curriculum-list">
          <CurriculumCatalog courses={courses} locale={locale} />
        </div>
      </section>
    </>
  );
}
