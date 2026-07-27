import {
  AdminConsoleShell,
  AdminDateRange,
  AdminFilterBar,
  AdminPagination,
  AdminPanel,
  AdminRowAction,
  AdminSearchInput,
  AdminSelect,
  AdminStatusBadge,
  AdminTable,
  getTone
} from "@/components/AdminConsole";
import { getAdminInquiries } from "@/lib/admin-data";

export default async function AdminInquiriesPage() {
  const inquiries = await getAdminInquiries();
  const dateRange = getInquiryDateRange(inquiries.map((inquiry) => inquiry.submittedAt));
  const rows = inquiries.slice(0, 6).map((inquiry) => ({
    id: inquiry.receipt,
    email: maskEmail(inquiry.email),
    manage: <AdminRowAction />,
    name: inquiry.name,
    receipt: inquiry.receipt,
    status: <AdminStatusBadge tone={getTone(inquiry.status === "answered" ? "answered" : "pending")}>{inquiry.status === "answered" ? "답변완료" : "답변대기"}</AdminStatusBadge>,
    submittedAt: inquiry.submittedAt,
    title: inquiry.type
  }));

  return (
    <AdminConsoleShell active="inquiries" description="문의 내역을 확인하고 답변을 관리합니다." title="문의 관리">
      <AdminPanel>
        <AdminFilterBar>
          <AdminSelect label="전체" />
          <AdminSelect label="조회" />
          <AdminDateRange end={dateRange.end} start={dateRange.start} />
          <AdminSearchInput placeholder="이름, 이메일, 제목 검색" />
        </AdminFilterBar>
        <AdminTable
          columns={[
            { key: "receipt", label: "접수번호" },
            { key: "name", label: "이름" },
            { key: "email", label: "이메일" },
            { key: "title", label: "제목" },
            { key: "status", label: "상태" },
            { key: "submittedAt", label: "접수일" },
            { key: "manage", label: "관리", align: "center" }
          ]}
          emptyLabel="등록된 문의 데이터가 없습니다."
          rows={rows}
        />
        {rows.length ? <AdminPagination pages={["1"]} /> : null}
      </AdminPanel>
    </AdminConsoleShell>
  );
}

function maskEmail(email: string) {
  if (!email || !email.includes("@")) {
    return "-";
  }

  return email.replace(/(.{2}).*(@.*)/, "$1***$2");
}

function getInquiryDateRange(dates: string[]) {
  const sortedDates = [...dates].filter(Boolean).sort((a, b) => a.localeCompare(b));

  return {
    end: sortedDates.at(-1) ?? "-",
    start: sortedDates[0] ?? "-"
  };
}
