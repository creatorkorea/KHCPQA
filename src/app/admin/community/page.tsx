import { Plus } from "lucide-react";
import {
  AdminConsoleShell,
  AdminPagination,
  AdminPanel,
  AdminPrimaryButton,
  AdminRowAction,
  AdminStatusBadge,
  AdminTable,
  AdminTabs,
  getTone
} from "@/components/AdminConsole";
import { getAdminContentRows } from "@/lib/admin-data";

export default async function AdminCommunityPage() {
  const contentRows = await getAdminContentRows();
  const activityRows = contentRows.filter((row) => row.type === "Activity");
  const rows = Array.from(groupBySlug(activityRows).entries()).map(([slug, items], index) => {
    const latest = items[0];
    const published = items.some((item) => item.status === "published");

    return {
      id: slug,
      count: items.length,
      manage: <AdminRowAction />,
      name: latest.title,
      order: index + 1,
      status: <AdminStatusBadge tone={getTone(published ? "published" : latest.status)}>{published ? "노출" : statusLabel(latest.status)}</AdminStatusBadge>,
      type: slug
    };
  });

  return (
    <AdminConsoleShell
      actions={<AdminPrimaryButton icon={Plus}>새 게시판 등록</AdminPrimaryButton>}
      active="community"
      description="게시판 및 게시글을 관리합니다."
      title="커뮤니티 관리"
    >
      <AdminPanel>
        <AdminTabs active="게시판 관리" tabs={["게시판 관리", "게시글 관리"]} />
        <AdminTable
          columns={[
            { key: "name", label: "게시판명" },
            { key: "type", label: "게시판 키" },
            { key: "count", label: "게시글 수" },
            { key: "status", label: "노출 상태" },
            { key: "order", label: "정렬 순서", align: "center" },
            { key: "manage", label: "관리", align: "center" }
          ]}
          emptyLabel="등록된 커뮤니티 콘텐츠가 없습니다."
          rows={rows}
        />
        <AdminPagination />
      </AdminPanel>
    </AdminConsoleShell>
  );
}

function groupBySlug<T extends { slug?: string; title: string }>(items: T[]) {
  return items.reduce((groups, item) => {
    const key = item.slug || item.title;
    groups.set(key, [...(groups.get(key) ?? []), item]);
    return groups;
  }, new Map<string, T[]>());
}

function statusLabel(status: string) {
  if (status === "published") return "노출";
  if (status === "draft") return "임시저장";
  if (status === "archived") return "비노출";
  return status;
}
