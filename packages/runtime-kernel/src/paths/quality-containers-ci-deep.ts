import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const docker: LearningResource = { title: "Docker documentation", url: "https://docs.docker.com/" };
const junit: LearningResource = { title: "JUnit 5 User Guide", url: "https://docs.junit.org/current/user-guide/" };
const gitlabCi: LearningResource = { title: "GitLab CI/CD documentation", url: "https://docs.gitlab.com/ci/" };
const testcontainers: LearningResource = { title: "Testcontainers for Java", url: "https://java.testcontainers.org/" };
const playwright: LearningResource = { title: "Playwright Java", url: "https://playwright.dev/java/" };

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
    blocks.push({ type: "resources", title: "Continue learning", resources: [docker, junit, gitlabCi, testcontainers, playwright] });

    return {
        id: `quality-ci-${spec.id}`,
        title: spec.title,
        activities: [
            { id: `quality-ci-${spec.id}-001`, title: spec.title, estimatedMinutes: 45, content: { type: "reading", body: spec.core, blocks } },
            { id: `quality-ci-${spec.id}-002`, title: `Apply: ${spec.title}`, estimatedMinutes: 55, content: { type: "practical", objective: `Apply ${spec.title} to the Steward quality system.`, scenario: "Use Steward's existing JUnit/REST Assured/Playwright Java framework, deployed environments and immutable release identity. Improve the pipeline without hiding failures or duplicating evidence at the wrong test level.", instructions: spec.practice, deliverables: ["Pipeline or container change", "Execution evidence", "Short decision/triage note"], completionCriteria: ["The change improves repeatability or decision quality.", "Missing/skipped evidence remains visible.", "The learner can explain why this stage belongs at this point in the pipeline."] } },
            { id: `quality-ci-${spec.id}-003`, title: `Knowledge Check: ${spec.title}`, estimatedMinutes: 10, content: { type: "reflection", prompt: `Explain the main risk addressed by ${spec.title}, how it applies to Steward, and one way a poorly designed implementation could produce misleading green results.`, minimumCharacters: 200 } },
        ],
    };
}

