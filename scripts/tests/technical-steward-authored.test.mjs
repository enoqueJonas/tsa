import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

test("Technical Steward learner paths contain authored activities, not generic generated scaffolds", () => {
  const root = fileURLToPath(new URL("../../", import.meta.url));
  const result = spawnSync(process.execPath, ["scripts/check-technical-steward-authored.mjs"], {
    cwd: root,
    encoding: "utf8",
    timeout: 120_000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, `Author-source regression failed:\n${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Technical Steward authored-path guard passed: 13 paths,/);
});
