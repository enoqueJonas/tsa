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

test("client-server architecture teaching example executes and proves boundary failures", () => {
  runAudit("scripts/check-client-server-teaching-example.mjs", /Client-server learner example passed: JSON service HTTP 200, HTTP 404 and connection refusal after shutdown\./);
});

test("web journey introductory lesson runs its exact published local curl lab", () => {
  runAudit("scripts/check-web-journey-lab.mjs", /Web journey lab passed:/);
});

test("Web and API Foundations JSON teaching examples execute and match their outputs", () => {
  runAudit("scripts/check-web-api-teaching-examples.mjs", /Web\/API learner JSON examples passed:/);
});

test("final Web/API lab executes the published curl sequence", () => {
  runAudit("scripts/check-final-api-lab.mjs", /Final API lab passed:/);
});

test("method, retry and prerequisite examples execute from their teaching source", () => {
  runAudit("scripts/check-method-retry-teaching-examples.mjs", /Method\/retry teaching examples passed:/);
});

test("Builder persistence and PostgreSQL-first-connection examples preserve learner order and run their published Python code", () => {
  runAudit("scripts/check-builder-data-foundations-examples.mjs", /Builder data foundations examples passed:/);
});

test("Builder Software Craft executable lessons preserve behavior, reject invalid config and avoid logging secrets", () => {
  runAudit("scripts/check-builder-craft-teaching-examples.mjs", /Builder craft examples passed:/);
});

test("Builder curriculum preserves Python, Web, Django and security domain continuity with executable examples", () => {
  runAudit("scripts/check-builder-domain-continuity.mjs", /Builder school continuity passed:/);
});

test("Builder authorization and refresh-token rotation examples execute from learner source", () => {
  runAudit("scripts/check-builder-security-teaching-examples.mjs", /Builder security teaching examples passed:/);
});

test("System Thinker XML and XSD examples execute from the actual learner source", () => {
  runAudit("scripts/check-system-thinker-xml-teaching-examples.mjs", /System Thinker XML/);
});

test("System Thinker file handoff example demonstrates persisted replay evidence from learner source", () => {
  runAudit("scripts/check-system-thinker-file-handoff-teaching-example.mjs", /System Thinker file handoff learner example passed:/);
});

test("System Thinker quality target and real loopback dependency failure run from published learner code", () => {
  runAudit("scripts/check-system-thinker-reasoning-teaching-examples.mjs", /System Thinker requirements and failure-mode learner examples passed:/);
});

test("System Thinker SOAP 1.1 WSDL and Fault outcomes run from learner code", () => {
  runAudit("scripts/check-system-thinker-soap-wire-teaching-example.mjs", /System Thinker SOAP 1.1 learner/);
});

test("System Thinker loopback FTP learner example demonstrates real transfer and negative authentication", () => {
  runAudit("scripts/check-system-thinker-ftp-teaching-example.mjs", /System Thinker FTP learner experiment passed:/);
});

test("System Thinker message ordering source code prevents stale and duplicate regression", () => {
  runAudit("scripts/check-system-thinker-messaging-order-teaching-example.mjs", /System Thinker messaging order example passed:/);
});

test("System Thinker SFTP source executes real SSH host trust, user auth, incomplete transfer and refusal", () => {
  runAudit("scripts/check-system-thinker-sftp.mjs", /System Thinker real pinned-SSH\/SFTP lesson passed:/);
});

test("System Thinker Data Flow shows lost HTTP response after commit, durable replay and key collision", () => {
  runAudit("scripts/check-system-thinker-http-ambiguous-commit.mjs", /System Thinker ambiguous HTTP learner example passed:/);
});

test("System Thinker Kafka comparison teaches independent group offsets and replay, without pretending to run Kafka", () => {
  runAudit("scripts/check-system-thinker-kafka-comparison-model.mjs", /System Thinker Kafka offset model passed:/);
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
  runAudit("scripts/audit-learner-facing-curriculum.mjs", /Learner-facing audit: 12 schools, \d+ paths, \d+ lessons, \d+ activities, \d+ practicals, \d+ embedded code blocks\.[\s\S]*Learner-facing structural findings: 0(?:\r?\n|$)/);
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
