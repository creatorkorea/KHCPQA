"use client";

import { useEffect, useMemo, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Copy, FilePenLine, Languages, Save, Search } from "lucide-react";
import {
  saveAdminContent,
  type SaveAdminContentResult
} from "@/app/admin/actions";
import { AdminStatusBadge, AdminTable, getTone, translationProgress } from "@/components/AdminConsole";
import {
  adminCourseLocales,
  adminCourseSections,
  adminCourseStatuses,
  getAdminCourseManagedSlug,
  getAdminCourseSectionLabel,
  getAdminCourseStatusLabel,
  type AdminCourseOption
} from "@/lib/admin-courses";
import type { AdminContentRow } from "@/lib/admin-data";

type Locale = (typeof adminCourseLocales)[number];

type TranslationEditorValue = {
  body: string;
  sourceUrl: string;
  status: string;
  summary: string;
  title: string;
};

type TranslationUnit = {
  course: AdminCourseOption;
  itemsByLocale: Map<string, AdminContentRow>;
  key: string;
  section: string;
  slug: string;
};

const emptyEditor: TranslationEditorValue = {
  body: "",
  sourceUrl: "",
  status: "draft",
  summary: "",
  title: ""
};

const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ko: "한국어"
};

export function AdminTranslationsManager({
  courseOptions,
  items
}: {
  courseOptions: AdminCourseOption[];
  items: AdminContentRow[];
}) {
  const router = useRouter();
  const units = useMemo(() => buildTranslationUnits(courseOptions, items), [courseOptions, items]);
  const [activeKey, setActiveKey] = useState(units[0]?.key ?? "");
  const [editor, setEditor] = useState<TranslationEditorValue>(emptyEditor);
  const [result, setResult] = useState<SaveAdminContentResult | null>(null);
  const [search, setSearch] = useState("");
  const [sourceLocale, setSourceLocale] = useState<Locale>("ko");
  const [statusFilter, setStatusFilter] = useState("");
  const [targetLocale, setTargetLocale] = useState<Locale>("en");
  const [isPending, startTransition] = useTransition();

  const activeUnit = units.find((unit) => unit.key === activeKey) ?? units[0] ?? null;
  const sourceItem = activeUnit?.itemsByLocale.get(sourceLocale);
  const targetItem = activeUnit?.itemsByLocale.get(targetLocale);
  const completeUnits = units.filter((unit) => getCompletedLocaleCount(unit) === adminCourseLocales.length).length;
  const missingUnits = units.filter((unit) => getCompletedLocaleCount(unit) < adminCourseLocales.length).length;
  const publishedItems = items.filter((item) => item.status === "published").length;

  const filteredUnits = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return units.filter((unit) => {
      const title = `${unit.course.label} ${unit.course.slug} ${getAdminCourseSectionLabel(unit.section)}`.toLowerCase();
      const matchesKeyword = !keyword || title.includes(keyword);
      const matchesStatus =
        !statusFilter ||
        adminCourseLocales.some((locale) => unit.itemsByLocale.get(locale)?.status === statusFilter) ||
        (statusFilter === "missing" && adminCourseLocales.some((locale) => !unit.itemsByLocale.has(locale)));

      return matchesKeyword && matchesStatus;
    });
  }, [search, statusFilter, units]);

  useEffect(() => {
    if (!activeUnit) {
      setEditor(emptyEditor);
      return;
    }

    const nextSourceLocale = pickSourceLocale(activeUnit, sourceLocale);
    const nextTargetLocale = pickTargetLocale(activeUnit, targetLocale, nextSourceLocale);
    const nextTargetItem = activeUnit.itemsByLocale.get(nextTargetLocale);
    const nextSourceItem = activeUnit.itemsByLocale.get(nextSourceLocale);

    if (nextSourceLocale !== sourceLocale) {
      setSourceLocale(nextSourceLocale);
    }

    if (nextTargetLocale !== targetLocale) {
      setTargetLocale(nextTargetLocale);
    }

    setEditor(getEditorValue(nextTargetItem, nextSourceItem, activeUnit.section, activeUnit.course));
    setResult(null);
  }, [activeUnit, sourceLocale, targetLocale]);

  function selectUnit(unitKey: string) {
    setActiveKey(unitKey);
    setResult(null);
  }

  function updateEditor(name: keyof TranslationEditorValue, value: string) {
    setEditor((current) => ({ ...current, [name]: value }));
    setResult(null);
  }

  function copySourceToTarget() {
    if (!activeUnit) {
      return;
    }

    setEditor(getEditorValue(null, sourceItem, activeUnit.section, activeUnit.course));
    setResult(null);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeUnit) {
      return;
    }

    setResult(null);
    startTransition(async () => {
      const nextResult = await saveAdminContent({
        body: editor.body,
        contentType: "Course",
        imageUrl: targetItem?.imageUrl || sourceItem?.imageUrl || "",
        locale: targetLocale,
        slug: activeUnit.slug,
        sourceUrl: editor.sourceUrl,
        status: editor.status,
        summary: editor.summary,
        title: editor.title
      });

      setResult(nextResult);

      if (nextResult.ok) {
        router.refresh();
      }
    });
  }

  const rows = filteredUnits.map((unit) => {
    const completedCount = getCompletedLocaleCount(unit);
    const progressValue = Math.round((completedCount / adminCourseLocales.length) * 100);

    return {
      id: unit.key,
      action: (
        <button className="community-inline-action" onClick={() => selectUnit(unit.key)} type="button">
          작업
        </button>
      ),
      en: translationBadge(unit.itemsByLocale.get("en")?.status),
      es: translationBadge(unit.itemsByLocale.get("es")?.status),
      ko: translationBadge(unit.itemsByLocale.get("ko")?.status),
      progress: (
        <span className="console-progress-cell">
          {translationProgress(progressValue)}
          <em>{progressValue}%</em>
        </span>
      ),
      section: getAdminCourseSectionLabel(unit.section),
      title: (
        <button className="community-link-button" onClick={() => selectUnit(unit.key)} type="button">
          {unit.course.label}
        </button>
      )
    };
  });

  return (
    <div className="admin-courses-manager admin-translations-manager">
      <section className="admin-courses-overview" aria-label="번역 CMS 요약">
        <span><strong>{units.length}</strong>관리 섹션</span>
        <span><strong>{completeUnits}</strong>전체 완료</span>
        <span><strong>{missingUnits}</strong>작업 필요</span>
        <span><strong>{publishedItems}</strong>공개 항목</span>
      </section>

      <div className="admin-translations-workspace">
        <section className="console-panel translation-list-panel">
          <div className="translation-toolbar">
            <label className="admin-courses-search">
              <Search size={15} />
              <span className="sr-only">번역 항목 검색</span>
              <input
                onChange={(event) => setSearch(event.target.value)}
                placeholder="과정명, slug, 섹션 검색"
                value={search}
              />
            </label>
            <label className="console-select">
              <span className="sr-only">상태 필터</span>
              <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
                <option value="">상태 전체</option>
                <option value="missing">미등록 포함</option>
                {adminCourseStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getAdminCourseStatusLabel(status)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <AdminTable
            columns={[
              { key: "title", label: "과정명" },
              { key: "section", label: "관리 섹션" },
              { key: "ko", label: "KO", align: "center" },
              { key: "en", label: "EN", align: "center" },
              { key: "es", label: "ES", align: "center" },
              { key: "progress", label: "진행률", align: "center" },
              { key: "action", label: "작업", align: "center" }
            ]}
            emptyLabel="번역 관리 대상 과정이 없습니다."
            rows={rows}
          />
        </section>

        <section className="console-panel translation-editor-panel">
          {activeUnit ? (
            <form className="admin-editor-form translation-editor-form" onSubmit={handleSave}>
              <div className="admin-editor-heading">
                <Languages size={22} />
                <div>
                  <h3>{activeUnit.course.label}</h3>
                  <p>{getAdminCourseSectionLabel(activeUnit.section)} · {activeUnit.slug}</p>
                </div>
              </div>

              <div className="translation-locale-grid">
                <label>
                  기준 언어
                  <select onChange={(event) => setSourceLocale(event.target.value as Locale)} value={sourceLocale}>
                    {adminCourseLocales.map((locale) => (
                      <option disabled={!activeUnit.itemsByLocale.has(locale)} key={locale} value={locale}>
                        {locale.toUpperCase()} · {localeLabels[locale]}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  번역 언어
                  <select onChange={(event) => setTargetLocale(event.target.value as Locale)} value={targetLocale}>
                    {adminCourseLocales.map((locale) => (
                      <option disabled={locale === sourceLocale} key={locale} value={locale}>
                        {locale.toUpperCase()} · {localeLabels[locale]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="translation-source-box">
                <div>
                  <strong>{sourceItem?.title ?? "기준 언어 콘텐츠 없음"}</strong>
                  <p>{sourceItem?.summary || "먼저 과정 관리에서 기준 언어 콘텐츠를 저장해 주세요."}</p>
                </div>
                <button disabled={!sourceItem || isPending} onClick={copySourceToTarget} type="button">
                  <Copy size={15} />
                  기준 내용 복사
                </button>
              </div>

              <div className="admin-editor-grid">
                <label>
                  번역 상태
                  <select onChange={(event) => updateEditor("status", event.target.value)} value={editor.status}>
                    {adminCourseStatuses.map((status) => (
                      <option key={status} value={status}>{getAdminCourseStatusLabel(status)}</option>
                    ))}
                  </select>
                </label>
                <label>
                  공개 화면
                  <Link className="translation-public-link" href={`/${targetLocale}/curriculum/${activeUnit.course.slug}`} target="_blank">
                    {targetLocale.toUpperCase()} 공개 페이지
                    <FilePenLine size={14} />
                  </Link>
                </label>
                <label className="full">
                  번역 제목
                  <input
                    onChange={(event) => updateEditor("title", event.target.value)}
                    placeholder="번역 제목"
                    required
                    value={editor.title}
                  />
                </label>
                <label className="full">
                  번역 요약
                  <textarea
                    onChange={(event) => updateEditor("summary", event.target.value)}
                    placeholder="공개 화면에 표시할 번역 요약"
                    rows={3}
                    value={editor.summary}
                  />
                </label>
                <label className="full">
                  번역 본문
                  <textarea
                    onChange={(event) => updateEditor("body", event.target.value)}
                    placeholder="번역 본문 또는 줄바꿈 목록"
                    rows={7}
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

              {isPending ? (
                <div className="form-progress full" role="status" aria-live="polite">
                  번역 항목을 저장하고 있습니다.
                </div>
              ) : null}

              <div className="admin-editor-actions">
                <button className="primary-button" disabled={isPending || !activeUnit} type="submit">
                  <Save size={16} />
                  <span>{isPending ? "저장 중" : targetItem ? "번역 수정" : "번역 초안 생성"}</span>
                </button>
                <Link className="secondary-button" href="/admin/courses">
                  과정 관리로 이동
                </Link>
              </div>
            </form>
          ) : (
            <div className="console-empty-state">
              <Languages size={18} />
              <span>관리할 번역 항목이 없습니다.</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function buildTranslationUnits(courseOptions: AdminCourseOption[], items: AdminContentRow[]) {
  return courseOptions.flatMap((course) =>
    adminCourseSections.map((section) => {
      const slug = getAdminCourseManagedSlug(course.slug, section);
      const unitItems = items.filter((item) => item.slug === slug);

      return {
        course,
        itemsByLocale: new Map(unitItems.map((item) => [item.locale, item])),
        key: `${course.slug}::${section}`,
        section,
        slug
      } satisfies TranslationUnit;
    })
  );
}

function getCompletedLocaleCount(unit: TranslationUnit) {
  return adminCourseLocales.filter((locale) => isTranslationComplete(unit.itemsByLocale.get(locale)?.status)).length;
}

function isTranslationComplete(status?: string) {
  return status === "published" || status === "translated" || status === "reviewed";
}

function statusLabel(status?: string) {
  if (!status) {
    return "미등록";
  }

  return getAdminCourseStatusLabel(status);
}

function translationBadge(status?: string) {
  return <AdminStatusBadge tone={status ? getTone(status) : "neutral"}>{statusLabel(status)}</AdminStatusBadge>;
}

function pickSourceLocale(unit: TranslationUnit, currentLocale: Locale): Locale {
  if (unit.itemsByLocale.has(currentLocale)) {
    return currentLocale;
  }

  return adminCourseLocales.find((locale) => unit.itemsByLocale.has(locale)) ?? "ko";
}

function pickTargetLocale(unit: TranslationUnit, currentLocale: Locale, sourceLocale: Locale): Locale {
  if (currentLocale !== sourceLocale) {
    return currentLocale;
  }

  return adminCourseLocales.find((locale) => locale !== sourceLocale && !unit.itemsByLocale.has(locale)) ??
    adminCourseLocales.find((locale) => locale !== sourceLocale) ??
    "en";
}

function getEditorValue(
  targetItem: AdminContentRow | null | undefined,
  sourceItem: AdminContentRow | null | undefined,
  section: string,
  course: AdminCourseOption
): TranslationEditorValue {
  if (targetItem) {
    return {
      body: targetItem.body ?? "",
      sourceUrl: targetItem.sourceUrl ?? "",
      status: targetItem.status,
      summary: targetItem.summary ?? "",
      title: targetItem.title
    };
  }

  return {
    body: sourceItem?.body ?? "",
    sourceUrl: sourceItem?.sourceUrl ?? "",
    status: "draft",
    summary: sourceItem?.summary ?? (section === "main" ? course.summary : ""),
    title: sourceItem?.title ?? (section === "main" ? course.label : getAdminCourseSectionLabel(section))
  };
}
