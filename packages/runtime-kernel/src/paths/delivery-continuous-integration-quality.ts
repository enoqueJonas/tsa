import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { continuousIntegrationDeepLessons } from "./delivery-continuous-integration-deep";

const practices: Record<string, PracticalContent> = {
    "CI Pipeline Architecture": {
        type: "practical",
        objective: "Design Steward's CI as an evidence-producing feedback system before writing Jenkins syntax.",
        scenario: "Steward now has a reproducible container build, but source integration still depends on engineers manually deciding which commands to run and whether a change is safe to merge.",
        instructions: [
            "Draw the current commit-to-image path and mark each manual validation step.",
            "For each proposed CI stage, write the risk question it must answer.",
            "Separate validation/build responsibilities from deployment responsibilities.",
            "Define which failures must stop artifact production.",
            "Define the minimum evidence another engineer must see without rerunning the job locally.",
            "Produce a first Jenkins pipeline graph without yet optimizing it for syntax or parallelism."
        ],
        deliverables: ["Steward CI risk/evidence map", "Stage dependency graph", "Fail-closed rules"],
        completionCriteria: ["Every stage answers a stated risk question.", "Deployment is outside CI scope.", "Artifact production is blocked by failed required evidence."],
    },
    "Jobs, Stages and Dependencies": {
        type: "practical",
        objective: "Turn Steward's validation work into a dependency graph that fails close to the fault and parallelizes only independent work.",
        scenario: "The first pipeline draft runs every check sequentially, making feedback slow and hiding which checks are genuinely dependent.",
        instructions: [
            "Inventory lint/static checks, unit tests, integration tests and image build steps.",
            "Classify each step as independent, prerequisite or consumer of an earlier artifact.",
            "Create the Jenkins stage/job dependency graph.",
            "Identify at least two checks that can run in parallel and one that must remain ordered.",
            "Introduce one controlled check failure and predict exactly which downstream work should not run."
        ],
        deliverables: ["Dependency graph", "Parallelism decision", "Failure-propagation expectation"],
        completionCriteria: ["Ordering reflects real dependencies rather than visual preference.", "Independent feedback is not serialized unnecessarily.", "A failed prerequisite blocks only the work that depends on it."],
    },
    "Runners and Agents": {
        type: "practical",
        objective: "Design a Jenkins controller/agent execution model for the Rocky Linux homelab with explicit trust, capacity and cleanup boundaries.",
        scenario: "Jenkins needs somewhere to execute Steward builds, but allowing the controller or a general-purpose server to run arbitrary build workloads would blur privilege and failure boundaries.",
        instructions: [
            "Choose where the Jenkins controller and first agent will run in the homelab and justify the placement.",
            "Record CPU, RAM, storage and network requirements for the agent.",
            "Define the dedicated service identity and filesystem/workspace ownership.",
            "List which internal resources the agent must reach and which it must not reach.",
            "Define workspace cleanup and rebuild expectations so jobs do not depend on residue.",
            "Identify the consequence of granting Docker access to the agent account."
        ],
        deliverables: ["Controller/agent topology", "Agent privilege matrix", "Capacity and cleanup plan"],
        completionCriteria: ["Controller and build execution responsibilities are distinguishable.", "Agent privileges are no broader than required.", "Persistent workspace state is not part of the build contract."],
    },
    "GitHub Actions and Jenkins": {
        type: "practical",
        objective: "Implement Jenkins as TSA's primary CI platform while comparing GitHub Actions as an alternative operating model rather than duplicating the same pipeline.",
        scenario: "Both platforms can orchestrate CI. The enterprise path requires one implementation that teaches self-hosted CI operations and one comparison that teaches portability of concepts.",
        instructions: [
            "Map trigger, agent, stage, artifact, credential and log concepts between Jenkins and GitHub Actions.",
            "Choose Jenkins as the implementation platform for Steward and state why that fits the enterprise learning objective.",
            "Write a minimal Jenkinsfile skeleton for checkout -> checks -> test -> image build.",
            "Describe how the same semantic stages would map to GitHub Actions without implementing a duplicate production pipeline.",
            "Record which responsibilities Jenkins ownership adds: controller/agent lifecycle, plugins, upgrades, backups, credentials and capacity."
        ],
        deliverables: ["Jenkins-first implementation decision", "Jenkinsfile skeleton", "Jenkins/GitHub Actions concept mapping"],
        completionCriteria: ["Jenkins is the actual Steward CI implementation.", "GitHub Actions is understood as an alternative, not a second mandatory pipeline.", "Operational ownership differences are explicit."],
    },
    "Self-hosted Runners": {
        type: "practical",
        objective: "Provision a dedicated Jenkins agent path into the Steward homelab without turning CI into unrestricted administration infrastructure.",
        scenario: "The build agent needs source access, Docker build capability and later access to Nexus, but it should not inherit general WireGuard/SSH administrator authority.",
        instructions: [
            "Create or plan a dedicated Jenkins agent identity on Rocky Linux.",
            "Define how the agent connects to the Jenkins controller and how that path is restricted.",
            "Record required filesystem, Docker and network permissions.",
            "Prove or design that ordinary build work cannot use the administrator SSH identity.",
            "Define patching, workspace cleanup, disk monitoring and agent replacement procedures."
        ],
        deliverables: ["Agent identity/configuration", "Required-access matrix", "Agent lifecycle runbook"],
        completionCriteria: ["CI execution has its own identity.", "Administrative credentials are not reused by jobs.", "The agent can be replaced without relying on undocumented state."],
    },
    "Caching": {
        type: "practical",
        objective: "Add one Jenkins build cache only after proving that the uncached Steward pipeline is correct.",
        scenario: "Build time is increasing, but a cache that becomes an undeclared dependency would make the pipeline faster and less trustworthy at the same time.",
        instructions: [
            "Measure one clean Jenkins build without cache.",
            "Choose one safe cache candidate such as downloaded package dependencies.",
            "Define a cache key tied to lockfile/dependency state.",
            "Measure the cached path.",
            "Invalidate/remove the cache and prove the build still succeeds.",
            "Document the measured benefit and whether it justifies keeping the cache."
        ],
        deliverables: ["Cold-build evidence", "Cache-key design", "Warm-vs-cold comparison"],
        completionCriteria: ["Correctness does not depend on the cache.", "Cache invalidation follows dependency state.", "The optimization is supported by measurement."],
    },
    "Pipeline Artifacts": {
        type: "practical",
        objective: "Preserve Jenkins run evidence without confusing temporary CI artifacts with the durable release repository Nexus will provide later.",
        scenario: "A failed or successful build produces reports and image metadata that reviewers need, while deployable release artifacts will eventually need a shared durable repository.",
        instructions: [
            "Classify current outputs as cache, CI evidence artifact or future release artifact.",
            "Archive one useful test/build report in Jenkins.",
            "Attach commit SHA, build number and image identity to the run record.",
            "Define a retention period for CI evidence.",
            "Document which outputs should later move to Nexus and why Jenkins artifact retention is not the final artifact-platform design."
        ],
        deliverables: ["Artifact classification", "Archived Jenkins evidence", "Jenkins-to-Nexus handoff note"],
        completionCriteria: ["Cache, CI evidence and release repository responsibilities are distinct.", "Evidence is traceable to one run/source revision.", "Nexus has a concrete later requirement rather than being introduced as decorative infrastructure."],
    },
    "Secrets and Variables": {
        type: "practical",
        objective: "Give Jenkins only the configuration and credentials required for the current Steward build while preventing accidental secret propagation.",
        scenario: "The pipeline is about to gain registry and homelab credentials. A global environment variable available to every job would create unnecessary blast radius.",
        instructions: [
            "Inventory pipeline values and classify them as ordinary configuration or secrets.",
            "Create a least-privilege Jenkins credential requirement for one sensitive operation.",
            "Bind that credential only to the stage that needs it.",
            "Check logs and archived artifacts for accidental value exposure.",
            "Document rotation/revocation ownership and a future handoff to stronger secret management."
        ],
        deliverables: ["CI configuration classification", "Jenkins credential scope", "Leakage check and rotation note"],
        completionCriteria: ["Secrets are not global by default.", "Logs/artifacts do not intentionally contain secret values.", "Credential scope matches the required operation."],
    },
    "Parallelism": {
        type: "practical",
        objective: "Use Jenkins parallel stages only where measured feedback improves without saturating the homelab agent.",
        scenario: "Parallelizing every check increases CPU and memory contention on the learner-owned host and can make the overall pipeline slower.",
        instructions: [
            "Measure the current sequential feedback time for independent checks.",
            "Run a justified parallel version.",
            "Observe agent CPU, memory and queue/execution time.",
            "Compare wall-clock improvement against resource pressure.",
            "Set a concurrency rule appropriate to the current homelab capacity."
        ],
        deliverables: ["Sequential/parallel timing", "Agent resource observation", "Concurrency decision"],
        completionCriteria: ["Parallelism follows dependency independence.", "Capacity effects are measured.", "The chosen concurrency does not assume unlimited enterprise hardware."],
    },
    "Automated Checks": {
        type: "practical",
        objective: "Build a small Jenkins check set from actual Steward risks and remove any check whose signal cannot be defended.",
        scenario: "The pipeline is accumulating tools because they are common in CI, not because anyone can explain the risk each one controls.",
        instructions: [
            "List current Steward integration risks.",
            "Map formatting/linting, static checks, unit tests and build validation to those risks.",
            "Add only the checks whose failure should influence merge/build decisions now.",
            "Trigger one representative failure and inspect how actionable the Jenkins output is.",
            "Defer security/reliability gates whose interpretation belongs to later schools."
        ],
        deliverables: ["Risk-to-check map", "Jenkins check configuration", "Failure-signal evidence"],
        completionCriteria: ["Every mandatory check has a stated purpose.", "Failures are actionable.", "Later-school tools are not prematurely converted into meaningless gates."],
    },
    "Test Stages": {
        type: "practical",
        objective: "Order Steward tests by feedback cost and dependency depth while preserving enough evidence to diagnose CI-only failures.",
        scenario: "A slow database-backed test failure appears after several minutes even when a fast unit test could have rejected the change earlier.",
        instructions: [
            "Inventory tests by expected speed and external dependency needs.",
            "Create fast and dependency-bearing Jenkins stages.",
            "Make the expensive stage depend on the fast prerequisite where appropriate.",
            "Force one integration-stage failure and archive the useful logs/report.",
            "Verify an engineer can understand the failure before reproducing it locally."
        ],
        deliverables: ["Test-stage taxonomy", "Jenkins stage ordering", "Failure evidence artifact"],
        completionCriteria: ["Cheap feedback arrives before expensive feedback.", "Dependencies are explicit.", "CI-only failures leave reviewable evidence."],
    },
    "Quality Gates": {
        type: "practical",
        objective: "Define a small set of defensible Jenkins gates and prove that a failed gate blocks artifact production.",
        scenario: "A pipeline that always reaches the image stage creates artifacts even when required engineering evidence failed.",
        instructions: [
            "Choose the minimum current gates for Steward.",
            "For each gate, document the risk and pass/fail rule.",
            "Configure the Jenkins pipeline so the image stage depends on those gates.",
            "Create one controlled gate failure and prove no release-candidate image is produced.",
            "Define how an exceptional bypass would be approved and recorded rather than hidden."
        ],
        deliverables: ["Gate policy", "Blocked-artifact evidence", "Exception-record design"],
        completionCriteria: ["Gates are tied to known risks.", "Failure is fail-closed.", "Exceptions cannot become invisible normal behavior."],
    },
    "Building Containers in CI": {
        type: "practical",
        objective: "Use Jenkins to turn one validated Steward commit into one traceable container artifact without rebuilding different bytes for each environment.",
        scenario: "Container images are currently built manually on a developer machine, breaking the source-to-artifact chain established by Software Delivery Foundations.",
        instructions: [
            "Build the image only after required Jenkins checks pass.",
            "Tag the image with a commit-derived or release-candidate identity.",
            "Record the exact commit, Jenkins build number and resulting image ID/digest.",
            "Inspect the build for secret-bearing arguments or layers.",
            "Prove a failed required check prevents the image build.",
            "Record the future publish step that Nexus will satisfy, but do not use a laptop-only cache as the final shared repository."
        ],
        deliverables: ["Jenkins image-build stage", "Commit/build/image traceability", "Blocked-build proof", "Nexus publication handoff"],
        completionCriteria: ["Image creation follows successful required evidence.", "Exact image identity maps to exact source.", "The pipeline is ready for a durable shared registry without pretending one already exists."],
    },
};

