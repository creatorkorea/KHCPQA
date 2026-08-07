import {
  AdminConsoleShell,
  AdminFilterBar,
  AdminPanel,
  AdminSearchInput,
  AdminSelect,
  AdminStatusBadge,
  AdminTable,
  AdminTabs,
  getTone
} from "@/components/AdminConsole";
import { AdminUsersManager } from "@/components/AdminUsersManager";
import { getAdminUserRoleLabel, getAdminUserStatusLabel } from "@/lib/admin-users";
import { getAdminUsers } from "@/lib/admin-data";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  const rows = users.slice(0, 6).map((user) => ({
    id: user.id,
    email: user.email,
    joinedAt: user.lastLoginAt,
    name: user.name,
    role: getAdminUserRoleLabel(user.role),
    status: <AdminStatusBadge tone={getTone(user.status)}>{getAdminUserStatusLabel(user.status)}</AdminStatusBadge>
  }));

  return (
    <AdminConsoleShell
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
            { key: "joinedAt", label: "수정일" }
          ]}
          emptyLabel="등록된 사용자 데이터가 없습니다."
          rows={rows}
        />
      </AdminPanel>

      <AdminPanel className="admin-users-crud-panel">
        <div className="console-panel-heading">
          <div>
            <h2>사용자 추가 및 편집</h2>
            <p>새 계정 등록, 회원 정보 수정, 삭제 상태 전환을 한 화면에서 처리합니다.</p>
          </div>
        </div>
        <AdminUsersManager users={users} />
      </AdminPanel>
    </AdminConsoleShell>
  );
}
