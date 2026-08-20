"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useRef, useState, useTransition, type FormEvent } from "react";
import { Edit3, ImagePlus, Save, Trash2, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  deleteAdminManagedItem,
  saveAdminContent,
  uploadAdminContentImage,
  type DeleteAdminContentResult,
  type SaveAdminContentResult,
  type UploadAdminContentImageResult
} from "@/app/admin/actions";
import { AdminStatusBadge, AdminTable, getTone } from "@/components/AdminConsole";
import type { AdminContentRow } from "@/lib/admin-data";

type ActionResult = SaveAdminContentResult | DeleteAdminContentResult | UploadAdminContentImageResult;

type DirectorFallback = {
  imageUrl: string;
  name: string;
  role: string;
  slug: string;
};

type EditorState = {
  career: string;
  certifications: string;
  country: string;
  education: string;
  imageUrl: string;
  legacyProfileMemo: string;
  locale: string;
  roleTitle: string;
  slug: string;
  status: string;
  title: string;
};

const blankEditor: EditorState = {
  career: "",
  certifications: "",
  country: "",
  education: "",
  imageUrl: "",
  legacyProfileMemo: "",
  locale: "ko",
  roleTitle: "",
  slug: "",
  status: "draft",
  title: ""
};

function statusLabel(status: string) {
  if (status === "published") return "노출";
  if (status === "draft") return "임시저장";
  if (status === "archived") return "비노출";
  if (status === "reviewed") return "검수 완료";
  if (status === "translated") return "번역 완료";
  return status;
}

function createDirectorSlug() {
  return `director-${Date.now()}`;
}

function parseDirectorSummary(summary = "") {
  const [roleTitle = "", ...countryParts] = summary.split("·").map((part) => part.trim());

  return {
    country: countryParts.join(" · "),
    roleTitle
  };
}

function composeDirectorSummary(editor: EditorState) {
  return [editor.roleTitle, editor.country].map((value) => value.trim()).filter(Boolean).join(" · ");
}

function getProfileSection(body: string, label: "학력" | "경력" | "자격") {
  const pattern = new RegExp(`${label}\\n([\\s\\S]*?)(?=\\n\\n(?:학력|경력|자격)\\n|$)`);
  return body.match(pattern)?.[1]?.trim() ?? "";
}

function parseProfileSections(body = "") {
  const education = getProfileSection(body, "학력");
  const career = getProfileSection(body, "경력");
  const certifications = getProfileSection(body, "자격");
  const hasSectionedBody = Boolean(education || career || certifications);

  return {
    career,
    certifications,
    education,
    legacyProfileMemo: hasSectionedBody ? "" : body.trim()
  };
}

function composeProfileBody(editor: EditorState) {
  return [
    ["학력", editor.education],
    ["경력", editor.career],
    ["자격", editor.certifications]
  ]
    .flatMap(([label, value]) => {
      const trimmed = value.trim();
      return trimmed ? [`${label}\n${trimmed}`] : [];
    })
    .join("\n\n");
}

