import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { assessReleases, assessRecovery, loadFixture } from "../../labs/technical-steward/decision-evidence.mjs";

const runner = fileURLToPath(new URL("../../labs/technical-steward/decision-evidence.mjs", import.meta.url));
const clone = (value) => JSON.parse(JSON.stringify(value));

test("fictional 14-deployment population must HOLD on two independently defective emergency releases", () => {
  const report = assessReleases(loadFixture("release"));
  assert.equal(report.population, 14);
  assert.equal(report.evidenced, 12);
  assert.equal(report.coveragePercent, 85.7);
  assert.equal(report.verdict, "HOLD");
  assert.deepEqual(report.findings.map((f) => f.release), ["EMERG-13", "EMERG-14"]);
  assert.deepEqual(report.findings[0].reasons, ["MANDATORY_TESTS_NOT_SELECTED"]);
  assert.deepEqual(report.findings[1].reasons, ["ARTIFACT_PROVENANCE_MISSING_OR_MISMATCHED"]);
});

test("passing an exact digest does not disguise zero selected tests or a failing negative oracle", () => {
  const packet = clone(loadFixture("release"));
  packet.releases[12].selectedMandatoryTests = 3;
  packet.releases[13].testedDigest = packet.releases[13].deployedDigest;
  assert.equal(assessReleases(packet).verdict, "PASS_SYNTHETIC_EVIDENCE_GATE");
  packet.releases[0].deniedAfterStateVerified = false;
  assert.deepEqual(assessReleases(packet).findings[0].reasons, ["DENIED_AFTER_STATE_UNVERIFIED"]);
  packet.releases[0].deniedAfterStateVerified = true;
  packet.releases[0].failedMandatoryTests = 1;
  assert.deepEqual(assessReleases(packet).findings[0].reasons, ["MANDATORY_TEST_FAILED"]);
  packet.releases[0].failedMandatoryTests = 0;
  packet.releases[0].selectedMandatoryTests = 0;
  assert.deepEqual(assessReleases(packet).findings[0].reasons, ["MANDATORY_TESTS_NOT_SELECTED"]);
});

test("empty or duplicate release population cannot pass by a vacuous success ratio", () => {
  assert.throws(() => assessReleases({ releases: [] }), /nonempty/);
  const packet = clone(loadFixture("release"));
  packet.releases[1].id = packet.releases[0].id;
  assert.throws(() => assessReleases(packet), /duplicate/);
});

test("a bare true after-state flag without test provenance is rejected", () => {
  const packet = clone(loadFixture("release"));
  packet.releases[12].selectedMandatoryTests = 3;
  packet.releases[13].testedDigest = packet.releases[13].deployedDigest;
  assert.equal(assessReleases(packet).verdict, "PASS_SYNTHETIC_EVIDENCE_GATE");
  packet.releases[0].testRunId = "";
  assert.deepEqual(assessReleases(packet).findings[0].reasons, ["MANDATORY_TEST_RUN_PROVENANCE_MISSING"]);
  packet.releases[0].testRunId = "SYNTHETIC-CI-RUN-001";
  packet.releases[0].deniedStateEvidenceId = "";
  assert.deepEqual(assessReleases(packet).findings[0].reasons, ["DENIED_AFTER_STATE_EVIDENCE_MISSING"]);
  packet.releases[0].deniedStateEvidenceId = "SYNTHETIC-STATE-CHECK-001";
  packet.releases[0].observedAt = "not-a-timestamp";
  assert.deepEqual(assessReleases(packet).findings[0].reasons, ["EVIDENCE_TIMESTAMP_MISSING_OR_INVALID"]);
});

test("the --file what-if route can actually run a modified scratch fixture and reject a false-green mutation", () => {
  const dir = mkdtempSync(join(tmpdir(), "tsa-steward-evidence-"));
  try {
    const packet = clone(loadFixture("release"));
    packet.releases[12].selectedMandatoryTests = 3;
    packet.releases[13].testedDigest = packet.releases[13].deployedDigest;
    const file = join(dir, "what-if.json");
    writeFileSync(file, JSON.stringify(packet));
    const passing = spawnSync(process.execPath, [runner, "release", "--file", file, "--require-pass"], {encoding:"utf8"});
    assert.equal(passing.status, 0, passing.stderr);
    assert.match(passing.stdout, /PASS_SYNTHETIC_EVIDENCE_GATE \(14\/14 complete\)/);
    packet.releases[0].deniedAfterStateVerified = false;
    writeFileSync(file, JSON.stringify(packet));
    const failing = spawnSync(process.execPath, [runner, "release", "--file", file, "--require-pass"], {encoding:"utf8"});
    assert.equal(failing.status, 1, failing.stderr);
    assert.match(failing.stdout, /DENIED_AFTER_STATE_UNVERIFIED/);
  } finally {
    rmSync(dir, {recursive:true,force:true});
  }
});

test("backup success and supplier uptime do not prove recovery against an unapproved RTO", () => {
  const report = assessRecovery(loadFixture("recovery"));
  assert.equal(report.verdict, "RECOVERY_ASSURANCE_NOT_ESTABLISHED");
  assert.equal(report.hypotheticalRtoMinutes, 240);
  assert.deepEqual(report.findings[0].reasons, [
    "RESTORE_DURATION_UNOBSERVED", "RECOVERED_APPLICATION_DATA_UNVERIFIED"
  ]);
  assert.deepEqual(report.findings[1].reasons, ["HYPOTHETICAL_RTO_EXCEEDED"]);
  assert.match(report.limitations.join(" "), /NOT enterprise-approved/);
});

test("restoration needs both measured time and actual application readback", () => {
  const packet = clone(loadFixture("recovery"));
  for (const item of packet.observations) {
    item.measuredRestoreMinutes = 180;
    item.applicationReadbackVerified = true;
  }
  assert.equal(assessRecovery(packet).verdict, "ALL_REHEARSALS_MEET_SIMULATED_TARGET");
  packet.observations[0].applicationReadbackVerified = false;
  assert.equal(assessRecovery(packet).verdict, "RECOVERY_ASSURANCE_NOT_ESTABLISHED");
});

test("documented commands execute and the --require-pass negative control exits nonzero", () => {
  const good = spawnSync(process.execPath, [runner, "release"], {encoding:"utf8"});
  assert.equal(good.status, 0, good.stderr);
  assert.match(good.stdout, /HOLD \(12\/14 complete\)/);
  const negative = spawnSync(process.execPath, [runner, "release", "--require-pass"], {encoding:"utf8"});
  assert.equal(negative.status, 1, negative.stderr);
  const recovery = spawnSync(process.execPath, [runner, "recovery"], {encoding:"utf8"});
  assert.equal(recovery.status, 0, recovery.stderr);
  assert.match(recovery.stdout, /RECOVERY_ASSURANCE_NOT_ESTABLISHED/);
});
