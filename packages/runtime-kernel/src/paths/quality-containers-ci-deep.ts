import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const docker: LearningResource = { title: "Docker documentation", url: "https://docs.docker.com/" };
const pytest: LearningResource = { title: "pytest documentation", url: "https://docs.pytest.org/" };
const githubActions: LearningResource = { title: "GitHub Actions documentation", url: "https://docs.github.com/actions" };
const playwright: LearningResource = { title: "Playwright Python", url: "https://playwright.dev/python/" };

type Spec = {
    id: string;
    title: string;
    core: string;
    principles: string[];
    steward: string[];
    practice: string[];
    code?: string;
    language?: string;
    warning?: string;
};

function lessonFrom(spec: Spec): Lesson {
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: spec.core },
        { type: "heading", id: `${spec.id}-principles`, text: "Core principles", level: 2 },
        { type: "list", items: spec.principles },
        { type: "heading", id: `${spec.id}-steward`, text: "Apply it to Steward", level: 2 },
        ...spec.steward.map((text): LessonBlock => ({ type: "paragraph", text })),
    ];
    if (spec.code) blocks.push({ type: "code", language: spec.language ?? "text", code: spec.code });
    if (spec.warning) blocks.push({ type: "callout", tone: "warning", title: "Pipeline risk", body: spec.warning });
    blocks.push({ type: "callout", tone: "steward", title: "Quality pipeline checkpoint", body: "A pipeline is a decision system around evidence. It must preserve release/environment identity, make missing evidence visible and fail for reasons a human can triage. Green is meaningful only when the intended checks actually ran." });
    blocks.push({ type: "resources", title: "Continue learning", resources: [docker, pytest, githubActions, playwright] });

    return {
        id: `quality-ci-${spec.id}`,
        title: spec.title,
        activities: [
            { id: `quality-ci-${spec.id}-001`, title: spec.title, estimatedMinutes: 45, content: { type: "reading", body: spec.core, blocks } },
            { id: `quality-ci-${spec.id}-002`, title: `Apply: ${spec.title}`, estimatedMinutes: 55, content: { type: "practical", objective: `Apply ${spec.title} to the Steward quality system.`, scenario: "Use Steward's existing pytest/Playwright framework, deployed environments and immutable release identity. Improve the pipeline without hiding failures or duplicating evidence at the wrong test level.", instructions: spec.practice, deliverables: ["Pipeline or container change", "Execution evidence", "Short decision/triage note"], completionCriteria: ["The change improves repeatability or decision quality.", "Missing/skipped evidence remains visible.", "The learner can explain why this stage belongs at this point in the pipeline."] } },
            { id: `quality-ci-${spec.id}-003`, title: `Knowledge Check: ${spec.title}`, estimatedMinutes: 10, content: { type: "reflection", prompt: `Explain the main risk addressed by ${spec.title}, how it applies to Steward, and one way a poorly designed implementation could produce misleading green results.`, minimumCharacters: 200 } },
        ],
    };
}

