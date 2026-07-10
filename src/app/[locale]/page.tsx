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
import { StatusBadge } from "@/components/SiteShell";

const quickNavIcons = [BriefcaseBusiness, Store, CalendarDays, HeartPulse, Leaf, Mountain, Headphones, MessageCircle];
const supportIcons = [Users, BadgeCheck, Lightbulb, Megaphone];
const reasonIcons = [BookOpenCheck, Award, Handshake, Headphones];

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const courses = getCourses(locale);
  const previewCourseIndexes = [5, 3, 4, 6, 7, 8];
  const previewCourses = previewCourseIndexes.flatMap((index) => (courses[index] ? [courses[index]] : []));
  const quickNavItems = [
    { label: courses[0]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[0]?.slug ?? ""}` },
    { label: courses[1]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[1]?.slug ?? ""}` },
    { label: courses[2]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[2]?.slug ?? ""}` },
    { label: courses[4]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[4]?.slug ?? ""}` },
    { label: courses[5]?.title ?? "아로마 테라피", href: `/${locale}/curriculum/${courses[5]?.slug ?? ""}` },
    { label: courses[7]?.title ?? "스포츠 마사지", href: `/${locale}/curriculum/${courses[7]?.slug ?? ""}` },
    { label: t.courseDetail.inquiryCta, href: `/${locale}/partner-inquiry` },
    { label: "온라인 문의", href: `/${locale}/partner-inquiry` }
  ];
  const supportPrograms = [
    { title: "1:1 취업 상담", body: "전문 상담사와 1:1 상담을 통해 맞춤형 취업 전략을 제안합니다.", image: "/assets/course-employment-consulting.jpg" },
    { title: "취업 연계 시스템", body: "전국의 우수 협력 네트워크를 통한 취업 연계 서비스를 제공합니다.", image: "/assets/partner-network.png" },
    { title: "창업 컨설팅", body: "창업 준비부터 오픈까지 전문 컨설팅을 지원합니다.", image: "/assets/course-startup-consulting.jpg" },
    { title: "마케팅 지원", body: "홍보, 브랜딩, SNS 마케팅 등 실무적인 마케팅을 지원합니다.", image: "/assets/course-thumb-business-planning.png" }
  ];
  const reasonItems = [
    { title: "현장 중심 실무 교육", body: "실무 위주의 커리큘럼으로 현장에서 바로 활용 가능합니다." },
    { title: "전문 강사진", body: "풍부한 현장 경험을 갖춘 전문 강사진이 핵심을 교육합니다." },
    { title: "취·창업 연계", body: "다양한 네트워크와 연계해 취·창업을 적극 지원합니다." },
    { title: "1:1 맞춤 상담", body: "개인의 목표와 상황에 맞춘 성장 로드맵을 설계합니다." }
  ];
  const notices = [
    "2024년 6월 교육과정 개강 안내",
    "아로마 테라피 특강 안내",
    "여름 맞이 피부관리 이벤트",
    "5월 자격시험 일정 안내",
    "취업 박람회 참가 안내"
  ];
  const schedules = [
    ["주간반", "월~금 10:00 - 14:00"],
    ["야간반", "월~금 19:00 - 22:00"],
    ["주말반", "토요일 10:00 - 16:00"],
    ["취미반", "화, 목 14:00 - 16:00"]
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
            <StatusBadge>전문가로 가는 가장 확실한 길</StatusBadge>
            <h1>
              {locale === "ko" ? (
                <>
                  전문 교육으로
                  <br />
                  <span>커리어</span>를 완성하세요
                </>
              ) : (
                t.heroTitle
              )}
            </h1>
            <p>현장 중심의 실무 교육과 체계적인 취·창업 지원으로 당신의 꿈을 현실로 만들어 드립니다.</p>
            <div className="hero-actions">
              <Link className="primary-button" href={`/${locale}/curriculum`}>
                교육과정 바로보기
                <ArrowRight size={18} />
              </Link>
              <Link className="secondary-button subtle" href={`/${locale}/partner-inquiry`}>
                상담문의 하기
                <MessageCircle size={15} />
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <Image src="/assets/premium-hero-wellness-education.png" alt={t.home.heroImageAlt} width={960} height={620} priority />
            <Link className="hero-floating-card" href={`/${locale}/partner-inquiry`}>
              <GraduationCapIcon />
              <span>
                <strong>국가공인 민간자격 교육기관</strong>
                <small>체계적인 교육과정을 통해 전문 자격 취득을 지원합니다.</small>
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

      <section className="content-section curriculum-preview">
        {renderSectionTitle("주요 교육과정", "현장에서 바로 활용 가능한 실무 중심 교육과정")}
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
        {renderSectionTitle("KHCPQA가 특별한 이유")}
        <div className="home-reason-grid">
          {reasonItems.map((item, index) => {
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
          <h2>취업 & 창업 지원 서비스</h2>
        </div>
        <div className="home-support-service-grid">
          {supportPrograms.map((program, index) => {
            const Icon = supportIcons[index];
            return (
              <article key={program.title}>
                <Image src={program.image} alt="" width={220} height={170} />
                <div>
                  <Icon size={20} strokeWidth={1.55} />
                  <h3>{program.title}</h3>
                  <p>{program.body}</p>
                  <Link href={`/${locale}/partner-inquiry`}>자세히 보기 <ArrowRight size={13} /></Link>
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
              <h2>지금 상담받고<br />당신의 꿈을 시작하세요</h2>
              <p>전문 상담사가 친절하게 안내해 드립니다.</p>
              <Link href={`/${locale}/partner-inquiry`}>
                상담 신청하기 <ArrowRight size={15} />
              </Link>
            </div>
            <span className="consult-plant" aria-hidden="true" />
          </article>
        </div>
      </section>

      <section className="home-partner-section">
        <h2>함께하는 파트너</h2>
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
            <p>첫걸음이 당신의 미래를 바꿉니다 ✣</p>
            <h2>지금 바로 상담 신청하고, 꿈을 현실로 만드세요!</h2>
          </div>
          <Link href={`/${locale}/partner-inquiry`}>
            상담 신청하기 <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}

function GraduationCapIcon() {
  return <BadgeCheck size={24} aria-hidden="true" />;
}
