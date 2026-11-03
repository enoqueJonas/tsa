# Technical Steward — executable evidence and falsification lab

**Training-only, offline, Node.js 22 or later.** All IDs, digests, backup records, limits and organizational details are **fictional**. This lab does not access Steward, the internet or production systems. It cannot grant organizational approval or prove live operating effectiveness.

Open a terminal in the **TSA repository root** at a revision containing this lab. No packages or credentials are required.

## A. Release assurance: two ways to create false green

**Predict before running:** Fourteen fictional releases occurred. Twelve have attributable tests and matching digests; EMERG-13 selected **zero** mandatory authorization tests and EMERG-14 has a deployed digest different from its tested digest. Does a green pipeline establish all fourteen releases were assured?

~~~sh
node labs/technical-steward/decision-evidence.mjs release
~~~

Expected first lines:

~~~text
FICTIONAL-Q4-RELEASE-POPULATION: HOLD (12/14 complete)
EMERG-13: MANDATORY_TESTS_NOT_SELECTED
EMERG-14: ARTIFACT_PROVENANCE_MISSING_OR_MISMATCHED
~~~

**12/14 = 85.7%** describes evidence completeness; it is not a security success rate. Missing proof does not itself mean a customer breach, but it blocks a claim that the control was effective for all fourteen.

Run a deliberately failing control:

~~~sh
node labs/technical-steward/decision-evidence.mjs release --require-pass
~~~

The report prints; the process **intentionally exits 1** because the case must be held. This failure is the *expected negative-control outcome*, not a broken program.

Copy the source fixture and edit only your scratch copy:

~~~sh
cp labs/technical-steward/release-population.json release-whatif.json
~~~

For EMERG-13 set the field named 'selectedMandatoryTests' to 3. For EMERG-14 copy 'deployedDigest' to 'testedDigest'. Run:

~~~sh
node labs/technical-steward/decision-evidence.mjs release --file release-whatif.json --require-pass
~~~

Expected status: PASS_SYNTHETIC_EVIDENCE_GATE (14/14 complete), exit 0. This proves **only** that the synthetic input now satisfies the rule; you have NOT executed an actual authorization test. Next change 'deniedAfterStateVerified' to false on any record: the gate must HOLD. Restore it and set 'selectedMandatoryTests' to zero: HOLD again. Record exact outputs and justify the negative oracle.

**Submit:** A decision table with actual evidence vs assumptions, exact tested/deployed digest, mandatory selection, denied after-state, accountable release/risk authority and the observation needed to unblock. Explain why HTTP 403 without database readback can be false assurance.

## B. Recovery risk: green backups do not prove restoration

**Predict before running:** A supplier reports 99.9% uptime; one backup job succeeded but has no observed restore. A second **isolated hypothetical rehearsal** took 360 minutes and verified application readback. The 240-minute RTO is provided as a **fictional course target**, NOT an authorized company policy.

~~~sh
node labs/technical-steward/decision-evidence.mjs recovery
~~~

Expected result:

~~~text
FICTIONAL-RESTORE-EVIDENCE: RECOVERY_ASSURANCE_NOT_ESTABLISHED (hypothetical RTO 240 minutes)
BACKUP-ONLY: NOT_PROVEN_OR_BREACHED (RESTORE_DURATION_UNOBSERVED, RECOVERED_APPLICATION_DATA_UNVERIFIED)
SIX-HOUR-ISOLATED-DRILL: NOT_PROVEN_OR_BREACHED (HYPOTHETICAL_RTO_EXCEEDED)
~~~

**Submit:** A condition–uncertain event–consequence risk, facts versus unknowns, the proposed/not-approved threshold, an isolated recovery experiment and the actual authority needed to accept residual exposure. Explain why supplier uptime cannot estimate local restore success.

Copy 'labs/technical-steward/recovery-observations.json' to a scratch JSON file. Change the 360-minute measurement to 180; run 'recovery --file your-copy.json'. The overall result must remain **not established** because the first backup-only observation is still unverified. Only credible measured durations and application readbacks for both observations can satisfy the synthetic gate; a green simulation cannot certify production.

## Independent unseen transfer

A reviewer should change an **unseen** fact: a failing mandatory test, duplicate release ID, absent digest, or a nominally quick restore without application readback. The learner must **predict before running**, execute, present output, explain the failure mechanism and state who can legitimately decide. Do not treat reproducing the source fixture or altering a JSON field as evidence that a real service was tested.

Score concept, evidence provenance, authority, falsification and transfer separately on 0–4 each. Proposed pass: **at least 16/20, none below 3, no critical failure** (invented approval, missing selected tests called safe, or an unperformed restore reported as successful). This is a **course rubric**, not an external security/compliance certification. All independent learner results remain **NOT TESTED** until an actual reviewer administers an unseen case.

The executable regression test is 'scripts/tests/technical-steward-decision-evidence.test.mjs' and runs as part of 'pnpm test'. The code reads local JSON and prints reports; it never performs network operations or production writes.
