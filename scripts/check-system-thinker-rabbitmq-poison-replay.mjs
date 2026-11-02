import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";

// Test the exact Python program published to the learner, not a parallel fixture.
const source=readFileSync("packages/runtime-kernel/src/paths/system-thinker-rabbitmq-poison-replay-worked.ts","utf8");
const caption="Live RabbitMQ DLX and PostgreSQL projection: poison quarantine, x-death, safe replay, v8-before-v7 and duplicate suppression";
const anchor=source.indexOf('"caption": '+JSON.stringify(caption));
assert.ok(anchor>=0,"Missing learner-visible DLQ program");
const extracted=source.slice(anchor,anchor+35000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(extracted,"Unable to extract complete learner-visible program");
const program=JSON.parse(extracted[1]);
const directory=mkdtempSync(join(tmpdir(),"tsa-poison-"));
try{
  const file=join(directory,"rabbit_poison_replay.py");
  writeFileSync(file,program);
  const executed=spawnSync("python3",[file],{encoding:"utf8",timeout:85000,env:process.env});
  assert.ifError(executed.error);
  assert.equal(executed.status,0,"DLQ learner example exited "+executed.status+":\n"+executed.stdout+"\n"+executed.stderr);
  const expected=[
    "newer v8 applied before stale v7: True",
    "stale v7 and duplicate v8 cannot regress projection: True",
    "unsupported schema quarantined with x-death reason: rejected",
    "operator replay retained event ID and payload after confirm: True",
    "recovered v2 event produced one durable local effect: True",
    "repeated replay suppressed duplicate local effect: True",
    "final projected svc-42: v8 retired",
    "durable applied effects: 2; processed unique event IDs: 3",
  ];
  for(const line of expected)
    assert.ok(executed.stdout.includes(line),"Missing '"+line+"':\n"+executed.stdout);
  console.log("System Thinker real poison replay passed: RabbitMQ DLX/x-death, confirmed recovery and PostgreSQL monotonic/deduped projection.");
}finally{
  rmSync(directory,{recursive:true,force:true});
}
