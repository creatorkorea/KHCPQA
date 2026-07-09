import Image from "next/image";
import { PageIntro } from "@/components/SiteShell";
import { getActivityGroups, getCopy, type Locale } from "@/lib/content";
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

  return (
    <>
      <PageIntro
        eyebrow={t.activitiesPage.eyebrow}
        title={t.activitiesTitle}
        lead={t.activitiesPage.lead}
      />
      <section className="content-section">
        <div className="activity-grid large">
          {activityGroups.map((activity) => {
            const Icon = activity.icon;
            return (
              <article className="activity-card" key={activity.key}>
                <Image
                  src={activity.imageUrl}
                  alt={activity.title}
                  width={640}
                  height={400}
                  unoptimized
                />
                <div>
                  <Icon size={24} />
                  <h3>{activity.title}</h3>
                  <p>{activity.summary}</p>
                  <small>{activity.source}</small>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
