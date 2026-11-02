import assert from "node:assert/strict";
import {readFileSync, writeFileSync, mkdtempSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";

// Real-service CI gate; execution requires PGHOST/PGDATABASE/PGUSER/PGPASSWORD,
// isolated PostgreSQL and RabbitMQ services on loopback.
const source=readFileSync("packages/runtime-kernel/src/paths/system-thinker-real-outbox-worked.ts","utf8");
const caption="Real PostgreSQL/RabbitMQ outbox: three process crashes, publisher replay and one atomic local consumer effect";
const anchor=source.indexOf('"caption": '+JSON.stringify(caption));
assert.ok(anchor>=0,"Missing learner-visible outbox example");
const codeMatch=source.slice(anchor,anchor+30000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(codeMatch,"Cannot extract published outbox Python");
const code=JSON.parse(codeMatch[1]);
const directory=mkdtempSync(join(tmpdir(),"tsa-outbox-"));
try{
  const file=join(directory,"outbox_live.py");
  writeFileSync(file,code);
  const run=spawnSync("python3",[file],{encoding:"utf8",timeout:90000,env:process.env});
  assert.ifError(run.error);
  assert.equal(run.status,0,"Outbox learner code exited "+run.status+":\n"+run.stdout+"\n"+run.stderr);
  const lines=[
    "committed lifecycle and pending outbox: True",
    "crash before publish preserves pending row: True",
    "crash after broker confirm leaves pending row: True",
    "restart publisher replays pending row: True",
    "consumer effect committed before crash: True",
    "unacked redelivery suppressed duplicate effect: True",
    "publisher replay suppressed duplicate effect: True",
    "durable local effect rows: 1"
  ];
  for(const line of lines)assert.ok(run.stdout.includes(line),"Expected '"+line+"' in outbox run:\n"+run.stdout);
  console.log("System Thinker real outbox passed: PostgreSQL atomic intent, two publisher crashes, RabbitMQ confirm/replay and consumer crash-before-ack with one durable effect.");
}finally{
  rmSync(directory,{recursive:true,force:true});
}
