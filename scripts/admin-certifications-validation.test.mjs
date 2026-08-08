import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importTsModule(path) {
  const source = await readFile(path, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020
    }
  }).outputText;
  const encoded = Buffer.from(output).toString("base64");
  return import(`data:text/javascript;base64,${encoded}#${pathToFileURL(path).href}`);
}

const {
  buildAdminCertificationPayload,
  formatAdminCertificationDate,
  getAdminCertificationStatusLabel
} = await importTsModule("src/lib/admin-certifications.ts");

test("buildAdminCertificationPayload normalizes required certificate fields", () => {
  const result = buildAdminCertificationPayload({
    adminNote: " 운영 확인 ",
    certificateNumber: " SMC-2026-001 ",
    courseTitle: " 피부미용사 국가자격증 ",
    expiresAt: "2028-05-18",
    issuedAt: "2026-05-18",
    status: "issued",
    userEmail: " Member@Example.COM ",
    verificationCode: ""
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.payload, {
    certificateNumber: "SMC-2026-001",
    courseTitle: "피부미용사 국가자격증",
    expiresAt: "2028-05-18",
    issuedAt: "2026-05-18",
    adminNote: "운영 확인",
    status: "issued",
    userEmail: "member@example.com",
    verificationCode: "SMC-2026-001"
  });
});

test("buildAdminCertificationPayload rejects missing and invalid certificate fields", () => {
  const result = buildAdminCertificationPayload({
    adminNote: "",
    certificateNumber: "",
    courseTitle: "",
    expiresAt: "2026/05/19",
    issuedAt: "2026/05/18",
    status: "active",
    userEmail: "not-email",
    verificationCode: ""
  });

  assert.equal(result.ok, false);
  assert.match(result.message, /회원 이메일/);
  assert.match(result.message, /자격명/);
  assert.match(result.message, /자격번호/);
  assert.match(result.message, /발급일/);
  assert.match(result.message, /만료일/);
  assert.match(result.message, /상태/);
});

test("certification status labels are operator friendly", () => {
  assert.equal(getAdminCertificationStatusLabel("issued"), "발급됨");
  assert.equal(getAdminCertificationStatusLabel("expired"), "만료됨");
  assert.equal(getAdminCertificationStatusLabel("revoked"), "취소됨");
});

test("formatAdminCertificationDate keeps optional expiry display scannable", () => {
  assert.equal(formatAdminCertificationDate(""), "-");
  assert.equal(formatAdminCertificationDate("2028-05-18"), "2028. 05. 18.");
});

test("AdminCertificationsManager connects the new certification form to the save action", async () => {
  const pageSource = await readFile("src/app/admin/certifications/page.tsx", "utf8");
  const managerSource = await readFile("src/components/AdminCertificationsManager.tsx", "utf8");

  assert.match(pageSource, /AdminCertificationsManager/);
  assert.match(pageSource, /admin-certifications-panel/);
  assert.match(managerSource, /saveAdminCertification/);
  assert.match(managerSource, /새 자격 등록/);
  assert.match(managerSource, /name="userEmail"/);
  assert.match(managerSource, /name="courseTitle"/);
  assert.match(managerSource, /name="certificateNumber"/);
  assert.match(managerSource, /name="issuedAt"/);
  assert.match(managerSource, /name="verificationCode"/);
});

test("AdminCertificationsManager can open existing certifications for editing", async () => {
  const dataSource = await readFile("src/lib/admin-data.ts", "utf8");
  const managerSource = await readFile("src/components/AdminCertificationsManager.tsx", "utf8");

  assert.match(dataSource, /verification_code/);
  assert.match(dataSource, /expires_at/);
  assert.match(dataSource, /admin_note/);
  assert.match(dataSource, /userEmail/);
  assert.match(dataSource, /issuedAtRaw/);
  assert.match(managerSource, /name="expiresAt"/);
  assert.match(managerSource, /name="adminNote"/);
  assert.match(managerSource, /만료일/);
  assert.match(managerSource, /expiresAtDisplay/);
  assert.match(managerSource, /type Mode = "create" \| "update"/);
  assert.match(managerSource, /openEditModal/);
  assert.match(managerSource, /자격 수정/);
  assert.match(managerSource, /자격 수정 저장/);
});

test("AdminCertificationsManager keeps the certification list scannable", async () => {
  const managerSource = await readFile("src/components/AdminCertificationsManager.tsx", "utf8");
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(managerSource, /admin-certifications-toolbar/);
  assert.match(managerSource, /admin-certifications-summary/);
  assert.match(managerSource, /admin-certifications-status-filter/);
  assert.match(managerSource, /admin-certification-number/);
  assert.match(managerSource, /admin-certification-user-cell/);
  assert.match(styleSource, /\.admin-certifications-panel/);
  assert.match(styleSource, /\.admin-certifications-filter-bar/);
  assert.match(styleSource, /\.admin-certifications-status-filter button\.is-active/);
  assert.match(styleSource, /\.admin-certification-number/);
});
