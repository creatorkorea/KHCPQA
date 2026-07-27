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
    .map((row) => ({
      id: row.id ?? row.slug ?? row.title,
      category: categoryLabel(row.summary),
      createdAt: row.updatedAt,
      language: row.locale,
      manage: <AdminRowAction />,
      publish: <AdminStatusBadge tone={getTone(row.status)}>{statusLabel(row.status)}</AdminStatusBadge>,
      purchaseType: "-",
      title: row.title
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
            { key: "purchaseType", label: "구매 유형" },
            { key: "publish", label: "상태" },
            { key: "createdAt", label: "수정일" },
            { key: "manage", label: "관리", align: "center" }
          ]}
          emptyLabel="등록된 과정 데이터가 없습니다."
          rows={courseRows}
        />
        {courseRows.length ? <AdminPagination pages={["1"]} /> : null}
      </AdminPanel>
    </AdminConsoleShell>
  );
}

function categoryLabel(summary?: string) {
  if (!summary) return "-";
  if (summary.includes("비즈니스")) return "비즈니스";
  if (summary.includes("라이프")) return "라이프스타일";
  if (summary.includes("웰니스")) return "웰니스";
  return "-";
}

function statusLabel(status: string) {
  if (status === "published") return "공개";
  if (status === "draft") return "임시저장";
  if (status === "translated") return "검수중";
  return status;
}
