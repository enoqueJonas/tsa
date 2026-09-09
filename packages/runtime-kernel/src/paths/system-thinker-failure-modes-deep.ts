import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const sreBook: LearningResource = { title: "Google SRE Book", url: "https://sre.google/sre-book/table-of-contents/" };
const awsReliability: LearningResource = { title: "AWS Well-Architected Reliability Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html" };
const twelveFactor: LearningResource = { title: "The Twelve-Factor App", url: "https://12factor.net/" };

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
    const id = `failure-modes-${slug(title)}`;
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: introduction },
        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
        { type: "list", items: outcomes },
    ];

    for (const section of sections) {
        blocks.push({ type: "heading", id: slug(section.title), text: section.title, level: 2 });
        for (const text of section.paragraphs) blocks.push({ type: "paragraph", text });
        if (section.code) {
            blocks.push(
                section.code.caption
                    ? { type: "code", language: section.code.language, code: section.code.code, caption: section.code.caption }
                    : { type: "code", language: section.code.language, code: section.code.code },
            );
        }
    }

    blocks.push({
        type: "callout",
        tone: "steward",
        title: "Steward connection",
        body: "Use Steward API v1 as evidence. A failure mode is not hypothetical merely because it has not happened yet; it is credible when the current design, dependency graph, state model or operating assumptions make it possible.",
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
                    scenario: "Review Steward API v1, the dependency map and the data-flow artifacts created in previous System Thinker modules. Analyze credible failure rather than designing a perfect future system.",
                    instructions,
                    deliverables: ["Failure analysis artifact", "Short evidence note with assumptions, detection signals and current mitigations"],
                    completionCriteria: ["Failure causes and effects are separated.", "Detection is described independently from prevention.", "Current mitigation is distinguished from proposed improvement."],
                },
            },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") } },
        ],
    };
}

