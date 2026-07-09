import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardPenLine,
  GraduationCap,
  HandHeart,
  Headphones,
  HeartPulse,
  ShieldCheck,
  Store,
  Users
} from "lucide-react";
import { getActivityGroups, getCopy, getCourses, getStats, type Locale } from "@/lib/content";
import { StatusBadge } from "@/components/SiteShell";

const heroStatIcons = [GraduationCap, BriefcaseBusiness, Store];
const quickNavIcons = [BriefcaseBusiness, Store, CalendarDays, HeartPulse, HandHeart, ClipboardPenLine, Headphones];

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const courses = getCourses(locale);
  const activityGroups = getActivityGroups(locale);
  const stats = getStats(locale).slice(0, 3);
  const platformIcons = [ShieldCheck, BookOpen, BadgeCheck];
  const previewCourseIndexes = [5, 3, 4, 6, 7, 8, 9, 13];
  const previewCourses = previewCourseIndexes.flatMap((index) => (courses[index] ? [courses[index]] : []));
  const quickNavItems = [
    { label: courses[0]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[0]?.slug ?? ""}` },
    { label: courses[1]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[1]?.slug ?? ""}` },
    { label: courses[2]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[2]?.slug ?? ""}` },
    { label: courses[4]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[4]?.slug ?? ""}` },
    { label: t.curriculumTitle, href: `/${locale}/curriculum` },
    { label: t.primaryCta, href: `/${locale}/curriculum` },
    { label: t.courseDetail.inquiryCta, href: `/${locale}/partner-inquiry` }
  ];

  return (
    <>
      <section className="home-stage">
        <div className="hero-card">
          <div className="hero-copy">
            <StatusBadge>{t.heroBadge}</StatusBadge>
            <h1>
              {locale === "ko" ? (
                <>
                  당신의 기술이 <span>미래</span>가 되는 곳
                </>
              ) : (
                t.heroTitle
              )}
            </h1>
            <p>{t.heroLead}</p>
            <div className="hero-trust-row">
              {stats.map((item, index) => {
                const Icon = heroStatIcons[index];
                return (
                  <div key={item.label}>
                    <Icon aria-hidden="true" size={22} strokeWidth={1.65} />
                    <span>
                      <strong>{item.value}</strong>
                      <small>{item.label}</small>
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="hero-actions">
              <Link className="primary-button" href={`/${locale}/curriculum`}>
                {t.primaryCta}
                <ArrowRight size={18} />
              </Link>
              <Link className="secondary-button subtle" href={`/${locale}/login`}>
                {t.secureCta}
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <Image src="/assets/premium-hero-wellness-education.png" alt={t.home.heroImageAlt} width={960} height={620} priority />
            <Link className="hero-floating-card" href={`/${locale}/partner-inquiry`}>
              <BadgeCheck size={24} />
              <span>
                <strong>{t.courseDetail.inquiryCta}</strong>
                <small>{t.home.certificationLead}</small>
              </span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="home-quick-nav" aria-label={t.curriculumTitle}>
            {quickNavItems.map((item, index) => {
              const Icon = quickNavIcons[index];
              return (
                <Link href={item.href} key={`${item.label}-${index}`}>
                  <Icon aria-hidden="true" size={24} strokeWidth={1.55} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-band platform-section">
        <div className="platform-shell">
          <div className="platform-copy">
            <span className="eyebrow">{t.home.platformEyebrow}</span>
            <h2>{t.trustTitle}</h2>
            <p>{t.home.platformLead}</p>
            <div className="platform-actions">
              <Link href={`/${locale}/about`}>{t.home.learnMore} <ArrowRight size={15} /></Link>
              <Link href={`/${locale}/curriculum`}>{t.home.viewCurriculum} <ArrowRight size={15} /></Link>
            </div>
          </div>

          <div className="platform-feature-list">
            {t.home.platformFeatures.map((feature, index) => {
              const Icon = platformIcons[index];
              return (
                <article key={feature.title}>
                  <Icon size={24} />
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="content-section curriculum-preview">
        <div className="section-heading inline">
          <div>
            <span className="eyebrow">{t.home.curriculumEyebrow}</span>
            <h2>{t.curriculumTitle}</h2>
            <p>{t.home.curriculumLead}</p>
          </div>
          <Link href={`/${locale}/curriculum`}>
            {t.home.viewAll} <ArrowRight size={15} />
          </Link>
        </div>
        <div className="curriculum-preview-shell">
          <aside className="curriculum-side-tabs" aria-label={t.curriculumTitle}>
            <Link className="active" href={`/${locale}/curriculum`}>{t.home.viewAll}</Link>
            {courses.slice(0, 9).map((course) => (
              <Link key={course.title} href={`/${locale}/curriculum/${course.slug}`}>
                {course.title}
              </Link>
            ))}
          </aside>
          <div className="course-grid compact">
            {previewCourses.map((course) => (
              <article className="course-card" key={course.title}>
                <Image src={course.imageUrl} alt={course.title} width={640} height={320} />
                <span>{course.category}</span>
                <h3>{course.title}</h3>
                <p>{course.summary}</p>
                <Link className="card-link" href={`/${locale}/curriculum/${course.slug}`} aria-label={`${course.title} ${t.home.viewDetails}`}>
                  <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section activities-preview">
        <div className="section-heading inline">
          <div>
            <span className="eyebrow">{t.home.activitiesEyebrow}</span>
            <h2>{t.activitiesTitle}</h2>
            <p>{t.home.activitiesLead}</p>
          </div>
          <Link href={`/${locale}/activities`}>
            {t.home.viewAll} <ArrowRight size={15} />
          </Link>
        </div>
        <div className="activity-showcase">
          <div className="activity-tile-grid" aria-label="Global activity categories">
            {activityGroups.map((activity) => {
              const Icon = activity.icon;
              return (
                <Link className="activity-tile" href={`/${locale}/activities`} key={activity.key}>
                  <Icon size={24} strokeWidth={1.7} />
                  <span>{activity.title}</span>
                </Link>
              );
            })}
          </div>

          <article className="certification-card">
            <div>
              <span className="eyebrow">{t.home.certificationEyebrow}</span>
              <h3>{t.home.certificationTitle}</h3>
              <p>{t.home.certificationLead}</p>
              <Link href={`/${locale}/login`}>
                {t.home.certificationCta} <ArrowRight size={15} />
              </Link>
            </div>
            <div className="certificate-preview" aria-hidden="true">
              <BadgeCheck size={34} />
              <strong>KHCPQA</strong>
              <span>{t.home.certificateLabel}</span>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
