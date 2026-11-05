// Executes exact learner-published Software Craft code, never parallel hand-built fixtures.
import assert from "node:assert/strict";
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const source = fs.readFileSync("packages/runtime-kernel/src/paths/builder-software-craft-deep.ts", "utf8");
const quality = fs.readFileSync("packages/runtime-kernel/src/paths/builder-software-craft-quality.ts", "utf8");
const lessonNames = [
  "Configuration Precedence and Startup Gates",
  "Logging Failure Paths and Correlation",
  "HTTP Error Contracts and Client Oracles",
];
const lessonPositions = lessonNames.map(name => source.indexOf('\n    lesson(\n        "' + name + '"'));
assert.ok(lessonPositions.every(pos => pos > 0), "Missing split Software Craft module lessons");
assert.ok(lessonPositions[0] < lessonPositions[1] &&
  lessonPositions[1] < lessonPositions[2], "Software Craft must teach config before logging before errors");
for (const id of [
  "software-craft-configuration-precedence-and-startup-gates",
  "software-craft-logging-failure-paths-and-correlation",
  "software-craft-http-error-contracts-and-client-oracles",
]) {
  assert.ok(quality.includes('"' + id + '": {'),
    "The independent new lesson has no specific applied learner practice: " + id);
}
function publishedCode(caption) {
  const anchor = '"caption": "' + caption + '"';
  const position = source.indexOf(anchor);
  assert.ok(position > 0, "Missing exact learner-facing source caption: " + caption);
  const match = source.slice(position, position + 24000).match(
    /"code":\s*("(?:\\.|[^"\\])*")/);
  assert.ok(match, "Missing executable code following: " + caption);
  return JSON.parse(match[1]);
}
const checks = [
  {
    caption: "settings_precedence.py — deterministic source precedence, no secret IO",
    expected: ["DECLARED_PRECEDENCE_DEPLOYMENT_OVER_DEFAULT_OK"],
  },
  {
    caption: "settings_gate.py — fully runnable typed parser and fail-before-start negative tests",
    expected: [
      "VALID_LOCAL_SETTINGS_BEFORE_START_OK", "REJECTED_BEFORE_START_MISSING_DB",
      "REJECTED_BEFORE_START_UNSAFE_DEBUG", "REJECTED_BEFORE_START_BAD_BOOLEAN",
      "REJECTED_BEFORE_START_BAD_WORKERS", "REJECTED_BEFORE_START_INVALID_DATABASE",
      "CONFIGURATION_STARTUP_GATE_AND_FALSE_BOOLEAN_COUNTEREXAMPLE_OK",
    ],
  },
  {
    caption: "event_level_contract.py — bounded event, level and field-policy table",
    expected: ["LOG_LEVEL_AND_CONTEXT_POLICY_OK"],
  },
  {
    caption: "event_logging_lab.py — real JSON log events, forbidden request and unsafe-leak mutant",
    expected: ["LOG_SUCCESS_AND_DENIAL_CONTEXT_NO_SECRET_OK",
               "LOG_UNSAFE_MUTANT_DETECTED", "LOG_EVENT_CONTRACT_AND_NEGATIVE_ORACLE_OK"],
  },
  {
    caption: "http_error_client_matrix.py — executable status, code and client-action mapping",
    expected: ["HTTP_ERROR_CLIENT_DECISION_MATRIX_OK"],
  },
  {
    caption: "public_errors_http_lab.py — real loopback 400/401/403/404/409/500/200 and leak negative control",
    expected: [
      "HTTP_ERROR_CONTRACT_UNAUTHENTICATED_OK", "HTTP_ERROR_CONTRACT_FORBIDDEN_OK",
      "HTTP_ERROR_CONTRACT_MALFORMED_OK", "HTTP_ERROR_CONTRACT_FORGED_FIELD_OK",
      "HTTP_ERROR_CONTRACT_STALE_OK", "HTTP_ERROR_CONTRACT_404_500_200_OK",
      "HTTP_ERROR_CONTRACT_LEAK_NEGATIVE_CONTROL_OK",
      "HTTP_ERROR_CONTRACT_LOOPBACK_CLOSED_OK",
    ],
  },
  {
    caption: "dependency_boundary_lab.py — executable offline direct/transitive dependency oracle",
    expected: [
      "INTERPRETER_AND_INSTALLED_METADATA_INSPECTED",
      "TRANSITIVE_IMPORT_REQUIRES_DECLARATION",
      "DEPENDENCY_MANIFEST_NOT_INSTALLED_TREE_OK",
      "DEPENDENCY_OFFLINE_INVENTORY_BOUNDARY_OK",
    ],
  },
];
for (const entry of checks) {
  const code = publishedCode(entry.caption);
  assert.ok(code.length > 100, "Published source is not a complete executable checkpoint");
  const result = spawnSync("python3", ["-c", code], {
    encoding: "utf8", timeout: 25000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0,
    "Published Software Craft program failed: " + entry.caption +
    "\n" + result.stdout + "\n" + result.stderr);
  for (const expected of entry.expected) {
    assert.ok(result.stdout.includes(expected),
      "Source program did not prove " + expected + ": " + entry.caption +
      "\n" + result.stdout + "\n" + result.stderr);
  }
  console.log("PASS source-derived Software Craft checkpoint:", entry.caption);
}
// Prevent removal of specific negative mechanisms while leaving a stale label.
const cfg = publishedCode(checks[1].caption);
assert.ok(cfg.includes("len(calls) == before") &&
  cfg.includes('bool("false") is True'), "Startup negative controls removed");
const logging = publishedCode(checks[3].caption);
assert.ok(logging.includes("len(events) == 2") &&
  logging.includes("assert_no_secret(bad_stream.getvalue())"),
  "Log cardinality or intentional secret-leak negative missing");
const http = publishedCode(checks[5].caption);
assert.ok(http.includes("ThreadingHTTPServer((\"127.0.0.1\", 0)") &&
  http.includes("server.shutdown()") &&
  http.includes("assert not public_safe(unsafe)"), "Real loopback or negative leak oracle removed");
assert.ok(source.includes("ADR versus runbook — complete proposed decision and non-destructive diagnostic examples"),
  "Worked two-document handoff removed");
console.log("Software Craft source-derived executable labs passed: 7 exact published programs and negative controls.");
