import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const adr: LearningResource = { title: "Architecture Decision Records", url: "https://adr.github.io/" };
const arc42: LearningResource = { title: "arc42 Documentation Template", url: "https://arc42.org/overview" };
const c4: LearningResource = { title: "C4 model", url: "https://c4model.com/" };

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
    const id = `architecture-decisions-${slug(title)}`;
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: introduction },
        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
        { type: "list", items: outcomes },
    ];

    for (const section of sections) {
        blocks.push({ type: "heading", id: slug(section.title), text: section.title, level: 2 });
        for (const text of section.paragraphs) blocks.push({ type: "paragraph", text });
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
        body: "Use decisions already exposed by Steward API v1, its failure analysis and its quality requirements. Record evidence and trade-offs before proposing new architecture.",
    });
    blocks.push({ type: "resources", title: "Required and supporting reading", resources });

    return {
        id,
        title,
        activities: [
            { id: `${id}-reading`, title, estimatedMinutes: 34, content: { type: "reading", body: introduction, blocks } },
            {
                id: `${id}-practice`,
                title: `${title}: Engineering Practice`,
                estimatedMinutes: 45,
                content: {
                    type: "practical",
                    objective,
                    scenario: "Use the current Steward requirements, system models, dependency map and failure portfolio as decision evidence.",
                    instructions,
                    deliverables: ["Reviewable decision artifact", "Short evidence and trade-off note"],
                    completionCriteria: ["The decision is tied to explicit drivers.", "At least one alternative is evaluated fairly.", "Consequences and revisit conditions are explicit."],
                },
            },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") } },
        ],
    };
}

