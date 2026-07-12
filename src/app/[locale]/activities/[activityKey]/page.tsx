import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ExternalLink } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
import {
  getActivityGroupByKey,
  getActivityKeys,
  getActivityPosts,
  getCopy,
  type Locale
} from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

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

  const posts = getActivityPosts(locale, activityKey);
  const Icon = activity.icon;

  return (
    <>
      <PageIntro eyebrow={t.activitiesPage.detailEyebrow} title={activity.title} lead={activity.summary} />
      <section className="activity-detail-section">
        <Link className="activity-back-link" href={`/${locale}/activities`}>
          <ArrowLeft size={16} />
          <span>{t.activitiesPage.allActivitiesCta}</span>
        </Link>
        <div className="activity-detail-hero">
          <Image src={activity.imageUrl} alt={activity.title} width={960} height={540} unoptimized />
          <div>
            <Icon size={28} />
            <h2>{activity.title}</h2>
            <p>{activity.summary}</p>
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
        <div className="section-heading">
          <span className="eyebrow">CMS Preview</span>
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
