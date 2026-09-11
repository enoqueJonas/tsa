import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { failureModesDeepLessons } from "./system-thinker-failure-modes-deep";

const practices: Record<string, PracticalContent> = {
    "Thinking in Failure Modes": {
        type: "practical",
        objective: "Build and prioritize a small failure portfolio for critical Steward capabilities using cause, system behavior, impact, detectability and blast radius.",
        scenario: "A design review has a long list of things that could go wrong with Steward, but the list mixes triggers, symptoms and consequences. The team needs a smaller evidence-backed set of failure modes that deserves attention now.",
        instructions: [
            "Choose three critical Steward capabilities from the requirements and flow artifacts.",
            "For each capability, separate triggering condition, system failure mode and user or operational effect.",
            "Score each scenario qualitatively for impact, detectability, duration and blast radius.",
            "Identify the current detection signal and expected way the failure would first become visible.",
            "Classify existing controls as prevention, detection, containment or recovery rather than grouping all controls as mitigation.",
            "Select one scenario as the current priority and defend why another plausible scenario is lower priority.",
        ],
        deliverables: ["Prioritized failure-mode table", "Cause -> behavior -> impact trace for each scenario", "Control classification and prioritization note"],
        completionCriteria: ["Causes are not confused with failure modes or impacts.", "Prioritization uses consequence and detectability rather than imagination alone.", "At least one lower-priority failure is explicitly rejected or deferred with reasoning."],
    },
    "Dependency Failure": {
        type: "practical",
        objective: "Define failure semantics for one authoritative and one non-authoritative Steward dependency, including timeout, retry, degradation and cascade behavior.",
        scenario: "Steward depends on systems with different authority levels. A generic 'retry on failure' rule would make some incidents worse and could allow correctness decisions to continue without trustworthy evidence.",
        instructions: [
            "Use PostgreSQL as the authoritative dependency and choose one non-authoritative current or plausible dependency.",
            "Model unavailable, slow and semantically incorrect behavior for both dependencies.",
            "For each failure, decide whether Steward must fail closed, degrade explicitly, or can continue safely.",
            "Define timeout ownership and whether retry is allowed; justify the decision using idempotency and ambiguity of outcome.",
            "Trace one retry-storm or cascade path and identify the point where blast radius can be bounded.",
            "Record the signal that distinguishes dependency failure from an application defect during diagnosis.",
        ],
        deliverables: ["Dependency failure-semantics matrix", "Cascade/retry trace", "Fail-closed/degrade decision note"],
        completionCriteria: ["Authoritative and non-authoritative dependencies are treated differently where appropriate.", "Retry is justified per operation rather than assumed safe.", "The analysis includes reachable-but-wrong behavior, not only outage."],
    },
    "Invalid and Partial State": {
        type: "practical",
        objective: "Expose a silent consistency failure in a Steward mutation and determine which invariant is protected by atomicity, compensation or reconciliation.",
        scenario: "A Steward request returns without a total outage, but execution stops after only part of the intended state change. Health checks remain green while registry data may now violate a business invariant.",
        instructions: [
            "Choose service registration, dependency creation or lifecycle transition and reuse its data-flow model.",
            "Mark every persistent write and the exact local database transaction boundary.",
            "State the pre- and post-operation invariants in domain language.",
            "Inject an interruption after one meaningful step and describe the state that survives.",
            "Decide which inconsistency should be prevented by database constraint or transaction and which would require compensation or reconciliation.",
            "Define one detection query, review rule or reconciliation signal for a silent invalid-state case.",
        ],
        deliverables: ["Interrupted mutation trace", "Invariant/atomicity matrix", "Silent inconsistency detection proposal"],
        completionCriteria: ["The analysis distinguishes local atomicity from cross-system consistency.", "At least one silent invalid state is made observable.", "The proposed control matches the boundary where the invariant can actually be enforced."],
    },
    "Resource Exhaustion": {
        type: "practical",
        objective: "Model how one Steward request path behaves as a finite resource saturates and choose bounded-work controls before introducing capacity as the only answer.",
        scenario: "Steward remains technically healthy, but a large query or traffic burst increases database and worker occupancy until latency rises, timeouts appear and clients begin retrying.",
        instructions: [
            "Choose a list/search or mutation endpoint with meaningful database work.",
            "Trace the finite resources it consumes: request workers, memory, connections, locks, query work and queues where relevant.",
            "Identify one unbounded input, result, concurrency or work dimension.",
            "Describe the user-visible progression from normal utilization to saturation and then timeout or rejection.",
            "Add the feedback effect of retries or queued work and identify where the chain becomes nonlinear.",
            "Choose two bounded-work or overload-protection controls and state which layer owns each; keep capacity expansion as a separate decision.",
        ],
        deliverables: ["Saturation chain", "Finite-resource inventory", "Bounded-work and overload-control decisions"],
        completionCriteria: ["The failure can occur without declaring a dependency down.", "Queueing or held-resource effects are explicit.", "Capacity planning is not used as a substitute for overload protection."],
    },
    "Human and Operational Failure": {
        type: "practical",
        objective: "Redesign one dangerous Steward operational path so a plausible mistake is harder to make, easier to detect and recoverable without relying on reminders alone.",
        scenario: "A configuration change or privileged action can alter ownership, authorization or production behavior even though application code is unchanged. The current process depends too heavily on operators remembering the right steps.",
        instructions: [
            "Choose one configuration mistake and one privileged operational mistake with meaningful Steward impact.",
            "For each, trace immediate effect, hidden secondary effect and blast radius.",
            "Identify why the action is currently possible and what evidence would reveal the mistake.",
            "Replace one reminder/documentation control with a stronger guardrail such as validation, least privilege, environment separation, confirmation or constrained workflow.",
            "Define the recovery path and what audit evidence must remain after recovery.",
            "Compare the guardrail cost with the consequence it limits and reject any disproportionate control.",
        ],
        deliverables: ["Operational failure analysis", "Guardrail design", "Recovery and audit checklist"],
        completionCriteria: ["The analysis focuses on system conditions rather than blame.", "At least one control is stronger than documentation alone.", "Recovery preserves enough evidence to reconstruct what happened."],
    },
};

export const failureModesQualityLessons: Lesson[] = failureModesDeepLessons.map((lesson) => {
    const practical = practices[lesson.title];
    if (!practical) return lesson;

    return {
        ...lesson,
        activities: lesson.activities.map((activity) =>
            activity.content.type === "practical" ? { ...activity, content: practical } : activity,
        ),
    };
});
