import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));

function runAudit(script, expected) {
  const result = spawnSync(process.execPath, [script], {
    cwd: root,
    encoding: "utf8",
    timeout: 120_000,
  });
  assert.ifError(result.error);
  assert.equal(
    result.status,
    0,
    `${script} failed (exit ${result.status}):\n${result.stdout}\n${result.stderr}`,
  );
  assert.match(result.stdout, expected);
}

test("curriculum structure and wiring satisfy integrity invariants", () => {
  runAudit("scripts/audit-curriculum-integrity.mjs", /Curriculum integrity audit passed:/);
});

test("Python curriculum examples execute and match published outputs", () => {
  runAudit("scripts/check-python-teaching-examples.mjs", /Python learner-example validation passed: 28 independently executed snippets and 6 stateful lesson sequences/);
});

test("Java dependency-injection lesson executes and matches published output", () => {
  runAudit("scripts/check-java-teaching-examples.mjs", /Java learner-example validation passed:/);
});

test("all-school source code evidence report runs and inventories modules", () => {
  runAudit("scripts/report-curriculum-code-evidence.mjs", /Code evidence by language \(source-level, not runtime pass rates\):/);
});

test("practical contract inventory runs across all curriculum schools", () => {
  runAudit("scripts/report-curriculum-practicals.mjs", /Practical source audit: \d+ path files; \d+ explicit practical content objects; \d+ use computed fields; 0 literal missing\/empty candidates\./);
});

test("resolved curriculum practical contracts are present across all 12 schools", () => {
  runAudit("scripts/check-resolved-practical-contracts.mjs", /Resolved practical contracts: 12 schools, \d+ paths, \d+ lessons, \d+ practical activities; 0 missing\/empty contract findings\./);
});

test("learner-facing curriculum audit covers all 12 assembled schools", () => {
  runAudit("scripts/audit-learner-facing-curriculum.mjs", /Learner-facing audit: 12 schools, \\d+ paths, \\d+ lessons, \\d+ activities, \\d+ practicals, \\d+ embedded code blocks\\./);
});

test("curriculum object literals do not contain duplicate static property keys", () => {
  runAudit("scripts/check-duplicate-curriculum-object-keys.mjs", /Duplicate curriculum object keys: \d+ path files, \d+ object literals, 0 duplicate keys; 0 syntax errors\./);
});

test("runtime curriculum compiles with TypeScript project settings", () => {
  const result = spawnSync("pnpm", ["--filter", "@tsa/runtime-kernel", "exec", "tsc", "-p", "tsconfig.build.json", "--noEmit"], {
    cwd: root,
    encoding: "utf8",
    timeout: 120_000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, `Runtime TypeScript typecheck failed:\n${result.stdout}\n${result.stderr}`);
});
