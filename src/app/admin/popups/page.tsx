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
    .map((row, index) => ({
      id: row.id ?? row.title,
      image: <AdminThumbnail alt={row.title} src={row.imageUrl || fallbackImages[index % fallbackImages.length]} />,
      manage: <AdminRowAction />,
      period: `${row.startsAt || "2026.05.01"} ~ ${row.endsAt || "2026.05.31"}`,
      placement: placementLabel(row.locale),
      status: <AdminStatusBadge tone={getTone(row.status)}>{row.status === "published" ? "노출중" : "임시저장"}</AdminStatusBadge>,
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
          rows={bannerRows.length ? bannerRows : fallbackRows}
        />
      </AdminPanel>
    </AdminConsoleShell>
  );
}

const fallbackImages = [
  "/assets/client-smc/global-competition-hall-wide.jpg",
  "/assets/client-smc/practical-massage-training.jpg",
  "/assets/client-smc/spa-hands-closeup.jpg",
  "/assets/client-smc/mou-handshake.jpg"
];

const fallbackRows = [
  ["이름 특강 할인 이벤트", "메인 팝업", "2026.05.01 ~ 2026.05.31", "노출중", fallbackImages[0]],
  ["신규 과정 오픈 안내", "메인 팝업", "2026.05.10 ~ 2026.06.10", "노출중", fallbackImages[1]],
  ["수강 후기 이벤트", "하단 팝업", "2026.05.01 ~ 2026.05.20", "임시저장", fallbackImages[2]],
  ["앱 다운로드 안내", "하단 팝업", "2026.04.15 ~ 2026.05.15", "종료", fallbackImages[3]]
].map(([title, placement, period, status, image]) => ({
  id: title,
  image: <AdminThumbnail alt={title} src={image} />,
  manage: <AdminRowAction />,
  period,
  placement,
  status: <AdminStatusBadge tone={getTone(status)}>{status}</AdminStatusBadge>,
  title
}));

function placementLabel(value: string) {
  if (value === "home") return "메인 팝업";
  if (value === "curriculum") return "과정 배너";
  if (value === "activities") return "활동 배너";
  return "하단 팝업";
}
