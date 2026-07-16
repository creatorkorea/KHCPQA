import { adminCertificationRows, adminContentRows, adminInquiryRows, adminUserRows } from "@/lib/content";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLoginAt: string;
};

export type AdminCertificationRow = {
  course: string;
  issuedAt: string;
  number: string;
  status: string;
  user: string;
};

export type AdminInquiryRow = {
  country: string;
  name: string;
  organization: string;
  receipt: string;
  status: string;
  submittedAt: string;
  type: string;
};

export type AdminContentRow = {
  body?: string;
  endsAt?: string;
  id?: string;
  locale: string;
  sourceUrl?: string;
  startsAt?: string;
  status: string;
  summary?: string;
  title: string;
  type: string;
  updatedAt: string;
  updatedBy: string;
  slug?: string;
};

export type AdminPublishEventRow = {
  action: string;
  actor: string;
  itemType: string;
  status: string;
  title: string;
  updatedAt: string;
};

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  status: string;
  updated_at: string;
};

type CertificationRow = {
  certificate_number: string;
  course_title: string;
  issued_at: string;
  status: string;
  user_id: string;
};

type InquiryRow = {
  country: string | null;
  created_at: string;
  id: string;
  inquiry_type: string;
  name: string;
  organization: string | null;
  status: string;
};

type ContentRow = {
  body: string | null;
  content_type: string;
  created_by: string | null;
  id: string;
  locale: string;
  source_url: string | null;
  slug: string;
  status: string;
  summary: string | null;
  title: string;
  updated_at: string;
};

type BannerRow = {
  created_by: string | null;
  ends_at: string | null;
  id: string;
  placement: string;
  starts_at: string | null;
  status: string;
  target_url: string | null;
  title: string;
  updated_at: string;
};

type PublishEventRow = {
  action: string;
  actor_id: string | null;
  created_at: string;
  item_type: string;
  status: string;
  title: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  if (!hasSupabaseBrowserEnv()) {
    return adminUserRows;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, status, updated_at")
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error || !data || data.length === 0) {
    return adminUserRows;
  }

  return (data as ProfileRow[]).map((profile) => ({
    id: profile.id,
    name: profile.full_name || profile.email || "Unnamed member",
    email: profile.email || "-",
    role: profile.role,
    status: profile.status,
    lastLoginAt: formatDate(profile.updated_at)
  }));
}

export async function getAdminCertifications(): Promise<AdminCertificationRow[]> {
  if (!hasSupabaseBrowserEnv()) {
    return adminCertificationRows;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("certificate_number, course_title, issued_at, status, user_id")
    .order("issued_at", { ascending: false })
    .limit(50);

  if (error || !data || data.length === 0) {
    return adminCertificationRows;
  }

  const certificationRows = data as CertificationRow[];
  const userIds = Array.from(new Set(certificationRows.map((certification) => certification.user_id)));
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds);
  const profileById = new Map(
    ((profiles as Array<Pick<ProfileRow, "email" | "full_name" | "id">> | null) ?? []).map((profile) => [
      profile.id,
      profile.full_name || profile.email || "Unnamed member"
    ])
  );

  return certificationRows.map((certification) => ({
    course: certification.course_title,
    issuedAt: formatDate(certification.issued_at),
    number: certification.certificate_number,
    status: certification.status,
    user: profileById.get(certification.user_id) ?? "Unnamed member"
  }));
}

export async function getAdminInquiries(): Promise<AdminInquiryRow[]> {
  if (!hasSupabaseBrowserEnv()) {
    return adminInquiryRows;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("id, name, organization, country, inquiry_type, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data || data.length === 0) {
    return adminInquiryRows;
  }

  return (data as InquiryRow[]).map((inquiry) => ({
    country: inquiry.country || "-",
    name: inquiry.name,
    organization: inquiry.organization || "-",
    receipt: `KHCPQA-${new Date(inquiry.created_at).getFullYear()}-${inquiry.id.slice(0, 8).toUpperCase()}`,
    status: inquiry.status,
    submittedAt: formatDate(inquiry.created_at),
    type: inquiry.inquiry_type
  }));
}

export async function getAdminContentRows(): Promise<AdminContentRow[]> {
  if (!hasSupabaseBrowserEnv()) {
    return adminContentRows;
  }

  const supabase = createClient();
  const [{ data: contentItems, error: contentError }, { data: banners, error: bannerError }] = await Promise.all([
    supabase
      .from("admin_content_items")
      .select("id, content_type, title, locale, slug, status, summary, body, source_url, created_by, updated_at")
      .order("updated_at", { ascending: false })
      .limit(40),
    supabase
      .from("banners")
      .select("id, title, placement, status, target_url, starts_at, ends_at, created_by, updated_at")
      .order("updated_at", { ascending: false })
      .limit(20)
  ]);

  if ((contentError || !contentItems || contentItems.length === 0) && (bannerError || !banners || banners.length === 0)) {
    return adminContentRows;
  }

  const rows = [
    ...((contentItems as ContentRow[] | null) ?? []).map((item) => ({
      body: item.body || "",
      id: item.id,
      locale: item.locale,
      slug: item.slug,
      sourceUrl: item.source_url || "",
      status: item.status,
      summary: item.summary || "",
      title: item.title,
      type: item.content_type,
      updatedAt: formatDate(item.updated_at),
      updatedBy: "Admin"
    })),
    ...((banners as BannerRow[] | null) ?? []).map((banner) => ({
      endsAt: banner.ends_at || "",
      id: banner.id,
      locale: banner.placement,
      sourceUrl: banner.target_url || "",
      startsAt: banner.starts_at || "",
      status: banner.status,
      title: banner.title,
      type: "Banner",
      updatedAt: formatDate(banner.updated_at),
      updatedBy: "Admin"
    }))
  ];

  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 50);
}

export async function getAdminPublishEvents(): Promise<AdminPublishEventRow[]> {
  if (!hasSupabaseBrowserEnv()) {
    return adminContentRows.slice(0, 5).map((row, index) => ({
      action: index === 0 ? "published" : "updated",
      actor: row.updatedBy,
      itemType: row.type === "Banner" ? "banner" : "content",
      status: row.status,
      title: row.title,
      updatedAt: row.updatedAt
    }));
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_publish_events")
    .select("item_type, action, title, status, actor_id, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) {
    return [];
  }

  const eventRows = data as PublishEventRow[];
  const actorIds = Array.from(
    new Set(eventRows.map((event) => event.actor_id).filter((actorId): actorId is string => Boolean(actorId)))
  );
  const { data: profiles } = actorIds.length > 0
    ? await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", actorIds)
    : { data: [] };
  const actorById = new Map(
    ((profiles as Array<Pick<ProfileRow, "email" | "full_name" | "id">> | null) ?? []).map((profile) => [
      profile.id,
      profile.full_name || profile.email || profile.id.slice(0, 8)
    ])
  );

  return eventRows.map((event) => ({
    action: event.action,
    actor: event.actor_id ? actorById.get(event.actor_id) ?? event.actor_id.slice(0, 8) : "System",
    itemType: event.item_type,
    status: event.status,
    title: event.title,
    updatedAt: formatDate(event.created_at)
  }));
}
