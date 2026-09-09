import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const sequenceDiagrams: LearningResource = { title: "Sequence diagrams", url: "https://www.uml-diagrams.org/sequence-diagrams.html" };
const httpSemantics: LearningResource = { title: "HTTP Semantics", url: "https://www.rfc-editor.org/rfc/rfc9110" };
const twelveFactor: LearningResource = { title: "The Twelve-Factor App", url: "https://12factor.net/" };
const c4Model: LearningResource = { title: "C4 model", url: "https://c4model.com/" };

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function richLesson(
    title: string,
    introduction: string,
    outcomes: string[],
    sections: { title: string; paragraphs: string[]; code?: { language: string; code: string; caption?: string | undefined } }[],
    objective: string,
    instructions: string[],
    questions: string[],
    resources: LearningResource[],
): Lesson {
    const id = `data-flow-and-integration-${slug(title)}`;
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
        body: "Trace Steward flows across authorization, domain rules, persistence and integration boundaries. A useful flow model shows where data changes meaning, ownership or assurance—not every function call.",
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
                    scenario: "Use Steward API v1, its system/component models and actual implementation evidence. Model externally meaningful flow, state and failure rather than source-code call order.",
                    instructions,
                    deliverables: ["Reviewable data-flow or interaction artifact", "Reasoning note covering boundaries, state, contracts and failure assumptions"],
                    completionCriteria: ["The flow begins with a real actor or trigger.", "State-changing and trust-changing boundaries are visible.", "Failure and partial-success behavior are explicit."],
                },
            },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") } },
        ],
    };
}

