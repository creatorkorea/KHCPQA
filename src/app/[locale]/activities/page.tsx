import Image from "next/image";
import { PageIntro } from "@/components/SiteShell";
import { activityGroups, getCopy, type Locale } from "@/lib/content";

export default async function ActivitiesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        eyebrow="Global Activities"
        title={t.activitiesTitle}
        lead="공지, 합격현황, 갤러리, 수상경력, 국제미용대회, 방송/언론, 봉사활동을 글로벌 신뢰 콘텐츠로 재배치합니다."
      />
      <section className="content-section">
        <div className="activity-grid large">
          {activityGroups.map((activity) => {
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
                  <Icon size={24} />
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
