import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

// Execute EXACT learner-published source: actual PyYAML parse and unittest,
// but never claim this runs Jenkins Groovy, GitLab CI or registry publication.
const module=readFileSync("packages/runtime-kernel/src/paths/delivery-migration-exercises-deep.ts","utf8");
const source=readFileSync("packages/runtime-kernel/src/paths/delivery-ci-migration-proof.ts","utf8");
const prose=readFileSync("packages/runtime-kernel/src/paths/delivery-ci-migration-teaching.ts","utf8");
const match=source.match(/export const ciMigrationLocalProof = ("(?:\\.|[^"\\])*");/);
assert.ok(match,"Cannot find literal learner-executable Python source");
const py=JSON.parse(match[1]);
for(const id of ["brief","practical","review"])
  assert.ok(module.includes('id: "delivery-platform-migration-exercise-'+id+'"'),
    "Original CI migration activity ID lost: "+id);
for(const id of ["contract","gates","cutover"])
  assert.ok(prose.includes("delivery-platform-migration-exercise-"+id),
    "Missing focused new reading "+id);
assert.ok(module.includes("...ciMigrationFocusedReadings.map("));
assert.ok(module.includes("code: ciMigrationLocalProof"));
assert.ok(module.includes("...ciMigrationAdditionalPracticalSteps"));
for(const phrase of ["Jenkins","GitLab","needs","allow_failure","protected","shadow","NOT_TESTED"]){
 assert.ok(prose.includes(phrase),"Migration mechanism/evidence underexplained "+phrase);
}
assert.ok(py.includes("yaml.safe_load(gitlab_ci)"));
assert.ok(py.includes("subprocess.run([sys.executable, '-m', 'unittest'"));
assert.ok(py.includes("not Jenkins/GitLab execution") || py.includes("NOT Jenkins/GitLab execution"));
console.log("PASS three original CI migration activities and three focused source readings, local and live boundaries");

const markers=[
 "MIGRATION_REAL_YAML_PARSED_AND_DEPENDENCY_GATE_PRESENT",
 "MIGRATION_REAL_TEST_FAILURE_BLOCKS_LOCAL_PUBLISH_ADMISSION",
 "MIGRATION_UNTRUSTED_REF_AND_SHADOW_PUBLISH_DENIED",
 "MIGRATION_SINGLE_AUTHORITATIVE_RELEASE_PATH",
 "MIGRATION_LOCAL_PROOF_NOT_LIVE_JENKINS_OR_GITLAB"
];
function run(code,label,positive){
 const x=spawnSync("python3",["-c",code],{
   encoding:"utf8",timeout:30000,maxBuffer:2*1024*1024
 });
 assert.ok(!x.error,label+" spawned incorrectly "+x.error);
 if(positive){
   assert.equal(x.status,0,label+"\nstdout:\n"+x.stdout+"\nstderr:\n"+x.stderr);
   for(const marker of markers)assert.ok(x.stdout.includes(marker),label+" missing "+marker);
 } else {
   assert.notEqual(x.status,0,label+" unsafe source passed");
   assert.match(x.stderr,/AssertionError/,label+" unexpectedly failed for unrelated error:\n"+x.stderr);
 }
 console.log("PASS "+label+" status="+x.status);
}
run(py,"actual local GitLab YAML parsing, real unittest success/failure and release authority model",true);
const mutants=[
 ["publish no longer depends on tests","needs: [unit_tests]","needs: []"],
 ["test failure tolerated as green","allow_failure: false","allow_failure: true"],
 ["failed test allowed to publish","return test_passed and trusted_ref and authority == 'gitlab'",
  "return trusted_ref and authority == 'gitlab'"],
 ["unprotected branch allowed","return test_passed and trusted_ref and authority == 'gitlab'",
  "return test_passed and authority == 'gitlab'"],
 ["legacy and target both authoritative",
  "authority = {'jenkins': 'shadow', 'gitlab': 'primary'}",
  "authority = {'jenkins': 'primary', 'gitlab': 'primary'}"]
];
for(const [name,needle,replacement] of mutants){
 assert.ok(py.includes(needle),"Mutation no longer anchored: "+name);
 run(py.replace(needle,replacement),"rejected unsafe CI-migration mutant: "+name,false);
}
console.log("PASS 5 CI migration unsafe mutants; actual live pipeline equivalence NOT_TESTED");
