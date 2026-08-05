import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCopy, getCourses, type Locale } from "@/lib/content";
import { CurriculumCatalog } from "@/components/CurriculumCatalog";
import { getPublishedContentIntro, getPublishedContentMap } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "curriculum",
    title: `${t.curriculumTitle} | KHCPQA`,
    description: t.curriculumPage.lead
  });
}

export default async function CurriculumPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const courses = getCourses(locale);
  const courseContent = await getPublishedContentMap({
    contentType: "Course",
    locale,
    slugs: courses.map((course) => course.slug)
  });
  const mergedCourses = courses.map((course) => {
    const content = courseContent.get(course.slug);

    return {
      ...course,
      imageUrl: content?.imageUrl || course.imageUrl,
      summary: content?.lead || course.summary,
      title: content?.title || course.title
    };
  });
  const intro = await getPublishedContentIntro({
    contentType: "Page",
    fallback: {
      lead: t.curriculumPage.lead,
      title: t.curriculumTitle
    },
    locale,
    slug: "curriculum"
  });
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
          <p>{intro.lead}</p>
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
          <CurriculumCatalog courses={mergedCourses} locale={locale} />
        </div>
      </section>
    </>
  );
}
