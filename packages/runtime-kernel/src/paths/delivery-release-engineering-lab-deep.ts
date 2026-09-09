import type { Lesson } from "./lesson";

export const releaseEngineeringLab: Lesson = {
    id: "release-engineering-steward-release-lab",
    title: "Lab: Execute a Steward Release",
    activities: [
        {
            id: "release-engineering-steward-release-lab-001",
            title: "Release Plan",
            estimatedMinutes: 45,
            content: {
                type: "practical",
                objective: "Define one Steward release as a controlled, traceable transition from immutable candidate to verified runtime.",
                scenario: "Use the delivery capabilities already built in this school. Do not create a fake release pipeline beside them; reconcile CI, Nexus, deployment automation and the homelab into one release path.",
                instructions: [
                    "Choose one real Steward source revision and assign an appropriate candidate version.",
                    "Record CI run, steward-common version/hash, Steward OCI digest, migrations and configuration assumptions.",
                    "Define the gates that must pass before production deployment and the question each gate answers.",
                    "Define explicit stop, rollback and forward-recovery criteria before executing the release.",
                    "Write or update the Steward release runbook with prerequisites, commands/pipeline entry points, verification and recovery steps.",
                ],
                deliverables: ["Release candidate record", "Gate matrix", "Release/rollback decision criteria", "Versioned release runbook"],
                completionCriteria: ["Candidate identity resolves to immutable artifacts.", "Every gate has a risk question and evidence.", "Rollback limitations caused by state or migrations are explicit."],
            },
        },
        {
            id: "release-engineering-steward-release-lab-002",
            title: "Promote, Deploy and Verify",
            estimatedMinutes: 180,
            content: {
                type: "practical",
                objective: "Promote and deploy the exact Steward candidate, then prove the intended release is serving correctly.",
                scenario: "The candidate has passed CI and is stored in Nexus. Promotion must reuse that artifact rather than rebuilding it for the target environment.",
                instructions: [
                    "Promote the candidate through the defined gates and preserve approval/evidence.",
                    "Deploy by immutable artifact identity using the existing automated delivery path.",
                    "Run migrations only according to the recorded release plan.",
                    "Capture deployment execution result, running artifact identity and health state.",
                    "Verify a representative Steward client/API path in addition to the health endpoint.",
                    "Produce a release record connecting source commit, CI run, artifacts, approval, target, deployment and runtime verification.",
                ],
                deliverables: ["Promotion evidence", "Deployment evidence", "Runtime/client verification", "Completed release record"],
                completionCriteria: ["No artifact is rebuilt during promotion.", "The running release can be traced back to source and Nexus identity.", "Verification proves application behavior, not only pipeline success."],
            },
        },
        {
            id: "release-engineering-steward-release-lab-003",
            title: "Fail a Release Deliberately",
            estimatedMinutes: 120,
            content: {
                type: "practical",
                objective: "Prove the release process can stop and recover safely when evidence says the release is unacceptable.",
                scenario: "Introduce a controlled release failure that is safe in the homelab, such as invalid runtime configuration, failed application verification or an unavailable dependency. Do not corrupt valuable persistent data merely to create drama.",
                instructions: [
                    "Choose a controlled failure and predict where the release process should detect it.",
                    "Execute the release until the failure is observed.",
                    "Capture the first trustworthy evidence that the release is unacceptable.",
                    "Apply the pre-defined stop/rollback/recovery decision rather than improvising a new one after failure.",
                    "Verify the last-known-good or repaired state from the client perspective.",
                    "Update the runbook if the exercise exposed an undocumented assumption.",
                ],
                deliverables: ["Failure evidence", "Recovery/rollback execution record", "Last-known-good verification", "Runbook correction if required"],
                completionCriteria: ["Failure is detected by evidence rather than intuition.", "Recovery uses a known artifact/state strategy.", "The final healthy state is independently verified."],
            },
        },
        {
            id: "release-engineering-steward-release-lab-004",
            title: "Release Engineering Review",
            estimatedMinutes: 30,
            content: {
                type: "reflection",
                prompt: "If you were absent for the next Steward release, could another engineer identify the candidate, decide whether it is promotable, deploy the exact approved artifact, verify it and recover from failure using only the repository, pipeline, Nexus and runbook evidence? Identify the weakest remaining dependency on your personal knowledge.\n\nWhich release signal do you currently have only as a one-off verification that Reliability Engineer should later turn into continuous operational evidence?",
                minimumCharacters: 250,
            },
        },
    ],
};
