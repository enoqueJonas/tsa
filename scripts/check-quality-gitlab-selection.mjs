import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const source=readFileSync("packages/runtime-kernel/src/paths/quality-continuous-scheduled-execution-deep.ts","utf8");
const match=source.match(/const gitlabPipelineTeachingYaml = ("(?:\\.|[^"\\])*");/);
assert.ok(match && source.includes("code:gitlabPipelineTeachingYaml"),"Pipeline teaching must render its exact YAML");
const fixture=JSON.parse(match[1]);
const checker=[
  "import sys, yaml",
  "data = yaml.safe_load(sys.stdin.read())",
  "assert data['stages'] == ['test']",
  "workflow = data['workflow']['rules']",
  "assert any('schedule' in rule.get('if', '') for rule in workflow), 'schedule pipeline omitted from workflow'",
  "assert any('merge_request_event' in rule.get('if','') for rule in workflow)",
  "assert workflow[-1].get('when') == 'never', 'unconditional pipeline match risks duplicates'",
  "fast = data['quality-fast']",
  "scheduled = data['quality-scheduled']",
  "assert any('merge_request_event' in rule.get('if','') for rule in fast['rules'])",
  "assert not any('schedule' in rule.get('if','') for rule in fast['rules'])",
  "assert any('schedule' in rule.get('if','') for rule in scheduled['rules'])",
  "for job in (fast,scheduled):",
  "    assert job.get('allow_failure') is not True",
  "    assert all('|| true' not in step for step in job['script'])",
  "    assert job['artifacts']['when'] == 'always'",
  "    assert job['artifacts']['reports']['junit']",
  "    assert job['artifacts']['paths']",
  "print('selection contract valid')",
].join("\n");
function verify(yamlText){
 const r=spawnSync("python3",["-c",checker],{input:yamlText,encoding:"utf8",timeout:10000});
 assert.ifError(r.error);return r;
}
let r=verify(fixture);assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/selection contract valid/);
const mutated=fixture.replace('    - if: \'$CI_PIPELINE_SOURCE == "schedule"\'\n    - if: \'$CI_PIPELINE_SOURCE == "push"','    - if: \'$CI_PIPELINE_SOURCE == "push"');
assert.notEqual(mutated,fixture,"schedule mutant must alter source");
r=verify(mutated);assert.notEqual(r.status,0,"A scheduled job without workflow permission must fail");
assert.match(r.stderr,/schedule pipeline omitted/);
console.log("PASS actual source GitLab YAML parses, retains explicit pipeline/job selection and fails on missing schedule workflow rule; real GitLab schedule UNVERIFIED.");
