import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";

const source=fs.readFileSync("packages/runtime-kernel/src/paths/builder-software-craft-deep.ts","utf8");
const injected=fs.readFileSync("packages/runtime-kernel/src/paths/internal-dependency-management.ts","utf8");
const cases=[
  ["Code review — corrected export with three independent customer checks", "Code review: 3 scoped exports, no cross-customer rows"],
  ["Separation of Concerns — five executable before-and-after cases", "Separation lab: 5 responses and stored state agree"],
  ["Readable Code — equivalent pure-Python policy and negative cases", "readable policy: three cases preserved"],
  ["Refactoring — run six contracts against the original function", "Before refactoring: 6 contracts passed"],
  ["Refactoring — extract eligibility and rerun the same six contracts", "After refactoring: 6 contracts passed"],
  ["Configuration — executable fail-closed environment parser", "valid False"],
  ["Logging — executable structured-context and secret absence test", "service=42 request=req-demo-7"],
  ["Errors — executable stable public error mapping", "public error mappings: 6"],
  ["Static analysis — parse error versus valid but wrong authorization", "syntax valid; authorization policy still wrong"],
  ["Documentation — executable setup instructions completeness gate", "documentation checklist passed; vague instructions rejected"],
  ["Internal package contract — executable incompatible consumer case", "BREAKING CHANGE: existing consumer expects a string", "injected"],
  ["Performance Awareness — executable p50/p95 with a slow-tail negative case", "synthetic p50 unchanged at 100ms; p95 grows from 115ms to 320ms"]
];
for(const [caption,expected,origin] of cases){
  const authored = origin === "injected" ? injected : source;
  const anchor=Math.max(
    authored.indexOf('"caption":"'+caption+'"'),
    authored.indexOf('"caption": "'+caption+'"'),
  );
  assert.ok(anchor>=0,"Missing published lesson: "+caption);
  const m=authored.slice(anchor,anchor+12000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
  assert.ok(m,"Cannot parse published code: "+caption);
  const code=JSON.parse(m[1]);
  const r=spawnSync("python3",["-c",code],{encoding:"utf8",timeout:10000});
  assert.ifError(r.error);
  assert.equal(r.status,0,`Source example failed: ${caption}\n${r.stderr}\n${r.stdout}`);
  assert.ok((r.stdout+r.stderr).includes(expected),`Expected output missing in ${caption}: ${r.stdout+r.stderr}`);
  if(caption.includes("Configuration")){
    assert.match(r.stdout,/missing DATABASE_URL is required/);
    assert.match(r.stdout,/invalid DJANGO_DEBUG must be true or false/);
  }
}

// Mutation proof: a policy based on "some members exist" instead of this
// member's identity must fail the published authorization/state assertions.
const separationCaption = '"caption": "Separation of Concerns — five executable before-and-after cases"';
const separationPos = source.indexOf(separationCaption);
assert.ok(separationPos >= 0,"Missing actual Separation of Concerns learner code");
const separationMatch = source.slice(separationPos,separationPos+20000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(separationMatch,"Cannot extract separation exercise");
const separated = JSON.parse(separationMatch[1]);
assert.match(separated,/return member_id in members/,"The correct policy must compare the specific actor");
const mutant = separated.replace("return member_id in members", "return bool(members)");
const negative = spawnSync("python3",["-c",mutant],{encoding:"utf8",timeout:10000});
assert.ifError(negative.error);
assert.notEqual(negative.status,0,"Broken any-membership policy unexpectedly passed the lesson's negative checks");
assert.match(negative.stderr,/AssertionError/,"The mutant must be rejected by a real assertion");


// Refactoring regression evidence must come from the exact published after
// example and not from a separate hand-written test substitute.
const afterRefactorCaption = '"caption": "Refactoring — extract eligibility and rerun the same six contracts"';
const refactorIndex = source.indexOf(afterRefactorCaption);
assert.ok(refactorIndex >= 0,"Missing learner-visible refactored refund program");
const refactorMatch = source.slice(refactorIndex,refactorIndex+24000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(refactorMatch,"Cannot extract exact after-refactoring Python example");
const afterRefactorCode = JSON.parse(refactorMatch[1]);
assert.match(afterRefactorCode,/if days_since_purchase > 30:/);
assert.match(afterRefactorCode,/return "already_refunded"/,"Denial priority must remain explicit");
assert.match(afterRefactorCode,/assert order\["refunded"\] is expected_refunded/,"The test must verify state changes");
const refactorMutant = afterRefactorCode.replace("if days_since_purchase > 30:","if days_since_purchase >= 30:");
assert.notEqual(refactorMutant,afterRefactorCode,"Boundary mutant must actually alter the code");
const rejectedRefactor = spawnSync("python3",["-c",refactorMutant],{encoding:"utf8",timeout:10000});
assert.ifError(rejectedRefactor.error);
assert.notEqual(rejectedRefactor.status,0,"A 30-day boundary regression must fail a published test");
assert.match(rejectedRefactor.stderr,/AssertionError/);


// Extract actual lesson-level Python code (the source is generated from the
// authored lesson and contains a quoted JSON string in its code block).
function noviceTestCode(caption) {
  const anchor=source.indexOf('"caption": "'+caption+'"');
  assert.ok(anchor>=0,"Missing beginner testing code: "+caption);
  const m=source.slice(anchor,anchor+16000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
  assert.ok(m,"Cannot extract beginner testing code: "+caption);
  return JSON.parse(m[1]);
}
function runNovice(code) {
  const p=spawnSync("python3",["-c",code],{encoding:"utf8",timeout:10000});
  assert.ifError(p.error);
  return p;
}
const borrowing=noviceTestCode("Testing fundamentals — runnable three-case unittest suite");
const borrowingGreen=runNovice(borrowing);
assert.equal(borrowingGreen.status,0,borrowingGreen.stderr);
assert.match(borrowingGreen.stderr,/Ran 3 tests/);
const borrowingMutant=runNovice(borrowing.replace("return member_id in allowed_members and book_available","return bool(allowed_members) and book_available"));
assert.notEqual(borrowingMutant.status,0,"Borrowing authorization mutant must be rejected");
assert.match(borrowingMutant.stderr,/test_unregistered_member_is_denied_even_when_someone_is_registered/);
assert.match(borrowingMutant.stderr,/FAIL/);

const order=noviceTestCode("Testing safety net — runnable fake notifier and side-effect assertions");
const orderGreen=runNovice(order);
assert.equal(orderGreen.status,0,orderGreen.stderr);
assert.match(orderGreen.stderr,/Ran 3 tests/);
const orderGuard='    if order["completed"]:\n        return "already_completed"\n';
assert.ok(order.includes(orderGuard),"Missing order-completion duplicate guard in learner code");
const orderMutant=runNovice(order.replace(orderGuard,""));
assert.notEqual(orderMutant.status,0,"Duplicate notification mutant must fail");
assert.match(orderMutant.stderr,/test_repeat_has_no_second_notification/);
assert.match(orderMutant.stderr,/FAIL/);
console.log("Beginner testing lesson passed: 3+3 source-published unit tests, member-specific authorization and duplicate-notification mutants rejected.");

console.log("Builder craft examples passed: 12 source-extracted Python labs and their negative boundaries.");


const unsafeCaption = '"caption": "Code review — intentionally unsafe candidate must fail the cross-customer test"';
const unsafePos = source.indexOf(unsafeCaption);
assert.ok(unsafePos >= 0,"Missing unsafe learner code review example");
const unsafeMatch = source.slice(unsafePos,unsafePos+12000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(unsafeMatch,"Cannot extract unsafe review candidate");
const unsafe = JSON.parse(unsafeMatch[1]);
const unsafeResult = spawnSync("python3",["-c",unsafe],{encoding:"utf8",timeout:10000});
assert.ifError(unsafeResult.error);
assert.notEqual(unsafeResult.status,0,"Unsafe review candidate must fail its negative test");
assert.match(unsafeResult.stderr,/AssertionError/);
assert.match(unsafeResult.stderr,/INV-200/,"The leak must identify a foreign customer invoice");
assert.ok(source.includes('"Managing Technical Debt"'),"Code review and technical debt must be separate lessons");
assert.ok(source.indexOf('"Review a Code Change"') < source.indexOf('"Managing Technical Debt"'),
  "Learners must identify a defect before learning rational debt deferral");
assert.ok(source.includes("stableId ??"),"Renamed lesson must support stable activity IDs");

const publishedPractice=fs.readFileSync("packages/runtime-kernel/src/paths/builder-software-craft-quality.ts","utf8");
assert.ok(!source.includes("role__in="), "Readable Code must not use an invented membership role list");
assert.ok(source.includes("Membership.Role.MAINTAINER"), "Django policy must use the real Membership role choice");
assert.match(publishedPractice, /software-craft-readable-code/, "Readable Code practice must exist after composition");

assert.ok(source.includes('"Investigate Bugs with Git History"'), "Git regression investigation must be a separate lesson");
assert.ok(source.indexOf('"Git as an Engineering Tool"') < source.indexOf('"Investigate Bugs with Git History"'),
  "Git staging must precede history bisect");
assert.doesNotMatch(source, /git show <commit>|title: "Steward connection"/,
  "Do not reintroduce unknown commit placeholders or generic Steward callouts");
assert.match(publishedPractice, /software-craft-investigate-bugs-with-git-history/,
  "Published Git investigation must have its own explicit practical");
assert.match(publishedPractice,/software-craft-resolve-a-merge-conflict/,
  "Published conflict resolution must have an independent exercise");
assert.ok(source.indexOf('"Branching and Collaboration"')<source.indexOf('"Resolve a Merge Conflict"'),
  "Branch creation must precede conflict resolution");

function gitSnippet(caption) {
  const marker='"caption": "'+caption+'"';
  const i=source.indexOf(marker);
  assert.ok(i>=0, "Missing learner-facing Git code block: "+caption);
  const m=source.slice(i,i+5000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
  assert.ok(m, "Missing Git shell code: "+caption);
  return JSON.parse(m[1]);
}
const gitRoot=fs.mkdtempSync(path.join(os.tmpdir(),"tsa-craft-git-"));
function runGit(caption,cwd){
  const proc=spawnSync("bash",["-e","-c",gitSnippet(caption)],{cwd,encoding:"utf8",timeout:20000});
  assert.ifError(proc.error);
  assert.equal(proc.status,0,"Git learner code failed: "+caption+"\n"+proc.stdout+"\n"+proc.stderr);
  return proc.stdout+proc.stderr;
}
function gitCommand(cwd,args){
  const proc=spawnSync("git",args,{cwd,encoding:"utf8",timeout:10000});
  assert.ifError(proc.error);
  assert.equal(proc.status,0,"Git command failed: "+args.join(" ")+"\n"+proc.stderr);
  return proc.stdout.trim();
}
try {
  runGit("Git lab — create a disposable repository and first commit",gitRoot);
  const first=path.join(gitRoot,"tsa-git-review-lab");
  runGit("Git lab — stage one change but leave unrelated work out",first);
  const changed=gitCommand(first,["show","--name-only","--format=oneline","HEAD"]);
  assert.match(changed,/README\.md/);
  assert.doesNotMatch(changed,/personal-notes\.txt/,"Unrelated local notes must not enter the commit");
  assert.match(gitCommand(first,["status","--short"]),/\?\? personal-notes\.txt/);
  runGit("Git lab — inspect a real pair of commits",first);
  runGit("Git lab — restore one deliberately disposable edit",first);
  assert.equal(gitCommand(first,["diff","--","README.md"]),"");
  assert.equal(gitCommand(first,["rev-list","--count","HEAD"]),"2");

  runGit("Git bisect lab — create a known good and known bad history",gitRoot);
  const bisect=path.join(gitRoot,"tsa-git-bisect-lab");
  assert.equal(gitCommand(bisect,["rev-list","--count","HEAD"]),"4");
  const output=runGit("Git bisect lab — run a real good-bad test and restore the branch",bisect);
  assert.match(output,/first [\x27\x22]?bad[\x27\x22]? commit/, "Git should identify the actual first faulty commit despite its output quoting convention");
  assert.match(gitCommand(bisect,["show","-s","--format=%s","HEAD~1"]),/accidentally set zero limit/);
  assert.equal(gitCommand(bisect,["branch","--show-current"]),"main");
  assert.equal(gitCommand(bisect,["status","--short"]),"");


  // Branching and conflict resolution are taught only after the initial
  // staging and bisect labs; execute real independent repository states.
  runGit("Branch lab — create an isolated feature branch",gitRoot);
  const branch=path.join(gitRoot,"tsa-git-branch-lab");
  assert.equal(gitCommand(branch,["branch","--show-current"]),"feature/add-note");
  assert.equal(gitCommand(branch,["rev-list","--count","HEAD"]),"2");
  runGit("Branch lab — compare and merge the focused change",branch);
  assert.equal(gitCommand(branch,["branch","--show-current"]),"main");
  assert.match(fs.readFileSync(path.join(branch,"README.md"),"utf8"),/Change reviewed before release/);
  assert.equal(gitCommand(branch,["rev-list","--parents","-n","1","HEAD"]).split(/\s+/).length,3,
    "A no-fast-forward merge must actually record two parents");
  runGit("Branch lab — delete only the merged local feature branch",branch);
  assert.equal(gitCommand(branch,["branch","--list"]).replace(/^\*\s*/,""),"main");

  const conflictText=runGit("Merge-conflict lab — reproduce two incompatible changes",gitRoot);
  assert.match(conflictText,/EXPECTED_CONFLICT/,"The teaching lab must really encounter a merge refusal");
  const conflict=path.join(gitRoot,"tsa-git-conflict-lab");
  assert.match(gitCommand(conflict,["status","--short"]),/UU greeting\.txt/);
  assert.match(fs.readFileSync(path.join(conflict,"greeting.txt"),"utf8"),/<<<<<<< HEAD/);
  runGit("Merge-conflict lab — resolve the requirements and commit the merge",conflict);
  const resolved=fs.readFileSync(path.join(conflict,"greeting.txt"),"utf8");
  assert.match(resolved,/^greeting=ola$/m);
  assert.match(resolved,/^fallback=bonjour$/m);
  assert.doesNotMatch(resolved,/<<<<<<<|=======|>>>>>>>/);
  assert.equal(gitCommand(conflict,["status","--short"]),"");
  assert.equal(gitCommand(conflict,["rev-list","--parents","-n","1","HEAD"]).split(/\s+/).length,3,
    "Resolution should create a real merge commit with both parents");
} finally {
  fs.rmSync(gitRoot,{recursive:true,force:true});
}
console.log("Builder Git lessons passed: four source-derived scratch repositories, selective staging, real bisect, focused branch merge and deliberate conflict resolution.");


