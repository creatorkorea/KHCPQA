import { Plus } from "lucide-react";
import {
  AdminConsoleShell,
  AdminFilterBar,
  AdminPanel,
  AdminPrimaryButton,
  AdminRowAction,
  AdminSearchInput,
  AdminSelect,
  AdminStatusBadge,
  AdminTable,
  AdminTabs,
  getTone
} from "@/components/AdminConsole";
import { getAdminCertifications } from "@/lib/admin-data";

export default async function AdminCertificationsPage() {
  const certifications = await getAdminCertifications();
  const rows = certifications.slice(0, 7).map((certification) => ({
    id: certification.number,
    course: certification.course,
    issuedAt: certification.issuedAt,
    manage: <AdminRowAction />,
    number: certification.number,
    status: <AdminStatusBadge tone={getTone(certification.status)}>{certification.status === "issued" ? "발급됨" : certification.status}</AdminStatusBadge>
  }));

  return (
    <AdminConsoleShell
      actions={<AdminPrimaryButton icon={Plus}>새 자격 등록</AdminPrimaryButton>}
      active="certifications"
      description="자격 정보 및 발급 내역을 관리합니다."
      title="자격 데이터"
    >
      <AdminPanel>
        <AdminTabs active="자격 목록" tabs={["자격 목록", "발급 내역"]} />
        <AdminFilterBar>
          <AdminSearchInput placeholder="자격명 검색" />
          <AdminSelect label="언어 전체" />
          <AdminSelect label="상태 전체" />
        </AdminFilterBar>
        <AdminTable
          columns={[
            { key: "course", label: "자격명" },
            { key: "number", label: "자격번호" },
            { key: "issuedAt", label: "발급일" },
            { key: "status", label: "상태" },
            { key: "manage", label: "관리", align: "center" }
          ]}
          emptyLabel="등록된 자격 데이터가 없습니다."
          rows={rows}
        />
      </AdminPanel>
    </AdminConsoleShell>
  );
}
