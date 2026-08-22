import { locales, type Locale } from "@/i18n/config";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const FOOTER_SETTINGS_SLUG = "site-footer";

export type LocalizedFooterSettings = {
  address: string;
  description: string;
};

export type FooterSettings = {
  email: string;
  locales: Record<Locale, LocalizedFooterSettings>;
  phone: string;
};

export type PublicFooterSettings = LocalizedFooterSettings & Pick<FooterSettings, "email" | "phone">;

export const defaultFooterSettings: FooterSettings = {
  email: "khcpqa@naver.com",
  locales: {
    ko: {
      address: "서울특별시 종로구 수표로 120 내인빌딩 8층",
      description: "체계적인 교육과 취업·창업 지원을 연결하는\n프리미엄 전문 교육 플랫폼입니다."
    },
    en: {
      address: "8F, Naein Building, 120 Supyo-ro, Jongno-gu, Seoul",
      description: "A professional education platform connecting practical training with career and business support."
    },
    es: {
      address: "8.º piso, Edificio Naein, 120 Supyo-ro, Jongno-gu, Seúl",
      description: "Una plataforma educativa profesional que conecta formación práctica con apoyo profesional y empresarial."
    },
    "zh-CN": {
      address: "韩国首尔特别市钟路区水标路120号Naein大厦8层",
      description: "连接实务教育、就业与创业支持的专业教育平台。"
    }
  },
  phone: "02-581-1278"
};

function cleanText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function normalizeFooterSettings(value: unknown): FooterSettings {
  let parsed = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      parsed = {};
    }
  }

  const source = parsed && typeof parsed === "object" ? parsed as Partial<FooterSettings> : {};
  const localizedSource: Partial<Record<Locale, Partial<LocalizedFooterSettings>>> =
    source.locales && typeof source.locales === "object" ? source.locales : {};
  const localized = Object.fromEntries(locales.map((locale) => {
    const current = localizedSource[locale] && typeof localizedSource[locale] === "object"
      ? localizedSource[locale]
      : {};
    const fallback = defaultFooterSettings.locales[locale];

    return [locale, {
      address: cleanText(current.address, fallback.address),
      description: cleanText(current.description, fallback.description)
    }];
  })) as Record<Locale, LocalizedFooterSettings>;

  return {
    email: cleanText(source.email, defaultFooterSettings.email),
    locales: localized,
    phone: cleanText(source.phone, defaultFooterSettings.phone)
  };
}

export function serializeFooterSettings(settings: FooterSettings) {
  return JSON.stringify(normalizeFooterSettings(settings));
}

export async function getPublishedFooterSettings(locale: Locale): Promise<PublicFooterSettings> {
  const fallback = {
    ...defaultFooterSettings.locales[locale],
    email: defaultFooterSettings.email,
    phone: defaultFooterSettings.phone
  };

  if (!hasSupabaseBrowserEnv()) {
    return fallback;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_content_items")
    .select("body")
    .eq("content_type", "Page")
    .eq("locale", "ko")
    .eq("slug", FOOTER_SETTINGS_SLUG)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data?.body) {
    return fallback;
  }

  const settings = normalizeFooterSettings(data.body);
  return {
    ...settings.locales[locale],
    email: settings.email,
    phone: settings.phone
  };
}
