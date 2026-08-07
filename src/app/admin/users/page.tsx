import {
  AdminConsoleShell,
  AdminFilterBar,
  AdminPanel,
  AdminSearchInput,
  AdminSelect,
  AdminTabs
} from "@/components/AdminConsole";
import { AdminUsersManager } from "@/components/AdminUsersManager";
import { getAdminUsers } from "@/lib/admin-data";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

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
        <AdminUsersManager users={users} />
      </AdminPanel>
    </AdminConsoleShell>
  );
}
