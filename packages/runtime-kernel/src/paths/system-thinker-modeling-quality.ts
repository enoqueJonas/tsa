import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { modelingSoftwareSystemsDeepLessons } from "./system-thinker-modeling-deep";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
    "Why We Model Systems": {
        objective: "Choose the smallest Steward model that can answer a real engineering question without hiding a decision-relevant assumption.",
        scenario: "Two engineers bring competing Steward diagrams to a review. One mirrors the repository tree in exhaustive detail; the other is a simple context view. Neither has stated the question the diagram is supposed to answer. You must decide what should actually be modeled before redrawing anything.",
        instructions: [
            "Choose one unresolved question from the requirements or boundary work.",
            "Write the audience and decision the model must support before selecting a notation.",
            "List the minimum concepts and relationships required to answer the question.",
            "List implementation detail that should be deliberately omitted at this level.",
            "Identify one omission that would become misleading if its underlying assumption were false.",
            "Compare the two candidate modeling approaches and recommend the smallest useful view.",
        ],
        deliverables: ["Model-purpose statement", "Include/omit decision table", "Recommended model sketch with one explicit risk of misleading omission"],
        completionCriteria: ["The model exists to answer a stated question rather than document everything.", "Omissions are deliberate and visible.", "The recommendation is justified by decision usefulness rather than diagram complexity."],
    },
    "C4-Style Thinking": {
        objective: "Build a deliberate C4 zoom strategy for Steward and prove that every selected view answers a different architectural question.",
        scenario: "A review pack proposes context, container, component and code diagrams simply because C4 has four levels. The result risks documentation volume without better understanding. You are asked to decide which levels Steward actually needs now.",
        instructions: [
            "Reuse the approved Steward context view as the starting point.",
            "Write one engineering question for context, container and component levels.",
            "Define what currently qualifies as a Steward container and justify each candidate by runtime or data responsibility.",
            "Choose one container that deserves component-level zoom and explain why another does not.",
            "Write relationship labels before drawing arrows so direction and purpose are explicit.",
            "Reject at least one unnecessary C4 view and document why omitting it is the stronger choice.",
        ],
        deliverables: ["Steward C4 zoom plan", "Question-to-view matrix", "Explicit omitted-view decision"],
        completionCriteria: ["No view exists only to complete the C4 hierarchy.", "Each selected level answers a distinct question.", "Relationship semantics are written rather than implied by connectivity alone."],
    },
    "Containers and Components as Models": {
        objective: "Model Steward responsibilities without promoting Docker units, folders or framework constructs into architecture by accident.",
        scenario: "The current codebase has obvious Django apps, modules and deployment units. A reviewer has started treating those names as the architecture. You need a responsibility model that can be challenged independently from the source tree.",
        instructions: [
            "Inventory candidate runtime/data units and decide which qualify as C4 containers.",
            "Choose the Steward API as the component zoom target unless current evidence justifies another choice.",
            "Derive candidate components from cohesive responsibilities and use cases, not folder names.",
            "Trace at least three dependency relationships and label why the source depends on the target.",
            "Compare the model against the implementation and record at least one mismatch.",
            "Classify the mismatch as harmless implementation detail, modeling error or potential architecture smell without refactoring it yet.",
        ],
        deliverables: ["Container responsibility table", "Responsibility-based component model", "Model-to-code mismatch finding"],
        completionCriteria: ["Containers are justified as runtime or data units rather than Docker artifacts.", "Components express responsibility rather than package structure.", "At least one mismatch is preserved as evidence instead of being silently normalized."],
    },
    "State and Lifecycle Modeling": {
        objective: "Use a Steward lifecycle model to expose rules that are invisible in a status field or CRUD endpoint list.",
        scenario: "Steward stores lifecycle values, but different engineers disagree about which transitions are legal, who may trigger them and what conditions must hold. The enum looks simple while the real policy is scattered across assumptions and code.",
        instructions: [
            "Choose Service or ServiceReview as the lifecycle under investigation.",
            "Define each state in business terms rather than copying enum labels only.",
            "For every allowed transition, record trigger, actor, authorization requirement and domain guard.",
            "Mark forbidden transitions explicitly and explain the risk each rule prevents.",
            "Compare the lifecycle model with current implementation evidence.",
            "Record one missing, inconsistent or ambiguous rule and decide whether it belongs in requirements, authorization policy or domain validation.",
        ],
        deliverables: ["Steward lifecycle model", "Transition/guard table", "One classified lifecycle-rule gap"],
        completionCriteria: ["States have meanings and transitions have triggers and guards.", "Forbidden behavior is represented, not just happy paths.", "The model reveals at least one rule that a status field alone would not communicate."],
    },
    "Communicating Architecture Visually": {
        objective: "Turn one Steward diagram into a reviewable communication interface that can stand on its own and remain maintainable as the system changes.",
        scenario: "A diagram is technically correct when its author presents it, but another engineer cannot interpret the scope, arrow meanings or color conventions without verbal explanation. You must make the artifact independently reviewable rather than simply prettier.",
        instructions: [
            "Select one existing Steward context, container or component diagram.",
            "Write its audience, question, scope and abstraction level at the top of the review.",
            "Audit every element and relationship for naming consistency, direction and semantic labels.",
            "Remove details that belong to another view and add a legend only where notation genuinely needs explanation.",
            "Check that meaning does not depend on color alone or unexplained acronyms.",
            "Version the improved artifact and define one maintenance trigger that tells future engineers when it must be reviewed.",
        ],
        deliverables: ["Before/after diagram review", "Communication-defect checklist", "Diagram maintenance rule"],
        completionCriteria: ["A reviewer can identify purpose and scope without oral narration.", "Relationships communicate meaning rather than mere connectivity.", "The maintenance rule ties diagram review to observable system change."],
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
                      title: `${lesson.title}: Modeling Investigation`,
                      content: { type: "practical", ...practice },
                  }
                : activity,
        ),
    };
}

export const modelingSoftwareSystemsQualityLessons: Lesson[] = modelingSoftwareSystemsDeepLessons.map(applyQualityPractice);
