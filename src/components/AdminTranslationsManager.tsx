"use client";

import { useEffect, useMemo, useRef, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Copy, Languages, Save, Search } from "lucide-react";
import { saveAdminContent, type SaveAdminContentResult } from "@/app/admin/actions";
import { AdminStatusBadge, AdminTable, getTone, translationProgress } from "@/components/AdminConsole";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import { buildTranslationQueue } from "@/lib/admin-translation-model";
import type { AdminContentRow } from "@/lib/admin-data";
import type { AdminCourseRecord } from "@/lib/course-model";
import { translationStatuses } from "@/lib/translation-model";

type ManagedTranslation = {
  body: string;
  content?: AdminContentRow;
  course?: AdminCourseRecord;
  imageAlt: string;
  key: string;
  locale: Locale;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  sourceUpdatedAt: string;
  status: string;
  summary: string;
  title: string;
  translatedFromUpdatedAt: string;
  type: string;
};

type EditorValue = Pick<ManagedTranslation, "body" | "imageAlt" | "seoDescription" | "seoTitle" | "status" | "summary" | "title">;

const emptyEditor: EditorValue = {
  body: "",
  imageAlt: "",
  seoDescription: "",
  seoTitle: "",
  status: "draft",
  summary: "",
  title: ""
};

const statusLabels: Record<string, string> = {
  archived: "보관",
  draft: "초안",
  missing: "미등록",
  published: "공개",
  reviewed: "검수 완료",
  stale: "재검수 필요",
  translated: "번역 완료"
};

