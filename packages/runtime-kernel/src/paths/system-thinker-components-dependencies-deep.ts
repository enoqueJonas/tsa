import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const c4Model: LearningResource = { title: "C4 model", url: "https://c4model.com/" };
const arc42: LearningResource = { title: "arc42 Documentation Template", url: "https://arc42.org/overview" };
const couplingArticle: LearningResource = { title: "Martin Fowler on Coupling", url: "https://martinfowler.com/ieeeSoftware/coupling.pdf" };

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function richLesson(
    title: string,
    introduction: string,
    outcomes: string[],
    sections: { title: string; paragraphs: string[]; code?: { language: string; code: string; caption?: string } }[],
    objective: string,
    instructions: string[],
    questions: string[],
    resources: LearningResource[],
): Lesson {
    const id = `components-and-dependencies-${slug(title)}`;
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: introduction },
        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
        { type: "list", items: outcomes },
    ];

    for (const section of sections) {
        blocks.push({ type: "heading", id: slug(section.title), text: section.title, level: 2 });
        for (const paragraph of section.paragraphs) blocks.push({ type: "paragraph", text: paragraph });
        if (section.code) {
            blocks.push(section.code.caption
                ? { type: "code", language: section.code.language, code: section.code.code, caption: section.code.caption }
                : { type: "code", language: section.code.language, code: section.code.code });
        }
    }

    blocks.push({
        type: "callout",
        tone: "steward",
        title: "Steward connection",
        body: "Treat Steward's implementation as evidence, not as proof that its current component boundaries are correct. The goal is to expose responsibility, dependency direction and change impact clearly enough for technical review.",
    });
    blocks.push({ type: "resources", title: "Required and supporting reading", resources });

    return {
        id,
        title,
        activities: [
            { id: `${id}-reading`, title, estimatedMinutes: 32, content: { type: "reading", body: introduction, blocks } },
            {
                id: `${id}-practice`,
                title: `${title}: Engineering Practice`,
                estimatedMinutes: 45,
                content: {
                    type: "practical",
                    objective,
                    scenario: "Use Steward API v1 plus the context, container and component models from earlier System Thinker work. Prefer evidence from actual behavior and dependencies over assumptions based only on folder names.",
                    instructions,
                    deliverables: ["Reviewable dependency/component artifact", "Short reasoning note with evidence, trade-offs and unresolved questions"],
                    completionCriteria: ["Responsibilities are explicit.", "Dependencies have direction and purpose.", "The analysis distinguishes current implementation from intended architecture."],
                },
            },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") } },
        ],
    };
}

