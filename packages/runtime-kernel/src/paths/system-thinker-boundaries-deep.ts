import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const c4Context: LearningResource = { title: "C4 model — System Context diagram", url: "https://c4model.com/diagrams/system-context" };
const arc42Context: LearningResource = { title: "arc42 — Context and Scope", url: "https://docs.arc42.org/section-3/" };
const owaspTrust: LearningResource = { title: "OWASP Threat Modeling Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html" };

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function readingLesson(
    title: string,
    introduction: string,
    sections: { title: string; paragraphs: string[]; code?: { language: string; code: string; caption?: string } }[],
    practice: string[],
    questions: string[],
    resources: LearningResource[],
): Lesson {
    const id = `system-boundaries-and-context-${slug(title)}`;
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: introduction },
        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
        { type: "list", items: [
            `Explain ${title.toLowerCase()} as a systems-thinking concept rather than a diagramming convention.`,
            "Apply the concept to Steward API v1 using evidence from requirements, actors and real dependencies.",
            "Distinguish the boundary being modeled from nearby but different boundaries.",
        ] },
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
        body: "Steward is an Engineering Service Registry and Technology Stewardship platform. The system boundary must be derived from the problem it owns, not from whichever Django models, endpoints or deployment units happen to exist today.",
    });
    blocks.push({ type: "resources", title: "Required and supporting reading", resources });

    return {
        id,
        title,
        activities: [
            { id: `${id}-reading`, title, estimatedMinutes: 30, content: { type: "reading", body: introduction, blocks } },
            {
                id: `${id}-practice`,
                title: `${title}: Engineering Practice`,
                estimatedMinutes: 40,
                content: {
                    type: "practical",
                    objective: `Apply ${title} to Steward API v1 and produce reviewable boundary evidence.`,
                    scenario: "Use the requirements baseline from the previous System Thinker module. Treat the current Steward implementation as evidence, not as the authority that defines the system boundary.",
                    instructions: practice,
                    deliverables: ["Boundary/context artifact", "Short reasoning note"],
                    completionCriteria: ["The artifact answers a specific engineering question.", "Boundary choices are explicit and justified.", "Implementation detail is included only when it belongs at the chosen level of abstraction."],
                },
            },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") } },
        ],
    };
}

