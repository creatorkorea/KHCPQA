import { AdminConsoleShell } from "@/components/AdminConsole";
import { AdminTranslationsManager } from "@/components/AdminTranslationsManager";
import { getAdminContentRows, getAdminCourses } from "@/lib/admin-data";

export default async function AdminTranslationsPage() {
  const [contentItems, courses] = await Promise.all([getAdminContentRows(), getAdminCourses()]);

  return (
    <AdminConsoleShell
      active="translations"
      description="페이지·과정·커뮤니티의 KO 원문과 EN·ES·ZH-CN 번역 상태를 함께 관리합니다."
      title="번역 관리"
    >
      <AdminTranslationsManager contentItems={contentItems} courses={courses} />
    </AdminConsoleShell>
  );
}
