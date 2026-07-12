import type { Locale } from "@/lib/content";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type PublishedContentRow = {
  body: string | null;
  slug?: string;
  source_url?: string | null;
  summary: string | null;
  title: string;
  updated_at?: string;
};

export type PublishedContentIntro = {
  body?: string;
  lead: string;
  title: string;
};

export type PublishedActivityPost = {
  body: string;
  date: string;
  sourceUrl: string;
  status: string;
  title: string;
};

export type PublishedBanner = {
  endsAt?: string;
  placement: "home" | "curriculum" | "activities" | "global";
  startsAt?: string;
  targetUrl: string;
  title: string;
};

type PublishedBannerRow = {
  ends_at: string | null;
  placement: PublishedBanner["placement"];
  starts_at: string | null;
  target_url: string | null;
  title: string;
};

function formatDate(value?: string) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  return new Date(value).toISOString().slice(0, 10);
}

export async function getPublishedContentIntro({
  contentType,
  fallback,
  locale,
  slug
}: {
  contentType: "Page" | "Course" | "Activity" | "Review";
  fallback: PublishedContentIntro;
  locale: Locale;
  slug: string;
}): Promise<PublishedContentIntro> {
  if (!hasSupabaseBrowserEnv()) {
    return fallback;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_content_items")
    .select("title, summary, body")
    .eq("content_type", contentType)
    .eq("locale", locale)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return fallback;
  }

  const row = data as PublishedContentRow;

  return {
    body: row.body || undefined,
    lead: row.summary || fallback.lead,
    title: row.title || fallback.title
  };
}

export async function getPublishedContentMap({
  contentType,
  locale,
  slugs
}: {
  contentType: "Page" | "Course" | "Activity" | "Review";
  locale: Locale;
  slugs: string[];
}): Promise<Map<string, PublishedContentIntro>> {
  if (!hasSupabaseBrowserEnv() || slugs.length === 0) {
    return new Map();
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_content_items")
    .select("slug, title, summary, body")
    .eq("content_type", contentType)
    .eq("locale", locale)
    .eq("status", "published")
    .in("slug", slugs);

  if (error || !data) {
    return new Map();
  }

  return new Map(
    (data as PublishedContentRow[])
      .filter((row): row is PublishedContentRow & { slug: string } => Boolean(row.slug))
      .map((row) => [
        row.slug,
        {
          body: row.body || undefined,
          lead: row.summary || "",
          title: row.title
        }
      ])
  );
}

export async function getPublishedActivityPosts({
  activityKey,
  fallback,
  locale
}: {
  activityKey: string;
  fallback: PublishedActivityPost[];
  locale: Locale;
}): Promise<PublishedActivityPost[]> {
  if (!hasSupabaseBrowserEnv()) {
    return fallback;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_content_items")
    .select("slug, title, summary, body, source_url, updated_at")
    .eq("content_type", "Activity")
    .eq("locale", locale)
    .eq("status", "published")
    .like("slug", `${activityKey}-%`)
    .order("updated_at", { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) {
    return fallback;
  }

  return (data as PublishedContentRow[]).map((row) => ({
    body: row.body || row.summary || "",
    date: formatDate(row.updated_at),
    sourceUrl: row.source_url || "https://www.smc365.ac/index.asp",
    status: "published",
    title: row.title
  }));
}

export async function getPublishedBanners({
  limit = 1,
  placement
}: {
  limit?: number;
  placement: PublishedBanner["placement"];
}): Promise<PublishedBanner[]> {
  if (!hasSupabaseBrowserEnv()) {
    return [];
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("banners")
    .select("title, placement, target_url, starts_at, ends_at")
    .eq("status", "published")
    .in("placement", [placement, "global"])
    .order("starts_at", { ascending: false, nullsFirst: false })
    .limit(Math.max(limit * 3, 6));

  if (error || !data) {
    return [];
  }

  const today = new Date().toISOString().slice(0, 10);

  return (data as PublishedBannerRow[])
    .filter((row) => {
      const startsAt = row.starts_at?.slice(0, 10);
      const endsAt = row.ends_at?.slice(0, 10);
      return (!startsAt || startsAt <= today) && (!endsAt || endsAt >= today);
    })
    .slice(0, limit)
    .map((row) => ({
      endsAt: row.ends_at || undefined,
      placement: row.placement,
      startsAt: row.starts_at || undefined,
      targetUrl: row.target_url || "",
      title: row.title
    }));
}