const specs: Spec[] = [
    {
        id: "testcontainers-lifecycle",
        title: "Testcontainers Lifecycle, Wait Strategies and Failure Cleanup",
        core: "A disposable dependency is useful only when its lifecycle is deterministic. Testcontainers startup, readiness, ownership and teardown must match the JUnit test boundary instead of relying on arbitrary sleeps or globally reused state.",
        principles: ["Container started is not the same as service ready.", "Use a readiness signal that represents the dependency behavior the test needs.", "Choose per-test, per-class or suite-level lifetime deliberately based on isolation and cost.", "Cleanup must survive test assertion failures and setup failures.", "Container reuse is a developer optimization with isolation trade-offs, not the default CI correctness model."],
        steward: ["A PostgreSQLContainer can be class-scoped for a focused integration class while each test gets isolated schema/data semantics through transactions or deterministic cleanup.", "CI should assume clean disposable state unless an explicit performance experiment proves another model safe."],
        practice: ["Implement a PostgreSQLContainer lifecycle in JUnit.", "Replace any startup sleep with an appropriate wait/readiness strategy.", "Force setup/test failure and prove resources are cleaned up.", "Compare per-test and per-class container lifetime and document the trade-off.", "Inspect container logs when startup deliberately fails."],
        warning: "Do not enable reusable containers merely to make slow integration tests look fast; first measure startup cost and prove state isolation."
    },
    {
        id: "testcontainers-networking",
        title: "Testcontainers Networking and Dynamic Connection Configuration",
        core: "Container addresses and mapped ports are runtime values. Tests should consume connection details from the running container and understand host-to-container versus container-to-container networking instead of assuming localhost or fixed ports.",
        principles: ["Never hard-code a mapped host port.", "Use container-derived host, mapped port, JDBC URL and credentials.", "Use a dedicated Testcontainers network/aliases when multiple containers must communicate directly.", "Distinguish the test JVM's network view from another container's network view.", "Expose only ports the test actually needs."],
        steward: ["The Steward test JVM may connect to PostgreSQL through its mapped host port, while a containerized Steward service would address PostgreSQL by network alias on a shared Testcontainers network.", "Dynamic configuration should flow through explicit settings/dependency injection rather than mutating global environment state."],
        practice: ["Read JDBC connection details directly from PostgreSQLContainer.", "Create a two-container networking experiment with a network alias.", "Explain why localhost means different things inside and outside a container.", "Remove one fixed-port assumption from the integration setup."],
    },
    {
        id: "database-migrations-isolation",
        title: "Database Migrations, Fixtures and Isolation with Real PostgreSQL",
        core: "A real database container proves database semantics only when the schema matches the application contract and tests control data lifecycle. Migrations, constraints, transactions and cleanup are therefore part of integration-test architecture.",
        principles: ["Apply the same migration source used by the application where practical.", "Do not replace relational behavior with an in-memory database when PostgreSQL-specific semantics matter.", "Generate collision-safe data and make cleanup deterministic.", "Choose transaction rollback, truncation/schema reset or disposable database lifetime based on the boundary being proven.", "Seed the minimum data necessary for the scenario."],
        steward: ["Use real PostgreSQL to prove Steward uniqueness, foreign-key and transaction behavior.", "Keep migration failures distinguishable from product assertion failures and retain container/database diagnostics."],
        practice: ["Start PostgreSQL with Testcontainers and apply Steward migrations.", "Prove one real constraint or transaction behavior.", "Run the same test repeatedly and demonstrate data isolation.", "Deliberately break a migration and capture useful diagnostics.", "Document the chosen reset strategy and why."],
    },
    {
        id: "testcontainers-observability",
        title: "Testcontainers Diagnostics and Reproducibility",
        core: "When a container-backed integration test fails, the evidence must distinguish application assertion failure from image pull, startup, readiness, migration, network and dependency failures.",
        principles: ["Pin dependency image versions intentionally.", "Capture relevant container logs on infrastructure/setup failure.", "Record image identity and runtime connection metadata without credentials.", "Make Docker/Testcontainers availability a visible prerequisite.", "Do not classify a missing container runtime as a passed or skipped product check without policy."],
        steward: ["GitLab integration jobs should expose enough Testcontainers diagnostics to reproduce a failed PostgreSQL-backed test locally.", "The report should identify whether the failure occurred before or after the test behavior became executable."],
        practice: ["Trigger image/startup/readiness and application-level failures separately.", "Compare their evidence and classification.", "Record dependency image identity in the run evidence.", "Write a short local reproduction path from a failed GitLab integration job."],
    },
    {
        id: "gitlab-runners",
        title: "GitLab Runners and Execution Environments",
        core: "A GitLab job is executed by a runner, and runner executor choices determine filesystem, network, container and security behavior. Pipeline YAML cannot be reasoned about correctly without understanding where commands actually run.",
        principles: ["Know whether the runner uses shell, Docker, Kubernetes or another executor.", "Treat runner tags as capability routing, not test taxonomy.", "Keep toolchain/runtime versions reproducible in the job image or managed runner environment.", "Understand workspace persistence assumptions and never rely on undeclared runner-local state.", "Separate trusted/protected execution capacity from untrusted merge-request workloads where necessary."],
        steward: ["steward-tests needs Java/Maven and browser/container capabilities; runner design must make those dependencies explicit.", "A self-hosted runner can be valuable in the TSA homelab, but its credentials and Docker privileges become part of the threat model."],
        practice: ["Document the intended GitLab Runner executor for steward-tests.", "Identify Java/Maven/Playwright/Testcontainers requirements.", "Run a job that prints safe runtime/toolchain identity.", "Demonstrate why an undeclared runner-local dependency harms reproducibility."],
    },
    {
        id: "gitlab-container-execution",
        title: "Running Testcontainers Safely in GitLab CI/CD",
        core: "Testcontainers needs access to a compatible container runtime. GitLab runner architecture determines whether that comes from a Docker service/daemon, socket-style access or another supported runtime arrangement. The choice affects isolation, privileges and networking.",
        principles: ["Do not copy a Docker-in-Docker recipe without understanding its privilege/security implications.", "Document which daemon the test JVM talks to and how containers are cleaned up.", "Prefer the least-privileged runner architecture that satisfies the test boundary.", "Treat privileged runner configuration as infrastructure/security configuration, not a test-framework convenience.", "Prove networking and cleanup on the actual runner type."],
        steward: ["The integration pipeline must demonstrate PostgreSQLContainer execution on the selected GitLab runner architecture.", "Browser execution and Testcontainers may have different image/runtime requirements; combine them only when that improves the pipeline."],
        practice: ["Draw the runner → job → container-runtime → Testcontainers dependency path.", "Implement one Testcontainers-backed GitLab job on the selected runner model.", "Verify cleanup after a failed job.", "Document privileges and risks of the chosen runtime access model.", "Compare it conceptually with one alternative and explain why it was not selected."],
        warning: "Container-daemon access can be highly privileged. Do not expose it broadly to untrusted jobs merely to make Testcontainers work."
    },
    {
        id: "gitlab-cache-artifacts",
        title: "GitLab Cache, Artifacts and Test Reports",
        core: "Caches optimize future work; artifacts preserve outputs and evidence. Mixing the two produces stale evidence, unnecessary downloads or pipelines that only work because a previous runner happened to leave files behind.",
        principles: ["Cache Maven repository data for acceleration with an intentional key/invalidation strategy.", "Publish JUnit XML, Allure inputs/results and failure diagnostics as artifacts/reports.", "Use artifact dependencies/needs only where downstream jobs truly consume outputs.", "Use when: always or equivalent evidence retention where failed jobs must still publish diagnostics.", "Never cache secrets or mutable environment state."],
        steward: ["Maven dependency cache should improve speed without determining correctness.", "Surefire/Failsafe reports, Playwright traces/screenshots and compatibility evidence must remain tied to the producing pipeline/job."],
        practice: ["Add a Maven cache and measure cold versus warm behavior.", "Publish JUnit reports from a failing job.", "Publish failure diagnostics as artifacts.", "Demonstrate why a report belongs in artifacts rather than cache.", "Define cache invalidation when dependency/build assumptions change."],
    },
    {
        id: "gitlab-dag-rules",
        title: "GitLab rules, needs and Pipeline DAG Design",
        core: "Stages give broad ordering, rules decide job inclusion, and needs expresses direct dependencies that can form a faster DAG. Use them to encode evidence dependencies—not to create an unreadable conditional-programming language.",
        principles: ["Use workflow/rules to make pipeline-source behavior explicit.", "Use needs when a job can safely start without waiting for unrelated jobs in an earlier stage.", "Keep merge-request, default-branch, tag/release and schedule intent understandable.", "Avoid duplicate pipelines caused by overlapping rules.", "Record intentionally omitted portfolios so selection is auditable."],
        steward: ["Fast API evidence can start after its required build/setup job while unrelated work continues; browser smoke should depend only on prerequisites it truly needs.", "Scheduled broader regression is selected from CI_PIPELINE_SOURCE rather than a separate hidden script."],
        practice: ["Model the Steward pipeline as a dependency graph.", "Introduce one justified needs edge and measure feedback improvement.", "Create explicit merge-request and schedule rules.", "Test a rule case that intentionally excludes a job and prove the omission is visible by policy.", "Check for duplicate-pipeline behavior."],
    },
    {
        id: "gitlab-security",
        title: "GitLab CI/CD Variables, Protected Resources and Pipeline Security",
        core: "CI executes repository-controlled code with access to infrastructure. Variables, tokens, runners, protected branches/tags and environments therefore form a security boundary, especially when pipelines can be triggered from merge requests.",
        principles: ["Use masked/protected variables where appropriate and never echo secrets.", "Grant Nexus/environment credentials the minimum scope required by the job.", "Restrict protected runners/resources to trusted refs/workflows.", "Treat merge-request code as potentially capable of exfiltrating any credential exposed to its job.", "Pin/verify external images and templates according to supply-chain policy."],
        steward: ["tsa-test-core publication needs different permissions from ordinary test consumption.", "UAT credentials and internal Nexus deploy credentials should not automatically be available to every merge-request job."],
        practice: ["Create a credential-access matrix for merge request, default branch, release/tag and schedule jobs.", "Configure a safe CI variable and prove logs do not reveal it.", "Separate Nexus read from deploy permissions.", "Threat-model one malicious pipeline change and add a control.", "Document protected runner/environment assumptions."],
        warning: "Masking a variable reduces accidental log exposure; it does not make a secret safe if untrusted job code can read and transmit it."
    },
    {
        id: "gitlab-environments-approvals",
        title: "GitLab Environments, Deployments and Manual Gates",
        core: "GitLab environments and manual jobs can model promotion/approval boundaries, but a manual click is not quality evidence by itself. The gate should expose what artifact is being promoted, which evidence supports it and who/what is authorized to act.",
        principles: ["Keep immutable artifact/release identity through promotion.", "Use environment metadata to identify the target rather than hiding it in shell scripts.", "Manual jobs are appropriate for controlled decisions, not for compensating for unreliable automation.", "Deployment jobs should consume prior evidence rather than silently rerunning a different build.", "Rollback/recovery paths need explicit identity and evidence."],
        steward: ["Quality Steward can model a UAT validation/promotion gate without turning TSA into a production deployment project.", "The test pipeline should identify the exact Steward and tsa-test-core versions under evaluation."],
        practice: ["Model one environment/promotion boundary in GitLab.", "Add a manual gate only after required automated evidence exists.", "Show the artifact/release identity presented at the gate.", "Demonstrate that a failed mandatory quality job prevents the intended promotion path."],
    },

    {
        id: "test-containers",
        title: "Testcontainers Java and Controlled Integration Dependencies",
        core: "Testcontainers lets JUnit tests own real disposable dependencies through Java code. Containers make test dependencies and runtime assumptions reproducible, but a container is not automatically a trustworthy test environment. The useful boundary is the set of dependencies and configuration required to prove a behavior consistently.",
        principles: ["Use Testcontainers when the test should own a disposable dependency lifecycle; use Docker Compose or deployed environments when the boundary/lifecycle genuinely belongs outside the test JVM.", "Containerize dependencies that benefit from repeatable lifecycle and isolation.", "Keep the test subject's release identity explicit rather than rebuilding silently inside every stage.", "Prefer realistic dependency behavior where the risk depends on persistence, networking or protocol semantics.", "Separate disposable test infrastructure from long-lived shared environments."],
        steward: ["For Steward, PostgreSQL is a strong candidate for disposable test infrastructure because schema, constraints and transaction behavior matter.", "The same immutable Steward artifact should be identified across relevant delivery and quality stages; tests should not accidentally validate a different build."],
        practice: ["Inventory Steward test dependencies and classify Testcontainers-owned, Compose-owned and external/shared dependencies.", "Add the Testcontainers Java dependency and create one PostgreSQLContainer-based JUnit integration test.", "Use container-derived host/port credentials rather than hard-coded localhost assumptions.", "Define startup/readiness/cleanup behavior and explain reuse policy.", "Run one focused integration suite against the disposable dependency and compare its evidence with a UAT test."],
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
        id: "gitlab-ci-foundations",
        title: "GitLab CI/CD: Pipelines, Jobs, Stages and Runners",
        core: "GitLab CI/CD is the canonical Quality Steward pipeline implementation. Learn .gitlab-ci.yml, jobs, stages, runners, variables, rules, needs, caches and artifacts as execution architecture rather than YAML syntax.",
        principles: ["Jobs execute on runners; stages provide coarse ordering while needs can express a DAG for faster dependency-aware execution.", "rules should make pipeline intent explicit for merge requests, branches, tags and schedules.", "Cache accelerates reusable downloaded/build data; artifacts preserve outputs/evidence between jobs and after execution.", "Protected/masked CI variables and least-privilege credentials protect environment and Nexus access.", "Pipeline source, commit SHA, environment and test selection are evidence identity."],
        steward: ["steward-tests should use GitLab CI/CD as its primary CI implementation and produce JUnit/Allure-compatible evidence plus Playwright/API diagnostics.", "The same Maven commands proven locally remain the execution contract; GitLab orchestrates them rather than replacing Maven."],
        practice: ["Create the initial .gitlab-ci.yml for steward-tests.", "Run a Maven verification job on an appropriate GitLab Runner.", "Use rules to distinguish merge-request, default-branch and scheduled behavior.", "Use needs where a DAG improves feedback without weakening dependencies.", "Publish JUnit/test artifacts and inspect them after a controlled failure.", "Define cache versus artifact usage and configure one of each deliberately."],
        code: "stages:\n  - verify\n  - integration\n  - browser\n\njava-verify:\n  stage: verify\n  script:\n    - mvn -B -U clean test\n  artifacts:\n    when: always\n    reports:\n      junit: target/surefire-reports/TEST-*.xml",
        language: "yaml",
        warning: "Do not encode business/test logic in GitLab YAML. The pipeline should orchestrate reproducible Maven commands and preserve evidence."
    },
    {
        id: "pipeline-stages",
        title: "Test Pipeline Stages",
        core: "Pipeline stages should order feedback by cost, speed, dependency and decision value. Fast checks should reject obvious failures early; slower evidence should run when its additional confidence justifies the cost.",
        principles: ["Fail fast on deterministic high-signal checks.", "Do not rerun the same behavior through every layer.", "Make stage dependencies explicit.", "Preserve one release identity across promotion-oriented evidence."],
        steward: ["A sensible GitLab pipeline can progress from static/build checks to unit/component, API/integration, selected browser checks and then targeted non-functional evidence.", "Not every non-functional baseline belongs on every commit; cadence should follow risk and cost."],
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
        title: "Pipeline Failure Triage Integration",
        core: "CI should surface the failure taxonomy and evidence architecture already built in Framework Engineering. This lesson applies that policy to GitLab jobs rather than redefining failure categories.",
        principles: ["Preserve first-failure evidence across job boundaries.","Map job/runtime failures to the existing product/automation/environment/precondition taxonomy.","Expose pipeline/job/runner identity beside test evidence.","Make the reproduction command and required artifacts easy to find."],
        steward: ["A failed Steward API/browser/integration job should carry the same classification vocabulary established earlier, plus GitLab job/runner context.","Infrastructure failures remain failed evidence; CI must not reinterpret them as passed product checks."],
        practice: ["Take the existing failure taxonomy and map it to GitLab job outcomes/artifacts.","Trigger one controlled test failure and one runner/dependency failure.","Verify both preserve the original evidence and reproduction path."],
    },
    {
        id: "flake-containment",
        title: "Apply the Existing Flake and Quarantine Policy in GitLab",
        core: "Framework Engineering already defined retries, first-pass reliability and quarantine governance. CI's responsibility is to preserve and enforce that policy consistently across pipeline sources.",
        principles: ["Do not create a second CI-specific definition of flaky.","Publish first-attempt/recovered/quarantine metadata from the existing framework evidence.","Ensure quarantined tests remain visible in scheduled/reporting portfolios.","Use GitLab rules/gates to enforce policy without hiding unstable evidence."],
        steward: ["steward-tests uses one flake/quarantine policy locally and in GitLab; the pipeline only changes selection/cadence/gating.","Merge-request speed optimizations must not erase scheduled visibility of quarantined tests."],
        practice: ["Wire existing flake/retry metadata into GitLab artifacts/reports.","Prove a recovered test remains identifiable.","Prove a quarantined test remains visible on the intended schedule.","Document which pipeline sources block on which stability policy."],
    },
    {
        id: "internal-package-compatibility",
        title: "Internal Test Package Publishing and Compatibility in CI",
        core: "Once tsa-test-core is a versioned internal dependency, CI must prove that candidate versions can be published, resolved and consumed without turning source copying or local paths into hidden coupling.",
        principles: ["Build and identify the package artifact once.", "Publish candidate versions to the internal Maven repository.", "Test consumers against explicit candidate/approved versions.", "Treat public API compatibility as a release concern."],
        steward: ["Steward remains the first real consumer. A tsa-test-core change should run package tests, publish a candidate artifact, install it through Nexus Maven repository and run a focused Steward compatibility suite.", "Steward-specific clients, workflows and assertions remain in the Steward repository."],
        practice: ["Design the CI path from tsa-test-core source to internal artifact to Steward consumer test.", "Define candidate version identity and promotion/approval expectations.", "Prove the consumer installs through the repository rather than a local path."],
        code: "mvn -U clean deploy -Drevision=0.2.0-rc1\\nmvn -U test -Dtsa-test-core.version=0.2.0-rc1 -Dgroups=compatibility",
        language: "bash",
    },
];

