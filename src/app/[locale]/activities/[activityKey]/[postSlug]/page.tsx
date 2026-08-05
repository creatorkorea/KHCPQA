import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ArrowLeft, CalendarDays, Eye, List, UserRound } from "lucide-react";
import {
  getActivityGroupByKey,
  getActivityPosts,
  type Locale
} from "@/lib/content";
import { getPublishedActivityPost, incrementPublishedActivityPostViewCount } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

const postDetailCopy: Record<Locale, {
  authorLabel: string;
  dateLabel: string;
  heroLead: string;
  heroTitle: string;
  listLabel: string;
  viewsLabel: string;
}> = {
  ko: {
    authorLabel: "작성자",
    dateLabel: "작성일",
    heroLead: "게시글의 작성자, 작성일, 조회수와 상세 내용을 확인합니다.",
    heroTitle: "게시글 상세",
    listLabel: "목록으로",
    viewsLabel: "조회수"
  },
  en: {
    authorLabel: "Author",
    dateLabel: "Date",
    heroLead: "Review the author, date, view count, and full post details.",
    heroTitle: "Post Detail",
    listLabel: "Back to List",
    viewsLabel: "Views"
  },
  es: {
    authorLabel: "Autor",
    dateLabel: "Fecha",
    heroLead: "Consulta el autor, la fecha, las vistas y el detalle completo de la publicación.",
    heroTitle: "Detalle de Publicación",
    listLabel: "Volver a la Lista",
    viewsLabel: "Vistas"
  }
};

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

  const didIncrementViewCount = await incrementPublishedActivityPostViewCount({ locale, slug: post.slug });

  const imageUrl = post.imageUrl;
  const copy = postDetailCopy[locale];
  const displayedViewCount = post.viewCount + (didIncrementViewCount ? 1 : 0);
  const postIntroStyle = {
    "--activity-post-hero-image": `url("${(imageUrl || activity.imageUrl).replace(/"/g, "%22")}")`
  } as CSSProperties;
  const bodyLines = post.body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <section className="page-intro activity-post-intro" style={postIntroStyle}>
        <span className="eyebrow">{activity.title}</span>
        <h1>{copy.heroTitle}</h1>
        <p>{copy.heroLead}</p>
      </section>
      <section className="activity-post-detail-section">
        <Link className="activity-back-link" href={`/${locale}/activities/${activityKey}`}>
          <ArrowLeft size={16} />
          <span>{activity.title}</span>
        </Link>
        <article className="activity-post-detail-card">
          {imageUrl ? <Image src={imageUrl} alt={post.title} width={1180} height={640} unoptimized /> : null}
          <div className="activity-post-content">
            <header className="activity-post-header">
              <span>{activity.title}</span>
              <h2>{post.title}</h2>
            </header>
            <dl className="activity-post-meta">
              <div>
                <dt>
                  <UserRound size={16} />
                  <span>{copy.authorLabel}</span>
                </dt>
                <dd>{post.author}</dd>
              </div>
              <div>
                <dt>
                  <CalendarDays size={16} />
                  <span>{copy.dateLabel}</span>
                </dt>
                <dd>{post.date}</dd>
              </div>
              <div>
                <dt>
                  <Eye size={16} />
                  <span>{copy.viewsLabel}</span>
                </dt>
                <dd>{displayedViewCount.toLocaleString()}</dd>
              </div>
            </dl>
            <div className="activity-post-body">
              {bodyLines.length > 0 ? (
                bodyLines.map((line) => <p key={line}>{line}</p>)
              ) : (
                <p>등록된 상세 본문이 없습니다.</p>
              )}
            </div>
            <div className="activity-post-actions">
              <Link href={`/${locale}/activities/${activityKey}`}>
                <List size={17} />
                <span>{copy.listLabel}</span>
              </Link>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
