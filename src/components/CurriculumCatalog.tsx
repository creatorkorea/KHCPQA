"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
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

  return (
    <>
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
        <div className="filter-pills" aria-label={t.categoryLabel}>
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
                <h3>{course.title}</h3>
                <p>{course.summary}</p>
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
                <span>{course.category}</span>
                <h3>{course.title}</h3>
                <p>{course.summary}</p>
                <Link className="card-link" href={`/${locale}/curriculum/${course.slug}`}>
                  {t.viewDetails} <ArrowRight size={14} />
                </Link>
                <small>{course.source}</small>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {filteredCourses.length === 0 ? (
        <p className="empty-state">{t.emptyState}</p>
      ) : null}
    </>
  );
}
