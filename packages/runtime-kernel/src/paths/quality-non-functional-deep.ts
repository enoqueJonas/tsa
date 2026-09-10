import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const k6: LearningResource = { title: "Grafana k6 documentation", url: "https://grafana.com/docs/k6/latest/" };
const wcag: LearningResource = { title: "W3C Web Content Accessibility Guidelines (WCAG)", url: "https://www.w3.org/WAI/standards-guidelines/wcag/" };
const mdnCompatibility: LearningResource = { title: "MDN Browser Compatibility Data", url: "https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Compatibility_tables" };
const postgresTransactions: LearningResource = { title: "PostgreSQL Transaction Isolation", url: "https://www.postgresql.org/docs/current/transaction-iso.html" };

type Spec = {
    id: string;
    title: string;
    intro: string;
    principles: string[];
    steward: string[];
    practice: string[];
    questions: string[];
    code?: string;
    language?: string;
    warning?: string;
};

function blocksFor(spec: Spec): LessonBlock[] {
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: spec.intro },
        { type: "heading", id: `${spec.id}-principles`, text: "Core principles", level: 2 },
        { type: "list", items: spec.principles },
        { type: "heading", id: `${spec.id}-steward`, text: "Apply it to Steward", level: 2 },
        ...spec.steward.map((text): LessonBlock => ({ type: "paragraph", text })),
    ];

    if (spec.code) {
        blocks.push({ type: "code", language: spec.language ?? "text", code: spec.code });
    }

    if (spec.warning) {
        blocks.push({ type: "callout", tone: "warning", title: "Quality risk", body: spec.warning });
    }

    blocks.push({
        type: "callout",
        tone: "steward",
        title: "Stewardship boundary",
        body: "This module establishes quality evidence and baselines. It does not replace the later Security Steward or Reliability Engineer schools. Keep the focus on measurable product risk, reproducible evidence and clear residual uncertainty.",
    });
    blocks.push({ type: "resources", title: "Continue learning", resources: [k6, wcag, mdnCompatibility, postgresTransactions] });

    return blocks;
}

function lessonFrom(spec: Spec): Lesson {
    return {
        id: `non-functional-${spec.id}`,
        title: spec.title,
        activities: [
            {
                id: `non-functional-${spec.id}-001`,
                title: spec.title,
                estimatedMinutes: 45,
                content: { type: "reading", body: spec.intro, blocks: blocksFor(spec) },
            },
            {
                id: `non-functional-${spec.id}-002`,
                title: `Apply: ${spec.title}`,
                estimatedMinutes: 55,
                content: {
                    type: "practical",
                    objective: `Apply ${spec.title} to the real Steward system.`,
                    scenario: "Use the deployed Steward environment and the automation/evidence discipline built in earlier Quality Steward modules. Define the risk before choosing a tool, workload or assertion.",
                    instructions: spec.practice,
                    deliverables: ["Executable or repeatable quality check", "Captured measurements and environment/release identity", "Short findings and residual-risk note"],
                    completionCriteria: ["The test answers a stated quality question.", "The result is reproducible enough to compare across runs.", "The learner can explain what the result does not prove."],
                },
            },
            {
                id: `non-functional-${spec.id}-003`,
                title: `Knowledge Check: ${spec.title}`,
                estimatedMinutes: 10,
                content: {
                    type: "reflection",
                    prompt: spec.questions.join(" "),
                    minimumCharacters: 200,
                },
            },
        ],
    };
}

