import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const original = readFileSync("packages/runtime-kernel/src/paths/quality-automation-framework-engineering-deep.ts", "utf8");
const match = original.match(/const retryEvidenceJava = ("(?:\\.|[^"\\])*");/);
assert.ok(match && original.includes("code: retryEvidenceJava"), "Original retries reading must publish actual runnable code");
const java = JSON.parse(match[1]);
const dir = mkdtempSync(join(tmpdir(), "tsa-quality-retry-"));
function cmd(bin, args) {
  const r = spawnSync(bin, args, { cwd: dir, encoding: "utf8", timeout: 10000 });
  assert.ifError(r.error);
  return r;
}
try {
  writeFileSync(join(dir, "RetryEvidenceProof.java"), java);
  let r = cmd("javac", ["RetryEvidenceProof.java"]);
  assert.equal(r.status, 0, r.stderr);
  r = cmd("java", ["RetryEvidenceProof"]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim(), [
    "attempt=1 result=FAIL", "attempt=2 result=PASS",
    "final=RECOVERED_UNSTABLE, not CLEAN_PASS",
  ].join("\n"));
  const mutant = java.replace('history.add("attempt=" + n + " result=" + (success ? "PASS" : "FAIL"));', "");
  assert.notEqual(mutant, java, "History-loss mutant must change source");
  writeFileSync(join(dir, "RetryEvidenceProof.java"), mutant);
  r = cmd("javac", ["RetryEvidenceProof.java"]);
  assert.equal(r.status, 0, r.stderr);
  r = cmd("java", ["RetryEvidenceProof"]);
  assert.notEqual(r.status, 0, "Lost first attempt must never be reported as green");
  assert.match(r.stderr, /AssertionError: first failure evidence disappeared/);
  console.log("PASS source-published Quality retry history and misleading clean-pass mutant.");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
