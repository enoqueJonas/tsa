import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";

function parseExport(file, name, next) {
  const source=readFileSync(file,"utf8");
  const start=source.indexOf("export const "+name+":");
  const end=source.indexOf(";\nexport const "+next+":",start);
  assert.ok(start>=0 && end>start, "Missing authored data for "+name);
  return JSON.parse(source.slice(source.indexOf(" = ",start)+3,end));
}
const root="packages/runtime-kernel/src/paths/";
const componentTitles=[
  "Components and Responsibilities",
  "Coupling and Cohesion Foundations",
  "Dependency Direction",
  "Internal and External Dependencies"
];
const flowTitles=[
  "Following Data Through a System",
  "Synchronous and Asynchronous Boundaries",
  "Integration Contracts",
  "Failure Across Integrations"
];
const componentCases=parseExport(root+"system-thinker-components-running-case.ts","componentsRunningCase","componentsRunningReferences");
const flowCases=parseExport(root+"system-thinker-flow-running-case.ts","flowRunningCase","flowRunningReferences");
function parseFinalExport(file,name){
  const src=readFileSync(file,"utf8"), start=src.indexOf("export const "+name+":");
  assert.ok(start>=0,"Missing "+name);
  return JSON.parse(src.slice(src.indexOf(" = ",start)+3).trim().replace(/;$/,""));
}
for (const [cases,titles,refsName,path] of [
 [componentCases,componentTitles,"componentsRunningReferences","system-thinker-components-running-case.ts"],
 [flowCases,flowTitles,"flowRunningReferences","system-thinker-flow-running-case.ts"]
]){
  assert.deepEqual(Object.keys(cases),titles,"Incomplete lesson coverage");
  const refs=parseFinalExport(root+path,refsName);
  assert.deepEqual(Object.keys(refs),titles,"Missing per-lesson source links");
  for(const title of titles){
    assert.equal(cases[title].length,2,title+": expected mechanism and critique");
    assert.ok(cases[title].some(s=>s.code?.code?.length>180),title+": missing inspectable artifact");
    assert.ok(refs[title].every(item=>item.url.startsWith("https://")),title+": bad reference");
    for(const section of cases[title]){
      assert.ok(section.paragraphs.length>=2,title+": explanation/critique incomplete");
      assert.ok(section.paragraphs.every(p=>p.length>140),title+": superficial paragraph regression");
    }
  }
}
const componentLesson=readFileSync(root+"system-thinker-components-dependencies-deep.ts","utf8");
const flowLesson=readFileSync(root+"system-thinker-data-flow-deep.ts","utf8");
for(const needle of [
  "...(componentsRunningCase[title] ?? [])",
  "...(componentsRunningReferences[title] ?? [])"
]) assert.ok(componentLesson.includes(needle),"Component content not composed: "+needle);
for(const needle of [
  "...(flowRunningCase[title] ?? [])",
  "...(flowRunningReferences[title] ?? [])"
]) assert.ok(flowLesson.includes(needle),"Flow content not composed: "+needle);
for(const needle of ["OBS-01","FR-OWNER-01","FR-OWNER-02","D-01","PostgreSQL","UNVERIFIED"]){
  assert.ok(JSON.stringify(componentCases).includes(needle)||JSON.stringify(flowCases).includes(needle),"Missing continuity "+needle);
}
for(const needle of ["same key","409","HTTP 202","authorization","notification"]){
  assert.ok(JSON.stringify(flowCases).toLowerCase().includes(needle.toLowerCase()),"Missing contract/failure "+needle);
}
const code=componentCases["Coupling and Cohesion Foundations"].flatMap(s=>s.code?.language==="python"?[s.code.code]:[])[0];
assert.ok(code,"Missing learner-copyable Python code");
const output=execFileSync("python3",["-c",code],{encoding:"utf8",timeout:10000}).trim();
assert.equal(output,"baseline cycle: False\npolicy imports transport: True","Cycle demonstration behavior changed");
console.log("System Thinker Modules 4-5 OBS-01 running cases passed: eight lessons, 16 mechanisms, executable cycle negative case and rendering composition.");
