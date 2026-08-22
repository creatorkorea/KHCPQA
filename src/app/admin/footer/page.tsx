import { AdminConsoleShell } from "@/components/AdminConsole";
import { AdminFooterManager } from "@/components/AdminFooterManager";
import { getAdminContentRows } from "@/lib/admin-data";
import { FOOTER_SETTINGS_SLUG, normalizeFooterSettings } from "@/lib/footer-settings";

export default async function AdminFooterPage() {
  const contentRows = await getAdminContentRows();
  const settingsRow = contentRows.find((row) => row.type === "Page" && row.locale === "ko" && row.slug === FOOTER_SETTINGS_SLUG);

  return (
    <AdminConsoleShell
      active="footer"
      description="공개 사이트 하단의 소개 문구와 고객센터 연락처를 관리합니다."
      title="푸터 관리"
    >
      <AdminFooterManager initialSettings={normalizeFooterSettings(settingsRow?.body)} />
    </AdminConsoleShell>
  );
}
