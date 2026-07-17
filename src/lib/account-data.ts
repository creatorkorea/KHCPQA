import { getCopy, localeLabels, type Locale } from "@/lib/content";
import { formatInquiryReceipt } from "@/lib/receipts";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormValue = {
  name: string;
  email: string;
  country: string;
  preferredLanguage: Locale;
};

export type AccountCertificate = {
  title: string;
  number: string;
  issuedAt: string;
  status: string;
  verificationCode: string;
};

export type AccountInquiry = {
  receipt: string;
  title: string;
  type: string;
  message: string;
  submittedAt: string;
  status: string;
};

export type AccountData = {
  profileFields: Array<{ label: string; value: string }>;
  profileForm: ProfileFormValue;
  certificates: AccountCertificate[];
  inquiries: AccountInquiry[];
};

type ProfileRow = {
  email: string | null;
  full_name: string | null;
  country: string | null;
  preferred_locale: Locale | null;
};

type CertificateRow = {
  certificate_number: string;
  course_title: string;
  issued_at: string;
  status: string;
  verification_code: string;
};

type InquiryRow = {
  id: string;
  inquiry_type: string;
  message: string;
  created_at: string;
  status: string;
};

function formatDate(locale: Locale, value: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

function emptyAccountData(locale: Locale, email?: string | null): AccountData {
  const profileData = buildProfileData(locale, null, email);

  return {
    profileFields: profileData.profileFields,
    profileForm: profileData.profileForm,
    certificates: [],
    inquiries: []
  };
}

function buildProfileData(locale: Locale, profile: ProfileRow | null, email?: string | null) {
  const t = getCopy(locale);
  const preferredLanguage = profile?.preferred_locale ?? locale;
  const profileForm = {
    name: profile?.full_name ?? "",
    email: profile?.email ?? email ?? "",
    country: profile?.country ?? "",
    preferredLanguage
  };

  return {
    profileFields: [
      { label: t.account.profile.fields[0]?.label ?? "Name", value: profileForm.name || "-" },
      { label: t.account.profile.fields[1]?.label ?? "Email", value: profileForm.email || "-" },
      { label: t.account.profile.fields[2]?.label ?? "Country", value: profileForm.country || "-" },
      {
        label: t.account.profile.fields[3]?.label ?? "Language",
        value: localeLabels[profileForm.preferredLanguage] ?? profileForm.preferredLanguage
      }
    ],
    profileForm
  };
}

function mapCertificate(locale: Locale, row: CertificateRow): AccountCertificate {
  return {
    title: row.course_title,
    number: row.certificate_number,
    issuedAt: formatDate(locale, row.issued_at),
    status: row.status,
    verificationCode: row.verification_code
  };
}

function mapInquiry(locale: Locale, row: InquiryRow): AccountInquiry {
  return {
    receipt: formatInquiryReceipt(row.id, row.created_at),
    title: row.inquiry_type,
    type: row.inquiry_type,
    message: row.message,
    submittedAt: formatDate(locale, row.created_at),
    status: row.status
  };
}

export async function getAccountData(locale: Locale): Promise<AccountData> {
  if (!hasSupabaseBrowserEnv()) {
    return emptyAccountData(locale);
  }

  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return emptyAccountData(locale);
  }

  const [{ data: profile }, { data: certificates }, { data: inquiries }] = await Promise.all([
    supabase.from("profiles").select("email, full_name, country, preferred_locale").eq("id", user.id).maybeSingle(),
    supabase
      .from("certifications")
      .select("certificate_number, course_title, issued_at, status, verification_code")
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false }),
    supabase
      .from("inquiries")
      .select("id, inquiry_type, message, created_at, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
  ]);

  const profileData = buildProfileData(locale, profile as ProfileRow | null, user.email);

  return {
    profileFields: profileData.profileFields,
    profileForm: profileData.profileForm,
    certificates: certificates ? (certificates as CertificateRow[]).map((certificate) => mapCertificate(locale, certificate)) : [],
    inquiries: inquiries ? (inquiries as InquiryRow[]).map((inquiry) => mapInquiry(locale, inquiry)) : []
  };
}
