"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { buildAdminCertificationPayload } from "@/lib/admin-certifications";
import { parseInquiryReceipt } from "@/lib/receipts";
import {
  buildCreateAdminUserPayload,
  buildUpdateAdminUserPayload,
  type AdminUserInput
} from "@/lib/admin-users";
import {
  buildUpdateAdminInquiryPayload,
  type AdminInquiryUpdateInput
} from "@/lib/admin-inquiries";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

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
const contentTypes = ["Page", "Course", "Activity", "Review"] as const;
const contentStatusOptions = ["draft", "translated", "reviewed", "published", "archived"] as const;
const locales = ["ko", "en", "es"] as const;
const bannerPlacements = ["home", "curriculum", "activities", "global"] as const;
const bannerStatusOptions = ["draft", "published", "archived"] as const;
const missingSupabaseMessage = "Supabase 환경변수가 설정되지 않아 저장할 수 없습니다.";
const activitySlugRoots = [
  "corporate-events",
  "competition",
  "volunteer",
  "reviews",
  "notice",
  "awards",
  "media",
  "photo",
  "pass"
] as const;

type AdminRole = (typeof roleOptions)[number];
type AccountStatus = (typeof statusOptions)[number];
type ContentType = (typeof contentTypes)[number];
type ContentStatus = (typeof contentStatusOptions)[number];
type Locale = (typeof locales)[number];
type BannerPlacement = (typeof bannerPlacements)[number];
type BannerStatus = (typeof bannerStatusOptions)[number];

export type UpdateAdminUserRoleResult = {
  ok: boolean;
  message: string;
};

export type SaveAdminUserResult = {
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

export type DeleteAdminInquiryResult = SaveAdminInquiryResult;

export type SaveAdminContentResult = {
  ok: boolean;
  message: string;
};

export type UploadAdminContentImageResult = SaveAdminContentResult & {
  url?: string;
};

export type DeleteAdminContentResult = {
  ok: boolean;
  message: string;
};

const adminUploadBucket = "admin-uploads";
const maxAdminImageSize = 5 * 1024 * 1024;
const allowedAdminImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

export async function signOutFromAdmin() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/ko/login");
}

function isAdminRole(value: string): value is AdminRole {
  return roleOptions.includes(value as AdminRole);
}

function isAccountStatus(value: string): value is AccountStatus {
  return statusOptions.includes(value as AccountStatus);
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

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "size" in value &&
    "type" in value
  );
}

function getDetectedImageType(bytes: Uint8Array): (typeof allowedAdminImageTypes)[number] | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  const header = new TextDecoder().decode(bytes.slice(0, 12));

  if (header.startsWith("GIF87a") || header.startsWith("GIF89a")) {
    return "image/gif";
  }

  if (header.startsWith("RIFF") && header.slice(8, 12) === "WEBP") {
    return "image/webp";
  }

  return null;
}

function getImageExtension(contentType: (typeof allowedAdminImageTypes)[number]) {
  if (contentType === "image/png") {
    return "png";
  }

  if (contentType === "image/webp") {
    return "webp";
  }

  if (contentType === "image/gif") {
    return "gif";
  }

  return "jpg";
}

function getSafeStorageSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64) || "content";
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

function getManagedCourseSlug(slug: string) {
  return slug.replace(/-(?:flow|panel|technique|process)-.+$/, "");
}

function getManagedActivitySlug(slug: string) {
  return activitySlugRoots.find((root) => slug === root || slug.startsWith(`${root}-`)) ?? slug.split("-")[0];
}

function revalidateManagedContent(input: {
  contentType: ContentType;
  locale: Locale;
  slug: string;
}) {
  revalidatePath("/admin");

  if (input.contentType === "Course") {
    const courseSlug = getManagedCourseSlug(input.slug);
    revalidatePath(`/${input.locale}/curriculum`);
    revalidatePath(`/${input.locale}/curriculum/${courseSlug}`);
    return;
  }

  if (input.contentType === "Activity") {
    const activityKey = getManagedActivitySlug(input.slug);
    revalidatePath(`/${input.locale}/activities`);
    revalidatePath(`/${input.locale}/activities/${activityKey}`);
    return;
  }

  if (input.contentType === "Page") {
    revalidatePath(input.slug === "home" ? `/${input.locale}` : `/${input.locale}/${input.slug}`);
  }
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
  const supabase = createServerSupabaseClient();
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

function getAdminStorageEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    apiKey: serviceRoleKey,
    serviceRoleKey,
    storageUrl: `${url.replace(/\/$/, "")}/storage/v1`
  };
}

function getSupabaseAdminEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { serviceRoleKey, url };
}

