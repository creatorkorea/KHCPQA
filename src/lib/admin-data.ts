import { adminCertificationRows, adminInquiryRows, adminUserRows } from "@/lib/content";
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
