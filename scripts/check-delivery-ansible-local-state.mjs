import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

/**
 * Execute THE learner-published Ansible role script from the original Roles
 * reading. This is a real localhost-only file module test, not real SSH,
 * Rocky Linux, production service, or student performance evidence.
 */
const sourcePath = "packages/runtime-kernel/src/paths/delivery-configuration-management-deep.ts";
const source = readFileSync(sourcePath, "utf8");
const anchor = 'caption: "Local role creation, first convergence, repeat and controlled drift;';
const offset = source.indexOf(anchor);
assert.ok(offset >= 0, "Original learner-facing Roles code block missing");
const codeMatch = source.slice(offset).match(/code: ("(?:\\.|[^"\\])*")/);
assert.ok(codeMatch, "Could not extract exact published code as a TypeScript string");
const published = JSON.parse(codeMatch[1]);
assert.ok(published.includes("ansible_connection=local"), "Never run source proof against a remote host");
assert.ok(published.includes("ansible.builtin.file:"), "Actual idempotent state-aware Ansible module absent");
assert.ok(published.includes("--check"), "Missing check-mode proof in source lesson");
assert.ok(published.includes("test ! -e lab-state"), "Check mode must preserve absence of resource");
assert.ok(!published.includes("become: true"), "Source fixture must remain unprivileged");
assert.ok(published.includes("rmdir lab-state"), "Controlled drift setup missing");
const ansible = spawnSync("ansible-playbook", ["--version"], {encoding:"utf8", timeout:10000});
assert.ifError(ansible.error);
assert.equal(ansible.status, 0, "Ansible control node not installed: "+ansible.stderr);

function execute(code, name) {
  const temporary = mkdtempSync(join(tmpdir(), "tsa-ansible-proof-"));
  try {
    const run = spawnSync("bash", ["-e", "-u", "-o", "pipefail", "-c", code], {
      cwd:temporary, encoding:"utf8", timeout:90000,
      env:{...process.env, ANSIBLE_NOCOLOR:"1", ANSIBLE_RETRY_FILES_ENABLED:"False",
        ANSIBLE_LOCAL_TEMP:join(temporary,".ansible-tmp")},
    });
    assert.ifError(run.error);
    const labState=join(temporary, "tsa-ansible-role", "lab-state");
    const mode = existsSync(labState) ? (statSync(labState).mode & 0o777) : null;
    return {status:run.status,stdout:run.stdout,stderr:run.stderr,mode,exists:existsSync(labState)};
  } finally {
    rmSync(temporary, {recursive:true, force:true});
  }
}
const good=execute(published, "published");
assert.equal(good.status,0,"Original learner source failed: "+good.stdout+"\n"+good.stderr);
const recap=[...good.stdout.matchAll(/localhost\s*:\s*ok=\d+\s+changed=(\d+)/g)].map(m=>Number(m[1]));
assert.deepEqual(recap, [1,0,1,1],
  "Expected actual first-run change, clean second run, check-mode DRIFT PREDICTION, actual repaired third run");
assert.equal(good.mode,0o755,"Final state must match declared 0755 mode");
assert.equal(good.exists,true,"Published role failed to restore removed test directory");
console.log("PASS published Ansible localhost role: first changed=1, repeat changed=0, check predicts changed=1 without mutation, repair changed=1, final mode 0755");

const unsafeCheck = published.replace(
  "ansible-playbook -i inventory.ini site.yml --check",
  "ansible-playbook -i inventory.ini site.yml");
assert.notEqual(unsafeCheck,published,"Did not apply check-mode-removal mutation");
const badCheck=execute(unsafeCheck,"unsafe-check");
assert.notEqual(badCheck.status,0,"Mutant unexpectedly passes despite check mode doing a REAL mutation");
assert.match(badCheck.stdout + badCheck.stderr, /changed=1/,"Check-mode mutant never reached the mutation boundary");
console.log("PASS unsafe omitted --check mutant rejected by published absence assertion");

const unsafeMode=published.replace('mode: "0755"','mode: "0777"');
assert.notEqual(unsafeMode,published,"Could not mutate published desired permission");
const badMode=execute(unsafeMode,"unsafe-mode");
assert.equal(badMode.status,0,"Mode mutant should run, proving a green run is not enough");
assert.equal(badMode.mode,0o777,"Mutated Ansible policy should create dangerous 0777 directory");
assert.notEqual(badMode.mode,0o755,"Wrong desired policy must be rejected by independent file-mode oracle");
console.log("PASS unsafe green but world-writable directory exposed by independent mode check");

const unsafeModule=published.replace("ansible.builtin.file:", "ansible.builtin.not_a_real_file_module:");
assert.notEqual(unsafeModule,published,"Failed to mutate module name");
const badModule=execute(unsafeModule,"unknown-module");
assert.notEqual(badModule.status,0,"Invalid Ansible module must fail nonzero rather than simulate successful state");
assert.equal(badModule.exists,false,"Unknown-module mutation must not create the desired state");
console.log("PASS invalid resource module fails closed without creating state");
