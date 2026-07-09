import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, BookOpen, Users } from "lucide-react";
import { getCopy, getCourseBySlug, getCourseSlugs, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getCourseSlugs().flatMap((courseSlug) => [
    { locale: "ko", courseSlug },
    { locale: "en", courseSlug },
    { locale: "es", courseSlug }
  ]);
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale; courseSlug: string }>;
}) {
  const { locale, courseSlug } = await params;
  const decodedSlug = decodeURIComponent(courseSlug);
  const course = getCourseBySlug(decodedSlug, locale);

  if (!course) {
    return {};
  }

  return buildLocaleMetadata({
    locale,
    path: `curriculum/${decodedSlug}`,
    title: `${course.title} | KHCPQA`,
    description: course.summary
  });
}

export default async function CourseDetailPage({
  params
}: {
  params: Promise<{ locale: Locale; courseSlug: string }>;
}) {
  const { locale, courseSlug } = await params;
  const t = getCopy(locale);
  const course = getCourseBySlug(decodeURIComponent(courseSlug), locale);

  if (!course) {
    notFound();
  }
  const isGoalCourse = course.categoryKey === "professional";

  return (
    <article className="course-detail">
      <section className="course-detail-hero">
        <div>
          <span className="eyebrow">{course.category}</span>
          <h1>{course.title}</h1>
          <p>{course.summary}</p>
          <div className="course-detail-actions">
            <Link className="primary-button" href={`/${locale}/partner-inquiry`}>
              {t.courseDetail.inquiryCta} <ArrowRight size={16} />
            </Link>
            <Link className="secondary-button" href={`/${locale}/curriculum`}>
              {t.courseDetail.allCoursesCta}
            </Link>
          </div>
        </div>
        <Image src={course.imageUrl} alt={course.title} width={960} height={540} priority />
      </section>

      <section className="course-detail-body">
        <div className="course-detail-main">
          <div>
            <span className="eyebrow">{t.courseDetail.overviewEyebrow}</span>
            <h2>{isGoalCourse ? t.courseDetail.goalOverviewTitle : t.courseDetail.overviewTitle}</h2>
            <p>{course.overview}</p>
          </div>

          <div>
            <span className="eyebrow">{t.courseDetail.curriculumEyebrow}</span>
            <h2>{isGoalCourse ? t.courseDetail.goalPlanTitle : t.courseDetail.curriculumTitle}</h2>
            <ul className="detail-list">
              {course.curriculum.map((item) => (
                <li key={item}>
                  <BookOpen size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {course.detailSections ? (
            <div className="course-detail-sections">
              {course.detailSections.map((section) => (
                <section key={section.title}>
                  <h2>{section.title}</h2>
                  <ul className="detail-list compact">
                    {section.items.map((item) => (
                      <li key={item}>
                        <BookOpen size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="course-detail-aside">
          <div>
            <Users size={22} />
            <h3>{t.courseDetail.audienceTitle}</h3>
            <p>{course.audience}</p>
          </div>
          <div>
            <BadgeCheck size={22} />
            <h3>{isGoalCourse ? t.courseDetail.goalOutcomeTitle : t.courseDetail.certificationTitle}</h3>
            <p>{course.certificationNote}</p>
          </div>
          <div>
            <h3>{t.courseDetail.sourceTitle}</h3>
            <p>{course.source}</p>
          </div>
        </aside>
      </section>
    </article>
  );
}