export function AdminTranslationsManager({
  contentItems,
  courses
}: {
  contentItems: AdminContentRow[];
  courses: AdminCourseRecord[];
}) {
  const router = useRouter();
  const editorPanelRef = useRef<HTMLElement>(null);
  const translations = useMemo(() => normalizeTranslations(contentItems, courses), [contentItems, courses]);
  const queue = useMemo(() => buildTranslationQueue(translations), [translations]);
  const [activeKey, setActiveKey] = useState(queue[0]?.key ?? "");
  const [targetLocale, setTargetLocale] = useState<Exclude<Locale, "ko">>("en");
  const [editor, setEditor] = useState<EditorValue>(emptyEditor);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<SaveAdminContentResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const activeGroup = queue.find((group) => group.key === activeKey) ?? queue[0] ?? null;
  const source = translations.find((item) => item.key === activeGroup?.key && item.locale === "ko");
  const target = translations.find((item) => item.key === activeGroup?.key && item.locale === targetLocale);

  useEffect(() => {
    setEditor(target ? toEditor(target) : emptyEditor);
    setResult(null);
  }, [activeKey, target, targetLocale]);

  const filteredQueue = queue.filter((group) => {
    const keyword = search.trim().toLowerCase();
    return !keyword || `${group.title} ${group.key} ${group.type}`.toLowerCase().includes(keyword);
  });
  const rows = filteredQueue.map((group) => ({
    id: group.key,
    action: <button className="community-inline-action" onClick={() => selectTranslation(group.key)} type="button">작업</button>,
    en: renderLocaleBadge(group.locales.en),
    es: renderLocaleBadge(group.locales.es),
    ko: renderLocaleBadge(group.locales.ko),
    progress: <span className="console-progress-cell">{translationProgress(group.completedCount * 25)}<em>{group.completedCount}/4</em></span>,
    title: <button className="community-link-button" onClick={() => selectTranslation(group.key)} type="button">{group.title}</button>,
    type: group.type,
    zh: renderLocaleBadge(group.locales["zh-CN"])
  }));

  function selectTranslation(key: string) {
    setActiveKey(key);
    if (!window.matchMedia("(max-width: 1100px)").matches) return;
    requestAnimationFrame(() => editorPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function copySource() {
    if (!source) return;
    setEditor({ ...toEditor(source), status: "draft" });
    setResult(null);
  }

  function updateEditor(name: keyof EditorValue, value: string) {
    setEditor((current) => ({ ...current, [name]: value }));
    setResult(null);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeGroup || !source || source.course) return;
    startTransition(async () => {
      const nextResult = await saveAdminContent({
        body: editor.body,
        contentType: source.type,
        imageAlt: editor.imageAlt,
        imageUrl: target?.content?.imageUrl || source.content?.imageUrl || "",
        locale: targetLocale,
        seoDescription: editor.seoDescription,
        seoTitle: editor.seoTitle,
        slug: source.slug,
        sourceUrl: target?.content?.sourceUrl || source.content?.sourceUrl || "",
        status: editor.status,
        summary: editor.summary,
        title: editor.title
      });
      setResult(nextResult);
      if (nextResult.ok) router.refresh();
    });
  }

  return (
    <div className="admin-courses-manager admin-translations-manager">
      <section className="admin-courses-overview" aria-label="번역 CMS 요약">
        <span><strong>{queue.length}</strong>전체 콘텐츠</span>
        <span><strong>{queue.filter((item) => item.completedCount === 4).length}</strong>4개 언어 완료</span>
        <span><strong>{queue.filter((item) => Object.values(item.locales).some((locale) => locale.freshness === "stale")).length}</strong>재검수 필요</span>
        <span><strong>{queue.filter((item) => item.locales["zh-CN"].status !== "missing").length}</strong>중국어 등록</span>
      </section>

      <div className="admin-translations-workspace">
        <section className="console-panel translation-list-panel">
          <label className="admin-courses-search">
            <Search size={15} />
            <span className="sr-only">번역 항목 검색</span>
            <input onChange={(event) => setSearch(event.target.value)} placeholder="콘텐츠명, 유형, slug 검색" value={search} />
          </label>
          <AdminTable columns={[
            { key: "title", label: "콘텐츠" },
            { key: "type", label: "유형" },
            { key: "ko", label: "KO", align: "center" },
            { key: "en", label: "EN", align: "center" },
            { key: "es", label: "ES", align: "center" },
            { key: "zh", label: "ZH-CN", align: "center" },
            { key: "progress", label: "진행률", align: "center" },
            { key: "action", label: "작업", align: "center" }
          ]} emptyLabel="번역 관리 대상이 없습니다." rows={rows} />
        </section>

        <section className="console-panel translation-editor-panel" ref={editorPanelRef}>
          {activeGroup && source ? (
            source.course ? (
              <div className="admin-editor-form translation-course-handoff">
                <div className="admin-editor-heading"><Languages size={22} /><div><h3>{activeGroup.title}</h3><p>교육과정 · {source.slug}</p></div></div>
                <div className="translation-course-guide">
                  <strong>교육과정 번역은 과정 관리에서 편집합니다.</strong>
                  <p>기간, 교육 구성, 상세 콘텐츠, 이미지와 PDF까지 한 화면에서 언어별로 관리해 내용이 어긋나지 않도록 했습니다.</p>
                </div>
                <label>편집할 언어
                  <select onChange={(event) => setTargetLocale(event.target.value as Exclude<Locale, "ko">)} value={targetLocale}>
                    {locales.filter((locale): locale is Exclude<Locale, "ko"> => locale !== "ko").map((locale) => <option key={locale} value={locale}>{locale.toUpperCase()} · {localeLabels[locale]}</option>)}
                  </select>
                </label>
                <div className="translation-source-box">
                  <div><strong>한국어 원문</strong><p>{source.title}</p><p>{source.summary || source.body || "한국어 원문 내용이 없습니다."}</p></div>
                </div>
                {activeGroup.locales[targetLocale].freshness === "stale" ? <div className="form-error" role="alert"><AlertTriangle size={18} />한국어 원문이 수정되어 재검수가 필요합니다.</div> : null}
                <div className="translation-course-target">
                  <span>선택 언어 상태</span>
                  {renderLocaleBadge(activeGroup.locales[targetLocale])}
                </div>
                <div className="admin-editor-actions">
                  <Link className="primary-button" href={`/admin/courses?course=${encodeURIComponent(source.slug)}&locale=${targetLocale}`}>
                    과정 번역 편집 <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            ) : (
            <form className="admin-editor-form translation-editor-form" onSubmit={handleSave}>
              <div className="admin-editor-heading"><Languages size={22} /><div><h3>{activeGroup.title}</h3><p>{activeGroup.type} · {source.slug}</p></div></div>
              <label>번역 언어
                <select onChange={(event) => setTargetLocale(event.target.value as Exclude<Locale, "ko">)} value={targetLocale}>
                  {locales.filter((locale): locale is Exclude<Locale, "ko"> => locale !== "ko").map((locale) => <option key={locale} value={locale}>{locale.toUpperCase()} · {localeLabels[locale]}</option>)}
                </select>
              </label>
              <div className="translation-source-box">
                <div><strong>{source.title}</strong><p>{source.summary || source.body || "한국어 원문 내용이 없습니다."}</p></div>
                <button disabled={isPending} onClick={copySource} type="button"><Copy size={15} /> 원문 복사</button>
              </div>
              {activeGroup.locales[targetLocale].freshness === "stale" ? <div className="form-error" role="alert"><AlertTriangle size={18} />한국어 원문이 수정되어 재검수가 필요합니다.</div> : null}
              <div className="admin-editor-grid">
                <label>번역 상태<select onChange={(event) => updateEditor("status", event.target.value)} value={editor.status}>{translationStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
                <label className="full">번역 제목<input onChange={(event) => updateEditor("title", event.target.value)} required value={editor.title} /></label>
                <label className="full">번역 요약<textarea onChange={(event) => updateEditor("summary", event.target.value)} rows={3} value={editor.summary} /></label>
                <label className="full">번역 본문<textarea onChange={(event) => updateEditor("body", event.target.value)} rows={8} value={editor.body} /></label>
                <label className="full">SEO 제목<input onChange={(event) => updateEditor("seoTitle", event.target.value)} value={editor.seoTitle} /></label>
                <label className="full">SEO 설명<textarea onChange={(event) => updateEditor("seoDescription", event.target.value)} rows={3} value={editor.seoDescription} /></label>
                <label className="full">이미지 대체텍스트<input onChange={(event) => updateEditor("imageAlt", event.target.value)} value={editor.imageAlt} /></label>
              </div>
              {result ? <div className={result.ok ? "form-success" : "form-error"} role="status">{result.ok ? <CheckCircle2 size={18} /> : null}{result.message}</div> : null}
              <div className="admin-editor-actions"><button className="primary-button" disabled={isPending} type="submit"><Save size={16} />{isPending ? "저장 중" : "번역 저장"}</button></div>
            </form>
            )
          ) : <div className="console-empty-state"><Languages size={18} />한국어 원문이 있는 콘텐츠가 없습니다.</div>}
        </section>
      </div>
    </div>
  );
}

function normalizeTranslations(contentItems: AdminContentRow[], courses: AdminCourseRecord[]): ManagedTranslation[] {
  const courseSlugs = new Set(courses.map((course) => course.slug));
  const content = contentItems
    .filter((item) => item.type !== "Banner" && item.slug && !(item.type === "Course" && courseSlugs.has(item.slug)))
    .map((item) => ({
      body: item.body ?? "", content: item, imageAlt: item.imageAlt ?? "", key: `${item.type}:${item.slug}`,
      locale: item.locale as Locale, seoDescription: item.seoDescription ?? "", seoTitle: item.seoTitle ?? "",
      slug: item.slug!, sourceUpdatedAt: item.sourceUpdatedAt || item.updatedAtRaw || "", status: item.status,
      summary: item.summary ?? "", title: item.title, translatedFromUpdatedAt: item.translatedFromUpdatedAt ?? "", type: item.type
    }));
  const courseItems = courses.flatMap((course) => course.localizations.map((localization) => ({
    body: localization.overview, course, imageAlt: localization.imageAlt,
    key: `Course:${course.slug}`, locale: localization.locale as Locale, seoDescription: localization.seoDescription,
    seoTitle: localization.seoTitle, slug: course.slug, sourceUpdatedAt: localization.sourceUpdatedAt || localization.updatedAt,
    status: localization.status, summary: localization.summary, title: localization.title,
    translatedFromUpdatedAt: localization.translatedFromUpdatedAt, type: "Course"
  })));
  return [...content, ...courseItems].filter((item) => locales.includes(item.locale));
}

function toEditor(item: ManagedTranslation): EditorValue {
  return { body: item.body, imageAlt: item.imageAlt, seoDescription: item.seoDescription, seoTitle: item.seoTitle, status: item.status, summary: item.summary, title: item.title };
}

function renderLocaleBadge(item: { freshness: string; status: string }) {
  const stale = item.freshness === "stale";
  return <AdminStatusBadge tone={stale ? "warning" : item.status === "missing" ? "neutral" : getTone(item.status)}>{stale ? statusLabels.stale : statusLabels[item.status] ?? item.status}</AdminStatusBadge>;
}