export const componentsAndDependenciesDeepLessons: Lesson[] = [
    richLesson(
        "Components and Responsibilities",
        "A component boundary is useful only when it explains responsibility. File layout can hint at design, but architecture begins when we can say what a part of the system is responsible for, what it may change, and what it should not know.",
        ["Define components in terms of responsibility rather than folders.", "Identify reasons for change that belong together.", "Recognize components that mix unrelated concerns.", "Use Steward behavior as evidence for candidate component boundaries."],
        [
            { title: "Responsibility before structure", paragraphs: ["A Django app, package or class is not automatically an architectural component. The architectural question is whether it owns a meaningful responsibility with understandable collaborators.", "For Steward, responsibilities such as service registration, ownership policy, dependency management and review workflow may deserve separate treatment if they change for different reasons and expose distinct rules."] },
            { title: "Boundaries should reduce ambiguity", paragraphs: ["A useful boundary tells engineers where a rule belongs and what other areas it may depend on. If every change requires touching serializers, views, permissions and models across unrelated concepts, the component model should expose that coupling rather than hide it."], code: { language: "text", code: "Candidate responsibility map\n\nService Registry      -> service identity, lifecycle, criticality\nOwnership Policy      -> team membership and modification rights\nDependency Management -> service-to-service dependency rules\nReview Workflow       -> stewardship review scheduling and outcomes", caption: "Responsibilities are stronger architecture signals than directories." } },
        ],
        "Review Steward's current API structure and propose responsibility-based component boundaries.",
        ["Choose three representative Steward use cases.", "Trace where their rules currently live.", "Group behavior by reason for change.", "Name candidate components using domain responsibility language.", "Record one current code boundary that does not match the responsibility model."],
        ["Why is a package not automatically an architectural component?", "What makes two behaviors belong in the same component?", "What evidence suggests a responsibility boundary is weak?"],
        [c4Model, arc42],
    ),
    richLesson(
        "Coupling and Cohesion Foundations",
        "Architecture becomes expensive when unrelated parts must change together or when one part needs excessive knowledge of another. Coupling and cohesion are therefore change-cost concepts, not abstract style scores.",
        ["Explain coupling in terms of dependency and change impact.", "Explain cohesion in terms of related responsibility.", "Recognize temporal, data and behavioral forms of coupling.", "Evaluate trade-offs rather than chasing zero coupling."],
        [
            { title: "Coupling has several forms", paragraphs: ["Two components may be coupled through direct calls, shared database tables, shared data shapes, synchronous timing expectations, deployment order or organizational coordination. A dependency arrow alone does not reveal all of these.", "For Steward, a review workflow that directly manipulates service ownership tables may be more tightly coupled than the source tree suggests."] },
            { title: "High cohesion lowers explanation cost", paragraphs: ["A cohesive component groups behavior that belongs to one responsibility. Low cohesion often appears when a utility or manager object accumulates unrelated rules because it is convenient to call from many places.", "The goal is not to remove every dependency. Useful systems collaborate. The goal is to make dependencies intentional and proportionate to the value they provide."], code: { language: "text", code: "Weak signal:\n  StewardServiceManager handles auth, review scheduling, service state and email\n\nStronger responsibility split:\n  ServiceRegistry\n  AccessPolicy\n  ReviewWorkflow\n  NotificationAdapter", caption: "Cohesion is about related reasons to change." } },
        ],
        "Assess coupling and cohesion for one area of Steward and identify a justified improvement opportunity.",
        ["Pick one component from the previous exercise.", "List what it knows about other components.", "List shared data/schema assumptions.", "List synchronous or deployment assumptions.", "Decide whether one dependency is acceptable, risky or worth redesigning and explain why."],
        ["Can a system have zero coupling?", "Why can shared database tables create hidden coupling?", "How does cohesion relate to reasons for change?"],
        [couplingArticle, arc42],
    ),
    richLesson(
        "Dependency Direction",
        "Dependency direction determines which part of a system must know about which other part. This affects testability, replacement cost, policy leakage and how safely the system can evolve.",
        ["Read dependency arrows as knowledge and change relationships.", "Distinguish orchestration from domain policy.", "Recognize inward versus outward dependency trade-offs.", "Avoid interfaces that exist only to satisfy a pattern."],
        [
            { title: "Ask who knows whom", paragraphs: ["If Service lifecycle rules import HTTP request concepts, domain behavior now depends on the delivery mechanism. If authorization policy depends directly on serializer structure, a representation concern influences policy. These are dependency-direction choices even in a small monolith.", "A good direction usually keeps core business decisions less dependent on volatile delivery or infrastructure details, but the solution should stay proportional to the system." ] },
            { title: "Do not invert dependencies ceremonially", paragraphs: ["Dependency inversion is useful when a boundary needs insulation or multiple implementations are plausible. Creating interfaces for every class can add indirection without reducing risk.", "Use evidence: volatility, testing needs, replacement likelihood, ownership boundaries and coupling pressure."], code: { language: "text", code: "HTTP/View\n   ↓\nApplication orchestration\n   ↓\nService lifecycle policy\n   ↓\nRepository abstraction (only if insulation is useful)\n   ↓\nPostgreSQL/ORM", caption: "Direction should protect meaningful policy, not create layers by habit." } },
        ],
        "Trace one Steward use case and evaluate whether its dependency direction protects important domain policy.",
        ["Choose a use case such as deprecating a Service.", "Trace dependencies from HTTP entry to persistence.", "Mark where transport, policy and persistence knowledge appear.", "Identify one dependency that points toward a more volatile concern.", "Decide whether changing that direction is worth the added abstraction."],
        ["What does a dependency arrow say about knowledge?", "When is dependency inversion useful?", "Why can unnecessary interfaces reduce clarity?"],
        [arc42, couplingArticle],
    ),
    richLesson(
        "Internal and External Dependencies",
        "Dependencies outside the immediate codebase carry different forms of risk: availability, versioning, ownership, contracts, data quality, operational responsibility and change coordination. Internal dependencies deserve the same scrutiny when another team or package owns them.",
        ["Classify internal and external dependencies by responsibility and ownership.", "Record contract, availability and change risks.", "Distinguish package dependency from runtime dependency.", "Recognize when shared ownership assumptions are unsafe."],
        [
            { title: "A dependency inventory needs semantics", paragraphs: ["Listing package names is not enough. Record why the dependency exists, whether it is compile/build-time or runtime, who owns it, what contract is relied upon, what happens when it is unavailable, and how changes are coordinated.", "PostgreSQL is a runtime data dependency. A JWT library is a code dependency. A future enterprise identity provider would be both a runtime external system and an organizational ownership boundary." ] },
            { title: "Internal does not mean low risk", paragraphs: ["An internal service owned by another team can change independently and fail independently. An internal shared package can create lockstep version pressure. A database schema shared across components can be a stronger dependency than an HTTP API.", "The relevant distinction is often ownership and change autonomy, not whether something sits inside the same company or repository."], code: { language: "text", code: "Dependency: PostgreSQL\nPurpose: authoritative Steward registry state\nType: runtime/data\nOwner: Steward/platform operations\nFailure effect: writes unavailable; reads may fail\nContract: schema + transaction semantics\nChange coordination: migrations\nEvidence: settings + ORM + deployment config", caption: "Inventory dependencies with purpose and operational meaning." } },
        ],
        "Build a dependency inventory for Steward that includes both code and runtime dependencies.",
        ["List direct runtime dependencies.", "List important build/code dependencies.", "Record owner, purpose, contract and failure effect for each.", "Identify one dependency with unclear ownership or change coordination.", "Mark which dependencies should appear in architecture documentation versus dependency manifests only."],
        ["Why is a package list not an architecture dependency model?", "Can an internal dependency be operationally external to your team?", "What makes shared database ownership risky?"],
        [arc42],
    ),
    {
        id: "components-and-dependencies-lab-map-steward-api-dependencies",
        title: "Lab: Map Steward API Dependencies",
        activities: [
            {
                id: "components-and-dependencies-lab-map-steward-api-dependencies-brief",
                title: "Model responsibility and dependency together",
                estimatedMinutes: 25,
                content: {
                    type: "reading",
                    body: "This lab turns the component view from the previous module into a reviewable dependency analysis. The result should reveal change pressure, hidden coupling and dependency direction rather than simply redraw the source tree.",
                    blocks: [
                        { type: "heading", id: "required-evidence", text: "Required evidence", level: 2 },
                        { type: "list", items: ["Current component/responsibility model", "Code and import evidence", "Database/schema relationships", "Runtime configuration", "At least three representative Steward use cases"] },
                        { type: "heading", id: "required-outputs", text: "Required outputs", level: 2 },
                        { type: "list", items: ["Responsibility map", "Dependency graph with direction and purpose", "Dependency inventory including owner/contract/failure effect", "Coupling findings", "One prioritized architecture question for the next module"] },
                        { type: "callout", tone: "warning", title: "Do not refactor to make the diagram prettier", body: "If the implementation and intended model differ, document the mismatch first. Architecture findings are evidence. Refactoring belongs only after the problem, consequence and trade-off are understood." },
                        { type: "resources", title: "Core references", resources: [c4Model, arc42, couplingArticle] },
                    ],
                },
            },
            {
                id: "components-and-dependencies-lab-map-steward-api-dependencies-practice",
                title: "Map Steward dependencies",
                estimatedMinutes: 180,
                content: {
                    type: "practical",
                    objective: "Produce an evidence-backed responsibility and dependency analysis for Steward API v1.",
                    scenario: "A technical reviewer wants to know which Steward responsibilities depend on which others, where important coupling exists, what external dependencies the system relies on and which relationships will make future change difficult.",
                    instructions: ["Start from the component model created in Modeling Software Systems.", "Validate each component against real code and use cases.", "Draw dependency direction and label every important relationship with purpose.", "Add data/schema coupling that ordinary call graphs would miss.", "Create a dependency inventory covering runtime, data and significant code dependencies.", "For each important dependency record ownership, contract, failure effect and change coordination.", "Identify at least three coupling findings and classify them as acceptable, concerning or unresolved.", "Select one finding worth architectural discussion, but do not refactor it yet.", "Write a handoff note describing which data flows and integration boundaries should be examined next."],
                    deliverables: ["Steward responsibility map", "Labeled dependency graph", "Dependency inventory", "Coupling/cohesion findings", "Data Flow and Integration handoff note"],
                    completionCriteria: ["The graph models responsibilities rather than folders.", "Every important dependency has direction and purpose.", "Hidden data or ownership coupling is included where relevant.", "Findings are supported by evidence.", "At least one apparently acceptable dependency is defended rather than automatically removed.", "No speculative refactor is performed solely to satisfy the model."],
                },
            },
            {
                id: "components-and-dependencies-lab-map-steward-api-dependencies-review",
                title: "Dependency Review",
                estimatedMinutes: 20,
                content: {
                    type: "reflection",
                    prompt: "1. Which Steward responsibility currently has the widest change impact?\n2. Which dependency is most likely to constrain future architecture and why?\n3. Which dependency looks coupled but is acceptable given current scale and evidence?\n4. Where does ownership differ from technical dependency direction?\n5. What must the Data Flow and Integration module investigate next?",
                },
            },
        ],
    },
];
