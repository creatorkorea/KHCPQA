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
const contentTypes = ["Page", "Course", "Activity", "Review"] as const;
const contentStatusOptions = ["draft", "translated", "reviewed", "published", "archived"] as const;
const locales = ["ko", "en", "es"] as const;
const bannerPlacements = ["home", "curriculum", "activities", "global"] as const;
const bannerStatusOptions = ["draft", "published", "archived"] as const;

type AdminRole = (typeof roleOptions)[number];
type AccountStatus = (typeof statusOptions)[number];
type CertificationStatus = (typeof certificationStatusOptions)[number];
type InquiryStatus = (typeof inquiryStatusOptions)[number];
type ContentType = (typeof contentTypes)[number];
type ContentStatus = (typeof contentStatusOptions)[number];
type Locale = (typeof locales)[number];
type BannerPlacement = (typeof bannerPlacements)[number];
type BannerStatus = (typeof bannerStatusOptions)[number];

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

export type SaveAdminContentResult = {
  ok: boolean;
  message: string;
};

export type DeleteAdminContentResult = {
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

function isContentType(value: string): value is ContentType {
  return contentTypes.includes(value as ContentType);
}

function isContentStatus(value: string): value is ContentStatus {
  return contentStatusOptions.includes(value as ContentStatus);
}

function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

function isBannerPlacement(value: string): value is BannerPlacement {
  return bannerPlacements.includes(value as BannerPlacement);
}

function isBannerStatus(value: string): value is BannerStatus {
  return bannerStatusOptions.includes(value as BannerStatus);
}

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime());
}

function getPublishEventAction(status: string, isExisting: boolean) {
  if (status === "published") {
    return "published";
  }

  if (status === "archived") {
    return "archived";
  }

  return isExisting ? "updated" : "created";
}

