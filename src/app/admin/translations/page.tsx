import { AdminConsoleShell } from "@/components/AdminConsole";
import { AdminTranslationsManager } from "@/components/AdminTranslationsManager";
import { getAdminContentRows, getAdminCourses } from "@/lib/admin-data";

export default async function AdminTranslationsPage() {
  const [contentItems, courses] = await Promise.all([getAdminContentRows(), getAdminCourses()]);

  return (
    <AdminConsoleShell
      active="translations"
      description="전체 번역 상태를 확인합니다. 교육과정은 과정 관리에서, 페이지·커뮤니티는 이 화면에서 편집합니다."
      title="번역 관리"
    >
      <AdminTranslationsManager contentItems={contentItems} courses={courses} />
    </AdminConsoleShell>
  );
}
