import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {spawnSync} from "node:child_process";
const source=readFileSync("packages/runtime-kernel/src/paths/quality-containers-ci-deep.ts","utf8");
const match=source.match(/const qualityGateJava = ("(?:\\.|[^"\\])*");/);
assert.ok(match && source.includes('code:qualityGateJava'),"Original Quality Gates lesson must render exact Java");
const program=JSON.parse(match[1]),dir=mkdtempSync(join(tmpdir(),"tsa-quality-gates-"));
const exec=(bin,args)=>{const r=spawnSync(bin,args,{cwd:dir,encoding:"utf8",timeout:12000});assert.ifError(r.error);return r};
const file=join(dir,"QualityGateDecision.java");
try{
  writeFileSync(file,program);
  let r=exec("javac",["QualityGateDecision.java"]);assert.equal(r.status,0,r.stderr);
  r=exec("java",["QualityGateDecision"]);assert.equal(r.status,0,r.stderr);
  assert.deepEqual(r.stdout.trim().split("\n"),[
  "complete=APPROVE","failed-test=BLOCK","missing-test=BLOCK",
  "missing-report=BLOCK","stale-commit=BLOCK","zero-selection=BLOCK"]);
  const mutant=program.replace("e.executed == e.selected","e.executed <= e.selected");
  assert.notEqual(mutant,program,"Mutation changed no gate expression");
  writeFileSync(file,mutant);
  r=exec("javac",["QualityGateDecision.java"]);assert.equal(r.status,0,r.stderr);
  r=exec("java",["QualityGateDecision"]);assert.notEqual(r.status,0,"Missing-check approval mutant should fail");
  assert.match(r.stderr,/AssertionError: missing-test expected=false actual=true/);
  console.log("PASS original Quality CI gate: six cases and missing-test fail-open mutation.");
}finally{rmSync(dir,{recursive:true,force:true})}
