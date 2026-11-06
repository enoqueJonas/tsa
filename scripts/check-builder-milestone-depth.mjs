import assert from "node:assert/strict";
import fs from "node:fs";
import {spawnSync} from "node:child_process";
const prep=fs.readFileSync("packages/runtime-kernel/src/paths/builder-milestone-preparations.ts","utf8");
const pathSource=fs.readFileSync("packages/runtime-kernel/src/paths/builder-milestone-deep.ts","utf8");
for(const name of ["contract-invariants","postgres-constraints","http-boundaries","handoff-proof"])
 for(const suffix of ["reading","practice","check"])
  assert.ok(prep.includes('"id": "steward-api-v1-'+name+"-"+suffix+'"'),"Lost checkpoint "+name+"-"+suffix);
for(const suffix of ["brief","design-review","build","data-evidence","security-evidence","handoff","review"])
 assert.ok(pathSource.includes('id: "steward-api-v1-milestone-'+suffix+'"'),"Lost original milestone activity "+suffix);
assert.ok(pathSource.includes("...fullBuilderRequirements.map"),"Lost legacy build requirements");
assert.ok(pathSource.includes("NOT VALIDATED"),"Learner validation gate absent");
function extract(caption){
 const at=prep.indexOf('"caption": '+JSON.stringify(caption));
 assert.ok(at>=0,"Learner caption missing "+caption);
 const found=prep.slice(at,at+22000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
 assert.ok(found,"Published source missing "+caption);
 return JSON.parse(found[1]);
}
function run(cmd,args,input){
 const p=spawnSync(cmd,args,{input,encoding:"utf8",timeout:30000,
 env:{...process.env,PYTHONNOUSERSITE:"1"}});
 assert.ifError(p.error);return p;
}
const policy=extract("Steward milestone policy oracle — independent state, owner and denial examples");
const good=run("python3",["-c",policy]);
assert.equal(good.status,0,good.stderr);
for(const name of ["MILESTONE_POLICY_STATE_AND_401_403_404_PASS","MILESTONE_AUTHORIZATION_MUTANT_EXPOSED"])
 assert.ok(good.stdout.includes(name));
for(const [from,to] of [["m.team_id == service.team_id","True"],
 ['"production" in service.environment_kinds',"bool(service.environment_kinds)"]]){
 assert.ok(policy.includes(from));
 const wrong=run("python3",["-c",policy.replace(from,to)]);
 assert.notEqual(wrong.status,0,"Unsafe Python mutant passed");
 assert.match(wrong.stderr,/AssertionError/,"Mutant failed for wrong reason");
}
console.log("PASS published Python policy + two negative mutants");
const sql=extract("Steward milestone PostgreSQL scratch constraints — deliberate SQLSTATE negatives");
for(const marker of ["MILESTONE_DUPLICATE_REJECTED","MILESTONE_SELF_DEPENDENCY_REJECTED",
"MILESTONE_PRODUCTION_GAP_DETECTED","ROLLBACK;"])assert.ok(sql.includes(marker));
if(process.env.PGDATABASE){
 const goodSql=run("psql",["-X","-v","ON_ERROR_STOP=1"],sql);
 assert.equal(goodSql.status,0,goodSql.stdout+goodSql.stderr);
 const output=goodSql.stdout+goodSql.stderr;
 for(const marker of ["MILESTONE_DUPLICATE_REJECTED","MILESTONE_SELF_DEPENDENCY_REJECTED",
 "MILESTONE_PRODUCTION_GAP_DETECTED","MILESTONE_SCRATCH_TRANSACTION_ROLLED_BACK"])
  assert.ok(output.includes(marker));
 for(const [from,to] of [
 ["CONSTRAINT no_self_dependency CHECK (source_service_id <> target_service_id)","CONSTRAINT no_self_dependency CHECK (true)"],
 ["CONSTRAINT unique_directed_dependency UNIQUE (source_service_id, target_service_id)","CONSTRAINT unique_directed_dependency CHECK (true)"]]){
  assert.ok(sql.includes(from));
  const wrong=run("psql",["-X","-v","ON_ERROR_STOP=1"],sql.replace(from,to));
  assert.notEqual(wrong.status,0,"Unsafe SQL mutant passed");
  assert.match(wrong.stderr,/UNSAFE:/,"SQL mutant failed for wrong reason");
 }
 console.log("PASS published PostgreSQL constraints + two negative mutants");
}else console.log("NOT TESTED real PostgreSQL; PGDATABASE is required");
const http=extract("Steward milestone real HTTP team and nested permission proof — run against disposable API");
assert.equal(run("bash",["-n"],http).status,0,"Published HTTP script syntax failed");
assert.ok(!http.includes("\\$"+"{"),"Bash variables are incorrectly escaped");
for(const marker of ["TEAM_B_ACCESS_TOKEN","TEAM_A_NESTED_PATH","MILESTONE_REAL_HTTP_TEAM_BOUNDARIES_PASS"])
 assert.ok(http.includes(marker));
console.log("PASS signed HTTP probe syntax; real signed HTTP NOT TESTED without learner app");
assert.match(extract("Steward milestone handoff commands — inspect actual framework and database"),/connection\.vendor/);
console.log("PASS Steward milestone staged prerequisites and published source");