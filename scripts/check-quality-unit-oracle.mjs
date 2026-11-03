import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
const text = readFileSync("packages/runtime-kernel/src/paths/quality-unit-component-testing-deep.ts", "utf8");
const match = text.match(/const unitTransferOracleJava = ("(?:\\.|[^"\\])*");/);
assert.ok(match, "Unit oracle must be published in original Quality lesson");
assert.ok(text.includes("code: unitTransferOracleJava"), "Teaching blocks must actually display the same Java source");
const java = JSON.parse(match[1]);
const dir = mkdtempSync(join(tmpdir(), "tsa-quality-unit-"));
function run(cmd, args) {
  const out = spawnSync(cmd, args, { cwd: dir, encoding: "utf8", timeout: 12000 });
  assert.ifError(out.error);
  return out;
}
try {
  writeFileSync(join(dir, "UnitTransferOracle.java"), java);
  let out = run("javac", ["UnitTransferOracle.java"]);
  assert.equal(out.status, 0, out.stderr);
  out = run("java", ["UnitTransferOracle"]);
  assert.equal(out.status, 0, out.stderr);
  assert.equal(out.stdout.trim(), "unit oracle: 4/4 cases passed");
  const bad = java.replace("owner && active && !locked", "owner || active && !locked");
  assert.notEqual(bad, java, "The failure mutation must alter source");
  writeFileSync(join(dir, "UnitTransferOracle.java"), bad);
  out = run("javac", ["UnitTransferOracle.java"]);
  assert.equal(out.status, 0, out.stderr);
  out = run("java", ["UnitTransferOracle"]);
  assert.notEqual(out.status, 0, "Incorrect authorization rule must not pass its oracle");
  // The locked-service row is checked first and must reject an owner.\n  // A Java assertion stops execution at that first mismatched expected result.\n  assert.match(out.stderr, /AssertionError: owner=true active=true locked=true expected=false actual=true/);
  console.log("PASS exact original Unit Testing Java: independent 4-case oracle and deterministic forbidden-transfer mutant.");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
