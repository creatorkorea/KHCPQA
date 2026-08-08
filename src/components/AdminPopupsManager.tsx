"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useRef, useState, useTransition, type FormEvent } from "react";
import { Edit3, ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  deleteAdminManagedItem,
  saveAdminBanner,
  uploadAdminContentImage,
  type DeleteAdminContentResult,
  type SaveAdminContentResult,
  type UploadAdminContentImageResult
} from "@/app/admin/actions";
import { AdminStatusBadge, AdminTable, AdminThumbnail, getTone } from "@/components/AdminConsole";
import type { AdminContentRow } from "@/lib/admin-data";

type PendingAction = "delete" | "save";
type ActionResult = SaveAdminContentResult | DeleteAdminContentResult | UploadAdminContentImageResult;

type BannerEditorState = {
  endsAt: string;
  imageUrl: string;
  placement: string;
  startsAt: string;
  status: string;
  targetUrl: string;
  title: string;
};

const blankEditor: BannerEditorState = {
  endsAt: "",
  imageUrl: "",
  placement: "home",
  startsAt: "",
  status: "draft",
  targetUrl: "",
  title: ""
};

const placementLabels: Record<string, string> = {
  activities: "활동 배너",
  curriculum: "과정 배너",
  global: "공통 배너",
  home: "메인 팝업"
};

const statusLabels: Record<string, string> = {
  archived: "종료",
  draft: "임시저장",
  published: "노출중"
};

