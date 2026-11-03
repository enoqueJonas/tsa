import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {spawnSync} from "node:child_process";

const reading=readFileSync("packages/runtime-kernel/src/paths/quality-continuous-scheduled-execution-deep.ts","utf8");
const source=readFileSync("packages/runtime-kernel/src/paths/quality-gitlab-evidence-v10.ts","utf8");
const yamlMatch=reading.match(/const gitlabPipelineTeachingYaml = ("(?:\\.|[^"\\])*");/);
assert.ok(yamlMatch && reading.includes("code:gitlabPipelineTeachingYaml"),
  "Original GitLab YAML must still render as exact original lesson source");
const yaml=JSON.parse(yamlMatch[1]);
const prefix="export const qualityGitlabEvidencePython = ";
assert.ok(source.includes(prefix),"No source-published GitLab evidence simulation");
const python=JSON.parse(source.split(prefix)[1].split(";\n")[0]);
assert.match(python,/expected_revision=REVISION/);
assert.match(python,/zero executed tests/);
assert.match(python,/scheduled JUnit artifacts omit Surefire or Failsafe evidence/);
assert.match(reading,/qualityGitlabEvidencePython/);
assert.match(reading,/qualityGitlabEvidenceLearning\.scheduled/);
const other=readFileSync("packages/runtime-kernel/src/paths/quality-containers-ci-deep.ts","utf8");
assert.match(other,/qualityGitlabEvidenceLearning\["reports-artifacts"\]/);
assert.match(other,/qualityGitlabEvidenceLearning\["test-selection"\]/);

const temp=mkdtempSync(join(tmpdir(),"tsa-quality-gitlab-proof-"));
try{
 const script=join(temp,"quality_gitlab_evidence.py"),fixture=join(temp,"teaching-gitlab.yml");
 writeFileSync(script,python);
 writeFileSync(fixture,yaml);
 function run(mode,sourceYaml=yaml) {
  writeFileSync(fixture,sourceYaml);
  const result=spawnSync("python3",[script,fixture,mode],{encoding:"utf8",timeout:12000});
  assert.ifError(result.error);
  return result;
 }
 let result=run("healthy");
 assert.equal(result.status,0,result.stdout+"\n"+result.stderr);
 assert.match(result.stdout,/PASS policy matrix: MR/);
 assert.match(result.stdout,/PASS fail-closed XML: 2 synthetic sample testcase nodes/);
 console.log("PASS exact authored source: five GitLab trigger contexts and nonempty provenance-bound JUnit XML");

 const failures=[
  ["missing-report","mandatory report missing"],
  ["zero-tests","zero executed tests"],
  ["skipped-tests","skipped cases"],
  ["wrong-revision","report provenance mismatch commit_sha"],
  ["hidden-failure","script hides failure"],
 ];
 for(const [mode,reason] of failures){
  result=run(mode);
  assert.notEqual(result.status,0,"Expected negative '"+mode+"' to fail");
  assert.ok(result.stderr.includes("EvidenceError:") && result.stderr.includes(reason),
    "Wrong failure reason "+mode+": "+result.stderr);
  console.log("PASS negative "+mode+": "+reason);
 }
 const scheduleRule="    - if: '$CI_PIPELINE_SOURCE == \"schedule\"'\n";
 assert.ok(yaml.includes(scheduleRule),"Expected GitLab workflow schedule clause absent");
 let bad=yaml.replace(scheduleRule,"");
 result=run("healthy",bad);
 assert.notEqual(result.status,0,"Missing scheduled workflow rule must reject required schedule job");
 assert.match(result.stderr,/EvidenceError: selection mismatch source=schedule/);
 console.log("PASS wrong workflow rule: scheduled pipeline omitted despite scheduled job definition");

 const fallback='    - when: never';
 assert.ok(yaml.includes(fallback),"Missing final fail-closed workflow rule");
 bad=yaml.replace(fallback,'    - when: always');
 result=run("healthy",bad);
 assert.notEqual(result.status,0,"Unconditional workflow fallback must be rejected");
 assert.match(result.stderr,/EvidenceError: selection mismatch source=web/);
 console.log("PASS wrong workflow fallback: web pipelines unintentionally admitted");

 const failsafeLine='        - target/failsafe-reports/TEST-*.xml\n';
 assert.ok(yaml.includes(failsafeLine),"Missing actual Failsafe report declaration");
 bad=yaml.replace(failsafeLine,"");
 result=run("healthy",bad);
 assert.notEqual(result.status,0,"Schedule must retain both Surefire/Failsafe XML");
 assert.match(result.stderr,/EvidenceError: scheduled JUnit artifacts omit Surefire or Failsafe evidence/);
 console.log("PASS wrong scheduled artifact selection: Failsafe evidence missing");
}finally{rmSync(temp,{recursive:true,force:true});}
console.log("PASS original GitLab policy/readings and 8 real negative scenarios. Live GitLab schedule UNVERIFIED.");
