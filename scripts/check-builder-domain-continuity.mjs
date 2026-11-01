import assert from "node:assert/strict";
import fs from "node:fs";
import {spawnSync} from "node:child_process";

const paths={
  builder:"packages/runtime-kernel/src/paths/builder.ts",
  python:"packages/runtime-kernel/src/paths/builder-python-rich.ts",
  web:"packages/runtime-kernel/src/paths/builder-web-api-deep.ts",
  django:"packages/runtime-kernel/src/paths/builder-django-rich.ts",
  identity:"packages/runtime-kernel/src/paths/builder-identity-auth-deep.ts",
  milestone:"packages/runtime-kernel/src/paths/builder-milestone-deep.ts"
};
const sources=Object.fromEntries(Object.entries(paths).map(([k,v])=>[k,fs.readFileSync(v,"utf8")]));
const order=sources.builder.indexOf("    relationalDataAndPostgresql,");
const djangoOrder=sources.builder.indexOf("    djangoAndApiEngineering,");
assert.ok(order>=0&&djangoOrder>order,"SQL must precede Django ORM in the actual learner order");

function extractCode(source, caption){
  const variants=[`caption: "${caption}"`, `"caption":"${caption}"`, `"caption": "${caption}"`];
  const ix=Math.max(...variants.map(v=>source.indexOf(v)));
  assert.ok(ix>=0,`No lesson code caption: ${caption}`);
  const codeAfter=source.slice(ix,ix+22000).match(/(?:["']?(?:code|value)["']?)\s*:\s*("(?:\\.|[^"\\])*")/);
  if(codeAfter&&codeAfter.index<1200)return JSON.parse(codeAfter[1]);
  const before=source.slice(Math.max(0,ix-14000),ix);
  const matches=[...before.matchAll(/(?:["']?(?:code|value)["']?)\s*:\s*("(?:\\.|[^"\\])*")/g)];
  assert.ok(matches.length,`No preceding code block: ${caption}`);
  return JSON.parse(matches.at(-1)[1]);
}
const run=(caption,code,expected)=>{
  const p=spawnSync("python3",["-c",code],{encoding:"utf8",timeout:10000});
  assert.ifError(p.error);
  assert.equal(p.status,0,`Python code failed ${caption}: ${p.stderr}`);
  assert.ok(p.stdout.includes(expected),`Expected output absent ${caption}: ${p.stdout}`);
};
const life=extractCode(sources.python,"A small domain function");
assert.match(life,/ALLOWED_LIFECYCLES/);
run("Python lifecycle",life+"\nassert normalize_lifecycle('production')=='production'\nassert normalize_lifecycle('retired')=='retired'\ntry:\n normalize_lifecycle('unknown')\nexcept ValueError:\n print('REJECTED_INVALID_LIFECYCLE')\nelse:\n raise AssertionError('unknown should not be a valid lifecycle')","REJECTED_INVALID_LIFECYCLE");
run("Python production-stage Service list",extractCode(sources.python,"Critical production services"),"payments-api");
run("Authorization decision matrix",extractCode(sources.identity,"Authorization — executable subject/action/object decision matrix"),"authorization matrix passed: 6 cases");
const api=JSON.parse(extractCode(sources.web,"Steward service representation"));
assert.equal(api.lifecycle,"production");
assert.ok(!sources.django.includes("owner_team"),"Inconsistent Django owner_team field");
assert.ok(sources.django.includes("PRODUCTION = 'production'"),"Django lifecycle must support product-defined production stage");
const model=extractCode(sources.django,"registry/models.py — canonical Steward ORM foundation");
assert.ok(model.includes("owning_team = models.ForeignKey"),"Canonical Django FK omitted");
assert.ok(model.includes("PRODUCTION = 'production'"),"Production lifecycle absent");
assert.ok(model.includes("PRODUCTION = 'production'"),"Environment kind missing");
const flow=sources.milestone;
for(const concept of ["ServiceDependency","ServiceReview","owning Team","Cross-Team"])assert.ok(flow.includes(concept));
console.log("Builder school continuity passed: learner order, Python/WebAPI/Django lifecycle, ORM ownership, six-case authorization and milestone gates.");
