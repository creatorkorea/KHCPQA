import type { Locale } from "@/lib/content";

export type CountryOption = {
  value: string;
  labels: Record<Locale, string>;
};

export const countryOptions: CountryOption[] = [
  { value: "Korea", labels: { ko: "대한민국", en: "Korea", es: "Corea" } },
  { value: "United States", labels: { ko: "미국", en: "United States", es: "Estados Unidos" } },
  { value: "Japan", labels: { ko: "일본", en: "Japan", es: "Japon" } },
  { value: "China", labels: { ko: "중국", en: "China", es: "China" } },
  { value: "Spain", labels: { ko: "스페인", en: "Spain", es: "Espana" } },
  { value: "Mexico", labels: { ko: "멕시코", en: "Mexico", es: "Mexico" } },
  { value: "Other", labels: { ko: "기타", en: "Other", es: "Otro" } }
];

export function getCountryLabel(value: string, locale: Locale) {
  return countryOptions.find((country) => country.value === value)?.labels[locale] ?? value;
}
