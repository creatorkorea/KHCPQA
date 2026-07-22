import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/SiteShell";
import { getActivityGroups, getCopy, type Locale } from "@/lib/content";
import { getPublishedContentIntro, getPublishedContentMap } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";

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

  return (
    <>
      <PageIntro
        eyebrow={t.activitiesPage.eyebrow}
        title={intro.title}
        lead={intro.lead}
      />
      <section className="content-section">
        <div className="activity-grid large">
          {activityGroups.map((activity) => {
            const Icon = activity.icon;
            const content = activityContent.get(activity.key);
            const title = content?.title || activity.title;
            const summary = content?.lead || activity.summary;
            const imageUrl = content?.imageUrl || activity.imageUrl;
            return (
              <article className="activity-card" key={activity.key}>
                <Image
                  src={imageUrl}
                  alt={title}
                  width={640}
                  height={400}
                  unoptimized
                />
                <div>
                  <Icon size={24} />
                  <h3>{title}</h3>
                  <p>{summary}</p>
                  <small>{activity.source}</small>
                  <Link href={`/${locale}/activities/${activity.key}`}>
                    {t.activitiesPage.detailCta}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
