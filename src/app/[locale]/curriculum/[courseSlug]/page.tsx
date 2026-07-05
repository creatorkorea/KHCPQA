import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, BookOpen, Users } from "lucide-react";
import { courses, getCourseBySlug, type Locale } from "@/lib/content";

export function generateStaticParams() {
  return courses.flatMap((course) => [
    { locale: "ko", courseSlug: course.slug },
    { locale: "en", courseSlug: course.slug },
    { locale: "es", courseSlug: course.slug }
  ]);
}

export default async function CourseDetailPage({
  params
}: {
  params: Promise<{ locale: Locale; courseSlug: string }>;
}) {
  const { locale, courseSlug } = await params;
  const course = getCourseBySlug(decodeURIComponent(courseSlug));

  if (!course) {
    notFound();
  }

  return (
    <article className="course-detail">
      <section className="course-detail-hero">
        <div>
          <span className="eyebrow">{course.category}</span>
          <h1>{course.title}</h1>
          <p>{course.summary}</p>
          <div className="course-detail-actions">
            <Link className="primary-button" href={`/${locale}/partner-inquiry`}>
              문의하기 <ArrowRight size={16} />
            </Link>
            <Link className="secondary-button" href={`/${locale}/curriculum`}>
              전체 과정 보기
            </Link>
          </div>
        </div>
        <Image src={course.imageUrl} alt="" width={960} height={540} priority />
      </section>

      <section className="course-detail-body">
        <div className="course-detail-main">
          <div>
            <span className="eyebrow">Overview</span>
            <h2>과정 개요</h2>
            <p>{course.overview}</p>
          </div>

          <div>
            <span className="eyebrow">Curriculum</span>
            <h2>주요 교육 내용</h2>
            <ul className="detail-list">
              {course.curriculum.map((item) => (
                <li key={item}>
                  <BookOpen size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="course-detail-aside">
          <div>
            <Users size={22} />
            <h3>교육 대상</h3>
            <p>{course.audience}</p>
          </div>
          <div>
            <BadgeCheck size={22} />
            <h3>수료/자격 안내</h3>
            <p>{course.certificationNote}</p>
          </div>
          <div>
            <h3>Source URL</h3>
            <p>{course.source}</p>
          </div>
        </aside>
      </section>
    </article>
  );
}
