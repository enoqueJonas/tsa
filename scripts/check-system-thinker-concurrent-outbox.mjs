import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";

// Execute the EXACT learner-visible example against disposable PostgreSQL 17
// and RabbitMQ 4. This is not a mock, a duplicate fixture or Steward E2E.
const source=readFileSync("packages/runtime-kernel/src/paths/system-thinker-outbox-concurrent-worked.ts","utf8");
const caption="Real competing PostgreSQL outbox publishers: SKIP LOCKED, process death, lease expiry, fencing and RabbitMQ confirms";
const anchor=source.indexOf('"caption": '+JSON.stringify(caption));
assert.ok(anchor>=0,"Missing published competing-publisher Python program");
const match=source.slice(anchor,anchor+33000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(match,"Could not extract published competing-publisher Python");
const code=JSON.parse(match[1]);
const directory=mkdtempSync(join(tmpdir(),"tsa-outbox-claim-"));
try{
  const script=join(directory,"outbox_competing.py");
  writeFileSync(script,code);
  const run=spawnSync("python3",[script],{encoding:"utf8",timeout:80000,env:process.env});
  assert.ifError(run.error);
  assert.equal(run.status,0,"Competing publisher lab failed:\n"+run.stdout+"\n"+run.stderr);
  const expected=[
    "two independent publishers claimed distinct rows: True",
    "both confirmed publishes fenced and marked sent: True",
    "crashed publisher lease blocks premature reclaim: True",
    "expired lease recovered with new fencing token: True",
    "stale publisher cannot mark recovered claim: True",
    "recovered event published and marked sent: True",
    "broker messages with unique event IDs: 3",
    "remaining unsent outbox rows: 0",
  ];
  for(const line of expected){
    assert.ok(run.stdout.includes(line),"Missing "+line+":\n"+run.stdout);
  }
  console.log("System Thinker competing outbox workers passed: two DB sessions, SKIP LOCKED, crash, expiry, fencing and RabbitMQ confirms.");
}finally{
  rmSync(directory,{recursive:true,force:true});
}