export const failureModesDeepLessons: Lesson[] = [
    richLesson(
        "Thinking in Failure Modes",
        "Systems thinking becomes useful when the happy path stops being the only path. Failure-mode analysis asks how the system can become unavailable, incorrect, inconsistent, slow or misleading, what users experience, how engineers detect it and what limits the damage.",
        ["Distinguish failure cause, failure mode and user-visible effect.", "Use blast radius and detectability to prioritize analysis.", "Separate prevention, detection, containment and recovery.", "Treat assumptions as possible failure sources."],
        [
            { title: "Failure is a chain", paragraphs: ["A database connection timeout is a cause or triggering condition. The application returning 500 for every service lookup is a system failure mode. An engineer being unable to discover the owner of a production service during an incident is the operational impact. Mixing these levels makes mitigation vague.", "A useful failure analysis therefore traces cause → system behavior → user effect → detection → containment → recovery. This is closer to engineering than writing a generic list of things that could go wrong."] },
            { title: "Prioritize by consequence and evidence", paragraphs: ["Not every imaginable failure deserves equal treatment. Start with high-criticality Steward use cases, trust boundaries, state transitions and dependencies identified earlier. Consider impact, likelihood, detectability, duration and blast radius.", "A rare failure with severe organizational impact may deserve more attention than a frequent cosmetic failure. A failure that is silent can be more dangerous than one that immediately returns an obvious error."], code: { language: "text", code: "Failure scenario: stale service owner data\nCause: ownership changed outside Steward\nSystem behavior: registry still returns previous owner\nEffect: incident escalation goes to the wrong team\nDetection: periodic ownership review or failed contact\nCurrent mitigation: manual review\nRecovery: correct ownership record and audit affected services", caption: "Separate cause, behavior, impact, detection and recovery." } },
        ],
        "Build a first failure-mode inventory for three critical Steward capabilities.",
        ["Choose three important Steward capabilities from the requirements baseline.", "For each, write one credible failure cause and the resulting system behavior.", "Describe the user or operational impact.", "Record how the failure would be detected today.", "Classify current controls as prevention, detection, containment or recovery."],
        ["Why is a timeout not automatically the full failure mode?", "Why should detectability influence prioritization?", "What is the difference between containment and recovery?"],
        [sreBook, awsReliability],
    ),
    richLesson(
        "Dependency Failure",
        "Every dependency creates a failure relationship. A system can fail because a dependency is unavailable, slow, inconsistent, incompatible or reachable but semantically wrong. Dependency analysis must therefore go beyond drawing arrows.",
        ["Analyze hard and soft dependency failure.", "Distinguish unavailable, slow and incorrect dependency behavior.", "Reason about timeout, retry and fallback consequences.", "Identify cascading-failure paths."],
        [
            { title: "Dependencies fail in more than one way", paragraphs: ["PostgreSQL can reject connections, accept connections but respond slowly, return errors during a transaction, or preserve data that is valid structurally but wrong semantically. An identity provider can be reachable while issuing claims that no longer match Steward authorization expectations.", "The system response should be based on the dependency's role. If Steward cannot prove authorization, failing closed is safer than guessing. If a non-critical enrichment source is unavailable, a degraded response may be acceptable if the contract says so."] },
            { title: "Retries can create load and duplication", paragraphs: ["Retries are not free resilience. When a dependency is overloaded, synchronized retries can increase pressure. When an operation is not idempotent, retrying after an ambiguous timeout can create duplicate state.", "For each dependency relationship, record timeout ownership, retry policy, idempotency assumptions and whether failure should fail closed, fail open or degrade explicitly."], code: { language: "text", code: "Dependency: PostgreSQL\nUse: authoritative Steward registry state\nIf unavailable: API mutation fails; reads may fail unless a proven cache exists\nTimeout owner: API\nRetry: bounded, operation-aware\nFallback: none for authoritative writes\nRisk: retry storm / ambiguous transaction outcome", caption: "A dependency record should include failure semantics, not only purpose." } },
        ],
        "Analyze one authoritative Steward dependency and one non-authoritative dependency scenario.",
        ["Pick PostgreSQL and one other current or planned external dependency.", "List unavailable, slow and incorrect-response failure modes.", "Define the required system response for each.", "Record retry/idempotency assumptions.", "Identify one plausible cascading failure and how its blast radius could be limited."],
        ["Why can a reachable dependency still be failed?", "When is failing closed appropriate?", "How can retries worsen an outage?"],
        [sreBook, awsReliability],
    ),
    richLesson(
        "Invalid and Partial State",
        "Some of the most expensive failures are not total outages. The system remains online while its state is incomplete, contradictory or only partly updated. These failures are dangerous because normal availability checks may still be green.",
        ["Distinguish invalid state from unavailable state.", "Identify atomicity boundaries and partial-update risk.", "Reason about invariants across related records.", "Design detection for silent inconsistency."],
        [
            { title: "Partial success creates semantic failure", paragraphs: ["Suppose Steward creates a Service record but fails before required production-environment metadata is persisted. If the transaction boundary is too narrow, the API may leave a service that exists but violates a business invariant. The system is available, yet its registry state is misleading.", "Database constraints can prevent some invalid states, application transactions can make related changes atomic, and reconciliation can detect inconsistencies that span systems. None of these controls replaces the others."] },
            { title: "Invariants reveal what must move together", paragraphs: ["Use previously identified Steward invariants: every Service has an owning Team, self-dependencies are forbidden, duplicate dependencies are forbidden, lifecycle transitions have guards, and production-related records require stronger metadata. For each invariant, ask where enforcement exists and what happens if execution stops midway.", "If an invariant spans multiple systems, a local database transaction cannot make the entire workflow atomic. You then need explicit state, idempotency, compensation or reconciliation rather than pretending the distributed operation is one transaction."], code: { language: "text", code: "Invariant: a production Service must have valid ownership and environment metadata\nAtomic locally? ownership + environment rows may be transactionally coordinated\nCross-system dependency? identity/team source may not be\nSilent failure risk: stale owner remains technically valid\nDetection: scheduled reconciliation / review age / ownership verification", caption: "Model both structural and semantic consistency." } },
        ],
        "Trace one Steward mutation and identify where partial or contradictory state could survive.",
        ["Choose service registration, dependency creation or lifecycle transition.", "Mark every persistent state change.", "Identify the local transaction boundary.", "List invariants that must hold before and after the operation.", "Describe one interruption point and whether rollback, compensation or reconciliation is required."],
        ["Why can a healthy endpoint still hide serious failure?", "What can a database constraint guarantee that application code cannot guarantee alone?", "Why can a local transaction not solve cross-system atomicity?"],
        [awsReliability],
    ),
    richLesson(
        "Resource Exhaustion",
        "Systems can fail while every dependency is technically healthy because finite resources run out. Connections, worker capacity, memory, disk, file descriptors, request queues and database locks all impose limits that architecture diagrams often hide.",
        ["Identify finite resources in an application path.", "Explain saturation and queue growth.", "Recognize unbounded work as a reliability risk.", "Distinguish overload protection from capacity planning."],
        [
            { title: "Finite capacity changes system behavior", paragraphs: ["A Steward endpoint that performs an expensive unbounded search can consume database CPU and connections even when PostgreSQL has no defect. A surge of requests can fill worker capacity, causing queueing, higher latency and eventually timeouts. Those timeouts may trigger retries that create even more load.", "Resource exhaustion is often nonlinear: the system appears fine until utilization crosses a threshold and waiting work compounds. Therefore bounded pagination, connection limits and controlled request sizes are architecture-relevant behaviors, not mere optimization details."] },
            { title: "Protect the system under overload", paragraphs: ["Useful controls include limits, backpressure, bounded queues, timeouts, admission control, pagination, rate limiting and graceful degradation. The right choice depends on the workload and criticality.", "Capacity planning asks whether normal and expected peak demand fit available resources. Overload protection asks what happens when demand exceeds them anyway. A reliable design needs both."], code: { language: "text", code: "Potential Steward saturation chain:\nlarge unbounded query\n→ long DB execution\n→ connection held longer\n→ pool saturation\n→ request queue growth\n→ API latency/timeouts\n→ client retries\n→ more load", caption: "Resource exhaustion can cascade without any component being 'down'." } },
        ],
        "Create a saturation chain for one Steward endpoint and identify bounded-work controls.",
        ["Choose a list/search or mutation endpoint.", "Trace CPU, memory, worker, connection and database resources used.", "Identify any unbounded input or result size.", "Describe what users observe as saturation increases.", "Record at least two controls and which layer owns them."],
        ["Why is resource exhaustion different from dependency outage?", "What is the relationship between queue growth and latency?", "How does overload protection differ from capacity planning?"],
        [sreBook, awsReliability],
    ),
    richLesson(
        "Human and Operational Failure",
        "The system includes people, procedures, configuration and deployment actions. A design that assumes operators never make mistakes is incomplete. Human failure should be analyzed without treating people as defective components; the goal is to make common mistakes harder and recovery easier.",
        ["Model configuration and operational actions as system inputs.", "Identify dangerous manual steps and permission paths.", "Use guardrails and reversibility to limit damage.", "Distinguish individual error from systemic conditions that enable it."],
        [
            { title: "Operations change system state", paragraphs: ["Wrong environment variables, incorrect secrets, an unsafe migration, accidental privilege assignment or a mistaken lifecycle change can all damage Steward while the application code is unchanged. These are system failure modes because the system includes the operating process.", "Operational controls should make destructive actions visible, deliberate and reversible where possible. Examples include migration review, least privilege, environment separation, backups, audit trails and dry-run or confirmation mechanisms for risky administrative actions."] },
            { title: "Design for recovery, not blame", paragraphs: ["A useful analysis asks why an error was possible, why it was not detected earlier and how much damage one action could cause. If a single typo can silently point production at the wrong database, stronger configuration validation is more valuable than reminding engineers to type carefully.", "Runbooks and documentation help, but documentation alone is a weak control for high-risk actions. Prefer automated validation and constrained permissions when the consequences justify them."], code: { language: "text", code: "Scenario: operator assigns wrong Team as service owner\nImmediate effect: authorization + escalation semantics change\nDetection: audit event / owner review / user report\nContainment: limited admin scope, explicit confirmation\nRecovery: restore correct owner, inspect dependent permissions, preserve audit history", caption: "Analyze the conditions and blast radius around an operational mistake." } },
        ],
        "Analyze one configuration mistake and one privileged operational mistake in Steward.",
        ["Choose a realistic configuration error.", "Choose a privileged user or operator action that could damage registry correctness.", "For each, describe blast radius and detection.", "Identify one preventive guardrail and one recovery mechanism.", "Explain why the proposed control is stronger than documentation alone."],
        ["Why are operator actions part of the system model?", "What makes a control a guardrail rather than a reminder?", "Why is reversibility important?"],
        [twelveFactor, sreBook],
    ),
    {
        id: "failure-modes-lab-analyze-steward-api-failure-scenarios",
        title: "Lab: Analyze Steward API Failure Scenarios",
        activities: [
            {
                id: "failure-modes-lab-analyze-steward-api-failure-scenarios-brief",
                title: "Build a failure portfolio from real Steward evidence",
                estimatedMinutes: 25,
                content: {
                    type: "reading",
                    body: "This lab converts the previous architecture, dependency and data-flow work into a failure portfolio. The goal is not to imagine every disaster. Select credible scenarios that expose important consequences, silent inconsistency, overload or operational risk.",
                    blocks: [
                        { type: "heading", id: "required-scenarios", text: "Required scenarios", level: 2 },
                        { type: "list", items: ["One database/dependency failure", "One invalid or partial-state failure", "One resource-exhaustion path", "One human/configuration or privileged-operation failure", "One failure inherited from the Data Flow and Integration module"] },
                        { type: "heading", id: "analysis-fields", text: "Analyze each scenario", level: 2 },
                        { type: "list", items: ["Trigger or cause", "System failure mode", "User/operational effect", "Blast radius", "Detection signal and expected time to detect", "Current prevention/containment/recovery", "Known gap", "Evidence from current Steward implementation or design artifacts"] },
                        { type: "callout", tone: "warning", title: "Do not silently redesign Steward", body: "This is analysis first. Record gaps and candidate mitigations, but do not turn the lab into a resilience rewrite. Reliability implementation belongs to later schools." },
                        { type: "resources", title: "Core references", resources: [sreBook, awsReliability] },
                    ],
                },
            },
            {
                id: "failure-modes-lab-analyze-steward-api-failure-scenarios-practice",
                title: "Analyze Steward failure scenarios",
                estimatedMinutes: 180,
                content: {
                    type: "practical",
                    objective: "Produce an evidence-backed failure-mode portfolio for Steward API v1 that another engineer can review and challenge.",
                    scenario: "A design review is preparing Steward for later platform, reliability and security work. Reviewers need to understand how the current system fails before they decide what resilience mechanisms are justified.",
                    instructions: ["Reuse the dependency graph and important data flows from previous modules.", "Select at least five required failure scenarios from different categories.", "For each scenario, separate cause, failure mode and consequence.", "Record blast radius and whether failure is obvious or silent.", "Identify concrete detection signals rather than saying 'monitor it'.", "Classify current controls as prevention, detection, containment or recovery.", "Record current gaps and candidate mitigations without implementing speculative infrastructure.", "Rank the scenarios by engineering priority and explain the ranking.", "Write one architecture question that should feed the Architecture Decisions and Trade-offs module."],
                    deliverables: ["Failure-mode portfolio with at least five scenarios", "Priority ranking with rationale", "Detection-and-control matrix", "Architecture decision question for the next module"],
                    completionCriteria: ["The portfolio includes dependency, state, saturation and operational failure.", "At least one scenario is a silent correctness failure rather than an outage.", "Detection signals are concrete and distinct from prevention.", "Current controls and proposed improvements are clearly separated.", "Priorities are justified by impact, blast radius, detectability and evidence."],
                },
            },
            {
                id: "failure-modes-lab-analyze-steward-api-failure-scenarios-review",
                title: "Failure Modes: Exit Review",
                estimatedMinutes: 20,
                content: {
                    type: "reflection",
                    prompt: "1. Which Steward failure is most dangerous because it can remain silent?\n2. Which dependency failure has the largest blast radius today, and what evidence supports that conclusion?\n3. Which resource can saturate first on one critical path?\n4. Which current mitigation merely detects a problem rather than preventing it?\n5. Which proposed mitigation should not be implemented until an architecture trade-off is evaluated?\n6. What architecture decision question now deserves formal treatment?",
                },
            },
        ],
    },
];
