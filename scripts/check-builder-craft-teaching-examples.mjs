import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";

const source=fs.readFileSync("packages/runtime-kernel/src/paths/builder-software-craft-deep.ts","utf8");
const injected=fs.readFileSync("packages/runtime-kernel/src/paths/internal-dependency-management.ts","utf8");
const cases=[
  ["Readable Code — equivalent pure-Python policy and negative cases", "readable policy: three cases preserved"],
  ["Refactoring — executable behavior-preservation check", "refactor contracts preserved: 3"],
  ["Testing — executable unittest authorization boundary", "Ran 2 tests"],
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
console.log("Builder craft examples passed: 9 source-extracted Python labs and their negative boundaries.");

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


