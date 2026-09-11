import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { systemBoundariesAndContextDeepLessons } from "./system-thinker-boundaries-deep";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
    "System Context": {
        objective: "Produce a context view that settles what Steward is responsible for before anyone debates its internal architecture.",
        scenario: "A design review starts badly: one engineer treats Steward as only the Django API, another includes PostgreSQL and authentication as part of the product, and a third draws CI/CD, queues and every planned integration around it. The group is using the same name for different scopes. You need a context model that creates one reviewable system definition.",
        instructions: [
            "Start from the approved problem and requirements baseline, not from the repository tree.",
            "Write one sentence that defines Steward's purpose and responsibility in organizational terms.",
            "Identify human actors and genuinely external systems that interact with that responsibility.",
            "Label every relationship with the value, information or dependency that crosses the boundary.",
            "Mark each relationship as current, planned or assumed so future architecture is not presented as present fact.",
            "Run a level-of-abstraction review and remove Django apps, serializers, tables and other internals that do not belong at context level.",
            "Record the two scope disagreements the diagram resolves and one scope question it deliberately leaves open.",
        ],
        deliverables: ["Steward system-context diagram", "One-sentence responsibility statement", "Current/planned/assumed relationship register", "Scope-resolution note"],
        completionCriteria: ["Steward appears as one system rather than a collection of implementation units.", "Every actor and external-system relationship has a meaningful label.", "Future assumptions are visibly separated from current reality.", "The model can be used to resolve a concrete scope disagreement."],
    },
    "Actors and External Systems": {
        objective: "Test whether every actor and neighboring system around Steward has a justified place in the context model.",
        scenario: "The first context draft contains 'Admin', 'Developer', 'GitHub', 'Identity', 'Reporting', 'Platform Team' and several internal tools, but nobody can explain which are actors, stakeholders, external systems or merely organizational labels. Before the diagram becomes architecture documentation, you must classify each participant by its actual relationship to Steward.",
        instructions: [
            "Take the stakeholder map from the previous module and separate direct actors from stakeholders who never interact with Steward.",
            "Replace named people, teams or vague labels with actor roles that express a goal in relation to the system.",
            "For every external system candidate, state the interaction, ownership, current/planned status and evidence that the interaction exists or is required.",
            "Challenge at least two neighboring systems that are owned by the same organization: decide whether they are still external to Steward's responsibility boundary and justify the decision.",
            "Remove any participant whose only justification is that it exists in the same repository, team or technology stack.",
            "Identify one missing actor or external dependency that would materially change the context model if confirmed.",
        ],
        deliverables: ["Actor/stakeholder classification table", "External-system evidence register", "Revised context participants", "One unresolved participant question"],
        completionCriteria: ["Actors are roles with explicit goals rather than names or job-title placeholders.", "Stakeholders are not forced into actor notation when they do not interact with Steward.", "External-system status follows the chosen system boundary, not organizational ownership alone.", "Every retained participant has evidence or is explicitly marked as an assumption."],
    },
    "Defining System Boundaries": {
        objective: "Separate Steward's responsibility boundary from deployment, organizational and trust boundaries so architectural decisions are not made from a single overloaded diagram.",
        scenario: "A reviewer argues that PostgreSQL must be 'inside Steward' because the API cannot work without it, while another argues the enterprise identity provider is 'inside' because the same organization operates it. A third person uses repository ownership as the boundary. Your task is to make the different boundary dimensions explicit and defend which one defines the software system.",
        instructions: [
            "List the capabilities Steward owns versus capabilities it delegates to another system or team.",
            "For each disputed capability, justify ownership from the problem and responsibility model rather than source-code location.",
            "Build a boundary matrix with at least system responsibility, runtime/deployment, organizational ownership and trust dimensions.",
            "Use PostgreSQL, enterprise identity and one other dependency as worked examples showing how the same element can be inside one boundary and outside another.",
            "Identify one current boundary decision that could change without changing Steward's core purpose.",
            "Write the consequence of confusing each pair of boundary types during architecture or operations work.",
        ],
        deliverables: ["Steward responsibility in/out table", "Multi-boundary comparison matrix", "Three worked boundary classifications", "Boundary-confusion risk note"],
        completionCriteria: ["System responsibility is not inferred from repository or deployment topology.", "At least one element is correctly classified differently across boundary dimensions.", "Delegated responsibilities remain visible as dependencies rather than disappearing from the model.", "The learner can explain what would and would not change Steward's core system boundary."],
    },
    "Trust and Ownership Boundaries": {
        objective: "Turn Steward's important interfaces into explicit assurance and coordination contracts rather than vague 'internal' or 'trusted' connections.",
        scenario: "An architecture review labels all traffic inside the organization as trusted and assumes internally owned services can change freely. Steward depends on enterprise identity and may later serve or consume other internal platforms. You have been asked to identify where assurance changes, where control changes hands, and what those boundaries mean during failure or change.",
        instructions: [
            "Select at least three important Steward interactions, including enterprise identity and one data-consuming or data-providing integration.",
            "For each interaction, classify whether it crosses a trust boundary, ownership boundary, both or neither.",
            "Replace the word 'trusted' with concrete assurance: authenticated channel, token issuer/audience checks, schema validation, authorization context or another explicit guarantee.",
            "Record what Steward must still validate even after the stated assurance succeeds.",
            "For every ownership boundary, identify who controls the other side, how changes are coordinated and one failure or compatibility risk.",
            "Walk through one scenario where the other system is reachable but semantically unsafe, stale or incompatible.",
            "State which boundary deserves the strongest follow-up in later Security or Reliability work and why.",
        ],
        deliverables: ["Trust/ownership boundary matrix", "Assurance-and-validation contract for each selected interface", "Change-coordination and failure notes", "Security/Reliability follow-up recommendation"],
        completionCriteria: ["No interface is considered safe merely because it is internal.", "Trust evidence and remaining validation responsibilities are both explicit.", "Ownership boundaries include concrete coordination consequences.", "At least one reachable-but-unsafe dependency scenario is analyzed."],
    },
};

function applyQualityPractice(lesson: Lesson): Lesson {
    const practice = practices[lesson.title];
    if (!practice) return lesson;

    const activityTitle = lesson.title === "System Context"
        ? "Context Scope Review"
        : lesson.title === "Actors and External Systems"
            ? "Participant Classification Review"
            : lesson.title === "Defining System Boundaries"
                ? "Boundary Decision Review"
                : "Trust and Ownership Review";

    return {
        ...lesson,
        activities: lesson.activities.map((activity) =>
            activity.content.type === "practical"
                ? {
                      ...activity,
                      title: activityTitle,
                      content: { type: "practical", ...practice },
                  }
                : activity,
        ),
    };
}

export const systemBoundariesAndContextQualityLessons: Lesson[] = systemBoundariesAndContextDeepLessons.map(applyQualityPractice);
