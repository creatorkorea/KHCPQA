import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, BookOpenCheck, CheckCircle2, Clock3, Download, ExternalLink, FileText, Users } from "lucide-react";
import { getCopy, locales, type Locale } from "@/lib/content";
import { getPublishedCourseBySlug, getPublishedCourses } from "@/lib/course-repository";
import { buildLocaleMetadata } from "@/lib/seo";
import { getPublishedLocalesForPath } from "@/lib/translation-availability";

const labels = {
  ko: {
    audience: "추천 대상",
    certification: "수료·자격 안내",
    curriculum: "핵심 교육 내용",
    document: "교육과정 PDF 자료",
    documentLead: "세부 교안과 일정은 첨부된 PDF에서 확인할 수 있습니다.",
    download: "다운로드",
    duration: "교육 기간",
    overview: "과정 개요",
    updated: "최종 수정",
    view: "자료 보기"
  },
  en: {
    audience: "Recommended For",
    certification: "Completion & Certification",
    curriculum: "Core Curriculum",
    document: "Course PDF",
    documentLead: "View the attached PDF for detailed materials and schedules.",
    download: "Download",
    duration: "Duration",
    overview: "Course Overview",
    updated: "Updated",
    view: "View PDF"
  },
  es: {
    audience: "Recomendado Para",
    certification: "Finalización y Certificación",
    curriculum: "Contenido Principal",
    document: "PDF del Curso",
    documentLead: "Consulta el PDF adjunto para materiales y horarios detallados.",
    download: "Descargar",
    duration: "Duración",
    overview: "Resumen del Curso",
    updated: "Actualizado",
    view: "Ver PDF"
  },
  "zh-CN": {
    audience: "推荐对象",
    certification: "结业与资格说明",
    curriculum: "核心课程内容",
    document: "课程 PDF 资料",
    documentLead: "详细教材与日程请查看附件 PDF。",
    download: "下载",
    duration: "培训周期",
    overview: "课程简介",
    updated: "最后更新",
    view: "查看 PDF"
  }
} as const;

export async function generateStaticParams() {
  const byLocale = await Promise.all(
    locales.map(async (locale) => {
      const courses = await getPublishedCourses(locale);
      return courses.map((course) => ({ locale, courseSlug: course.slug }));
    })
  );
  return byLocale.flat();
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; courseSlug: string }> }) {
  const { locale, courseSlug } = await params;
  const decodedSlug = decodeURIComponent(courseSlug);
  const [course, availableLocales] = await Promise.all([
    getPublishedCourseBySlug(decodedSlug, locale),
    getPublishedLocalesForPath(`/${locale}/curriculum/${decodedSlug}`)
  ]);
  if (!course) return {};

  return buildLocaleMetadata({
    locale,
    path: `curriculum/${decodedSlug}`,
    title: `${course.title} | KAHC`,
    description: course.summary,
    availableLocales
  });
}

export default async function CourseDetailPage({ params }: { params: Promise<{ locale: Locale; courseSlug: string }> }) {
  const { locale, courseSlug } = await params;
  const course = await getPublishedCourseBySlug(decodeURIComponent(courseSlug), locale);
  if (!course) notFound();

  const t = getCopy(locale);
  const copy = labels[locale];
  const imageUrl = course.imageUrl || "/assets/premium-course-facial-contouring.png";
  const updatedAt = course.updatedAt
    ? new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : locale === "es" ? "es-ES" : "en-US", { dateStyle: "medium" }).format(new Date(course.updatedAt))
    : "";

  return (
    <article className="course-hybrid-detail">
      <section className="course-hybrid-hero">
        <div className="course-hybrid-hero-media">
          <Image alt={course.title} fill priority sizes="(max-width: 860px) 100vw, 48vw" src={imageUrl} unoptimized />
        </div>
        <div className="course-hybrid-hero-copy">
          <span>{course.category}</span>
          <h1>{course.title}</h1>
          <p>{course.summary}</p>
          {course.duration ? <div><Clock3 size={18} /><strong>{copy.duration}</strong><span>{course.duration}</span></div> : null}
          <Link className="primary-button" href={`/${locale}/partner-inquiry`}>{t.courseDetail.inquiryCta}<ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="course-hybrid-overview">
        <div className="course-hybrid-section-heading"><BookOpenCheck size={24} /><h2>{copy.overview}</h2></div>
        <p>{course.overview}</p>
      </section>

      <div className="course-hybrid-info-grid">
        <section className="course-hybrid-curriculum">
          <div className="course-hybrid-section-heading"><CheckCircle2 size={24} /><h2>{copy.curriculum}</h2></div>
          <ul>{course.curriculumItems.map((item) => <li key={item}><CheckCircle2 size={17} /><span>{item}</span></li>)}</ul>
        </section>
        <section className="course-hybrid-audience">
          <div className="course-hybrid-section-heading"><Users size={24} /><h2>{copy.audience}</h2></div>
          <ul>{course.recommendedFor.map((item) => <li key={item}><Users size={17} /><span>{item}</span></li>)}</ul>
        </section>
      </div>

      {course.certificationNote ? (
        <section className="course-hybrid-certification">
          <BadgeCheck size={30} />
          <div><h2>{copy.certification}</h2><p>{course.certificationNote}</p></div>
        </section>
      ) : null}

      {course.pdfUrl ? (
        <section className="course-hybrid-document">
          <div className="course-hybrid-document-icon"><FileText size={32} /></div>
          <div>
            <h2>{copy.document}</h2>
            <p>{copy.documentLead}</p>
            <span>{course.pdfFileName || copy.document}{updatedAt ? ` · ${copy.updated} ${updatedAt}` : ""}</span>
          </div>
          <div className="course-hybrid-document-actions">
            <a className="primary-button" href={course.pdfUrl} rel="noreferrer" target="_blank"><ExternalLink size={17} />{copy.view}</a>
            <a className="secondary-button" download={course.pdfFileName || true} href={course.pdfUrl}><Download size={17} />{copy.download}</a>
          </div>
        </section>
      ) : null}

      <section className="course-hybrid-cta">
        <div><span>KAHC</span><h2>{course.title}</h2><p>{course.summary}</p></div>
        <Link href={`/${locale}/partner-inquiry`}>{t.courseDetail.inquiryCta}<ArrowRight size={18} /></Link>
      </section>
    </article>
  );
}
