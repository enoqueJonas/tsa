import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { continuousDeliveryDeploymentDeepLessons } from "./delivery-continuous-delivery-deep";

const practices: Record<string, PracticalContent> = {
    "CI versus Continuous Delivery versus Continuous Deployment": {
        type: "practical",
        objective: "Draw the actual Steward delivery control boundaries and decide which transitions should remain human-approved versus automatically executed.",
        scenario: "Steward now has a Jenkins CI pipeline that can validate source and build a traceable image. The next problem is deciding how that known artifact reaches the Rocky Linux homelab without turning every green build into an uncontrolled deployment.",
        instructions: [
            "Trace one real Steward change from commit through Jenkins checks and image creation to the currently running homelab release.",
            "Mark exactly where CI ends and where delivery/deployment begins.",
            "For every remaining human step, state whether it is mechanical execution or a genuine risk decision.",
            "Choose one transition that Jenkins should automate now and one approval that should remain explicit.",
            "Describe the evidence the approver would need before allowing promotion.",
        ],
        deliverables: ["Steward CI/CD control-boundary map", "Automation-versus-approval decision", "Required promotion evidence"],
        completionCriteria: ["CI, continuous delivery and continuous deployment are not treated as synonyms.", "Automation removes mechanics rather than judgment blindly.", "Every approval corresponds to a named risk question."],
    },
    "Environment Management": {
        type: "practical",
        objective: "Create an environment contract for Steward that keeps release identity immutable while making configuration, credentials, state and access differences explicit.",
        scenario: "The same Steward image should be deployable without rebuilding it for each target, but the Rocky homelab still has environment-specific database endpoints, volumes, secrets, DNS and access policy.",
        instructions: [
            "Inventory the current deployment target: host/VM, network path, DNS/name, application port, database endpoint, persistent storage and administrative route.",
            "Classify each value as release identity, ordinary runtime configuration, secret, persistent state or infrastructure property.",
            "Identify any value currently baked into the image that should move to runtime configuration.",
            "Define how Jenkins receives only the deployment inputs it needs without exposing backend/admin services publicly.",
            "Write the environment contract another engineer would need to deploy the same image correctly.",
        ],
        deliverables: ["Environment inventory", "Configuration/state classification", "Environment contract"],
        completionCriteria: ["The image remains identical across deployment targets.", "Secrets are not treated as ordinary repository configuration.", "The private-management and backend-only network boundaries remain intact."],
    },
    "Deployment Automation": {
        type: "practical",
        objective: "Turn Steward deployment into a Jenkins-orchestrated, versioned procedure that deploys a known image to the Rocky Linux homelab and fails visibly when preconditions or verification fail.",
        scenario: "A successful Jenkins build still leaves an engineer SSHing into the homelab and typing container commands manually. The release identity is known, but the deployment mechanics are not yet reproducible.",
        instructions: [
            "Document the current manual deployment sequence before changing it.",
            "Define preconditions: target reachable through the approved private path, required configuration present, previous release identifiable and candidate image available.",
            "Implement the smallest Jenkins deployment stage or versioned deployment script that performs image selection, target update and service start without rebuilding the artifact.",
            "Use a dedicated deployment identity rather than a general homelab administrator identity.",
            "Force one safe precondition or health-verification failure and prove the workflow stops non-zero instead of continuing.",
            "Compare the automated workflow with the original manual sequence and identify what remains intentionally outside it.",
        ],
        deliverables: ["Versioned deployment automation", "Dedicated deployment-identity note", "Successful execution evidence", "Fail-closed evidence"],
        completionCriteria: ["The artifact is selected, not rebuilt, during deployment.", "The deployment does not require undocumented interactive commands.", "Failure prevents the workflow from claiming success."],
    },
    "Release Approvals": {
        type: "practical",
        objective: "Design one evidence-based promotion gate for Steward and prove that approval refers to a fixed release candidate rather than a moving target.",
        scenario: "The team wants an approval button before deployment, but an approval with no defined question or immutable candidate would be ceremony rather than control.",
        instructions: [
            "Choose one real risk that merits human judgment in the current Steward release flow, such as a migration, accepted limitation or target-impact decision.",
            "Record the exact candidate identity the approval refers to: version, source commit and image digest/immutable identifier.",
            "Define the minimum evidence presented to the approver.",
            "Define what change to the candidate or evidence invalidates the approval and requires a new decision.",
            "Walk through one approve and one reject scenario and record the resulting pipeline behavior.",
        ],
        deliverables: ["Approval policy", "Candidate/evidence packet", "Approve/reject behavior record"],
        completionCriteria: ["The gate controls a named risk.", "Approval is bound to one immutable candidate.", "A rejected candidate cannot continue through an invisible bypass."],
    },
    "Database Migrations During Deployment": {
        type: "practical",
        objective: "Rehearse a Steward schema change as part of deployment and determine whether old and new application versions can safely coexist with the migration state.",
        scenario: "A new Steward release requires a Django migration. Container rollback is easy only if the previous application still understands the resulting schema.",
        instructions: [
            "Choose or create a safe representative Steward schema change in a non-production dataset.",
            "Record the pre-migration application and schema state.",
            "Apply the migration as an explicit deployment step and capture its result.",
            "Test the new application against the migrated schema and, where safe, test whether the previous application can still function against it.",
            "Classify the change as backward-compatible, forward-only or requiring a more deliberate transition.",
            "Write the deployment and recovery rule that follows from the evidence.",
        ],
        deliverables: ["Migration rehearsal evidence", "Compatibility result", "Deployment/recovery rule"],
        completionCriteria: ["Migration success is not inferred from container health alone.", "Application rollback and data/schema rollback are distinguished.", "The release decision follows observed compatibility."],
    },
    "Rollback": {
        type: "practical",
        objective: "Prove that Steward can return to a specifically identified known-good application release and document the state that rollback does not reverse.",
        scenario: "A deployment fails verification after the new container starts. Recovery must use known release identity and evidence rather than retagging or guessing which image was previously working.",
        instructions: [
            "Record the current known-good version, source commit and image digest/immutable image identifier.",
            "Deploy a safe candidate that fails a predefined verification condition.",
            "Execute the documented rollback path to the known-good image without rebuilding it.",
            "Verify image identity, health and one meaningful Steward API behavior after recovery.",
            "List persistent effects that were not reverted automatically, including database or external side effects where applicable.",
            "Decide whether the failure class is genuinely rollback-safe or should prefer a forward fix in future.",
        ],
        deliverables: ["Known-good identity", "Failure and rollback evidence", "Post-recovery verification", "Rollback-boundary decision"],
        completionCriteria: ["Recovery uses an immutable known-good release.", "Successful commands are not accepted without client-visible verification.", "Non-reversible state is explicitly acknowledged."],
    },
    "Rolling Deployments": {
        type: "practical",
        objective: "Evaluate whether rolling deployment solves a real Steward availability problem before adding replicas or rollout machinery.",
        scenario: "Rolling deployment is common in enterprise platforms, but the current budget homelab may still run a single Steward instance. Implementing fake scale would add ceremony without proving the prerequisites.",
        instructions: [
            "List the technical prerequisites for rolling deployment: multiple interchangeable instances, traffic distribution, health/readiness and version/schema coexistence.",
            "Compare those prerequisites with the current Steward homelab.",
            "Identify which prerequisite is currently missing or unjustified.",
            "Model a two-instance rollout and the failure that would require stopping it.",
            "Record an adopt/defer decision and the future trigger that would justify implementation.",
        ],
        deliverables: ["Prerequisite gap analysis", "Modeled rollout/failure path", "Adopt-or-defer decision"],
        completionCriteria: ["The pattern is understood from its operating requirements.", "The learner does not manufacture scale solely to demonstrate a fashionable technique.", "The decision includes a concrete future trigger."],
    },
    "Blue-Green Deployments": {
        type: "practical",
        objective: "Evaluate blue-green deployment against Steward's homelab capacity, routing model and shared-state constraints, then prove the traffic-switch concept without pretending shared data is duplicated safely.",
        scenario: "A second application environment could make release switching safer, but duplicate runtime capacity consumes budget and both environments may still share PostgreSQL or other state.",
        instructions: [
            "Sketch blue and green Steward application environments behind one logical entry point.",
            "Mark which dependencies would actually be duplicated and which would remain shared.",
            "Estimate the additional CPU/RAM/storage required on the current homelab.",
            "Demonstrate or model a reversible traffic switch between two harmless application endpoints/instances if resources permit.",
            "Explain how an incompatible database migration could defeat the apparent rollback advantage.",
            "Record whether the technique should be implemented now or deferred.",
        ],
        deliverables: ["Blue-green topology", "Capacity/shared-state analysis", "Traffic-switch evidence or model", "Decision"],
        completionCriteria: ["Routing and shared state are part of the analysis.", "Capacity cost is measured or estimated from the actual homelab.", "Blue-green is not presented as universal zero-risk rollback."],
    },
    "Canary Deployment Concepts": {
        type: "practical",
        objective: "Design a canary decision around measurable Steward signals and explain why implementation is deferred until traffic and observability can support the decision.",
        scenario: "The team proposes sending 5% of traffic to a new release, but Steward does not yet have production-like traffic volume or the reliability signals needed to judge the canary safely.",
        instructions: [
            "Define what population or traffic slice a Steward canary would expose.",
            "Choose three signals that could justify continue/stop decisions, including at least one service-health and one meaningful behavior signal.",
            "Define a promotion threshold and a stop condition conceptually.",
            "Identify what current observability or traffic limitation prevents trustworthy implementation.",
            "Write the Reliability Engineer handoff that would make the technique actionable later.",
        ],
        deliverables: ["Canary decision model", "Signal/threshold set", "Explicit defer rationale", "Reliability handoff"],
        completionCriteria: ["A canary is tied to measurable decisions rather than percentage routing alone.", "Current evidence limitations are acknowledged.", "Deferral has a clear capability trigger."],
    },
    "Feature Flag Concepts": {
        type: "practical",
        objective: "Model one Steward change whose deployment and activation could be separated with a temporary feature flag, including ownership and deletion criteria.",
        scenario: "A compatible Steward capability may be safer to deploy dark and activate later, but every flag creates another runtime branch that can become permanent debt.",
        instructions: [
            "Choose one plausible backward-compatible Steward behavior that could be deployed disabled.",
            "Define the flag's default, activation scope and configuration owner.",
            "List tests needed for both flag states while it exists.",
            "Define rollback/disable behavior if activation causes problems.",
            "Set an explicit removal condition and owner so the flag cannot become indefinite configuration debt.",
            "Decide whether the current feature actually warrants a flag or whether normal deployment is simpler.",
        ],
        deliverables: ["Flag lifecycle design", "Dual-state test/rollback plan", "Adopt-or-reject decision"],
        completionCriteria: ["Deployment and activation are clearly separated.", "Temporary ownership/removal is explicit.", "A feature flag is not introduced when simpler release behavior is sufficient."],
    },
};

function enrichLesson(lesson: Lesson): Lesson {
    const practice = practices[lesson.title];
    if (!practice) return lesson;
    return {
        ...lesson,
        activities: [
            ...lesson.activities,
            {
                id: `${lesson.id}-practice`,
                title: `${lesson.title}: Steward Delivery Investigation`,
                estimatedMinutes: 60,
                content: practice,
            },
        ],
    };
}

export const continuousDeliveryDeploymentQualityLessons: Lesson[] = continuousDeliveryDeploymentDeepLessons.map(enrichLesson);
