import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardPenLine,
  GraduationCap,
  HandHeart,
  Headphones,
  HeartPulse,
  Lightbulb,
  Megaphone,
  MessageCircle,
  Store,
  Users
} from "lucide-react";
import { getCopy, getCourses, type Locale } from "@/lib/content";
import { StatusBadge } from "@/components/SiteShell";

const quickNavIcons = [BriefcaseBusiness, Store, CalendarDays, HeartPulse, HandHeart, ClipboardPenLine, Headphones];
const heroSummaryIcons = [GraduationCap, BriefcaseBusiness, Store];
const supportIcons = [Users, BadgeCheck, Lightbulb, Megaphone];

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const courses = getCourses(locale);
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
  const heroSummaries = [
    { title: "실무 중심 교육", body: "현장 중심 커리큘럼" },
    { title: "취업 연계 지원", body: "맞춤형 취업 상담" },
    { title: "창업 지원", body: "1인 창업 컨설팅" }
  ];
  const supportPrograms = [
    { title: "1:1 취업 상담", body: "전문 상담사와 함께 맞춤형 취업 설계" },
    { title: "취업 연계 시스템", body: "협회 협력업체 연계를 통한 취업 기회 제공" },
    { title: "창업 컨설팅", body: "1인 창업을 위한 맞춤 컨설팅 지원" },
    { title: "마케팅 & 운영 지원", body: "홍보, 마케팅, 운영 노하우 제공" }
  ];
  const notices = [
    "2024년 하반기 신규 교육과정 안내",
    "수강료 할인 이벤트 안내",
    "자격증 시험 일정 안내",
    "5월 개강반 모집 안내"
  ];
  const schedules = [
    ["오전반", "월~금 10:00 - 13:00"],
    ["오후반", "월~금 14:00 - 17:00"],
    ["야간반", "월~금 19:00 - 21:00"]
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
                  당신의 기술이
                  <br />
                  <span>미래</span>가 되는 곳
                </>
              ) : (
                t.heroTitle
              )}
            </h1>
            <p>{t.heroLead}</p>
            <div className="hero-trust-row">
              {heroSummaries.map((item, index) => {
                const Icon = heroSummaryIcons[index];
                return (
                  <div key={item.title}>
                    <Icon aria-hidden="true" size={22} strokeWidth={1.65} />
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.body}</small>
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
                <strong>수강료 문의</strong>
                <small>맞춤 상담을 받아보세요</small>
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

      <section className="content-section curriculum-preview">
        <div className="section-heading inline">
          <div>
            <h2>{t.curriculumTitle}</h2>
            <p>현장 경험이 풍부한 강사진과 체계적인 커리큘럼으로 전문가로 성장할 수 있도록 지원합니다.</p>
          </div>
          <Link href={`/${locale}/curriculum`}>
            {t.home.viewAll} <ArrowRight size={15} />
          </Link>
        </div>
        <div className="curriculum-preview-shell">
          <aside className="curriculum-side-tabs" aria-label={t.curriculumTitle}>
            <Link className="active" href={`/${locale}/curriculum`}>{t.home.viewAll}</Link>
            {[
              courses[0],
              courses[1],
              courses[2],
              courses[3],
              courses[4],
              courses[5],
              courses[6],
              courses[7],
              courses[8],
              courses[9]
            ].filter(Boolean).map((course) => (
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

      <section className="support-program-section">
        <div className="section-heading centered">
          <h2>취업 & 창업 지원 프로그램</h2>
          <p>교육부터 취업, 창업까지 원스톱으로 지원합니다.</p>
        </div>
        <div className="support-program-grid">
          {supportPrograms.map((program, index) => {
            const Icon = supportIcons[index];
            return (
              <article key={program.title}>
                <Icon size={30} strokeWidth={1.55} />
                <h3>{program.title}</h3>
                <p>{program.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-info-section">
        <div className="landing-info-grid">
          <article className="landing-info-card">
            <div className="landing-info-head">
              <h2>공지사항</h2>
              <Link href={`/${locale}/activities`}>더보기 <ArrowRight size={14} /></Link>
            </div>
            <ul>
              {notices.map((notice, index) => (
                <li key={notice}>
                  <span>{notice}</span>
                  <time>{`2024.05.${20 - index * 5}`}</time>
                </li>
              ))}
            </ul>
          </article>
          <article className="landing-info-card">
            <div className="landing-info-head">
              <h2>강의시간 안내</h2>
              <Link href={`/${locale}/contact`}>더보기 <ArrowRight size={14} /></Link>
            </div>
            <div className="schedule-list">
              {schedules.map(([label, time]) => (
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
              <h2>지금 상담받고<br />미래를 준비하세요!</h2>
              <p>전문 상담사가 친절하게 안내해 드립니다.</p>
              <Link href={`/${locale}/partner-inquiry`}>
                상담 신청하기 <ArrowRight size={15} />
              </Link>
            </div>
            <span className="consult-plant" aria-hidden="true" />
          </article>
        </div>
      </section>

      <section className="bottom-cta-section">
        <div className="bottom-cta-banner">
          <div>
            <h2>전문가의 꿈, KHCPQA가 함께합니다</h2>
            <p>체계적인 교육과 든든한 지원으로 당신의 미래를 응원합니다.</p>
          </div>
          <Link href={`/${locale}/partner-inquiry`}>
            수강 상담 신청하기 <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
