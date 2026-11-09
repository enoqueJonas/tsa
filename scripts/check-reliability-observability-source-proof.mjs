import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const source=readFileSync("packages/runtime-kernel/src/paths/reliability-observability-source-proof.ts","utf8");
const lesson=readFileSync("packages/runtime-kernel/src/paths/reliability-observability-deep.ts","utf8");
assert.ok(lesson.includes("...(originalObservabilitySignalProof[spec.id] ?? [])"),"Original observability reading not wired");
const match=source.match(/export const syntheticReliabilitySignalPython = ("(?:\\.|[^"\\])*");/);
assert.ok(match,"Cannot extract learner source code");
const code=JSON.parse(match[1]);
const result=spawnSync("python3",["-c",code],{encoding:"utf8",timeout:12000});
assert.ifError(result.error);assert.equal(result.status,0,result.stderr);
for(const item of ["synthetic_error_ratio=0.25","sanitized_event_matches=1","linked_spans=2","unlinked_worker_spans=1"]){
 assert.ok(result.stdout.includes(item),"Source example wrong or missing: "+item);
}
const ids=["logs-metrics-traces","telemetry-design"];
for(const id of ids)assert.ok(source.includes('"'+id+'": ['),"Missing authored source for "+id);
assert.ok(source.includes("UNVERIFIED"),"Do not imply toy example proves real monitoring.");
console.log("PASS exact authored local cross-signal diagnostic: metric ratio, matching log, linked spans and missing context. Real Graylog/Prometheus/Tempo UNVERIFIED.");

const actualText=readFileSync("packages/runtime-kernel/src/paths/reliability-observability-correlation-evidence.ts","utf8");
const mapStart="export const correlationEvidenceById: Record<string,Section[]> = ";
const from=actualText.indexOf(mapStart);
const to=actualText.indexOf(";\nexport function correlationEvidenceBlocks",from);
assert.ok(from>=0 && to>from,"Cannot extract exact published HTTP/SQLite source map");
const actual=JSON.parse(actualText.slice(from+mapStart.length,to));
assert.deepEqual(Object.keys(actual).sort(),["correlation-context","instrumentation"]);
const py=actual["correlation-context"].find(s=>s.code?.language==="python")?.code.code;
assert.ok(py,"Original correlation reading missing Python 3 experiment");
for (const boundary of ["ThreadingHTTPServer", "sqlite3.connect(db_file)", "CREATE TABLE outbox",
  "CREATE TABLE effects", "consumer.commit()  # effect is durable BEFORE the outcome log",
  "parse_traceparent", 'fake_secret = "Bearer DO_NOT_LOG_CLASSROOM_TOKEN"'
]) assert.ok(py.includes(boundary),"Missing real source boundary: "+boundary);
const loggingLesson=readFileSync("packages/runtime-kernel/src/paths/reliability-production-logging-deep.ts","utf8");
const loggingSource=readFileSync("packages/runtime-kernel/src/paths/reliability-logging-source-depth.ts","utf8");
assert.ok(lesson.includes("...correlationEvidenceBlocks(spec.id)"),"Real source not wired to original Observability lessons");
for(const phrase of ["Copy and execute the complete Python 3 source", "remove the durable effect write", "Actual RabbitMQ, OpenTelemetry, Graylog, Tempo"]) {
  assert.ok(lesson.includes(phrase),"Original Observability paired practical incomplete: "+phrase);
}
for(const phrase of ["Run the prior Observability HTTP-to-outbox proof", "Execute an allowlist against a real synthetic Authorization header"]) {
  assert.ok(loggingSource.includes(phrase),"Original Production Logging reading missing genuine transfer: "+phrase);
}
for(const phrase of ["Reuse the published Python 3 correlation_lab.py", "Intentionally inject the incoming Authorization header"]) {
  assert.ok(loggingLesson.includes(phrase),"Original Production Logging practical missing executable negative: "+phrase);
}
function execute(program) {
  const out=spawnSync("python3",["-c",program],{encoding:"utf8",timeout:18000});
  assert.ifError(out.error);
  return out;
}
const proof=execute(py);
assert.equal(proof.status,0,proof.stderr);
for(const line of [
  "api_acks=2 committed_outbox=2 durable_effects=2",
  "good_trace_linked=True missing_worker_trace=True",
  "request_id_still_correlates=True secret_absent=True",
  "LOCAL_CONTEXT_EXPERIMENT_ONLY: no actual RabbitMQ, Graylog or Tempo"
]) assert.ok(proof.stdout.includes(line),"Wrong actual HTTP/outbox outcome: "+line+"\n"+proof.stdout);
const mutants=[
 ["drop healthy worker trace",
  "log_worker_trace_id = (parse_traceparent(traceparent)\n                                   if not drop_worker_trace else None)",
  "log_worker_trace_id = None"],
 ["drop source-request ID in consumer",
  "worker_log_request_id = request_id",
  "worker_log_request_id = None"],
 ["skip committed consumer effect",
  'consumer.execute("INSERT INTO effects VALUES (?, ?)",\n                             (operation_id, "completed"))',
  "pass  # deliberately skipped actual durable effect"],
 ["emit sensitive Authorization header",
  "emit(api_event)",
  'api_event["authorization"] = self.headers.get("Authorization")\n            emit(api_event)']
];
for(const [name,before,after] of mutants) {
  assert.ok(py.includes(before),"Mutant anchor missing: "+name);
  const wrong=execute(py.replace(before,after));
  assert.notEqual(wrong.status,0,"Unsafe source mutation wrongly passed: "+name);
  assert.match(wrong.stderr,/AssertionError/,name+" must fail a real guard");
  assert.doesNotMatch(wrong.stderr,/SyntaxError/,name+" invalid test setup");
}
console.log("PASS exact learner-published local HTTP -> committed SQLite outbox/effect, propagation loss, safe-log allowlist and four rejected source mutants; no live RabbitMQ/Graylog/Tempo.");

