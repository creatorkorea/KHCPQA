import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  HandHeart,
  Layers3,
  Sparkles,
  Target,
  Users
} from "lucide-react";
import { getCopy, getCourseBySlug, getCourseSlugs, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

const processImages = [
  "/assets/premium-course-facial-contouring.png",
  "/assets/course-facial-contouring.jpg",
  "/assets/premium-course-medical-skincare.png",
  "/assets/premium-course-meridian.png",
  "/assets/premium-course-foot.png",
  "/assets/premium-course-maternity.png",
  "/assets/course-generated-medical-skincare.png",
  "/assets/course-thumb-massage-training.png",
  "/assets/course-generated-aromatherapy.png",
  "/assets/course-thumb-business-planning.png"
];

const galleryImages = [
  "/assets/premium-course-facial-contouring.png",
  "/assets/course-facial-contouring.jpg",
  "/assets/premium-course-medical-skincare.png",
  "/assets/course-medical-skincare-detail.jpg",
  "/assets/premium-course-meridian.png",
  "/assets/premium-course-swedish.png",
  "/assets/premium-course-foot.png",
  "/assets/course-generated-aromatherapy.png"
];

function takeUnique(items: string[], fallback: string[], count: number) {
  const merged = [...items, ...fallback].filter(Boolean);
  return Array.from(new Set(merged)).slice(0, count);
}

function splitAudience(audience: string) {
  return audience
    .split(/,|·|및|또는/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export function generateStaticParams() {
  return getCourseSlugs().flatMap((courseSlug) => [
    { locale: "ko", courseSlug },
    { locale: "en", courseSlug },
    { locale: "es", courseSlug }
  ]);
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale; courseSlug: string }>;
}) {
  const { locale, courseSlug } = await params;
  const decodedSlug = decodeURIComponent(courseSlug);
  const course = getCourseBySlug(decodedSlug, locale);

  if (!course) {
    return {};
  }

  return buildLocaleMetadata({
    locale,
    path: `curriculum/${decodedSlug}`,
    title: `${course.title} | KHCPQA`,
    description: course.summary
  });
}

export default async function CourseDetailPage({
  params
}: {
  params: Promise<{ locale: Locale; courseSlug: string }>;
}) {
  const { locale, courseSlug } = await params;
  const t = getCopy(locale);
  const course = getCourseBySlug(decodeURIComponent(courseSlug), locale);

  if (!course) {
    notFound();
  }

  const sections = course.detailSections ?? [];
  const allSectionItems = sections.flatMap((section) => section.items);
  const metricItems = course.keyMetrics?.length
    ? course.keyMetrics
    : [
        { label: locale === "ko" ? "과정 유형" : "Program Type", value: course.category },
        { label: locale === "ko" ? "교육 기간" : "Duration", value: course.durationHighlights?.[0] ?? (locale === "ko" ? "상담 후 안내" : "Advised") },
        { label: locale === "ko" ? "수업 방식" : "Learning", value: locale === "ko" ? "이론 + 실습" : "Theory + Practice" }
      ];
  const overviewPoints = takeUnique(course.curriculum, allSectionItems, 4);
  const curriculumFlow = takeUnique(course.curriculum, allSectionItems, 4);
  const goalItems = takeUnique(sections[0]?.items ?? [], course.curriculum, 4);
  const strengthItems = takeUnique(sections[1]?.items ?? [], [...allSectionItems, ...course.curriculum], 4);
  const techniqueItems = takeUnique(
    sections.find((section) => section.variant === "chips")?.items ?? [],
    [...allSectionItems, ...course.curriculum],
    8
  );
  const processItems = takeUnique(allSectionItems, course.curriculum, 10);
  const audienceItems = splitAudience(course.audience);
  const careerItems = [
    locale === "ko" ? "전문 샵 취업" : "Professional salon employment",
    locale === "ko" ? "1인 창업" : "One-person startup",
    locale === "ko" ? "스파 & 호텔 취업" : "Spa & hotel employment",
    locale === "ko" ? "뷰티 프리랜서" : "Beauty freelancer",
    locale === "ko" ? "추가 심화 연계" : "Advanced course pathway"
  ];

  return (
    <article className="course-detail course-landing">
      <section className="course-landing-hero">
        <div className="course-landing-copy">
          <span className="eyebrow">{course.summary}</span>
          <h1>{course.title}</h1>
          <p>{course.overview}</p>
          <dl className="course-landing-metrics">
            {metricItems.slice(0, 3).map((metric, index) => {
              const MetricIcon = [Sparkles, CalendarDays, Layers3][index] ?? Sparkles;
              return (
                <div key={`${metric.label}-${metric.value}`}>
                  <MetricIcon size={28} strokeWidth={1.55} />
                  <span>
                    <dt>{metric.label}</dt>
                    <dd>{metric.value}</dd>
                  </span>
                </div>
              );
            })}
          </dl>
        </div>
        <div className="course-landing-media">
          <Image src={course.imageUrl} alt={course.title} width={960} height={620} priority />
        </div>
      </section>

      <section className="course-landing-feature-band">
        {[
          [Target, locale === "ko" ? "1:1 소수정예 맞춤 피드백" : "Focused feedback"],
          [CheckCircle2, locale === "ko" ? "실습 중심 교육 현장감 있는 수업" : "Practice-centered training"],
          [Users, locale === "ko" ? "전문 강사진 현업 경험 보유" : "Experienced instructors"],
          [Award, locale === "ko" ? "자격취득 지원 수료증 & 시험 안내" : "Completion guidance"]
        ].map(([Icon, label]) => {
          const FeatureIcon = Icon as typeof Target;
          return (
            <div key={label as string}>
              <FeatureIcon size={34} strokeWidth={1.45} />
              <span>{label as string}</span>
            </div>
          );
        })}
      </section>

      <section className="course-landing-overview">
        <div className="course-face-line" aria-hidden="true" />
        <div>
          <span className="eyebrow">{t.courseDetail.overviewEyebrow}</span>
          <h2>{t.courseDetail.overviewTitle}</h2>
          <p>{course.overview}</p>
        </div>
        <ul>
          {overviewPoints.map((item) => (
            <li key={item}>
              <CheckCircle2 size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="course-curriculum-flow">
        <h2>{t.courseDetail.curriculumTitle}</h2>
        <div>
          {curriculumFlow.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item}</h3>
              <p>{takeUnique(sections[index]?.items ?? [], [course.summary], 3).join(" · ")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="course-info-panels">
        <article>
          <h2>{locale === "ko" ? "교육 목표" : "Learning Goals"}</h2>
          <ul>
            {goalItems.map((item) => (
              <li key={item}><CheckCircle2 size={17} />{item}</li>
            ))}
          </ul>
        </article>
        <article className="featured">
          <h2>{locale === "ko" ? "이 과정의 특징" : "Program Strengths"}</h2>
          <ul>
            {strengthItems.map((item) => (
              <li key={item}><Layers3 size={17} />{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h2>{locale === "ko" ? "이런 분께 추천해요!" : "Recommended For"}</h2>
          <ul>
            {audienceItems.map((item) => (
              <li key={item}><BadgeCheck size={17} />{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="course-technique-band">
        <div>
          <h2>{locale === "ko" ? "핵심 테크닉 한눈에 보기" : "Core Techniques"}</h2>
          <div>
            {techniqueItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <Image src={course.imageUrl} alt="" width={460} height={220} />
      </section>

      <section className="course-process-section">
        <h2>{locale === "ko" ? "관리 순서 (수업 프로세스)" : "Class Process"}</h2>
        <div>
          {processItems.map((item, index) => (
            <article key={`${item}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Image src={processImages[index % processImages.length]} alt="" width={240} height={150} />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="course-career-cert">
        <article>
          <h2>{locale === "ko" ? "수료 후 진로 및 활용" : "After Completion"}</h2>
          <div>
            {careerItems.map((item, index) => {
              const Icon = [BriefcaseBusiness, HandHeart, BookOpenCheck, Users, ClipboardCheck][index] ?? BriefcaseBusiness;
              return (
                <span key={item}>
                  <Icon size={30} strokeWidth={1.4} />
                  {item}
                </span>
              );
            })}
          </div>
        </article>
        <article>
          <h2>{isProfessional(course.categoryKey) ? t.courseDetail.goalOutcomeTitle : t.courseDetail.certificationTitle}</h2>
          <p>{course.certificationNote}</p>
          <div className="certificate-card" aria-hidden="true">
            <BadgeCheck size={42} />
            <strong>KHCPQA</strong>
          </div>
        </article>
      </section>

      <section className="course-gallery-section">
        <h2>{locale === "ko" ? "수업 장면 & 결과 예시" : "Class Scenes & Examples"}</h2>
        <div>
          {galleryImages.map((image, index) => (
            <Image src={index === 0 ? course.imageUrl : image} alt="" width={260} height={150} key={`${image}-${index}`} />
          ))}
        </div>
      </section>

      <section className="course-landing-cta">
        <div>
          <span>{locale === "ko" ? "전문 테크닉으로 완성하는" : "Build professional technique"}</span>
          <h2>{course.title}</h2>
          <p>{course.summary}</p>
        </div>
        <Link href={`/${locale}/partner-inquiry`}>
          {t.courseDetail.inquiryCta} <ArrowRight size={18} />
        </Link>
        <Image src={course.imageUrl} alt="" width={520} height={260} />
      </section>
    </article>
  );
}

function isProfessional(categoryKey: string) {
  return categoryKey === "professional";
}
