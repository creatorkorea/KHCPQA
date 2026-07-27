import { Plus } from "lucide-react";
import {
  AdminConsoleShell,
  AdminFilterBar,
  AdminPanel,
  AdminPrimaryButton,
  AdminRowAction,
  AdminSearchInput,
  AdminSelect,
  AdminStatusBadge,
  AdminTable,
  AdminTabs,
  getTone
} from "@/components/AdminConsole";
import { getAdminUsers } from "@/lib/admin-data";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  const rows = users.slice(0, 6).map((user) => ({
    id: user.id,
    email: user.email,
    joinedAt: user.lastLoginAt,
    manage: <AdminRowAction />,
    name: user.name,
    role: user.role,
    status: <AdminStatusBadge tone={getTone(user.status)}>{user.status === "active" ? "활성" : "비활성"}</AdminStatusBadge>
  }));

  return (
    <AdminConsoleShell
      actions={<AdminPrimaryButton icon={Plus}>새 사용자 등록</AdminPrimaryButton>}
      active="users"
      description="사용자 정보를 관리하고 권한을 설정합니다."
      title="사용자 관리"
    >
      <AdminPanel>
        <AdminTabs active="사용자 목록" tabs={["사용자 목록", "역할 관리"]} />
        <AdminFilterBar>
          <AdminSearchInput placeholder="이름, 이메일 검색" />
          <AdminSelect label="역할 전체" />
          <AdminSelect label="상태 전체" />
        </AdminFilterBar>
        <AdminTable
          columns={[
            { key: "name", label: "이름" },
            { key: "email", label: "이메일" },
            { key: "role", label: "역할" },
            { key: "status", label: "상태" },
            { key: "joinedAt", label: "가입일" },
            { key: "manage", label: "관리", align: "center" }
          ]}
          emptyLabel="등록된 사용자 데이터가 없습니다."
          rows={rows}
        />
      </AdminPanel>
    </AdminConsoleShell>
  );
}
