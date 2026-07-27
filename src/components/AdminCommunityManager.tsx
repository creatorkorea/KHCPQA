"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import { Edit3, FilePlus2, FolderPlus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  deleteAdminManagedItem,
  saveAdminContent,
  type DeleteAdminContentResult,
  type SaveAdminContentResult
} from "@/app/admin/actions";
import { AdminStatusBadge, AdminTable, getTone } from "@/components/AdminConsole";
import type { AdminContentRow } from "@/lib/admin-data";

type ActivityOption = {
  key: string;
  title: string;
};

type CommunityMode = "boards" | "posts";
type EditorKind = "board" | "post";
type ActionResult = SaveAdminContentResult | DeleteAdminContentResult;

type EditorState = {
  boardKey: string;
  body: string;
  imageUrl: string;
  kind: EditorKind;
  locale: string;
  sourceUrl: string;
  slug: string;
  status: string;
  summary: string;
  title: string;
};

type BoardSummary = {
  count: number;
  id: string;
  intro?: AdminContentRow;
  key: string;
  latest: AdminContentRow;
  postCount: number;
  published: boolean;
  title: string;
};

const blankEditor: EditorState = {
  boardKey: "",
  body: "",
  imageUrl: "",
  kind: "board",
  locale: "ko",
  sourceUrl: "",
  slug: "",
  status: "draft",
  summary: "",
  title: ""
};

const localeLabels: Record<string, string> = {
  en: "English",
  es: "Español",
  ko: "한국어"
};

const statusLabels: Record<string, string> = {
  archived: "비노출",
  draft: "임시저장",
  published: "노출",
  reviewed: "검수 완료",
  translated: "번역 완료"
};

