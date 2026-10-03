import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { requirementsAndProblemFramingDeepLessons } from "./system-thinker-requirements-deep";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
    "From Requests to Problems": {
        objective: "Turn solution-shaped requests into evidence-backed problem statements before Steward acquires unnecessary architecture.",
        scenario: "Begin from the Steward API v1 repository and Builder release evidence you just completed. A platform lead asks for three additions: an ownership dashboard, automatic email notifications and a new reporting endpoint. The requests sound reasonable, but none exists in v1 and nobody has documented the underlying failures, affected actors or success measures. Frame the work before changing the backlog or code.",
        instructions: [
            "Create a system-thinker/requirements directory beside the existing Steward project artifacts; this school will add analysis evidence before it adds architecture.", "Record the Builder v1 commit/tag or checkpoint you are analyzing so later diagrams and decisions refer to a concrete system.", "Treat each requested feature as a hypothesis about a problem rather than an approved solution.",
            "For each request, identify the affected actor, observed pain, consequence and evidence currently available.",
            "Write a solution-neutral problem statement and an observable outcome for each request.",
            "Identify which parts are facts, stakeholder claims and assumptions that still need validation.",
            "Choose one request that should not yet become implementation work and explain what evidence would change that decision.",
        ],
        deliverables: ["Three request-to-problem reframing records", "Evidence/assumption table", "Short recommendation on which problem should be investigated first"],
        completionCriteria: ["No problem statement prescribes a UI, endpoint, queue or other implementation.", "Claims are traceable to evidence or explicitly labelled assumptions.", "The recommendation is based on impact and uncertainty rather than feature attractiveness."],
    },
    "Stakeholders and Actors": {
        objective: "Expose the people, systems, goals and conflicts that can shape Steward even when they never call its API directly.",
        scenario: "Steward is moving from a developer-built registry toward an internal engineering platform. Service teams want low-friction updates, incident responders want trustworthy ownership, security wants controlled mutation, and leadership wants portfolio visibility. Design discussions are stalling because everyone is described simply as a 'user'.",
        instructions: [
            "Map direct human actors, external-system actors and indirect stakeholders as roles rather than named people.",
            "For each stakeholder, record their goal, concern, influence and the evidence they would trust.",
            "Identify at least two tensions where satisfying one stakeholder can make another stakeholder's goal harder.",
            "Trace which current Steward capabilities serve each goal and mark needs that are still inferred.",
            "Choose one conflict and write the question that must be resolved before architecture should change.",
        ],
        deliverables: ["Stakeholder/actor map", "Goal-and-evidence matrix", "Conflict note for one unresolved stakeholder tension"],
        completionCriteria: ["Actors and stakeholders are not treated as synonyms.", "At least one important stakeholder who never directly uses Steward is represented.", "Conflicts remain visible instead of being silently resolved by the engineer."],
    },
    "Functional Requirements": {
        objective: "Create a behavioral contract for Steward that can survive a framework or implementation change.",
        scenario: "The Builder v1 implementation now gives you concrete Django views, serializers, models and tests to inspect. A future team may replace parts of that implementation. Extract which behaviors must survive without promoting today's framework structure into the specification.",
        instructions: [
            "Inspect the current Steward API v1 routes, models, authorization rules and Builder milestone evidence; select ownership, dependency, environment and lifecycle behavior that is actually implemented.",
            "Write at least eight requirements using observable system behavior rather than framework terminology.",
            "Include preconditions or state where behavior changes depending on context.",
            "Add at least two forbidden behaviors or negative requirements, including one authorization-related case.",
            "For every requirement, record the stakeholder outcome, domain rule or risk that justifies it.",
            "Review the set and remove any statement that merely describes how the current code works.", "For each requirement, check that it expresses one meaningful obligation and that another engineer could describe evidence that would falsify compliance.", "Trace two requirements backward to their driver and forward to acceptance evidence; then describe the impact surface if either requirement changes.",
        ],
        deliverables: ["Versioned functional-requirements baseline", "Traceability column linking each requirement to its driver", "List of implementation details deliberately excluded from the contract"],
        completionCriteria: ["Requirements remain meaningful if Django is replaced.", "Positive and forbidden behavior are both represented.", "Every requirement has a reason to exist beyond matching current code."],
    },
    "Quality Requirements": {
        objective: "Replace vague quality ambitions with scenarios strong enough to influence Steward architecture and later verification.",
        scenario: "A review says Steward must be 'fast, secure, reliable and scalable'. The statement sounds responsible but cannot guide a design decision or tell QA what evidence would prove success.",
        instructions: [
            "Choose five quality attributes that materially matter to Steward now; do not select every possible quality.",
            "For each attribute, define the triggering situation, operating context, affected behavior and measurable or reviewable response.",
            "Rank the five drivers and explain why the top two deserve architectural attention before the others.",
            "Identify one conflict between two qualities and describe what evidence would help choose the trade-off.",
            "Identify one fashionable quality claim that Steward does not yet need to optimize and defend that decision.",
        ],
        deliverables: ["Prioritized quality-scenario catalogue", "Quality trade-off note", "Deferred-quality decision with revisit trigger"],
        completionCriteria: ["Words such as fast, scalable and reliable are backed by concrete scenarios.", "Priorities are explicit rather than everything being critical.", "At least one deliberate non-goal or deferral is documented."],
    },
    "Constraints and Assumptions": {
        objective: "Prevent today's implementation choices and untested beliefs from becoming permanent architecture by accident.",
        scenario: "The current Builder v1 really does use PostgreSQL and a Django application, but implementation facts are not automatically permanent constraints. During planning, people say Steward 'must use PostgreSQL', 'must remain a single Django application', 'will stay small', and 'will always be maintained directly by service teams'. Classify those claims before they harden into architecture folklore.",
        instructions: [
            "Build a register containing at least five constraints and five assumptions visible in Steward's current direction.",
            "Classify constraints by source and mark whether they are hard or negotiable.",
            "For every assumption, record the impact if false, validation method and a concrete revisit trigger.",
            "Challenge PostgreSQL, the current deployable shape and one other technology choice: classify each as requirement, constraint, current implementation fact or assumption.",
            "Escalate the two assumptions whose failure would invalidate the most downstream design work.",
        ],
        deliverables: ["Constraint-and-assumption register", "Classification of three current technology choices", "Risk note for the two highest-impact assumptions"],
        completionCriteria: ["Current implementation is not automatically promoted to constraint.", "High-impact assumptions have validation or revisit mechanisms.", "The register preserves uncertainty instead of disguising it as certainty."],
    },
    "Acceptance and Evidence": {
        objective: "Turn selected Steward requirements into evidence contracts that another engineer or tester could independently verify.",
        scenario: "The requirements baseline is ready for review, but stakeholders disagree about what 'done' would look like. Rather than adding implementation steps, you must define the evidence that would convincingly demonstrate behavior and quality claims.",
        instructions: [
            "Choose four functional and three quality requirements from the artifacts you created earlier.",
            "For each requirement, write acceptance conditions with relevant initial state, trigger and observable result.",
            "Include at least one negative authorization case, one state-dependent case and one quality claim that cannot be proven by a normal API test.",
            "Choose the strongest evidence type for each claim: automated test, query plan, measurement, recovery exercise, log inspection, review or another justified form.",
            "Have one criterion intentionally challenged from the perspective of a skeptical reviewer; revise the underlying requirement if the challenge exposes ambiguity.", "For one requirement, distinguish verification evidence from validation evidence and explain why passing the former would not necessarily prove the stakeholder problem is solved.",
        ],
        deliverables: ["Requirement-to-evidence matrix", "Acceptance scenarios including negative and state-dependent cases", "Before/after record of one ambiguity discovered through evidence design"],
        completionCriteria: ["Evidence type matches the claim being made.", "Acceptance criteria describe observable proof rather than implementation tasks.", "At least one requirement becomes clearer because the evidence exercise exposed ambiguity."],
    },
};

function applyQualityPractice(lesson: Lesson): Lesson {
    const practice = practices[lesson.title];
    if (!practice) return lesson;

    return {
        ...lesson,
        activities: lesson.activities.map((activity) =>
            activity.content.type === "practical"
                ? {
                      ...activity,
                      title: `${lesson.title}: Engineering Investigation`,
                      content: { type: "practical", ...practice },
                  }
                : activity,
        ),
    };
}

export const requirementsAndProblemFramingQualityLessons: Lesson[] = requirementsAndProblemFramingDeepLessons.map(applyQualityPractice);
