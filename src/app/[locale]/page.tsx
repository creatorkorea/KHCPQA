import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardPenLine,
  Handshake,
  HandHeart,
  Headphones,
  HeartPulse,
  Leaf,
  Lightbulb,
  Megaphone,
  MessageCircle,
  Mountain,
  Store,
  Users
} from "lucide-react";
import { getCopy, getCourses, type Locale } from "@/lib/content";
import { getPublishedBanners, type PublishedBanner } from "@/lib/public-content";
import { StatusBadge } from "@/components/SiteShell";

const quickNavIcons = [BriefcaseBusiness, Store, CalendarDays, HeartPulse, Leaf, Mountain, Headphones, MessageCircle];
const supportIcons = [Users, BadgeCheck, Lightbulb, Megaphone];
const reasonIcons = [BookOpenCheck, Award, Handshake, Headphones];

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const courses = getCourses(locale);
  const banners = await getPublishedBanners({ placement: "home" });
  const previewCourseIndexes = [5, 3, 4, 6, 7, 8];
  const previewCourses = previewCourseIndexes.flatMap((index) => (courses[index] ? [courses[index]] : []));
  const quickNavItems = [
    { label: courses[0]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[0]?.slug ?? ""}` },
    { label: courses[1]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[1]?.slug ?? ""}` },
    { label: courses[2]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[2]?.slug ?? ""}` },
    { label: courses[4]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[4]?.slug ?? ""}` },
    { label: courses[5]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[5]?.slug ?? ""}` },
    { label: courses[7]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[7]?.slug ?? ""}` },
    { label: t.courseDetail.inquiryCta, href: `/${locale}/partner-inquiry` },
    { label: t.home.onlineInquiry, href: `/${locale}/partner-inquiry` }
  ];
  const partners = [
    "SHILLA",
    "AMOREPACIFIC",
    "OLIVE YOUNG",
    "LOTTE HOTELS",
    "SpaLand",
    "힐리언스 선마을"
  ];

  const renderSectionTitle = (title: string, lead?: string) => (
    <div className="home-section-title">
      <h2>{title}<span aria-hidden="true">✣</span></h2>
      {lead ? <p>{lead}</p> : null}
    </div>
  );

  return (
    <>
      <section className="home-stage">
        <div className="hero-card">
          <div className="hero-copy">
            <StatusBadge>{t.heroBadge}</StatusBadge>
            <h1>
              {t.home.heroTitlePrefix}
              <br />
              <span>{t.home.heroTitleHighlight}</span>
              {t.home.heroTitleSuffix}
            </h1>
            <p>{t.heroLead}</p>
            <div className="hero-actions">
              <Link className="primary-button" href={`/${locale}/curriculum`}>
                {t.primaryCta}
                <ArrowRight size={18} />
              </Link>
              <Link className="secondary-button subtle" href={`/${locale}/partner-inquiry`}>
                {t.secondaryCta}
                <MessageCircle size={15} />
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <Image src="/assets/premium-hero-wellness-education.png" alt={t.home.heroImageAlt} width={960} height={620} priority />
            <Link className="hero-floating-card" href={`/${locale}/partner-inquiry`}>
              <GraduationCapIcon />
              <span>
                <strong>{t.home.heroFloatingTitle}</strong>
                <small>{t.home.heroFloatingLead}</small>
                <em>1 / 3</em>
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

      {banners.length > 0 ? (
        <section className="home-admin-banner-section" aria-label={t.home.noticesTitle}>
          {banners.map((banner) => (
            <HomeBanner banner={banner} fallbackHref={`/${locale}/partner-inquiry`} key={`${banner.placement}-${banner.title}`} />
          ))}
        </section>
      ) : null}

      <section className="content-section curriculum-preview">
        {renderSectionTitle(t.home.featuredCoursesTitle, t.home.featuredCoursesLead)}
        <div className="home-course-strip">
          {previewCourses.map((course) => (
            <article className="home-course-card" key={course.title}>
              <Image src={course.imageUrl} alt={course.title} width={420} height={260} />
              <div>
                <h3>{course.title}</h3>
                <p>{course.summary}</p>
                <Link href={`/${locale}/curriculum/${course.slug}`} aria-label={`${course.title} ${t.home.viewDetails}`}>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-reasons-section">
        {renderSectionTitle(t.home.reasonsTitle)}
        <div className="home-reason-grid">
          {t.home.reasons.map((item, index) => {
            const Icon = reasonIcons[index];
            return (
              <article key={item.title}>
                <Icon size={34} strokeWidth={1.45} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="support-program-section">
        <div className="section-heading centered">
          <h2>{t.home.supportTitle}</h2>
        </div>
        <div className="home-support-service-grid">
          {t.home.supportPrograms.map((program, index) => {
            const Icon = supportIcons[index];
            return (
              <article key={program.title}>
                <Image src={program.image} alt="" width={220} height={170} />
                <div>
                  <Icon size={20} strokeWidth={1.55} />
                  <h3>{program.title}</h3>
                  <p>{program.body}</p>
                  <Link href={`/${locale}/partner-inquiry`}>{t.home.learnMore} <ArrowRight size={13} /></Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-info-section">
        <div className="landing-info-grid">
          <article className="landing-info-card">
            <div className="landing-info-head">
              <h2>{t.home.noticesTitle}</h2>
              <Link href={`/${locale}/activities`}>{t.home.moreCta} <ArrowRight size={14} /></Link>
            </div>
            <ul>
              {t.home.notices.map((notice, index) => (
                <li key={notice}>
                  <span>{notice}</span>
                  <time>{`2024.05.${20 - index * 5}`}</time>
                </li>
              ))}
            </ul>
          </article>
          <article className="landing-info-card">
            <div className="landing-info-head">
              <h2>{t.home.scheduleTitle}</h2>
              <Link href={`/${locale}/contact`}>{t.home.moreCta} <ArrowRight size={14} /></Link>
            </div>
            <div className="schedule-list">
              {t.home.schedules.map(({ label, time }) => (
                <div key={label}>
                  <strong>{label}</strong>
                  <span>{time}</span>
                </div>
              ))}
            </div>
          </article>
          <article className="consult-card">
            <div>
              <MessageCircle size={28} />
              <h2>{t.home.consultTitle.split("\n").map((line, index) => (
                <span key={line}>
                  {index > 0 ? <br /> : null}
                  {line}
                </span>
              ))}</h2>
              <p>{t.home.consultLead}</p>
              <Link href={`/${locale}/partner-inquiry`}>
                {t.home.consultCta} <ArrowRight size={15} />
              </Link>
            </div>
            <span className="consult-plant" aria-hidden="true" />
          </article>
        </div>
      </section>

      <section className="home-partner-section">
        <h2>{t.home.partnersTitle}</h2>
        <div className="home-partner-logos">
          {partners.map((partner) => (
            <span key={partner}>{partner}</span>
          ))}
        </div>
      </section>

      <section className="bottom-cta-section home-final-cta-section">
        <div className="bottom-cta-banner home-final-cta">
          <Image src="/assets/hero-professionals.png" alt="" width={220} height={160} />
          <div>
            <p>{t.home.finalKicker}</p>
            <h2>{t.home.finalTitle}</h2>
          </div>
          <Link href={`/${locale}/partner-inquiry`}>
            {t.home.finalCta} <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}

function GraduationCapIcon() {
  return <BadgeCheck size={24} aria-hidden="true" />;
}

function HomeBanner({ banner, fallbackHref }: { banner: PublishedBanner; fallbackHref: string }) {
  const href = banner.targetUrl || fallbackHref;
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  return (
    <Link className="home-admin-banner" href={href} rel={isExternal ? "noreferrer" : undefined} target={isExternal ? "_blank" : undefined}>
      <span className="home-admin-banner-icon">
        <Megaphone size={20} aria-hidden="true" />
      </span>
      <span>{banner.title}</span>
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}
