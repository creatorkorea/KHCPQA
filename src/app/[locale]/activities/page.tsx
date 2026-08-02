import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
import { getActivityGroups, getCopy, type Locale } from "@/lib/content";
import { getPublishedContentIntro, getPublishedContentMap } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";

const activitiesOverviewCopy: Record<Locale, {
  categoryCtas: Record<string, string>;
  featureTitle: string;
  featureLead: string;
  categoriesLabel: string;
  exploreLabel: string;
  gridTitle: string;
  gridLead: string;
  allLabel: string;
  publishedLabel: string;
}> = {
  ko: {
    categoryCtas: {
      awards: "수상 보기",
      "corporate-events": "협력 보기",
      competition: "대회 보기",
      media: "보도 보기",
      notice: "공지 확인",
      pass: "합격 보기",
      photo: "사진 보기",
      reviews: "후기 보기",
      volunteer: "봉사 보기"
    },
    featureTitle: "협회 소식과 성과를 커뮤니티에서 탐색합니다",
    featureLead: "공지부터 국제대회, 수상경력, 언론 보도까지 커뮤니티 콘텐츠를 한 흐름으로 정리합니다.",
    categoriesLabel: "커뮤니티 카테고리",
    exploreLabel: "커뮤니티 메뉴",
    gridTitle: "커뮤니티 콘텐츠",
    gridLead: "카테고리별 최신 공지와 현장 기록을 확인할 수 있습니다.",
    allLabel: "전체 커뮤니티",
    publishedLabel: "공개 콘텐츠"
  },
  en: {
    categoryCtas: {},
    featureTitle: "Explore association activities and achievements in one place",
    featureLead: "From notices to competitions, awards, and media records, planned activity content is organized into a clear journey.",
    categoriesLabel: "Activity categories",
    exploreLabel: "Activity Menu",
    gridTitle: "Activity Content",
    gridLead: "Browse the latest notices and field records by category.",
    allLabel: "All Activities",
    publishedLabel: "Published content"
  },
  es: {
    categoryCtas: {},
    featureTitle: "Explore actividades y logros de la asociación en un solo lugar",
    featureLead: "Desde avisos hasta concursos, premios y medios, el contenido planificado se organiza en un recorrido claro.",
    categoriesLabel: "Categorías",
    exploreLabel: "Menú de Actividades",
    gridTitle: "Contenido de Actividades",
    gridLead: "Consulte avisos recientes y registros de campo por categoría.",
    allLabel: "Todas las Actividades",
    publishedLabel: "Contenido publicado"
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "activities",
    title: `${t.activitiesTitle} | KHCPQA`,
    description: t.activitiesPage.lead
  });
}

export default async function ActivitiesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const activityGroups = getActivityGroups(locale);
  const activityContent = await getPublishedContentMap({
    contentType: "Activity",
    locale,
    slugs: activityGroups.map((activity) => activity.key)
  });
  const intro = await getPublishedContentIntro({
    contentType: "Page",
    fallback: {
      lead: t.activitiesPage.lead,
      title: t.activitiesTitle
    },
    locale,
    slug: "activities"
  });
  const pageCopy = activitiesOverviewCopy[locale];
  const introTitle = locale === "ko" ? t.activitiesTitle : intro.title;
  const introLead = locale === "ko" ? t.activitiesPage.lead : intro.lead;
  const publishedCount = activityGroups.filter((activity) => activityContent.has(activity.key)).length;

  return (
    <>
      <PageIntro
        className="community-page-intro"
        eyebrow={t.activitiesPage.eyebrow}
        title={introTitle}
        lead={introLead}
      />
      <section className="activities-overview-section">
        <div className="activities-directory-shell">
          <aside className="activities-side-menu" aria-label={pageCopy.exploreLabel}>
            <div>
              <span>{pageCopy.exploreLabel}</span>
              <strong>{pageCopy.allLabel}</strong>
              <small>{activityGroups.length} {pageCopy.categoriesLabel}</small>
            </div>
            <nav>
              <Link aria-current="page" className="is-active" href={`/${locale}/activities`}>
                <LayoutGrid size={17} />
                <span>{pageCopy.allLabel}</span>
              </Link>
              {activityGroups.map((activity) => {
                const Icon = activity.icon;
                return (
                  <Link href={`/${locale}/activities/${activity.key}`} key={activity.key}>
                    <Icon size={17} />
                    <span>{activity.title}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="activities-content-panel">
            <div className="activities-feature-row">
              <div className="activities-feature-copy">
                <span>{t.activitiesPage.eyebrow}</span>
                <h2>{pageCopy.featureTitle}</h2>
                <p>{pageCopy.featureLead}</p>
                <dl>
                  <div>
                    <dt>{activityGroups.length}</dt>
                    <dd>{pageCopy.categoriesLabel}</dd>
                  </div>
                  <div>
                    <dt>{publishedCount}</dt>
                    <dd>{pageCopy.publishedLabel}</dd>
                  </div>
                </dl>
              </div>
              <Image
                src="/assets/client-smc/global-competition-hall-wide.jpg"
                alt={intro.title}
                width={960}
                height={620}
                unoptimized
                priority
              />
            </div>

            <div className="section-heading activities-heading">
              <span className="eyebrow">{t.activitiesPage.eyebrow}</span>
              <div>
                <h2>{pageCopy.gridTitle}</h2>
                <p>{pageCopy.gridLead}</p>
              </div>
            </div>

            <div className="activity-grid large renewed">
              {activityGroups.map((activity) => {
                const Icon = activity.icon;
                const content = activityContent.get(activity.key);
                const title = content?.title || activity.title;
                const summary = content?.lead || activity.summary;
                const imageUrl = content?.imageUrl || activity.imageUrl;
                return (
                  <article className="activity-card renewed" key={activity.key}>
                    <Image
                      src={imageUrl}
                      alt={title}
                      width={640}
                      height={400}
                      unoptimized
                    />
                    <div>
                      <span className="activity-card-kicker">
                        <Icon size={18} />
                        {activity.source}
                      </span>
                      <h3>{title}</h3>
                      <p>{summary}</p>
                      <Link href={`/${locale}/activities/${activity.key}`}>
                        {pageCopy.categoryCtas[activity.key] || t.activitiesPage.detailCta}
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
