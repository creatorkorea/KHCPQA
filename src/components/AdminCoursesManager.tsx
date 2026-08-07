"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CheckCircle2, FilePenLine, Save, Search, Trash2 } from "lucide-react";
import {
  deleteAdminManagedItem,
  saveAdminContent,
  type DeleteAdminContentResult,
  type SaveAdminContentResult
} from "@/app/admin/actions";
import { AdminStatusBadge, getTone } from "@/components/AdminConsole";
import {
  adminCourseLocales,
  adminCourseSections,
  adminCourseStatuses,
  buildAdminCourseContentInput,
  getAdminCourseManagedSlug,
  getAdminCourseSectionHelp,
  getAdminCourseSectionLabel,
  getAdminCourseStatusLabel,
  type AdminCourseOption
} from "@/lib/admin-courses";
import type { AdminContentRow } from "@/lib/admin-data";

type ActionResult = SaveAdminContentResult | DeleteAdminContentResult;

type CourseEditorValue = {
  body: string;
  imageUrl: string;
  sourceUrl: string;
  status: string;
  summary: string;
  title: string;
};

const emptyEditor: CourseEditorValue = {
  body: "",
  imageUrl: "",
  sourceUrl: "",
  status: "draft",
  summary: "",
  title: ""
};

export function AdminCoursesManager({
  courseOptions,
  items
}: {
  courseOptions: AdminCourseOption[];
  items: AdminContentRow[];
}) {
  const router = useRouter();
  const [activeCourseSlug, setActiveCourseSlug] = useState(courseOptions[0]?.slug ?? "");
  const [activeLocale, setActiveLocale] = useState("ko");
  const [activeSection, setActiveSection] = useState("main");
  const [editor, setEditor] = useState<CourseEditorValue>(emptyEditor);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const activeCourse = courseOptions.find((course) => course.slug === activeCourseSlug) ?? courseOptions[0] ?? null;
  const activeItem = items.find((item) => item.locale === activeLocale && item.slug === getAdminCourseManagedSlug(activeCourseSlug, activeSection));
  const selectedCourseItems = items.filter((item) => item.slug === activeCourseSlug || item.slug?.startsWith(`${activeCourseSlug}-`));
  const currentLocaleItems = selectedCourseItems.filter((item) => item.locale === activeLocale);
  const publishedCount = items.filter((item) => item.status === "published").length;
  const draftCount = items.filter((item) => item.status === "draft").length;
  const filteredCourses = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return courseOptions;
    }

    return courseOptions.filter((course) =>
      course.label.toLowerCase().includes(keyword) ||
      course.slug.toLowerCase().includes(keyword) ||
      course.category.toLowerCase().includes(keyword)
    );
  }, [courseOptions, search]);

  useEffect(() => {
    if (!activeCourse) {
      setEditor(emptyEditor);
      return;
    }

    setEditor({
      body: activeItem?.body ?? (activeSection === "main" ? activeCourse.summary : ""),
      imageUrl: activeItem?.imageUrl ?? "",
      sourceUrl: activeItem?.sourceUrl ?? "",
      status: activeItem?.status ?? "draft",
      summary: activeItem?.summary ?? (activeSection === "main" ? activeCourse.summary : ""),
      title: activeItem?.title ?? (activeSection === "main" ? activeCourse.label : getAdminCourseSectionLabel(activeSection))
    });
    setResult(null);
  }, [activeCourse, activeItem, activeSection]);

  function selectCourse(courseSlug: string) {
    setActiveCourseSlug(courseSlug);
    setActiveSection("main");
  }

  function updateEditor(name: keyof CourseEditorValue, value: string) {
    setEditor((current) => ({ ...current, [name]: value }));
    setResult(null);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = buildAdminCourseContentInput({
      ...editor,
      courseSection: activeSection,
      courseSlug: activeCourseSlug,
      locale: activeLocale
    });

    if (!validation.ok) {
      setResult(validation);
      return;
    }

    startTransition(async () => {
      const nextResult = await saveAdminContent(validation.payload);
      setResult(nextResult);

      if (nextResult.ok) {
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!activeItem?.id) {
      return;
    }

    const confirmed = window.confirm(`"${activeItem.title}" 과정 섹션을 삭제할까요? 공개 화면은 기본 콘텐츠로 돌아갑니다.`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const nextResult = await deleteAdminManagedItem({
        id: activeItem.id ?? "",
        itemType: "content"
      });
      setResult(nextResult);

      if (nextResult.ok) {
        router.refresh();
      }
    });
  }

  return (
    <div className="admin-courses-manager">
      <section className="admin-courses-overview" aria-label="과정 CMS 요약">
        <span><strong>{courseOptions.length}</strong>기본 과정</span>
        <span><strong>{items.length}</strong>관리 항목</span>
        <span><strong>{publishedCount}</strong>공개</span>
        <span><strong>{draftCount}</strong>임시저장</span>
      </section>

      <div className="admin-courses-workspace">
        <aside className="admin-courses-list-panel">
          <label className="admin-courses-search">
            <Search size={15} />
            <span className="sr-only">과정 검색</span>
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="과정명, slug, 분류 검색"
              value={search}
            />
          </label>
          <div className="admin-courses-list" role="listbox" aria-label="과정 선택">
            {filteredCourses.map((course) => {
              const courseItems = items.filter((item) => item.slug === course.slug || item.slug?.startsWith(`${course.slug}-`));
              const isActive = course.slug === activeCourseSlug;

              return (
                <button
                  aria-selected={isActive}
                  className={isActive ? "is-active" : undefined}
                  key={course.slug}
                  onClick={() => selectCourse(course.slug)}
                  role="option"
                  type="button"
                >
                  <strong>{course.label}</strong>
                  <span>{course.category} · {course.slug}</span>
                  <em>{courseItems.length}개 관리 항목</em>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="admin-courses-detail-panel">
          <div className="admin-courses-heading">
            <div>
              <span>COURSE CMS</span>
              <h2>{activeCourse?.label ?? "과정 선택"}</h2>
              <p>{activeCourse?.summary ?? "관리할 과정을 선택해 주세요."}</p>
            </div>
            {activeCourse ? (
              <Link className="secondary-button" href={`/${activeLocale}/curriculum/${activeCourse.slug}`} target="_blank">
                공개 페이지
                <ArrowUpRight size={15} />
              </Link>
            ) : null}
          </div>

          <div className="admin-courses-controls">
            <label>
              언어
              <select onChange={(event) => setActiveLocale(event.target.value)} value={activeLocale}>
                {adminCourseLocales.map((locale) => (
                  <option key={locale} value={locale}>{locale.toUpperCase()}</option>
                ))}
              </select>
            </label>
            <span>{activeLocale.toUpperCase()} 관리 항목 {currentLocaleItems.length}개</span>
          </div>

          <div className="admin-courses-section-grid">
            {adminCourseSections.map((section) => {
              const sectionSlug = getAdminCourseManagedSlug(activeCourseSlug, section);
              const item = items.find((candidate) => candidate.locale === activeLocale && candidate.slug === sectionSlug);
              const isActive = section === activeSection;

              return (
                <button
                  className={isActive ? "is-active" : undefined}
                  key={section}
                  onClick={() => setActiveSection(section)}
                  type="button"
                >
                  <FilePenLine size={15} />
                  <span>
                    <strong>{getAdminCourseSectionLabel(section)}</strong>
                    <small>{sectionSlug || section}</small>
                  </span>
                  <AdminStatusBadge tone={getTone(item?.status ?? "draft")}>
                    {item ? getAdminCourseStatusLabel(item.status) : "기본값"}
                  </AdminStatusBadge>
                </button>
              );
            })}
          </div>

          <form className="admin-courses-editor" onSubmit={handleSave}>
            <div className="admin-courses-editor-heading">
              <div>
                <strong>{getAdminCourseSectionLabel(activeSection)}</strong>
                <p>{getAdminCourseSectionHelp(activeSection)}</p>
              </div>
              <AdminStatusBadge tone={getTone(editor.status)}>{getAdminCourseStatusLabel(editor.status)}</AdminStatusBadge>
            </div>

            <div className="admin-editor-grid">
              <label>
                게시 상태
                <select onChange={(event) => updateEditor("status", event.target.value)} value={editor.status}>
                  {adminCourseStatuses.map((status) => (
                    <option key={status} value={status}>{getAdminCourseStatusLabel(status)}</option>
                  ))}
                </select>
              </label>
              <label>
                대표 이미지 URL
                <input
                  onChange={(event) => updateEditor("imageUrl", event.target.value)}
                  placeholder="/assets/course-image.jpg 또는 https://..."
                  value={editor.imageUrl}
                />
              </label>
              <label className="full">
                제목
                <input
                  onChange={(event) => updateEditor("title", event.target.value)}
                  placeholder="공개 화면에 표시할 제목"
                  required
                  value={editor.title}
                />
              </label>
              <label className="full">
                요약
                <textarea
                  onChange={(event) => updateEditor("summary", event.target.value)}
                  placeholder={activeSection === "main" ? "과정 목록 카드와 상세 히어로에 표시됩니다." : "섹션 보조 설명으로 사용됩니다."}
                  rows={3}
                  value={editor.summary}
                />
              </label>
              <label className="full">
                상세 본문
                <textarea
                  onChange={(event) => updateEditor("body", event.target.value)}
                  placeholder={activeSection === "main" ? "상세 히어로와 개요 문단에 표시됩니다." : "줄바꿈으로 여러 항목을 입력하세요."}
                  rows={6}
                  value={editor.body}
                />
              </label>
              <label className="full">
                원본 URL
                <input
                  onChange={(event) => updateEditor("sourceUrl", event.target.value)}
                  placeholder="참고 링크 또는 원본 과정 URL"
                  value={editor.sourceUrl}
                />
              </label>
            </div>

            {result ? (
              <div className={result.ok ? "form-success" : "form-error full"} role="status">
                {result.ok ? <CheckCircle2 size={20} /> : null}
                <span>{result.message}</span>
              </div>
            ) : null}

            <div className="admin-editor-actions">
              <button className="primary-button" disabled={isPending || !activeCourseSlug} type="submit">
                <Save size={16} />
                <span>{isPending ? "저장 중" : activeItem ? "섹션 수정" : "섹션 저장"}</span>
              </button>
              {activeItem?.id ? (
                <button className="secondary-button danger" disabled={isPending} onClick={handleDelete} type="button">
                  <Trash2 size={16} />
                  <span>섹션 삭제</span>
                </button>
              ) : null}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
