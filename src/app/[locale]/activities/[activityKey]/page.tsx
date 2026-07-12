import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CheckCircle2, ExternalLink } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
import {
  getActivityGroupByKey,
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
      <section className="activity-detail-section">
        <Link className="activity-back-link" href={`/${locale}/activities`}>
          <ArrowLeft size={16} />
          <span>{t.activitiesPage.allActivitiesCta}</span>
        </Link>
        <div className="activity-detail-hero">
          <Image src={activity.imageUrl} alt={activityTitle} width={960} height={540} unoptimized />
          <div>
            <Icon size={28} />
            <h2>{activityTitle}</h2>
            <p>{activityBody}</p>
            <dl>
              <div>
                <dt>{t.activitiesPage.sourceLabel}</dt>
                <dd>{activity.source}</dd>
              </div>
              <div>
                <dt>{t.activitiesPage.statusLabel}</dt>
                <dd>Preview</dd>
              </div>
            </dl>
          </div>
        </div>
        {detailSections.length > 0 ? (
          <section className="activity-cms-section" aria-labelledby="activity-cms-section-title">
            <div className="section-heading">
              <span className="eyebrow">CMS</span>
              <h2 id="activity-cms-section-title">
                {locale === "ko" ? "운영 콘텐츠" : "Managed Content"}
              </h2>
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
          <span className="eyebrow">CMS</span>
          <h2>{t.activitiesPage.latestPostsTitle}</h2>
        </div>
        <div className="activity-post-list">
          {posts.map((post) => (
            <article key={`${post.title}-${post.date}`}>
              <header>
                <CalendarDays size={18} />
                <span>{post.date}</span>
                <strong>{post.status}</strong>
              </header>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <a href={post.sourceUrl} target="_blank" rel="noreferrer">
                <span>{t.activitiesPage.sourceLabel}</span>
                <ExternalLink size={14} />
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
