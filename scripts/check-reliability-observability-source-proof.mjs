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
