import { Plus } from "lucide-react";
import {
  AdminConsoleShell,
  AdminPanel,
  AdminPrimaryButton,
  AdminRowAction,
  AdminStatusBadge,
  AdminTable,
  AdminTabs,
  AdminThumbnail,
  getTone
} from "@/components/AdminConsole";
import { getAdminContentRows } from "@/lib/admin-data";

export default async function AdminPopupsPage() {
  const contentRows = await getAdminContentRows();
  const bannerRows = contentRows
    .filter((row) => row.type === "Banner")
    .slice(0, 5)
    .map((row) => ({
      id: row.id ?? row.title,
      image: <AdminThumbnail alt={row.title} src={row.imageUrl || ""} />,
      manage: <AdminRowAction />,
      period: row.startsAt || row.endsAt ? `${row.startsAt || "-"} ~ ${row.endsAt || "-"}` : "-",
      placement: placementLabel(row.locale),
      status: <AdminStatusBadge tone={getTone(row.status)}>{statusLabel(row.status)}</AdminStatusBadge>,
      title: row.title
    }));

  return (
    <AdminConsoleShell
      actions={<AdminPrimaryButton icon={Plus}>새 팝업 등록</AdminPrimaryButton>}
      active="popups"
      description="팝업 이미지 및 배너 등록/수정/노출여부를 관리합니다."
      title="팝업/배너 관리"
    >
      <AdminPanel>
        <AdminTabs active="팝업 관리" tabs={["팝업 관리", "배너 관리"]} />
        <AdminTable
          columns={[
            { key: "image", label: "" },
            { key: "title", label: "제목" },
            { key: "placement", label: "노출 위치" },
            { key: "period", label: "노출 기간" },
            { key: "status", label: "상태" },
            { key: "manage", label: "관리", align: "center" }
          ]}
          emptyLabel="등록된 팝업/배너 데이터가 없습니다."
          rows={bannerRows}
        />
      </AdminPanel>
    </AdminConsoleShell>
  );
}

function placementLabel(value: string) {
  if (value === "home") return "메인 팝업";
  if (value === "curriculum") return "과정 배너";
  if (value === "activities") return "활동 배너";
  if (value === "global") return "공통 배너";
  return "하단 팝업";
}

function statusLabel(status: string) {
  if (status === "published") return "노출중";
  if (status === "draft") return "임시저장";
  if (status === "archived") return "종료";
  return status;
}
