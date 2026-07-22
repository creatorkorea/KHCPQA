import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardPenLine,
  Headphones,
  HeartPulse,
  Sparkles,
  Store
} from "lucide-react";
import { getCopy, getCourses, type Locale } from "@/lib/content";
import { CurriculumCatalog } from "@/components/CurriculumCatalog";
import { getPublishedContentIntro, getPublishedContentMap } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";

const quickNavIcons = [BriefcaseBusiness, Store, CalendarDays, Sparkles, HeartPulse, ClipboardPenLine, Headphones];

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
  const heroQuickItems = [
    { label: mergedCourses[0]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${mergedCourses[0]?.slug ?? ""}` },
    { label: mergedCourses[1]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${mergedCourses[1]?.slug ?? ""}` },
    { label: mergedCourses[2]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${mergedCourses[2]?.slug ?? ""}` },
    { label: mergedCourses[4]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${mergedCourses[4]?.slug ?? ""}` },
    { label: t.curriculumPage.massageProgramsLabel, href: `/${locale}/curriculum/${mergedCourses[6]?.slug ?? ""}` },
    { label: t.primaryCta, href: `/${locale}/curriculum#curriculum-list` },
    { label: t.courseDetail.inquiryCta, href: `/${locale}/partner-inquiry` }
  ];
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

        <div className="curriculum-hero-visual">
          <Image src="/assets/premium-hero-wellness-education.png" alt={t.home.heroImageAlt} width={960} height={620} priority />
        </div>

        <nav className="curriculum-quick-nav" aria-label={t.curriculumTitle}>
          {heroQuickItems.map((item, index) => {
            const Icon = quickNavIcons[index] ?? HeartPulse;
            return (
              <Link key={`${item.label}-${index}`} href={item.href}>
                <Icon aria-hidden="true" size={23} strokeWidth={1.55} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </section>
      <section className="content-section">
        <div id="curriculum-list">
          <CurriculumCatalog courses={mergedCourses} locale={locale} />
        </div>
      </section>
    </>
  );
}
