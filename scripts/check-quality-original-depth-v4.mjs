import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {spawnSync} from "node:child_process";
const file="packages/runtime-kernel/src/paths/quality-original-remaining-depth.ts";
const source=readFileSync(file,"utf8");
const m=source.match(/export const qualityOriginalPrograms = (\{[\s\S]*?\}) as const;/);
assert.ok(m,"Original Quality pairwise/Java published source not found");
const programs=JSON.parse(m[1]);
const needed=[
"cross-browser","isolation","coverage","fast-feedback","risk-based-testing","shift-left-right",
"api-client-boundary","database-assertions","requirements-analysis","pairwise",
"junit-extensions","interfaces-composition"
];
for(const id of needed){
  assert.ok(source.includes(JSON.stringify(id)+": {"),"Missing original source case "+id);
  assert.ok(source.includes('"independent-application"') || source.includes('"transfer"'),"Independent transfer absent");
}
const pythonSrc=readFileSync("packages/runtime-kernel/src/paths/quality-test-analysis-design-deep.ts","utf8");
const javaSrc=readFileSync("packages/runtime-kernel/src/paths/quality-java-test-engineering-deep.ts","utf8");
assert.match(pythonSrc,/qualityOriginalDepth\[spec\.id\]/);
assert.match(javaSrc,/qualityOriginalDepth\[spec\.id\]/);
assert.ok(pythonSrc.includes('code:originalDepth.code') && javaSrc.includes('code:originalDepth.code'),"Exact original sources must be copyable");
const run=(tool,args,cwd,opts={})=>{
 const r=spawnSync(tool,args,{cwd,encoding:"utf8",timeout:10000,...opts});
 assert.ifError(r.error);return r;
};
const dir=mkdtempSync(join(tmpdir(),"tsa-original-quality-"));
try {
  const pair=programs.pairwise;
  writeFileSync(join(dir,"pairwise_model.py"),pair);
  let r=run("python3",["pairwise_model.py"],dir);
  assert.equal(r.status,0,r.stderr);
  assert.match(r.stdout,/4 rows cover 12\/12 pairs out of 8 exhaustive combinations/);
  assert.match(r.stdout,/5 total rows after forcing the risk-specific triple/);
  const missing='    ("nonowner", "retired", "api"),\n';
  assert.ok(pair.includes(missing),"Missing-row mutation must match actual source");
  writeFileSync(join(dir,"pairwise_model.py"),pair.replace(missing,""));
  r=run("python3",["pairwise_model.py"],dir);
  assert.notEqual(r.status,0,"Incomplete pairwise covering array must fail");
  assert.match(r.stderr,/AssertionError: missing pairs/);
  console.log("PASS source-published pairwise: 12/12 pairs and missing-row negative");
  const compose=programs.composition;
  writeFileSync(join(dir,"QualityCompositionProof.java"),compose);
  r=run("javac",["QualityCompositionProof.java"],dir);
  assert.equal(r.status,0,r.stderr);
  r=run("java",["QualityCompositionProof"],dir);
  assert.equal(r.status,0,r.stderr);
  assert.match(r.stdout,/Two clients use independent injected TokenProvider instances/);
  const original='return "Bearer " + provider.token();';
  assert.ok(compose.includes(original),"Missing Java mutation target");
  writeFileSync(join(dir,"QualityCompositionProof.java"),compose.replace(original,'return "Bearer HARDCODED";'));
  r=run("javac",["QualityCompositionProof.java"],dir);
  assert.equal(r.status,0,r.stderr);
  r=run("java",["QualityCompositionProof"],dir);
  assert.notEqual(r.status,0,"Hardcoded auth must fail injected contract");
  assert.match(r.stderr,/AssertionError: injected provider ignored/);
  console.log("PASS source-published Java interface composition and hardcoded-token negative");
} finally {
 rmSync(dir,{recursive:true,force:true});
}
console.log("PASS 12 original Quality lesson cases and 2 executed local evidence models.");
