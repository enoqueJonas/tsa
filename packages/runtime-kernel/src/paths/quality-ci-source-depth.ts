// PED-005 Quality Steward: substantive, topic-specific teaching authored for
// each original CI/containers lesson. Each trace and counterexample is attached
// to the *original* reading ID, never as a generated orientation page.
export type QualityCiCase = { heading: string; mechanism: string; failure: string; transfer: string };
export const qualityCiCases: Record<string, QualityCiCase> = {
  "testcontainers-lifecycle": {
    "heading": "Why container start does not imply database readiness",
    "mechanism": "A Testcontainers Java PostgreSQLContainer goes through image acquisition, container creation, port mapping, process start, readiness check and application connection. A container PID existing only proves a process began; a database query is the useful dependency boundary. In one isolated JUnit class, start PostgreSQL, inspect getJdbcUrl and run SELECT 1 after the wait strategy completes; then own the fixture and tear it down in a finally/extension lifecycle even if a test assertion fails.",
    "failure": "Inject a startup error or an impossible readiness probe. A fixed Thread.sleep may expire before PostgreSQL is ready and produce timing-dependent failures. Capturing container logs, readiness attempts and cleanup state separates startup failure from SQL assertion failure.",
    "transfer": "Design two tests with a shared class-scoped container but separate database records. State exactly which resource is shared, which data is isolated and which negative proves the failing test did not leak state."
  },
  "testcontainers-networking": {
    "heading": "Trace the connection from JVM to the mapped port",
    "mechanism": "A test JVM on the runner host talks to a container through the host and dynamically allocated mapped port returned by Testcontainers. A service running in a second container instead needs an appropriate shared network and alias; its localhost points to itself, not to PostgreSQL or the host. Trace each connection as source process, destination name, destination port and network namespace before writing a JDBC URL.",
    "failure": "Hard-coding localhost:5432 may work on a developer machine and fail in CI when Testcontainers maps PostgreSQL to a different host port. A name that resolves inside one container might not exist from the JVM host. Diagnose DNS lookup, TCP reachability and authentication separately.",
    "transfer": "Given PostgreSQL mapped to host port 32842 and aliased as db on a container network, write the correct host-JVM and sidecar-container connection endpoints. Explain why interchanging them is an actual failure."
  },
  "database-migrations-isolation": {
    "heading": "Prove database state, not fake repository behavior",
    "mechanism": "Start disposable PostgreSQL, apply the same migration files as the product, seed an owned test record, assert a constraint, then roll back or recreate the schema and show a second run begins empty. Real PostgreSQL is essential when evidence concerns unique constraints, isolation levels or JSONB behavior; an in-memory fake cannot reproduce that contract. Name which transaction belongs to setup, action and assertion.",
    "failure": "A repository fake accepting duplicate service slugs cannot prove the database UNIQUE constraint. Conversely, a test that passes because old rows remain from a previous execution is contaminated. Force a duplicate insert and observe the real database error before accepting the scenario.",
    "transfer": "Design a negative two-worker registration case. Specify how each worker obtains its connection, where conflicting INSERTs occur, and how the test proves exactly one durable record without relying on order."
  },
  "testcontainers-observability": {
    "heading": "Build a startup-to-readiness timeline",
    "mechanism": "A failed integration test may be a startup failure rather than a product defect. Capture UTC timestamps for image acquisition, container creation, mapped port, readiness condition, first connection attempt and database response; align these with container stdout/stderr and the test exception. Redact credentials before attaching logs. Bounded wait criteria are more meaningful than blind pauses.",
    "failure": "Make a local container exit immediately or configure a wrong database name. A final generic TimeoutException does not tell the learner whether the process failed, the port was unreachable or the credentials were rejected. Inspect logs and classify the first failing boundary.",
    "transfer": "Write a triage record for a container that starts and exposes a port but refuses SQL queries for ten seconds. State one next observation for each of process, network and application readiness."
  },
  "gitlab-runners": {
    "heading": "Runner, executor, job image and trust boundary",
    "mechanism": "GitLab schedules a job to a registered runner whose executor determines its runtime. A shell executor usually runs commands with host privileges and may retain machine state; a Docker executor runs the job in an image while the runner still owns privileged infrastructure. Runner tags select capabilities, not test categories. Record safe runner identity, Java version, container access and filesystem scope from an actual CI job.",
    "failure": "A pipeline with Java 17 on the developer laptop can fail when a shell runner has Java 11, while a job image pin works only when the chosen executor supports it. A privileged runner shared with untrusted merge requests can expose internal resources: job success is not proof of an acceptable trust boundary.",
    "transfer": "For API tests requiring Java 17 but no browser, and integration tests requiring a container daemon, propose one or two runner classes. Justify executor, tags and which jobs must never access production credentials."
  },
  "gitlab-container-execution": {
    "heading": "Trace Testcontainers to the actual daemon",
    "mechanism": "Testcontainers uses an API to control containers through a runtime visible to its process. In GitLab CI this could involve a Docker daemon service or runner-provided access; each architecture has different networking, privilege and cleanup implications. The test JVM must reach the daemon, and the test must reach mapped service ports. Diagram runner → job container → container runtime → PostgreSQL container, including where network boundaries live.",
    "failure": "Copying Docker-in-Docker with unrestricted privileged mode into a public merge-request runner can grant dangerous control over runner infrastructure. A missing daemon may produce a failed setup rather than a test assertion. Treat daemon access as an approved security design, not a test convenience.",
    "transfer": "Given a failing Testcontainers setup with 'Docker environment not found', list the evidence to distinguish missing socket, blocked TCP daemon, wrong runner executor and denied privileges; do not claim that enabling privileged mode is automatically acceptable."
  },
  "gitlab-cache-artifacts": {
    "heading": "Cache accelerates; artifacts attest",
    "mechanism": "A Maven dependency cache stores re-fetchable inputs to make later jobs faster. A JUnit report, Allure result or screenshot is evidence about one specific test run and must be retained as an artifact with a run/commit identity. Cache keys and eviction may change; an auditor must never need a cache hit to reconstruct a required quality verdict. GitLab artifacts:reports:junit and artifacts:paths serve different presentation/download purposes.",
    "failure": "Erase the runner cache and rerun the same test. If the test evidence disappears, the pipeline never published an adequate artifact. Conversely, treating all cached material as a release artifact can expose credentials and create misleading identity mixing between runs.",
    "transfer": "Choose which files belong in a cache and which belong in retained artifacts: ~/.m2 dependencies, target/surefire-reports XML, diagnostic log with tokens, and a signed release manifest. Explain retention and redaction for each."
  },
  "gitlab-dag-rules": {
    "heading": "Represent actual evidence dependencies with rules and needs",
    "mechanism": "The workflow decides whether GitLab creates a pipeline. Each job's ordered rules decide whether that job exists; needs creates directed upstream dependencies within the resulting job graph. A build-image job may feed API and browser tests, while documentation lint runs independently. A downstream release gate should depend on every mandatory verification result and on the exact immutable build artifact, not merely a stage label.",
    "failure": "If rules exclude a mandatory API job from a scheduled pipeline while the release job still runs, a green pipeline may conceal an untested candidate. A needs edge to an optional or missing job can prevent creation or create unintended gaps depending on configuration. Inspect the expanded pipeline graph for every supported event source.",
    "transfer": "Draw the job graph for merge request, default-branch push and schedule. Mark selected and omitted jobs, and prove which failed or skipped predecessor must block promotion."
  },
  "gitlab-security": {
    "heading": "Follow credentials through code, runner and repository",
    "mechanism": "CI scripts are executable code from a repository ref. Any credential available to an untrusted job can potentially be read and exfiltrated by that job even if logs mask it. Separate read-only test credentials, protected UAT environment access and Nexus publication credentials by purpose, protected ref, runner ownership and permission. A masked variable mainly prevents accidental display in logs; it is not an isolation boundary against malicious scripts.",
    "failure": "A merge-request job that can run arbitrary code with a deployment token has already crossed the boundary even when echoing the token prints [MASKED]. Prevent untrusted refs from receiving secrets rather than relying on redaction alone. Pin included templates/images as appropriate for the approved supply-chain policy.",
    "transfer": "Build a four-column access matrix for untrusted MR, trusted default branch, release tag and schedule. State the lowest privilege each needs and the attempted access that should be denied."
  },
  "gitlab-environments-approvals": {
    "heading": "Promotion is an identity-preserving decision",
    "mechanism": "A promotion job must consume the same immutable artifact digest and associated test evidence that were accepted earlier. GitLab environment metadata identifies deployment target; protected environments/manual approvals may restrict who promotes. A human clicking Play is authorization to proceed, not retrospective proof that required checks ran. Separate approval, deployment and post-deployment verification.",
    "failure": "Building a fresh image from moving source in the deploy job can promote bytes different from those tested. A manual job that is optional or allowed to fail may be bypassed. Prove the exact artifact digest is carried from build through tests to promotion and blocked if evidence is missing.",
    "transfer": "Describe a release candidate whose image tag moves between testing and approval. Specify the digest comparison, required test report and responsible approver before allowing promotion."
  },
  "test-containers": {
    "heading": "Why a real dependency changes the claim",
    "mechanism": "Unit tests can verify a pure rule with a fake repository, but an integration test of database uniqueness, transactions or SQL serialization must exercise a real database engine. Testcontainers creates a disposable runtime boundary whose image version, migration source and data setup must be explicit. The JUnit test should assert behavior and clean up regardless of success or exception.",
    "failure": "A mocked save() returning success cannot reveal a real PostgreSQL unique violation. A container test that manually creates a simplified schema different from the product migration also proves the wrong thing. Check engine version, applied migration identities and response under a deliberately conflicting record.",
    "transfer": "Select one Steward constraint requiring real PostgreSQL. Write the preconditions, direct SQL effect, expected exception and cleanup proof; then explain what an in-memory fake still could test separately."
  },
  "dockerized-dependencies": {
    "heading": "Who owns a dependency started by Docker?",
    "mechanism": "Docker Compose can start an environment-level dependency shared across a local session; Testcontainers usually binds dependency lifetime and dynamic ports to a specific test invocation or class. Both may launch PostgreSQL, but ownership and data reset differ. In either case the container process being up is not equivalent to application readiness: perform a useful SQL health probe before test setup.",
    "failure": "A Compose service reused from yesterday can contain leftover accounts and make a 'create succeeds' test pass for the wrong reason; a newly created container can accept TCP before schema migrations complete. Cleanup should include only resources owned by this run.",
    "transfer": "Contrast a shared Compose DB and per-class Testcontainers DB for two concurrent CI jobs. Decide which lifecycle and seed policy gives a reproducible unique-key test."
  },
  "ephemeral-environments": {
    "heading": "Track the full temporary environment lifecycle",
    "mechanism": "An ephemeral environment is identified by a unique branch/run candidate, provisioned with bounded resources and secrets, initialized to a known schema and test data, used to collect evidence and then destroyed. Its identity must be linked to the tested commit, not reused as an implicit latest QA instance. Some tests need reserved shared systems; temporary environments are only useful where resource and isolation costs are justified.",
    "failure": "A cleanup command that deletes a shared database or a namespace not owned by the test is worse than a leak. A failed deployment step that skips cleanup leaves orphaned services and consumes quota. Use run-scoped ownership labels, conditional cleanup and a safe dry-run of deletion targets.",
    "transfer": "Design the lifecycle record for two concurrent feature branches: unique namespace, release digest, database schema, expiration and cleanup signal. State how failed setup and test failures both reach cleanup."
  },
  "gitlab-ci-foundations": {
    "heading": "Follow a source change to the JUnit report",
    "mechanism": "GitLab creates a pipeline from an SCM event, expands its YAML rules, schedules jobs to runners, checks out a commit and executes scripts. A Java build invokes Maven, Surefire/JUnit tests produce exit statuses and XML reports, and GitLab records job/pipeline outcomes and artifacts. Each step has a different failure mode and identity; a green stage says little unless the expected job actually ran.",
    "failure": "A pipeline created by a web click has a different CI_PIPELINE_SOURCE than a repository event; therefore it cannot prove SCM triggering. A test command followed by '|| true' hides the exit code. A successful build with zero selected tests is not adequate mandatory test evidence.",
    "transfer": "Starting from a commit hash, describe the three independent facts required to prove a real test was triggered and executed: pipeline source, included job and nonempty report tied to that commit."
  },
  "pipeline-stages": {
    "heading": "Order by dependency and feedback cost",
    "mechanism": "A pipeline often runs fast unit/component checks first, then isolated DB/API checks, then conditional browser or non-functional jobs. Stage order is a coarse dependency mechanism, while needs can create an intentional DAG. Decide whether a test can start only when a particular build artifact exists, and state why a later quality decision depends on all mandatory evidence rather than any one job.",
    "failure": "A skipped integration job must not be interpreted as a passing integration result merely because the previous stage was green. Running resource-heavy browser suites on every typo can slow feedback, but removing a critical authorization check can hide a release blocker.",
    "transfer": "For a README-only change and a service-authorization change, choose the evidence portfolio and state which mandatory smoke check remains selected for both."
  },
  "parallelization": {
    "heading": "Quantify time savings without corrupting data",
    "mechanism": "Two independent API tests can run concurrently only when each owns distinct identities, service slugs and cleanup. Parallelism changes ordering and temporal overlap: a shared static token or reused primary key can create collisions that do not exist in serial runs. Compare serial wall-clock time, parallel wall-clock time, retry recovery and first-failure rate; speed matters only if evidence reliability remains comparable.",
    "failure": "A suite that passes 30 serial runs but intermittently violates a UNIQUE constraint with parallel workers may have a test data collision rather than a product regression. Keep test-identity suffixes scoped to run and worker, and inspect whether a real product concurrency bug is exposed before dismissing it as a flake.",
    "transfer": "Given two workers that both create service slug 'test-service', propose a deterministic seed policy, data isolation proof and one legitimate shared-state test that should remain concurrent to challenge product behavior."
  },
  "reports-artifacts": {
    "heading": "Make a failure reproducible from the saved run",
    "mechanism": "JUnit XML provides machine-readable test identity, status and timing. Allure or another presentation layer can help triage attachments and steps, but cannot replace the primary assertion outcome. Preserve commit, release artifact, CI pipeline/job, environment, selected suite, fixtures and sanitized failure diagnostics. A report is credible only when it can be located and interpreted without the original tester's memory.",
    "failure": "A report containing 'all passed' but no test IDs or commit identity cannot support the release decision. A screenshot without a matching network/trace record can suggest symptoms but not identify whether a backend side effect happened. Never attach raw credentials as diagnostics.",
    "transfer": "Design a retained artifact bundle for a 403-but-owner-mutated defect. Identify what belongs in machine report, sanitized log, API read-after evidence and high-level failure summary."
  },
  "quality-gates": {
    "heading": "A release gate is a predicate over complete evidence",
    "mechanism": "The original Quality Gates reading now contains executable Java applying six decisions: complete evidence is approved, while a failed test, missing executed check, missing report, stale commit or empty selection is blocked. A gate is meaningful only when its input is a trustworthy selection manifest and report from the exact candidate. Advisory checks must be explicitly nonblocking by policy, not silently omitted.",
    "failure": "If executed <= selected is accepted as sufficient evidence, a one-test omission becomes a false pass. This error is demonstrated by changing the Java comparison and expecting the test to throw. The local decision model does not prove GitLab workflow selection or real report generation.",
    "transfer": "Write a gate policy for 12 selected tests with 11 executed and no failures. Name the required corrective run rather than declaring it green because the failure count is zero."
  },
  "test-selection": {
    "heading": "Show omitted tests beside selected tests",
    "mechanism": "A test-selection strategy maps a change and its risks to a set of tests. Suppose an authorization filter changes: a focused unit slice, denied/allowed API contract checks and high-risk smoke are mandatory, while broad cross-browser layout checks may remain scheduled. Report the selected IDs and intentionally unselected IDs; the stable minimum smoke portfolio prevents narrow path heuristics from removing critical evidence.",
    "failure": "A changed-files rule can miss a common library change that affects every endpoint. A tag typo can silently result in zero tests. A successful job after selecting none is not proof. Verify selected count, execution count and the relation to the protected risk.",
    "transfer": "Given a change to shared token acquisition rather than a single service, revise the portfolio. Explain why the old endpoint-only selection is insufficient and which full-suite trigger remains."
  },
  "failure-triage": {
    "heading": "Trace the first failing boundary rather than naming every red as flaky",
    "mechanism": "A test failure should report observed status/body/state, assertion ID, correlated request or trace, environment identity and a reproduction path. An infrastructure failure should carry runner/image/container logs and failed readiness signal. A test automation failure may surface from a fixture, selector or report parser. These classifications have different owners and recovery actions; labels are hypotheses until evidence supports them.",
    "failure": "An API test that times out while the target is unreachable has not proven the product rejected a valid request. Re-running to green without preserving the original failure hides whether the environment recovered or the product was changed. Keep first-attempt evidence and state which next observation would disambiguate.",
    "transfer": "For a failed job with HTTP connection refused, compare DNS resolution, TCP connection and server readiness evidence before assigning it as a product bug or a test flake."
  },
  "flake-containment": {
    "heading": "Keep first-pass and recovered outcomes separate",
    "mechanism": "A suite can have 100 executions, 90 pass initially, 6 pass after retry and 4 remain failed. Its first-pass rate is 90%, not 96%, and the recovered six should be queryable as instability. Quarantine is a deliberate decision to remove a test from a blocking portfolio while preserving scheduled execution, ownership, age and risk visibility. A new environment failure is not automatically flaky automation.",
    "failure": "If the report retains only final retries, the dashboard may appear 96% reliable and hide a growing first-attempt problem. Quarantining authorization-denial tests permanently can leave an unacceptable risk unchecked; ownership and expiry are required.",
    "transfer": "Compute first-pass, recovered and permanent-failure rates from a provided run history, then decide which test class can be temporarily quarantined without compromising release risk."
  },
  "internal-package-compatibility": {
    "heading": "A shared package needs a real consumer and version contract",
    "mechanism": "A potential future tsa-test-core library must remain a candidate until an independent second product actually consumes reusable APIs. At that point, publish a versioned artifact to an approved repository, resolve it from two consumer builds, test its public contract and prove that a breaking change is detected. Read and deploy permissions must be separate. One working package build cannot establish backwards compatibility for consumers.",
    "failure": "A library revision removes a public method but keeps the same version. The producer builds, yet an older consumer fails compilation or linkage. A mutable SNAPSHOT can also make different runs resolve different code. Compatibility needs explicit versions, exact artifact identity and consumer gates.",
    "transfer": "Define what proof is enough to publish a proposed shared JUnit extension, and what observation would justify leaving it inside steward-tests instead."
  }
};
