import {
  AdminConsoleShell,
  AdminDateRange,
  AdminFilterBar,
  AdminPanel,
  AdminSearchInput,
  AdminSelect
} from "@/components/AdminConsole";
import { AdminInquiriesManager } from "@/components/AdminInquiriesManager";
import { getAdminInquiries } from "@/lib/admin-data";

export default async function AdminInquiriesPage() {
  const inquiries = await getAdminInquiries();
  const dateRange = getInquiryDateRange(inquiries.map((inquiry) => inquiry.submittedAt));

  return (
    <AdminConsoleShell active="inquiries" description="문의 내역을 확인하고 답변을 관리합니다." title="문의 관리">
      <AdminPanel className="admin-inquiries-panel">
        <AdminFilterBar>
          <AdminSelect label="전체" />
          <AdminSelect label="조회" />
          <AdminDateRange end={dateRange.end} start={dateRange.start} />
          <AdminSearchInput placeholder="이름, 이메일, 제목 검색" />
        </AdminFilterBar>
        <AdminInquiriesManager inquiries={inquiries} />
      </AdminPanel>
    </AdminConsoleShell>
  );
}

function getInquiryDateRange(dates: string[]) {
  const sortedDates = [...dates].filter(Boolean).sort((a, b) => a.localeCompare(b));

  return {
    end: sortedDates.at(-1) ?? "-",
    start: sortedDates[0] ?? "-"
  };
}
