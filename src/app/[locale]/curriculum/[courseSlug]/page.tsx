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

const smcContentBaseUrl = "https://www.smc365.ac/images/content";

const originalProcessLabelsByCourseNumber: Record<string, string[]> = {
  "08": [
    "포인트 메이크업 클렌징 배우기",
    "해면 타월 사용 방법 배우기",
    "프로 메뉴얼 테크닉 배우기",
    "프로 얼굴 축소 경락 테라피 배우기",
    "딥 클렌징 스크럽, 효소 사용방법 배우기",
    "마스크 팩 모델링, 석고, 벨벳 배우기",
    "종합 미용기기 사용 방법 배우기",
    "스킨 스크러버 리프팅, 마사지, 딥클렌징 배우기",
    "이온투입기 수분, 미백, 리프팅관리 배우기",
    "초음파 얼굴 축소, 재생, 리프팅관리 배우기",
    "고주파 진정, 세정, 미백관리 배우기"
  ],
  "09": [
    "포인트 메이크업 클렌징 배우기",
    "해면 타월 사용 방법 배우기",
    "프로 메뉴얼 테크닉 배우기",
    "프로 얼굴 축소 경락 테라피 배우기",
    "딥 클렌징 스크럽, 효소 사용방법 배우기",
    "마스크 팩 모델링, 석고, 벨벳 배우기",
    "종합 미용기기 사용 방법 배우기",
    "스킨 스크러버 리프팅, 마사지, 딥클렌징 배우기",
    "이온투입기 수분, 미백, 리프팅관리 배우기",
    "초음파 얼굴 축소, 재생, 리프팅관리 배우기",
    "고주파 진정, 세정, 미백관리 배우기"
  ]
};

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

function getOriginalCourseNumber(source: string) {
  const match = source.match(/curriculum(\d+)\.asp/);
  return match?.[1] ?? "08";
}

function getOriginalCourseImage(source: string, imageName: string) {
  return `${smcContentBaseUrl}/curriculum${getOriginalCourseNumber(source)}_${imageName}`;
}

function getOriginalProcessImages(source: string, count: number) {
  return Array.from({ length: count }, (_, index) =>
    getOriginalCourseImage(source, `img${String(index + 10).padStart(2, "0")}.jpg`)
  );
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
  const originalCourseNumber = getOriginalCourseNumber(course.source);
  const processLabels = originalProcessLabelsByCourseNumber[originalCourseNumber] ?? processItems;
  const originalHeroImage = getOriginalCourseImage(course.source, "img01.jpg");
  const originalSupportImage = getOriginalCourseImage(course.source, "img02.jpg");
  const originalProcessImages = getOriginalProcessImages(course.source, processLabels.length);
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
          <Image src={originalHeroImage} alt={course.title} width={960} height={620} priority />
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
        <Image src={originalSupportImage} alt="" width={460} height={220} />
      </section>

      <section className="course-process-section">
        <h2>{locale === "ko" ? "관리 순서 (수업 프로세스)" : "Class Process"}</h2>
        <div>
          {processLabels.map((item, index) => (
            <article key={`${item}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Image src={originalProcessImages[index]} alt="" width={240} height={150} />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      {sections.length ? (
        <section className="course-original-detail-section">
          <div className="course-section-heading">
            <span className="eyebrow">{locale === "ko" ? "원본 과정 내용" : "Original Course Content"}</span>
            <h2>{locale === "ko" ? "상세 교육 안내" : "Detailed Program Guide"}</h2>
            <p>
              {locale === "ko"
                ? "기존 SMC365 과정 페이지의 주요 교육 내용, 운영 안내, 교육 특징, 진출 분야를 과정별로 정리했습니다."
                : "Key training content, operating guidance, course features, and career fields from the original SMC365 course page."}
            </p>
          </div>
          <div>
            {sections.map((section, index) => (
              <article className={section.variant === "chips" ? "chip-detail" : ""} key={`${section.title}-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{section.title}</h3>
                {section.variant === "chips" ? (
                  <div>
                    {section.items.map((item) => (
                      <em key={item}>{item}</em>
                    ))}
                  </div>
                ) : (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null}

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

      <section className="course-landing-cta">
        <div>
          <span>{locale === "ko" ? "전문 테크닉으로 완성하는" : "Build professional technique"}</span>
          <h2>{course.title}</h2>
          <p>{course.summary}</p>
        </div>
        <Link href={`/${locale}/partner-inquiry`}>
          {t.courseDetail.inquiryCta} <ArrowRight size={18} />
        </Link>
        <Image src={originalHeroImage} alt="" width={520} height={260} />
      </section>
    </article>
  );
}

function isProfessional(categoryKey: string) {
  return categoryKey === "professional";
}