export const systemBoundariesAndContextDeepLessons: Lesson[] = [
    readingLesson(
        "System Context",
        "A system context view answers a deceptively simple question: what system are we talking about, who uses it, and what other systems does it depend on or interact with? Its power comes from refusing to dive into implementation before the environment around the system is understood.",
        [
            { title: "Context before internals", paragraphs: ["A context model treats the system as one box and focuses on people, neighboring systems and important relationships. It is not the place for Django apps, database tables, queues or controllers. Those may matter later, but they do not answer the context question.", "This level is especially useful when people use the same system name to mean different things. A diagram that shows the system, its users and external dependencies creates a shared scope for later architecture discussions."] },
            { title: "Name relationships, not just boxes", paragraphs: ["A context diagram with unlabeled arrows is weak evidence. Relationships should explain why an actor or system interacts with Steward: engineering teams register services, platform engineers inspect ownership, an identity provider authenticates users, or another internal platform consumes registry data."], code: { language: "text", code: "Engineering Team -> Steward: register and maintain service metadata\nPlatform Engineer -> Steward: inspect ownership and dependencies\nSteward -> Identity Provider: authenticate users\nInternal Tool -> Steward: query service-registry data", caption: "A context model is about meaningful relationships at the system boundary." } },
        ],
        ["Write the single-sentence purpose of Steward from the requirements baseline.", "List human actors and external systems without naming Django internals.", "Describe each relationship using a verb phrase that explains value or dependency.", "Identify one relationship currently assumed rather than proven.", "Review the artifact and remove any implementation detail that does not belong at context level."],
        ["Why should a system context view avoid internal components?", "What makes an arrow on a context diagram useful?", "How can a context model expose scope disagreements?"],
        [c4Context, arc42Context],
    ),
    readingLesson(
        "Actors and External Systems",
        "Actors and external systems are not decorative labels around the main box. They represent sources of goals, inputs, constraints, dependencies and failure conditions that shape the system's responsibilities.",
        [
            { title: "Actors are defined by interaction and goal", paragraphs: ["An actor is a role in relation to the system, not necessarily a named person or job title. The same engineer may act as service maintainer in one interaction and platform reviewer in another. Modeling roles prevents personal identities from leaking into architecture and makes permissions easier to reason about.", "Stakeholders and actors overlap but are not identical. A risk manager may care deeply about Steward without directly using its API; a service maintainer is both stakeholder and actor."] },
            { title: "External means outside the chosen boundary", paragraphs: ["An external system is outside Steward's responsibility boundary even if it belongs to the same company or repository ecosystem. Identity providers, source-control systems, deployment platforms or reporting consumers can all be external from Steward's perspective.", "Do not classify something as internal merely because your team operates it. Organizational ownership, deployment ownership and system responsibility are different dimensions."] },
        ],
        ["Derive actors from the prior stakeholder map and mark which stakeholders are not direct actors.", "For every actor, write the goal they pursue through Steward.", "List external systems Steward communicates with or is expected to communicate with.", "For each external system, state whether the dependency is current, planned or only assumed.", "Identify one place where organizational ownership could tempt you to misclassify an external system as internal."],
        ["Why is an actor a role rather than a person?", "Can a stakeholder exist without being a system actor?", "Why can a system owned by the same organization still be external to Steward?"],
        [c4Context, arc42Context],
    ),
    readingLesson(
        "Defining System Boundaries",
        "A system boundary is a responsibility decision. It says which capabilities and rules Steward owns and which ones it relies on elsewhere. Poor boundaries create duplicated responsibility, hidden assumptions and architecture debates where participants are solving different systems.",
        [
            { title: "Responsibility is the key test", paragraphs: ["Ask whether Steward is accountable for the behavior, data and lifecycle of a capability. Steward may own service metadata and ownership rules while relying on an external identity provider to establish enterprise identity. That does not make authentication irrelevant; it means identity proof and Steward authorization are different responsibilities.", "Boundaries should be justified through problem ownership. 'The code lives in this repository' is weak justification because repositories can contain multiple systems and one system can span multiple deployables."] },
            { title: "Different boundaries answer different questions", paragraphs: ["System boundary, deployment boundary, organizational ownership boundary, network boundary and trust boundary can overlap, but they are not synonyms. The same Steward deployment could run with PostgreSQL in a separate process, be owned by one engineering team, trust an enterprise IdP differently, and still remain one software system for context modeling."] },
        ],
        ["Write a list of capabilities Steward owns and capabilities it delegates.", "For each disputed capability, justify ownership from the problem statement rather than the codebase.", "Create a small boundary table with system, deployment, organization and trust dimensions.", "Identify one capability that is inside one boundary but outside another.", "Record one boundary decision that could change later without changing Steward's core purpose."],
        ["What makes a system boundary a responsibility decision?", "Why is repository location poor evidence for a system boundary?", "How can deployment and system boundaries differ?"],
        [arc42Context, c4Context],
    ),
    readingLesson(
        "Trust and Ownership Boundaries",
        "Trust boundaries mark where the assumptions the system can safely make change. Ownership boundaries mark where responsibility for change, operation or policy changes hands. They often influence architecture strongly, but they should not be collapsed into one concept.",
        [
            { title: "Trust changes across interfaces", paragraphs: ["Input crossing a trust boundary must be treated according to the assurance available at that boundary. A request from an authenticated browser still requires authorization. Data from another internal service may still need validation. Being 'inside the company network' is not equivalent to being trustworthy.", "Trust should be tied to concrete guarantees: identity proof, authenticated channel, signed token, schema validation, least-privilege access or other evidence. Vague labels such as internal or secure hide assumptions."] },
            { title: "Ownership changes coordination cost", paragraphs: ["When another team owns an identity provider, reporting platform or deployment service, Steward cannot change that dependency unilaterally. The interface becomes a coordination boundary with versioning, support and failure implications.", "A system can cross an ownership boundary without crossing a trust boundary, and vice versa. Modeling both makes hidden dependencies visible before they become operational surprises."] },
            { title: "Boundary review questions", paragraphs: ["For each important interaction ask: who controls the other side, what evidence is trusted, what input must still be validated, what failure can occur, and who must coordinate a change? These questions turn a context drawing into engineering analysis."], code: { language: "text", code: "Boundary: Steward -> Identity Provider\nOwnership: Security / Identity team\nTrust evidence: signed identity token with expected issuer/audience\nStill validate: token claims, expiry, subject mapping\nFailure: provider unavailable or token invalid\nChange coordination: Steward + Identity team", caption: "A boundary becomes useful when its assumptions and ownership are explicit." } },
        ],
        ["Choose three important Steward interactions and mark whether they cross trust, ownership, or both boundaries.", "For each trust boundary, state the evidence Steward relies on and what it must still validate.", "For each ownership boundary, identify the team or role controlling the other side.", "Describe one failure or change-coordination risk created by each boundary.", "Remove any use of 'internal therefore trusted' unless you can replace it with a concrete assurance."],
        ["Why is authenticated traffic not automatically authorized?", "How is an ownership boundary different from a trust boundary?", "What concrete questions should accompany a trust boundary?"],
        [owaspTrust, arc42Context],
    ),
    {
        id: "system-boundaries-and-context-lab-draw-the-steward-api-context",
        title: "Lab: Draw the Steward API Context",
        activities: [
            {
                id: "system-boundaries-and-context-lab-brief",
                title: "Context modeling brief",
                estimatedMinutes: 25,
                content: {
                    type: "reading",
                    body: "This lab converts the prior requirements baseline into a reviewable context and boundary model for Steward API v1. The goal is not a polished picture; it is a model that another engineer can challenge because actors, responsibilities, dependencies, trust assumptions and ownership boundaries are explicit.",
                    blocks: [
                        { type: "heading", id: "scope", text: "Required scope", level: 2 },
                        { type: "list", items: ["Steward shown as one system at context level", "Human actors with explicit goals", "External systems with meaningful relationship labels", "System responsibility boundary", "Ownership boundaries where another team controls an important dependency", "Trust boundaries where assurance changes", "Current versus assumed/planned relationships clearly distinguished"] },
                        { type: "callout", tone: "warning", title: "Do not draw the codebase", body: "Django apps, serializers, models, PostgreSQL tables and modules belong to later modeling levels. Include them here only if they are genuinely external systems, which they normally are not." },
                    ],
                },
            },
            {
                id: "system-boundaries-and-context-lab-practice",
                title: "Build the Steward context model",
                estimatedMinutes: 150,
                content: {
                    type: "practical",
                    objective: "Produce and defend a system context and boundary model for Steward API v1.",
                    scenario: "A new architecture review group must understand what Steward owns, who interacts with it, what it depends on, and where trust or ownership changes before discussing internal architecture.",
                    instructions: ["Start from the Requirements and Problem Framing artifacts, not from the Django package tree.", "Write a one-sentence Steward purpose statement and explicit in-scope/out-of-scope responsibilities.", "Identify human actors by role and attach a goal to every actor.", "Identify current external systems and clearly mark planned or assumed systems separately.", "Draw a context view with Steward as one system and label every relationship with meaningful interaction language.", "Overlay or accompany the view with system-responsibility, ownership and trust-boundary notes.", "For each important trust boundary, record the assurance relied on and validation still required.", "For each important ownership boundary, record who controls the other side and one coordination risk.", "Review the model for accidental implementation detail and remove it.", "Write three questions the model raises for the next module, Modeling Software Systems, rather than answering them prematurely."],
                    deliverables: ["Steward system context diagram", "Boundary and responsibility table", "Trust/ownership boundary notes", "Assumptions and uncertainties list", "Modeling Software Systems handoff questions"],
                    completionCriteria: ["The system is modeled at context level rather than as code structure.", "Every actor and external system relationship has a reason.", "System, ownership and trust boundaries are distinguishable.", "Current facts and assumptions are not mixed.", "A reviewer can challenge the boundary choices from the evidence provided."],
                },
            },
            { id: "system-boundaries-and-context-lab-check", title: "Context review", estimatedMinutes: 20, content: { type: "reflection", prompt: "1. Which boundary decision was hardest to justify from the requirements rather than the implementation?\n2. Which external dependency creates the most important ownership or trust concern?\n3. What did you remove because it belonged to an internal architecture view rather than system context?\n4. Which relationship in the context model is still an assumption?\n5. What question should the next modeling level answer that the context model intentionally does not?" } },
        ],
    },
];
