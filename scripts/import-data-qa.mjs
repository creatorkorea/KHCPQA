import { existsSync, readFileSync } from "node:fs";

const files = {
  adminUsers: process.env.ADMIN_USERS_CSV || "docs/templates/admin-users-template.csv",
  assetRights: process.env.ASSET_RIGHTS_CSV || "docs/templates/asset-rights-template.csv",
  certifications: process.env.CERTIFICATION_DATA_CSV || "docs/templates/certification-data-template.csv",
  contentSources: process.env.CONTENT_SOURCE_URL_CSV || "docs/templates/content-source-url-template.csv"
};

const profileRoles = new Set([
  "user",
  "viewer",
  "content_manager",
  "course_manager",
  "certification_manager",
  "inquiry_manager",
  "super_admin"
]);
const profileStatuses = new Set(["active", "suspended", "deleted"]);
const certificationStatuses = new Set(["issued", "expired", "revoked"]);
const contentTypes = new Set(["Page", "Course", "Activity", "Review"]);
const locales = new Set(["ko", "en", "es"]);
const contentRightsStatuses = new Set(["yes", "no", "needs_review"]);
const assetRightsStatuses = new Set(["yes", "no", "needs_review"]);

const results = [];

validateAdminUsers(readCsv(files.adminUsers), files.adminUsers);
validateCertifications(readCsv(files.certifications), files.certifications);
validateContentSources(readCsv(files.contentSources), files.contentSources);
validateAssetRights(readCsv(files.assetRights), files.assetRights);

const failures = results.filter((result) => result.level === "FAIL");
const warnings = results.filter((result) => result.level === "WARN");

for (const result of results) {
  console.log(`[${result.level}] ${result.file}: ${result.message}`);
}

console.log("");
console.log(`Data import QA completed with ${failures.length} failure(s), ${warnings.length} warning(s).`);

if (failures.length > 0) {
  process.exit(1);
}

function validateAdminUsers(csv, file) {
  requireHeaders(csv, file, ["email", "full_name", "role", "status", "notes"]);
  const emails = new Set();
  let superAdminCount = 0;

  for (const [index, row] of csv.rows.entries()) {
    const rowNumber = index + 2;
    requireValue(row.email, file, rowNumber, "email");
    requireValue(row.full_name, file, rowNumber, "full_name");
    requireAllowed(row.role, profileRoles, file, rowNumber, "role");
    requireAllowed(row.status, profileStatuses, file, rowNumber, "status");
    requireEmail(row.email, file, rowNumber);

    const emailKey = row.email.toLowerCase();
    if (emails.has(emailKey)) {
      fail(file, `row ${rowNumber}: duplicate email "${row.email}"`);
    }
    emails.add(emailKey);

    if (row.role === "super_admin" && row.status === "active") {
      superAdminCount += 1;
    }
  }

  if (superAdminCount === 0) {
    warn(file, "no active super_admin row is present");
  }
  if (superAdminCount > 2) {
    fail(file, "active super_admin rows must be limited to 1-2 accounts");
  }

  pass(file, `${csv.rows.length} admin user row(s) checked`);
}

function validateCertifications(csv, file) {
  requireHeaders(csv, file, [
    "email",
    "full_name",
    "country",
    "course_title",
    "certificate_number",
    "issued_at",
    "expires_at",
    "status",
    "verification_code",
    "admin_note"
  ]);
  const certificateNumbers = new Set();
  const verificationCodes = new Set();

  for (const [index, row] of csv.rows.entries()) {
    const rowNumber = index + 2;
    for (const field of ["email", "full_name", "country", "course_title", "certificate_number", "issued_at", "status", "verification_code"]) {
      requireValue(row[field], file, rowNumber, field);
    }
    requireEmail(row.email, file, rowNumber);
    requireDate(row.issued_at, file, rowNumber, "issued_at");
    if (row.expires_at) {
      requireDate(row.expires_at, file, rowNumber, "expires_at");
      if (row.issued_at && row.expires_at < row.issued_at) {
        fail(file, `row ${rowNumber}: expires_at must not be before issued_at`);
      }
    }
    requireAllowed(row.status, certificationStatuses, file, rowNumber, "status");
    requireUnique(row.certificate_number, certificateNumbers, file, rowNumber, "certificate_number");
    requireUnique(row.verification_code, verificationCodes, file, rowNumber, "verification_code");
  }

  pass(file, `${csv.rows.length} certification row(s) checked`);
}