function createSupabaseAdminServiceClient() {
  const adminEnv = getSupabaseAdminEnv();

  if (!adminEnv) {
    return null;
  }

  return createSupabaseAdminClient(adminEnv.url, adminEnv.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

function isMissingBucketError(errorMessage: string) {
  return /bucket not found|not found|does not exist/i.test(errorMessage);
}

async function ensureAdminUploadBucket() {
  const storage = getAdminStorageEnv();

  if (!storage) {
    return {
      ok: false,
      message:
        "서버 환경 변수 SUPABASE_SERVICE_ROLE_KEY가 설정되지 않아 파일 업로드를 준비할 수 없습니다. .env.local 또는 배포 환경 변수에 service_role 키를 추가한 뒤 서버를 재시작해 주세요.",
      storage: null
    };
  }

  const bucketResponse = await fetch(`${storage.storageUrl}/bucket/${adminUploadBucket}`, {
    headers: {
      apikey: storage.apiKey,
      authorization: `Bearer ${storage.serviceRoleKey}`
    }
  });

  if (bucketResponse.ok) {
    return { ok: true, message: "", storage };
  }

  const bucketErrorMessage = await bucketResponse.text();

  if (bucketResponse.status !== 404 && !isMissingBucketError(bucketErrorMessage)) {
    return {
      ok: false,
      message: `이미지 저장소 상태를 확인할 수 없습니다. ${bucketErrorMessage || bucketResponse.statusText}`,
      storage: null
    };
  }

  const createResponse = await fetch(`${storage.storageUrl}/bucket`, {
    body: JSON.stringify({
      allowed_mime_types: [...allowedAdminImageTypes],
      file_size_limit: maxAdminImageSize,
      id: adminUploadBucket,
      name: adminUploadBucket,
      public: true
    }),
    headers: {
      apikey: storage.apiKey,
      authorization: `Bearer ${storage.serviceRoleKey}`,
      "content-type": "application/json"
    },
    method: "POST"
  });

  if (!createResponse.ok) {
    const createErrorMessage = await createResponse.text();

    if (!/already exists|duplicate/i.test(createErrorMessage)) {
      return {
        ok: false,
        message: `이미지 저장소를 생성할 수 없습니다. ${createErrorMessage || createResponse.statusText}`,
        storage: null
      };
    }
  }

  return { ok: true, message: "", storage };
}

async function uploadAdminImageToStorage(input: {
  arrayBuffer: ArrayBuffer;
  contentType: (typeof allowedAdminImageTypes)[number];
  path: string;
}) {
  const storage = await ensureAdminUploadBucket();

  if (!storage.ok || !storage.storage) {
    return {
      ok: false,
      message: storage.message,
      publicUrl: ""
    };
  }

  const objectPath = input.path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const uploadResponse = await fetch(`${storage.storage.storageUrl}/object/${adminUploadBucket}/${objectPath}`, {
    body: input.arrayBuffer,
    headers: {
      apikey: storage.storage.apiKey,
      authorization: `Bearer ${storage.storage.serviceRoleKey}`,
      "cache-control": "31536000",
      "content-type": input.contentType,
      "x-upsert": "false"
    },
    method: "POST"
  });

  if (!uploadResponse.ok) {
    const errorMessage = await uploadResponse.text();

    return {
      ok: false,
      message: `이미지 업로드에 실패했습니다. ${errorMessage || uploadResponse.statusText}`,
      publicUrl: ""
    };
  }

  return {
    ok: true,
    message: "",
    publicUrl: `${storage.storage.storageUrl}/object/public/${adminUploadBucket}/${objectPath}`
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
    return { ok: false, message: missingSupabaseMessage };
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

export async function saveAdminUser(input: AdminUserInput & { mode: "create" | "update" }): Promise<SaveAdminUserResult> {
  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (actor.role !== "super_admin" || actor.status !== "active") {
    return { ok: false, message: "super_admin 권한이 필요합니다." };
  }

  if (input.mode === "create") {
    const validation = buildCreateAdminUserPayload(input);

    if (!validation.ok) {
      return { ok: false, message: validation.message };
    }

    const adminClient = createSupabaseAdminServiceClient();

    if (!adminClient) {
      return {
        ok: false,
        message: "서버 환경 변수 SUPABASE_SERVICE_ROLE_KEY가 설정되어야 관리자 사용자 등록이 가능합니다."
      };
    }

    const payload = validation.payload;
    const { data, error } = await adminClient.auth.admin.createUser({
      email: payload.email,
      email_confirm: true,
      password: payload.password,
      user_metadata: {
        country: payload.country,
        full_name: payload.fullName,
        interested_course: payload.interestedCourse,
        marketing_opt_in: payload.marketingOptIn,
        phone: payload.phone,
        preferred_locale: payload.preferredLocale
      }
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    const userId = data.user?.id;

    if (!userId) {
      return { ok: false, message: "생성된 사용자 ID를 확인할 수 없습니다." };
    }

    const { error: profileError } = await adminClient.from("profiles").upsert(
      {
        country: payload.country,
        email: payload.email,
        full_name: payload.fullName,
        id: userId,
        interested_course: payload.interestedCourse,
        marketing_opt_in: payload.marketingOptIn,
        phone: payload.phone,
        preferred_locale: payload.preferredLocale,
        role: payload.role,
        status: payload.status
      },
      { onConflict: "id" }
    );

    if (profileError) {
      return { ok: false, message: profileError.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/users");
    return { ok: true, message: "사용자가 등록되었습니다." };
  }

  const validation = buildUpdateAdminUserPayload(input);

  if (!validation.ok) {
    return { ok: false, message: validation.message };
  }

  const payload = validation.payload;
  const { error } = await actor.supabase
    .from("profiles")
    .update({
      country: payload.country,
      email: payload.email,
      full_name: payload.fullName,
      interested_course: payload.interestedCourse,
      marketing_opt_in: payload.marketingOptIn,
      phone: payload.phone,
      preferred_locale: payload.preferredLocale,
      role: payload.role,
      status: payload.status
    })
    .eq("id", payload.userId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  return { ok: true, message: "사용자 정보가 수정되었습니다." };
}

export async function deleteAdminUser(input: { userId: string }): Promise<SaveAdminUserResult> {
  const userId = input.userId.trim();

  if (!userId) {
    return { ok: false, message: "삭제할 사용자를 선택해 주세요." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (actor.role !== "super_admin" || actor.status !== "active") {
    return { ok: false, message: "super_admin 권한이 필요합니다." };
  }

  if (actor.userId === userId) {
    return { ok: false, message: "현재 로그인한 관리자 계정은 삭제할 수 없습니다." };
  }

  const { error } = await actor.supabase
    .from("profiles")
    .update({ status: "deleted" })
    .eq("id", userId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  return { ok: true, message: "사용자가 삭제 상태로 변경되었습니다." };
}

export async function saveAdminCertification(input: {
  adminNote?: string;
  certificateNumber: string;
  courseTitle: string;
  expiresAt?: string;
  issuedAt: string;
  status: string;
  userEmail: string;
  verificationCode: string;
}): Promise<SaveAdminCertificationResult> {
  const validation = buildAdminCertificationPayload(input);

  if (!validation.ok) {
    return { ok: false, message: validation.message };
  }

  const trimmed = validation.payload;

  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
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
      admin_note: trimmed.adminNote || null,
      certificate_number: trimmed.certificateNumber,
      course_title: trimmed.courseTitle,
      expires_at: trimmed.expiresAt || null,
      issued_at: trimmed.issuedAt,
      status: trimmed.status,
      user_id: targetProfile.id,
      verification_code: trimmed.verificationCode
    },
    { onConflict: "certificate_number" }
  );

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/certifications");
  return { ok: true, message: "자격 데이터가 저장되었습니다." };
}

export async function saveAdminInquiry(input: {
  managerNote: string;
  receipt: string;
  status: string;
}): Promise<SaveAdminInquiryResult> {
  return updateAdminInquiry(input);
}

export async function updateAdminInquiry(input: AdminInquiryUpdateInput): Promise<SaveAdminInquiryResult> {
  const validation = buildUpdateAdminInquiryPayload(input);

  if (!validation.ok) {
    return { ok: false, message: validation.message };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (!["inquiry_manager", "super_admin"].includes(actor.role) || actor.status !== "active") {
    return { ok: false, message: "문의 관리자 권한이 필요합니다." };
  }

  const payload = validation.payload;
  const receiptId = parseInquiryReceipt(payload.receipt);

  const { error } = await actor.supabase
    .from("inquiries")
    .update({
      manager_note: payload.managerNote,
      status: payload.status
    })
    .eq("id", receiptId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  return { ok: true, message: "문의 처리 상태가 저장되었습니다." };
}

export async function deleteAdminInquiry(input: { receipt: string }): Promise<DeleteAdminInquiryResult> {
  const receipt = input.receipt.trim();

  if (!receipt) {
    return { ok: false, message: "삭제할 문의를 선택해 주세요." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (!["inquiry_manager", "super_admin"].includes(actor.role) || actor.status !== "active") {
    return { ok: false, message: "문의 관리자 권한이 필요합니다." };
  }

  const adminClient = createSupabaseAdminServiceClient();

  if (!adminClient) {
    return {
      ok: false,
      message: "서버 환경 변수 SUPABASE_SERVICE_ROLE_KEY가 설정되어야 관리자 문의 삭제가 가능합니다."
    };
  }

  const { error } = await adminClient.from("inquiries").delete().eq("id", parseInquiryReceipt(receipt));

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  return { ok: true, message: "문의가 삭제되었습니다." };
}

export async function uploadAdminContentImage(formData: FormData): Promise<UploadAdminContentImageResult> {
  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (!["content_manager", "course_manager", "super_admin"].includes(actor.role) || actor.status !== "active") {
    return { ok: false, message: "콘텐츠 관리자 권한이 필요합니다." };
  }

  const fileValue = formData.get("file");

  if (!isUploadFile(fileValue) || fileValue.size === 0) {
    return { ok: false, message: "대표 이미지 파일을 선택해 주세요." };
  }

  if (fileValue.size > maxAdminImageSize) {
    return { ok: false, message: "대표 이미지는 5MB 이하 파일만 업로드할 수 있습니다." };
  }

  const claimedType = fileValue.type as (typeof allowedAdminImageTypes)[number];

  if (!allowedAdminImageTypes.includes(claimedType)) {
    return { ok: false, message: "JPG, PNG, WebP, GIF 이미지만 업로드할 수 있습니다." };
  }

  const arrayBuffer = await fileValue.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const detectedType = getDetectedImageType(bytes);

  if (!detectedType || detectedType !== claimedType) {
    return { ok: false, message: "파일 형식이 이미지 시그니처와 일치하지 않습니다." };
  }

  const contentTypeSegment = getSafeStorageSegment(String(formData.get("contentType") ?? "activity"));
  const slugSegment = getSafeStorageSegment(String(formData.get("slug") ?? "content"));
  const dateSegment = new Date().toISOString().slice(0, 10);
  const extension = getImageExtension(detectedType);
  const path = `${contentTypeSegment}/${dateSegment}/${slugSegment}-${randomUUID()}.${extension}`;
  const uploadResult = await uploadAdminImageToStorage({
    arrayBuffer,
    contentType: detectedType,
    path
  });

  if (!uploadResult.ok) {
    return { ok: false, message: uploadResult.message };
  }

  if (!uploadResult.publicUrl) {
    return { ok: false, message: "업로드된 이미지 경로를 확인할 수 없습니다." };
  }

  return { ok: true, message: "대표 이미지가 업로드되었습니다.", url: uploadResult.publicUrl };
}

export async function saveAdminContent(input: {
  body: string;
  contentType: string;
  imageUrl: string;
  locale: string;
  preventOverwrite?: boolean;
  slug: string;
  sourceUrl: string;
  status: string;
  summary: string;
  title: string;
}): Promise<SaveAdminContentResult> {
  const trimmed = {
    body: input.body.trim(),
    contentType: input.contentType.trim(),
    imageUrl: input.imageUrl.trim(),
    locale: input.locale.trim(),
    preventOverwrite: Boolean(input.preventOverwrite),
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
    return { ok: false, message: missingSupabaseMessage };
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

  if (trimmed.preventOverwrite && existingContent?.id) {
    return {
      ok: false,
      message: "이미 같은 Slug의 게시글이 있습니다. 새 게시글은 Slug를 변경해 주세요."
    };
  }

  const { data: savedContent, error } = await actor.supabase.from("admin_content_items").upsert(
    {
      content_type: trimmed.contentType,
      created_by: actor.userId,
      body: trimmed.body || null,
      image_url: trimmed.imageUrl || null,
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

  revalidateManagedContent({
    contentType: trimmed.contentType,
    locale: trimmed.locale,
    slug: trimmed.slug
  });
  return { ok: true, message: "콘텐츠 항목이 저장되었습니다." };
}

export async function saveAdminBanner(input: {
  endsAt: string;
  id?: string;
  imageUrl: string;
  placement: string;
  startsAt: string;
  status: string;
  targetUrl: string;
  title: string;
}): Promise<SaveAdminContentResult> {
  const trimmed = {
    endsAt: input.endsAt.trim(),
    id: input.id?.trim() ?? "",
    imageUrl: input.imageUrl.trim(),
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
    return { ok: false, message: missingSupabaseMessage };
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
    image_url: trimmed.imageUrl || null,
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
    return { ok: false, message: missingSupabaseMessage };
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
    .select("content_type, locale, slug, status, title")
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

  if (isContentType(contentItem.content_type) && isLocale(contentItem.locale)) {
    revalidateManagedContent({
      contentType: contentItem.content_type,
      locale: contentItem.locale,
      slug: contentItem.slug
    });
  } else {
    revalidatePath("/admin");
  }
  revalidatePath("/");
  return { ok: true, message: "콘텐츠 항목이 삭제되었습니다." };
}
