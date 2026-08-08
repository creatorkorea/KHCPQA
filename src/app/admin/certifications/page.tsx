import { AdminConsoleShell, AdminPanel } from "@/components/AdminConsole";
import { AdminCertificationsManager } from "@/components/AdminCertificationsManager";
import { getAdminCertifications } from "@/lib/admin-data";

export default async function AdminCertificationsPage() {
  const certifications = await getAdminCertifications();

  return (
    <AdminConsoleShell
      active="certifications"
      description="자격 정보 및 발급 내역을 관리합니다."
      title="자격 데이터"
    >
      <AdminPanel className="admin-certifications-panel">
        <AdminCertificationsManager certifications={certifications} />
      </AdminPanel>
    </AdminConsoleShell>
  );
}
