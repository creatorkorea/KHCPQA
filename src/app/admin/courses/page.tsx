import { AdminConsoleShell } from "@/components/AdminConsole";
import { AdminCoursesManager } from "@/components/AdminCoursesManager";
import { getAdminCourses } from "@/lib/admin-data";

export default async function AdminCoursesPage() {
  const courses = await getAdminCourses();

  return (
    <AdminConsoleShell
      active="courses"
      description="공개 커리큘럼 목록과 상세 페이지에 표시되는 과정 콘텐츠를 관리합니다."
      title="과정 관리"
    >
      <AdminCoursesManager courses={courses} />
    </AdminConsoleShell>
  );
}
