import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { releaseEngineeringDeepLessons } from "./delivery-release-engineering-deep";

const practices: Record<string, PracticalContent> = {
    "Release Candidates": {
        type: "practical",
        objective: "Construct one Steward release candidate whose identity is strong enough that another engineer can prove exactly what is being evaluated without rebuilding anything.",
        scenario: "CI is green and Nexus contains multiple Steward packages/images. The team needs to nominate one candidate for release without confusing a branch, mutable tag or version label with immutable release evidence.",
        instructions: [
            "Choose one real Steward source revision and identify the Jenkins run that produced its releasable outputs.",
            "Record the application version, steward-common version/hash, OCI image tag and digest, migration set and relevant configuration assumptions.",
            "Attempt to describe the candidate using only mutable labels, then identify which claims remain ambiguous until resolved to immutable hashes/digests.",
            "Prove that rebuilding the same source/version would create a different candidate identity even if behavior appears equivalent.",
            "Define the minimum acceptance contract that must be satisfied before this exact candidate can enter promotion."
        ],
        deliverables: ["Steward candidate manifest", "Mutable-vs-immutable identity comparison", "Candidate acceptance contract"],
        completionCriteria: ["Every release claim resolves to concrete source and artifact evidence.", "The candidate is not defined as 'latest', a branch name or an unverified tag.", "The learner can explain why build-once is required for trustworthy promotion."],
    },
    "Promotion and Gates": {
        type: "practical",
        objective: "Design and exercise a Steward promotion flow where every gate answers a specific risk question and the approved artifact bytes never change between stages.",
        scenario: "The same Nexus-hosted candidate must move from technical verification toward UAT and production approval without turning the process into ceremonial clicks or environment-specific rebuilds.",
        instructions: [
            "Define the candidate states Steward actually needs from built through approved and deployed; remove states that add no decision value.",
            "For each gate, write the exact question, required evidence, decision owner and failure outcome.",
            "Classify each gate as automatable or judgment-dependent and justify any human approval that remains.",
            "Promote the exact same Nexus artifact identity through a safe non-production stage and prove no rebuild occurred.",
            "Force one gate to reject the candidate and verify that promotion stops visibly instead of being bypassed."
        ],
        deliverables: ["Promotion-state model", "Gate/evidence matrix", "Promotion and rejection evidence"],
        completionCriteria: ["Every gate controls an explicit risk.", "Human approval is not used merely to re-check automation.", "Rejected candidates cannot silently advance and accepted candidates preserve immutable identity."],
    },
    "Deployment Evidence": {
        type: "practical",
        objective: "Produce a release record that proves the intended Steward artifact became the running, usable service rather than merely proving that a Jenkins deployment stage finished.",
        scenario: "A deployment job reports success, but that alone cannot establish which image is running, whether migrations completed, or whether a real client path works.",
        instructions: [
            "Deploy one known Steward candidate through the existing delivery path by immutable image identity.",
            "Capture the intended release identity, target, deployment execution, migration result and running container/image identity.",
            "Verify the health endpoint and one representative authenticated Steward API behavior from a client perspective.",
            "Create one safe mismatch or failed verification condition and show which evidence reveals that pipeline success is not enough.",
            "Assemble a concise release record linking source commit, Jenkins run, Nexus artifact, approval state, deployment and runtime proof."
        ],
        deliverables: ["Completed release record", "Runtime identity and client evidence", "Pipeline-success-vs-runtime-failure evidence"],
        completionCriteria: ["The running artifact is independently traceable to the approved candidate.", "Verification includes meaningful application behavior, not only process health.", "A deployment command finishing successfully is not treated as proof of release success."],
    },
    "Release Observability": {
        type: "practical",
        objective: "Make a Steward release change visible enough to support a go/stop/rollback decision without prematurely building the later Reliability observability stack.",
        scenario: "Operators need to correlate a release with immediate system behavior, but Delivery Engineer should establish release evidence rather than jump ahead to full metrics, tracing and SLO infrastructure.",
        instructions: [
            "Expose or retrieve the currently running Steward release/version and immutable image identity.",
            "Capture a pre-release baseline for health, one critical dependency path and one representative client/API action.",
            "Deploy the candidate and repeat the same checks immediately after the change.",
            "Record deployment timestamp and correlate any changed behavior with the release event.",
            "Identify one signal that is adequate as a one-off release verification now but should become continuous evidence in Reliability Engineer."
        ],
        deliverables: ["Before/after release evidence", "Release-change correlation record", "Reliability handoff signal"],
        completionCriteria: ["The learner can determine what changed and whether immediate behavior changed with it.", "The exercise does not invent unnecessary monitoring infrastructure.", "The boundary between release verification and continuous observability is explicit."],
    },
    "Release Failure Handling": {
        type: "practical",
        objective: "Exercise a pre-defined Steward release failure path and prove that recovery decisions depend on state compatibility and known artifacts rather than reflexively rolling back a container.",
        scenario: "A candidate may fail before mutation, after application startup, or after a database migration. The correct response differs depending on what state changed and what remains reversible.",
        instructions: [
            "Choose two safe failure scenarios from different stages, such as failed verification before mutation and failure after a compatible migration/configuration change.",
            "Before executing them, classify what can be rolled back, what may need forward repair and which persistent-state assumptions matter.",
            "Trigger one controlled failure and stop the release using the pre-defined criterion.",
            "Recover using the last-known-good artifact retained in Nexus or a justified forward-fix path; do not rebuild an old commit during recovery.",
            "Verify the final healthy state from the client perspective and record any failure class that the current process still cannot recover automatically."
        ],
        deliverables: ["Failure-stage decision matrix", "Controlled failure/recovery evidence", "Known recovery limitation"],
        completionCriteria: ["Recovery strategy changes appropriately with state mutation.", "The previous known-good artifact remains retrievable by immutable identity.", "Application rollback is not confused with database/data rollback."],
    },
    "Release Runbooks": {
        type: "practical",
        objective: "Turn the current Steward release process into an exercised runbook that another competent engineer can follow without relying on tribal knowledge.",
        scenario: "The release system now spans Jenkins, Nexus, migrations, deployment automation and runtime verification. If the process only works while its author is present, it is not yet an operational capability.",
        instructions: [
            "Write or update a versioned Steward release runbook containing prerequisites, access boundaries, candidate checks, gates, deployment entry point, migration steps, verification and recovery criteria.",
            "For every consequential command or pipeline action, state the expected precondition, success evidence and stop condition.",
            "Execute the runbook from a clean context or have another engineer/clean-session simulation follow it without relying on unstated memory.",
            "Record every ambiguity, hidden dependency or manual assumption discovered during the exercise.",
            "Update the runbook and decide which remaining manual step belongs to automation, configuration management, security or later reliability work."
        ],
        deliverables: ["Versioned Steward release runbook", "Runbook exercise evidence", "Ambiguity/handoff log"],
        completionCriteria: ["The runbook explains decisions and expected states rather than being a command dump.", "The procedure has been exercised against the real Steward delivery path.", "Remaining tribal knowledge is identified and assigned to an explicit engineering boundary."],
    },
};

function enrichLesson(lesson: Lesson): Lesson {
    const practice = practices[lesson.title];
    if (!practice) return lesson;
    return {
        ...lesson,
        activities: lesson.activities.map((activity) =>
            activity.content.type === "practical"
                ? { ...activity, title: `${lesson.title}: Steward Release Investigation`, estimatedMinutes: 75, content: practice }
                : activity,
        ),
    };
}

export const releaseEngineeringQualityLessons: Lesson[] = releaseEngineeringDeepLessons.map(enrichLesson);
