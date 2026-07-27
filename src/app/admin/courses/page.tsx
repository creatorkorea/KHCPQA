import { Plus } from "lucide-react";
import {
  AdminConsoleShell,
  AdminFilterBar,
  AdminPagination,
  AdminPanel,
  AdminPrimaryButton,
  AdminRowAction,
  AdminSearchInput,
  AdminSelect,
  AdminStatusBadge,
  AdminTable,
  getTone
} from "@/components/AdminConsole";
import { getAdminContentRows } from "@/lib/admin-data";

export default async function AdminCoursesPage() {
  const contentRows = await getAdminContentRows();
  const courseRows = contentRows
    .filter((row) => row.type === "Course")
    .slice(0, 7)
    .map((row, index) => ({
      id: row.id ?? `${row.slug}-${index}`,
      category: row.summary?.includes("비즈니스") ? "비즈니스" : row.summary?.includes("라이프") ? "라이프스타일" : "웰니스",
      createdAt: row.updatedAt,
      language: row.locale,
      manage: <AdminRowAction />,
      publish: <AdminStatusBadge tone={getTone(row.status)}>{statusLabel(row.status)}</AdminStatusBadge>,
      status: <AdminStatusBadge tone={getTone(index % 3 === 1 ? "translated" : row.status)}>{index % 3 === 1 ? "검수중" : "공개"}</AdminStatusBadge>,
      title: row.title
    }));

  const fallbackRows = [
    ["글로벌 웰니스 기초 과정", "웰니스", "ko", "공개", "공개", "2026.05.18"],
    ["명상 전문가 심화 과정", "웰니스", "ko, en", "검수중", "공개", "2026.05.17"],
    ["스트레스 관리 실전 과정", "라이프스타일", "ko", "임시저장", "임시저장", "2026.05.16"],
    ["수면 개선 프로그램", "라이프스타일", "ko, en, ja", "공개", "공개", "2026.05.15"],
    ["아동상담 입문 과정", "웰니스", "ko", "임시저장", "임시저장", "2026.05.14"]
  ].map(([title, category, language, status, publish, createdAt]) => ({
    id: title,
    category,
    createdAt,
    language,
    manage: <AdminRowAction />,
    publish: <AdminStatusBadge tone={getTone(publish)}>{publish}</AdminStatusBadge>,
    status: <AdminStatusBadge tone={getTone(status)}>{status}</AdminStatusBadge>,
    title
  }));

  return (
    <AdminConsoleShell
      actions={<AdminPrimaryButton icon={Plus}>새 과정 등록</AdminPrimaryButton>}
      active="courses"
      description="교육과정 등록, 수정, 공개 상태, 언어별 콘텐츠를 관리합니다."
      title="과정 관리"
    >
      <AdminPanel>
        <AdminFilterBar>
          <AdminSearchInput placeholder="과정명, 카테고리 검색" />
          <AdminSelect label="과정 유형 전체" />
          <AdminSelect label="언어 전체" />
          <AdminSelect label="게시 상태 전체" />
        </AdminFilterBar>
        <AdminTable
          columns={[
            { key: "title", label: "과정명" },
            { key: "category", label: "카테고리" },
            { key: "language", label: "언어" },
            { key: "status", label: "구매 유형" },
            { key: "publish", label: "상태" },
            { key: "createdAt", label: "수정일" },
            { key: "manage", label: "관리", align: "center" }
          ]}
          rows={courseRows.length ? courseRows : fallbackRows}
        />
        <AdminPagination pages={["1", "2", "3", "4", "5", "...", "16"]} />
      </AdminPanel>
    </AdminConsoleShell>
  );
}

function statusLabel(status: string) {
  if (status === "published") return "공개";
  if (status === "draft") return "임시저장";
  if (status === "translated") return "검수중";
  return status;
}