async function logPublishEvent({
  action,
  actor,
  itemId,
  itemType,
  status,
  title
}: {
  action: string;
  actor: Awaited<ReturnType<typeof getActiveAdminRole>>;
  itemId: string;
  itemType: "content" | "banner";
  status: string;
  title: string;
}) {
  await actor.supabase.from("admin_publish_events").insert({
    action,
    actor_id: actor.userId || null,
    item_id: itemId || null,
    item_type: itemType,
    status,
    title
  });
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

  const receiptId = trimmed.receipt.replace(/^KHCPQA-\d{4}-/i, "").toLowerCase();

  const { error } = await actor.supabase
    .from("inquiries")
    .update({
      manager_note: trimmed.managerNote || null,
      status: trimmed.status
    })
    .eq("id", receiptId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  return { ok: true, message: "문의 처리 상태가 저장되었습니다." };
}

export async function saveAdminContent(input: {
  body: string;
  contentType: string;
  locale: string;
  slug: string;
  sourceUrl: string;
  status: string;
  summary: string;
  title: string;
}): Promise<SaveAdminContentResult> {
  const trimmed = {
    body: input.body.trim(),
    contentType: input.contentType.trim(),
    locale: input.locale.trim(),
    slug: input.slug.trim().toLowerCase(),
    sourceUrl: input.sourceUrl.trim(),
    status: input.status.trim(),
    summary: input.summary.trim(),
    title: input.title.trim()
  };

  if (
    !isContentType(trimmed.contentType) ||
    !isLocale(trimmed.locale) ||
    !isContentStatus(trimmed.status) ||
    !trimmed.slug ||
    !trimmed.title
  ) {
    return { ok: false, message: "콘텐츠 필수 항목을 확인해 주세요." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: true, message: "검수용 콘텐츠 저장 흐름이 확인되었습니다." };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  const allowedRoles =
    trimmed.contentType === "Course"
      ? ["course_manager", "content_manager", "super_admin"]
      : ["content_manager", "super_admin"];

  if (!allowedRoles.includes(actor.role) || actor.status !== "active") {
    return { ok: false, message: "콘텐츠 관리자 권한이 필요합니다." };
  }

  const { data: existingContent } = await actor.supabase
    .from("admin_content_items")
    .select("id")
    .eq("content_type", trimmed.contentType)
    .eq("locale", trimmed.locale)
    .eq("slug", trimmed.slug)
    .maybeSingle();

  const { data: savedContent, error } = await actor.supabase.from("admin_content_items").upsert(
    {
      content_type: trimmed.contentType,
      created_by: actor.userId,
      body: trimmed.body || null,
      locale: trimmed.locale,
      slug: trimmed.slug,
      source_url: trimmed.sourceUrl || null,
      status: trimmed.status,
      summary: trimmed.summary || null,
      title: trimmed.title
    },
    { onConflict: "content_type,locale,slug" }
  ).select("id, status, title").single();

  if (error) {
    return { ok: false, message: error.message };
  }

  if (savedContent?.id) {
    await logPublishEvent({
      action: getPublishEventAction(trimmed.status, Boolean(existingContent?.id)),
      actor,
      itemId: savedContent.id,
      itemType: "content",
      status: savedContent.status,
      title: savedContent.title
    });
  }

  revalidatePath("/admin");
  return { ok: true, message: "콘텐츠 항목이 저장되었습니다." };
}

export async function saveAdminBanner(input: {
  endsAt: string;
  id?: string;
  placement: string;
  startsAt: string;
  status: string;
  targetUrl: string;
  title: string;
}): Promise<SaveAdminContentResult> {
  const trimmed = {
    endsAt: input.endsAt.trim(),
    id: input.id?.trim() ?? "",
    placement: input.placement.trim(),
    startsAt: input.startsAt.trim(),
    status: input.status.trim(),
    targetUrl: input.targetUrl.trim(),
    title: input.title.trim()
  };

  if (
    !trimmed.title ||
    !isBannerPlacement(trimmed.placement) ||
    !isBannerStatus(trimmed.status) ||
    (trimmed.startsAt && !isValidDate(trimmed.startsAt)) ||
    (trimmed.endsAt && !isValidDate(trimmed.endsAt))
  ) {
    return { ok: false, message: "배너 필수 항목과 날짜 형식을 확인해 주세요." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: true, message: "검수용 배너 저장 흐름이 확인되었습니다." };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (!["content_manager", "super_admin"].includes(actor.role) || actor.status !== "active") {
    return { ok: false, message: "콘텐츠 관리자 권한이 필요합니다." };
  }

  const payload = {
    created_by: actor.userId,
    ends_at: trimmed.endsAt || null,
    placement: trimmed.placement,
    starts_at: trimmed.startsAt || null,
    status: trimmed.status,
    target_url: trimmed.targetUrl || null,
    title: trimmed.title
  };

  const { data: savedBanner, error } = trimmed.id
    ? await actor.supabase.from("banners").update(payload).eq("id", trimmed.id).select("id, status, title").single()
    : await actor.supabase.from("banners").insert(payload).select("id, status, title").single();

  if (error) {
    return { ok: false, message: error.message };
  }

  if (savedBanner?.id) {
    await logPublishEvent({
      action: getPublishEventAction(trimmed.status, Boolean(trimmed.id)),
      actor,
      itemId: savedBanner.id,
      itemType: "banner",
      status: savedBanner.status,
      title: savedBanner.title
    });
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true, message: trimmed.id ? "배너 항목이 수정되었습니다." : "배너 항목이 저장되었습니다." };
}

export async function deleteAdminManagedItem(input: {
  id: string;
  itemType: string;
}): Promise<DeleteAdminContentResult> {
  const trimmed = {
    id: input.id.trim(),
    itemType: input.itemType.trim()
  };

  if (!trimmed.id || !["content", "banner"].includes(trimmed.itemType)) {
    return { ok: false, message: "삭제할 항목을 확인해 주세요." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: true, message: "검수용 삭제 흐름이 확인되었습니다." };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (actor.status !== "active") {
    return { ok: false, message: "활성 관리자 계정이 필요합니다." };
  }

  if (trimmed.itemType === "banner") {
    if (!["content_manager", "super_admin"].includes(actor.role)) {
      return { ok: false, message: "콘텐츠 관리자 권한이 필요합니다." };
    }

    const { data: bannerItem, error: bannerFindError } = await actor.supabase
      .from("banners")
      .select("title, status")
      .eq("id", trimmed.id)
      .maybeSingle();

    if (bannerFindError) {
      return { ok: false, message: bannerFindError.message };
    }

    if (!bannerItem) {
      return { ok: false, message: "삭제할 배너를 찾을 수 없습니다." };
    }

    const { error } = await actor.supabase.from("banners").delete().eq("id", trimmed.id);

    if (error) {
      return { ok: false, message: error.message };
    }

    await logPublishEvent({
      action: "deleted",
      actor,
      itemId: trimmed.id,
      itemType: "banner",
      status: bannerItem.status,
      title: bannerItem.title
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return { ok: true, message: "배너 항목이 삭제되었습니다." };
  }

  const { data: contentItem, error: contentError } = await actor.supabase
    .from("admin_content_items")
    .select("content_type, status, title")
    .eq("id", trimmed.id)
    .maybeSingle();

  if (contentError) {
    return { ok: false, message: contentError.message };
  }

  if (!contentItem) {
    return { ok: false, message: "삭제할 콘텐츠를 찾을 수 없습니다." };
  }

  const allowedRoles =
    contentItem.content_type === "Course"
      ? ["course_manager", "content_manager", "super_admin"]
      : ["content_manager", "super_admin"];

  if (!allowedRoles.includes(actor.role)) {
    return { ok: false, message: "콘텐츠 관리자 권한이 필요합니다." };
  }

  const { error } = await actor.supabase.from("admin_content_items").delete().eq("id", trimmed.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  await logPublishEvent({
    action: "deleted",
    actor,
    itemId: trimmed.id,
    itemType: "content",
    status: contentItem.status,
    title: contentItem.title
  });

  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true, message: "콘텐츠 항목이 삭제되었습니다." };
}
