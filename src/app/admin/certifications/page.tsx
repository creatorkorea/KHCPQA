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
  const rows = (certifications.length ? certifications : fallbackCertifications).slice(0, 7).map((certification) => ({
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
          rows={rows}
        />
      </AdminPanel>
    </AdminConsoleShell>
  );
}

const fallbackCertifications = [
  { course: "국제 웰니스 전문가", issuedAt: "2026.05.18", number: "SMC-EZE-178A180000646", status: "issued", user: "김서연" },
  { course: "명상 지도사 2급", issuedAt: "2026.05.17", number: "SMC-MED-178A180007812", status: "issued", user: "이민호" },
  { course: "아로마 테라피스트", issuedAt: "2026.05.16", number: "SMC-ARO-178A180007345", status: "issued", user: "박지윤" },
  { course: "스트레스 관리사", issuedAt: "2026.05.15", number: "SMC-STR-178A180006789", status: "issued", user: "최로운" },
  { course: "수면 개선 코치", issuedAt: "2026.05.14", number: "SMC-SLP-178A180006123", status: "issued", user: "한하나" }
];
