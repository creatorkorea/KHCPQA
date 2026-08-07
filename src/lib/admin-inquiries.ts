export const adminInquiryTypes = ["general", "course", "certification", "partnership"] as const;
export const adminInquiryStatuses = ["new", "in_review", "answered", "closed"] as const;
export const adminInquiryLocales = ["ko", "en", "es"] as const;

export type AdminInquiryType = (typeof adminInquiryTypes)[number];
export type AdminInquiryStatus = (typeof adminInquiryStatuses)[number];
export type AdminInquiryLocale = (typeof adminInquiryLocales)[number];

export type AdminInquiryCreateInput = {
  country: string;
  email: string;
  inquiryType: string;
  locale: string;
  managerNote: string;
  message: string;
  name: string;
  organization: string;
  phone: string;
  status: string;
};

export type AdminInquiryUpdateInput = {
  managerNote: string;
  receipt: string;
  status: string;
};

export type AdminInquiryCreatePayload = {
  country: string | null;
  email: string;
  inquiryType: AdminInquiryType;
  locale: AdminInquiryLocale;
  managerNote: string | null;
  message: string;
  name: string;
  organization: string | null;
  phone: string | null;
  status: AdminInquiryStatus;
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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function buildCreateAdminInquiryPayload(
  input: AdminInquiryCreateInput
): ValidationResult<AdminInquiryCreatePayload> {
  const normalized = {
    country: input.country.trim(),
    email: input.email.trim().toLowerCase(),
    inquiryType: input.inquiryType.trim() || "general",
    locale: input.locale.trim() || "ko",
    managerNote: input.managerNote.trim(),
    message: input.message.trim(),
    name: input.name.trim(),
    organization: input.organization.trim(),
    phone: input.phone.trim(),
    status: input.status.trim() || "new"
  };
  const errors: string[] = [];

  if (!normalized.name) errors.push("이름을 입력해 주세요.");
  if (!emailPattern.test(normalized.email)) errors.push("이메일 형식을 확인해 주세요.");
  if (!normalized.message) errors.push("문의 내용을 입력해 주세요.");
  if (!adminInquiryTypes.includes(normalized.inquiryType as AdminInquiryType)) {
    errors.push("문의 유형을 확인해 주세요.");
  }
  if (!adminInquiryLocales.includes(normalized.locale as AdminInquiryLocale)) {
    errors.push("언어 값을 확인해 주세요.");
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
      country: normalized.country || null,
      email: normalized.email,
      inquiryType: normalized.inquiryType as AdminInquiryType,
      locale: normalized.locale as AdminInquiryLocale,
      managerNote: normalized.managerNote || null,
      message: normalized.message,
      name: normalized.name,
      organization: normalized.organization || null,
      phone: normalized.phone || null,
      status: normalized.status as AdminInquiryStatus
    }
  };
}

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
