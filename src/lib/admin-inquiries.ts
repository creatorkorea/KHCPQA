export const adminInquiryStatuses = ["new", "in_review", "answered", "closed"] as const;

export type AdminInquiryStatus = (typeof adminInquiryStatuses)[number];

export type AdminInquiryUpdateInput = {
  managerNote: string;
  receipt: string;
  status: string;
};

export type AdminInquiryUpdatePayload = {
  managerNote: string | null;
  receipt: string;
  status: AdminInquiryStatus;
};

type ValidationResult<T> =
  | {
      ok: true;
      payload: T;
    }
  | {
      ok: false;
      message: string;
    };

export function buildUpdateAdminInquiryPayload(
  input: AdminInquiryUpdateInput
): ValidationResult<AdminInquiryUpdatePayload> {
  const normalized = {
    managerNote: input.managerNote.trim(),
    receipt: input.receipt.trim(),
    status: input.status.trim()
  };
  const errors: string[] = [];

  if (!normalized.receipt) {
    errors.push("수정할 문의를 선택해 주세요.");
  }

  if (!adminInquiryStatuses.includes(normalized.status as AdminInquiryStatus)) {
    errors.push("처리 상태를 확인해 주세요.");
  }

  if (errors.length > 0) {
    return { ok: false, message: errors.join(" ") };
  }

  return {
    ok: true,
    payload: {
      managerNote: normalized.managerNote || null,
      receipt: normalized.receipt,
      status: normalized.status as AdminInquiryStatus
    }
  };
}

export function getAdminInquiryStatusLabel(status: string) {
  if (status === "new") return "신규";
  if (status === "in_review") return "검토중";
  if (status === "answered") return "답변완료";
  if (status === "closed") return "종료";
  return status;
}

export function getAdminInquiryTypeLabel(type: string) {
  if (type === "general") return "일반";
  if (type === "course") return "과정";
  if (type === "certification") return "자격";
  if (type === "partnership") return "파트너십";
  return type;
}