export function AdminPopupsManager({ banners }: { banners: AdminContentRow[] }) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [editor, setEditor] = useState<BannerEditorState>(blankEditor);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [placementFilter, setPlacementFilter] = useState("");
  const [result, setResult] = useState<ActionResult | null>(null);
  const [search, setSearch] = useState("");
  const [selectedBanner, setSelectedBanner] = useState<AdminContentRow | null>(null);
  const [selectedImageName, setSelectedImageName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isPending, startTransition] = useTransition();
  const isBusy = isPending || pendingAction !== null;

  const filteredBanners = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return banners.filter((banner) => {
      const matchesKeyword =
        !keyword ||
        banner.title.toLowerCase().includes(keyword) ||
        banner.locale.toLowerCase().includes(keyword) ||
        banner.sourceUrl?.toLowerCase().includes(keyword);
      const matchesPlacement = !placementFilter || banner.locale === placementFilter;
      const matchesStatus = !statusFilter || banner.status === statusFilter;

      return matchesKeyword && matchesPlacement && matchesStatus;
    });
  }, [banners, placementFilter, search, statusFilter]);

  const rows = filteredBanners.map((banner) => ({
    id: banner.id ?? banner.title,
    image: <AdminThumbnail alt={banner.title} src={banner.imageUrl || ""} />,
    manage: (
      <button
        aria-label={`${banner.title} 수정`}
        className="console-row-action"
        onClick={() => selectBanner(banner)}
        type="button"
      >
        <Edit3 size={14} />
      </button>
    ),
    period: formatPeriod(banner.startsAt, banner.endsAt),
    placement: placementLabel(banner.locale),
    status: <AdminStatusBadge tone={getTone(banner.status)}>{statusLabel(banner.status)}</AdminStatusBadge>,
    target: banner.sourceUrl ? (
      <a className="popup-target-link" href={banner.sourceUrl}>
        {banner.sourceUrl}
      </a>
    ) : "-",
    title: (
      <button className="community-link-button" onClick={() => selectBanner(banner)} type="button">
        {banner.title}
      </button>
    ),
    updatedAt: banner.updatedAt
  }));

  function startCreate() {
    setEditor(blankEditor);
    setIsEditorOpen(true);
    setResult(null);
    setSelectedBanner(null);
    resetImageInput();
  }

  function selectBanner(banner: AdminContentRow) {
    setEditor({
      endsAt: banner.endsAt?.slice(0, 10) ?? "",
      imageUrl: banner.imageUrl ?? "",
      placement: banner.locale,
      startsAt: banner.startsAt?.slice(0, 10) ?? "",
      status: banner.status,
      targetUrl: banner.sourceUrl ?? "",
      title: banner.title
    });
    setIsEditorOpen(true);
    setResult(null);
    setSelectedBanner(banner);
    resetImageInput();
  }

  function closeEditor() {
    setEditor(blankEditor);
    setIsEditorOpen(false);
    setResult(null);
    setSelectedBanner(null);
    resetImageInput();
  }

  function resetFilters() {
    setPlacementFilter("");
    setSearch("");
    setStatusFilter("");
  }

  function resetImageInput() {
    setSelectedImageName("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function updateEditor(name: keyof BannerEditorState, value: string) {
    setEditor((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    const formData = new FormData(event.currentTarget);

    setPendingAction("save");
    startTransition(async () => {
      try {
        let imageUrl = editor.imageUrl;
        const imageFile = formData.get("imageFile");

        if (imageFile instanceof File && imageFile.size > 0) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", imageFile);
          uploadFormData.append("contentType", "Banner");
          uploadFormData.append("slug", editor.title || editor.placement);

          const uploadResult = await uploadAdminContentImage(uploadFormData);

          if (!uploadResult.ok || !uploadResult.url) {
            setResult(uploadResult);
            return;
          }

          imageUrl = uploadResult.url;
        }

        const nextResult = await saveAdminBanner({
          endsAt: editor.endsAt,
          id: selectedBanner?.id ?? "",
          imageUrl,
          placement: editor.placement,
          startsAt: editor.startsAt,
          status: editor.status,
          targetUrl: editor.targetUrl,
          title: editor.title
        });

        setResult(nextResult);

        if (nextResult.ok) {
          closeEditor();
          router.refresh();
        }
      } finally {
        setPendingAction(null);
      }
    });
  }

  function handleDelete() {
    if (!selectedBanner?.id) {
      return;
    }

    const confirmed = window.confirm(`"${selectedBanner.title}" 팝업/배너를 삭제할까요? 공개 화면에서도 사라질 수 있습니다.`);

    if (!confirmed) {
      return;
    }

    setPendingAction("delete");
    setResult(null);
    startTransition(async () => {
      try {
        const nextResult = await deleteAdminManagedItem({
          id: selectedBanner.id ?? "",
          itemType: "banner"
        });

        setResult(nextResult);

        if (nextResult.ok) {
          closeEditor();
          router.refresh();
        }
      } finally {
        setPendingAction(null);
      }
    });
  }

  return (
    <div className="community-manager popup-manager">
      {isBusy ? <AdminActionOverlay action={pendingAction ?? "save"} /> : null}
      <section className="console-panel community-list-panel">
        <div className="community-panel-top">
          <div className="console-tabs" role="tablist" aria-label="팝업/배너 관리 탭">
            <button className="is-active" type="button">
              팝업/배너 목록
            </button>
          </div>
          <div className="community-actions">
            <button className="secondary-button" onClick={resetFilters} type="button">
              초기화
            </button>
            <button className="console-primary-button" onClick={startCreate} type="button">
              <Plus size={16} />
              새 팝업 등록
            </button>
          </div>
        </div>

        <div className="console-filter-bar">
          <label className="console-search-input">
            <span className="sr-only">팝업/배너 검색</span>
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="제목, 위치, 연결 URL 검색"
              value={search}
            />
          </label>
          <label className="console-select">
            <span className="sr-only">노출 위치 필터</span>
            <select onChange={(event) => setPlacementFilter(event.target.value)} value={placementFilter}>
              <option value="">노출 위치 전체</option>
              {Object.entries(placementLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="console-select">
            <span className="sr-only">상태 필터</span>
            <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
              <option value="">상태 전체</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <AdminTable
          columns={[
            { key: "image", label: "" },
            { key: "title", label: "제목" },
            { key: "placement", label: "노출 위치", align: "center" },
            { key: "period", label: "노출 기간", align: "center" },
            { key: "status", label: "상태", align: "center" },
            { key: "target", label: "연결 URL" },
            { key: "updatedAt", label: "수정일", align: "center" },
            { key: "manage", label: "관리", align: "center" }
          ]}
          emptyLabel="등록된 팝업/배너 데이터가 없습니다."
          rows={rows}
        />
      </section>

      {!isEditorOpen ? (
        <section className="console-panel community-helper-card">
          <div>
            <strong>메인 팝업과 공개 화면 배너를 등록해 필요한 캠페인만 노출하세요.</strong>
            <p>이미지 파일 업로드, 노출 위치, 게시 상태, 기간, 연결 URL을 한 화면에서 관리합니다.</p>
          </div>
          <button className="console-primary-button" onClick={startCreate} type="button">
            <ImagePlus size={16} />
            새 팝업 등록
          </button>
        </section>
      ) : (
        <section className="console-panel community-editor-panel" aria-busy={isBusy} aria-live="polite">
          <form className="admin-editor-form community-editor-form" onSubmit={handleSubmit}>
            <div className="community-editor-heading">
              <div>
                <span className="community-editor-kicker">팝업/배너 콘텐츠</span>
                <h2>{selectedBanner ? "팝업/배너 수정" : "새 팝업/배너 등록"}</h2>
                <p>노출 위치와 기간을 설정하고 대표 이미지를 등록합니다.</p>
              </div>
              <button aria-label="편집 패널 닫기" className="console-row-action" onClick={closeEditor} type="button">
                <X size={14} />
              </button>
            </div>

            <div className="admin-editor-grid">
              <label>
                제목
                <input
                  onChange={(event) => updateEditor("title", event.target.value)}
                  placeholder="파트너 상담 CTA"
                  required
                  value={editor.title}
                />
              </label>
              <label>
                노출 위치
                <select onChange={(event) => updateEditor("placement", event.target.value)} required value={editor.placement}>
                  {Object.entries(placementLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                게시 상태
                <select onChange={(event) => updateEditor("status", event.target.value)} required value={editor.status}>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                연결 URL
                <input
                  onChange={(event) => updateEditor("targetUrl", event.target.value)}
                  placeholder="/ko/contact 또는 https://..."
                  value={editor.targetUrl}
                />
              </label>
              <label>
                시작일
                <input
                  onChange={(event) => updateEditor("startsAt", event.target.value)}
                  placeholder="2026-08-08"
                  type="date"
                  value={editor.startsAt}
                />
              </label>
              <label>
                종료일
                <input
                  onChange={(event) => updateEditor("endsAt", event.target.value)}
                  placeholder="2026-08-31"
                  type="date"
                  value={editor.endsAt}
                />
              </label>
              <label className="full">
                이미지 URL
                <input
                  onChange={(event) => updateEditor("imageUrl", event.target.value)}
                  placeholder="/assets/banner-image.jpg 또는 https://..."
                  value={editor.imageUrl}
                />
                <span className="admin-field-help">직접 URL을 입력하거나 아래에서 이미지 파일을 업로드할 수 있습니다.</span>
              </label>
              <label className="full community-file-upload">
                <ImagePlus size={20} />
                <span>
                  <strong>{selectedImageName || "이미지 파일 선택"}</strong>
                  <small>JPG, PNG, WebP, GIF / 최대 5MB</small>
                </span>
                <input
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  name="imageFile"
                  onChange={(event) => setSelectedImageName(event.target.files?.[0]?.name ?? "")}
                  ref={imageInputRef}
                  type="file"
                />
              </label>
            </div>

            {editor.imageUrl ? (
              <div className="community-image-preview popup-image-preview">
                <img alt={editor.title || "팝업 이미지 미리보기"} src={editor.imageUrl} />
                <div>
                  <strong>{editor.title || "이미지 미리보기"}</strong>
                  <button onClick={() => updateEditor("imageUrl", "")} type="button">
                    이미지 URL 제거
                  </button>
                </div>
              </div>
            ) : null}

            {result ? (
              <p className={`community-result ${result.ok ? "is-success" : "is-error"}`} role="status">
                {result.message}
              </p>
            ) : null}

            <div className="admin-editor-actions">
              <button className="primary-button" disabled={isBusy} type="submit">
                <Save size={16} />
                <span>{isBusy ? "저장 중" : selectedBanner ? "수정 저장" : "팝업 등록"}</span>
              </button>
              {selectedBanner?.id ? (
                <button className="secondary-button danger" disabled={isBusy} onClick={handleDelete} type="button">
                  <Trash2 size={16} />
                  선택 항목 삭제
                </button>
              ) : null}
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

function placementLabel(value: string) {
  return placementLabels[value] ?? "하단 팝업";
}

function statusLabel(status: string) {
  return statusLabels[status] ?? status;
}

function formatPeriod(startsAt?: string, endsAt?: string) {
  if (!startsAt && !endsAt) {
    return "상시";
  }

  return `${startsAt || "-"} ~ ${endsAt || "-"}`;
}

function AdminActionOverlay({ action }: { action: PendingAction }) {
  return (
    <div className="admin-action-overlay" role="status" aria-live="polite">
      <div className="admin-action-loader">
        <span className="admin-action-spinner" aria-hidden="true" />
        <strong>{action === "delete" ? "삭제 중입니다" : "저장 중입니다"}</strong>
        <p>{action === "delete" ? "선택한 팝업/배너를 삭제하고 목록을 갱신합니다." : "이미지 업로드와 배너 정보를 저장하고 있습니다."}</p>
        <span className="admin-action-progress" aria-hidden="true">
          <span />
        </span>
      </div>
    </div>
  );
}
