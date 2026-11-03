import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
const cases = readFileSync("packages/runtime-kernel/src/paths/quality-java-first-class-cases.ts", "utf8");
const source = readFileSync("packages/runtime-kernel/src/paths/quality-java-test-engineering-deep.ts", "utf8");
const match = cases.match(/export const qualityJavaPrograms = (\{[\s\S]*?\}) as const;/);
assert.ok(match, "Six standalone original Java lesson sources must be serializable");
assert.ok(source.includes("code:qualityJavaPrograms"), "Actual learner readings must render these programs");
const programs = JSON.parse(match[1]);
const classes = {
  "types-modeling":"JavaTypesProof",
  "equality-object-contracts":"JavaEqualityProof",
  "generics-collections":"JavaGenericsProof",
  "exceptions-resources":"JavaResourceProof",
  "annotations-reflection":"JavaAnnotationProof",
  "functional-java":"JavaFunctionalProof",
};
assert.deepEqual(Object.keys(programs).sort(), Object.keys(classes).sort());
const command=(name,args,cwd)=>{const r=spawnSync(name,args,{cwd,encoding:"utf8",timeout:15000});assert.ifError(r.error);return r};
const root=mkdtempSync(join(tmpdir(),"tsa-quality-java-depth-"));
try {
  for (const [id,klass] of Object.entries(classes)) {
    const dir=join(root,id); await (await import("node:fs/promises")).mkdir(dir);
    const file=join(dir,klass+".java");
    writeFileSync(file,programs[id]);
    let r=command("javac",[klass+".java"],dir);
    assert.equal(r.status,0,id+": "+r.stderr);
    r=command("java",[klass],dir);
    assert.equal(r.status,0,id+": "+r.stderr);
    assert.ok(r.stdout.trim(),id+": no observed output");
    console.log("PASS exact Java learner source: "+id+" => "+r.stdout.trim().replaceAll("\n","; "));
  }
  const mutants=[
    ["types-modeling","hosts = List.copyOf(hosts);","// copied list removed; mutable source leaks","mutable source leaked"],
    ["equality-object-contracts","if (!good.contains(two))","if (good.contains(two))","equal key lookup"],
    ["exceptions-resources","try (current) { throw new IOException","{ throw new IOException","cause/close missing"],
    ["annotations-reflection","@Retention(RetentionPolicy.RUNTIME)","@Retention(RetentionPolicy.CLASS)","discovery failed"],
    ["functional-java","filter(Service::active)","filter(s -> !s.active())","filtered results"],
  ];
  for(const [id,needle,replacement,error] of mutants){
    assert.ok(programs[id].includes(needle),"Mutation target changed: "+id);
    const klass=classes[id],dir=join(root,id),file=join(dir,klass+".java");
    writeFileSync(file,programs[id].replace(needle,replacement));
    let r=command("javac",[klass+".java"],dir);
    assert.equal(r.status,0,"Negative must compile: "+id+": "+r.stderr);
    r=command("java",[klass],dir);
    assert.notEqual(r.status,0,"Negative must fail: "+id);
    assert.ok(r.stderr.includes(error),"Expected failure not observed "+id+": "+r.stderr);
    console.log("PASS negative Java mutation: "+id+" => "+error);
  }
} finally { rmSync(root,{recursive:true,force:true}); }
console.log("PASS 6 exact learner Java programs + 5 deterministic negative controls.");
