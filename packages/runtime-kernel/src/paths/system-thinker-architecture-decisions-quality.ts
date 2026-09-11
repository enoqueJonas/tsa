import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { architectureDecisionsAndTradeOffsDeepLessons } from "./system-thinker-architecture-decisions-deep";

const practices: Record<string, PracticalContent> = {
    "Architecture Characteristics Introduction": {
        type: "practical",
        objective: "Turn Steward quality expectations into a prioritized set of architecture characteristics expressed as concrete scenarios that can actually drive decisions.",
        scenario: "A review of Steward contains familiar words such as secure, scalable, reliable and maintainable, but they are too vague to resolve design disagreements. The team needs to identify which qualities materially shape the system now and which do not.",
        instructions: [
            "Extract candidate qualities from Steward requirements, failure findings and operating constraints rather than starting from a generic checklist.",
            "Rewrite each candidate as a concrete scenario with stimulus, context, expected response and reviewable evidence.",
            "Select the three characteristics with the strongest current architectural influence and rank them.",
            "For each top characteristic, identify one existing or upcoming Steward decision that it should influence.",
            "Choose one plausible quality that is not a current architecture driver and explain why optimizing for it now would be premature.",
            "Identify one pair of characteristics that can conflict and describe the trade-off without selecting a technology yet.",
        ],
        deliverables: ["Prioritized architecture-characteristic scenarios", "Driver-to-decision mapping", "Deferred-quality and conflict note"],
        completionCriteria: ["Characteristics are expressed as concrete scenarios rather than adjectives.", "Prioritization is tied to Steward evidence and consequences.", "At least one plausible quality is deliberately deferred instead of treating every quality as equally important."],
    },
    "Decision Drivers": {
        type: "practical",
        objective: "Build a ranked decision-driver model for one real Steward architecture question before comparing implementation options.",
        scenario: "A proposed architecture discussion has already drifted toward product names and patterns. Before the team debates a queue, service split, cache or other solution, it needs to expose the forces that would make one option preferable to another.",
        instructions: [
            "Choose one unresolved Steward architecture question from the failure, dependency or data-flow work.",
            "List the functional requirements, architecture characteristics, constraints, operational risks, cost factors and team capabilities that bear on the question.",
            "Separate hard constraints from preferences and remove any item that is merely a disguised solution choice.",
            "Rank the remaining drivers as high, medium or low and explain the top three in evidence-based terms.",
            "Identify at least one conflict between two drivers and state what cannot be maximized simultaneously.",
            "Write a short problem statement that can be evaluated without naming the technology you currently favor.",
        ],
        deliverables: ["Ranked decision-driver table", "Constraint-versus-preference classification", "Technology-neutral architecture question"],
        completionCriteria: ["The question remains meaningful after product and pattern names are removed.", "Drivers are ranked rather than presented as an unweighted list.", "At least one conflict between legitimate drivers is explicit."],
    },
    "Architecture Decision Records": {
        type: "practical",
        objective: "Create one concise Steward ADR that preserves why a decision is reasonable now, which alternatives were credible and what future evidence should trigger reconsideration.",
        scenario: "A future engineer can inspect Steward code and discover what was built, but cannot reconstruct why a significant boundary or integration choice was made. The missing information is decision history, not implementation documentation.",
        instructions: [
            "Choose one Steward decision significant enough that a future engineer could reasonably question it.",
            "Write the context and ranked drivers before writing the chosen option.",
            "Describe at least two credible alternatives in terms their advocates would recognize as fair.",
            "State the selected decision in one unambiguous sentence.",
            "Record positive consequences, accepted costs, risks and follow-on work separately.",
            "Define concrete revisit triggers based on changed scale, ownership, reliability evidence, operating cost or requirements rather than a calendar date alone.",
            "Link the ADR reasoning to existing System Thinker artifacts so claims remain traceable.",
        ],
        deliverables: ["One complete Steward ADR", "Evidence links to prior System Thinker artifacts", "Explicit revisit-trigger set"],
        completionCriteria: ["The ADR preserves reasoning rather than merely restating the implementation.", "Rejected alternatives are credible rather than straw men.", "Revisit conditions describe evidence that could invalidate the current decision."],
    },
    "Evaluating Trade-offs": {
        type: "practical",
        objective: "Compare credible Steward architecture options against ranked drivers, expose uncertainty and decide where measurement or reversibility should change the level of analysis.",
        scenario: "Two Steward design options both solve the immediate problem but shift complexity to different places. The team needs a decision that makes gains, losses and uncertainty visible instead of declaring one architecture universally better.",
        instructions: [
            "Choose one decision question with at least two genuinely credible options.",
            "Evaluate each option against the previously ranked drivers and write both benefits and costs for every important driver.",
            "Mark claims as evidence, assumption or unknown so opinion is not presented as fact.",
            "Select one factual uncertainty that could be reduced by a small measurement, prototype or experiment and define the evidence the experiment should produce.",
            "Classify the decision as easy, moderate or expensive to reverse and explain how reversibility affects the amount of analysis justified now.",
            "Make a provisional choice or explicitly defer the decision if the available evidence is insufficient; state what new evidence would change that status.",
        ],
        deliverables: ["Trade-off comparison matrix", "Evidence/assumption/unknown classification", "Experiment or measurement proposal", "Provisional decision with reversibility note"],
        completionCriteria: ["No option is presented as universally superior.", "Important unknowns are separated from established evidence.", "Decision rigor is proportional to consequence and reversibility rather than architectural fashion."],
    },
};

export const architectureDecisionsAndTradeOffsQualityLessons: Lesson[] = architectureDecisionsAndTradeOffsDeepLessons.map((lesson) => {
    const practical = practices[lesson.title];
    if (!practical) return lesson;

    return {
        ...lesson,
        activities: lesson.activities.map((activity) =>
            activity.content.type === "practical" ? { ...activity, content: practical } : activity,
        ),
    };
});
