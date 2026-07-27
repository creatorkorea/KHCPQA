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
  const rows = (inquiries.length ? inquiries : fallbackInquiries).slice(0, 6).map((inquiry) => ({
    id: inquiry.receipt,
    email: maskEmail(inquiry.organization.includes("@") ? inquiry.organization : `${inquiry.name}@gmail.com`),
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
          <AdminDateRange end="2026.05.18" start="2026.05.01" />
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
          rows={rows}
        />
        <AdminPagination pages={["1", "2", "3", "4", "5"]} />
      </AdminPanel>
    </AdminConsoleShell>
  );
}

const fallbackInquiries = [
  { country: "KR", name: "김서연", organization: "seo@gmail.com", receipt: "INQ-2026-0518-001", status: "answered", submittedAt: "2026.05.18", type: "수강 문의드립니다." },
  { country: "KR", name: "이민호", organization: "min@naver.com", receipt: "INQ-2026-0517-004", status: "pending", submittedAt: "2026.05.17", type: "환불 규정 문의" },
  { country: "KR", name: "박지윤", organization: "jiy@daum.net", receipt: "INQ-2026-0517-003", status: "pending", submittedAt: "2026.05.17", type: "과정 내용 문의" },
  { country: "KR", name: "최로운", organization: "choi@gmail.com", receipt: "INQ-2026-0516-002", status: "answered", submittedAt: "2026.05.16", type: "강사 등록 문의" },
  { country: "KR", name: "한하나", organization: "hana@naver.com", receipt: "INQ-2026-0515-001", status: "pending", submittedAt: "2026.05.15", type: "수료증 발급 문의" }
];

function maskEmail(email: string) {
  return email.replace(/(.{2}).*(@.*)/, "$1***$2");
}
