import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

const root="packages/runtime-kernel/src/paths/";
const lesson=readFileSync(root+"cloud-progressive-delivery-canary-deep.ts","utf8");
const focused=readFileSync(root+"cloud-canary-focused-depth.ts","utf8");
const published=readFileSync(root+"cloud-canary-real-http-proof.ts","utf8");
const match=published.match(/export const cloudCanaryRealHttpPython = ("(?:\\.|[^"\\])*");/);
assert.ok(match,"Missing learner-copyable exact canary HTTP code");
const python=JSON.parse(match[1]);
function parse(name,next){
 const start=focused.indexOf("export const "+name);
 const end=next?focused.indexOf("\nexport const "+next,start):focused.length;
 assert.ok(start>=0&&end>start,"Missing focused source "+name);
 return JSON.parse(focused.slice(focused.indexOf("=",start)+1,end).trim().replace(/;$/,""));
}
const readings=parse("cloudCanaryFocusedReadings","cloudCanaryOriginalPractices");
const practices=parse("cloudCanaryOriginalPractices");
for(const id of ["001","002","003","004","005","006"])
 assert.ok(lesson.includes('id: "cloud-progressive-delivery-canary-'+id+'"'),
  "Original canary activity ID lost: "+id);
assert.deepEqual(readings.map(x=>x.id),["007","008","009","010"].map(
 x=>"cloud-progressive-delivery-canary-"+x),"Focused reading IDs/order lost");
assert.ok(lesson.indexOf("...cloudCanaryFocusedReadings.map(")<
          lesson.indexOf('id: "cloud-progressive-delivery-canary-002"'),
 "Canary concepts introduced too late");
for(const item of readings){
 assert.ok(item.sections.length>=3,"Focused lesson too broad/shallow "+item.id);
 for(const section of item.sections){
  assert.ok(section.heading.length>29 && section.paragraphs.length>=2);
  assert.ok(section.paragraphs.every(x=>x.length>=330),
   "Incomplete mechanism/failure/verification "+item.id);
 }
}
assert.ok(lesson.includes("code: cloudCanaryRealHttpPython"),
 "Actual HTTP proof not rendered in original lesson path");
for(const id of ["002","003","004","005"])
 assert.ok(practices["cloud-progressive-delivery-canary-"+id]?.length>=2
  && lesson.includes('cloudCanaryOriginalPractices["cloud-progressive-delivery-canary-'+id+'"]'),
  "Original practice lacks real evidence "+id);
for(const tag of ["CANARY_REAL_STABLE_BASELINE_HTTP",
 "CANARY_REAL_LOW_TRAFFIC_INCONCLUSIVE",
 "CANARY_REAL_25_PERCENT_ROUTING_WITH_HTTP_EVIDENCE",
 "CANARY_REAL_BOUNDED_25_TO_50_TO_100_PROMOTION",
 "CANARY_REAL_BAD_CANDIDATE_ABORT_AND_STABLE_HTTP",
 "CANARY_REAL_METRICS_OUTAGE_FAILS_CLOSED",
 "CANARY_NO_ARGO_ROLLOUTS_PROMETHEUS_KONG_OR_STATE_ROLLBACK_TEST"])
 assert.ok(python.includes(tag),"Missing real HTTP claim boundary "+tag);
assert.ok(python.includes('("127.0.0.1", 0)'),"No hard loopback binding");
console.log("PASS original six canary activity IDs, four focused readings, 12 concept sections and four evidence-wired practicals");

function exercise(source,label,positive){
 const x=spawnSync("python3",["-c",source],{
  encoding:"utf8",timeout:175000,maxBuffer:3*1024*1024,
  env:{...process.env,PYTHONDONTWRITEBYTECODE:"1"}
 });
 assert.ok(!x.error,label+" timeout or spawn error: "+String(x.error));
 if(positive){
  assert.equal(x.status,0,label+"\nstdout:\n"+x.stdout+"\nstderr:\n"+x.stderr);
  for(const marker of [
   "CANARY_REAL_STABLE_BASELINE_HTTP",
   "CANARY_REAL_LOW_TRAFFIC_INCONCLUSIVE",
   "CANARY_REAL_25_PERCENT_ROUTING_WITH_HTTP_EVIDENCE",
   "CANARY_REAL_BOUNDED_25_TO_50_TO_100_PROMOTION",
   "CANARY_REAL_BAD_CANDIDATE_ABORT_AND_STABLE_HTTP",
   "CANARY_REAL_METRICS_OUTAGE_FAILS_CLOSED",
   "CANARY_NO_ARGO_ROLLOUTS_PROMETHEUS_KONG_OR_STATE_ROLLBACK_TEST"])
   assert.ok(x.stdout.includes(marker),label+" missing "+marker);
 }else{
  assert.notEqual(x.status,0,label+" incorrectly accepted unsafe behavior");
  assert.match(x.stderr,/AssertionError/,label+
    " failed for unrelated error:\n"+x.stderr.slice(-2000));
 }
 console.log("PASS "+label+" status="+x.status);
}
exercise(python,"real independent HTTP stable/candidate/proxy/metrics, measured split, abort and outage",true);
const mutants=[
 ["low-volume candidate promoted",
  "if candidate_count < minimum or stable_count < minimum:",
  "if candidate_count < 0 or stable_count < 0:"],
 ["high-error candidate promoted",
  "if candidate_ratio > 0.03 or candidate_ratio > stable_ratio + 0.02:",
  "if candidate_ratio > 1.01:"],
 ["failed canary left exposed after abort",
  "state.weight = 0\n            state.reset()\n            after_abort",
  "state.weight = 25\n            state.reset()\n            after_abort"],
 ["no metric dependency treated as successful analysis",
  'if window is None:\n        return "INCONCLUSIVE"',
  'if window is None:\n        return "ELIGIBLE_FOR_OTHER_GATES"'],
 ["router ignores target percentage",
  'return "candidate" if slot < self.weight else "stable"',
  'return "candidate"'],
 ["100% promotion falsely claimed at 50%",
  "state.weight = 100\n            state.reset()\n            promoted",
  "state.weight = 50\n            state.reset()\n            promoted"],
];
for(const [label,needle,bad] of mutants){
 assert.ok(python.includes(needle),"Unsafe mutant source anchor missing: "+label);
 exercise(python.replace(needle,bad),"rejected unsafe canary mutant: "+label,false);
}
console.log("PASS six deliberately unsafe real HTTP canary mutations; local router and metrics only, NOT Argo Rollouts/Prometheus");
