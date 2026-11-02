import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=readFileSync("packages/runtime-kernel/src/paths/system-thinker-modeling-running-case.ts","utf8");
const lesson=readFileSync("packages/runtime-kernel/src/paths/system-thinker-modeling-deep.ts","utf8");
const a=source.indexOf("export const modelingRunningCase:"),b=source.indexOf(";\nexport const modelingRunningReferences:",a);
assert.ok(a>=0&&b>a,"Missing authored modeling narrative");
const cases=JSON.parse(source.slice(source.indexOf(" = ",a)+3,b));
const titles=["Why We Model Systems","C4-Style Thinking","Containers and Components as Models","State and Lifecycle Modeling","Communicating Architecture Visually"];
assert.deepEqual(Object.keys(cases),titles);
for(const title of titles){
 const sections=cases[title];
 assert.equal(sections.length,2,title+": missing a worked/rejected model pair");
 assert.ok(sections.some(s=>s.code?.code?.length>140),title+": missing inspectable diagram or artifact");
 assert.equal(new Set(sections.map(s=>s.title.toLowerCase().replace(/[^a-z0-9]+/g,"-"))).size,2);
 for(const s of sections){
  assert.ok(s.paragraphs.length>=2,title+": missing explanation and critique");
  assert.ok(s.paragraphs.every(p=>p.length>140),title+": compression regression");
 }
}
const states=cases["State and Lifecycle Modeling"].flatMap(s=>s.code?[s.code]:[]);
assert.ok(states.some(x=>x.code.includes("stateDiagram-v2")),"No learner-copyable state diagram");
assert.ok(states.some(x=>x.code.includes("production Environment exists")),"No verified boundary guard in proposed model");
for(const word of ["OBS-01","PostgreSQL","source","context","container","component","unconfirmed"]){
 assert.ok(source.toLowerCase().includes(word.toLowerCase()),"Missing model trace term "+word);
}
assert.ok(lesson.includes("...(modelingRunningCase[title] ?? [])"),"Modeling content not actually rendered");
assert.ok(lesson.includes("...(modelingRunningReferences[title] ?? [])"),"Modeling research not linked in lessons");
console.log("System Thinker Modeling running case passed: five lessons, ten worked mechanisms, explicit C4 zoom and guarded state machine source.");
