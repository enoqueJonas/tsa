/**
 * Technical Steward PED-005: executable, self-contained *fictional* evidence lab.
 *
 * From the repository root (Node 22+):
 *   node labs/technical-steward/decision-evidence.mjs release
 *   node labs/technical-steward/decision-evidence.mjs recovery
 *   node labs/technical-steward/decision-evidence.mjs release --require-pass
 *
 * The final command intentionally exits 1 on the negative fixture.
 * Neither case is production evidence or an approved risk tolerance.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

function isDigest(value) {
  return typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value);
}

export function assessReleases(packet) {
  if (!packet || !Array.isArray(packet.releases) || !packet.releases.length) {
    throw new Error("Expected a nonempty releases array; an empty population cannot be approved.");
  }
  const observed = new Set();
  const findings = [];
  let evidenced = 0;
  for (const release of packet.releases) {
    if (typeof release.id !== "string" || !release.id || observed.has(release.id)) {
      throw new Error("Release population contains missing or duplicate IDs.");
    }
    observed.add(release.id);
    const reasons = [];
    if (!isDigest(release.deployedDigest) || !isDigest(release.testedDigest) ||
        release.deployedDigest !== release.testedDigest) {
      reasons.push("ARTIFACT_PROVENANCE_MISSING_OR_MISMATCHED");
    }
    if (!Number.isInteger(release.selectedMandatoryTests) || release.selectedMandatoryTests < 1) {
      reasons.push("MANDATORY_TESTS_NOT_SELECTED");
    }
    if (!Number.isInteger(release.failedMandatoryTests) || release.failedMandatoryTests < 0) {
      reasons.push("MANDATORY_TEST_RESULT_UNKNOWN");
    } else if (release.failedMandatoryTests > 0) {
      reasons.push("MANDATORY_TEST_FAILED");
    }
    if (typeof release.testRunId !== "string" || !release.testRunId.trim()) {
      reasons.push("MANDATORY_TEST_RUN_PROVENANCE_MISSING");
    }
    if (typeof release.deniedStateEvidenceId !== "string" || !release.deniedStateEvidenceId.trim()) {
      reasons.push("DENIED_AFTER_STATE_EVIDENCE_MISSING");
    }
    if (typeof release.observedAt !== "string" || !/^\\d{4}-\\d{2}-\\d{2}T/.test(release.observedAt)
      || !Number.isFinite(Date.parse(release.observedAt))) {
      reasons.push("EVIDENCE_TIMESTAMP_MISSING_OR_INVALID");
    }
    if (release.deniedAfterStateVerified !== true) {
      reasons.push("DENIED_AFTER_STATE_UNVERIFIED");
    }
    if (!reasons.length) evidenced++;
    else findings.push({ release: release.id, reasons });
  }
  return {
    caseId: packet.caseId,
    population: packet.releases.length,
    evidenced,
    coveragePercent: Number((100 * evidenced / packet.releases.length).toFixed(1)),
    verdict: findings.length ? "HOLD" : "PASS_SYNTHETIC_EVIDENCE_GATE",
    findings,
    limitations: [
      "A PASS only evaluates fields in this fictional dataset; invented testRunId and evidence IDs are NOT verified source documents, live security tests or production approval.",
      "Missing evidence is not proof of a failure event and cannot be counted as a passing control.",
    ],
  };
}

export function assessRecovery(packet) {
  if (!packet || !Array.isArray(packet.observations) || !packet.observations.length) {
    throw new Error("Expected a nonempty recovery observations array.");
  }
  if (!Number.isInteger(packet.hypotheticalRtoMinutes) || packet.hypotheticalRtoMinutes < 1) {
    throw new Error("Supply a positive, explicitly hypothetical RTO for this exercise.");
  }
  const findings = packet.observations.map((observation) => {
    const reasons = [];
    if (!Number.isFinite(observation.measuredRestoreMinutes) || observation.measuredRestoreMinutes < 0) {
      reasons.push("RESTORE_DURATION_UNOBSERVED");
    }
    if (observation.applicationReadbackVerified !== true) {
      reasons.push("RECOVERED_APPLICATION_DATA_UNVERIFIED");
    }
    if (!reasons.length && observation.measuredRestoreMinutes > packet.hypotheticalRtoMinutes) {
      reasons.push("HYPOTHETICAL_RTO_EXCEEDED");
    }
    return {
      observation: observation.id,
      verdict: reasons.length ? "NOT_PROVEN_OR_BREACHED" : "MEETS_HYPOTHETICAL_TARGET",
      reasons,
    };
  });
  return {
    caseId: packet.caseId,
    hypotheticalRtoMinutes: packet.hypotheticalRtoMinutes,
    verdict: findings.every((item) => item.verdict === "MEETS_HYPOTHETICAL_TARGET")
      ? "ALL_REHEARSALS_MEET_SIMULATED_TARGET"
      : "RECOVERY_ASSURANCE_NOT_ESTABLISHED",
    findings,
    limitations: [
      "The four-hour RTO is fictional and NOT enterprise-approved.",
      "Backup-job completion and supplier uptime cannot establish customer/application recovery.",
    ],
  };
}

export function loadFixture(kind) {
  const file = kind === "release" ? "release-population.json"
    : kind === "recovery" ? "recovery-observations.json" : null;
  if (!file) throw new Error("Usage: node labs/technical-steward/decision-evidence.mjs release|recovery [--file input.json] [--require-pass]");
  return JSON.parse(readFileSync(resolve(here, file), "utf8"));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const kind = process.argv[2];
    // --file enables learner-controlled counterfactuals without modifying
    // the authoritative examples. All input remains local and offline.
    const fileFlag = process.argv.indexOf("--file");
    const inputPath = fileFlag === -1 ? null : process.argv[fileFlag + 1];
    if (fileFlag !== -1 && (!inputPath || inputPath.startsWith("--"))) {
      throw new Error("--file requires a local JSON filename.");
    }
    const packet = inputPath
      ? JSON.parse(readFileSync(resolve(process.cwd(), inputPath), "utf8"))
      : loadFixture(kind);
    const report = kind === "release" ? assessReleases(packet) : assessRecovery(packet);
    const unit = kind === "release" ? report.evidenced + "/" + report.population + " complete" :
      "hypothetical RTO " + report.hypotheticalRtoMinutes + " minutes";
    console.log(report.caseId + ": " + report.verdict + " (" + unit + ")");
    for (const finding of report.findings) {
      if (kind === "release") console.log(finding.release + ": " + finding.reasons.join(", "));
      else console.log(finding.observation + ": " + finding.verdict + " (" + (finding.reasons.join(", ") || "verified") + ")");
    }
    for (const limit of report.limitations) console.log("LIMIT: " + limit);
    if (process.argv.includes("--require-pass") &&
        !(kind === "release" ? report.verdict === "PASS_SYNTHETIC_EVIDENCE_GATE" :
          report.verdict === "ALL_REHEARSALS_MEET_SIMULATED_TARGET")) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
