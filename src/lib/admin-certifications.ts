export const adminCertificationStatuses = ["issued", "expired", "revoked"] as const;

export type AdminCertificationStatus = (typeof adminCertificationStatuses)[number];

export type AdminCertificationInput = {
  adminNote?: string;
  certificateNumber: string;
  courseTitle: string;
  expiresAt?: string;
  issuedAt: string;
  status: string;
  userEmail: string;
  verificationCode: string;
};

export type AdminCertificationPayload = {
  adminNote: string;
  certificateNumber: string;
  courseTitle: string;
  expiresAt: string;
  issuedAt: string;
  status: AdminCertificationStatus;
  userEmail: string;
  verificationCode: string;
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

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime());
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function buildAdminCertificationPayload(
  input: AdminCertificationInput
): ValidationResult<AdminCertificationPayload> {
  const normalized = {
    adminNote: input.adminNote?.trim() ?? "",
    certificateNumber: input.certificateNumber.trim(),
    courseTitle: input.courseTitle.trim(),
    expiresAt: input.expiresAt?.trim() ?? "",
    issuedAt: input.issuedAt.trim(),
    status: input.status.trim(),
    userEmail: input.userEmail.trim().toLowerCase(),
    verificationCode: input.verificationCode.trim()
  };
  const errors: string[] = [];

  if (!normalized.userEmail || !isValidEmail(normalized.userEmail)) {
    errors.push("회원 이메일을 확인해 주세요.");
  }

  if (!normalized.courseTitle) {
    errors.push("자격명을 입력해 주세요.");
  }

  if (!normalized.certificateNumber) {
    errors.push("자격번호를 입력해 주세요.");
  }

  if (!normalized.issuedAt || !isValidDate(normalized.issuedAt)) {
    errors.push("발급일은 YYYY-MM-DD 형식으로 입력해 주세요.");
  }

  if (normalized.expiresAt && !isValidDate(normalized.expiresAt)) {
    errors.push("만료일은 YYYY-MM-DD 형식으로 입력해 주세요.");
  }

  if (!adminCertificationStatuses.includes(normalized.status as AdminCertificationStatus)) {
    errors.push("상태 값을 확인해 주세요.");
  }

  if (errors.length > 0) {
    return { ok: false, message: errors.join(" ") };
  }

  return {
    ok: true,
    payload: {
      adminNote: normalized.adminNote,
      certificateNumber: normalized.certificateNumber,
      courseTitle: normalized.courseTitle,
      expiresAt: normalized.expiresAt,
      issuedAt: normalized.issuedAt,
      status: normalized.status as AdminCertificationStatus,
      userEmail: normalized.userEmail,
      verificationCode: normalized.verificationCode || normalized.certificateNumber
    }
  };
}

export function getAdminCertificationStatusLabel(status: string) {
  if (status === "issued") return "발급됨";
  if (status === "expired") return "만료됨";
  if (status === "revoked") return "취소됨";
  return status;
}

export function formatAdminCertificationDate(value: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}
