import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source=readFileSync("packages/runtime-kernel/src/paths/system-thinker-requirements-running-case.ts","utf8");
const lesson=readFileSync("packages/runtime-kernel/src/paths/system-thinker-requirements-deep.ts","utf8");
const start=source.indexOf("export const requirementsRunningCase: ");
const cut=source.indexOf(";\nexport const requirementsRunningCaseReferences",start);
assert.ok(start>=0&&cut>start,"No complete authored running case");
const json=source.slice(source.indexOf(" = ",start)+3,cut);
const cases=JSON.parse(json);
const expected=[
 "From Requests to Problems",
 "Stakeholders and Actors",
 "Functional Requirements",
 "Quality Requirements",
 "Constraints and Assumptions",
 "Acceptance and Evidence",
];
assert.deepEqual(Object.keys(cases),expected);
for (const name of expected) {
 const sections=cases[name];
 assert.equal(sections.length,2,name+" should teach the running case in two focused mechanisms");
 assert.notEqual(sections[0].title,sections[1].title);
 assert.ok(sections.some(s=>s.code?.code&&s.code.code.length>=150),name+": worked artifact missing");
 for(const section of sections){
  assert.ok(section.paragraphs.length>=2,name+": no mechanism + failure path");
  assert.ok(section.paragraphs.every(p=>p.length>140),name+": compressed checklist disguised as lesson");
 }
 const headings=sections.map(s=>s.title.toLowerCase().replace(/[^a-z0-9]+/g,"-"));
 assert.equal(new Set(headings).size,2,name+": duplicate heading ID would cause broken deep links");
 assert.ok(lesson.includes(JSON.stringify(name)),name+" absent from lesson source");
}
assert.ok(lesson.includes("...(requirementsRunningCase[title] ?? [])"),"Running case is not actually composed into learner reading");
assert.ok(lesson.includes("...(requirementsRunningCaseReferences[title] ?? [])"),"Lesson sources not shown to learners");
for(const identifier of ["OBS-01","FR-OWNER-01","FR-OWNER-02","QR-LOOKUP-01","D-01","A-01","VAL-ESC-01"]) {
 assert.ok(source.includes(identifier),"Trace relationship missing "+identifier);
}
assert.match(source,/does not prove|not proof|not measured|not approved|unconfirmed/i);
console.log("System Thinker Requirements running case passed: 6 connected lessons, 12 mechanisms, worked artifacts, negative paths, source wiring and trace obligations.");
