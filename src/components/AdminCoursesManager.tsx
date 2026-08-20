"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, ArrowUpRight, CheckCircle2, FileText, ImagePlus, Plus, RotateCcw, Save, Search, Trash2, X } from "lucide-react";
import {
  archiveAdminCourse,
  deleteAdminCourse,
  restoreAdminCourse,
  saveAdminCourse,
  saveAdminCourseLocalization,
  uploadAdminContentAttachment,
  uploadAdminContentImage,
  type SaveAdminContentResult
} from "@/app/admin/actions";
import { AdminStatusBadge, getTone } from "@/components/AdminConsole";
import {
  courseCategories,
  courseLocales,
  courseStatuses,
  type AdminCourseLocalization,
  type AdminCourseRecord,
  type CourseLocale
} from "@/lib/course-model";

type LocalizationEditor = {
  certificationNote: string;
  curriculumText: string;
  duration: string;
  imageUrl: string;
  overview: string;
  pdfFileName: string;
  pdfUrl: string;
  recommendedText: string;
  status: string;
  summary: string;
  title: string;
};

const emptyLocalization: LocalizationEditor = {
  certificationNote: "",
  curriculumText: "",
  duration: "",
  imageUrl: "",
  overview: "",
  pdfFileName: "",
  pdfUrl: "",
  recommendedText: "",
  status: "draft",
  summary: "",
  title: ""
};

const categoryLabels = {
  certification: "자격 과정",
  practical: "실무 프로그램",
  professional: "목표형 과정"
} as const;

const statusLabels: Record<string, string> = {
  archived: "보관",
  draft: "초안",
  published: "공개",
  reviewed: "검수완료",
  translated: "번역완료"
};

