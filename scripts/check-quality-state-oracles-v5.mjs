import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {spawnSync} from "node:child_process";
const path="packages/runtime-kernel/src/paths/quality-evidence-depth-v5.ts";
const src=readFileSync(path,"utf8");
const published=(name)=>{
 const prefix="export const "+name+" = ";
 assert.ok(src.includes(prefix),"Missing authored lesson source "+name);
 const literal=src.split(prefix)[1].split(";\n")[0];
 return JSON.parse(literal);
};
const machine=published("qualityStateTransitionPython");
const oracle=published("qualityIndependentOraclePython");
const raw=src.match(/export const qualityEvidenceDepthV5: Record<string,QualityEvidenceCase> = (\{[\s\S]*\});\s*$/);
assert.ok(raw,"Unable to inspect topic-specific lesson source map");
const cases=JSON.parse(raw[1]);
const expected=[
"api-test-design","mocks-stubs-fakes","test-doubles","state-transition-testing",
"test-oracles","playwright-runtime-model","environment-parity",
"browser-differences","test-strategy","testability"
];
assert.deepEqual(Object.keys(cases).sort(),expected.sort());
for(const [id,entry] of Object.entries(cases)){
 for(const field of ["heading","mechanism","worked","negative","transfer"]){
  assert.ok(typeof entry[field]==="string" && entry[field].length>100- (field==="heading"?80:0),
    "Short/missing "+field+" in "+id);
 }
}
assert.equal(cases["state-transition-testing"].code,machine);
assert.equal(cases["test-oracles"].code,oracle);
for(const file of [
 "quality-api-integration-testing-deep.ts",
 "quality-unit-component-testing-deep.ts",
 "quality-test-analysis-design-deep.ts",
 "quality-browser-environment-testing-deep.ts",
 "quality-engineering-deep.ts"
]){
 assert.match(readFileSync("packages/runtime-kernel/src/paths/"+file,"utf8"),/qualityEvidenceDepthV5\[spec\.id\]/);
}
const run=(file,code,dir)=>{
 writeFileSync(join(dir,file),code);
 const r=spawnSync("python3",[file],{cwd:dir,encoding:"utf8",timeout:15000});
 assert.ifError(r.error);
 return r;
};
const dir=mkdtempSync(join(tmpdir(),"tsa-quality-state-oracle-"));
try {
 let r=run("machine.py",machine,dir);
 assert.equal(r.status,0,r.stderr);
 assert.match(r.stdout,/state and events unchanged/);
 const stateMutation='if new_state is None:\n            return 409';
 assert.ok(machine.includes(stateMutation),"State mutation anchor changed");
 r=run("machine.py",machine.replace(stateMutation,'if new_state is None:\n            self.state = "active"\n            return 409'),dir);
 assert.notEqual(r.status,0,"Wrong denied transition must be rejected");
 assert.match(r.stderr,/AssertionError/);
 console.log("PASS exact learner state-machine source and forbidden-mutation negative");
 r=run("oracle.py",oracle,dir);
 assert.equal(r.status,0,r.stderr);
 assert.match(r.stdout,/read-after oracle detects it/);
 const wrong='if actor != owner:\n        return 403, owner';
 assert.ok(oracle.includes(wrong),"Oracle mutation anchor changed");
 r=run("oracle.py",oracle.replace(wrong,'if actor != owner:\n        return 403, target'),dir);
 assert.notEqual(r.status,0,"Independent oracle must reject denied write");
 assert.match(r.stderr,/AssertionError/);
 console.log("PASS exact learner independent-oracle source and deceptive-403 mutation");
} finally {rmSync(dir,{recursive:true,force:true});}