export const architectureDecisionsAndTradeOffsDeepLessons: Lesson[] = [
    richLesson(
        "Architecture Characteristics Introduction",
        "Architecture characteristics are qualities that materially influence system structure and trade-offs. They become architectural only when they are important enough to shape decisions, not because they appear on a generic checklist.",
        ["Distinguish functional behavior from architecture characteristics.", "Turn vague qualities into concrete scenarios.", "Prioritize characteristics instead of treating all qualities as equally important.", "Connect quality drivers to Steward evidence."],
        [
            { title: "Characteristics must be operationalized", paragraphs: ["Words such as secure, scalable, maintainable and reliable are too vague to guide a decision. A useful characteristic has a context, stimulus, expected response and measurable or reviewable outcome.", "For Steward, authorization correctness may matter more than throughput. That prioritization changes which trade-offs are acceptable."], code: { language: "text", code: "Characteristic: authorization correctness\nStimulus: authenticated engineer attempts to mutate another team's service\nExpected response: deny mutation without leaking protected details\nEvidence: automated cross-team authorization tests", caption: "A quality attribute becomes useful when expressed as a scenario." } },
            { title: "Architecture is shaped by the important few", paragraphs: ["A system rarely maximizes every quality simultaneously. Strong consistency may increase coordination cost. Strong isolation may reduce reuse. Faster delivery may favor simpler deployment while future scale might favor more separation. The job is to identify which qualities are decision drivers now." ] },
        ],
        "Derive and prioritize Steward architecture characteristics from existing requirements and failure evidence.",
        ["List candidate characteristics from the requirements baseline.", "Rewrite each as a concrete scenario.", "Rank the top three and justify the order.", "For each top characteristic, identify one architectural decision it could influence.", "Record one characteristic that is deliberately not a current priority."],
        ["Why is 'the system should be scalable' weak?", "When does a quality become architecturally significant?", "Why must architecture characteristics be prioritized?"],
        [arc42],
    ),
    richLesson(
        "Decision Drivers",
        "A defensible architecture decision starts with drivers: the forces that make one option preferable to another. Drivers include requirements, quality attributes, constraints, risks, cost, team capability and evidence from the existing system.",
        ["Identify decision drivers before comparing solutions.", "Separate constraints from preferences.", "Rank drivers instead of hiding trade-offs.", "Use failure and operational evidence as architecture input."],
        [
            { title: "Start with the forces, not the technology", paragraphs: ["If the conversation begins with 'Should we use Kafka?' or 'Should we split this into microservices?', the solution may be leading the problem. Ask what pressure exists: throughput, isolation, ownership, deployment independence, recovery, auditability or something else.", "A technology can only be evaluated against drivers. Without drivers, comparisons become taste or fashion." ] },
            { title: "Drivers can conflict", paragraphs: ["Steward may value simple operations, strong authorization boundaries, clear ownership, low cost and future extensibility. A single option may improve one while worsening another. Ranking forces makes those conflicts discussable."], code: { language: "text", code: "Decision: keep Steward as one deployable API for now\nDrivers:\n1. operational simplicity — high\n2. ownership clarity — high\n3. independent scaling — low\n4. deployment autonomy by team — low\n5. current team size — strong constraint", caption: "Drivers explain why an option is sensible now." } },
        ],
        "Build a driver table for one real Steward architectural question.",
        ["Choose one question from the Failure Modes handoff.", "List requirements, quality drivers, constraints, risks and team/operational factors.", "Rank each driver as high, medium or low.", "Identify conflicts between drivers.", "Remove any driver that is merely a preferred implementation."],
        ["What is wrong with starting from a favorite technology?", "How does a constraint differ from a preference?", "Why rank decision drivers?"],
        [arc42],
    ),
    richLesson(
        "Architecture Decision Records",
        "An ADR captures one architecturally significant decision together with the context, considered alternatives, chosen option and consequences. Its purpose is to preserve reasoning, not to document every coding choice.",
        ["Recognize decisions that deserve ADRs.", "Write concise context and decision drivers.", "Record alternatives fairly.", "Capture positive, negative and follow-on consequences.", "Define conditions for revisiting a decision."],
        [
            { title: "Record why, not only what", paragraphs: ["Future engineers can usually discover what the code does. What disappears is why that direction was chosen, what alternatives were rejected and which constraints made the choice reasonable at the time.", "ADRs are most valuable when a later engineer can challenge the decision with new evidence without reconstructing history from commits and chat messages." ] },
            { title: "A lightweight ADR is enough", paragraphs: ["Useful sections are title/status, context and drivers, decision, alternatives, consequences and revisit triggers. Avoid turning ADRs into essays or architecture approval forms."], code: { language: "markdown", code: "# ADR-004: Keep Steward as a modular monolith\n\nStatus: Accepted\n\n## Context\nCurrent team size is small; operational simplicity is a top driver.\n\n## Decision\nKeep one deployable Django API with explicit internal responsibility boundaries.\n\n## Alternatives\n- split registry and review workflow into services\n- keep current structure without explicit boundaries\n\n## Consequences\n+ simpler deployment\n+ easier local transactions\n- weaker deployment independence\n\n## Revisit when\nIndependent ownership or scaling becomes a demonstrated requirement.", caption: "An ADR should preserve decision reasoning and revisit conditions." } },
        ],
        "Draft one Steward ADR using evidence collected in earlier System Thinker modules.",
        ["Choose an architecturally significant Steward decision.", "Write context and ranked drivers first.", "List at least two credible alternatives.", "State the decision clearly.", "Record positive and negative consequences.", "Add explicit revisit triggers."],
        ["What makes a decision ADR-worthy?", "Why should rejected alternatives be included?", "What is the value of revisit triggers?"],
        [adr],
    ),
    richLesson(
        "Evaluating Trade-offs",
        "Architecture is the management of trade-offs under uncertainty. Evaluation means comparing alternatives against prioritized drivers and evidence, not proving one option universally superior.",
        ["Compare options against explicit drivers.", "Expose uncertainty and assumptions.", "Use experiments or measurements where disagreement is factual.", "Avoid false precision in scoring matrices.", "Separate reversible from expensive-to-reverse decisions."],
        [
            { title: "Every option has a cost surface", paragraphs: ["A queue can improve temporal decoupling while increasing operational complexity and eventual consistency. A single database can simplify transactions while coupling data ownership. More components can improve conceptual separation while increasing coordination cost.", "Trade-off reasoning becomes useful when both gains and losses are written down." ] },
            { title: "Use evidence where possible", paragraphs: ["If two options differ on a measurable uncertainty—query latency, failure isolation, deployment time, throughput—run a small experiment instead of arguing abstractly. Not every architecture question needs a prototype, but factual uncertainty should not be disguised as opinion."], code: { language: "text", code: "Option A: synchronous review notification\n+ immediate feedback\n+ simpler consistency model\n- request latency depends on notifier\n- notifier outage can affect user flow\n\nOption B: asynchronous notification\n+ failure isolation\n+ retryable delivery\n- delayed result\n- duplicate/idempotency semantics required\n- more operational machinery", caption: "Trade-offs should be explicit on both sides." } },
        ],
        "Evaluate two or more Steward architecture options against ranked drivers.",
        ["Choose one decision question.", "Define at least two credible alternatives.", "Compare each against the ranked drivers.", "Mark assumptions and unknowns.", "Identify which unknowns can be tested cheaply.", "State whether the decision is reversible and what that changes about the level of analysis required."],
        ["Why is there rarely a universally best architecture option?", "When should an experiment replace debate?", "How does reversibility affect decision rigor?"],
        [arc42, adr],
    ),
    {
        id: "architecture-decisions-lab-write-steward-api-adrs",
        title: "Lab: Write Steward API ADRs",
        activities: [
            {
                id: "architecture-decisions-lab-write-steward-api-adrs-brief",
                title: "Turn Steward evidence into decisions",
                estimatedMinutes: 25,
                content: {
                    type: "reading",
                    body: "This lab converts the evidence produced across System Thinker into explicit architecture decisions. Do not invent decisions to satisfy a template. Choose questions where different credible options would lead Steward in meaningfully different directions.",
                    blocks: [
                        { type: "heading", id: "required-output", text: "Required output", level: 2 },
                        { type: "list", items: ["At least two ADRs for real Steward decisions", "Ranked decision drivers for each ADR", "At least two credible alternatives per ADR", "Positive and negative consequences", "Assumptions and evidence references", "Explicit revisit conditions"] },
                        { type: "callout", tone: "warning", title: "Do not manufacture microservices", body: "A System Thinker may conclude that the current modular monolith is the best option. The milestone rewards evidence and trade-off reasoning, not architectural novelty." },
                        { type: "resources", title: "Core references", resources: [adr, arc42] },
                    ],
                },
            },
            {
                id: "architecture-decisions-lab-write-steward-api-adrs-practice",
                title: "Produce the Steward ADR set",
                estimatedMinutes: 180,
                content: {
                    type: "practical",
                    objective: "Produce at least two evidence-backed ADRs for Steward API v1 and defend each decision against credible alternatives.",
                    scenario: "A technical review group will use the ADRs to understand why Steward should evolve in the chosen direction and what future evidence would justify changing course.",
                    instructions: ["Review requirements, architecture characteristics, component/dependency findings, data-flow analysis and failure portfolio.", "Select at least two architecturally significant decisions.", "For each decision, write and rank decision drivers before selecting an option.", "Evaluate at least two credible alternatives fairly.", "Write the ADR with context, decision, alternatives, consequences and revisit triggers.", "Link each major claim to an artifact or observation from earlier System Thinker work.", "Check that proposed changes do not exceed the evidence. If retaining the current structure is the best decision, record that explicitly.", "End with one unresolved architecture question that belongs in the System Thinker milestone review."],
                    deliverables: ["At least two Steward ADRs", "Decision-driver tables", "Evidence references", "Unresolved architecture question"],
                    completionCriteria: ["Each ADR addresses a real architecture decision.", "Drivers are explicit and ranked.", "Alternatives are credible rather than straw men.", "Consequences include costs and risks.", "Revisit conditions are concrete.", "The decisions are proportional to current Steward evidence."],
                },
            },
            {
                id: "architecture-decisions-lab-write-steward-api-adrs-review",
                title: "Architecture decision review",
                estimatedMinutes: 20,
                content: { type: "reflection", prompt: "1. Which driver had the greatest influence on your decisions?\n2. Which alternative was hardest to reject, and why?\n3. What assumption could most easily invalidate one ADR?\n4. Which decision is easiest to reverse?\n5. What evidence should trigger an ADR review?" },
            },
        ],
    },
];
