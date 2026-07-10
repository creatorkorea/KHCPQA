"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Search, Sparkles } from "lucide-react";
import { getCopy, type Course, type CourseCategory, type Locale } from "@/lib/content";

const categories: CourseCategory[] = ["all", "certification", "professional", "practical"];

export function CurriculumCatalog({
  courses,
  locale
}: {
  courses: Course[];
  locale: Locale;
}) {
  const t = getCopy(locale).curriculumCatalog;
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<CourseCategory>("all");

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = category === "all" || course.categoryKey === category;
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      normalizedQuery.length === 0 ||
      `${course.title} ${course.category} ${course.summary}`.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
  const goalCourses = filteredCourses.filter((course) => course.categoryKey === "professional");
  const catalogCourses = filteredCourses.filter((course) => course.categoryKey !== "professional");
  const activeCategoryLabel = t.categories[category];

  return (
    <div className="catalog-layout">
      <aside className="catalog-rail">
        <span>{t.categoryLabel}</span>
        <div className="catalog-rail-pills" aria-label={t.categoryLabel}>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={item === category ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {t.categories[item]}
            </button>
          ))}
        </div>
      </aside>

      <div className="catalog-main">
        <div className="toolbar curriculum-toolbar">
          <label className="search-box" aria-label={t.searchLabel}>
            <Search size={18} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchPlaceholder}
            />
          </label>
          <div className="catalog-result-summary" aria-live="polite">
            <span>{activeCategoryLabel}</span>
            <strong>{filteredCourses.length}</strong>
            <small>/ {courses.length} {locale === "ko" ? "과정" : "courses"}</small>
          </div>
        </div>

        {goalCourses.length > 0 ? (
          <section className="goal-course-section">
            <div className="catalog-heading">
              <h2>{t.goalTitle}</h2>
              <p>{t.goalLead}</p>
            </div>
            <div className="goal-course-grid">
              {goalCourses.map((course) => (
                <article className="goal-course-card" key={course.title}>
                  <span>{course.category}</span>
                  <div>
                    <h3>{course.title}</h3>
                    <p>{course.summary}</p>
                  </div>
                  <Link className="card-link" href={`/${locale}/curriculum/${course.slug}`}>
                    {t.viewDetails} <ArrowRight size={14} />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {catalogCourses.length > 0 ? (
          <section className="program-course-section">
            <div className="catalog-heading">
              <h2>{t.catalogTitle}</h2>
              <p>{t.catalogLead}</p>
            </div>
            <div className="course-grid">
              {catalogCourses.map((course) => (
                <article className="course-card" key={course.title}>
                  <Image src={course.imageUrl} alt={course.title} width={640} height={320} />
                  <div className="course-card-body">
                    <span>{course.category}</span>
                    <h3>{course.title}</h3>
                    <p>{course.summary}</p>
                  </div>
                  <Link className="card-link" href={`/${locale}/curriculum/${course.slug}`}>
                    {t.viewDetails} <ArrowRight size={14} />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {filteredCourses.length === 0 ? (
          <p className="empty-state">{t.emptyState}</p>
        ) : null}

        <section className="catalog-consult-cta" aria-label={locale === "ko" ? "과정 상담 안내" : "Program consultation"}>
          <div>
            <Sparkles size={22} />
            <h2>{locale === "ko" ? "어떤 과정을 선택해야 할지 고민되시나요?" : "Need help choosing a program?"}</h2>
            <p>
              {locale === "ko"
                ? "목표와 현재 역량에 맞춰 취업, 창업, 주말 학습 과정을 함께 설계해 드립니다."
                : "We help match your goals and current skills with the right employment, startup, or weekend learning path."}
            </p>
          </div>
          <Link href={`/${locale}/partner-inquiry`}>
            <MessageCircle size={17} />
            {locale === "ko" ? "맞춤 상담 신청" : "Request advising"}
            <ArrowRight size={15} />
          </Link>
        </section>
      </div>
    </div>
  );
}