export const dataFlowAndIntegrationDeepLessons: Lesson[] = [
    richLesson(
        "Following Data Through a System",
        "A request does not simply travel from endpoint to database. Data is interpreted, validated, authorized, transformed, persisted and returned. Following those transitions exposes where invariants are enforced and where bad assumptions can enter the system.",
        ["Trace a flow from actor intent to durable state.", "Identify transformations and validation points.", "Distinguish data movement from state change.", "Recognize hidden reads and side effects that matter to correctness."],
        [
            { title: "Start with intent, not endpoints", paragraphs: ["A useful Steward flow starts with an engineering goal such as registering a service, adding a dependency or changing lifecycle. The HTTP request is one implementation step inside that story.", "Record the actor, input contract, authentication context, authorization decision, domain validation, persistence operation and externally visible result. This makes missing rules easier to spot than a controller-to-repository diagram."] },
            { title: "Mark every point where meaning changes", paragraphs: ["A service slug arrives as user input, becomes a validated domain identifier, then becomes persisted registry state. Ownership claims arrive from authentication context, become authorization evidence and may affect which mutation is permitted. These changes in meaning matter more than every function boundary."], code: { language: "text", code: "Engineer intent\n  → POST /services\n  → authenticate identity\n  → authorize team membership\n  → validate lifecycle + ownership invariants\n  → persist Service\n  → return representation\n  → emit operational evidence", caption: "A flow should expose interpretation and enforcement points." } },
        ],
        "Trace one state-changing Steward use case from actor intent to durable data.",
        ["Choose create service, add dependency or lifecycle change.", "Identify the actor and required authorization context.", "List validation and domain-rule points.", "Mark every database read/write that affects the decision.", "Record response and logging side effects.", "Identify one hidden dependency revealed by the trace."],
        ["Why should a flow begin with actor intent?", "What is the difference between moving data and changing state?", "Which transformations should be visible in a system flow?"],
        [sequenceDiagrams, httpSemantics],
    ),
    richLesson(
        "Synchronous and Asynchronous Boundaries",
        "A synchronous call makes one activity wait for another. An asynchronous boundary decouples timing, but introduces delivery, ordering and observability concerns. The choice changes failure semantics and operational responsibility.",
        ["Explain synchronous request/response coupling.", "Explain what asynchronous processing solves and what it complicates.", "Identify when eventual consistency is acceptable.", "Avoid introducing queues merely because they appear more scalable."],
        [
            { title: "Synchronous calls couple latency and availability", paragraphs: ["If Steward must call another service before returning a response, the dependency's latency and availability become part of Steward's user-visible behavior. This may be appropriate when the result is required to decide whether the request can succeed.", "A synchronous boundary is not bad by default. It is explicit coordination. The question is whether that coordination belongs in the critical path."] },
            { title: "Asynchrony changes the contract", paragraphs: ["Moving work to a queue or background worker means the original request may succeed before the downstream effect completes. The system then needs identifiers, retry policy, duplicate handling, status visibility and a definition of what 'accepted' means.", "For future Steward integrations, sending a notification after a lifecycle change may tolerate asynchronous delivery. Validating authorization for the lifecycle change itself should not be deferred as if correctness were optional."], code: { language: "text", code: "Synchronous: request → dependency → result → response\nAsynchronous: request → durable acceptance → response\n                         ↓\n                    worker/event\n                         ↓\n                    downstream effect", caption: "Asynchrony removes waiting but creates a second lifecycle to operate." } },
        ],
        "Classify candidate Steward interactions as synchronous or asynchronous and justify each decision.",
        ["List three interactions in or around Steward.", "For each, ask whether downstream success is required before the caller can receive a correct answer.", "Identify acceptable delay and consistency expectations.", "For one asynchronous candidate, define retry, duplicate and visibility requirements.", "Record why a queue is or is not justified."],
        ["What coupling does a synchronous call create?", "What new responsibilities appear after introducing asynchrony?", "Why is eventual consistency a product/domain decision as well as a technical one?"],
        [twelveFactor, sequenceDiagrams],
    ),
    richLesson(
        "Integration Contracts",
        "An integration is not just a URL or library call. It is a contract about identity, data shape, semantics, timing, errors, versioning and ownership. Integration reliability begins with making those expectations reviewable.",
        ["Describe an integration contract beyond request fields.", "Separate transport details from semantic guarantees.", "Identify versioning and compatibility expectations.", "Document ownership and change coordination for external dependencies."],
        [
            { title: "Contracts include semantics", paragraphs: ["A 200 response only tells you transport-level success unless the contract explains what the payload means. A dependency graph endpoint must define whether missing services are errors, whether duplicate edges are idempotent and which identifiers remain stable.", "Capture preconditions, postconditions, idempotency, authentication method, error taxonomy, timeouts and ownership. These become architecture evidence rather than tribal knowledge."] },
            { title: "Compatibility is a dependency concern", paragraphs: ["When another team changes an API, schema or event shape, Steward may break even if its own code did not change. Contract ownership therefore includes versioning policy and a way to detect incompatible changes before production.", "Internally, database schemas and shared packages are contracts too. A direct table read from another service can be a stronger and more dangerous integration than a well-defined HTTP API."], code: { language: "json", code: "{\n  \"code\": \"service_dependency_conflict\",\n  \"message\": \"This dependency already exists.\",\n  \"details\": { \"dependency_service_id\": 17 }\n}", caption: "Stable error semantics are part of an API contract." } },
        ],
        "Write an integration contract sheet for one current or plausible Steward boundary.",
        ["Name provider, consumer and owner.", "Define purpose and semantic guarantees.", "Define identifiers, authentication and data shape.", "Define timeout, error and retry expectations.", "State idempotency behavior.", "State versioning/change-notification expectations.", "Record one compatibility test that could detect breakage."],
        ["Why is a schema alone not a complete contract?", "What should idempotency tell a consumer?", "Why does ownership belong in integration documentation?"],
        [httpSemantics, c4Model],
    ),
    richLesson(
        "Failure Across Integrations",
        "Once a flow crosses a dependency boundary, failure stops being binary. Timeouts, partial success, duplicate attempts, stale reads and ambiguous outcomes can all occur. Good system reasoning defines what the caller may safely assume after each failure.",
        ["Distinguish explicit errors from ambiguous outcomes.", "Reason about partial success across boundaries.", "Use retry only when semantics make it safe.", "Identify observability needed to diagnose distributed failures."],
        [
            { title: "Timeout does not mean nothing happened", paragraphs: ["If Steward sends a state-changing request to an external dependency and times out, the remote operation may have completed. Blind retry can therefore duplicate the effect unless the contract is idempotent or carries a stable operation key.", "The crucial question is not only 'what error do we return?' but 'what state might now exist on each side?'" ] },
            { title: "Design for partial and ambiguous state", paragraphs: ["For a multi-step flow, document which step is authoritative, what can be compensated, what must be retried and what requires human investigation. A transactional database can make local changes atomic, but it cannot automatically create a transaction across unrelated services.", "Logs and correlation identifiers should let operators connect the actor request with downstream attempts. Otherwise the system may be recoverable in theory but impossible to diagnose in practice."], code: { language: "text", code: "Request ID: req-8f2\n1. Steward validates lifecycle change       ✓\n2. Steward commits local lifecycle state   ✓\n3. Notification dependency times out       ?\n4. Caller receives success + notification pending\n\nKey question: which effect defines the business transaction?", caption: "Partial failure requires an explicit definition of authoritative success." } },
        ],
        "Analyze one Steward integration failure and specify safe behavior.",
        ["Choose a synchronous or asynchronous boundary.", "List timeout, explicit rejection and partial-success cases.", "For each case, state what is known and unknown about remote state.", "Decide whether retry is safe and why.", "Define correlation/observability evidence.", "Record one scenario that should require manual investigation rather than automatic recovery."],
        ["Why can a timeout be ambiguous?", "When is automatic retry unsafe?", "What does an operator need to reconstruct a cross-boundary failure?"],
        [httpSemantics, twelveFactor],
    ),
    {
        id: "data-flow-and-integration-lab-model-steward-api-data-flows",
        title: "Lab: Model Steward API Data Flows",
        activities: [
            {
                id: "data-flow-and-integration-lab-model-steward-api-data-flows-brief",
                title: "Trace behavior across boundaries",
                estimatedMinutes: 25,
                content: {
                    type: "reading",
                    body: "This lab turns the component/dependency model into behavior. You will trace important Steward flows end to end, showing state, trust, contracts and failure semantics rather than drawing generic arrows between components.",
                    blocks: [
                        { type: "heading", id: "required-flows", text: "Required flows", level: 2 },
                        { type: "list", items: ["Register a new Service", "Add a ServiceDependency", "Change a Service lifecycle state", "One integration-oriented flow with an explicit failure path"] },
                        { type: "heading", id: "what-to-show", text: "What every flow must show", level: 2 },
                        { type: "list", items: ["Actor or trigger", "Authentication and authorization context", "Validation and domain rules", "Important reads and writes", "State transitions", "Boundary contracts", "Success response/evidence", "At least one realistic failure path"] },
                        { type: "callout", tone: "warning", title: "Do not draw call stacks", body: "The goal is not to reproduce every serializer, function and ORM method. Show the steps that change meaning, state, trust or responsibility." },
                        { type: "resources", title: "Core references", resources: [sequenceDiagrams, httpSemantics] },
                    ],
                },
            },
            {
                id: "data-flow-and-integration-lab-model-steward-api-data-flows-practice",
                title: "Build the Steward flow set",
                estimatedMinutes: 180,
                content: {
                    type: "practical",
                    objective: "Produce an evidence-backed set of Steward data-flow and interaction models that expose state changes, contracts and failure behavior.",
                    scenario: "A design review needs to understand not just what components exist, but how real Steward operations behave across authentication, authorization, domain, persistence and integration boundaries.",
                    instructions: ["Reuse the approved context, component and dependency artifacts.", "Trace the three required Steward domain flows from actor intent to durable result.", "For each flow, mark where data is validated, transformed or used as authorization evidence.", "Mark the transaction boundary and state changes.", "Add one integration-oriented flow and model synchronous/asynchronous choice explicitly.", "For that flow, model timeout, retry/duplicate and partial-success semantics.", "Add correlation/observability expectations.", "Compare the modeled flow with current code and record mismatches as findings rather than silently rewriting the model.", "Finish with one failure question that should feed the next module, Failure Modes."],
                    deliverables: ["Three domain flow diagrams", "One integration/failure flow", "Contract notes", "State/transaction notes", "Implementation mismatch findings", "Failure Modes handoff question"],
                    completionCriteria: ["Each flow begins with actor intent and ends with observable outcome.", "Authorization and domain invariants are visible where they matter.", "Database transaction boundaries are not confused with cross-service atomicity.", "At least one ambiguous or partial integration failure is analyzed.", "The diagrams can be challenged against implementation evidence."],
                },
            },
            {
                id: "data-flow-and-integration-lab-model-steward-api-data-flows-review",
                title: "Flow Review",
                estimatedMinutes: 20,
                content: {
                    type: "reflection",
                    prompt: "1. Which Steward flow revealed the most hidden coupling?\n2. Where is the authoritative transaction boundary for each flow?\n3. Which integration failure leaves state ambiguous?\n4. Which retries are safe, and what makes them safe?\n5. What implementation mismatch should System Thinker preserve for later architectural work rather than fixing immediately?\n6. What failure scenario should the next module analyze first?",
                },
            },
        ],
    },
];
