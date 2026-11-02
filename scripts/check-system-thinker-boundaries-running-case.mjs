import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source=readFileSync("packages/runtime-kernel/src/paths/system-thinker-boundaries-running-case.ts","utf8");
const lesson=readFileSync("packages/runtime-kernel/src/paths/system-thinker-boundaries-deep.ts","utf8");
const start=source.indexOf("export const boundariesRunningCase:"),
      end=source.indexOf(";\nexport const boundariesRunningReferences:",start);
assert.ok(start>=0&&end>start,"Missing complete running case in Boundary source");
const cases=JSON.parse(source.slice(source.indexOf(" = ",start)+3,end));
const expected=["System Context","Actors and External Systems","Defining System Boundaries","Trust and Ownership Boundaries"];
assert.deepEqual(Object.keys(cases),expected);
for(const name of expected){
 const sections=cases[name];
 assert.equal(sections.length,2,name+": missing progressive worked+negative cases");
 assert.ok(sections.some(s=>s.code?.code?.length>150),name+": no inspectable worked diagram/matrix");
 const ids=sections.map(s=>s.title.toLowerCase().replace(/[^a-z0-9]+/g,"-"));
 assert.equal(new Set(ids).size,2,name+": duplicate section/anchor heading");
 for(const section of sections){
  assert.ok(section.paragraphs.length>=2,name+": missing mechanism or challenge");
  assert.ok(section.paragraphs.every(p=>p.length>130),name+": insufficient explanation");
 }
}
assert.ok(lesson.includes("...(boundariesRunningCase[title] ?? [])"),"Authored case not composed into learner readings");
assert.ok(lesson.includes("...(boundariesRunningReferences[title] ?? [])"),"Research is not reachable in lesson");
for(const sign of ["OBS-01","FR-OWNER-01/02","D-01","PostgreSQL","Team","OWASP","context","unconfirmed"]){
 assert.ok(source.toLowerCase().includes(sign.toLowerCase()),"Dropped essential boundary distinction: "+sign);
}
console.log("System Thinker Boundaries running case passed: four progressive lessons, eight substantial teaching sections, worked boundary diagrams and contradiction cases.");
