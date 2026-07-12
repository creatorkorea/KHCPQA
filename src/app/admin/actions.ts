"use server";

import { revalidatePath } from "next/cache";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const roleOptions = [
  "user",
  "viewer",
  "content_manager",
  "course_manager",
  "certification_manager",
  "inquiry_manager",
  "super_admin"
] as const;

const statusOptions = ["active", "suspended", "deleted"] as const;
const certificationStatusOptions = ["issued", "expired", "revoked"] as const;
const inquiryStatusOptions = ["new", "in_review", "answered", "closed"] as const;

type AdminRole = (typeof roleOptions)[number];
type AccountStatus = (typeof statusOptions)[number];
type CertificationStatus = (typeof certificationStatusOptions)[number];
type InquiryStatus = (typeof inquiryStatusOptions)[number];

export type UpdateAdminUserRoleResult = {
  ok: boolean;
  message: string;
};

export type SaveAdminCertificationResult = {
  ok: boolean;
  message: string;
};

export type SaveAdminInquiryResult = {
  ok: boolean;
  message: string;
};

function isAdminRole(value: string): value is AdminRole {
  return roleOptions.includes(value as AdminRole);
}

function isAccountStatus(value: string): value is AccountStatus {
  return statusOptions.includes(value as AccountStatus);
}

function isCertificationStatus(value: string): value is CertificationStatus {
  return certificationStatusOptions.includes(value as CertificationStatus);
}

function isInquiryStatus(value: string): value is InquiryStatus {
  return inquiryStatusOptions.includes(value as InquiryStatus);
}

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime());
}

async function getActiveAdminRole() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { role: "", status: "", supabase, userId: "" };
  }

  const { data: actorProfile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  return {
    role: typeof actorProfile?.role === "string" ? actorProfile.role : "",
    status: typeof actorProfile?.status === "string" ? actorProfile.status : "",
    supabase,
    userId: user.id
  };
}

export async function updateAdminUserRole(input: {
  role: string;
  status: string;
  userId: string;
}): Promise<UpdateAdminUserRoleResult> {
  if (!input.userId || !isAdminRole(input.role) || !isAccountStatus(input.status)) {
    return { ok: false, message: "권한 또는 계정 상태 값이 올바르지 않습니다." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: true, message: "검수용 권한 저장 흐름이 확인되었습니다." };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (actor.role !== "super_admin" || actor.status !== "active") {
    return { ok: false, message: "super_admin 권한이 필요합니다." };
  }

  const { error } = await actor.supabase
    .from("profiles")
    .update({
      role: input.role,
      status: input.status
    })
    .eq("id", input.userId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  return { ok: true, message: "회원 권한이 저장되었습니다." };
}

export async function saveAdminCertification(input: {
  certificateNumber: string;
  courseTitle: string;
  issuedAt: string;
  status: string;
  userEmail: string;
  verificationCode: string;
}): Promise<SaveAdminCertificationResult> {
  const trimmed = {
    certificateNumber: input.certificateNumber.trim(),
    courseTitle: input.courseTitle.trim(),
    issuedAt: input.issuedAt.trim(),
    status: input.status.trim(),
    userEmail: input.userEmail.trim().toLowerCase(),
    verificationCode: input.verificationCode.trim()
  };

  if (
    !trimmed.certificateNumber ||
    !trimmed.courseTitle ||
    !trimmed.issuedAt ||
    !trimmed.userEmail ||
    !isValidDate(trimmed.issuedAt) ||
    !isCertificationStatus(trimmed.status)
  ) {
    return { ok: false, message: "자격 데이터 필수 항목을 확인해 주세요." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: true, message: "검수용 자격 데이터 저장 흐름이 확인되었습니다." };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (!["certification_manager", "super_admin"].includes(actor.role) || actor.status !== "active") {
    return { ok: false, message: "자격 관리자 권한이 필요합니다." };
  }

  const { data: targetProfile, error: profileError } = await actor.supabase
    .from("profiles")
    .select("id")
    .eq("email", trimmed.userEmail)
    .maybeSingle();

  if (profileError) {
    return { ok: false, message: profileError.message };
  }

  if (!targetProfile?.id) {
    return { ok: false, message: "해당 이메일의 회원을 찾을 수 없습니다." };
  }

  const { error } = await actor.supabase.from("certifications").upsert(
    {
      certificate_number: trimmed.certificateNumber,
      course_title: trimmed.courseTitle,
      issued_at: trimmed.issuedAt,
      status: trimmed.status,
      user_id: targetProfile.id,
      verification_code: trimmed.verificationCode || trimmed.certificateNumber
    },
    { onConflict: "certificate_number" }
  );

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  return { ok: true, message: "자격 데이터가 저장되었습니다." };
}

export async function saveAdminInquiry(input: {
  managerNote: string;
  receipt: string;
  status: string;
}): Promise<SaveAdminInquiryResult> {
  const trimmed = {
    managerNote: input.managerNote.trim(),
    receipt: input.receipt.trim(),
    status: input.status.trim()
  };

  if (!trimmed.receipt || !isInquiryStatus(trimmed.status)) {
    return { ok: false, message: "문의 접수번호와 처리 상태를 확인해 주세요." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: true, message: "검수용 문의 처리 저장 흐름이 확인되었습니다." };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (!["inquiry_manager", "super_admin"].includes(actor.role) || actor.status !== "active") {
    return { ok: false, message: "문의 관리자 권한이 필요합니다." };
  }

  const receiptId = trimmed.receipt.startsWith("KHCPQA-")
    ? trimmed.receipt.split("-").at(-1)?.toLowerCase() ?? trimmed.receipt
    : trimmed.receipt;

  let query = actor.supabase
    .from("inquiries")
    .update({
      manager_note: trimmed.managerNote || null,
      status: trimmed.status
    });

  query = receiptId.length === 8 ? query.ilike("id", `${receiptId}%`) : query.eq("id", receiptId);

  const { error } = await query;

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  return { ok: true, message: "문의 처리 상태가 저장되었습니다." };
}
