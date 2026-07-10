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
  const heroQuickItems = [
    { label: courses[0]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[0]?.slug ?? ""}` },
    { label: courses[1]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[1]?.slug ?? ""}` },
    { label: courses[2]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[2]?.slug ?? ""}` },
    { label: courses[4]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[4]?.slug ?? ""}` },
    { label: locale === "ko" ? "마사지 과정" : "Massage Programs", href: `/${locale}/curriculum/${courses[6]?.slug ?? ""}` },
    { label: t.primaryCta, href: `/${locale}/curriculum#curriculum-list` },
    { label: t.courseDetail.inquiryCta, href: `/${locale}/partner-inquiry` }
  ];
  const heroMetrics = [
    { label: locale === "ko" ? "목표별 과정" : "Goal Tracks", value: "3" },
    { label: locale === "ko" ? "실무 과목" : "Practical Programs", value: "15+" },
    { label: locale === "ko" ? "상담 연계" : "Advising Flow", value: "1:1" }
  ];

  return (
    <>
      <section className="curriculum-hero">
        <div className="curriculum-hero-copy">
          <span className="eyebrow">{t.curriculumPage.eyebrow}</span>
          <h1>
            {locale === "ko" ? (
              <>
                내 목표에 맞는 <span>전문 과정</span>
              </>
            ) : (
              t.curriculumTitle
            )}
          </h1>
          <p>{t.curriculumPage.lead}</p>
          <dl className="curriculum-hero-metrics">
            {heroMetrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
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
          <div className="curriculum-hero-note">
            <HeartPulse size={22} />
            <span>
              <strong>{t.home.curriculumEyebrow}</strong>
              <small>{t.home.curriculumLead}</small>
            </span>
          </div>
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
          <CurriculumCatalog courses={courses} locale={locale} />
        </div>
      </section>
    </>
  );
}
