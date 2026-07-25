import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe2, Languages, LayoutGrid } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
import { getActivityGroups, getCopy, type Locale } from "@/lib/content";
import { getPublishedContentIntro, getPublishedContentMap } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";

const activitiesOverviewCopy: Record<Locale, {
  featureTitle: string;
  featureLead: string;
  categoriesLabel: string;
  globalLabel: string;
  languageLabel: string;
  exploreLabel: string;
  gridTitle: string;
  gridLead: string;
}> = {
  ko: {
    featureTitle: "협회 활동과 성과를 한 화면에서 탐색합니다",
    featureLead: "공지부터 국제대회, 수상경력, 언론 보도까지 기획서 기준의 활동 콘텐츠를 한 흐름으로 정리합니다.",
    categoriesLabel: "활동 카테고리",
    globalLabel: "글로벌 기록",
    languageLabel: "다국어 운영",
    exploreLabel: "주요 활동 바로가기",
    gridTitle: "활동 콘텐츠",
    gridLead: "각 항목에서 최신 공지와 현장 기록을 카테고리별로 확인할 수 있습니다."
  },
  en: {
    featureTitle: "Explore association activities and achievements in one place",
    featureLead: "From notices to competitions, awards, and media records, planned activity content is organized into a clear journey.",
    categoriesLabel: "Activity categories",
    globalLabel: "Global records",
    languageLabel: "Multilingual",
    exploreLabel: "Featured activity links",
    gridTitle: "Activity Content",
    gridLead: "Browse the latest notices and field records by category."
  },
  es: {
    featureTitle: "Explore actividades y logros de la asociación en un solo lugar",
    featureLead: "Desde avisos hasta concursos, premios y medios, el contenido planificado se organiza en un recorrido claro.",
    categoriesLabel: "Categorías",
    globalLabel: "Registros globales",
    languageLabel: "Multilingüe",
    exploreLabel: "Actividades destacadas",
    gridTitle: "Contenido de Actividades",
    gridLead: "Consulte avisos recientes y registros de campo por categoría."
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
  const featuredActivities = activityGroups
    .filter((activity) => ["competition", "awards", "corporate-events"].includes(activity.key))
    .slice(0, 3);

  return (
    <>
      <PageIntro
        eyebrow={t.activitiesPage.eyebrow}
        title={intro.title}
        lead={intro.lead}
      />
      <section className="activities-overview-section">
        <div className="activities-showcase-panel">
          <div className="activities-showcase-copy">
            <span>{pageCopy.exploreLabel}</span>
            <h2>{pageCopy.featureTitle}</h2>
            <p>{pageCopy.featureLead}</p>
            <dl>
              <div>
                <dt>{activityGroups.length}</dt>
                <dd>{pageCopy.categoriesLabel}</dd>
              </div>
              <div>
                <dt>Global</dt>
                <dd>{pageCopy.globalLabel}</dd>
              </div>
              <div>
                <dt>KO/EN/ES</dt>
                <dd>{pageCopy.languageLabel}</dd>
              </div>
            </dl>
          </div>
          <div className="activities-showcase-media">
            <Image
              src="/assets/client-smc/global-competition-hall-wide.jpg"
              alt={intro.title}
              width={1200}
              height={800}
              unoptimized
              priority
            />
          </div>
        </div>

        <nav className="activities-index-rail" aria-label={pageCopy.exploreLabel}>
          {activityGroups.map((activity) => {
            const Icon = activity.icon;
            const content = activityContent.get(activity.key);
            const title = content?.title || activity.title;
            return (
              <Link href={`/${locale}/activities/${activity.key}`} key={activity.key}>
                <Icon size={18} />
                <span>{title}</span>
              </Link>
            );
          })}
        </nav>

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
                    {t.activitiesPage.detailCta}
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="activities-proof-strip">
          {featuredActivities.map((activity) => {
            const content = activityContent.get(activity.key);
            return (
              <Link href={`/${locale}/activities/${activity.key}`} key={activity.key}>
                <Globe2 size={18} />
                <strong>{content?.title || activity.title}</strong>
                <span>{content?.lead || activity.summary}</span>
              </Link>
            );
          })}
          <div>
            <LayoutGrid size={18} />
            <strong>{pageCopy.categoriesLabel}</strong>
            <span>{activityGroups.map((activity) => activity.title).join(" · ")}</span>
          </div>
          <div>
            <Languages size={18} />
            <strong>{pageCopy.languageLabel}</strong>
            <span>한국어 · English · Español</span>
          </div>
        </div>
      </section>
    </>
  );
}
