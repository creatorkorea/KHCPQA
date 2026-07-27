import { Plus } from "lucide-react";
import {
  AdminConsoleShell,
  AdminPagination,
  AdminPanel,
  AdminPrimaryButton,
  AdminRowAction,
  AdminStatusBadge,
  AdminTable
} from "@/components/AdminConsole";

const rows = [
  ["홈", "/", "노출", "1", "2026.05.18"],
  ["협회소개", "/about", "노출", "2", "2026.05.18"],
  ["교육과정", "/curriculum", "노출", "3", "2026.05.17"],
  ["커뮤니티", "/community", "노출", "4", "2026.05.17"],
  ["공지사항", "/community/notice", "노출", "5", "2026.05.16"],
  ["자료실", "/community/data", "비노출", "6", "2026.05.16"],
  ["문의하기", "/inquiry", "노출", "7", "2026.05.15"]
].map(([name, path, status, order, updatedAt]) => ({
  id: path,
  name,
  path,
  status: <AdminStatusBadge tone={status === "노출" ? "success" : "neutral"}>{status}</AdminStatusBadge>,
  order,
  updatedAt,
  manage: <AdminRowAction />
}));

export default function AdminPagesPage() {
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
          rows={rows}
        />
        <AdminPagination pages={["1", "2"]} />
      </AdminPanel>
    </AdminConsoleShell>
  );
}
