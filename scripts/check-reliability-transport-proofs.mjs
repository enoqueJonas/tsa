import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function runExactSource(path, name, expected) {
  const source = readFileSync(path, "utf8");
  const prefix = "export const " + name + " = ";
  const assignment = source.split("\n").find((line) => line.startsWith(prefix));
  assert.ok(assignment, "Missing exact source fixture " + name);
  const literal = assignment.slice(prefix.length);
  assert.ok(literal.endsWith(";"), "Fixture must be a JSON string literal");
  const snippet = JSON.parse(literal.slice(0, -1));
  assert.ok(!snippet.includes("0.0.0.0"), "Exercises must use localhost only");
  const run = spawnSync("python3", ["-c", snippet], {
    encoding: "utf8", timeout: 15000,
  });
  assert.ifError(run.error);
  assert.equal(run.status, 0, name + ": " + run.stderr);
  assert.match(run.stdout, expected);
}
const root = "packages/runtime-kernel/src/paths/";
const trace = readFileSync(root + "reliability-distributed-tracing-implementation-deep.ts", "utf8");
const alert = readFileSync(root + "reliability-alertmanager-implementation-deep.ts", "utf8");
assert.ok(trace.includes("...tracingTransportBlocks"), "Source tracing reading lost transport exercise");
assert.ok(alert.includes("...alertDeliveryBlocks"), "Source Alertmanager reading lost delivery exercise");
runExactSource(root + "reliability-trace-transport-proof.ts",
  "tracingLoopbackPython", /two_hop_trace_connected=true invalid_context_rejected=true/);
runExactSource(root + "reliability-alert-delivery-proof.ts",
  "receiverLoopbackPython", /firing_delivered=true receiver_503_observed=true resolved_after_recovery=true/);
console.log("PASS original reader two-hop trace context and webhook 503/recovery HTTP exercises; Tempo/Alertmanager runtime UNVERIFIED.");

const recovery = readFileSync(root + "reliability-data-protection-disaster-recovery-deep.ts", "utf8");
assert.ok(recovery.includes("...(recoverySourceProofById[spec.id] ?? [])"), "Source restore lessons lost isolated integrity drill");
runExactSource(root + "reliability-restore-integrity-proof.ts",
  "restoreIntegrityPython", /restore_hash_verified=true tampered_backup_rejected=true/);
console.log("PASS isolated exact-source file restore and deliberate corruption; real PostgreSQL RPO and RTO UNVERIFIED.");

const resilience = readFileSync(root + "reliability-resilience-distributed-failure-deep.ts", "utf8");
const fault = readFileSync(root + "reliability-fault-injection-deep.ts", "utf8");
assert.ok(resilience.includes("...(resilienceRetryProofById[spec.id] ?? [])"), "Original resilience lessons must wire actual replay exercise");
assert.ok(fault.includes("faultInjectionTransportBlocks"), "Original fault-injection lesson must wire safe experiment");
runExactSource(root + "reliability-retry-failure-proof.ts", "retryAmbiguousCommitPython", /ambiguous_commit_503=true stable_key_single_effect=true changed_key_duplicates=true/);
console.log("PASS bounded local HTTP commit failure and stable identity replay; real persistent idempotency UNVERIFIED.");
