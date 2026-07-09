import { PageIntro } from "@/components/SiteShell";
import { getCopy, getCourses, type Locale } from "@/lib/content";
import { CurriculumCatalog } from "@/components/CurriculumCatalog";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "curriculum",
    title: `${t.curriculumTitle} | KHCPQA`,
    description: t.curriculumPage.lead
  });
}

export default async function CurriculumPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const courses = getCourses(locale);

  return (
    <>
      <PageIntro
        eyebrow={t.curriculumPage.eyebrow}
        title={t.curriculumTitle}
        lead={t.curriculumPage.lead}
      />
      <section className="content-section">
        <CurriculumCatalog courses={courses} locale={locale} />
      </section>
    </>
  );
}
