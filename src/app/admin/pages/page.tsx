import { Plus } from "lucide-react";
import {
  AdminConsoleShell,
  AdminPagination,
  AdminPanel,
  AdminPrimaryButton,
  AdminRowAction,
  AdminStatusBadge,
  AdminTable,
  getTone
} from "@/components/AdminConsole";
import { getAdminContentRows } from "@/lib/admin-data";

export default async function AdminPagesPage() {
  const contentRows = await getAdminContentRows();
  const rows = contentRows
    .filter((row) => row.type === "Page")
    .slice(0, 10)
    .map((row, index) => ({
      id: row.id ?? row.slug ?? row.title,
      manage: <AdminRowAction />,
      name: row.title,
      order: index + 1,
      path: pagePath(row.slug),
      status: <AdminStatusBadge tone={getTone(row.status)}>{statusLabel(row.status)}</AdminStatusBadge>,
      updatedAt: row.updatedAt
    }));

  return (
    <AdminConsoleShell
      actions={<AdminPrimaryButton icon={Plus}>새 페이지 등록</AdminPrimaryButton>}
      active="pages"
      description="홈페이지 페이지 구성 및 정보를 관리합니다."
      title="페이지 관리"
    >
      <AdminPanel>
        <AdminTable
          columns={[
            { key: "name", label: "페이지명" },
            { key: "path", label: "경로" },
            { key: "status", label: "노출 상태" },
            { key: "order", label: "정렬 순서", align: "center" },
            { key: "updatedAt", label: "최종 수정일" },
            { key: "manage", label: "관리", align: "center" }
          ]}
          emptyLabel="등록된 페이지 데이터가 없습니다."
          rows={rows}
        />
        <AdminPagination pages={["1"]} />
      </AdminPanel>
    </AdminConsoleShell>
  );
}

function pagePath(slug?: string) {
  if (!slug) return "-";
  return slug === "home" ? "/" : `/${slug.replace(/^\/+/, "")}`;
}

function statusLabel(status: string) {
  if (status === "published") return "노출";
  if (status === "draft") return "임시저장";
  if (status === "archived") return "비노출";
  return status;
}
