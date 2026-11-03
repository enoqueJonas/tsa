import assert from "node:assert/strict";
import {readFileSync,writeFileSync,existsSync,cpSync,mkdtempSync,rmSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {spawnSync} from "node:child_process";

const root="labs/quality-junit-lifecycle";
const path=(name)=>join(root,name);
const docs=readFileSync("packages/runtime-kernel/src/paths/quality-maven-selection-v7.ts","utf8");
const published=(name)=>{
  const anchor="export const "+name+" = ";
  assert.ok(docs.includes(anchor),"Missing original reader source "+name);
  return JSON.parse(docs.split(anchor)[1].split(";\n")[0]);
};
const pom=readFileSync(path("pom.xml"),"utf8");
const tagged=readFileSync(path("src/test/java/org/tsa/quality/TagFilteringExampleTest.java"),"utf8");
const lifecycle=readFileSync(path("src/test/java/org/tsa/quality/LifecycleOwnershipTest.java"),"utf8");
assert.equal(published("qualityTaggedSelectionJava"),tagged,"Learner tag source must equal tested file");
assert.equal(published("qualityLifecycleOwnershipJava"),lifecycle,"Learner lifecycle source must equal tested file");
assert.equal(published("qualityMavenSelectionPom"),pom,"Learner POM must equal real fixture");

const call=(cwd,args)=>{
  const r=spawnSync("mvn",["-B","-ntp","-q",...args],{cwd,encoding:"utf8",timeout:180000});
  assert.ifError(r.error);
  return r;
};
const count=(cwd,where,name)=>{
  const file=join(cwd,"target",where,"TEST-org.tsa.quality."+name+".xml");
  if (!existsSync(file)) return 0;
  const xml=readFileSync(file,"utf8");
  const suite=xml.match(/<testsuite\b[^>]*>/)?.[0];
  assert.ok(suite,"Invalid Surefire/Failsafe report: "+file);
  const num=k=>Number(suite.match(new RegExp(k+'="(\\d+)"'))?.[1]??-1);
  for (const k of ["failures","errors","skipped"]) assert.equal(num(k),0,k+" in "+name);
  return num("tests");
};
let result=call(root,["clean","verify"]);
assert.equal(result.status,0,"Full real Jupiter/Failsafe verification failed:\n"+result.stdout+"\n"+result.stderr);
assert.equal(count(root,"surefire-reports","PolicyTest"),4);
assert.equal(count(root,"surefire-reports","TagFilteringExampleTest"),2);
assert.equal(count(root,"surefire-reports","LifecycleOwnershipTest"),2);
assert.equal(count(root,"failsafe-reports","ProtocolIT"),1);
assert.equal(count(root,"surefire-reports","ProtocolIT"),0);
console.log("PASS real Maven lifecycle: Surefire 4+2+2, Failsafe 1; no IT in Surefire");

result=call(root,["dependency:tree","-DoutputFile=target/quality-dependency-tree.txt","-DoutputType=text"]);
assert.equal(result.status,0,"Maven dependency:tree failed:\n"+result.stdout+"\n"+result.stderr);
const tree=readFileSync(path("target/quality-dependency-tree.txt"),"utf8");
for(const id of ["org.junit.jupiter:junit-jupiter:jar:5.11.4:test","org.junit.jupiter:junit-jupiter-api","org.junit.jupiter:junit-jupiter-engine","org.junit.platform:junit-platform-engine"]){
 assert.ok(tree.includes(id),"Missing direct/transitive JUnit proof "+id+"\n"+tree);
}
console.log("PASS real dependency tree: direct test-scope Jupiter and transitive API/engine/Platform");

// A subset is not certified by 'BUILD SUCCESS': assert exact selected evidence.
for(const [expression,expected] of [["smoke",1],["regression",1],["smoke & regression",0]]){
 result=call(root,["clean","test","-Dgroups="+expression]);
 // When the selected group is empty, Maven may succeed; only executed count is relevant.
 if(expected>0)assert.equal(result.status,0,expression+": "+result.stderr);
 const actual=count(root,"surefire-reports","TagFilteringExampleTest");
 assert.equal(actual,expected,"Wrong selected test count for "+expression);
 assert.equal(count(root,"surefire-reports","PolicyTest"),0,"Untagged PolicyTest contaminated "+expression);
 assert.equal(count(root,"surefire-reports","LifecycleOwnershipTest"),0,"Untagged LifecycleOwnershipTest contaminated "+expression);
 console.log("PASS tag expression "+JSON.stringify(expression)+": "+actual+" executed tests");
}

const temp=mkdtempSync(join(tmpdir(),"tsa-junit-tag-negative-"));
try{
 cpSync(path("pom.xml"),join(temp,"pom.xml"));
 cpSync(path("src"),join(temp,"src"),{recursive:true});
 const tagFile=join(temp,"src/test/java/org/tsa/quality/TagFilteringExampleTest.java");
 const needle='@Tag("regression")';
 assert.ok(tagged.includes(needle),"Regression tag mutation anchor missing");
 writeFileSync(tagFile,tagged.replace(needle,'@Tag("smoke")'));
 result=call(temp,["clean","test","-Dgroups=smoke"]);
 assert.equal(result.status,0,"Tag mutant should compile and run:\n"+result.stderr);
 assert.equal(count(temp,"surefire-reports","TagFilteringExampleTest"),2,"Mutant must wrongly expand smoke set to 2");
 console.log("PASS tag mutation: changed label expands smoke selection to 2 and is detected");

 const lifecycleFile=join(temp,"src/test/java/org/tsa/quality/LifecycleOwnershipTest.java");
 const marker="public class LifecycleOwnershipTest {";
 assert.ok(lifecycle.includes(marker),"PER_CLASS mutation anchor missing");
 const mutated=lifecycle.replace(marker,
   "@org.junit.jupiter.api.TestInstance(org.junit.jupiter.api.TestInstance.Lifecycle.PER_CLASS)\n"+marker);
 writeFileSync(lifecycleFile,mutated);
 result=call(temp,["clean","test","-Dtest=LifecycleOwnershipTest"]);
 assert.notEqual(result.status,0,"PER_CLASS must violate independent test-instance invariant");
 const reportFile=join(temp,"target/surefire-reports/org.tsa.quality.LifecycleOwnershipTest.txt");
 assert.ok(existsSync(reportFile),"JUnit PER_CLASS negative report missing");
 const report=readFileSync(reportFile,"utf8");
 assert.match(report,/default PER_METHOD must construct two instances|expected: <2> but was: <1>/);
 console.log("PASS PER_CLASS negative: Jupiter reports instance lifetime mismatch");
} finally { rmSync(temp,{recursive:true,force:true}); }
console.log("PASS exact source-published Maven tag, dependency and lifecycle verification.");
