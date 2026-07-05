"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import type { courses, Locale } from "@/lib/content";

type Course = (typeof courses)[number];

const categories = ["All", "Certification", "Professional Track", "Practical Program"] as const;

export function CurriculumCatalog({
  courses,
  locale
}: {
  courses: Course[];
  locale: Locale;
}) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<(typeof categories)[number]>("All");

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = category === "All" || course.category === category;
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      normalizedQuery.length === 0 ||
      `${course.title} ${course.category} ${course.summary}`.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });

  return (
    <>
      <div className="toolbar curriculum-toolbar">
        <label className="search-box" aria-label="Search curriculum">
          <Search size={18} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses"
          />
        </label>
        <div className="filter-pills" aria-label="Course categories">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={item === category ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="course-grid">
        {filteredCourses.map((course) => (
          <article className="course-card" key={course.title}>
            <Image src={course.imageUrl} alt="" width={640} height={320} />
            <span>{course.category}</span>
            <h3>{course.title}</h3>
            <p>{course.summary}</p>
            <Link className="card-link" href={`/${locale}/curriculum/${course.slug}`}>
              View Details <ArrowRight size={14} />
            </Link>
            <small>{course.source}</small>
          </article>
        ))}
      </div>

      {filteredCourses.length === 0 ? (
        <p className="empty-state">조건에 맞는 과정이 없습니다. 검색어 또는 카테고리를 조정해 주세요.</p>
      ) : null}
    </>
  );
}
