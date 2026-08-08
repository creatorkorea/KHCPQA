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
  assert.equal(normalizePhoneNumber("010-1234-1234", "Korea"), "01012341234");
  assert.equal(normalizePhoneNumber("01012341234", "Korea"), "01012341234");
  assert.equal(normalizePhoneNumber("02-581-1278", "Korea"), "025811278");
});

test("formatPhoneNumber displays Korean phone numbers with hyphens", () => {
  assert.equal(formatPhoneNumber("01012341234", "Korea"), "010-1234-1234");
  assert.equal(formatPhoneNumber("0101234567", "Korea"), "010-123-4567");
  assert.equal(formatPhoneNumber("025811278", "Korea"), "02-581-1278");
});

test("normalizePhoneNumber stores international values with country dial codes", () => {
  assert.equal(normalizePhoneNumber("+34 600 000 000", "Spain"), "+34600000000");
  assert.equal(normalizePhoneNumber("600 000 000", "Spain"), "+34600000000");
  assert.equal(normalizePhoneNumber("212 555 1234", "United States"), "+12125551234");
});

test("formatPhoneNumber displays international values with readable spacing", () => {
  assert.equal(formatPhoneNumber("+34600000000", "Spain"), "+34 600 000 000");
  assert.equal(formatPhoneNumber("600000000", "Spain"), "+34 600 000 000");
  assert.equal(formatPhoneNumber("+12125551234", "United States"), "+1 212 555 1234");
});