export function AdminCoursesManager({ courses }: { courses: AdminCourseRecord[] }) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [activeCourseId, setActiveCourseId] = useState(courses[0]?.id ?? "");
  const [activeLocale, setActiveLocale] = useState<CourseLocale>("ko");
  const [commonCategory, setCommonCategory] = useState("practical");
  const [commonSortOrder, setCommonSortOrder] = useState(0);
  const [createCategory, setCreateCategory] = useState("practical");
  const [createSortOrder, setCreateSortOrder] = useState(courses.length);
  const [createTitle, setCreateTitle] = useState("");
  const [editor, setEditor] = useState<LocalizationEditor>(emptyLocalization);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [result, setResult] = useState<SaveAdminContentResult | null>(null);
  const [search, setSearch] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");
  const [selectedImagePreview, setSelectedImagePreview] = useState("");
  const [selectedPdfName, setSelectedPdfName] = useState("");
  const [isPending, startTransition] = useTransition();

  const activeCourse = courses.find((course) => course.id === activeCourseId) ?? courses[0] ?? null;
  const activeLocalization = activeCourse?.localizations.find((item) => item.locale === activeLocale) ?? null;
  const publishedCount = courses.filter((course) => course.localizations.some((item) => item.status === "published")).length;
  const filteredCourses = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return courses;
    return courses.filter((course) =>
      `${getCourseTitle(course)} ${course.slug} ${categoryLabels[course.categoryKey]}`.toLowerCase().includes(keyword)
    );
  }, [courses, search]);

  useEffect(() => {
    if (!activeCourse && courses[0]) setActiveCourseId(courses[0].id);
  }, [activeCourse, courses]);

  useEffect(() => {
    if (!activeCourse) {
      setEditor(emptyLocalization);
      return;
    }
    setCommonCategory(activeCourse.categoryKey);
    setCommonSortOrder(activeCourse.sortOrder);
    setEditor(toEditor(activeLocalization));
    setResult(null);
    resetFileInputs();
  }, [activeCourse, activeLocalization]);

  useEffect(() => () => {
    if (selectedImagePreview) URL.revokeObjectURL(selectedImagePreview);
  }, [selectedImagePreview]);

  function resetFileInputs() {
    setSelectedImageName("");
    setSelectedImagePreview("");
    setSelectedPdfName("");
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  }

  function updateEditor(name: keyof LocalizationEditor, value: string) {
    setEditor((current) => ({ ...current, [name]: value }));
    setResult(null);
  }

  function openCreateModal() {
    setCreateTitle("");
    setCreateCategory("practical");
    setCreateSortOrder(courses.length);
    setResult(null);
    setIsCreateOpen(true);
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const nextResult = await saveAdminCourse({ categoryKey: createCategory, sortOrder: createSortOrder, title: createTitle });
      setResult(nextResult);
      if (nextResult.ok) {
        if (nextResult.courseId) setActiveCourseId(nextResult.courseId);
        setIsCreateOpen(false);
        router.refresh();
      }
    });
  }

  function handleCommonSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeCourse) return;
    startTransition(async () => {
      const nextResult = await saveAdminCourse({
        categoryKey: commonCategory,
        courseId: activeCourse.id,
        sortOrder: commonSortOrder,
        title: getCourseTitle(activeCourse)
      });
      setResult(nextResult);
      if (nextResult.ok) router.refresh();
    });
  }

  function handleLocalizationSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeCourse) return;
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      let imageUrl = editor.imageUrl;
      let pdfUrl = editor.pdfUrl;
      let pdfFileName = editor.pdfFileName;
      const imageFile = formData.get("imageFile");
      const pdfFile = formData.get("pdfFile");

      if (imageFile instanceof File && imageFile.size > 0) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);
        uploadData.append("contentType", "Course");
        uploadData.append("slug", `${activeCourse.slug}-${activeLocale}`);
        const uploadResult = await uploadAdminContentImage(uploadData);
        if (!uploadResult.ok || !uploadResult.url) {
          setResult(uploadResult);
          return;
        }
        imageUrl = uploadResult.url;
      }

      if (pdfFile instanceof File && pdfFile.size > 0) {
        const uploadData = new FormData();
        uploadData.append("file", pdfFile);
        uploadData.append("contentType", "Course");
        uploadData.append("slug", `${activeCourse.slug}-${activeLocale}`);
        const uploadResult = await uploadAdminContentAttachment(uploadData);
        if (!uploadResult.ok || !uploadResult.url) {
          setResult(uploadResult);
          return;
        }
        pdfUrl = uploadResult.url;
        pdfFileName = pdfFile.name;
      }

      const nextResult = await saveAdminCourseLocalization({
        ...editor,
        courseId: activeCourse.id,
        imageUrl,
        locale: activeLocale,
        pdfFileName,
        pdfUrl
      });
      setResult(nextResult);
      if (nextResult.ok) {
        setEditor((current) => ({ ...current, imageUrl, pdfFileName, pdfUrl }));
        resetFileInputs();
        router.refresh();
      }
    });
  }

  function handleArchive() {
    if (!activeCourse || !window.confirm(`"${getCourseTitle(activeCourse)}" 과정을 보관할까요? 모든 공개 언어가 함께 비공개됩니다.`)) return;
    startTransition(async () => {
      const nextResult = await archiveAdminCourse({ courseId: activeCourse.id });
      setResult(nextResult);
      if (nextResult.ok) router.refresh();
    });
  }

  function handleRestore() {
    if (!activeCourse || !window.confirm(`"${getCourseTitle(activeCourse)}" 과정을 다시 활성화할까요? 언어 콘텐츠는 자동 공개되지 않습니다.`)) return;
    startTransition(async () => {
      const nextResult = await restoreAdminCourse({ courseId: activeCourse.id });
      setResult(nextResult);
      if (nextResult.ok) router.refresh();
    });
  }

  function handleDelete() {
    if (!activeCourse || !window.confirm(`"${getCourseTitle(activeCourse)}" 과정을 영구 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)) return;
    startTransition(async () => {
      const nextResult = await deleteAdminCourse({ courseId: activeCourse.id });
      setResult(nextResult);
      if (nextResult.ok) {
        setActiveCourseId("");
        router.refresh();
      }
    });
  }

  return (
    <div className="admin-courses-manager admin-course-hybrid-manager">
      <div className="admin-courses-toolbar">
        <section className="admin-courses-overview" aria-label="과정 CMS 요약">
          <span><strong>{courses.length}</strong>전체 과정</span>
          <span><strong>{courses.filter((course) => course.isActive).length}</strong>활성</span>
          <span><strong>{publishedCount}</strong>공개 언어 보유</span>
          <span><strong>{courses.filter((course) => !course.isActive).length}</strong>보관</span>
        </section>
        <button className="admin-users-new-button" onClick={openCreateModal} type="button"><Plus size={16} /> 교육과정 생성</button>
      </div>

      <div className="admin-courses-workspace">
        <aside className="admin-courses-list-panel">
          <label className="admin-courses-search"><Search size={15} /><span className="sr-only">과정 검색</span><input onChange={(event) => setSearch(event.target.value)} placeholder="과정명, 분류 검색" value={search} /></label>
          <div className="admin-courses-list" role="listbox" aria-label="과정 선택">
            {filteredCourses.map((course) => (
              <button aria-selected={course.id === activeCourse?.id} className={course.id === activeCourse?.id ? "is-active" : undefined} key={course.id} onClick={() => setActiveCourseId(course.id)} role="option" type="button">
                <strong>{getCourseTitle(course)}</strong>
                <span>{categoryLabels[course.categoryKey]} · {course.slug}</span>
                <em>{course.isActive ? getLocaleSummary(course) : "보관된 과정"}</em>
              </button>
            ))}
            {!filteredCourses.length ? <p className="console-empty-state">등록된 교육과정이 없습니다.</p> : null}
          </div>
        </aside>

        <section className="admin-courses-detail-panel">
          {activeCourse ? (
            <>
              <div className="admin-courses-heading">
                <div><span>COURSE CMS</span><h2>{getCourseTitle(activeCourse)}</h2><p>{activeCourse.slug} · {activeCourse.isActive ? "활성 과정" : "보관된 과정"}</p></div>
                {activeCourse.isActive && activeLocalization?.status === "published" ? (
                  <Link className="secondary-button" href={`/${activeLocale}/curriculum/${activeCourse.slug}`} rel="noreferrer" target="_blank">공개 페이지 <ArrowUpRight size={15} /></Link>
                ) : <span className="admin-course-preview-status">이 언어는 미공개</span>}
              </div>

              <form className="admin-course-common-form" onSubmit={handleCommonSave}>
                <label>과정 분류<select onChange={(event) => setCommonCategory(event.target.value)} value={commonCategory}>{courseCategories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}</select></label>
                <label>노출 순서<input min={0} onChange={(event) => setCommonSortOrder(Number(event.target.value))} type="number" value={commonSortOrder} /></label>
                <button className="secondary-button" disabled={isPending} type="submit"><Save size={15} /> 공통정보 저장</button>
              </form>

              <div className="admin-course-locale-tabs" role="tablist" aria-label="과정 언어">
                {courseLocales.map((locale) => {
                  const localization = activeCourse.localizations.find((item) => item.locale === locale);
                  return (
                    <button aria-selected={activeLocale === locale} className={activeLocale === locale ? "is-active" : undefined} key={locale} onClick={() => setActiveLocale(locale)} role="tab" type="button">
                      <span>{locale.toUpperCase()}</span><AdminStatusBadge tone={localization ? getTone(localization.status) : "neutral"}>{localization ? statusLabels[localization.status] : "미등록"}</AdminStatusBadge>
                    </button>
                  );
                })}
              </div>

              <form className="admin-courses-editor admin-course-localization-form" onSubmit={handleLocalizationSave}>
                <div className="admin-editor-grid">
                  <label>게시 상태<select onChange={(event) => updateEditor("status", event.target.value)} value={editor.status}>{courseStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
                  <label>교육 기간<input onChange={(event) => updateEditor("duration", event.target.value)} placeholder="예: 정규 2개월" value={editor.duration} /></label>
                  <label className="full">과정명<input onChange={(event) => updateEditor("title", event.target.value)} required value={editor.title} /></label>
                  <label className="full">목록 요약<textarea onChange={(event) => updateEditor("summary", event.target.value)} rows={3} value={editor.summary} /></label>
                  <label className="full">과정 개요<textarea onChange={(event) => updateEditor("overview", event.target.value)} rows={5} value={editor.overview} /></label>
                  <label className="full">핵심 교육 내용<textarea onChange={(event) => updateEditor("curriculumText", event.target.value)} placeholder="한 줄에 한 항목씩 입력" rows={6} value={editor.curriculumText} /></label>
                  <label className="full">추천 대상<textarea onChange={(event) => updateEditor("recommendedText", event.target.value)} placeholder="한 줄에 한 항목씩 입력" rows={5} value={editor.recommendedText} /></label>
                  <label className="full">수료·자격 안내<textarea onChange={(event) => updateEditor("certificationNote", event.target.value)} rows={4} value={editor.certificationNote} /></label>
                  <label>
                    대표 이미지
                    <span className="community-file-upload"><ImagePlus size={18} /><span><strong>이미지 선택</strong><small>{selectedImageName || "JPG, PNG, WebP, GIF / 5MB 이하"}</small></span><input accept="image/jpeg,image/png,image/webp,image/gif" name="imageFile" onChange={(event) => {
                      const file = event.target.files?.[0];
                      setSelectedImageName(file?.name ?? "");
                      setSelectedImagePreview(file ? URL.createObjectURL(file) : "");
                    }} ref={imageInputRef} type="file" /></span>
                    {selectedImagePreview || editor.imageUrl ? <div className="community-image-preview"><Image alt="대표 이미지 미리보기" height={72} src={selectedImagePreview || editor.imageUrl} unoptimized width={96} /><button onClick={() => {
                      setSelectedImageName("");
                      setSelectedImagePreview("");
                      updateEditor("imageUrl", "");
                      if (imageInputRef.current) imageInputRef.current.value = "";
                    }} type="button">이미지 제거</button></div> : null}
                  </label>
                  <label>
                    PDF 자료
                    <span className="community-file-upload"><FileText size={18} /><span><strong>PDF 선택</strong><small>{selectedPdfName || "PDF / 15MB 이하"}</small></span><input accept="application/pdf" name="pdfFile" onChange={(event) => setSelectedPdfName(event.target.files?.[0]?.name ?? "")} ref={pdfInputRef} type="file" /></span>
                    {editor.pdfUrl ? <div className="community-attachment-preview"><a href={editor.pdfUrl} rel="noreferrer" target="_blank"><FileText size={16} /> {editor.pdfFileName || "등록된 PDF 보기"}</a><button onClick={() => setEditor((current) => ({ ...current, pdfFileName: "", pdfUrl: "" }))} type="button">첨부파일 제거</button></div> : null}
                  </label>
                </div>
                {result ? <div className={result.ok ? "form-success" : "form-error full"} role="status">{result.ok ? <CheckCircle2 size={18} /> : null}<span>{result.message}</span></div> : null}
                {isPending ? <div className="form-progress full" role="status" aria-live="polite">과정 정보를 저장하고 있습니다.</div> : null}
                <div className="admin-editor-actions">
                  <button className="primary-button" disabled={isPending} type="submit"><Save size={16} /> 언어 콘텐츠 저장</button>
                  {activeCourse.isActive ? <button className="secondary-button danger" disabled={isPending} onClick={handleArchive} type="button"><Archive size={16} /> 과정 보관</button> : (
                    <>
                      <button className="secondary-button" disabled={isPending} onClick={handleRestore} type="button"><RotateCcw size={16} /> 과정 다시 활성화</button>
                      <button className="secondary-button danger" disabled={isPending} onClick={handleDelete} type="button"><Trash2 size={16} /> 영구 삭제</button>
                    </>
                  )}
                </div>
              </form>
            </>
          ) : <div className="console-empty-state"><FileText size={20} /><span>교육과정을 생성해 주세요.</span></div>}
        </section>
      </div>

      {isCreateOpen ? (
        <div className="admin-users-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setIsCreateOpen(false)}>
          <form className="admin-users-modal admin-course-create-modal" onSubmit={handleCreate} role="dialog" aria-modal="true" aria-labelledby="admin-course-create-title">
            <div className="admin-users-modal-heading"><Plus size={22} /><div><h3 id="admin-course-create-title">교육과정 생성</h3><p>기본정보를 만든 뒤 언어별 콘텐츠와 PDF를 등록합니다.</p></div><button aria-label="닫기" className="admin-users-modal-close" onClick={() => setIsCreateOpen(false)} type="button"><X size={17} /></button></div>
            <div className="admin-editor-grid">
              <label className="full">한국어 과정명<input autoFocus onChange={(event) => setCreateTitle(event.target.value)} required value={createTitle} /></label>
              <label>과정 분류<select onChange={(event) => setCreateCategory(event.target.value)} value={createCategory}>{courseCategories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}</select></label>
              <label>노출 순서<input min={0} onChange={(event) => setCreateSortOrder(Number(event.target.value))} type="number" value={createSortOrder} /></label>
            </div>
            {result && !result.ok ? <div className="form-error" role="status">{result.message}</div> : null}
            <div className="admin-editor-actions"><button className="primary-button" disabled={isPending} type="submit"><Plus size={16} /> {isPending ? "생성 중" : "과정 생성"}</button></div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function toEditor(localization: AdminCourseLocalization | null): LocalizationEditor {
  if (!localization) return { ...emptyLocalization };
  return {
    certificationNote: localization.certificationNote,
    curriculumText: localization.curriculumItems.join("\n"),
    duration: localization.duration,
    imageUrl: localization.imageUrl,
    overview: localization.overview,
    pdfFileName: localization.pdfFileName,
    pdfUrl: localization.pdfUrl,
    recommendedText: localization.recommendedFor.join("\n"),
    status: localization.status,
    summary: localization.summary,
    title: localization.title
  };
}

function getCourseTitle(course: AdminCourseRecord) {
  return course.localizations.find((item) => item.locale === "ko")?.title ?? course.localizations[0]?.title ?? course.slug;
}

function getLocaleSummary(course: AdminCourseRecord) {
  return courseLocales.map((locale) => {
    const localization = course.localizations.find((item) => item.locale === locale);
    return `${locale.toUpperCase()} ${localization ? statusLabels[localization.status] : "미등록"}`;
  }).join(" · ");
}