const jenkinsLabPractice: PracticalContent = {
    type: "practical",
    objective: "Run a multi-stage Steward CI pipeline on learner-managed Jenkins infrastructure and prove successful and fail-closed behavior.",
    scenario: "Jenkins is TSA's primary enterprise CI implementation. Use GitHub Actions only as a conceptual comparison where useful; do not maintain duplicate mandatory pipelines for Steward.",
    instructions: [
        "Provision a Jenkins controller and at least one dedicated agent on the learner-managed Rocky Linux/homelab platform, documenting identities, network access, storage and maintenance ownership.",
        "Store the pipeline as a versioned Jenkinsfile in the Steward repository.",
        "Create separate source-check/test and container-build stages, using parallel branches only for genuinely independent checks.",
        "Ensure image creation depends on all required gates and does not run after a controlled failing check.",
        "Record commit SHA, Jenkins build number, image tag and immutable image ID/digest.",
        "Archive useful test/build evidence in Jenkins and define what later belongs in Nexus instead.",
        "Run once from a clean/cold-cache path to prove the job does not require accidental agent residue.",
        "Trigger a controlled failure, prove fail-closed behavior, then restore and rerun successfully.",
        "Document the remaining human handoff from successful image to deployment; that becomes input to Continuous Delivery and Deployment."
    ],
    deliverables: ["Versioned Jenkinsfile", "Jenkins controller/agent topology and privilege notes", "Successful pipeline evidence", "Blocked-pipeline evidence", "Commit -> Jenkins build -> image identity traceability", "Artifact/retention note", "CD handoff"],
    completionCriteria: ["Jenkins is the actual Steward CI implementation.", "A repository change can produce repeatable CI without developer-workstation build commands.", "Required checks fail closed.", "The image maps to an exact source revision and Jenkins run.", "The agent does not depend on undocumented residue or general administrator credentials.", "The learner can distinguish CI, Nexus artifact storage and later deployment responsibilities."],
};

function enrichLesson(lesson: Lesson): Lesson {
    if (lesson.id === "continuous-integration-lab") {
        return {
            ...lesson,
            activities: lesson.activities.map((activity) =>
                activity.id === "continuous-integration-lab-002"
                    ? { ...activity, title: "Build the Steward Jenkins CI Pipeline", content: jenkinsLabPractice }
                    : activity,
            ),
        };
    }

    const practice = practices[lesson.title];
    if (!practice) return lesson;

    return {
        ...lesson,
        activities: [
            ...lesson.activities,
            {
                id: `${lesson.id}-practice`,
                title: `${lesson.title}: Steward Engineering Practice`,
                estimatedMinutes: 60,
                content: practice,
            },
        ],
    };
}

export const continuousIntegrationQualityLessons: Lesson[] = continuousIntegrationDeepLessons.map(enrichLesson);
