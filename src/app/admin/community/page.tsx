import { Plus } from "lucide-react";
import {
  AdminConsoleShell,
  AdminPagination,
  AdminPanel,
  AdminPrimaryButton,
  AdminRowAction,
  AdminStatusBadge,
  AdminTable,
  AdminTabs
} from "@/components/AdminConsole";

const rows = [
  ["공지사항", "notice", "23", "노출", "1"],
  ["자유게시판", "free", "156", "노출", "2"],
  ["수강후기", "review", "98", "노출", "3"],
  ["자료실", "data", "47", "노출", "4"],
  ["FAQ", "faq", "32", "비노출", "5"]
].map(([name, type, count, status, order]) => ({
  id: type,
  name,
  type,
  count,
  status: <AdminStatusBadge tone={status === "노출" ? "success" : "neutral"}>{status}</AdminStatusBadge>,
  order,
  manage: <AdminRowAction />
}));

export default function AdminCommunityPage() {
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
          rows={rows}
        />
        <AdminPagination />
      </AdminPanel>
    </AdminConsoleShell>
  );
}
