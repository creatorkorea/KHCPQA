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
  buildCreateAdminUserPayload,
  buildUpdateAdminUserPayload,
  getAdminUserStatusLabel
} = await importTsModule("src/lib/admin-users.ts");

test("buildCreateAdminUserPayload trims values and defaults member metadata", () => {
  const result = buildCreateAdminUserPayload({
    country: " Korea ",
    email: " Member@Example.COM ",
    fullName: " 홍길동 ",
    interestedCourse: " 피부미용사 국가자격증 ",
    marketingOptIn: true,
    password: "secret123",
    phone: " 010-1234-5678 ",
    preferredLocale: "",
    role: "",
    status: ""
  });

  assert.equal(result.ok, true);
  assert.equal(result.payload.email, "member@example.com");
  assert.equal(result.payload.fullName, "홍길동");
  assert.equal(result.payload.country, "Korea");
  assert.equal(result.payload.interestedCourse, "피부미용사 국가자격증");
  assert.equal(result.payload.marketingOptIn, true);
  assert.equal(result.payload.phone, "010-1234-5678");
  assert.equal(result.payload.preferredLocale, "ko");
  assert.equal(result.payload.role, "user");
  assert.equal(result.payload.status, "active");
});

test("buildCreateAdminUserPayload rejects invalid email, short password, role, status, and locale", () => {
  const result = buildCreateAdminUserPayload({
    country: "",
    email: "not-email",
    fullName: "",
    password: "123",
    preferredLocale: "fr",
    role: "owner",
    status: "locked"
  });

  assert.equal(result.ok, false);
  assert.match(result.message, /이메일/);
  assert.match(result.message, /비밀번호/);
  assert.match(result.message, /권한/);
  assert.match(result.message, /상태/);
  assert.match(result.message, /언어/);
});

test("buildUpdateAdminUserPayload requires id and normalizes editable profile fields", () => {
  const result = buildUpdateAdminUserPayload({
    country: " Spain ",
    email: " User@Example.com ",
    fullName: " Admin User ",
    interestedCourse: " Global Course ",
    marketingOptIn: true,
    phone: " +34 600 000 000 ",
    preferredLocale: "es",
    role: "viewer",
    status: "suspended",
    userId: "user-1"
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.payload, {
    country: "Spain",
    email: "user@example.com",
    fullName: "Admin User",
    interestedCourse: "Global Course",
    marketingOptIn: true,
    phone: "+34 600 000 000",
    preferredLocale: "es",
    role: "viewer",
    status: "suspended",
    userId: "user-1"
  });
});

test("getAdminUserStatusLabel maps deleted accounts distinctly", () => {
  assert.equal(getAdminUserStatusLabel("active"), "활성");
  assert.equal(getAdminUserStatusLabel("suspended"), "정지");
  assert.equal(getAdminUserStatusLabel("deleted"), "삭제됨");
});
