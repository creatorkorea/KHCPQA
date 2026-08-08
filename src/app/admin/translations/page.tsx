import { AdminConsoleShell } from "@/components/AdminConsole";
import { AdminTranslationsManager } from "@/components/AdminTranslationsManager";
import { getAdminContentRows } from "@/lib/admin-data";
import { getCourses } from "@/lib/content";

export default async function AdminTranslationsPage() {
  const contentRows = await getAdminContentRows();
  const courseRows = contentRows.filter((row) => row.type === "Course");
  const courseOptions = getCourses("ko").map((course) => ({
    category: course.category,
    label: course.title,
    slug: course.slug,
    summary: course.summary
  }));

  return (
    <AdminConsoleShell active="translations" description="언어별 번역 현황을 관리합니다." title="번역 관리">
      <AdminTranslationsManager courseOptions={courseOptions} items={courseRows} />
    </AdminConsoleShell>
  );
}
