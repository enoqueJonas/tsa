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
        id: "performance-measurement-model",
        title: "Performance Measurement Model: Latency, Throughput, Errors and Saturation",
        intro: "Performance evidence is multidimensional. Latency distributions, throughput, error rate and resource saturation describe different parts of system behavior; interpreting one without the others can produce a false conclusion.",
        principles: [
            "Percentiles answer distribution questions: p95 is a boundary below which roughly 95% of observed values fall, not an average or a promise about every request.",
            "Throughput/request rate describes completed or attempted work over time; distinguish offered load from successful throughput.",
            "Error rate belongs beside latency because rejecting work quickly can make latency look excellent.",
            "Saturation indicators such as CPU, memory, connection pools, worker queues or database capacity help explain why behavior changes, but correlation is not automatically causation.",
            "Warm-up, caches, connection establishment and runtime optimization can make early measurements differ from steady-state behavior."
        ],
        steward: [
            "For Steward search/registration, report latency percentiles, request/iteration rate and failures together. If infrastructure metrics are available, align them to the same test window and release identity.",
            "Quality Steward interprets evidence and flags likely bottlenecks; deep production capacity/SLO engineering remains for Reliability Engineer."
        ],
        practice: ["Run a short controlled workload and capture p50/p95/p99, request rate and failure rate.", "Compare warm-up and steady-state windows.", "Create a deliberately failing-fast condition and explain why latency alone is misleading.", "Correlate one available resource signal with workload behavior without claiming causality you have not proven."],
        questions: ["What does p95 actually mean?", "Why can lower latency accompany a worse system?", "What is the difference between offered load and successful throughput?"]
    },
    {
        id: "k6-execution-model",
        title: "k6 Execution Model: VUs, Iterations and Scenarios",
        intro: "k6 scripts execute iterations through virtual users, while scenarios/executors determine how work is scheduled. Choosing an executor is part of the workload model, not a syntax preference.",
        principles: [
            "Virtual users model concurrent independent execution contexts; an iteration is one execution of the scenario function.",
            "Closed-model executors primarily control VUs/iterations and allow achieved request rate to fall as the system slows.",
            "Arrival-rate/open-model executors schedule new iterations at a target rate independently of response time, subject to available VUs.",
            "Use scenarios to represent distinct workloads rather than forcing unrelated behavior into one default function.",
            "Parameterize target URL/credentials/test data through controlled configuration; do not bake environment secrets into scripts."
        ],
        steward: [
            "A fixed-VU service-search baseline and a constant-arrival-rate catalog traffic experiment answer different questions. The curriculum now requires the learner to explain that difference before choosing one.",
            "Write-heavy registration workloads need collision-safe data and cleanup so the load generator does not measure its own duplicate-data mistakes."
        ],
        practice: ["Implement one fixed-VU scenario and one arrival-rate scenario against a safe Steward read flow.", "Compare achieved request rate when response latency is deliberately increased.", "Split read and write behavior into explicit scenarios if both are needed.", "Make environment and test-data configuration external and secret-safe."],
        questions: ["Why can fixed VUs reduce offered load when the system slows?", "When is an arrival-rate executor a better model?", "What does one k6 iteration represent in your chosen scenario?"],
        code: "export const options = {\n  scenarios: {\n    catalog_reads: {\n      executor: 'constant-arrival-rate',\n      rate: 20,\n      timeUnit: '1s',\n      duration: '2m',\n      preAllocatedVUs: 10,\n      maxVUs: 50,\n    },\n  },\n};",
        language: "javascript"
    },
    {
        id: "k6-checks-thresholds",
        title: "k6 Checks, Thresholds and Release Interpretation",
        intro: "Checks record functional observations inside workload execution; thresholds evaluate aggregated metrics and can make a k6 run fail. They solve different problems and should not be confused.",
        principles: [
            "A check records whether an individual response/iteration satisfied a condition; failed checks do not automatically mean the process exits unsuccessfully.",
            "Thresholds evaluate metric aggregates such as error rate or p95 latency and can enforce a test-level performance criterion.",
            "Threshold values need a source: requirement, SLO/SLA input, established baseline plus agreed tolerance, or explicit experiment objective.",
            "Segment/tag metrics when one aggregate would mix endpoints with very different risk/latency expectations.",
            "A threshold breach should preserve the measurements that explain it rather than collapsing into a generic red job."
        ],
        steward: [
            "Use checks to ensure a fast 500 response is not counted as acceptable behavior; use thresholds for agreed error/latency criteria on the measured flow.",
            "Do not invent a 500 ms threshold because an example uses it. Record why Steward's threshold exists."
        ],
        practice: ["Add functional checks and prove a failed check's behavior.", "Add an evidence-backed threshold and trigger a controlled breach.", "Tag two operations and define a targeted threshold where aggregate latency would hide one path.", "Document the source and review policy for each threshold."],
        questions: ["What is the difference between a k6 check and threshold?", "Why should endpoint groups sometimes have separate thresholds?", "Who or what justifies a performance threshold?"]
    },
    {
        id: "performance-environment-validity",
        title: "Performance Environment Validity and Comparative Baselines",
        intro: "Performance tests are experiments. If the environment, dataset, competing workloads or load generator change materially between runs, a numerical difference may describe the experiment rather than the release.",
        principles: [
            "Record application commit/release, infrastructure shape, database/data volume, dependency versions and workload definition.",
            "Keep the load generator from becoming the bottleneck; monitor its capacity when tests become significant.",
            "Control or record competing activity in shared environments.",
            "Compare equivalent windows and repeat measurements when noise is material.",
            "Treat a baseline as contextual evidence, not a universal truth transferable across environments."
        ],
        steward: [
            "A developer laptop, GitLab runner, QA/UAT environment and production-like environment can produce different numbers even for identical code. Label them rather than comparing them as if they were interchangeable.",
            "A CI smoke performance check can detect gross regression but should not be marketed as a capacity benchmark if the runner/environment is variable."
        ],
        practice: ["Create a performance run manifest with release, environment, dataset, workload and generator identity.", "Run two intentionally non-equivalent experiments and identify why direct comparison is invalid.", "Repeat an equivalent baseline and quantify normal variation.", "Decide which performance evidence is appropriate for merge requests, schedules and release reviews."],
        questions: ["What makes two performance runs comparable?", "How can the load generator distort results?", "Why is a shared UAT environment risky for precise benchmarking?"]
    },
    {
        id: "accessibility-automation",
        title: "Accessibility Automation and Manual Evidence Boundaries",
        intro: "Automated accessibility tooling detects machine-testable rule violations; it cannot judge the full usability, meaning or interaction experience. A credible accessibility baseline combines automation with deliberate human checks.",
        principles: [
            "Automate repeatable rules such as selected semantic/ARIA/color/structure violations with a recognized engine where appropriate.",
            "Treat automated findings as evidence requiring context, not as a percentage accessibility score.",
            "Manual keyboard testing checks focus order, reachability, traps, visible focus and operability.",
            "Screen-reader evidence is targeted to critical flows and semantics rather than pretending automation simulates human assistive-technology use.",
            "Regression automation should focus on stable high-value accessibility contracts while broader audits remain periodic/manual."
        ],
        steward: [
            "The Playwright layer already favors role/label semantics. Accessibility checks build on that foundation rather than creating a disconnected scanner-only suite.",
            "For service registration, combine automated rule scanning with keyboard operation, error association, heading/landmark inspection and targeted screen-reader-oriented semantic review."
        ],
        practice: ["Integrate an automated accessibility check into one critical Playwright flow or document the chosen scanner integration.", "Triage each finding rather than accepting raw scanner severity blindly.", "Perform keyboard-only execution and record focus evidence.", "Create an accessibility evidence table separating automated, manual keyboard and residual assistive-technology checks."],
        questions: ["What kinds of accessibility defects require human judgment?", "Why is an automated accessibility score a weak release claim?", "How should browser semantic locators and accessibility testing reinforce each other?"]
    },
    {
        id: "compatibility-matrix-engineering",
        title: "Compatibility Contracts, Matrices and Pairwise Risk",
        intro: "Compatibility space grows combinatorially. Engineer a support contract first, then select combinations using usage, change risk, boundary divergence and representative interaction rather than multiplying every dimension blindly.",
        principles: [
            "Separate dimensions: browser/OS, Java test platform, Python/Django runtime, PostgreSQL, tsa-test-core, API contract/version and deployment environment.",
            "Test all combinations only when the support contract/risk justifies it; otherwise use representative, boundary and pairwise-style selection.",
            "Always include changed/upgraded boundaries and minimum/maximum supported versions where those boundaries matter.",
            "Record unsupported combinations explicitly.",
            "A compatibility failure should identify the dimension combination, not just the test name."
        ],
        steward: [
            "A tsa-test-core upgrade may require candidate-versus-current consumer compatibility evidence without rerunning every browser/database combination.",
            "A PostgreSQL major-version upgrade deserves focused persistence/component evidence because its risk differs from Chromium/Firefox compatibility."
        ],
        practice: ["Define Steward's compatibility dimensions and supported values.", "Calculate the naive Cartesian matrix size.", "Reduce it using risk/boundary reasoning and document every retained combination.", "Run one changed-boundary compatibility check and preserve the full combination identity."],
        questions: ["Why does Cartesian-product testing scale poorly?", "When should a boundary version receive explicit minimum/maximum testing?", "What information must accompany a compatibility failure?"]
    },
    {
        id: "controlled-failure-testing",
        title: "Controlled Dependency Failure and Recovery Evidence",
        intro: "Reliability-oriented quality testing injects a known dependency failure to verify timeout, error mapping, state integrity and recovery behavior. The experiment must be bounded and observable.",
        principles: [
            "Define steady state and invariant before injecting failure.",
            "Inject one understood failure mode at a controlled boundary.",
            "Measure detection/timeout behavior and user/API-visible result.",
            "Verify persisted state after failure and after dependency recovery.",
            "Restore the dependency and prove the system can resume the intended behavior.",
            "Do not generalize one experiment into a claim of overall resilience."
        ],
        steward: [
            "A safe example can make an identity dependency return an error/timeout or stop a Testcontainers-owned dependency in an isolated integration environment, then verify no partial Steward mutation survives.",
            "These results become reliability risks/hypotheses for the later Reliability Engineer school, where production SLOs, telemetry and resilience architecture are developed."
        ],
        practice: ["Write steady-state and state-integrity invariants for one dependency failure.", "Inject the failure in a controlled test environment.", "Measure timeout/error behavior and inspect post-failure persisted state.", "Restore the dependency and verify recovery.", "Record what this experiment cannot prove about production resilience."],
        questions: ["Why must recovery be part of the experiment?", "What makes a failure injection controlled?", "Why does one successful failure test not prove resilience?"],
        warning: "Keep destructive/failure injection inside explicitly safe environments and boundaries. Production chaos engineering is outside this module."
    },

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