export function AdminDirectorsManager({
  fallbackDirectors,
  items
}: {
  fallbackDirectors: DirectorFallback[];
  items: AdminContentRow[];
}) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [editor, setEditor] = useState<EditorState>(blankEditor);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [search, setSearch] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState("");
  const [selectedItem, setSelectedItem] = useState<AdminContentRow | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [pendingAction, setPendingAction] = useState<"delete" | "save" | null>(null);
  const [isPending, startTransition] = useTransition();
  const isBusy = isPending || pendingAction !== null;

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesKeyword =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.slug?.toLowerCase().includes(keyword) ||
        item.summary?.toLowerCase().includes(keyword);
      const matchesStatus = !statusFilter || item.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const rows = filteredItems.map((item) => ({
    id: item.id ?? `${item.locale}-${item.slug}`,
    image: item.imageUrl ? <img alt="" className="director-admin-thumb" src={item.imageUrl} /> : "-",
    manage: (
      <button
        aria-label={`${item.title} 디렉터 수정`}
        className="console-row-action"
        onClick={() => selectItem(item)}
        type="button"
      >
        <Edit3 size={14} />
      </button>
    ),
    role: item.summary ?? "-",
    status: <AdminStatusBadge tone={getTone(item.status)}>{statusLabel(item.status)}</AdminStatusBadge>,
    title: (
      <button className="community-link-button" onClick={() => selectItem(item)} type="button">
        {item.title}
      </button>
    ),
    updatedAt: item.updatedAt
  }));

  function resetImageInput() {
    setSelectedImageName("");
    setSelectedImagePreviewUrl((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return "";
    });

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function handleImageFileChange(file?: File) {
    setSelectedImageName(file?.name ?? "");
    setSelectedImagePreviewUrl((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return file ? URL.createObjectURL(file) : "";
    });
  }

  function closeEditor() {
    setIsEditorOpen(false);
    setSelectedItem(null);
    setResult(null);
    resetImageInput();
  }

  function startCreate() {
    setIsEditorOpen(true);
    setSelectedItem(null);
    setResult(null);
    resetImageInput();
    setEditor({
      ...blankEditor,
      slug: createDirectorSlug()
    });
  }

  function selectItem(item: AdminContentRow) {
    const summary = parseDirectorSummary(item.summary ?? "");
    const profileSections = parseProfileSections(item.body ?? "");

    setIsEditorOpen(true);
    setSelectedItem(item);
    setResult(null);
    resetImageInput();
    setEditor({
      career: profileSections.career,
      certifications: profileSections.certifications,
      country: summary.country,
      education: profileSections.education,
      imageUrl: item.imageUrl ?? "",
      legacyProfileMemo: profileSections.legacyProfileMemo,
      locale: item.locale,
      roleTitle: summary.roleTitle,
      slug: item.slug ?? createDirectorSlug(),
      status: item.status,
      title: item.title
    });
  }

  function updateEditor(name: keyof EditorState, value: string) {
    setEditor((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const slug = editor.slug.trim().toLowerCase();

    if (!slug.startsWith("director-")) {
      setResult({ ok: false, message: "슬러그는 director-로 시작해야 공개 국제 디렉터 영역에 연결됩니다." });
      return;
    }

    setPendingAction("save");
    startTransition(async () => {
      try {
        let imageUrl = editor.imageUrl;
        const imageFile = formData.get("imageFile");

        if (imageFile instanceof File && imageFile.size > 0) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", imageFile);
          uploadFormData.append("contentType", "Page");
          uploadFormData.append("slug", slug);

          const uploadResult = await uploadAdminContentImage(uploadFormData);

          if (!uploadResult.ok || !uploadResult.url) {
            setResult(uploadResult);
            return;
          }

          imageUrl = uploadResult.url;
        }

        const nextResult = await saveAdminContent({
          body: composeProfileBody(editor),
          contentType: "Page",
          imageUrl,
          locale: editor.locale,
          preventOverwrite: !selectedItem,
          slug,
          sourceUrl: "",
          status: editor.status,
          summary: composeDirectorSummary(editor),
          title: editor.title
        });

        setResult(nextResult);

        if (nextResult.ok) {
          resetImageInput();
          setSelectedItem(null);
          setIsEditorOpen(false);
          setEditor(blankEditor);
          router.refresh();
        }
      } finally {
        setPendingAction(null);
      }
    });
  }

  function handleDelete() {
    if (!selectedItem?.id) {
      return;
    }

    const selectedId = selectedItem.id;
    const confirmed = window.confirm(`"${selectedItem.title}" 디렉터 항목을 삭제할까요? 공개 화면에서도 사라질 수 있습니다.`);

    if (!confirmed) {
      return;
    }

    setResult(null);
    setPendingAction("delete");
    startTransition(async () => {
      try {
        const nextResult = await deleteAdminManagedItem({
          id: selectedId,
          itemType: "content"
        });

        setResult(nextResult);

        if (nextResult.ok) {
          resetImageInput();
          setSelectedItem(null);
          setIsEditorOpen(false);
          setEditor(blankEditor);
          router.refresh();
        }
      } finally {
        setPendingAction(null);
      }
    });
  }

  return (
    <div className="community-manager director-manager">
      {isBusy ? (
        <div className="admin-action-overlay" role="status" aria-live="polite">
          <div className="admin-action-box">
            <strong>{pendingAction === "delete" ? "삭제 중" : "저장 중"}</strong>
            <span>잠시만 기다려 주세요.</span>
          </div>
        </div>
      ) : null}

      <section className="console-panel community-list-panel">
        <div className="community-panel-top">
          <div>
            <h2>국제 디렉터 목록</h2>
            <p>공개 화면은 노출 상태의 director-* 페이지 콘텐츠를 우선 사용합니다.</p>
          </div>
          <button className="console-primary-button" onClick={startCreate} type="button">
            <UserPlus size={16} />
            디렉터 등록
          </button>
        </div>

        <div className="console-filter-bar">
          <label className="console-search-input">
            <span className="sr-only">디렉터 검색</span>
            <input onChange={(event) => setSearch(event.target.value)} placeholder="이름, 직책, 국가 검색" value={search} />
          </label>
          <label className="console-select">
            <span className="sr-only">상태 필터</span>
            <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
              <option value="">전체 상태</option>
              <option value="published">노출</option>
              <option value="draft">임시저장</option>
              <option value="archived">비노출</option>
            </select>
          </label>
        </div>

        <AdminTable
          columns={[
            { key: "image", label: "사진", align: "center" },
            { key: "title", label: "이름" },
            { key: "role", label: "직책/국가" },
            { key: "status", label: "상태" },
            { key: "updatedAt", label: "최종 수정일" },
            { key: "manage", label: "관리", align: "center" }
          ]}
          emptyLabel="등록된 국제 디렉터 콘텐츠가 없습니다."
          rows={rows}
        />
      </section>

      {isEditorOpen ? (
        <div className="director-modal-backdrop" onMouseDown={closeEditor}>
          <section
            aria-labelledby="director-modal-title"
            aria-modal="true"
            className="director-modal-panel is-open"
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="community-editor-header">
              <div>
                <h2 id="director-modal-title">{selectedItem ? "디렉터 수정" : "디렉터 등록"}</h2>
                <p>이름은 카드 제목, 직책/국가는 카드 설명으로 표시됩니다.</p>
              </div>
              <button
                aria-label="편집 닫기"
                className="console-icon-button"
                onClick={closeEditor}
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            {result ? <div className={result.ok ? "console-success-message" : "console-error-message"}>{result.message}</div> : null}

            <form className="admin-editor-form community-editor-form" onSubmit={handleSubmit}>
              <div className="community-form-grid">
                <label>
                  <span>상태</span>
                  <select onChange={(event) => updateEditor("status", event.target.value)} value={editor.status}>
                    <option value="draft">임시저장</option>
                    <option value="published">노출</option>
                    <option value="archived">비노출</option>
                  </select>
                </label>
                <label>
                  <span>이름</span>
                  <input onChange={(event) => updateEditor("title", event.target.value)} required value={editor.title} />
                </label>
                <label>
                  <span>직책</span>
                  <input onChange={(event) => updateEditor("roleTitle", event.target.value)} placeholder="국제 디렉터" value={editor.roleTitle} />
                </label>
                <label>
                  <span>국가</span>
                  <input onChange={(event) => updateEditor("country", event.target.value)} placeholder="몽골" value={editor.country} />
                </label>
              </div>

              <label>
                <span>학력</span>
                <textarea onChange={(event) => updateEditor("education", event.target.value)} rows={3} value={editor.education} />
              </label>

              {editor.legacyProfileMemo ? (
                <div className="director-legacy-profile-note">
                  <strong>기존 프로필 메모</strong>
                  <p>{editor.legacyProfileMemo}</p>
                </div>
              ) : null}

              <label>
                <span>경력</span>
                <textarea onChange={(event) => updateEditor("career", event.target.value)} rows={4} value={editor.career} />
              </label>

              <label>
                <span>자격</span>
                <textarea onChange={(event) => updateEditor("certifications", event.target.value)} rows={3} value={editor.certifications} />
              </label>

              <label className="community-image-upload">
                <span>
                  <ImagePlus size={16} />
                  사진 업로드
                </span>
                <input
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  name="imageFile"
                  onChange={(event) => handleImageFileChange(event.target.files?.[0])}
                  ref={imageInputRef}
                  type="file"
                />
                <em>{selectedImageName || "JPG, PNG, WebP, GIF"}</em>
              </label>

              {selectedImagePreviewUrl || editor.imageUrl ? (
                <div className="community-image-preview">
                  <img alt="사진 미리보기" src={selectedImagePreviewUrl || editor.imageUrl} />
                  <strong>사진 미리보기</strong>
                </div>
              ) : null}

              <div className="community-editor-actions">
                {selectedItem ? (
                  <button className="danger-button" disabled={isBusy} onClick={handleDelete} type="button">
                    <Trash2 size={16} />
                    삭제
                  </button>
                ) : null}
                <button className="console-primary-button" disabled={isBusy} type="submit">
                  <Save size={16} />
                  저장
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {items.length === 0 ? (
        <section className="console-panel director-fallback-panel">
          <h2>기본 표시 목록</h2>
          <div className="director-fallback-grid">
            {fallbackDirectors.map((director) => (
              <article key={director.slug}>
                <img alt="" src={director.imageUrl} />
                <strong>{director.name}</strong>
                <span>{director.role}</span>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
