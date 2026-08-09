const countryDialCodes: Record<string, string> = {
  Australia: "+61",
  Brazil: "+55",
  Canada: "+1",
  China: "+86",
  France: "+33",
  Germany: "+49",
  "Hong Kong": "+852",
  Indonesia: "+62",
  Japan: "+81",
  Korea: "+82",
  Malaysia: "+60",
  Mexico: "+52",
  Philippines: "+63",
  Singapore: "+65",
  Spain: "+34",
  Taiwan: "+886",
  Thailand: "+66",
  "United Kingdom": "+44",
  "United States": "+1",
  Vietnam: "+84"
};

function getCountryDialCode(countryValue?: string) {
  return countryValue ? countryDialCodes[countryValue] ?? "" : "";
}

function compactInternationalPhone(value: string) {
  const compacted = value.replace(/[^\d+]/g, "");
  return compacted.startsWith("+") ? `+${compacted.slice(1).replace(/\+/g, "")}` : compacted;
}

export function normalizePhoneNumber(value: string, countryValue?: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (!trimmed) {
    return "";
  }

  if (countryValue === "Korea" && digits.startsWith("0") && digits.length >= 9 && digits.length <= 11) {
    return digits;
  }

  if (trimmed.startsWith("+")) {
    return compactInternationalPhone(trimmed);
  }

  const dialCode = getCountryDialCode(countryValue);
  if (dialCode && countryValue !== "Korea" && digits.length >= 6) {
    return `${dialCode}${digits.replace(/^0+/, "")}`;
  }

  if (digits.startsWith("0") && digits.length >= 9 && digits.length <= 11) {
    return digits;
  }

  return trimmed.replace(/\s+/g, " ");
}

function groupInternationalDigits(digits: string) {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 10) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10)}`;
}

export function formatPhoneNumber(value: string, countryValue?: string) {
  const normalized = normalizePhoneNumber(value, countryValue);
  const digits = normalized.replace(/\D/g, "");

  if (countryValue === "Korea" && /^01[016789]\d{7,8}$/.test(digits)) {
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  if (countryValue === "Korea" && /^02\d{7,8}$/.test(digits)) {
    if (digits.length === 9) {
      return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    }

    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  if (countryValue === "Korea" && /^0\d{8,10}$/.test(digits)) {
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  if (normalized.startsWith("+")) {
    const dialCode = getCountryDialCode(countryValue);
    if (dialCode && normalized.startsWith(dialCode)) {
      return `${dialCode} ${groupInternationalDigits(normalized.slice(dialCode.length))}`.trim();
    }
  }

  return normalized.replace(/\s+/g, " ");
}
