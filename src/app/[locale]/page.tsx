import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, BadgeCheck, BookOpen, Building2, Globe2, ShieldCheck, Users } from "lucide-react";
import { activityGroups, courses, getCopy, stats, type Locale } from "@/lib/content";
import { StatusBadge } from "@/components/SiteShell";

const heroStatIcons = [Award, Globe2, Users, Building2];

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <section className="home-stage">
        <aside className="design-rail" aria-label="Design direction">
          <div className="rail-logo">KHCPQA</div>
          <p>Korea Health & Complementary Professional Qualification Association</p>
          <div className="rail-divider" />
          <h2>Global Homepage & Web App Platform</h2>
          <ul>
            <li>Global Education Excellence</li>
            <li>Trusted Certification Guidance</li>
            <li>Worldwide Partnerships & Impact</li>
          </ul>
        </aside>

        <div className="hero-card">
          <div className="hero-copy">
            <StatusBadge>KHCPQA Global Education</StatusBadge>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroLead}</p>
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

          <div className="hero-visual" aria-label="Global education visual">
            <Image src="/assets/hero-professionals.png" alt="" width={960} height={620} priority />
          </div>

          <div className="hero-panel-grid">
            {stats.map((item, index) => {
              const Icon = heroStatIcons[index];
              return (
                <div key={item.label}>
                  <Icon aria-hidden="true" size={30} strokeWidth={1.7} />
                  <span>
                    <strong>{item.value}</strong>
                    <small>{item.label}</small>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-band platform-section">
        <div className="platform-shell">
          <div className="platform-copy">
            <span className="eyebrow">Platform</span>
            <h2>{t.trustTitle}</h2>
            <p>
              SMC아카데미의 교육 콘텐츠와 KHCPQA의 자격 운영 기준을 연결해,
              해외 교육생과 파트너가 과정 탐색부터 자격 조회까지 일관된 흐름으로 이용할 수 있게 합니다.
            </p>
            <div className="platform-actions">
              <Link href={`/${locale}/about`}>Learn more <ArrowRight size={15} /></Link>
              <Link href={`/${locale}/curriculum`}>View curriculum <ArrowRight size={15} /></Link>
            </div>
          </div>

          <div className="platform-feature-list">
            <article>
              <ShieldCheck size={24} />
              <div>
                <h3>Private Member Area</h3>
                <p>My Page는 공개 메뉴에서 제외하고 로그인 후 계정 메뉴에서만 접근합니다.</p>
              </div>
            </article>
            <article>
              <BookOpen size={24} />
              <div>
                <h3>Structured Content</h3>
                <p>기존 SMC365 콘텐츠를 출처와 함께 정리해 과정, 활동, 공지로 운영합니다.</p>
              </div>
            </article>
            <article>
              <BadgeCheck size={24} />
              <div>
                <h3>Certification Flow</h3>
                <p>로그인 후 자격 취득 내역을 확인하는 흐름으로 확장할 수 있게 설계합니다.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section curriculum-preview">
        <div className="section-heading inline">
          <div>
            <span className="eyebrow">Curriculum</span>
            <h2>{t.curriculumTitle}</h2>
            <p>대표 교육 과정을 먼저 살펴보고 전체 과정 목록에서 세부 프로그램을 확인하세요.</p>
          </div>
          <Link href={`/${locale}/curriculum`}>
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="course-grid compact">
          {courses.slice(0, 6).map((course) => (
            <article className="course-card" key={course.title}>
              <Image src={course.imageUrl} alt="" width={640} height={320} />
              <span>{course.category}</span>
              <h3>{course.title}</h3>
              <p>{course.summary}</p>
              <Link className="card-link" href={`/${locale}/curriculum/${course.slug}`}>
                View Details <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading inline">
          <div>
            <span className="eyebrow">Activities</span>
            <h2>{t.activitiesTitle}</h2>
          </div>
          <Link href={`/${locale}/activities`}>View all</Link>
        </div>
        <div className="activity-grid">
          {activityGroups.slice(0, 3).map((activity) => {
            const Icon = activity.icon;
            return (
              <article className="activity-card" key={activity.key}>
                <Image
                  src={activity.imageUrl}
                  alt=""
                  width={640}
                  height={400}
                  unoptimized
                />
                <div>
                  <Icon size={22} />
                  <h3>{activity.title}</h3>
                  <p>{activity.source}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