const specs: Spec[] = [
    {
        id: "test-containers",
        title: "Test Containers and Environments",
        core: "Containers make test dependencies and runtime assumptions reproducible, but a container is not automatically a trustworthy test environment. The useful boundary is the set of dependencies and configuration required to prove a behavior consistently.",
        principles: ["Containerize dependencies that benefit from repeatable lifecycle and isolation.", "Keep the test subject's release identity explicit rather than rebuilding silently inside every stage.", "Prefer realistic dependency behavior where the risk depends on persistence, networking or protocol semantics.", "Separate disposable test infrastructure from long-lived shared environments."],
        steward: ["For Steward, PostgreSQL is a strong candidate for disposable test infrastructure because schema, constraints and transaction behavior matter.", "The same immutable Steward artifact should be identified across relevant delivery and quality stages; tests should not accidentally validate a different build."],
        practice: ["Inventory Steward test dependencies and classify which should be disposable containers versus external environments.", "Define startup/readiness/cleanup behavior.", "Run one focused integration suite against a disposable dependency set."],
    },
    {
        id: "dockerized-dependencies",
        title: "Dockerized Test Dependencies",
        core: "Dockerized dependencies are useful when they preserve production-relevant semantics while giving tests controlled lifecycle. Readiness, data initialization and cleanup are part of the test design—not incidental shell commands.",
        principles: ["Use health/readiness checks instead of fixed sleeps.", "Pin meaningful dependency versions.", "Initialize only the schema/data needed by the test boundary.", "Destroy disposable state after the run."],
        steward: ["A PostgreSQL container can exercise real uniqueness constraints, foreign keys and transaction behavior for Steward.", "If identity or another dependency is virtualized, document what behavior the substitute can and cannot prove."],
        practice: ["Create or refine a Docker Compose test dependency definition.", "Add readiness based on actual service health.", "Apply Steward migrations and execute integration tests.", "Prove teardown leaves no hidden shared state."],
        code: "services:\n  postgres:\n    image: postgres:17\n    environment:\n      POSTGRES_DB: steward_test\n      POSTGRES_USER: steward\n      POSTGRES_PASSWORD: test-only\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U steward -d steward_test\"]\n      interval: 2s\n      timeout: 2s\n      retries: 15",
        language: "yaml",
    },
    {
        id: "ephemeral-environments",
        title: "Ephemeral Environment Concepts",
        core: "An ephemeral environment is created for a bounded validation purpose and removed afterward. Its value is isolation and reproducibility; its danger is false confidence if it differs materially from the environment being promoted to.",
        principles: ["Give each environment a clear owner, lifetime and release identity.", "Create only the infrastructure needed for the intended evidence.", "Record meaningful differences from UAT/production-like environments.", "Automate teardown and detect leaked environments."],
        steward: ["A pull request may justify an ephemeral Steward stack for browser/API integration while heavier non-functional checks stay in a controlled shared environment.", "Parity means relevant behavior is comparable, not that every infrastructure detail is identical."],
        practice: ["Define the minimum Steward ephemeral stack.", "List known parity gaps and which risks they affect.", "Describe creation, readiness, test execution and teardown as one lifecycle."],
    },
    {
        id: "pipeline-stages",
        title: "Test Pipeline Stages",
        core: "Pipeline stages should order feedback by cost, speed, dependency and decision value. Fast checks should reject obvious failures early; slower evidence should run when its additional confidence justifies the cost.",
        principles: ["Fail fast on deterministic high-signal checks.", "Do not rerun the same behavior through every layer.", "Make stage dependencies explicit.", "Preserve one release identity across promotion-oriented evidence."],
        steward: ["A sensible Steward flow can progress from static/build checks to unit/component, API/integration, selected browser checks and then targeted non-functional evidence.", "Not every non-functional baseline belongs on every commit; cadence should follow risk and cost."],
        practice: ["Map the existing Steward checks into ordered stages.", "Identify duplicate evidence and remove unjustified repetition.", "Define which failures block later stages and why."],
        code: "quality:\n  stages:\n    - build-and-static\n    - unit-component\n    - api-integration\n    - browser-smoke\n    - targeted-non-functional",
        language: "yaml",
    },
    {
        id: "parallelization",
        title: "Parallelization",
        core: "Parallel execution reduces elapsed time only when tests and infrastructure are isolated enough to run concurrently. Concurrency bugs in the test system can create flakes, collisions and misleading failures.",
        principles: ["Parallelize independent work, not shared mutable state.", "Use unique test identities and data.", "Protect scarce external environments from accidental overload.", "Compare wall-clock gain with diagnostic complexity."],
        steward: ["Steward API tests may parallelize safely when service slugs and users are unique and cleanup is deterministic.", "Browser or non-functional stages may need lower concurrency because environment capacity itself is part of the evidence."],
        practice: ["Select a Steward test subset suitable for parallel execution.", "Remove shared account/data collisions.", "Compare serial and parallel runs and document any change in failure behavior."],
        warning: "Parallelism that makes a suite intermittently red is not an optimization; it is a new source of uncertainty.",
    },
    {
        id: "reports-artifacts",
        title: "Reports and Artifacts",
        core: "CI evidence must survive beyond console output. Reports and artifacts should answer what ran, against which release/environment, what failed and what diagnostic evidence is available.",
        principles: ["Keep machine-readable and human-readable evidence where useful.", "Attach exact run/release/environment identity.", "Retain traces, screenshots and logs selectively.", "Distinguish test failure from infrastructure failure and skipped evidence."],
        steward: ["Steward test reports should make API, browser and non-functional evidence traceable to the same release candidate where appropriate.", "Artifact retention should prioritize triage value rather than collecting everything forever."],
        practice: ["Produce a test report artifact for a Steward stage.", "Attach relevant diagnostics only on failure or explicit evidence need.", "Verify a reviewer can distinguish failed, skipped and infrastructure-error cases."],
    },
    {
        id: "quality-gates",
        title: "Quality Gates",
        core: "A quality gate is a release decision rule backed by evidence. Gates should protect meaningful risk boundaries; they should not become arbitrary thresholds that teams learn to game.",
        principles: ["Gate on high-value evidence tied to release risk.", "Treat missing mandatory evidence as a decision problem, not success.", "Keep thresholds explainable and revisable.", "Separate hard blockers from advisory signals where appropriate."],
        steward: ["Examples include mandatory unit/API suites, no unresolved critical regression, a browser smoke pass on supported engines and explicit compatibility evidence for a new tsa-test-core version.", "A performance threshold should be promoted to a gate only after a credible baseline and business expectation exist."],
        practice: ["Define Steward's minimum merge/release gates.", "For each gate, state the protected risk and exception process.", "Add one gate to the pipeline and demonstrate both pass and fail behavior."],
        warning: "Coverage percentage alone is a weak quality gate because it measures execution, not correctness or risk coverage.",
    },
    {
        id: "test-selection",
        title: "Test Selection",
        core: "Test selection is a risk decision: run the smallest set that provides enough evidence for the change and decision at hand, while preserving scheduled broader regression where needed.",
        principles: ["Use stable markers and changed-area knowledge.", "Always retain a small critical smoke set for high-value flows.", "Do not let selection logic silently exclude important tests.", "Record what was intentionally not run."],
        steward: ["A dependency-model change may require targeted API/component tests plus the critical service-registry smoke set, while a UI-only layout change may justify focused browser coverage.", "Broad scheduled regression remains useful for risks not reliably inferred from code paths."],
        practice: ["Design a marker-based selection rule for three Steward change types.", "Prove the selected and unselected sets are visible in reporting.", "Define when full regression is still required."],
    },
    {
        id: "failure-triage",
        title: "Failure Triage",
        core: "A failed pipeline is useful only if teams can determine whether the cause is product behavior, test code, dependency, environment or pipeline infrastructure. Triage quality is part of test-system quality.",
        principles: ["Preserve first-failure evidence.", "Classify before rerunning blindly.", "Include request IDs, release identity and environment context.", "Prefer deterministic reproduction paths."],
        steward: ["A failed Steward API test should expose endpoint, status/body, request ID and relevant persisted-state evidence; a browser failure should include trace/screenshot only when useful.", "Infrastructure failures should not be recorded as passed product checks."],
        practice: ["Take one representative Steward failure and create a triage checklist.", "Classify likely product/test/environment/infrastructure causes.", "Improve diagnostics so the next equivalent failure is faster to understand."],
    },
    {
        id: "flake-containment",
        title: "Flaky-test Containment",
        core: "Flaky tests destroy trust because identical code can produce conflicting evidence. Containment keeps unstable checks visible and owned while preventing them from silently defining release confidence.",
        principles: ["Track first-attempt failures even if a retry passes.", "Quarantine only with owner, reason and exit criteria.", "Prefer root-cause removal over retry inflation.", "Separate product nondeterminism from test nondeterminism."],
        steward: ["A Steward browser test that races page readiness may need locator/wait design fixes; a test that exposes real eventual-consistency behavior may be revealing a product contract problem instead.", "The pipeline must not translate eventual green into clean evidence without exposing the instability."],
        practice: ["Define Steward's flaky-test policy.", "Simulate or inspect one unstable test and classify the cause.", "Show how reports preserve retry history and quarantine state."],
    },
    {
        id: "internal-package-compatibility",
        title: "Internal Test Package Publishing and Compatibility in CI",
        core: "Once tsa-test-core is a versioned internal dependency, CI must prove that candidate versions can be published, resolved and consumed without turning source copying or local paths into hidden coupling.",
        principles: ["Build and identify the package artifact once.", "Publish candidate versions to the internal Python repository.", "Test consumers against explicit candidate/approved versions.", "Treat public API compatibility as a release concern."],
        steward: ["Steward remains the first real consumer. A tsa-test-core change should run package tests, publish a candidate artifact, install it through Nexus/internal PyPI and run a focused Steward compatibility suite.", "Steward-specific clients, workflows and assertions remain in the Steward repository."],
        practice: ["Design the CI path from tsa-test-core source to internal artifact to Steward consumer test.", "Define candidate version identity and promotion/approval expectations.", "Prove the consumer installs through the repository rather than a local path."],
        code: "python -m build\npython -m twine upload --repository-url \"$INTERNAL_PYPI\" dist/*\npip install --index-url \"$INTERNAL_PYPI/simple\" tsa-test-core==0.2.0rc1\npytest -m compatibility",
        language: "bash",
    },
];

