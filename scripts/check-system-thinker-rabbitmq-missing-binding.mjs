import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";

// Exercise the learner-published Python, not a parallel mock.
const source=readFileSync("packages/runtime-kernel/src/paths/system-thinker-rabbitmq-missing-binding-worked.ts","utf8");
const stage=readFileSync("packages/runtime-kernel/src/paths/system-thinker-distributed-staged-labs.ts","utf8");
const caption="Real RabbitMQ unbound DLX negative test followed by corrected binding";
const anchor=source.indexOf('"caption": '+JSON.stringify(caption));
assert.ok(anchor>=0,"Missing learner negative-control Python");
const extract=source.slice(anchor,anchor+20000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(extract,"Could not source-extract complete learner Python");
const program=JSON.parse(extract[1]);
assert.ok(stage.includes("rabbitMissingBindingSections"),"Negative lab not actually rendered");
assert.ok(stage.includes("A missing DLX binding is demonstrated"),"Negative lab not demanded by practical");
const dir=mkdtempSync(join(tmpdir(),"tsa-missing-dlx-"));
try{
  const script=join(dir,"missing_dlx.py");
  writeFileSync(script,program);
  const run=spawnSync("python3",[script],{encoding:"utf8",timeout:45000,env:process.env});
  assert.ifError(run.error);
  assert.equal(run.status,0,"Missing DLX learner program failed:\n"+run.stdout+"\n"+run.stderr);
  for(const line of [
    "unbound DLX: source empty and quarantine empty (NOT safe retention)",
    "bound DLX: poison reaches quarantine with x-death.reason=rejected",
    "not proven: quorum DLX safety, broker crash, operator permission or original lost-event recovery",
  ])assert.ok(run.stdout.includes(line),"Expected line not observed: "+line+"\n"+run.stdout);
  console.log("System Thinker RabbitMQ missing-DLX negative control passed: lost unbound poison and new bound x-death quarantine.");
}finally{rmSync(dir,{recursive:true,force:true});}