const controlledIntegrationMilestone: Lesson = {
    id: "quality-ci-controlled-integration-milestone",
    title: "Milestone: Run Controlled Integration Evidence in GitLab",
    activities: [{
        id: "quality-ci-controlled-integration-milestone-001",
        title: "Prove Testcontainers on the Real Runner Boundary",
        estimatedMinutes: 180,
        content: {
            type: "practical",
            objective: "Prove a PostgreSQL-backed Steward integration slice with deterministic lifecycle and diagnosable GitLab execution.",
            scenario: "The same integration test must be reproducible locally and in GitLab without hard-coded ports, hidden runner state or a shared database.",
            instructions: [
                "Implement PostgreSQLContainer ownership and consume its runtime connection details.",
                "Apply real Steward migrations and prove one database-specific constraint/transaction behavior.",
                "Use an actual readiness strategy and deterministic data reset/cleanup.",
                "Run the suite on the selected GitLab Runner/container-runtime architecture.",
                "Publish JUnit results and container/startup diagnostics on failure.",
                "Deliberately cause a container/readiness failure and a product assertion failure and classify them separately.",
                "Document why this evidence differs from a regression against deployed UAT."
            ],
            deliverables: ["Testcontainers integration test", "Migration/isolation strategy", "Runner/runtime architecture diagram", "Passing GitLab job", "Controlled infrastructure failure evidence", "UAT-boundary comparison"],
            completionCriteria: ["No fixed mapped port or shared database is required.", "Container readiness uses an observable condition.", "Repeated execution is isolated.", "Runner privileges/runtime access are documented.", "Infrastructure failure cannot masquerade as product success/failure.", "The learner can state what Testcontainers evidence cannot prove about UAT."]
        }
    }]
};

