import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const source=readFileSync("packages/runtime-kernel/src/paths/reliability-graylog-event-trace.ts","utf8");
const entry=readFileSync("packages/runtime-kernel/src/paths/reliability-engineer.ts","utf8");
assert.ok(entry.includes("...productionLoggingDeepLessons, centralLoggingDecisionLesson, graylogEventTraceLesson"),
  "Original logging concepts must precede stack decision and real GELF lifecycle lesson");
const match=source.match(/export const graylogLocalGelfPython = ("(?:\\.|[^"\\])*");/);
assert.ok(match,"Exact learner Python not recoverable");
const code=JSON.parse(match[1]);
assert.ok(code.includes('receiver.bind(("127.0.0.1", 0))'),"Source demonstration must use loopback only");
assert.ok(code.includes('"timestamp": time.time()'),"Current timestamp required for reliable time-window searches");
assert.ok(code.includes("assert not strict_teaching_contract(malformed)"),"Missing required field negative not published");
const run=spawnSync("python3",["-c",code],{encoding:"utf8",timeout:12000});
assert.ifError(run.error);
assert.equal(run.status,0,run.stderr);
assert.match(run.stdout,/local datagram contract: PASS authorization_denied tsa-req-001/);
assert.match(run.stdout,/missing short_message rejected by strict producer contract: PASS/);
assert.ok(source.includes("GELF UDP is easy to send but does not acknowledge delivery"),
  "Do not imply UDP mock proves delivery/indexing");
assert.ok(source.includes("a successful log-sender call does not yet prove durable and searchable incident evidence"),
  "Live Graylog should be a separate evidence gate");
console.log("PASS exact source GELF schema + local UDP transport + malformed negative. Actual Graylog ingestion/search UNVERIFIED.");