const specs: Spec[] = [
    {
        id: "performance",
        title: "Performance Testing",
        intro: "Performance testing measures how a system behaves under a defined workload. A latency number without workload, data volume, release identity and environment context is not a useful baseline; it is merely a measurement detached from meaning.",
        principles: [
            "Start from a user or system risk: slow service search, slow registration, saturated database connections or degraded dependency traversal.",
            "Define workload shape, concurrency, data set, warm-up, duration and success thresholds before execution.",
            "Track distributions such as p50, p95 and p99 rather than averages alone.",
            "Measure errors and throughput together with latency so a fast stream of failures cannot look healthy.",
            "Preserve exact Steward release and environment identity for every run.",
        ],
        steward: [
            "For Steward, a useful first target is service-registry lookup and registration. The learner should distinguish read-heavy catalog traffic from write paths that validate ownership, dependencies and lifecycle rules.",
            "A baseline is a comparison point, not a universal SLA. It becomes useful when later runs can show whether the same workload materially improved or regressed.",
        ],
        practice: [
            "Choose one high-value Steward API flow and write a performance hypothesis.",
            "Define request rate or virtual-user workload, test duration and measurable thresholds.",
            "Run the workload against a controlled environment and capture latency percentiles, throughput and errors.",
            "Record release, environment, dataset assumptions and any infrastructure limitations."],
        questions: ["Why is an average response time insufficient?", "What context must accompany a performance number before it can influence a release decision?"],
        code: "import http from 'k6/http';\nimport { check } from 'k6';\n\nexport const options = {\n  vus: 10,\n  duration: '60s',\n  thresholds: {\n    http_req_failed: ['rate<0.01'],\n    http_req_duration: ['p(95)<500'],\n  },\n};\n\nexport default function () {\n  const res = http.get(`${__ENV.BASE_URL}/api/services/`);\n  check(res, { 'status is 200': (r) => r.status === 200 });\n}",
        language: "javascript",
        warning: "Do not treat thresholds copied from another product as Steward requirements. Thresholds should come from risk, product expectations and observed system capability.",
    },
    {
        id: "load-models",
        title: "Load, Stress, Spike and Endurance",
        intro: "Different workload models answer different questions. Load testing studies expected demand; stress testing explores behavior beyond expected capacity; spike testing studies abrupt change; endurance testing looks for degradation that appears only over time.",
        principles: [
            "Load: can Steward satisfy expected concurrent usage with acceptable latency and errors?",
            "Stress: how does Steward degrade as demand exceeds expected capacity, and is failure controlled?",
            "Spike: can sudden traffic changes be absorbed without corruption or prolonged instability?",
            "Endurance: do resources, queues, connections or caches degrade across sustained execution?",
            "Recovery behavior matters as much as the point at which degradation begins.",
        ],
        steward: [
            "A service registry may have modest average traffic but still experience bursts during incident response, release windows or organization-wide inventory activity. Workload design should reflect plausible operating behavior rather than arbitrary high numbers.",
            "When a stress test discovers a limit, record the symptom and recovery behavior. Capacity engineering belongs later; Quality Steward is establishing evidence and identifying risk."],
        practice: [
            "Design one load profile and one deliberately different stress/spike/endurance profile for Steward.",
            "State what each profile is intended to reveal.",
            "Execute a safe subset in a non-production environment.",
            "Compare healthy behavior, degradation and recovery without treating destructive saturation as the default goal."],
        questions: ["How does a stress test answer a different question from a load test?", "Why should recovery be measured after a spike or stress condition?"],
    },
    {
        id: "accessibility",
        title: "Accessibility Fundamentals",
        intro: "Accessibility is a product-quality concern: people should be able to perceive, understand and operate the system using different abilities, input methods and assistive technologies. Automated scanners are useful, but they cannot prove accessibility on their own.",
        principles: [
            "Use semantic HTML and accessible names so controls expose meaning to assistive technology.",
            "Keyboard-only navigation should reach and operate interactive functionality in a sensible order.",
            "Focus visibility, form labels, error association and heading structure are testable behaviors.",
            "Automated rules catch important classes of defects but require human review for usability and context.",
            "Use WCAG as a structured reference, not as a checkbox generator detached from user behavior.",
        ],
        steward: [
            "Steward's service catalog, ownership forms and dependency management surfaces should be operable without a mouse. Validation errors must identify the affected field in a way a screen reader can associate with the input.",
            "A practical quality baseline combines automated scanning with selected manual keyboard and semantic checks on critical workflows."],
        practice: [
            "Choose one critical Steward browser flow.",
            "Run an automated accessibility scan and classify findings rather than blindly accepting the tool output.",
            "Repeat the flow keyboard-only and inspect focus order, visible focus and error handling.",
            "Inspect accessible names/headings for the critical controls and document any residual manual checks needed."],
        questions: ["Why can an accessibility scanner pass a page that is still difficult to use?", "What evidence would you collect for a keyboard-accessibility defect?"],
    },
    {
        id: "compatibility",
        title: "Compatibility Testing",
        intro: "Compatibility testing asks whether software behaves acceptably across supported combinations of clients, protocols, dependencies and environments. The matrix must be driven by support commitments and risk, because exhaustive combination testing grows faster than practical value.",
        principles: [
            "Define the compatibility contract before defining the matrix.",
            "Prioritize combinations that represent real users, critical integrations or likely divergence.",
            "Distinguish browser compatibility from API version, database, package and runtime compatibility.",
            "When a combination is unsupported, make that explicit rather than letting accidental success become an implied promise.",
            "A targeted compatibility matrix should produce decisions, not just more test executions.",
        ],
        steward: [
            "Browser compatibility was explored in the previous module. Here the learner broadens the concept to Steward's Python/runtime assumptions, PostgreSQL version, internal tsa-test-core version and any public API compatibility obligations.",
            "The goal is not to execute every release against every historical dependency. The goal is to know which combinations matter and what evidence is required before an upgrade or release."],
        practice: [
            "Write a small Steward compatibility contract covering client/runtime/dependency combinations that actually matter.",
            "Identify the highest-risk combinations and the reason each belongs in the matrix.",
            "Execute at least one non-default supported combination or package-version compatibility check.",
            "Document unsupported combinations clearly."],
        questions: ["Why is a large compatibility matrix often weaker than a smaller risk-based one?", "What is the difference between accidental compatibility and supported compatibility?"],
    },
    {
        id: "reliability-oriented",
        title: "Reliability-oriented Testing",
        intro: "Quality engineers can test failure behavior before becoming reliability engineers. Reliability-oriented testing asks whether known failures are contained, diagnosable and recoverable enough for the product's expectations, while leaving production observability, SLOs, incident engineering and resilience architecture to the later Reliability Engineer school.",
        principles: [
            "Inject controlled dependency failure only where the failure mode is understood and safe to exercise.",
            "Verify timeouts and error handling rather than waiting indefinitely for broken dependencies.",
            "Check that partial failure does not create invalid Steward state.",
            "Capture evidence that distinguishes application failure from environment/infrastructure failure.",
            "Do not call a system resilient merely because one synthetic failure test passed.",
        ],
        steward: [
            "For Steward, useful scenarios include a database operation failing during a mutation, an identity dependency becoming unavailable, or an internal service call timing out. The important claim is not simply that an error appears; it is that the failure contract is controlled and state remains valid.",
            "These tests should produce candidate reliability risks for the later school instead of prematurely designing the final observability or SLO system."],
        practice: [
            "Select one plausible Steward dependency failure.",
            "Define the expected client-visible behavior and state-integrity invariant.",
            "Simulate the failure safely using an existing test boundary or controlled environment mechanism.",
            "Verify timeout/error evidence and inspect post-failure state for corruption or partial mutation."],
        questions: ["What is the boundary between reliability-oriented testing here and Reliability Engineering later?", "Why must state integrity be checked after a failed mutation?"],
        warning: "Do not perform uncontrolled destructive experiments against production. This module is about safe evidence, not chaos experimentation for its own sake.",
    },
    {
        id: "integrity-concurrency",
        title: "Data Integrity and Concurrency Testing",
        intro: "Concurrency defects appear when individually valid operations interleave in ways the design did not anticipate. The test target is an invariant: something that must remain true regardless of ordering, retries or simultaneous requests.",
        principles: [
            "Define the invariant first; concurrency without an invariant is just traffic.",
            "Exercise competing operations that can race on the same logical resource.",
            "Validate final persisted state, not only individual response codes.",
            "Understand transaction isolation, uniqueness constraints and optimistic/pessimistic coordination where relevant.",
            "A reproducible race harness is more valuable than a flaky test that occasionally fails without diagnostics.",
        ],
        steward: [
            "Steward candidates include simultaneous service-slug creation, competing ownership changes, duplicate dependency creation and lifecycle changes racing with updates. The expected result depends on domain rules, but the final registry must not contain contradictory ownership, impossible lifecycle state or duplicate identities.",
            "Database constraints are evidence-bearing design controls. Tests should verify that the application and PostgreSQL together preserve the invariant."],
        practice: [
            "Choose one Steward invariant vulnerable to concurrent writes.",
            "Create two competing operations against the same logical resource.",
            "Execute them repeatedly or with synchronization sufficient to increase race likelihood.",
            "Assert the final database/API state and capture response/error evidence from both operations.",
            "Explain which database or application mechanism protects the invariant."],
        questions: ["Why is sending many requests insufficient as a concurrency test?", "What final-state assertion proves the chosen Steward invariant?"],
        code: "from concurrent.futures import ThreadPoolExecutor\n\ndef create_same_slug(client, payload):\n    return client.create_service(payload)\n\nwith ThreadPoolExecutor(max_workers=2) as pool:\n    results = list(pool.map(\n        lambda _: create_same_slug(client, payload),\n        range(2),\n    ))\n\n# Then assert the API/database invariant: exactly one service identity exists.",
        language: "python",
    },
];

