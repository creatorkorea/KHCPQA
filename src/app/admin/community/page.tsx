import { AdminConsoleShell } from "@/components/AdminConsole";
import { AdminCommunityManager } from "@/components/AdminCommunityManager";
import { getAdminContentRows } from "@/lib/admin-data";
import { getActivityGroups } from "@/lib/content";

export default async function AdminCommunityPage() {
  const contentRows = await getAdminContentRows();
  const activityRows = contentRows.filter((row) => row.type === "Activity");
  const activityOptions = getActivityGroups("ko").map((group) => ({
    key: group.key,
    title: group.title
  }));

  return (
    <AdminConsoleShell
      active="community"
      description="게시판 및 게시글을 관리합니다."
      title="커뮤니티 관리"
    >
      <AdminCommunityManager activityOptions={activityOptions} items={activityRows} />
    </AdminConsoleShell>
  );
}
