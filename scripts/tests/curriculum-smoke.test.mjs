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
  runAudit("scripts/check-python-teaching-examples.mjs", /Python learner-example validation passed: 22 independently executed snippets/);
});

test("Java dependency-injection lesson executes and matches published output", () => {
  runAudit("scripts/check-java-teaching-examples.mjs", /Java learner-example validation passed:/);
});