const baselineLab: Lesson = {
    id: "non-functional-baseline-lab",
    title: "Lab: Establish Steward Non-functional Baselines",
    activities: [
        {
            id: "non-functional-baseline-lab-001",
            title: "Define the Baseline Questions",
            estimatedMinutes: 45,
            content: {
                type: "practical",
                objective: "Turn Steward's non-functional risks into a small explicit baseline plan.",
                scenario: "The next Quality module will integrate durable checks into containers and CI. First decide which non-functional evidence is stable and valuable enough to carry forward.",
                instructions: [
                    "Select one performance risk, one accessibility risk, one compatibility risk and one integrity/reliability-oriented risk.",
                    "For each, write the behavior or invariant, workload/conditions, measurement and pass/fail interpretation.",
                    "Record the exact Steward environment and release identity required for comparison.",
                    "Mark any test that is unsuitable for every-commit CI and explain why."],
                deliverables: ["Non-functional baseline plan", "Risk-to-measurement map", "Execution-frequency decisions"],
                completionCriteria: ["Each baseline answers a real risk question.", "Measurements have enough context to be compared later.", "Not every check is forced into the same execution cadence."],
            },
        },
        {
            id: "non-functional-baseline-lab-002",
            title: "Execute and Capture the Baselines",
            estimatedMinutes: 120,
            content: {
                type: "practical",
                objective: "Produce repeatable first measurements for Steward.",
                scenario: "Run the selected checks against a controlled deployed environment without manufacturing confidence from one green result.",
                instructions: [
                    "Execute the selected performance workload and preserve latency/error/throughput evidence.",
                    "Execute automated plus targeted manual accessibility checks.",
                    "Execute the selected compatibility check.",
                    "Exercise the selected concurrency or controlled failure invariant.",
                    "Store evidence using the reporting conventions from the automation framework."],
                deliverables: ["Performance baseline evidence", "Accessibility findings", "Compatibility result", "Integrity or failure-behavior result"],
                completionCriteria: ["All evidence identifies environment and release.", "Failures and limitations remain visible.", "The learner can rerun the same baseline without reconstructing the test from memory."],
            },
        },
        {
            id: "non-functional-baseline-lab-003",
            title: "Decide What Becomes a Quality Gate",
            estimatedMinutes: 60,
            content: {
                type: "reflection",
                prompt: "Review the Steward non-functional baselines. Which checks are stable enough to influence CI/release quality gates, which should run on a schedule or before selected releases, and which still require human interpretation? Explain the evidence, false-confidence risks, execution cost, environment sensitivity and residual risks that should be handed to Security Steward or Reliability Engineer instead of being solved here.",
                minimumCharacters: 350,
            },
        },
    ],
};

export const nonFunctionalQualityDeepLessons: Lesson[] = [
    ...specs.map(lessonFrom),
    baselineLab,
];