const gitlabPipelineMilestone: Lesson = {
    id: "quality-ci-gitlab-pipeline-milestone",
    title: "Milestone: Engineer the steward-tests GitLab Pipeline",
    activities: [{
        id: "quality-ci-gitlab-pipeline-milestone-001",
        title: "Build a Secure Evidence-oriented GitLab Pipeline",
        estimatedMinutes: 210,
        content: {
            type: "practical",
            objective: "Build .gitlab-ci.yml as a secure orchestration layer around the already-proven Maven test commands.",
            scenario: "Merge requests need fast evidence; default-branch/release work needs stronger compatibility evidence; schedules need broader regression. All must preserve diagnosable results.",
            instructions: [
                "Define jobs/stages and use needs only for real DAG dependencies.",
                "Use rules for merge-request, default-branch/tag and schedule intent without duplicate pipelines.",
                "Configure Maven cache separately from test/report artifacts.",
                "Publish JUnit and diagnostic artifacts even for controlled failures.",
                "Route jobs to runners by required capability and document executor/runtime assumptions.",
                "Define protected/masked variables and a least-privilege credential matrix, including Nexus read versus deploy.",
                "Prove one mandatory quality failure blocks the intended downstream gate.",
                "Record commit/release/environment/pipeline-source identity in evidence."
            ],
            deliverables: [".gitlab-ci.yml", "Pipeline DAG", "Runner capability map", "Cache/artifact policy", "Credential-access matrix", "Passing and controlled-failing pipeline evidence"],
            completionCriteria: ["Local Maven commands remain the execution contract.", "Rules are understandable and do not create accidental duplicate pipelines.", "Cache cannot determine correctness.", "Failure evidence survives failed jobs.", "Untrusted merge-request work does not receive unnecessary protected credentials.", "The exact artifact/environment under test is identifiable."]
        }
    }]
};

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
            content: { type: "practical", objective: "Validate the shared test package as a normal internal dependency.", scenario: "Exercise the supply-chain path established in Delivery Engineer instead of importing package source directly.", instructions: ["Build a candidate tsa-test-core JAR.", "Publish it to the internal repository using a candidate version.", "Install the candidate in Steward through the internal repository.", "Run a focused compatibility suite and capture artifact/version evidence."], deliverables: ["Published candidate artifact", "Consumer compatibility run", "Version traceability note"], completionCriteria: ["No source copy or local-path dependency is used in the final consumer run.", "The exact package version is visible.", "A compatibility failure would block promotion of the shared package." ] },
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