const pipelineLab: Lesson = {
    id: "quality-ci-steward-pipeline-lab",
    title: "Lab: Build the Steward Quality Pipeline",
    activities: [
        {
            id: "quality-ci-steward-pipeline-lab-001",
            title: "Design the Evidence Pipeline",
            estimatedMinutes: 75,
            content: { type: "practical", objective: "Turn the existing Steward quality portfolio into an ordered pipeline with explicit decision points.", scenario: "You already have test analysis, unit/component, API/integration, browser/environment and non-functional evidence. The task is to orchestrate them without making every check run everywhere.", instructions: ["Inventory the existing suites, markers, dependencies and runtime costs.", "Define stages and their dependency order.", "Define merge versus release versus scheduled evidence.", "State which checks are mandatory, advisory or deferred and why."], deliverables: ["Pipeline stage map", "Evidence-to-decision matrix", "Execution-cadence policy"], completionCriteria: ["Each stage has a clear purpose.", "Expensive checks run only where justified.", "Required evidence cannot disappear silently."] },
        },
        {
            id: "quality-ci-steward-pipeline-lab-002",
            title: "Containerize and Execute the Test Dependencies",
            estimatedMinutes: 90,
            content: { type: "practical", objective: "Provide repeatable integration infrastructure for Steward CI.", scenario: "Use disposable dependencies where they strengthen evidence, while preserving any external environment tests that exist for a different risk.", instructions: ["Define PostgreSQL and any justified disposable dependencies.", "Add readiness checks, migrations, unique test data and deterministic teardown.", "Execute unit/component and API/integration stages.", "Preserve the Steward release/environment identity in reports."], deliverables: ["Runnable test dependency stack", "Integration run evidence", "Cleanup proof"], completionCriteria: ["No fixed sleep is the primary readiness mechanism.", "Database semantics remain real where required.", "Repeated runs do not rely on manual cleanup."] },
        },
        {
            id: "quality-ci-steward-pipeline-lab-003",
            title: "Add Selection, Gates and Diagnostic Artifacts",
            estimatedMinutes: 90,
            content: { type: "practical", objective: "Make the pipeline influence release decisions without hiding uncertainty.", scenario: "The pipeline should select intelligently, run compatible work in parallel and provide enough evidence to triage failures.", instructions: ["Implement the controlled marker/selection policy.", "Add safe parallelization where isolation is proven.", "Add reports and targeted logs/traces/screenshots.", "Implement at least one hard quality gate and one explicitly advisory signal.", "Ensure skipped/quarantined tests remain visible."], deliverables: ["Selection logic", "Quality gate", "Report/artifact set", "Flake visibility evidence"], completionCriteria: ["A failed mandatory check blocks the intended decision.", "Skipped or flaky evidence cannot masquerade as clean success.", "Failure artifacts identify environment and release." ] },
        },
        {
            id: "quality-ci-steward-pipeline-lab-004",
            title: "Prove tsa-test-core Compatibility in CI",
            estimatedMinutes: 75,
            content: { type: "practical", objective: "Validate the shared test package as a normal internal dependency.", scenario: "Exercise the supply-chain path established in Delivery Engineer instead of importing package source directly.", instructions: ["Build a candidate tsa-test-core distribution.", "Publish it to the internal repository using a candidate version.", "Install the candidate in Steward through the internal repository.", "Run a focused compatibility suite and capture artifact/version evidence."], deliverables: ["Published candidate artifact", "Consumer compatibility run", "Version traceability note"], completionCriteria: ["No source copy or local-path dependency is used in the final consumer run.", "The exact package version is visible.", "A compatibility failure would block promotion of the shared package." ] },
        },
        {
            id: "quality-ci-steward-pipeline-lab-005",
            title: "Quality Pipeline Review",
            estimatedMinutes: 30,
            content: { type: "reflection", prompt: "Defend your Steward quality pipeline. Explain the stage order, which evidence blocks merge or release, what runs on a schedule, how disposable environments are kept trustworthy, how retries/flakes are prevented from manufacturing green results, and how tsa-test-core compatibility is proven through the internal artifact repository.", minimumCharacters: 400 },
        },
    ],
};

export const qualityInContainersAndCiDeepLessons: Lesson[] = [
    ...specs.map(lessonFrom),
    pipelineLab,
];
