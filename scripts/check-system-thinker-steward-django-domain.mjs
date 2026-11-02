import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";

const builder=fs.readFileSync("packages/runtime-kernel/src/paths/builder-django-rich.ts","utf8");
const system=fs.readFileSync("packages/runtime-kernel/src/paths/system-thinker-steward-domain-boundary-worked.ts","utf8");
function publishedBuilderCode(caption){
  const needles=['"caption":"'+caption+'"','caption: "'+caption+'"'];
  for(const needle of needles){
    const i=builder.indexOf(needle);
    if(i<0)continue;
    const match=builder.slice(i,i+18000).match(/["']?value["']?\s*:\s*("(?:\\.|[^"\\])*")/);
    assert.ok(match,"Missing Builder publication code for "+caption);
    return JSON.parse(match[1]);
  }
  throw new Error("Missing published Builder v1 file: "+caption);
}
const caption="Real Django Steward model: denied team, readiness conflict, rollback and final production guard";
const i=system.indexOf('"caption": '+JSON.stringify(caption));
assert.ok(i>=0,"Published System Thinker domain bridge missing");
const match=system.slice(i,i+25000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(match,"Cannot source-extract the System Thinker learner program");
const learner=JSON.parse(match[1]);
const root=fs.mkdtempSync(path.join(os.tmpdir(),"tsa-domain-boundary-"));
const run=(cmd,args,env=process.env)=>{
  const result=spawnSync(cmd,args,{cwd:root,env,encoding:"utf8",timeout:65000});
  assert.ifError(result.error);
  assert.equal(result.status,0,cmd+" "+args.join(" ")+" failed:\n"+result.stdout+"\n"+result.stderr);
  return result.stdout;
};
try{
  assert.equal(process.env.PGDATABASE,"tsa_steward_lab","Only the isolated CI database may run this bridge");
  const files=[
    ["config/urls.py",publishedBuilderCode("config/urls.py — first runnable Django endpoint")],
    ["registry/models.py",publishedBuilderCode("registry/models.py — canonical Steward ORM foundation")],
    ["registry/services.py",publishedBuilderCode("registry/services.py — protect production transitions and last-deployment deletion")],
  ];
  run("psql",["-X","-v","ON_ERROR_STOP=1","-c","CREATE DATABASE tsa_steward_system_thinker_lab"]);
  run("python3",["-m","django","startproject","config","."]);
  run("python3",["manage.py","startapp","registry"]);
  for(const [dest,code] of files)fs.writeFileSync(path.join(root,dest),code+"\n");
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
  const env={...process.env,PGDATABASE:"tsa_steward_system_thinker_lab"};
  run("python3",["manage.py","check"],env);
  run("python3",["manage.py","makemigrations","registry","--noinput"],env);
  run("python3",["manage.py","migrate","--noinput"],env);
  const output=run("python3",["manage.py","shell","-c",learner],env);
  for(const line of [
    "cross-team lifecycle promotion: denied, state still uat",
    "authorized promotion without production deployment: rejected",
    "forced outer rollback preserves lifecycle uat: True",
    "authorized promotion committed: production",
    "cannot delete final production deployment: True",
    "actual Builder ORM Service rows: 1",
  ])assert.ok(output.includes(line),"Domain boundary learner example missing '"+line+"':\n"+output);
  console.log("System Thinker real Steward Django domain boundary passed: actual Builder v1 model/services, PG 17, denied cross-team, invariant, rollback and protected deletion.");
}finally{
  fs.rmSync(root,{recursive:true,force:true});
}
