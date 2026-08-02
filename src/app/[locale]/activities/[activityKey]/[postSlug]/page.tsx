import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
import {
  getActivityGroupByKey,
  getActivityPosts,
  type Locale
} from "@/lib/content";
import { getPublishedActivityPost, incrementPublishedActivityPostViewCount } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale; activityKey: string; postSlug: string }>;
}) {
  const { locale, activityKey, postSlug } = await params;
  const activity = getActivityGroupByKey(locale, activityKey);
  const fallback = getActivityPosts(locale, activityKey).find((post) => post.slug === postSlug);
  const post = await getPublishedActivityPost({ fallback, locale, slug: postSlug });

  if (!activity || !post) {
    return {};
  }

  return buildLocaleMetadata({
    description: post.body,
    locale,
    path: `activities/${activityKey}/${postSlug}`,
    title: `${post.title} | ${activity.title} | KHCPQA`
  });
}

export default async function ActivityPostDetailPage({
  params
}: {
  params: Promise<{ locale: Locale; activityKey: string; postSlug: string }>;
}) {
  const { locale, activityKey, postSlug } = await params;
  const activity = getActivityGroupByKey(locale, activityKey);

  if (!activity) {
    notFound();
  }

  const fallback = getActivityPosts(locale, activityKey).find((post) => post.slug === postSlug);
  const post = await getPublishedActivityPost({ fallback, locale, slug: postSlug });

  if (!post) {
    notFound();
  }

  await incrementPublishedActivityPostViewCount({ locale, slug: post.slug });

  const imageUrl = post.imageUrl;
  const bodyLines = post.body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <PageIntro eyebrow={activity.title} title={post.title} lead={post.body} />
      <section className="activity-post-detail-section">
        <Link className="activity-back-link" href={`/${locale}/activities/${activityKey}`}>
          <ArrowLeft size={16} />
          <span>{activity.title}</span>
        </Link>
        <article className="activity-post-detail-card">
          {imageUrl ? <Image src={imageUrl} alt={post.title} width={1180} height={640} unoptimized /> : null}
          <div>
            <p className="activity-post-date">
              <CalendarDays size={18} />
              <span>{post.date}</span>
            </p>
            <h2>{post.title}</h2>
            <div className="activity-post-body">
              {bodyLines.length > 0 ? (
                bodyLines.map((line) => <p key={line}>{line}</p>)
              ) : (
                <p>등록된 상세 본문이 없습니다.</p>
              )}
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