export function AdminCommunityManager({
  activityOptions,
  items
}: {
  activityOptions: ActivityOption[];
  items: AdminContentRow[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CommunityMode>("boards");
  const [boardFilter, setBoardFilter] = useState("");
  const [editor, setEditor] = useState<EditorState>(blankEditor);
  const [localeFilter, setLocaleFilter] = useState("");
  const [result, setResult] = useState<ActionResult | null>(null);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<AdminContentRow | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [isPending, startTransition] = useTransition();

  const boardKeys = useMemo(() => buildKnownBoardKeys(activityOptions, items), [activityOptions, items]);
  const optionTitleByKey = useMemo(
    () => new Map(activityOptions.map((option) => [option.key, option.title])),
    [activityOptions]
  );
  const boards = useMemo(() => buildBoards(items, boardKeys, optionTitleByKey), [boardKeys, items, optionTitleByKey]);
  const boardTitleByKey = useMemo(
    () => new Map(boards.map((board) => [board.key, board.title])),
    [boards]
  );
  const filteredBoards = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return boards.filter((board) => {
      const matchesKeyword =
        !keyword ||
        board.key.toLowerCase().includes(keyword) ||
        board.title.toLowerCase().includes(keyword) ||
        board.latest.summary?.toLowerCase().includes(keyword);
      const matchesLocale = !localeFilter || board.latest.locale === localeFilter;
      const matchesStatus = !statusFilter || board.latest.status === statusFilter || (statusFilter === "published" && board.published);

      return matchesKeyword && matchesLocale && matchesStatus;
    });
  }, [boards, localeFilter, search, statusFilter]);
  const postItems = useMemo(
    () => items.filter((item) => !isBoardIntro(item, boardKeys)),
    [boardKeys, items]
  );
  const filteredPosts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return postItems.filter((item) => {
      const boardKey = getBoardKey(item.slug ?? "", boardKeys);
      const matchesKeyword =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.slug?.toLowerCase().includes(keyword) ||
        item.summary?.toLowerCase().includes(keyword);
      const matchesBoard = !boardFilter || boardKey === boardFilter;
      const matchesLocale = !localeFilter || item.locale === localeFilter;
      const matchesStatus = !statusFilter || item.status === statusFilter;

      return matchesKeyword && matchesBoard && matchesLocale && matchesStatus;
    });
  }, [boardFilter, boardKeys, localeFilter, postItems, search, statusFilter]);
  const boardRows = filteredBoards.map((board, index) => ({
    count: board.postCount,
    id: board.id,
    manage: (
      <button
        aria-label={`${board.title} 게시판 수정`}
        className="console-row-action"
        onClick={() => selectBoard(board)}
        type="button"
      >
        <Edit3 size={14} />
      </button>
    ),
    name: (
      <button className="community-link-button" onClick={() => selectBoard(board)} type="button">
        {board.title}
      </button>
    ),
    order: index + 1,
    status: (
      <AdminStatusBadge tone={getTone(board.published ? "published" : board.latest.status)}>
        {board.published ? "노출" : statusLabel(board.latest.status)}
      </AdminStatusBadge>
    ),
    type: <code className="community-code">{board.key}</code>
  }));
  const postRows = filteredPosts.map((item) => {
    const boardKey = getBoardKey(item.slug ?? "", boardKeys);

    return {
      board: boardTitleByKey.get(boardKey) ?? boardKey,
      id: item.id ?? `${item.locale}-${item.slug}`,
      locale: localeLabels[item.locale] ?? item.locale,
      manage: (
        <button
          aria-label={`${item.title} 게시글 수정`}
          className="console-row-action"
          onClick={() => selectPost(item)}
          type="button"
        >
          <Edit3 size={14} />
        </button>
      ),
      slug: <code className="community-code">{item.slug}</code>,
      status: <AdminStatusBadge tone={getTone(item.status)}>{statusLabel(item.status)}</AdminStatusBadge>,
      title: (
        <button className="community-link-button" onClick={() => selectPost(item)} type="button">
          {item.title}
        </button>
      ),
      updatedAt: item.updatedAt
    };
  });

  function resetFilters(nextTab: CommunityMode) {
    setActiveTab(nextTab);
    setBoardFilter("");
    setLocaleFilter("");
    setSearch("");
    setStatusFilter("");
  }

  function startCreate(kind: EditorKind) {
    const firstBoardKey = boards[0]?.key ?? "";
    setSelectedItem(null);
    setResult(null);
    setEditor({
      ...blankEditor,
      boardKey: kind === "post" ? firstBoardKey : "",
      kind,
      slug: kind === "post" && firstBoardKey ? `${firstBoardKey}-` : ""
    });
  }

  function selectBoard(board: BoardSummary) {
    const item = board.intro ?? board.latest;
    setSelectedItem(item);
    setResult(null);
    setEditor({
      boardKey: board.key,
      body: item.body ?? "",
      imageUrl: item.imageUrl ?? "",
      kind: "board",
      locale: item.locale,
      sourceUrl: item.sourceUrl ?? "",
      slug: board.key,
      status: item.status,
      summary: item.summary ?? "",
      title: item.title
    });
  }

  function selectPost(item: AdminContentRow) {
    setSelectedItem(item);
    setResult(null);
    setEditor({
      boardKey: getBoardKey(item.slug ?? "", boardKeys),
      body: item.body ?? "",
      imageUrl: item.imageUrl ?? "",
      kind: "post",
      locale: item.locale,
      sourceUrl: item.sourceUrl ?? "",
      slug: item.slug ?? "",
      status: item.status,
      summary: item.summary ?? "",
      title: item.title
    });
  }

  function updateEditor(name: keyof EditorState, value: string) {
    setEditor((current) => {
      if (name === "kind") {
        return {
          ...current,
          kind: value as EditorKind,
          slug: value === "board" ? current.boardKey : current.slug
        };
      }

      if (name === "boardKey" && current.kind === "board") {
        return { ...current, boardKey: value, slug: value };
      }

      if (name === "boardKey" && current.kind === "post" && (!current.slug || current.slug.endsWith("-"))) {
        return { ...current, boardKey: value, slug: value ? `${value}-` : current.slug };
      }

      return { ...current, [name]: value };
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    const slug = (editor.kind === "board" ? editor.boardKey : editor.slug).trim().toLowerCase();

    startTransition(async () => {
      const nextResult = await saveAdminContent({
        body: editor.body,
        contentType: "Activity",
        imageUrl: editor.imageUrl,
        locale: editor.locale,
        slug,
        sourceUrl: editor.sourceUrl,
        status: editor.status,
        summary: editor.summary,
        title: editor.title
      });

      setResult(nextResult);

      if (nextResult.ok) {
        setSelectedItem(null);
        setEditor(blankEditor);
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!selectedItem?.id) {
      return;
    }

    const confirmed = window.confirm(`"${selectedItem.title}" 항목을 삭제할까요? 공개 화면에서도 사라질 수 있습니다.`);

    if (!confirmed) {
      return;
    }

    setResult(null);
    startTransition(async () => {
      const nextResult = await deleteAdminManagedItem({
        id: selectedItem.id ?? "",
        itemType: "content"
      });

      setResult(nextResult);

      if (nextResult.ok) {
        setSelectedItem(null);
        setEditor(blankEditor);
        router.refresh();
      }
    });
  }

  return (
    <div className="community-manager">
      <section className="console-panel community-list-panel">
        <div className="community-panel-top">
          <div className="console-tabs community-tabs" role="tablist" aria-label="커뮤니티 관리 탭">
            <button className={activeTab === "boards" ? "is-active" : undefined} onClick={() => resetFilters("boards")} type="button">
              게시판 관리
            </button>
            <button className={activeTab === "posts" ? "is-active" : undefined} onClick={() => resetFilters("posts")} type="button">
              게시글 관리
            </button>
          </div>
          <div className="community-actions">
            <button className="secondary-button" onClick={() => startCreate("post")} type="button">
              <FilePlus2 size={16} />
              새 게시글 등록
            </button>
            <button className="console-primary-button" onClick={() => startCreate("board")} type="button">
              <FolderPlus size={16} />
              새 게시판 등록
            </button>
          </div>
        </div>

        <div className="console-filter-bar">
          <label className="console-search-input">
            <span className="sr-only">커뮤니티 검색</span>
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder={activeTab === "boards" ? "게시판명, 키, 설명 검색" : "제목, slug, 요약 검색"}
              value={search}
            />
          </label>
          {activeTab === "posts" ? (
            <label className="console-select">
              <span className="sr-only">게시판 필터</span>
              <select onChange={(event) => setBoardFilter(event.target.value)} value={boardFilter}>
                <option value="">게시판 전체</option>
                {boards.map((board) => (
                  <option key={board.key} value={board.key}>
                    {board.title}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="console-select">
            <span className="sr-only">언어 필터</span>
            <select onChange={(event) => setLocaleFilter(event.target.value)} value={localeFilter}>
              <option value="">언어 전체</option>
              {Object.entries(localeLabels).map(([value, label]) => (
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

        {activeTab === "boards" ? (
          <AdminTable
            columns={[
              { key: "name", label: "게시판명" },
              { key: "type", label: "게시판 키" },
              { key: "count", label: "게시글 수", align: "center" },
              { key: "status", label: "노출 상태", align: "center" },
              { key: "order", label: "정렬 순서", align: "center" },
              { key: "manage", label: "관리", align: "center" }
            ]}
            emptyLabel="등록된 커뮤니티 게시판이 없습니다."
            rows={boardRows}
          />
        ) : (
          <AdminTable
            columns={[
              { key: "title", label: "제목" },
              { key: "board", label: "게시판" },
              { key: "slug", label: "Slug" },
              { key: "locale", label: "언어", align: "center" },
              { key: "status", label: "상태", align: "center" },
              { key: "updatedAt", label: "최종 수정일", align: "center" },
              { key: "manage", label: "관리", align: "center" }
            ]}
            emptyLabel="등록된 커뮤니티 게시글이 없습니다."
            rows={postRows}
          />
        )}
      </section>

      <section className="console-panel community-editor-panel">
        <form className="admin-editor-form community-editor-form" onSubmit={handleSubmit}>
          <div className="community-editor-heading">
            <div>
              <h2>{selectedItem ? "커뮤니티 콘텐츠 수정" : "커뮤니티 콘텐츠 등록"}</h2>
              <p>관리자에서 등록한 내용만 공개 화면의 글로벌 활동 콘텐츠로 노출됩니다.</p>
            </div>
            {selectedItem ? (
              <button aria-label="선택 해제" className="console-row-action" onClick={() => {
                setSelectedItem(null);
                setEditor(blankEditor);
                setResult(null);
              }} type="button">
                <X size={14} />
              </button>
            ) : null}
          </div>

          <div className="admin-editor-grid">
            <label>
              관리 유형
              <select
                onChange={(event) => updateEditor("kind", event.target.value)}
                value={editor.kind}
                disabled={Boolean(selectedItem)}
              >
                <option value="board">게시판</option>
                <option value="post">게시글</option>
              </select>
            </label>
            <label>
              언어
              <select onChange={(event) => updateEditor("locale", event.target.value)} value={editor.locale}>
                {Object.entries(localeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              게시판 키
              {editor.kind === "post" && boards.length > 0 ? (
                <select onChange={(event) => updateEditor("boardKey", event.target.value)} value={editor.boardKey}>
                  <option value="">선택 안 함</option>
                  {boards.map((board) => (
                    <option key={board.key} value={board.key}>
                      {board.title} ({board.key})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  onChange={(event) => updateEditor("boardKey", normalizeSlugInput(event.target.value))}
                  placeholder="notice"
                  required={editor.kind === "board"}
                  value={editor.boardKey}
                  disabled={Boolean(selectedItem)}
                />
              )}
            </label>
            <label>
              Slug
              <input
                onChange={(event) => updateEditor("slug", normalizeSlugInput(event.target.value))}
                placeholder={editor.kind === "board" ? "notice" : "notice-20260727"}
                required
                value={editor.kind === "board" ? editor.boardKey : editor.slug}
                disabled={editor.kind === "board" || Boolean(selectedItem)}
              />
            </label>
            <label>
              게시 상태
              <select onChange={(event) => updateEditor("status", event.target.value)} value={editor.status}>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              대표 이미지 URL
              <input
                onChange={(event) => updateEditor("imageUrl", event.target.value)}
                placeholder="/assets/community/example.jpg 또는 https://..."
                value={editor.imageUrl}
              />
            </label>
            <label className="full">
              제목
              <input
                onChange={(event) => updateEditor("title", event.target.value)}
                placeholder="게시판명 또는 게시글 제목"
                required
                value={editor.title}
              />
            </label>
            <label className="full">
              요약
              <textarea
                onChange={(event) => updateEditor("summary", event.target.value)}
                placeholder="목록 카드와 상세 상단에 표시할 요약"
                rows={3}
                value={editor.summary}
              />
            </label>
            <label className="full">
              상세 본문
              <textarea
                onChange={(event) => updateEditor("body", event.target.value)}
                placeholder="상세 페이지에 표시할 본문"
                rows={5}
                value={editor.body}
              />
            </label>
            <label className="full">
              원본 URL
              <input
                onChange={(event) => updateEditor("sourceUrl", event.target.value)}
                placeholder="외부 자료나 보도 링크"
                value={editor.sourceUrl}
              />
            </label>
          </div>

          {selectedItem ? (
            <p className="community-editor-note">기존 항목의 Slug는 공개 URL과 연결되어 있어 이 화면에서는 고정됩니다.</p>
          ) : null}

          {result ? (
            <p className={result.ok ? "community-result is-success" : "community-result is-error"}>{result.message}</p>
          ) : null}

          <div className="admin-editor-actions">
            <button className="primary-button" disabled={isPending} type="submit">
              <Save size={16} />
              {isPending ? "저장 중" : "저장"}
            </button>
            {selectedItem?.id ? (
              <button className="secondary-button danger" disabled={isPending} onClick={handleDelete} type="button">
                <Trash2 size={16} />
                삭제
              </button>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}

function buildKnownBoardKeys(activityOptions: ActivityOption[], items: AdminContentRow[]) {
  const keys = new Set(activityOptions.map((option) => option.key));

  items.forEach((item) => {
    const slug = item.slug ?? "";

    if (!slug) {
      return;
    }

    if (!slug.includes("-")) {
      keys.add(slug);
    }
  });

  return Array.from(keys).sort((a, b) => b.length - a.length);
}

function buildBoards(items: AdminContentRow[], boardKeys: string[], optionTitleByKey: Map<string, string>) {
  const groups = new Map<string, AdminContentRow[]>();

  items.forEach((item) => {
    const key = getBoardKey(item.slug ?? "", boardKeys);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  });

  return Array.from(groups.entries())
    .map(([key, groupItems]) => {
      const sortedItems = [...groupItems].sort((a, b) => (b.updatedAtRaw ?? b.updatedAt).localeCompare(a.updatedAtRaw ?? a.updatedAt));
      const intro = sortedItems.find((item) => item.slug === key);
      const latest = sortedItems[0];

      return {
        count: sortedItems.length,
        id: intro?.id ?? latest.id ?? key,
        intro,
        key,
        latest,
        postCount: sortedItems.filter((item) => item.slug !== key).length,
        published: sortedItems.some((item) => item.status === "published"),
        title: intro?.title ?? optionTitleByKey.get(key) ?? latest.title ?? key
      };
    })
    .sort((a, b) => (b.latest.updatedAtRaw ?? b.latest.updatedAt).localeCompare(a.latest.updatedAtRaw ?? a.latest.updatedAt));
}

function getBoardKey(slug: string, boardKeys: string[]) {
  const matchedKey = boardKeys.find((key) => slug === key || slug.startsWith(`${key}-`));

  if (matchedKey) {
    return matchedKey;
  }

  return slug.includes("-") ? slug.split("-")[0] : slug;
}

function isBoardIntro(item: AdminContentRow, boardKeys: string[]) {
  const slug = item.slug ?? "";
  return boardKeys.includes(slug);
}

function normalizeSlugInput(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
}

function statusLabel(status: string) {
  return statusLabels[status] ?? status;
}