function validateContentSources(csv, file) {
  requireHeaders(csv, file, ["content_type", "locale", "slug", "title", "source_url", "image_url", "rights_confirmed", "notes"]);
  const keys = new Set();

  for (const [index, row] of csv.rows.entries()) {
    const rowNumber = index + 2;
    for (const field of ["content_type", "locale", "slug", "title", "rights_confirmed"]) {
      requireValue(row[field], file, rowNumber, field);
    }
    requireAllowed(row.content_type, contentTypes, file, rowNumber, "content_type");
    requireAllowed(row.locale, locales, file, rowNumber, "locale");
    requireAllowed(row.rights_confirmed, contentRightsStatuses, file, rowNumber, "rights_confirmed");
    requireUrlOrAsset(row.source_url, file, rowNumber, "source_url", { allowBlank: true, allowAsset: false });
    requireUrlOrAsset(row.image_url, file, rowNumber, "image_url", { allowBlank: true, allowAsset: true });
    requireUnique(`${row.content_type}:${row.locale}:${row.slug}`, keys, file, rowNumber, "content key");
  }

  pass(file, `${csv.rows.length} content source row(s) checked`);
}

function validateAssetRights(csv, file) {
  requireHeaders(csv, file, [
    "asset_type",
    "title",
    "current_location",
    "source_url",
    "owner",
    "usage_allowed",
    "allowed_scope",
    "expires_at",
    "replacement_needed",
    "notes"
  ]);

  for (const [index, row] of csv.rows.entries()) {
    const rowNumber = index + 2;
    for (const field of ["asset_type", "title", "owner", "usage_allowed", "allowed_scope"]) {
      requireValue(row[field], file, rowNumber, field);
    }
    requireAllowed(row.usage_allowed, assetRightsStatuses, file, rowNumber, "usage_allowed");
    requireUrlOrAsset(row.current_location, file, rowNumber, "current_location", {
      allowBlank: true,
      allowAsset: true,
      allowPublicAsset: true
    });
    requireUrlOrAsset(row.source_url, file, rowNumber, "source_url", { allowBlank: true, allowAsset: false });
    if (row.expires_at) {
      requireDate(row.expires_at, file, rowNumber, "expires_at");
    }
    if (row.replacement_needed && !["yes", "no"].includes(row.replacement_needed)) {
      fail(file, `row ${rowNumber}: replacement_needed must be yes, no, or blank`);
    }
  }

  pass(file, `${csv.rows.length} asset rights row(s) checked`);
}

function readCsv(file) {
  if (!existsSync(file)) {
    fail(file, "file does not exist");
    return { headers: [], rows: [] };
  }

  const lines = readFileSync(file, "utf8")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    fail(file, "file is empty");
    return { headers: [], rows: [] };
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.trim());
  const rows = lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
    if (values.length !== headers.length) {
      fail(file, `row ${index + 2}: expected ${headers.length} column(s), found ${values.length}`);
    }
    return Object.fromEntries(headers.map((header, valueIndex) => [header, (values[valueIndex] || "").trim()]));
  });

  return { headers, rows };
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function requireHeaders(csv, file, expectedHeaders) {
  const actual = csv.headers.join(",");
  const expected = expectedHeaders.join(",");
  if (actual !== expected) {
    fail(file, `headers must be exactly "${expected}"`);
  }
}

function requireValue(value, file, rowNumber, field) {
  if (!value) {
    fail(file, `row ${rowNumber}: ${field} is required`);
  }
}

function requireEmail(value, file, rowNumber) {
  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    fail(file, `row ${rowNumber}: email is invalid`);
  }
}

function requireDate(value, file, rowNumber, field) {
  if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    fail(file, `row ${rowNumber}: ${field} must use YYYY-MM-DD`);
  }
}

function requireAllowed(value, allowed, file, rowNumber, field) {
  if (value && !allowed.has(value)) {
    fail(file, `row ${rowNumber}: ${field} must be one of ${Array.from(allowed).join(", ")}`);
  }
}

function requireUnique(value, seen, file, rowNumber, field) {
  if (!value) {
    return;
  }

  const key = value.toLowerCase();
  if (seen.has(key)) {
    fail(file, `row ${rowNumber}: duplicate ${field} "${value}"`);
  }
  seen.add(key);
}

function requireUrlOrAsset(value, file, rowNumber, field, { allowBlank, allowAsset, allowPublicAsset = false }) {
  if (!value) {
    if (!allowBlank) {
      fail(file, `row ${rowNumber}: ${field} is required`);
    }
    return;
  }

  const isUrl = /^https?:\/\/\S+$/i.test(value);
  const isAsset = allowAsset && /^\/assets\/\S+$/i.test(value);
  const isPublicAsset = allowPublicAsset && /^public\/assets\/\S+$/i.test(value);
  if (!isUrl && !isAsset && !isPublicAsset) {
    const assetHint = allowPublicAsset ? "https://..., /assets/..., or public/assets/..." : "https://... or /assets/...";
    fail(file, `row ${rowNumber}: ${field} must be ${allowAsset ? assetHint : "https://..."}`);
  }
}

function pass(file, message) {
  results.push({ level: "PASS", file, message });
}

function warn(file, message) {
  results.push({ level: "WARN", file, message });
}

function fail(file, message) {
  results.push({ level: "FAIL", file, message });
}
