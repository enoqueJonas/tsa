import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { dataFlowAndIntegrationDeepLessons } from "./system-thinker-data-flow-deep";

type PracticeSpec = Omit<PracticalContent, "type">;

const practiceByLesson: Record<string, PracticeSpec> = {
    "Following Data Through a System": {
        objective: "Trace one Steward mutation from actor intent to durable state and expose where meaning, trust and state change.",
        scenario: "A review of Steward's create-service flow shows a neat endpoint-to-database diagram, but nobody can point to where ownership evidence becomes an authorization decision, where input becomes trusted domain state, or which reads affect the mutation. Reconstruct the flow from evidence.",
        instructions: [
            "Choose create service, add dependency or lifecycle change and write the actor's intent before naming endpoints.",
            "Trace authentication context, authorization evidence, validation, domain rules and all reads that influence the decision.",
            "Mark every point where data changes meaning or assurance, including identifiers, ownership claims and lifecycle values.",
            "Mark the database transaction boundary and distinguish reads, writes and non-transactional side effects.",
            "Compare the trace with the implementation and record one hidden dependency or missing enforcement point.",
            "State what observable evidence proves the operation completed correctly.",
        ],
        deliverables: ["End-to-end mutation trace", "Meaning/trust transition register", "Transaction and side-effect note", "Implementation finding"],
        completionCriteria: ["The flow starts with actor intent rather than an endpoint.", "Authorization evidence and domain invariants are visible.", "State-changing reads/writes and the transaction boundary are explicit.", "At least one hidden dependency or enforcement question is supported by implementation evidence."],
    },
    "Synchronous and Asynchronous Boundaries": {
        objective: "Decide which Steward interactions belong on the synchronous critical path and which may become asynchronous without weakening correctness.",
        scenario: "A design proposal suggests putting several Steward interactions behind a queue 'for scalability': authorization checks, lifecycle validation and post-change notifications. Review the proposal by semantics rather than technology preference.",
        instructions: [
            "Select at least three interactions around a lifecycle change: one correctness-critical, one user-visible integration and one side effect.",
            "For each interaction, state whether downstream success is required before the caller can receive a correct response.",
            "Record latency, availability and consistency coupling for a synchronous design.",
            "For asynchronous candidates, define what 'accepted' means, how status becomes visible and what delay is acceptable.",
            "Specify retry, duplicate-delivery and ordering requirements for one asynchronous candidate.",
            "Conclude which interactions remain synchronous, which may become asynchronous and why a queue is not justified for the rest.",
        ],
        deliverables: ["Interaction classification matrix", "Critical-path rationale", "Asynchronous contract for one justified candidate", "Queue/no-queue decision note"],
        completionCriteria: ["Correctness-critical work is not deferred merely to introduce messaging.", "Every asynchronous choice defines acceptance, visibility and consistency expectations.", "Retry and duplicate semantics are explicit for the chosen candidate.", "At least one proposed asynchronous interaction is rejected with a reason."],
    },
    "Integration Contracts": {
        objective: "Turn one Steward boundary into a reviewable integration contract that covers semantics, compatibility and operational ownership.",
        scenario: "Another team says Steward can integrate with its service because an endpoint and JSON schema already exist. Before depending on it, determine whether the available information is enough to operate and evolve the integration safely.",
        instructions: [
            "Choose a current or plausible Steward boundary and identify provider, consumer and operational owner.",
            "Define the capability and semantic preconditions/postconditions independently of transport details.",
            "Record stable identifiers, authentication, data shape, error taxonomy, timeout expectations and idempotency behavior.",
            "Define versioning, compatibility and change-notification expectations, including what counts as a breaking change.",
            "Describe one consumer/provider compatibility check that could fail before production.",
            "Identify one assumption the current contract does not prove and decide who must resolve it.",
        ],
        deliverables: ["Integration contract sheet", "Compatibility-risk register", "Contract-test proposal", "Ownership/change-coordination note"],
        completionCriteria: ["The contract describes semantics rather than schema alone.", "Error, timeout and idempotency behavior are reviewable.", "Ownership and compatibility expectations are explicit.", "At least one unresolved contract assumption has a named resolution path."],
    },
    "Failure Across Integrations": {
        objective: "Analyze ambiguous and partial failure across one Steward integration and define what the caller and operator may safely assume.",
        scenario: "Steward commits a lifecycle change, then a downstream integration times out. One engineer proposes returning an error and retrying automatically; another proposes returning success. Determine the safe behavior from state and contract evidence.",
        instructions: [
            "Choose a boundary and draw the successful sequence with the authoritative local state change clearly marked.",
            "Add explicit rejection, timeout-before-response and partial-success cases.",
            "For each case, record what is known, unknown and merely assumed about local and remote state.",
            "Decide whether automatic retry is safe; if it is, state which idempotency key or semantic guarantee makes it safe.",
            "Define correlation evidence an operator needs to reconstruct attempts across the boundary.",
            "Identify one case that must escalate to manual investigation instead of pretending recovery is deterministic.",
        ],
        deliverables: ["Failure-state matrix", "Retry-safety decision", "Correlation/diagnostic evidence plan", "Manual-investigation scenario"],
        completionCriteria: ["Timeout is treated as an ambiguous outcome where appropriate.", "Local transaction success is not confused with cross-system atomicity.", "Retry decisions are justified by semantics rather than convenience.", "Operator evidence is sufficient to distinguish completed, failed and uncertain outcomes."],
    },
};

function applyQualityPractice(lesson: Lesson): Lesson {
    const practice = practiceByLesson[lesson.title];
    if (!practice) return lesson;

    return {
        ...lesson,
        activities: lesson.activities.map((activity) =>
            activity.id.endsWith("-practice")
                ? { ...activity, title: `${lesson.title}: Flow Investigation`, content: { type: "practical", ...practice } }
                : activity,
        ),
    };
}

export const dataFlowAndIntegrationQualityLessons: Lesson[] = dataFlowAndIntegrationDeepLessons.map(applyQualityPractice);
