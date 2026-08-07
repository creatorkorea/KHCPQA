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
  buildUpdateAdminInquiryPayload,
  getAdminInquiryStatusLabel,
  getAdminInquiryTypeLabel
} = await importTsModule("src/lib/admin-inquiries.ts");

test("buildUpdateAdminInquiryPayload requires receipt and normalizes status note", () => {
  const result = buildUpdateAdminInquiryPayload({
    managerNote: " 답변 완료 ",
    receipt: " KHCPQA-2026-ABC ",
    status: "answered"
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.payload, {
    managerNote: "답변 완료",
    receipt: "KHCPQA-2026-ABC",
    status: "answered"
  });
});

test("inquiry labels are operator friendly", () => {
  assert.equal(getAdminInquiryStatusLabel("new"), "신규");
  assert.equal(getAdminInquiryStatusLabel("in_review"), "검토중");
  assert.equal(getAdminInquiryStatusLabel("answered"), "답변완료");
  assert.equal(getAdminInquiryStatusLabel("closed"), "종료");
  assert.equal(getAdminInquiryTypeLabel("partnership"), "파트너십");
});
