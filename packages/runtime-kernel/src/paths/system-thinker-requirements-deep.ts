import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const volere: LearningResource = { title: "Volere Requirements Resources", url: "https://www.volere.org/" };
const iso25010: LearningResource = { title: "ISO/IEC 25010 quality model overview", url: "https://iso25000.com/index.php/en/iso-25000-standards/iso-25010" };
const arc42Quality: LearningResource = { title: "arc42 — Quality Requirements", url: "https://docs.arc42.org/section-10/" };
const agileManifesto: LearningResource = { title: "Principles behind the Agile Manifesto", url: "https://agilemanifesto.org/principles.html" };

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function richLesson(
    title: string,
    introduction: string,
    outcomes: string[],
    sections: { title: string; paragraphs: string[]; example?: string }[],
    objective: string,
    instructions: string[],
    questions: string[],
    resources: LearningResource[],
): Lesson {
    const id = `requirements-and-problem-framing-${slug(title)}`;
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: introduction },
        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
        { type: "list", items: outcomes },
    ];

    for (const section of sections) {
        blocks.push({ type: "heading", id: slug(section.title), text: section.title, level: 2 });
        for (const paragraph of section.paragraphs) blocks.push({ type: "paragraph", text: paragraph });
        if (section.example) blocks.push({ type: "callout", tone: "note", title: "Steward example", body: section.example });
    }

    blocks.push({ type: "callout", tone: "steward", title: "System Thinker rule", body: "Treat the current Steward implementation as evidence, not as the definition of the problem. A System Thinker must be able to explain what the organization needs, what the system is responsible for, and which assumptions came from implementation choices rather than stakeholder need." });
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
                    objective,
                    scenario: "Use Steward API v1 as evidence, but reason from the engineering organization's needs rather than reverse-engineering requirements from code alone.",
                    instructions,
                    deliverables: ["Reviewable requirements artifact", "Short reasoning note with uncertainties and evidence"],
                    completionCriteria: ["The artifact distinguishes need from implementation.", "Claims are traceable to evidence or explicitly marked assumptions.", "At least one ambiguity or trade-off is visible rather than silently resolved."],
                },
            },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") } },
        ],
    };
}

