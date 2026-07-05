import { PageIntro } from "@/components/SiteShell";
import { courses, getCopy, type Locale } from "@/lib/content";
import { CurriculumCatalog } from "@/components/CurriculumCatalog";

export default async function CurriculumPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        eyebrow="Curriculum"
        title={t.curriculumTitle}
        lead="기존 SMC365 과정 콘텐츠를 글로벌 교육기관형 과정 카드와 상세 템플릿으로 재구성합니다."
      />
      <section className="content-section">
        <CurriculumCatalog courses={courses} locale={locale} />
      </section>
    </>
  );
}
