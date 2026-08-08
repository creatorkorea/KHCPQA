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

const { formatPhoneNumber, normalizePhoneNumber } = await importTsModule("src/lib/phone.ts");

test("normalizePhoneNumber stores Korean phone numbers as digits only", () => {
  assert.equal(normalizePhoneNumber("010-1234-1234"), "01012341234");
  assert.equal(normalizePhoneNumber("01012341234"), "01012341234");
  assert.equal(normalizePhoneNumber("02-581-1278"), "025811278");
});

test("formatPhoneNumber displays Korean phone numbers with hyphens", () => {
  assert.equal(formatPhoneNumber("01012341234"), "010-1234-1234");
  assert.equal(formatPhoneNumber("0101234567"), "010-123-4567");
  assert.equal(formatPhoneNumber("025811278"), "02-581-1278");
});

test("international phone-like values are preserved without forced Korean formatting", () => {
  assert.equal(normalizePhoneNumber("+34 600 000 000"), "+34 600 000 000");
  assert.equal(formatPhoneNumber("+34 600 000 000"), "+34 600 000 000");
});
