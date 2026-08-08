export function normalizePhoneNumber(value: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (digits.startsWith("0") && digits.length >= 9 && digits.length <= 11) {
    return digits;
  }

  return trimmed.replace(/\s+/g, " ");
}

export function formatPhoneNumber(value: string) {
  const normalized = normalizePhoneNumber(value);
  const digits = normalized.replace(/\D/g, "");

  if (/^01[016789]\d{7,8}$/.test(digits)) {
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  if (/^02\d{7,8}$/.test(digits)) {
    if (digits.length === 9) {
      return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    }

    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  if (/^0\d{8,10}$/.test(digits)) {
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  return normalized.replace(/\s+/g, " ");
}
