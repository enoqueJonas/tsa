import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import {spawnSync} from "node:child_process";

// Extract and run EXACT learner-authored code against actual Builder v1 Django ORM.
const builder=fs.readFileSync("packages/runtime-kernel/src/paths/builder-django-rich.ts","utf8");
const batch=fs.readFileSync("packages/runtime-kernel/src/paths/system-thinker-real-steward-batch-worked.ts","utf8");
const lesson=fs.readFileSync("packages/runtime-kernel/src/paths/system-thinker-enterprise-file-integration-deep.ts","utf8");
assert.ok(lesson.includes("realStewardBatchSections"),"Batch practical reading is not actually rendered");
assert.ok(lesson.includes('id: "steward-batch-domain"'),"Dedicated import lesson is missing");
assert.ok(lesson.includes('[lesson(spec), lesson(stewardBatchDomainSpec)]'),"Domain import lesson not placed after batch lifecycle");
assert.ok(lesson.includes("Independently modify a copy of the lab"),"No novel negative learner practice");
assert.ok(lesson.includes("realStewardBatchResources"),"Missing database transaction research links");
function builderCode(caption){
  const needles=['"caption":"'+caption+'"','caption: "'+caption+'"'];
  for(const needle of needles){
    const i=builder.indexOf(needle);
    if(i<0)continue;
    const hit=builder.slice(i,i+20000).match(/["']?value["']?\s*:\s*("(?:\\.|[^"\\])*")/);
    assert.ok(hit,"Cannot extract Builder model source: "+caption);
    return JSON.parse(hit[1]);
  }
  throw Error("No published Builder source: "+caption);
}
const caption="Real Builder v1 Django ORM owner-import negative paths and atomic PostgreSQL receipt";
const i=batch.indexOf('"caption": '+JSON.stringify(caption));
assert.ok(i>=0,"Missing learner-visible real domain file/DB program");
const match=batch.slice(i,i+20000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(match,"Cannot source-extract learner Python import program");
const learner=JSON.parse(match[1]);
const name="tsa_steward_batch_"+crypto.randomUUID().replaceAll("-","").slice(0,12);
const root=fs.mkdtempSync(path.join(os.tmpdir(),"tsa-steward-batch-"));
const run=(cmd,args,env=process.env)=>{
  const out=spawnSync(cmd,args,{cwd:root,env,encoding:"utf8",timeout:85000});
  assert.ifError(out.error);
  assert.equal(out.status,0,cmd+" "+args.join(" ")+" failed:\n"+out.stdout+"\n"+out.stderr);
  return out.stdout;
};
let created=false;
try{
  assert.equal(process.env.PGDATABASE,"tsa_steward_lab","Only disposable CI PostgreSQL is allowed");
  run("psql",["-X","-v","ON_ERROR_STOP=1","-c","CREATE DATABASE "+name]);
  created=true;
  run("python3",["-m","django","startproject","config","."]);
  run("python3",["manage.py","startapp","registry"]);
  for(const [dest,code] of [
    ["config/urls.py",builderCode("config/urls.py — first runnable Django endpoint")],
    ["registry/models.py",builderCode("registry/models.py — canonical Steward ORM foundation")],
    ["registry/services.py",builderCode("registry/services.py — protect production transitions and last-deployment deletion")],
  ])fs.writeFileSync(path.join(root,dest),code+"\n");
  fs.appendFileSync(path.join(root,"config/settings.py"),`
import os
INSTALLED_APPS += ['registry']
DATABASES = {'default': {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': os.environ['PGDATABASE'],
    'USER': os.environ['PGUSER'],
    'PASSWORD': os.environ['PGPASSWORD'],
    'HOST': os.environ['PGHOST'],
    'PORT': os.environ['PGPORT'],
}}
`);
  const env={...process.env,PGDATABASE:name};
  run("python3",["manage.py","check"],env);
  run("python3",["manage.py","makemigrations","registry","--noinput"],env);
  run("python3",["manage.py","migrate","--noinput"],env);
  const stdout=run("python3",["manage.py","shell","-c",learner],env);
  for(const required of [
    "partial file is invisible until final-name handoff: True",
    "unauthorized actor denied; PostgreSQL unchanged: True",
    "forged CSV approval denied; PostgreSQL unchanged: True",
    "second-row denial rolled back first owner change: True",
    "in-transaction crash rolled back ORM mutation and receipt: True",
    "authorized complete delivery committed 2 owner rows and one receipt: True",
    "lost response retry returns duplicate, no second effect: True",
    "same delivery ID changed bytes causes conflict, unchanged ORM: True",
    "invalid schema rejected without a receipt: True",
    "real Builder Service ORM rows: 4; completed receipts: 1",
  ])assert.ok(stdout.includes(required),"Expected real ORM observation missing: "+required+"\n"+stdout);
  console.log("System Thinker real Django PostgreSQL CSV owner-import passed: denied actor, forged approval, all-row rollback, crash, replay, conflict and immutable receipt.");
}finally{
  try{
    if(created)run("psql",["-X","-v","ON_ERROR_STOP=1","-c","DROP DATABASE "+name+" WITH (FORCE)"]);
  }finally{
    fs.rmSync(root,{recursive:true,force:true});
  }
}
