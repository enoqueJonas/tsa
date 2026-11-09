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
const contract=readFileSync("packages/runtime-kernel/src/paths/reliability-graylog-indexed-search-contract.ts","utf8");
assert.ok(source.includes('id:"logging-graylog-event-lifecycle-indexed-search-reading"') && source.includes("blocks:graylogSearchBoundaryBlocks"),
  "Focused Search API lesson must precede the unchanged original Graylog practical");
assert.ok(source.includes('id:"logging-graylog-event-lifecycle-001"') &&
          source.includes('id:"logging-graylog-event-lifecycle-002"') &&
          source.includes('id:"logging-graylog-event-lifecycle-003"'),
  "Original Graylog progress IDs must be preserved");
for (const required of [
  "DEMO_CONTRACT_PASS comes from a fake local HTTP handler",
  "TSA_DEMO_SCENARIO=ack_only",
  "TSA_GRAYLOG_VERIFY_LIVE=1",
  "Real Graylog search status or explicit NOT_TESTED"
]) assert.ok(source.includes(required),"Original practical lacks a provenance/negative gate: "+required);
const matchContract=contract.match(/export const graylogSearchBoundaryPython = ("(?:\\.|[^"\\])*");/);
assert.ok(matchContract,"Exact learner indexing verifier not recoverable");
const py=JSON.parse(matchContract[1]);
for(const required of ["/gelf", "/api/search/messages", "X-Requested-By", "indexed_match(payload, RID)", "TSA_GRAYLOG_VERIFY_LIVE"]) {
  assert.ok(py.includes(required),"Missing documented Graylog transport/search boundary: "+required);
}
function execute(program,scenario="indexed",live=false) {
  const env={...process.env,TSA_DEMO_SCENARIO:scenario};
  delete env.TSA_GRAYLOG_VERIFY_LIVE; // the test must NEVER access a real Graylog service
  const out=spawnSync("python3",["-c",program,...(live?["--live"]:[])],{
    encoding:"utf8",timeout:15000,env
  });
  assert.ifError(out.error);
  return out;
}
const ok=execute(py);
assert.equal(ok.status,0,ok.stderr);
assert.match(ok.stdout,/ingest_http_status=202/);
assert.match(ok.stdout,/DEMO_CONTRACT_PASS \(fake local server, NOT Graylog indexing\)/);
const scenarios=[
  ["ack_only",/HTTP 202 was NOT followed by exact indexed search evidence/],
  ["wrong_id",/HTTP 202 was NOT followed by exact indexed search evidence/],
  ["missing_field",/HTTP 202 was NOT followed by exact indexed search evidence/],
  ["search_denied",/Graylog search was not authorized\/available/],
  ["input_down",/GELF input did not accept the test event/]
];
for(const [name,expected] of scenarios) {
  const negative=execute(py,name);
  assert.notEqual(negative.status,0,"Unsafe demo scenario incorrectly passed: "+name);
  assert.match(negative.stderr,expected,"Wrong failure boundary: "+name);
  assert.doesNotMatch(negative.stderr,/SyntaxError/,"Broken mutant setup: "+name);
}
const liveWithoutOptIn=execute(py,"indexed",true);
assert.notEqual(liveWithoutOptIn.status,0,"Unapproved live mode must be blocked");
assert.match(liveWithoutOptIn.stderr,/TSA_GRAYLOG_VERIFY_LIVE=1 required/);
// Source mutations must be rejected by the relevant scenarios, not merely by a parse error.
const unsafe=[
 ["ignore HTTP 503", 'if status != 202:', 'if status not in (202, 503):', "input_down"],
 ["treat HTTP 202 as indexed", 'if not confirmed:', 'if False:', "ack_only"],
 ["accept any indexed request ID", 'row.get("request_id") == request_id', 'row.get("request_id") is not None', "wrong_id"]
];
for(const [name,before,after,scenario] of unsafe) {
  assert.ok(py.includes(before),"Cannot locate unsafe original invariant: "+name);
  const wrong=execute(py.replace(before,after),scenario);
  assert.equal(wrong.status,0,"Unsafe source mutant must demonstrate a false PASS: "+name+"\n"+wrong.stderr);
  assert.match(wrong.stdout,/DEMO_CONTRACT_PASS/,"Unsafe mutant did not produce the expected false positive: "+name);
}
console.log("PASS source-published Graylog fake HTTP 202 vs exact search contract, five failed boundaries, blocked unauthorized live mode, three wrong-source mutants; real Graylog UNVERIFIED.");
console.log("PASS exact source GELF schema + local UDP transport + malformed negative. Actual Graylog ingestion/search UNVERIFIED.");
