import { AdminConsoleShell, AdminPanel } from "@/components/AdminConsole";
import { AdminCertificationsManager } from "@/components/AdminCertificationsManager";
import { getAdminCertifications } from "@/lib/admin-data";
import { getCourses } from "@/lib/content";

export default async function AdminCertificationsPage() {
  const certifications = await getAdminCertifications();
  const courseOptions = getCourses("ko").map((course) => ({
    category: course.category,
    title: course.title
  }));

  return (
    <AdminConsoleShell
      active="certifications"
      description="자격 정보 및 발급 내역을 관리합니다."
      title="자격 데이터"
    >
      <AdminPanel className="admin-certifications-panel">
        <AdminCertificationsManager certifications={certifications} courseOptions={courseOptions} />
      </AdminPanel>
    </AdminConsoleShell>
  );
}
