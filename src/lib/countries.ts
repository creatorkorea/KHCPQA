import type { Locale } from "@/lib/content";

export type CountryOption = {
  dialCode?: string;
  value: string;
  phonePlaceholder: string;
  labels: Record<Locale, string>;
};

export const countryOptions: CountryOption[] = [
  { value: "Korea", dialCode: "+82", phonePlaceholder: "010-1234-1234", labels: { ko: "대한민국", en: "Korea", es: "Corea" } },
  { value: "United States", dialCode: "+1", phonePlaceholder: "+1 212 555 1234", labels: { ko: "미국", en: "United States", es: "Estados Unidos" } },
  { value: "Japan", dialCode: "+81", phonePlaceholder: "+81 90 1234 5678", labels: { ko: "일본", en: "Japan", es: "Japon" } },
  { value: "China", dialCode: "+86", phonePlaceholder: "+86 138 0013 8000", labels: { ko: "중국", en: "China", es: "China" } },
  { value: "Spain", dialCode: "+34", phonePlaceholder: "+34 600 000 000", labels: { ko: "스페인", en: "Spain", es: "Espana" } },
  { value: "Mexico", dialCode: "+52", phonePlaceholder: "+52 55 1234 5678", labels: { ko: "멕시코", en: "Mexico", es: "Mexico" } },
  { value: "Other", phonePlaceholder: "+국가번호 전화번호", labels: { ko: "기타", en: "Other", es: "Otro" } }
];

export function getCountryLabel(value: string, locale: Locale) {
  return countryOptions.find((country) => country.value === value)?.labels[locale] ?? value;
}

export function getCountryPhonePlaceholder(value: string) {
  return countryOptions.find((country) => country.value === value)?.phonePlaceholder ?? "+국가번호 전화번호";
}

export function getCountryDialCode(value: string) {
  return countryOptions.find((country) => country.value === value)?.dialCode ?? "";
}
