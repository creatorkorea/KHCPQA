import { AdminConsoleShell } from "@/components/AdminConsole";
import { AdminPopupsManager } from "@/components/AdminPopupsManager";
import { getAdminContentRows } from "@/lib/admin-data";

export default async function AdminPopupsPage() {
  const contentRows = await getAdminContentRows();
  const bannerRows = contentRows.filter((row) => row.type === "Banner");

  return (
    <AdminConsoleShell
      active="popups"
      description="팝업 이미지 및 배너 등록/수정/노출여부를 관리합니다."
      title="팝업/배너 관리"
    >
      <AdminPopupsManager banners={bannerRows} />
    </AdminConsoleShell>
  );
}
