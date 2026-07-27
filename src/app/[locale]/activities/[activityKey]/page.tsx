import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, CheckCircle2, LayoutGrid } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
import {
  getActivityGroupByKey,
  getActivityGroups,
  getActivityKeys,
  getActivityPosts,
  getCopy,
  type Locale
} from "@/lib/content";
import { getPublishedActivityPosts, getPublishedContentIntro, getPublishedContentSections, type PublishedContentSection } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";

function splitSectionLines(section: PublishedContentSection) {
  return section.body
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

const activityDirectoryCopy: Record<Locale, {
  allLabel: string;
  categoriesLabel: string;
  exploreLabel: string;
  emptyPosts: string;
}> = {
  ko: {
    allLabel: "전체 활동",
    categoriesLabel: "활동 카테고리",
    exploreLabel: "활동 메뉴",
    emptyPosts: "등록된 게시글이 없습니다."
  },
  en: {
    allLabel: "All Activities",
    categoriesLabel: "Activity categories",
    exploreLabel: "Activity Menu",
    emptyPosts: "No posts have been published yet."
  },
  es: {
    allLabel: "Todas las Actividades",
    categoriesLabel: "Categorías",
    exploreLabel: "Menú de Actividades",
    emptyPosts: "Aún no hay publicaciones publicadas."
  }
};

export function generateStaticParams() {
  return ["ko", "en", "es"].flatMap((locale) =>
    getActivityKeys().map((activityKey) => ({ locale, activityKey }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale; activityKey: string }>;
}) {
  const { locale, activityKey } = await params;
  const activity = getActivityGroupByKey(locale, activityKey);

  if (!activity) {
    return {};
  }

  return buildLocaleMetadata({
    locale,
    path: `activities/${activityKey}`,
    title: `${activity.title} | KHCPQA`,
    description: activity.summary
  });
}

export default async function ActivityDetailPage({
  params
}: {
  params: Promise<{ locale: Locale; activityKey: string }>;
}) {
  const { locale, activityKey } = await params;
  const t = getCopy(locale);
  const activity = getActivityGroupByKey(locale, activityKey);

  if (!activity) {
    notFound();
  }

  const pageCopy = activityDirectoryCopy[locale];
  const activityGroups = getActivityGroups(locale);
  const content = await getPublishedContentIntro({
    contentType: "Activity",
    fallback: {
      lead: activity.summary,
      title: activity.title
    },
    locale,
    slug: activity.key
  });
  const activityTitle = content.title;
  const activitySummary = content.lead || activity.summary;
  const activityBody = content.body || activitySummary;
  const activityImageUrl = content.imageUrl || activity.imageUrl;
  const [posts, detailSections] = await Promise.all([
    getPublishedActivityPosts({
      activityKey,
      fallback: getActivityPosts(locale, activityKey),
      locale
    }),
    getPublishedContentSections({
      contentType: "Activity",
      locale,
      slugPrefix: `${activityKey}-section-`
    })
  ]);
  const Icon = activity.icon;

  return (
    <>
      <PageIntro eyebrow={t.activitiesPage.detailEyebrow} title={activityTitle} lead={activitySummary} />
      <section className="activities-overview-section">
        <div className="activities-directory-shell">
          <aside className="activities-side-menu" aria-label={pageCopy.exploreLabel}>
            <div>
              <span>{pageCopy.exploreLabel}</span>
              <strong>{activityTitle}</strong>
              <small>{activityGroups.length} {pageCopy.categoriesLabel}</small>
            </div>
            <nav>
              <Link href={`/${locale}/activities`}>
                <LayoutGrid size={17} />
                <span>{pageCopy.allLabel}</span>
              </Link>
              {activityGroups.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    aria-current={item.key === activity.key ? "page" : undefined}
                    className={item.key === activity.key ? "is-active" : undefined}
                    href={`/${locale}/activities/${item.key}`}
                    key={item.key}
                  >
                    <ItemIcon size={17} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="activities-content-panel activity-detail-section">
            <div className="activity-detail-hero">
              <Image src={activityImageUrl} alt={activityTitle} width={960} height={540} unoptimized />
              <div>
                <Icon size={28} />
                <h2>{activityTitle}</h2>
                <p>{activityBody}</p>
              </div>
            </div>
            {detailSections.length > 0 ? (
              <section className="activity-cms-section" aria-labelledby="activity-cms-section-title">
                <div className="section-heading">
                  <span className="eyebrow">CMS</span>
                  <h2 id="activity-cms-section-title">{t.activitiesPage.managedContentTitle}</h2>
                </div>
                <div>
                  {detailSections.map((section, index) => {
                    const lines = splitSectionLines(section);

                    return (
                      <article key={section.slug}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <h3>{section.title}</h3>
                        {section.lead ? <p>{section.lead}</p> : null}
                        {lines.length > 0 ? (
                          <ul>
                            {lines.map((line) => (
                              <li key={line}>
                                <CheckCircle2 size={16} />
                                <span>{line}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}
            <div className="section-heading">
              <span className="eyebrow">{activityTitle}</span>
              <h2>{t.activitiesPage.latestPostsTitle}</h2>
            </div>
            {posts.length > 0 ? (
              <div className="activity-post-list">
                {posts.map((post) => (
                  <Link
                    className="activity-post-card"
                    href={`/${locale}/activities/${activityKey}/${post.slug}`}
                    key={post.slug}
                  >
                    <article>
                      {post.imageUrl ? (
                        <Image
                          className="activity-post-card-image"
                          src={post.imageUrl}
                          alt={post.title}
                          width={520}
                          height={300}
                          unoptimized
                        />
                      ) : null}
                      <header>
                        <CalendarDays size={18} />
                        <span>{post.date}</span>
                      </header>
                      <h3>{post.title}</h3>
                      <p>{post.body}</p>
                      <span className="activity-post-cta">
                        {t.activitiesPage.detailCta}
                        <ArrowRight size={15} />
                      </span>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="activity-empty-state">
                <CalendarDays size={22} />
                <p>{pageCopy.emptyPosts}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
