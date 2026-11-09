import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

/** Run the EXACT original Docker Namespaces/Cgroups learner code on an
 * isolated CI runner. No Steward image, remote Docker daemon or production
 * infrastructure is implied. BusyBox must be pulled by the runner.
 */
const source=readFileSync("packages/runtime-kernel/src/paths/delivery-docker-operational-depth.ts","utf8");
const anchor='"Guided observable inspection with a disposable container"';
const start=source.indexOf(anchor);
assert.ok(start>=0,"Original Docker namespaces/cgroups learner block missing");
const match=source.slice(start).match(/"code": ("(?:\\.|[^"\\])*")/);
assert.ok(match,"Cannot extract exact learner Bash program");
const published=JSON.parse(match[1]);
assert.ok(published.includes("docker run --rm --name tsa-isolation-lab --memory=64m busybox:1.36"),"Missing real bounded memory fixture");
assert.ok(published.includes("docker rm -f tsa-pid-lab"),"Missing disposable long-lived container teardown");
const daemon=spawnSync("docker",["info","--format","{{.ServerVersion}}"],{encoding:"utf8",timeout:10000});
assert.ifError(daemon.error);assert.equal(daemon.status,0,"Docker daemon unavailable; do not claim execution: "+daemon.stderr);

// The original example explicitly uses a Linux cgroup-v2 memory.max file.
// Require the test environment to support the actual intended observation.
const cgroup=spawnSync("stat",["-fc","%T","/sys/fs/cgroup"],{encoding:"utf8",timeout:10000});
assert.equal(cgroup.status,0,cgroup.stderr);
assert.equal(cgroup.stdout.trim(),"cgroup2fs","This CI oracle is specifically for Linux cgroup v2; mark other platforms unverified");

function run(script) {
  try {
    return spawnSync("bash",["-e","-u","-o","pipefail","-c",script],{
      encoding:"utf8",timeout:90000,env:{...process.env,DOCKER_CLI_HINTS:"false"}
    });
  }finally{
    // The authored example only creates these two named, disposable lab
    // containers; a mutation might exit before its normal cleanup step.
    spawnSync("docker",["rm","-f","tsa-pid-lab","tsa-isolation-lab"],{encoding:"utf8",timeout:10000});
  }
}
function evidence(output) {
  const lines=output.split(/\r?\n/).map(s=>s.trim());
  return {
    pidLine:lines.find(s=>/^container PID=\d+$/.test(s)) ?? null,
    memoryLine:lines.find(s=>/^(?:max|\d{6,})$/.test(s)) ?? null,
    output,
  };
}

const success=run(published);
assert.ifError(success.error);
assert.equal(success.status,0,"Published Docker example failed:\n"+success.stdout+"\n"+success.stderr);
const observed=evidence(success.stdout);
assert.ok(observed.pidLine,"No container PID evidence in learner output");
assert.equal(observed.memoryLine,"67108864","Real cgroup memory.max does not match declared 64 MiB limit");
assert.match(success.stdout,/\n\d{2,}\n/,"Host PID not inspected for detached container");
console.log("PASS exact authored Docker: daemon reachable, process observed, 64 MiB cgroup-v2 memory limit, host PID, cleanup");

const wrongLimit=published.replace("--memory=64m","--memory=128m");
assert.notEqual(wrongLimit,published,"Could not mutate source memory limit");
const wrong=run(wrongLimit);
assert.equal(wrong.status,0,"Wrong 128 MiB configuration should still run; a green shell code is an insufficient oracle");
const wrongObservation=evidence(wrong.stdout);
assert.equal(wrongObservation.memoryLine,"134217728","Mutated cgroup memory limit did not change as expected");
assert.notEqual(wrongObservation.memoryLine,"67108864","Wrong runtime limit should fail the original 64 MiB acceptance");
console.log("PASS unsafe green but 128 MiB runtime limit caught by independent cgroup oracle");

const unbounded=published.replace("--memory=64m","--memory=0");
assert.notEqual(unbounded,published,"Cannot remove source memory limit");
const noLimit=run(unbounded);
assert.equal(noLimit.status,0,"Unbounded container should run and expose an incorrect environment");
assert.notEqual(evidence(noLimit.stdout).memoryLine,"67108864","Unbounded memory variant unexpectedly looks like the required limit");
console.log("PASS unbounded container cannot masquerade as a proven 64 MiB limit");

const missingContainer=published.replace("docker inspect --format '{{.State.Pid}}' tsa-pid-lab","docker inspect --format '{{.State.Pid}}' tsa-not-the-lab");
assert.notEqual(missingContainer,published,"Missing-container mutation never applied");
const badInspect=run(missingContainer);
assert.notEqual(badInspect.status,0,"Wrong container inspect must produce nonzero, not fake PID observation");
assert.match(badInspect.stderr,/No such object|No such container|Error response from daemon/i,"Unexpected wrong-container failure");
console.log("PASS inspection of wrong container rejects evidence and cleans up");