export const requirementsAndProblemFramingDeepLessons: Lesson[] = [
    richLesson(
        "From Requests to Problems",
        "A feature request is someone's proposed solution, not necessarily the underlying problem. Systems thinking begins by separating the observed pain, desired outcome, constraints and evidence from the first implementation idea that appears in a ticket or meeting.",
        ["Separate problem statements from solution requests.", "Use outcomes and evidence to frame engineering work.", "Identify assumptions hidden inside stakeholder language.", "Reframe existing Steward features around organizational problems."],
        [
            { title: "Requests often embed solutions", paragraphs: ["'Add a dashboard', 'create a new endpoint' or 'send an email when ownership changes' already prescribe implementation. Before accepting the solution, ask what failure or decision the requester is trying to improve, who experiences it, and how success would be observed.", "A useful problem statement is specific enough to guide work but open enough to allow alternatives. It describes the current condition, affected actors, consequence and desired outcome without prematurely choosing architecture."], example: "Instead of 'add a service-owner dashboard', frame: 'Engineering leads cannot reliably identify the accountable team for production services during incidents, causing escalation delay and stale ownership decisions.'" },
            { title: "Use the existing system as evidence", paragraphs: ["Steward API v1 already contains Team ownership, lifecycle, criticality and environment data. Those choices reveal hypotheses about the problem, but they do not prove the original need. Ask which organizational decisions these fields support and which fields exist mainly because they were convenient to model.", "Good framing may validate the current design, refine it or reveal that some features solve a secondary concern."], example: "The existence of ServiceDependency does not itself prove that every dependency must be modeled. The need might be narrower: identify critical runtime dependencies for incident and change-impact analysis." },
        ],
        "Reframe three current Steward features into underlying organizational problems and outcomes.",
        ["Choose three implemented capabilities such as ownership, environments or dependencies.", "For each, write the apparent feature request and the deeper problem it may address.", "Identify affected actors and the consequence of leaving the problem unsolved.", "Write a measurable or observable outcome without specifying implementation.", "Mark assumptions that need stakeholder validation."],
        ["Why is a feature request not automatically a requirement?", "What belongs in a useful problem statement?", "How can existing code distort problem framing?"],
        [volere, agileManifesto],
    ),
    richLesson(
        "Stakeholders and Actors",
        "Systems are shaped by more people than their direct users. Stakeholders have interests in the outcome; actors interact with the system or participate in processes around it. Distinguishing the two prevents a design from optimizing only for the person clicking the API or UI.",
        ["Distinguish stakeholder from actor.", "Identify direct, indirect and operational stakeholders.", "Map stakeholder goals and conflicts.", "Use actors to clarify system interactions without jumping into endpoint design."],
        [
            { title: "Stakeholders care; actors interact", paragraphs: ["A stakeholder may never call Steward directly. Security, platform leadership, service owners, auditors and incident responders can still have strong interests in data quality, traceability, access and availability. Actors are roles or external systems that participate in interactions.", "Model roles rather than named individuals. 'Platform engineer' remains meaningful when staff changes; a person's name does not."], example: "A service maintainer is an actor who updates ownership data. An engineering director may be a stakeholder who needs trustworthy portfolio visibility but never uses the write API." },
            { title: "Conflicting goals are normal", paragraphs: ["One stakeholder may want richer required metadata while another wants low-friction registration. Security may prefer strict ownership controls while teams want speed. System design is partly the work of making these tensions visible before they become accidental architecture.", "A stakeholder map should therefore include goals, concerns and influence, not merely a list of roles."], example: "Incident responders value fast, trustworthy lookup; service teams value easy maintenance; governance values completeness and auditability. These goals can pull the design in different directions." },
        ],
        "Build a stakeholder and actor map for Steward API v1.",
        ["List direct human actors, external-system actors and indirect stakeholders.", "For each stakeholder, record their goal, concern and evidence they would trust.", "Identify two stakeholder tensions.", "Separate roles from specific people or teams.", "Mark any stakeholder whose needs are currently inferred rather than validated."],
        ["Can someone be a stakeholder without being an actor?", "Why should actor models use roles rather than names?", "What value comes from documenting stakeholder conflict?"],
        [volere],
    ),
    richLesson(
        "Functional Requirements",
        "Functional requirements describe behavior the system must provide to support stakeholder outcomes. Good functional requirements communicate externally meaningful capability and rules without becoming a transcription of controllers, serializers or database tables.",
        ["Write functional requirements in observable terms.", "Separate behavior from implementation mechanism.", "Capture business rules and state-dependent behavior.", "Trace requirements to stakeholder outcomes and acceptance evidence."],
        [
            { title: "Describe observable behavior", paragraphs: ["A functional requirement should state what the system must allow, prevent, derive or expose under defined conditions. It should be testable from the relevant boundary. 'Use Django permissions' is implementation; 'prevent users without the required team role from modifying a team-owned service' is behavior.", "Avoid vague verbs such as support, handle or manage unless the expected behavior is made explicit."], example: "FR-OWN-03: Steward shall reject modification of a Service when the authenticated user does not hold a role authorized to manage the Service's owning Team." },
            { title: "Rules deserve first-class treatment", paragraphs: ["Important domain rules are requirements even when no stakeholder asks for a dedicated screen. Self-dependency prevention, required ownership and constrained lifecycle transitions are behaviors with system consequences.", "State preconditions, trigger, expected outcome and important failure behavior where ambiguity matters."], example: "FR-DEP-02: Steward shall prevent a Service from declaring itself as a dependency and shall return a deliberate conflict/validation response." },
        ],
        "Extract and rewrite Steward functional requirements without copying implementation structure.",
        ["Select ownership, dependency, environment and lifecycle capabilities.", "Write at least eight observable functional requirements.", "For each, identify the stakeholder outcome or rule it supports.", "Remove framework-specific wording unless the framework itself is a constraint.", "Add at least two negative or forbidden behaviors, not only happy paths."],
        ["How does a functional requirement differ from an implementation task?", "Why are forbidden behaviors requirements?", "What makes a requirement observable?"],
        [volere],
    ),
    richLesson(
        "Quality Requirements",
        "Quality requirements describe how well a system must exhibit properties such as reliability, security, performance, maintainability and usability. They become useful only when connected to scenarios and evidence instead of adjectives like fast, scalable or secure.",
        ["Distinguish functional and quality requirements.", "Turn quality adjectives into measurable scenarios.", "Prioritize quality attributes rather than demanding maximum everything.", "Connect Steward quality goals to architectural consequences."],
        [
            { title: "Quality is contextual", paragraphs: ["'Fast' means nothing without workload, operation and threshold. 'Available' means little without period, failure conditions and recovery expectations. Quality scenarios often include source, stimulus, environment, affected artifact, response and response measure.", "Different qualities compete. Stronger consistency checks can increase write latency; richer audit data can increase storage and privacy concerns. Architecture emerges from prioritized qualities and trade-offs."], example: "When an incident responder retrieves a registered production service during normal operation, Steward should return ownership and criticality information within the agreed response threshold for the expected registry size." },
            { title: "Use quality models as prompts, not shopping lists", paragraphs: ["Models such as ISO/IEC 25010 can help teams remember categories they might overlook, but a product should not claim every characteristic as equally important. Select the qualities that change decisions for Steward and explain why.", "A quality requirement without evidence criteria is difficult to validate and easy to reinterpret after implementation."], example: "Security matters because ownership mutation crosses trust boundaries; maintainability matters because Steward is the continuing TSA system; reliability matters because registry data may be needed during incidents." },
        ],
        "Create a prioritized quality-requirement set for Steward.",
        ["Choose five quality attributes that materially affect Steward.", "For each, write one concrete scenario with measurable or reviewable evidence.", "Rank the attributes and explain one trade-off between the top choices.", "Identify one popular quality attribute that is currently not a major driver and explain why.", "Connect at least two quality scenarios to current Builder evidence."],
        ["Why is 'the system must be secure' a weak requirement?", "What makes a quality scenario useful?", "Why must quality attributes be prioritized?"],
        [iso25010, arc42Quality],
    ),
    richLesson(
        "Constraints and Assumptions",
        "Constraints restrict the solution space; assumptions are beliefs being treated as true until validated. Mixing them is dangerous because an untested assumption can become architecture simply by being written with the confidence of a constraint.",
        ["Separate constraints from assumptions.", "Classify technical, organizational, legal and environmental constraints.", "Track assumptions that could invalidate design choices.", "Recognize self-imposed constraints created by the current implementation."],
        [
            { title: "Constraints are not all technical", paragraphs: ["A mandated database, supported deployment environment, identity provider, regulatory rule, delivery deadline or team skill boundary may constrain the design. Some constraints are hard; others are negotiable and should be labelled accordingly.", "Do not elevate current code choices into permanent constraints without evidence. 'Steward uses PostgreSQL today' is an implementation fact. It becomes a constraint only if there is a reason the future solution must continue using PostgreSQL."], example: "Hard constraint: only authenticated organizational users may mutate registry data. Possible implementation fact, not yet hard constraint: all Steward capabilities must remain in one Django deployable." },
            { title: "Assumptions are risks with expiration dates", paragraphs: ["Assume that every team will keep metadata current, that registry size will remain small, or that all dependencies are manually entered—each belief can shape architecture. Make assumptions visible, attach a validation method or trigger, and revisit them when evidence changes.", "Unknowns are healthier than fake certainty. System Thinker work should preserve uncertainty when information is missing."], example: "Assumption A-04: service teams are willing and able to maintain ownership data themselves. Validate through stakeholder interviews or pilot usage before designing heavy self-service workflows around it." },
        ],
        "Build a constraints-and-assumptions register for Steward.",
        ["List at least five constraints and classify their source.", "List at least five assumptions currently visible in Steward or its Builder milestone.", "For each assumption, record impact if false and how it could be validated.", "Identify two current implementation choices that should not automatically become constraints.", "Mark which constraints are hard and which may be negotiable."],
        ["How does an assumption differ from a constraint?", "Why can current technology choices masquerade as requirements?", "What should accompany a high-impact assumption?"],
        [volere],
    ),
    richLesson(
        "Acceptance and Evidence",
        "Acceptance criteria connect a requirement to observable evidence. They reduce interpretation gaps by defining what would convince stakeholders and engineers that a requirement is satisfied without forcing every implementation detail in advance.",
        ["Write acceptance criteria as observable evidence.", "Connect requirements to positive and negative examples.", "Distinguish verification evidence from implementation steps.", "Use evidence to expose ambiguous requirements early."],
        [
            { title: "Acceptance criteria answer what would prove it", paragraphs: ["A requirement can be understandable yet still produce disagreement when tested. Acceptance criteria sharpen boundaries: relevant initial state, action, expected result and failure behavior. They may be executable tests later, but their purpose begins earlier as shared evidence.", "Avoid criteria that merely say 'implemented' or 'works as expected.' They add no information."], example: "Given a maintainer belongs to Team A and Service X is owned by Team B, when the maintainer attempts to update X, the request is denied and X remains unchanged." },
            { title: "Evidence is broader than endpoint tests", paragraphs: ["Functional behavior may be shown through API tests, while quality requirements can require query plans, load measurements, recovery exercises, log inspection or documentation walkthroughs. The evidence type should match the claim.", "If no one can explain what evidence would demonstrate a requirement, the requirement may still be too vague."], example: "For a maintainability requirement, a clean-clone setup exercise by another engineer may be stronger evidence than a unit test." },
        ],
        "Create traceable acceptance evidence for a subset of Steward requirements.",
        ["Choose four functional and three quality requirements from earlier exercises.", "For each, write observable acceptance criteria.", "Include at least one negative case and one state-dependent case.", "Choose the most credible evidence type for each requirement.", "Identify one requirement that became ambiguous while writing acceptance criteria and revise it."],
        ["What question should acceptance criteria answer?", "Why can quality requirements need evidence beyond tests?", "What does difficulty writing acceptance criteria reveal?"],
        [volere, agileManifesto],
    ),
    {
        id: "requirements-and-problem-framing-lab-reframe-steward-api-requirements",
        title: "Lab: Reframe Steward API Requirements",
        activities: [
            {
                id: "requirements-and-problem-framing-lab-reframe-steward-api-requirements-brief",
                title: "Milestone Brief: Reframe Steward Before Modeling It",
                estimatedMinutes: 25,
                content: {
                    type: "reading",
                    body: "Before drawing architecture diagrams, reconstruct the problem Steward is intended to solve. Builder proved that the system can be implemented; System Thinker must now separate stakeholder need from accumulated implementation choices.",
                    blocks: [
                        { type: "heading", id: "goal", text: "Goal", level: 2 },
                        { type: "paragraph", text: "Produce a concise requirements baseline that another engineer can challenge. The baseline must show problem framing, stakeholders, functional behavior, quality drivers, constraints, assumptions and evidence—not a rewritten API specification." },
                        { type: "heading", id: "required-artifacts", text: "Required artifacts", level: 2 },
                        { type: "list", items: ["Problem statement and desired outcomes", "Stakeholder and actor map", "Functional requirement set", "Prioritized quality requirements with scenarios", "Constraints and assumptions register", "Acceptance/evidence matrix", "Open questions and validation plan"] },
                        { type: "callout", tone: "warning", title: "Do not reverse-engineer requirements from code", body: "Builder implementation is evidence. If you simply turn every model field and endpoint into a requirement, you have documented the current solution rather than framed the system." },
                    ],
                },
            },
            {
                id: "requirements-and-problem-framing-lab-reframe-steward-api-requirements-practice",
                title: "Requirements Framing Workshop",
                estimatedMinutes: 180,
                content: {
                    type: "practical",
                    objective: "Turn Steward API v1 into a reviewable problem-and-requirements baseline for the rest of System Thinker.",
                    scenario: "You are preparing Steward for an architecture review. The reviewers know the Builder implementation exists but want to know which organizational problems and requirements actually justify the system before discussing boundaries or components.",
                    instructions: ["Write a problem statement that identifies current organizational pain, affected actors, consequence and desired outcome without naming Django, PostgreSQL or endpoints.", "Create a stakeholder/actor map with goals, concerns and at least two tensions.", "Write 10–15 observable functional requirements covering ownership, services, environments, dependencies, lifecycle/review behavior and access rules.", "Write at least five prioritized quality scenarios and explain two trade-offs among them.", "Create a constraints-and-assumptions register; explicitly downgrade implementation facts that lack evidence as hard constraints.", "Select representative requirements and define acceptance/evidence criteria, including negative behavior.", "Create an open-questions section for assumptions that need interviews, usage data, policy clarification or later technical investigation.", "Trace each important requirement to a stakeholder need or explicit domain rule.", "Review the document and remove any sentence that accidentally prescribes implementation without being a genuine constraint."],
                    deliverables: ["Steward problem statement", "Stakeholder and actor map", "Functional requirement baseline", "Quality-requirement scenarios and priorities", "Constraints and assumptions register", "Acceptance/evidence matrix", "Open questions and validation plan"],
                    completionCriteria: ["The baseline describes the problem independently of the current code structure.", "Stakeholder tensions are visible.", "Functional requirements are observable and include forbidden behavior.", "Quality requirements are scenario-based and prioritized.", "Assumptions are distinguishable from hard constraints.", "Acceptance evidence matches the type of requirement.", "The next System Thinker module can use this baseline to reason about system boundaries."],
                },
            },
            { id: "requirements-and-problem-framing-lab-reframe-steward-api-requirements-check", title: "Requirements Review", estimatedMinutes: 20, content: { type: "reflection", prompt: "1. Which current Steward implementation choice turned out not to be a true requirement?\n2. Which stakeholder tension is most likely to affect architecture later?\n3. Which quality requirement is the strongest architecture driver, and why?\n4. Which assumption creates the greatest risk if it is false?\n5. What evidence would cause you to revise the current problem framing?" } },
        ],
    },
];
