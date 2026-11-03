import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, cpSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
const root="labs/quality-junit-lifecycle";
const source=readFileSync(join(root,"src/test/java/org/tsa/quality/PolicyTest.java"),"utf8");
const itSource=readFileSync(join(root,"src/test/java/org/tsa/quality/ProtocolIT.java"),"utf8");
const pom=readFileSync(join(root,"pom.xml"),"utf8");
assert.match(pom,/<artifactId>maven-surefire-plugin<\/artifactId>/);
assert.match(pom,/<artifactId>maven-failsafe-plugin<\/artifactId>/);
assert.match(pom,/<goal>integration-test<\/goal>/);
assert.match(pom,/<goal>verify<\/goal>/);
assert.match(source,/@ExtendWith\(PolicyTest.ProbeExtension.class\)/);
assert.match(source,/@ParameterizedTest/);
assert.match(itSource,/intentionally in-process/);
const docs=readFileSync("packages/runtime-kernel/src/paths/quality-junit-maven-depth-v5.ts","utf8");
for(const token of ["qualitySurefirePom","qualityJupiterJava","qualityFailsafeJava"]){
 assert.ok(docs.includes(token),"Missing original reading source export "+token);
}
const published=(name)=>{
 const prefix="export const "+name+" = ";
 assert.ok(docs.includes(prefix),"Missing original learner source "+name);
 return JSON.parse(docs.split(prefix)[1].split(";\n")[0]);
};
assert.equal(published("qualitySurefirePom"),pom,"Learner POM must be exact test fixture");
assert.equal(published("qualityJupiterJava"),source,"Learner Jupiter code must be exact test fixture");
assert.equal(published("qualityFailsafeJava"),itSource,"Learner Failsafe code must be exact test fixture");
const exec=(args,cwd)=>{
 const r=spawnSync("mvn",["-B","-ntp","-q",...args],{cwd,encoding:"utf8",timeout:180000});
 assert.ifError(r.error);return r;
};
let result=exec(["verify"],root);
assert.equal(result.status,0,"Maven JUnit fixture failed:\n"+result.stdout+"\n"+result.stderr);
const report=(where,name)=>{
 const file=join(root,"target",where,"TEST-"+name+".xml");
 assert.ok(existsSync(file),"Missing actual JUnit report "+file);
 const xml=readFileSync(file,"utf8");
 const head=xml.match(/<testsuite\b[^>]*>/)?.[0];
 assert.ok(head,"Malformed JUnit suite report: "+file);
 const n=k=>Number(head.match(new RegExp(k+'="(\\d+)"'))?.[1]??-1);
 assert.equal(n("failures"),0,head);
 assert.equal(n("errors"),0,head);
 assert.equal(n("skipped"),0,head);
 return n("tests");
};
const units=report("surefire-reports","org.tsa.quality.PolicyTest");
const integrations=report("failsafe-reports","org.tsa.quality.ProtocolIT");
assert.equal(units,4,"Surefire should execute one direct plus three parameterized Jupiter cases");
assert.equal(integrations,1,"Failsafe should execute exactly one in-process IT");
assert.ok(!existsSync(join(root,"target","surefire-reports","TEST-org.tsa.quality.ProtocolIT.xml")),"Surefire stole Failsafe IT");
console.log("PASS real Maven→Surefire→Jupiter 4 tests and Maven→Failsafe→Jupiter 1 IT");
const temp=mkdtempSync(join(tmpdir(),"tsa-quality-junit-negative-"));
try {
 cpSync(join(root,"pom.xml"),join(temp,"pom.xml"));
 cpSync(join(root,"src"),join(temp,"src"),{recursive:true});
 const file=join(temp,"src/test/java/org/tsa/quality/PolicyTest.java");
 const needle='return actor.equals("owner") && active && !locked;';
 assert.ok(source.includes(needle),"Mutation target changed");
 writeFileSync(file,source.replace(needle,'return actor.equals("owner") || active && !locked;'));
 result=exec(["test"],temp);
 assert.notEqual(result.status,0,"Wrong authorization OR mutation must fail JUnit");
 assert.match(result.stdout+"\n"+result.stderr,/Tests run:|Failures:|AssertionFailedError|expected: <false>/i);
 console.log("PASS real Jupiter assertion rejected forbidden-actor policy mutation");
} finally {rmSync(temp,{recursive:true,force:true});}
