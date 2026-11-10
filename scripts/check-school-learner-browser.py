"""Browser traversal of all lessons in a single TSA school (synthetic CI progress).

TSA_SCHOOL must be a runtime academy slug. Does not operate on any learner's
real account or infrastructure. Builds on, but does not replace, real lab evidence.
"""
import json
import os
import re
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE = os.getenv("TSA_BASE_URL", "http://127.0.0.1:4173")
SCHOOL = os.environ["TSA_SCHOOL"]
ALLOWED = {
    "engineering-apprentice", "builder", "platform-builder",
    "system-thinker", "delivery-engineer", "cloud-engineer",
    "quality-steward", "security-steward", "reliability-engineer",
    "architect", "technical-steward", "professional-engineer",
}
if SCHOOL not in ALLOWED:
    raise SystemExit(f"Unexpected cross-school traversal target: {SCHOOL}")

ARTIFACTS = Path("artifacts/cross-school-learner")
ARTIFACTS.mkdir(parents=True, exist_ok=True)
MODULE = re.compile(r"^(Start|Continue|Review) module$")
NEXT = re.compile(r"^(Next|Next lesson|Complete path)$")
SYNTHETIC_REFLECTION = (
    "Synthetic headless browser navigation check only. This response does not "
    "demonstrate competence, live systems, real commands or lab evidence."
)


def inspect_school(page):
    page.goto(f"{BASE}/?view=curriculum&school={SCHOOL}", wait_until="networkidle")
    module_count = page.get_by_role("button", name=MODULE).count()
    assert module_count > 0, f"No modules shown for {SCHOOL}"
    evidence = []
    evidence_gates = []
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    for module_index in range(module_count):
        page.goto(f"{BASE}/?view=curriculum&school={SCHOOL}", wait_until="networkidle")
        page.get_by_role("button", name=MODULE).nth(module_index).click()
        page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
        sidebar = page.locator("aside").filter(has=page.get_by_text("Curriculum", exact=True)).first
        count = sidebar.locator("button").count()
        assert count > 0, f"No activities in {SCHOOL} module {module_index + 1}"
        visited = set()
        for _ in range(count):
            activity_id = page.evaluate("new URLSearchParams(location.search).get('activity')")
            assert activity_id and activity_id not in visited, (
                f"Missing or repeated activity id in {SCHOOL}: {activity_id}"
            )
            visited.add(activity_id)
            content = page.locator("main").last
            assert content.is_visible(), f"Hidden activity content: {activity_id}"
            text = content.inner_text().strip()
            assert len(text) >= 90, f"Unusually short activity content: {activity_id}"
            # Only flag editorial TODO/TBD markers at the start of a line, not
            # filenames such as notes/todo.txt in legitimate filesystem lessons.
            assert not re.search(r"(?im)^\s*(?:TODO|TBD)\s*[:\-]|\bLorem ipsum\b", text, re.I), (
                f"Unfinished teaching placeholder: {activity_id}"
            )
            if activity_id == "pki-verification-model-how-certificate-verification-works":
                assert len(text) >= 1800, (
                    "PKI rich authored reading lost its substantive source body or block content"
                )
                assert content.get_by_text("Trust starts at the verifier", exact=True).count() == 1
                assert content.get_by_text("A trusted issuer is only one check", exact=True).count() == 1
            # PED-007: These exact lessons previously rendered as 418–1491
            # characters even while all structural/browser smoke checks passed.
            # Keep the guard tied to the *rendered* learning surface, including
            # a real copyable code example rather than padded generic prose.
            if SCHOOL == "builder" and activity_id in {
                "software-craft-internal-package-design-001",
                "relational-data-and-postgresql-orm-vs-sql-reading",
                "relational-data-and-postgresql-n-plus-one-reading",
                "relational-data-and-postgresql-django-orm-reading",
                "relational-data-and-postgresql-migrations-reading",
                "software-craft-performance-awareness-reading",
            }:
                assert len(text) >= 2200, (
                    f"Pedagogical depth regression in critical Builder reading: {activity_id}, "
                    f"only {len(text)} rendered characters"
                )
                assert content.get_by_role("button", name="Copy").count() >= 1, (
                    f"Missing runnable, copyable example in Builder reading: {activity_id}"
                )
            # Targeted PostgreSQL learner-surface checks. The normal Builder
            # mobile smoke only inspects two activities per module, so it
            # cannot prove the rebuilt deep readings fit a phone. Check
            # specific rendered mechanism headings, copyable examples, and
            # 390px document overflow without granting learner validation.
            builder_postgresql_readings = {
                "relational-data-and-postgresql-postgresql-what-it-is-reading":
                    ("Why use a database instead of a file?", False),
                "relational-data-and-postgresql-postgresql-local-setup-reading":
                    ("Option 2A: install PostgreSQL on macOS", True),
                "relational-data-and-postgresql-postgresql-first-connection-reading":
                    ("Read the psql prompt and finish a statement", True),
                "relational-data-and-postgresql-postgresql-psql-object-inspection-reading":
                    ("See columns and constraints with \\d", True),
                "relational-data-and-postgresql-postgresql-create-schema-reading":
                    ("Create the library schema", True),
                "relational-data-and-postgresql-postgresql-schema-design-basics-reading":
                    ("One-to-many and many-to-many relationships", True),
                "relational-data-and-postgresql-postgresql-normal-forms-reading":
                    ("Second normal form: avoid facts dependent on only part of a key", True),
                "relational-data-and-postgresql-postgresql-measurement-basics-reading":
                    ("What are p50 and p95?", False),
                "relational-data-and-postgresql-query-performance-reading":
                    ("Run the complete baseline and intervention as one SQL file", True),
                "relational-data-and-postgresql-postgresql-pagination-reading":
                    ("Create two pages, insert an earlier book, and compare", True),
                "relational-data-and-postgresql-postgresql-roles-and-privileges-reading":
                    ("Prove that SELECT succeeds but INSERT is denied", True),
                "relational-data-and-postgresql-postgresql-backup-and-restore-reading":
                    ("Run the complete dump-and-restore sequence", True),
            }
            target = builder_postgresql_readings.get(activity_id) if SCHOOL == "builder" else None
            if target is not None:
                expected_heading, needs_code = target
                assert len(text) >= 2400, (
                    f"PostgreSQL reading remains too superficial in rendered page: "
                    f"{activity_id}: {len(text)} characters"
                )
                assert content.get_by_text(expected_heading, exact=True).count() >= 1, (
                    f"Missing teaching mechanism in rendered PostgreSQL reading: "
                    f"{activity_id}: {expected_heading}"
                )
                assert "Two programs, one protocol boundary" not in text, (
                    f"Old architecture-review heading returned to {activity_id}"
                )
                if needs_code:
                    assert content.get_by_role("button", name="Copy").count() >= 1, (
                        f"Published PostgreSQL executable example not rendered: {activity_id}"
                    )
                # Render exactly this activity on a mobile viewport, not the
                # module's earlier entry page. Code figures may scroll inside
                # their container; the document itself must not overflow.
                page.set_viewport_size({"width": 390, "height": 844})
                assert not page.evaluate(
                    "document.documentElement.scrollWidth > innerWidth + 2"
                ), f"Horizontal 390px overflow in PostgreSQL reading: {activity_id}"
                for fig in content.locator("figure").filter(
                    has=page.get_by_role("button", name="Copy")
                ).all():
                    assert fig.locator("pre").count() >= 1, (
                        f"Missing mobile code source in PostgreSQL reading: {activity_id}"
                    )
                if activity_id in {
                    "relational-data-and-postgresql-postgresql-first-connection-reading",
                    "relational-data-and-postgresql-query-performance-reading",
                    "relational-data-and-postgresql-postgresql-pagination-reading",
                    "relational-data-and-postgresql-postgresql-roles-and-privileges-reading",
                }:
                    page.screenshot(
                        path=str(ARTIFACTS / f"builder-postgresql-{activity_id.split('-')[-2]}-390.png"),
                        full_page=True,
                    )
                page.set_viewport_size({"width": 1440, "height": 900})
            code = content.locator("figure").filter(has=page.get_by_role("button", name="Copy"))
            if SCHOOL == "quality-steward":
                assert not activity_id.endswith("-quality-preparation"), (
                    f"Generated Quality preparation returned to learner journey: {activity_id}"
                )
                assert not activity_id.endswith("-worked-quality-model-reading"), (
                    f"Generated Quality 30-minute model returned: {activity_id}"
                )
                quality_original_readings = {
                    "quality-engineering-levels-types-001": ("Worked risk-to-boundary map: a forbidden ownership transfer", False),
                    "test-analysis-and-design-boundary-value-analysis-001": ("Executable inclusive-bound contract and negative control", True),
                    "quality-java-source-bytecode-jvm-introduction-001": ("Distinguish Java, JDK, bytecode and JVM", True),
                    "quality-java-objects-constructors-state-introduction-001": ("Definition: class versus object", True),
                    "unit-component-designing-unit-tests-001": ("An independent oracle, a real assertion, and a wrong implementation", True),
                    "api-integration-http-semantics-001": ("Execute a real localhost denial and verify no side effect", True),
                    "automation-framework-retries-001": ("Execute bounded retry and preserve its failed attempt", True),
                    "non-functional-performance-measurement-model-001": ("Work a complete request population, not a latency headline", True),
                    "quality-ci-quality-gates-001": ("Define the required evidence contract first", True),
                    "quality-continuous-scheduled-execution-pipeline-contract": ("Pipeline creation versus job selection", True),
                    "quality-continuous-scheduled-execution-schedule-guide": ("The YAML does not create the schedule", False),
                    "quality-reuse-boundary-001": ("What is a reusable test library, technically?", False),
                    "quality-steward-milestone-decision-evidence-001": ("Follow three reported green signals to their actual evidence", False),
                    "test-analysis-and-design-exploratory-testing-001": ("How investigation, test design and execution happen together", False),
                    "test-analysis-and-design-traceability-001": ("Treat traceability as a versioned evidence graph", False),
                    "test-analysis-and-design-negative-testing-001": ("Separate invalid input from forbidden action and unavailable dependency", False),
                    "browser-environment-navigation-network-001": ("Navigation, DOM construction and application readiness are different events", False),
                    "browser-environment-ui-test-selection-001": ("Choose a test surface by what can fail there", False),
                    "browser-environment-advanced-browser-interactions-001": ("An action can create a new event, resource or context", False),
                    "browser-environment-browser-diagnostics-001": ("Reconstruct one failure across four evidence layers", False),
                    "browser-environment-browser-parallelism-001": ("Separate process, session, page, identity and backend data", False),
                    "browser-environment-page-components-001": ("Extract behavior after two direct flows reveal the same interaction", False),
                    "api-integration-filters-observability-001": ("How a REST Assured filter surrounds the HTTP exchange", False),
                    "api-integration-specifications-001": ("Separate a factory-built transport baseline from scenario identity", False),
                    "api-integration-api-auth-001": ("Token acquisition, identity and authorization are separate dependencies", False),
                    "quality-java-types-modeling-001": ("A record is a shallow data carrier, not a deep freezer", True),
                    "quality-java-equality-object-contracts-001": ("Value equality, identity, and the hash collection invariant", True),
                    "quality-java-generics-collections-001": ("Choose collection semantics before choosing a generic helper", True),
                    "quality-java-exceptions-resources-001": ("Separate the primary failure from cleanup and rethrow", True),
                    "quality-java-annotations-reflection-001": ("Metadata is not execution: JUnit needs a discovery engine", True),
                    "quality-java-concurrency-atomicity-001": ("Why a visible value can still lose a write", True),
                    "quality-java-concurrency-threadlocal-001": ("A ThreadLocal is a thread-scoped slot, not a test-scoped identity", True),
                    "quality-java-functional-java-001": ("Streams are pipelines; Optional is a documented absence", True),
                    "api-integration-rest-assured-model-001": ("Trace HTTP request construction to the response oracle", False),
                    "api-integration-schema-contract-001": ("Structure, semantics and compatibility are separate claims", False),
                    "api-integration-mocking-virtualization-001": ("Model the boundary and make the fake's limitations explicit", False),
                    "browser-environment-browser-state-001": ("Storage scope versus authentication behavior", False),
                    "browser-environment-local-remote-001": ("One test claim, several network topologies", False),
                    "browser-environment-browserstack-001": ("Remote browsers expand environment coverage, not correctness criteria", False),
                    "browser-environment-cross-browser-001": ("Three browser engines are not three identical platforms", False),
                    "unit-component-isolation-001": ("Isolation begins by naming what you are actually trying to prove", False),
                    "unit-component-coverage-001": ("A coverage percentage is an execution fact, not proof of the oracle", False),
                    "unit-component-fast-feedback-001": ("Optimize feedback latency without removing a required evidence boundary", False),
                    "quality-engineering-risk-based-testing-001": ("Use a visible consequence-and-uncertainty model, not gut feel", False),
                    "quality-engineering-shift-left-right-001": ("Move feedback to where it changes decisions most cheaply", False),
                    "api-integration-api-client-boundary-001": ("Keep HTTP plumbing reusable, but make product operations readable", False),
                    "api-integration-database-assertions-001": ("A status assertion and a database invariant are different observations", False),
                    "test-analysis-and-design-requirements-analysis-001": ("Transform an ambiguous sentence into falsifiable conditions", False),
                    "test-analysis-and-design-pairwise-001": ("Construct and verify a covering array instead of picking random rows", True),
                    "api-integration-api-test-design-001": ("Derive API cases from contract, actor, state and durable postcondition", False),
                    "quality-java-surefire-failsafe-001": ("The build lifecycle owns discovery boundaries, not your IDE", True),
                    "quality-java-junit-platform-001": ("Trace a single method through the real Jupiter engine", True),
                    "unit-component-mocks-stubs-fakes-001": ("Choose evidence: state after behavior versus incidental call history", False),
                    "test-analysis-and-design-state-transition-testing-001": ("State and event together determine whether an action is permitted", True),
                    "test-analysis-and-design-test-oracles-001": ("The oracle must be independent of the defect it is trying to detect", True),
                    "browser-environment-playwright-runtime-model-001": ("Run an actual Java Playwright BrowserContext instead of only describing one", True),
                    "unit-component-test-doubles-001": ("A substitute must declare what it can and cannot prove", False),
                    "browser-environment-environment-parity-001": ("Parity means accounted-for differences, not equal-looking URLs", True),
                    "browser-environment-browser-differences-001": ("Distinguish engine implementation from the shape of the failure", True),
                    "quality-engineering-test-strategy-001": ("Treat strategy as a risk-to-evidence decision model", False),
                    "quality-engineering-testability-001": ("Control state, observe side effects, and make failures diagnosable", False),
                    "quality-engineering-defect-evidence-001": ("Observation, reproduction and hypothesis are three separate artifacts", False),
                    "quality-continuous-scheduled-execution-001": ("Simulate the exact pipeline-source decision, then verify it in real GitLab", True),
                    "quality-ci-reports-artifacts-001": ("A report is an executed assertion tied to a run, not just an uploaded file", False),
                    "quality-ci-test-selection-001": ("Selecting a suite is a decision contract, not a regex that happens to match", False),
                    "quality-java-maven-lifecycle-001": ("A phase executes bound goals; a goal can run directly", False),
                    "quality-java-maven-dependencies-001": ("Imports do not install libraries: Maven builds a versioned dependency graph", True),
                    "quality-java-junit-tags-001": ("JUnit tags select executable evidence, not product meaning", True),
                    "quality-java-junit-lifecycle-001": ("PER_METHOD ownership creates a fresh test object per invocation", True),
                    "test-analysis-and-design-equivalence-partitioning-001": ("A partition is an expected behavior, not a bucket of similar-looking inputs", True),
                    "api-integration-negative-resilience-001": ("A timeout after commit is not a failed write", True),
                    "api-integration-data-setup-cleanup-001": ("Every fixture has an owner; teardown may delete only that owner's state", True),
                    "browser-environment-responsive-testing-001": ("Responsive testing means continued ability to complete the task", True),
                    "api-integration-integration-boundaries-001": ("An integration test must keep the risky interaction real", False),
                    "quality-java-junit-extensions-001": ("JUnit extensions are lifecycle callbacks interpreted by the Jupiter engine", False),
                    "quality-java-interfaces-composition-001": ("An interface is a contract; composition supplies the collaborator", True),
                    "browser-environment-file-transfer-interactions-001": ("Upload a known fixture, not an arbitrary local file", False),
                    "browser-environment-popup-browser-ownership-001": ("Popup belongs to an originating page and a browser context", False),
                    "browser-environment-iframe-contexts-001": ("Identify a frame before searching inside it", False),
                    "browser-environment-blocking-dialogs-001": ("Plan handler lifecycle and choice before the click", False),
                    "browser-environment-browser-surface-decision-primer": ("Define the evidence boundary", False),
                    "non-functional-quality-performance-tool-decision-primer": ("Arrival rate is not the same as concurrent users", False),
                }
                depth_spotchecks = set(["test-analysis-and-design-exploratory-testing-001","test-analysis-and-design-traceability-001","test-analysis-and-design-negative-testing-001","browser-environment-navigation-network-001","browser-environment-ui-test-selection-001","browser-environment-advanced-browser-interactions-001","browser-environment-browser-diagnostics-001","browser-environment-browser-parallelism-001","browser-environment-page-components-001","api-integration-filters-observability-001","api-integration-specifications-001","api-integration-api-auth-001","browser-environment-file-transfer-interactions-001","browser-environment-popup-browser-ownership-001","browser-environment-iframe-contexts-001","browser-environment-blocking-dialogs-001"])
                if activity_id in depth_spotchecks:
                    assert len(text) >= 1800, (
                        f"Quality source-depth regression in {activity_id}: "
                        f"only {len(text)} visible characters"
                    )
                    assert content.locator("h2").count() >= 3, (
                        f"Missing multiple explanation sections in Quality source: {activity_id}"
                    )
                target = quality_original_readings.get(activity_id)
                if target:
                    heading, code_required = target
                    assert content.get_by_text(heading, exact=True).count() == 1, (
                        f"Original Quality instruction was not rendered: {activity_id}: {heading}"
                    )
                    if code_required:
                        assert code.count() >= 1, (
                            f"Original Quality executable example missing copyable code: {activity_id}"
                        )
            if SCHOOL == "reliability-engineer":
                reliability_source_readings = {
                    "logging-structured-logs-001": "Run a real parsing and correlation failure",
                    "observability-correlation-context-001": "Trace identity is not request identity, and neither proves completion",
                    "observability-instrumentation-001": "Put measurement at a real outcome boundary, not at an arbitrary helper",
                    "logging-correlation-ids-001": "Run the prior Observability HTTP-to-outbox proof, then query emitted events",
                    "logging-privacy-security-001": "Execute an allowlist against a real synthetic Authorization header",
                    "logging-centralized-logging-001": "Follow a log from code to Graylog search",
                    "logging-graylog-event-lifecycle-001": "Run the smallest observable event before operating Graylog",
                    "logging-graylog-event-lifecycle-indexed-search-reading": "Prove searchable evidence separately from HTTP 202",
                    "service-level-engineering-slis-001": "Execute a small positive and negative SLI model",
                    "service-level-engineering-error-budgets-001": "Derive budget and burn from the same committed event population",
                    "service-level-engineering-windowing-001": "Cohort maturity, event-time windows, and missing measurements",
                    "service-level-engineering-windowing-promtool-burn-rate-reading": "Derive burn rate from a stated SLO, not a copied threshold",
                    "metrics-prometheus-grafana-metric-types-001": "Why counters need reset-aware queries",
                    "metrics-prometheus-grafana-recording-rules-promtool-reading": "A recording rule is a stored time series, not proof of user health",
                    "alerting-and-on-call-actionable-alerts-001": "An alert is a decision pipeline, not a Boolean dashboard color",
                    "metrics-prometheus-grafana-prometheus-architecture-scrape-failures-reading": "Exercise a genuine metrics endpoint before choosing Prometheus",
                    "metrics-prometheus-grafana-promql-001": "A green or empty query is a hypothesis until you compare its source data",
                    "metrics-prometheus-grafana-grafana-001": "Use an explicit no-data state instead of decorating telemetry gaps green",
                    "reliability-distributed-tracing-implementation-001": "Execute two real local HTTP hops",
                    "reliability-alertmanager-implementation-001": "Exercise the HTTP notification boundary and its failure",
                    "reliability-alertmanager-implementation-route-mechanics-reading": "Alertmanager receives alert state, then chooses a receiver",
                    "reliability-alertmanager-implementation-live-delivery-reading": "Operate the real Alertmanager binary and inspect what a receiver actually gets",
                    "reliability-alertmanager-implementation-same-notification-retry-reading": "A new successful alert is not a retry of a failed one",
                    "reliability-alertmanager-implementation-ambiguous-side-effect-reading": "A failed webhook acknowledgment does not mean the receiver did nothing",
                    "reliability-alertmanager-implementation-prometheus-forwarding-reading": "Close the missing transport link with a real Prometheus rule",
                    "reliability-alertmanager-implementation-outage-recovery-reading": "A firing Prometheus rule does not imply a delivered page",
                    "data-protection-dr-backup-integrity-001": "Execute a disposable restore and deliberate corruption",
                    "resilience-distributed-failure-idempotency-001": "Run an ambiguous commit and retry it safely",
                    "fault-injection-controlled-failure-001": "Inject one bounded response failure after a synthetic commit",
                    "performance-and-capacity-latency-throughput-001": "Compute a real synthetic tail counterexample",
                    "incident-management-timeline-001": "Run a shuffled, duplicated evidence fixture",
                    "database-stewardship-slow-queries-plans-001": "Execute before/after index plans, then roll back all changes",
                    "reliability-observability-stack-integration-000": "Start with one user-visible failure and three diagnostic questions",
                    "reliability-observability-stack-integration-graylog-lab-guide": "Three components, three failure boundaries",
                    "steward-reliability-program-milestone-000": "What a defensible reliability claim contains",
                }
                required = reliability_source_readings.get(activity_id)
                if required:
                    assert content.get_by_text(required, exact=True).count() == 1, (
                        f"Original Reliability teaching heading not rendered: {activity_id}: {required}"
                    )
                    if activity_id not in {
                        "logging-centralized-logging-001",
                        # These lessons explicitly reuse executable source published
                        # in the preceding original Observability correlation lesson.
                        "observability-instrumentation-001",
                        # PromQL reuses source from Architecture; Grafana is
                        # concept/incident reasoning without duplicate Python.
                        "metrics-prometheus-grafana-grafana-001",
                        # Actionable Alerts explains the preceding real promtool lab,
                        # and does not duplicate both YAML files or an executable.
                        "alerting-and-on-call-actionable-alerts-001",
                        "logging-correlation-ids-001",
                        "logging-privacy-security-001",
                        "reliability-observability-stack-integration-000",
                        "steward-reliability-program-milestone-000",
                        # These two follow-on readings explicitly reuse the
                        # independently tested program published in SLIs.
                        # Do not require duplicate source code in each page.
                        "service-level-engineering-error-budgets-001",
                        "service-level-engineering-windowing-001",
                    }:
                        assert code.count() >= 1, (
                            f"Source-authored executable or SQL fixture missing from rendered reading: {activity_id}"
                        )
            if SCHOOL == "reliability-engineer" and activity_id in {
                "service-level-engineering-slis-001",
                "service-level-engineering-error-budgets-001",
                "service-level-engineering-windowing-001",
                "service-level-engineering-windowing-promtool-burn-rate-reading",
                "service-level-engineering-windowing-002",
                "service-level-engineering-slis-002",
            }:
                if activity_id == "service-level-engineering-slis-001":
                    assert content.get_by_text(
                        "Reconstruct lifecycle success from committed operations, not HTTP acknowledgments",
                        exact=True,
                    ).count() == 1, "Original SLIs lifecycle source was not rendered"
                    assert content.get_by_role("button", name="Copy").count() >= 1, (
                        "Original SLIs committed SQLite proof is not copyable"
                    )
                    assert "LEFT JOIN effects AS e" in text, (
                        "Original SLIs page lost source-published missing-effect denominator"
                    )
                if activity_id == "service-level-engineering-slis-002":
                    assert "Change b's consumer completion" in text and "t=95" in text, (
                        "Original paired SLI practical no longer requires negative transfer"
                    )
                if activity_id == "service-level-engineering-error-budgets-001":
                    assert "0.4 event-equivalents" in text and "5.00" in text, (
                        "Budget follow-on reading lost explicit source-derived units"
                    )
                if activity_id == "service-level-engineering-windowing-001":
                    assert "as_of=120" in text and "Change as_of to 75" in text, (
                        "Windowing follow-on lost source-derived maturity counterexample"
                    )
                if activity_id == "service-level-engineering-windowing-promtool-burn-rate-reading":
                    assert content.get_by_role("button", name="Copy").count() >= 3, (
                        "Official multiwindow rule, seven-case fixture and command must be copyable"
                    )
                    assert "StewardRegistrationFastBudgetBurn" in text and "0.0144" in text, (
                        "Source-published 14.4x rule or derived threshold lost"
                    )
                    assert "stale_long_window_after_healthy_recovery_does_not_fire" in text and (
                        "tiny_population_cannot_authorize_incident_page" in text
                    ), "Windowing lab lost recovered/low-volume changed cases"
                    assert "variable traffic" in text and "synthetic" in text, (
                        "Burn math overclaims constant event count or production evidence"
                    )
                if activity_id == "service-level-engineering-windowing-002":
                    assert "official promtool check rules" in text and (
                        "Falsify AND-to-OR" in text
                    ), "Original windowing practical lost official rules and negative mutation"
                    assert "reasonably stationary traffic" in text, (
                        "Windowing practical assumes volume-independent budget percentages"
                    )
                page.set_viewport_size({"width": 390, "height": 844})
                assert not page.evaluate(
                    "document.documentElement.scrollWidth > innerWidth + 2"
                ), f"Original Service Level activity overflows 390px: {activity_id}"
                page.set_viewport_size({"width": 1440, "height": 900})
            if SCHOOL == "reliability-engineer" and activity_id in {
                "logging-graylog-event-lifecycle-001",
                "logging-graylog-event-lifecycle-indexed-search-reading",
                "logging-graylog-event-lifecycle-002",
            }:
                if activity_id == "logging-graylog-event-lifecycle-001":
                    assert content.get_by_role("button", name="Copy").count() >= 1, (
                        "Original GELF UDP source is no longer copyable"
                    )
                    assert "local datagram contract" in text and "NOT a running Graylog input" in text, (
                        "Original GELF lesson lost its distinct local-only boundary"
                    )
                elif activity_id == "logging-graylog-event-lifecycle-indexed-search-reading":
                    assert content.get_by_text(
                        "Reproduce failures without weakening the search oracle",
                        exact=True,
                    ).count() == 1, (
                        "Focused Graylog indexed-search reading missing original mechanism"
                    )
                    assert content.get_by_text(
                        "Decode a columnar search result before trusting it",
                        exact=True,
                    ).count() == 1, "Schema/datarows mechanics not taught"
                    assert content.get_by_role("button", name="Copy").count() >= 1, (
                        "Source-published Search API Python is not copyable"
                    )
                    assert "DEMO_CONTRACT_PASS" in text and "NOT Graylog indexing" in text, (
                        "Fake index contract is being confused with real Graylog"
                    )
                else:
                    assert "TSA_DEMO_SCENARIO=ack_only" in text and "wrong_id" in text, (
                        "Original Graylog practical lacks indexed-search negative cases"
                    )
                page.set_viewport_size({"width": 390, "height": 844})
                assert not page.evaluate(
                    "document.documentElement.scrollWidth > innerWidth + 2"
                ), f"Original Graylog activity overflows 390px: {activity_id}"
                page.set_viewport_size({"width": 1440, "height": 900})
            if SCHOOL == "reliability-engineer" and activity_id in {
                "observability-correlation-context-001",
                "observability-correlation-context-002",
                "observability-instrumentation-001",
                "logging-correlation-ids-001",
                "logging-privacy-security-001",
                "logging-correlation-ids-002",
                "logging-privacy-security-002",
            }:
                if activity_id == "observability-correlation-context-001":
                    assert content.get_by_role("button", name="Copy").count() >= 1, (
                        "Original correlation lesson lost actual Python/SQLite source"
                    )
                    assert "ThreadingHTTPServer" in text and "CREATE TABLE outbox" in text, (
                        "Source-published HTTP/outbox mechanism not visible"
                    )
                    assert "NOT actual Steward" in text and "missing_worker_trace" in text, (
                        "Local-only and negative-context claims lost"
                    )
                elif activity_id == "observability-correlation-context-002":
                    assert "Intentionally replace the good worker trace ID" in text, (
                        "Paired practice no longer requires a real negative mutation"
                    )
                elif activity_id == "observability-instrumentation-001":
                    assert "independent SQLite query" in text, (
                        "Instrumentation source does not distinguish logs from effects"
                    )
                elif activity_id == "logging-correlation-ids-001":
                    assert "both workers have completed effects" in text.lower(), (
                        "Production logging source confuses missing trace and business failure"
                    )
                elif activity_id == "logging-privacy-security-001":
                    assert "DO_NOT_LOG_CLASSROOM_TOKEN" in text, (
                        "Logging privacy source lost bounded synthetic sentinel"
                    )
                elif activity_id == "logging-correlation-ids-002":
                    assert "remove the worker request_id" in text, (
                        "Original logging practice missing executable ID-loss transfer"
                    )
                elif activity_id == "logging-privacy-security-002":
                    assert "Intentionally inject the incoming Authorization header" in text, (
                        "Original privacy practical missing source-emission failure"
                    )
                page.set_viewport_size({"width": 390, "height": 844})
                assert not page.evaluate(
                    "document.documentElement.scrollWidth > innerWidth + 2"
                ), f"Correlation/Logging activity overflows at 390px: {activity_id}"
                page.set_viewport_size({"width": 1440, "height": 900})
            if SCHOOL == "reliability-engineer" and activity_id in {
                "metrics-prometheus-grafana-prometheus-architecture-001",
                "metrics-prometheus-grafana-prometheus-architecture-scrape-failures-reading",
                "metrics-prometheus-grafana-prometheus-architecture-002",
                "metrics-prometheus-grafana-promql-001",
                "metrics-prometheus-grafana-promql-002",
                "metrics-prometheus-grafana-grafana-001",
                "metrics-prometheus-grafana-grafana-002",
            }:
                if activity_id == "metrics-prometheus-grafana-prometheus-architecture-001":
                    assert "Prometheus collects time-series data primarily by scraping" in text, (
                        "Original Prometheus fundamentals reading was lost in lesson split"
                    )
                elif activity_id == "metrics-prometheus-grafana-prometheus-architecture-scrape-failures-reading":
                    assert content.get_by_role("button", name="Copy").count() >= 1, (
                        "Focused Prometheus failure-reading source is not copyable"
                    )
                    assert "ThreadingHTTPServer" in text and "http_requests_total" in text, (
                        "Original Prometheus reading does not expose actual local metrics"
                    )
                    assert "stale_exporter:" in text and "LOCAL_SCRAPE_ONLY" in text, (
                        "Original Prometheus source lost missing-telemetry provenance"
                    )
                elif activity_id == "metrics-prometheus-grafana-prometheus-architecture-002":
                    assert "Reproduce metrics HTTP 503" in text and "stale HTTP 200" in text, (
                        "Original Prometheus practical lacks failed scrape and stale data"
                    )
                elif activity_id == "metrics-prometheus-grafana-promql-001":
                    assert "absent_over_time" in text and "missing series" in text, (
                        "Original PromQL lesson lost no-target/no-data mechanics"
                    )
                elif activity_id == "metrics-prometheus-grafana-promql-002":
                    assert "If not executed" not in text or "UNVERIFIED" in text, (
                        "Original PromQL practice must not imply unperformed live queries"
                    )
                    assert "do not replace missing" in text.lower(), (
                        "Original PromQL practical masks missing measurements as zero"
                    )
                elif activity_id == "metrics-prometheus-grafana-grafana-001":
                    assert "No data, Error or alerting NoData" in text, (
                        "Original Grafana reading lacks explicit failure state"
                    )
                elif activity_id == "metrics-prometheus-grafana-grafana-002":
                    assert "If the backend is absent" in text and "NOT_TESTED" in text, (
                        "Original Grafana practical wrongly presumes real infrastructure"
                    )
                page.set_viewport_size({"width": 390, "height": 844})
                assert not page.evaluate(
                    "document.documentElement.scrollWidth > innerWidth + 2"
                ), f"Metrics source/practical overflows mobile viewport: {activity_id}"
                page.set_viewport_size({"width": 1440, "height": 900})
            if SCHOOL == "reliability-engineer" and activity_id in {
                "metrics-prometheus-grafana-recording-rules-001",
                "metrics-prometheus-grafana-recording-rules-promtool-reading",
                "metrics-prometheus-grafana-recording-rules-002",
                "alerting-and-on-call-actionable-alerts-001",
                "alerting-and-on-call-actionable-alerts-002",
            }:
                if activity_id == "metrics-prometheus-grafana-recording-rules-001":
                    assert "Recording rules precompute frequently used" in text, (
                        "Original recording-rules fundamentals were displaced"
                    )
                elif activity_id == "metrics-prometheus-grafana-recording-rules-promtool-reading":
                    assert content.get_by_role("button", name="Copy").count() >= 3, (
                        "Focused real rule/test/commands sources are not copyable"
                    )
                    assert "promtool test rules steward.test.yml" in text, (
                        "Original-path rule engine demonstration lacks executable command"
                    )
                    assert "initialized_zero_counters_no_traffic" in text and (
                        "configured_target_scrape_fails" in text
                    ), "Promtool test fixture coverage not displayed"
                    assert content.get_by_text(
                        "Falsify the rule, not the expected result", exact=True
                    ).count() == 1, "Mutated-source learning is missing"
                elif activity_id == "metrics-prometheus-grafana-recording-rules-002":
                    assert "wrong-rule" in text.lower() and "promtool test rules" in text, (
                        "Original recording-rules practical lacks actual mutated rule gate"
                    )
                elif activity_id == "alerting-and-on-call-actionable-alerts-001":
                    assert "LIVE_ALERT_DELIVERY_UNVERIFIED" in text, (
                        "Teaching claims notification from a synthetic PromQL test"
                    )
                    assert "pending" in text and "absent_over_time" in text, (
                        "Alert states and absent target are not distinguished"
                    )
                elif activity_id == "alerting-and-on-call-actionable-alerts-002":
                    assert "RULE_ENGINE_VERIFIED" in text and (
                        "LIVE_ALERT_DELIVERY_UNVERIFIED" in text
                    ), "Original practical does not require explicit live delivery evidence"
                page.set_viewport_size({"width": 390, "height": 844})
                assert not page.evaluate(
                    "document.documentElement.scrollWidth > innerWidth + 2"
                ), f"Recording/alerting source overflow at 390px: {activity_id}"
                page.set_viewport_size({"width": 1440, "height": 900})
            if SCHOOL == "reliability-engineer" and activity_id in {
                "reliability-alertmanager-implementation-001",
                "reliability-alertmanager-implementation-route-mechanics-reading",
                "reliability-alertmanager-implementation-live-delivery-reading",
                "reliability-alertmanager-implementation-same-notification-retry-reading",
                "reliability-alertmanager-implementation-ambiguous-side-effect-reading",
                "reliability-alertmanager-implementation-002",
                "reliability-alertmanager-implementation-003",
            }:
                if activity_id == "reliability-alertmanager-implementation-001":
                    assert "Receiver failure was unexpectedly accepted" in text, (
                        "Original manual loopback test was displaced"
                    )
                elif activity_id == "reliability-alertmanager-implementation-route-mechanics-reading":
                    assert content.get_by_role("button", name="Copy").count() >= 1, (
                        "Real route/group/inhibition template is not copyable"
                    )
                    assert "__RECEIVER_PORT__" in text and "group_interval: 5s" in text, (
                        "Original route-focused reading lost exact test input"
                    )
                elif activity_id == "reliability-alertmanager-implementation-live-delivery-reading":
                    assert content.get_by_role("button", name="Copy").count() >= 2, (
                        "Real Alertmanager runtime Python and command not copyable"
                    )
                    assert "REAL_ALERTMANAGER_RESOLVED_PASS" in text and (
                        "REAL_ALERTMANAGER_API_BOUNDARY_ONLY" in text
                    ), "Learner source misstates real Alertmanager output and limitations"
                elif activity_id == "reliability-alertmanager-implementation-same-notification-retry-reading":
                    assert content.get_by_role("button", name="Copy").count() >= 3, (
                        "Same notification 503/400/permanent failure source commands are not copyable"
                    )
                    assert "TSA_AM_RETRY_MODE=transient-503" in text and (
                        "TSA_AM_RETRY_MODE=nonretryable-400" in text
                    ), "Focused retry lesson does not execute positive and non-retryable case"
                    assert "TSA_AM_RETRY_MODE=permanent-503" in text and (
                        "SAME_ALERT_RETRY_NOT_PROVEN" in text
                    ), "Focused retry lesson does not falsify failed permanent delivery"
                    assert "fingerprint" in text and "groupKey" in text and (
                        "startsAt" in text
                    ), "Original retry proof lacks stable delivery identity"
                elif activity_id == "reliability-alertmanager-implementation-ambiguous-side-effect-reading":
                    assert content.get_by_role("button", name="Copy").count() >= 3, (
                        "Source-published SQLite and two real ambiguous retry commands are not copyable"
                    )
                    assert "CREATE UNIQUE INDEX" in text and (
                        "INSERT OR IGNORE" in text
                    ), "Original path lost actual database idempotency mechanism"
                    assert "TSA_AM_RETRY_MODE=ambiguous-503" in text and (
                        "TSA_AM_RETRY_MODE=ambiguous-no-idempotency" in text
                    ), "Positive and duplicate-effect changed-case are not in focused reading"
                    assert "DUPLICATE_NOTIFICATION_EFFECT_DETECTED" in text, (
                        "Reading does not require independent persisted-effect oracle"
                    )
                elif activity_id == "reliability-alertmanager-implementation-002":
                    assert "two distinct alerts no longer reach" not in text or (
                        "group_by" in text
                    ), "Practical lost wrong-grouping transfer"
                    assert "separate real Prometheus-to-Alertmanager source" in text and (
                        "neither proves real Steward rules" in text
                    ), "Original practical must distinguish tested local forwarding from unverified production alerting"
                elif activity_id == "reliability-alertmanager-implementation-003":
                    assert "actual HTTP 503 attempts" in text and (
                        "fresh group" in text
                    ), "Original failure/recovery practical conflates rejected and delivered"
                    assert "TSA_AM_RETRY_MODE=transient-503" in text and (
                        "SAME_ALERT_RETRY_NOT_PROVEN" in text
                    ), "Original recovery practical does not distinguish real same-notification retry from fresh delivery"
                    assert "TSA_AM_RETRY_MODE=ambiguous-503" in text and (
                        "TSA_AM_RETRY_MODE=ambiguous-no-idempotency" in text
                    ), "Original recovery practical does not require a durable idempotent effect and broken mutant"

                    assert "TSA_FORWARD_SCENARIO=alertmanager-outage" in text and (
                        "prometheus_notifications_errors_total" in text
                    ), "Original recovery practical does not require genuine lost Alertmanager transport"
                    assert "TSA_FORWARD_SCENARIO=outage-without-disconnect" in text, (
                        "Original recovery practical lacks false-outage negative transfer"
                    )
                page.set_viewport_size({"width": 390, "height": 844})
                assert not page.evaluate(
                    "document.documentElement.scrollWidth > innerWidth + 2"
                ), f"Alertmanager real-source activity overflows 390px: {activity_id}"
                page.set_viewport_size({"width": 1440, "height": 900})
            if SCHOOL == "reliability-engineer" and activity_id in {
                "reliability-alertmanager-implementation-prometheus-forwarding-reading",
                "reliability-alertmanager-implementation-outage-recovery-reading",
                "reliability-alertmanager-implementation-002",
            }:
                if activity_id == "reliability-alertmanager-implementation-outage-recovery-reading":
                    assert content.get_by_role("button", name="Copy").count() >= 2, (
                        "Focused Alertmanager outage/recovery commands not copyable"
                    )
                    assert "prometheus_notifications_errors_total" in text and (
                        "outage-without-disconnect" in text
                    ), "Focused outage reading lost source errors and false-outage mutation"
                    assert "firing" in text and "resolved" in text, (
                        "Delayed recovery source does not distinguish alert state transitions"
                    )
                elif activity_id == "reliability-alertmanager-implementation-prometheus-forwarding-reading":
                    assert content.get_by_role("button", name="Copy").count() >= 1, (
                        "Prometheus forwarded exact Python is not copyable"
                    )
                    assert "PROMETHEUS_TO_ALERTMANAGER_TO_WEBHOOK_FIRING_PASS" in text, (
                        "Real source forwarding event assertion absent"
                    )
                    assert "PROMETHEUS_TO_ALERTMANAGER_TO_WEBHOOK_RESOLVED_PASS" in text, (
                        "Resolved notification contract is not published"
                    )
                    assert "TSA_FORWARD_RULE_VARIANT" in text and "wrong-condition" in text, (
                        "Negative-control source missing"
                    )
                else:
                    assert "Prometheus-forwarding source" in text, (
                        "Original Alertmanager practical lost real forwarding transfer"
                    )
                page.set_viewport_size({"width": 390, "height": 844})
                assert not page.evaluate(
                    "document.documentElement.scrollWidth > innerWidth + 2"
                ), f"Prometheus Alertmanager source overflows 390px: {activity_id}"
                page.set_viewport_size({"width": 1440, "height": 900})
            for k in range(code.count()):
                assert code.nth(k).locator("pre").count() > 0, (
                    f"Code block not rendered: {activity_id}"
                )
            reflection = page.get_by_placeholder("Write your response here...")
            practical = page.get_by_text("Engineering Practice", exact=True).count() > 0
            activity_type = "reading"
            if reflection.count():
                activity_type = "reflection"
                reflection.fill(SYNTHETIC_REFLECTION)
            elif practical:
                activity_type = "practical"
                assert content.get_by_text("Work through the problem", exact=True).count() >= 1, (
                    f"Practical has no visible instructions: {activity_id}"
                )
                assert content.get_by_text("Evidence to keep", exact=True).count() >= 1, (
                    f"Practical has no visible deliverables: {activity_id}"
                )
            else:
                assert content.locator("p").count() >= 1, (
                    f"Reading lacks a rendered explanatory paragraph: {activity_id}"
                )
            if not reflection.count():
                assert content.locator("h1").count() >= 1, (
                    f"Missing activity heading: {activity_id}"
                )
            nxt = page.get_by_role("button", name=NEXT)
            # The Cloud final milestone is deliberately NOT a click-through path.
            # Test the authentic first operational gate without fabricating an
            # accepted evidence record or misreporting the later gates as visited.
            if SCHOOL == "cloud-engineer" and activity_id == (
                "steward-internet-environment-gate-1-hosting-architecture-001"
            ):
                assert module_index == module_count - 1, "Cloud exit gate moved outside final module"
                assert count == 10, "Original Cloud milestone activity inventory changed"
                assert nxt.count() == 1 and not nxt.is_enabled(), (
                    "Cloud exit gate accepted an empty evidence record"
                )
                assert (
                    "Save a substantial accepted evidence record before proceeding." in text
                    and "self-attested navigation gate" in text
                ), "Cloud exit evidence warning is not visible"
                evidence.append({
                    "module": module_index + 1,
                    "activity_id": activity_id,
                    "activity_type": activity_type,
                    "visible_characters": len(text),
                    "code_blocks": code.count(),
                    "progression": "BLOCKED_UNVERIFIED_EVIDENCE",
                })
                evidence_gates.append({
                    "module": module_index + 1,
                    "blocked_activity": activity_id,
                    "browser_inspected": len(visited),
                    "not_traversed": count - len(visited),
                    "reason": "independent operational evidence required; no synthetic acceptance",
                })
                print(
                    "EXPECTED Cloud final milestone evidence gate: first two original "
                    "activities inspected; eight downstream operational activities "
                    "NOT_BROWSER_VERIFIED; no synthetic acceptance",
                    flush=True,
                )
                break
            assert nxt.count() == 1 and nxt.is_enabled(), (
                f"Progression unavailable: {activity_id}"
            )
            evidence.append({
                "module": module_index + 1,
                "activity_id": activity_id,
                "activity_type": activity_type,
                "visible_characters": len(text),
                "code_blocks": code.count(),
            })
            if SCHOOL in {"builder", "system-thinker"} and len(visited) < count:
                # Reproduce a long reading: navigating from its bottom must take
                # the learner to the start of the next activity, not mid-page.
                has_scroll = page.evaluate(
                    "document.documentElement.scrollHeight > innerHeight + 120"
                )
                if has_scroll:
                    page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
                    assert page.evaluate("window.scrollY") > 30, (
                        f"Could not establish scroll regression precondition: {activity_id}"
                    )
            nxt.click()
            if SCHOOL in {"builder", "system-thinker"} and len(visited) < count and has_scroll:
                page.wait_for_function("window.scrollY <= 8", timeout=8000)
        if SCHOOL == "cloud-engineer" and module_index == module_count - 1:
            assert len(visited) == 2 and len(evidence_gates) == 1, (
                "Cloud exit evidence gate not checked at the original first practice"
            )
            print(
                f"PASS {SCHOOL} module {module_index+1}/{module_count}: "
                f"{len(visited)}/{count} inspected, {count-len(visited)} "
                "authentically gated; NOT a complete milestone traversal", flush=True,
            )
        else:
            assert len(visited) == count, (
                f"Unexpected early stop in {SCHOOL} module {module_index+1}"
            )
            print(f"PASS {SCHOOL} module {module_index+1}/{module_count}: {count} activities", flush=True)
    assert not errors, f"Browser exceptions in {SCHOOL}: {errors}"
    # A readable page is not automatically a sufficiently developed explanation.
    # Report the shortest conceptual readings for qualitative review; these are
    # not automatic failures because code, tables and graphics vary by lesson.
    short_readings = sorted(
        (item for item in evidence if item["activity_type"] == "reading"),
        key=lambda item: item["visible_characters"],
    )[:12]
    output = {
        "school": SCHOOL,
        "modules": module_count,
        "activities": evidence,
        "authentically_blocked_evidence_gates": evidence_gates,
        "shortest_readings_for_manual_review": short_readings,
    }
    print(f"REVIEW {SCHOOL} shortest rendered readings (not CI failures):", flush=True)
    for item in short_readings:
        print(f"  {item['visible_characters']:5} chars {item['activity_id']}", flush=True)
    path = ARTIFACTS / f"{SCHOOL}.json"
    path.write_text(json.dumps(output, indent=2), encoding="utf-8")
    if evidence_gates:
        print(
            f"PASS {SCHOOL}: inspected {len(evidence)} real rendered activities; "
            f"{sum(g['not_traversed'] for g in evidence_gates)} later milestone "
            "activities remain NOT_BROWSER_VERIFIED behind authentic evidence gate",
            flush=True,
        )
    else:
        print(f"PASS {SCHOOL}: traversed {len(evidence)} real rendered activities", flush=True)


def check_mobile_first_module(page):
    """Check actual mobile layout for reading/practical in the first school module."""
    page.goto(f"{BASE}/?view=curriculum&school={SCHOOL}", wait_until="networkidle")
    page.get_by_role("button", name=MODULE).first.click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    main = page.locator("main").last
    main.wait_for(timeout=30000)
    assert main.inner_text().strip(), f"Blank mobile lesson for {SCHOOL}"
    assert not page.evaluate("document.documentElement.scrollWidth > innerWidth + 2"), (
        f"Horizontal mobile overflow on first activity in {SCHOOL}"
    )
    next_button = page.get_by_role("button", name=NEXT)
    assert next_button.count() == 1 and next_button.is_enabled(), (
        f"Mobile next control unavailable for {SCHOOL}"
    )
    next_button.click()
    main.wait_for(timeout=30000)
    assert main.inner_text().strip(), f"Blank mobile follow-up for {SCHOOL}"
    assert not page.evaluate("document.documentElement.scrollWidth > innerWidth + 2"), (
        f"Horizontal mobile overflow on follow-up activity in {SCHOOL}"
    )
    print(f"PASS {SCHOOL} mobile first two activities at 390px", flush=True)


def check_builder_mobile_modules(page):
    """Check at least the first reading and follow-up for EVERY Builder module."""
    page.goto(f"{BASE}/?view=curriculum&school=builder", wait_until="networkidle")
    count = page.get_by_role("button", name=MODULE).count()
    assert count >= 7, f"Expected seven Builder modules, found {count}"
    for index in range(count):
        page.goto(f"{BASE}/?view=curriculum&school=builder", wait_until="networkidle")
        page.get_by_role("button", name=MODULE).nth(index).click()
        page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
        for k in range(2):
            main = page.locator("main").last
            main.wait_for(timeout=30000)
            assert main.inner_text().strip(), f"Blank Builder mobile module {index+1} activity {k+1}"
            assert not page.evaluate(
                "document.documentElement.scrollWidth > innerWidth + 2"
            ), f"Horizontal overflow in Builder module {index+1} mobile activity {k+1}"
            if k == 0:
                page.get_by_role("button", name=NEXT).click()
                page.wait_for_function("window.scrollY <= 8", timeout=8000)
        print(f"PASS builder mobile module {index+1}/{count}: first two activities", flush=True)


def check_system_thinker_mobile_all(page):
    """All System Thinker activities at 390px, with content, navigation and scroll regression."""
    page.goto(f"{BASE}/?view=curriculum&school=system-thinker", wait_until="networkidle")
    module_count = page.get_by_role("button", name=MODULE).count()
    assert module_count == 11, f"Expected 11 System Thinker modules, found {module_count}"
    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))
    total = 0
    for module_index in range(module_count):
        page.goto(f"{BASE}/?view=curriculum&school=system-thinker", wait_until="networkidle")
        page.get_by_role("button", name=MODULE).nth(module_index).click()
        page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
        sidebar = page.locator("aside").filter(has=page.get_by_text("Curriculum", exact=True)).first
        activity_count = sidebar.locator("button").count()
        assert activity_count > 0, f"No System Thinker module {module_index+1} activities"
        seen = set()
        for activity_index in range(activity_count):
            activity_id = page.evaluate(
                "new URLSearchParams(location.search).get('activity')"
            )
            assert activity_id and activity_id not in seen, (
                f"Mobile activity ID missing/repeated: {activity_id}"
            )
            seen.add(activity_id)
            main = page.locator("main").last
            assert main.is_visible() and main.inner_text().strip(), (
                f"Blank System Thinker mobile activity: {activity_id}"
            )
            assert not page.evaluate(
                "document.documentElement.scrollWidth > innerWidth + 2"
            ), f"Horizontal page overflow at 390px: {activity_id}"
            for block in main.locator("figure").filter(
                has=page.get_by_role("button", name="Copy")
            ).all():
                # A scrollable code figure is acceptable; its code must remain present.
                assert block.locator("pre").count() >= 1, (
                    f"Missing code display on mobile: {activity_id}"
                )
            if activity_index < activity_count - 1:
                reflection = page.get_by_placeholder("Write your response here...")
                if reflection.count():
                    reflection.fill(SYNTHETIC_REFLECTION)
                can_scroll = page.evaluate(
                    "document.documentElement.scrollHeight > innerHeight + 120"
                )
                if can_scroll:
                    page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
                    assert page.evaluate("window.scrollY") > 30, (
                        f"Unable to establish mobile long-scroll precondition: {activity_id}"
                    )
                next_button = page.get_by_role("button", name=NEXT)
                assert next_button.count() == 1 and next_button.is_enabled(), (
                    f"Unusable mobile navigation at {activity_id}"
                )
                next_button.click()
                page.wait_for_function("window.scrollY <= 8", timeout=8000)
            total += 1
        print(
            f"PASS system-thinker mobile module {module_index+1}/{module_count}: "
            f"{activity_count} activities with no overflow and top navigation",
            flush=True,
        )
    assert not errors, f"System Thinker mobile browser exceptions: {errors}"
    print(f"PASS system-thinker 390px mobile traversal: {total} activities", flush=True)


def check_quality_mobile_all(page):
    """Traverse all Quality activities at 390px rather than the first module only.

    Checks rendering, horizontal overflow, code, activity order and scroll reset.
    It is synthetic navigation, not novice validation or actual lab evidence.
    """
    page.goto(f"{BASE}/?view=curriculum&school=quality-steward", wait_until="networkidle")
    module_count = page.get_by_role("button", name=MODULE).count()
    assert module_count == 12, f"Expected 12 Quality modules, found {module_count}"
    errors = []
    overflow_cases = []
    page.on("pageerror", lambda err: errors.append(str(err)))
    total = 0
    for module_index in range(module_count):
        page.goto(f"{BASE}/?view=curriculum&school=quality-steward", wait_until="networkidle")
        page.get_by_role("button", name=MODULE).nth(module_index).click()
        page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
        sidebar = page.locator("aside").filter(has=page.get_by_text("Curriculum", exact=True)).first
        activity_count = sidebar.locator("button").count()
        assert activity_count > 0, f"Quality mobile module {module_index+1} is empty"
        seen = set()
        for activity_index in range(activity_count):
            activity_id = page.evaluate("new URLSearchParams(location.search).get('activity')")
            assert activity_id and activity_id not in seen, (
                f"Quality mobile activity missing/repeated: {activity_id}"
            )
            seen.add(activity_id)
            content = page.locator("main").last
            # Wait for the real persisted-evidence panel rather than assessing
            # an optimistic loading frame before its select/textarea controls
            # can contribute to the mobile intrinsic-width calculation.
            if content.get_by_text("Engineering Practice", exact=True).count():
                page.get_by_text("Loading evidence workspace…").wait_for(
                    state="hidden", timeout=30000
                )
                assert content.get_by_text("Evidence workspace", exact=True).count() == 1, (
                    f"Quality practical evidence controls not rendered: {activity_id}"
                )
            assert content.is_visible() and len(content.inner_text().strip()) >= 90, (
                f"Quality mobile content missing: {activity_id}"
            )
            if page.evaluate("document.documentElement.scrollWidth > innerWidth + 2"):
                # Preserve the actual overflowing boxes; hiding overflow would
                # make CI green while mobile learners still lose readable text.
                offenders = page.evaluate("""() => [...document.querySelectorAll('body *')]
                    .filter(el => {
                        const box = el.getBoundingClientRect();
                        return box.width > 0 && box.right > innerWidth + 2;
                    }).map(el => {
                        const box = el.getBoundingClientRect();
                        const css = getComputedStyle(el);
                        return {
                            element: el.tagName.toLowerCase(),
                            className: String(el.className).slice(0, 180),
                            left: Math.round(box.left),
                            right: Math.round(box.right),
                            width: Math.round(box.width),
                            whiteSpace: css.whiteSpace,
                            minWidth: css.minWidth,
                            text: (el.innerText || '').slice(0, 140),
                        };
                    }).slice(-16)""")
                print(f"QUALITY MOBILE OVERFLOW {activity_id}: {offenders}", flush=True)
                overflow_cases.append({"activity": activity_id, "elements": offenders})
                if len(overflow_cases) <= 6:
                    page.screenshot(
                        path=str(ARTIFACTS / f"quality-overflow-{len(overflow_cases)}.png"),
                        full_page=True
                    )
                # Continue through all 12 modules to identify every failing
                # activity in one strict run rather than fixing the first one
                # and needing another whole-school CI cycle.
            for figure in content.locator("figure").filter(
                has=page.get_by_role("button", name="Copy")
            ).all():
                assert figure.locator("pre").count() > 0, (
                    f"Quality code missing at 390px: {activity_id}"
                )
            if activity_index < activity_count - 1:
                reflection = page.get_by_placeholder("Write your response here...")
                if reflection.count():
                    reflection.fill(SYNTHETIC_REFLECTION)
                can_scroll = page.evaluate(
                    "document.documentElement.scrollHeight > innerHeight + 120"
                )
                if can_scroll:
                    page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
                    assert page.evaluate("window.scrollY") > 30, (
                        f"Quality mobile scroll precondition failed: {activity_id}"
                    )
                nxt = page.get_by_role("button", name=NEXT)
                assert nxt.count() == 1 and nxt.is_enabled(), (
                    f"Quality mobile navigation unavailable: {activity_id}"
                )
                nxt.click()
                page.wait_for_function("window.scrollY <= 8", timeout=8000)
            total += 1
        print(f"PASS Quality mobile module {module_index+1}/{module_count}: "
              f"{activity_count} authored activities", flush=True)
    assert not errors, f"Quality mobile browser exceptions: {errors}"
    assert not overflow_cases, (
        f"Quality mobile horizontal overflow in {len(overflow_cases)} authored activities: "
        f"{[case['activity'] for case in overflow_cases]}"
    )
    print(f"PASS Quality Steward full 390px mobile traversal: {total} activities", flush=True)


def check_system_thinker_reentry(page):
    """Persistence regression with a synthetic learner in a fresh browser profile.

    Tests actual IndexedDB read/write across reload, not pedagogy, real lab
    execution, independent learning or multi-device synchronization.
    """
    page.goto(f"{BASE}/?view=curriculum&school=system-thinker", wait_until="networkidle")
    page.get_by_role("button", name=MODULE).first.click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    params = page.evaluate("new URLSearchParams(location.search).toString()")
    assert "path=" in params, "Module did not open with durable path identity"

    # First reading -> first practical: evidence must survive a hard reload.
    page.get_by_role("button", name=NEXT).click()
    page.get_by_placeholder("What did you build, inspect, break, diagnose, or change? Include commands, observations, and important decisions.").wait_for()
    notes = "Synthetic System Thinker evidence: a named C4 boundary and a rejected assumption."
    page.get_by_placeholder("What did you build, inspect, break, diagnose, or change? Include commands, observations, and important decisions.").fill(notes)
    page.get_by_placeholder("What was the result? What did the evidence prove, and what would you do differently next time?").fill("This is a storage regression, not validated system-design evidence.")
    page.get_by_role("button", name="Save evidence").click()
    page.get_by_text("Saved locally", exact=True).wait_for()
    practical_id = page.evaluate("new URLSearchParams(location.search).get('activity')")
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    page.get_by_placeholder("What did you build, inspect, break, diagnose, or change? Include commands, observations, and important decisions.").wait_for()
    actual = page.get_by_placeholder("What did you build, inspect, break, diagnose, or change? Include commands, observations, and important decisions.").input_value()
    assert actual == notes, f"Practical evidence lost on reload: {practical_id}"

    # First reflection -> persist the completed text, then reload on the same URL.
    page.get_by_role("button", name=NEXT).click()
    reflection = page.get_by_placeholder("Write your response here...")
    reflection.wait_for()
    reflection_id = page.evaluate("new URLSearchParams(location.search).get('activity')")
    path_id = page.evaluate("new URLSearchParams(location.search).get('path')")
    answer = "Synthetic transfer check only. " * 12
    reflection.fill(answer)
    # Wait for IndexedDB commit, not just React state, before navigation.
    page.wait_for_function("""async ({pathId, activityId, expected}) => {
      const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open("tsa-academy", 5);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      try {
        const tx = db.transaction("path-progress", "readonly");
        const record = await new Promise((resolve, reject) => {
          const request = tx.objectStore("path-progress").get(pathId);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        return record?.reflectionResponses?.[activityId] === expected;
      } finally {
        db.close();
      }
    }""", arg={"pathId": path_id, "activityId": reflection_id, "expected": answer}, timeout=12000)
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    assert page.get_by_placeholder("Write your response here...").input_value() == answer, (
        f"Reflection content lost on reload: {reflection_id}"
    )
    print("PASS system-thinker IndexedDB reentry: practical evidence and reflection persisted across hard reload", flush=True)



def check_quality_retired_activity_progress(page):
    """Legacy generic Quality wrapper IDs must not count as authored completion."""
    page.goto(f"{BASE}/?view=curriculum&school=quality-steward", wait_until="networkidle")
    page.get_by_role("button", name=MODULE).first.wait_for()
    page.evaluate("""async () => {
      const db = await new Promise((resolve, reject) => {
        const req = indexedDB.open('tsa-academy', 5);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      try {
        const tx = db.transaction('path-progress','readwrite');
        tx.objectStore('path-progress').put({
          pathId:'quality-engineering',schemaVersion:1,
          currentActivityId:'quality-engineering-worked-quality-model-reading',
          completedActivityIds:Array.from({length:50},(_,i)=>
            'synthetic-retired-quality-preparation-'+i),
          reflectionResponses:{},
          startedAt:'2026-10-01T00:00:00.000Z',
          updatedAt:'2026-10-01T00:00:00.000Z'
        });
        await new Promise((resolve,reject)=>{
          tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error);
        });
      } finally { db.close(); }
    }""")
    page.reload(wait_until="networkidle")
    module = page.locator("article").filter(
        has=page.get_by_role("heading",name="Quality Engineering",exact=True)
    ).first
    module.get_by_text("0%",exact=True).wait_for(timeout=12000)
    module.get_by_role("button",name="Continue module").click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    activity = page.evaluate("new URLSearchParams(location.search).get('activity')")
    assert activity == "quality-engineering-quality-vs-testing-001", (
        f"Quality re-entry did not return to first actual authored lesson: {activity}"
    )
    print("PASS Quality legacy wrapper progress excluded and first author lesson restored",flush=True)


def check_reliability_retired_activity_progress(page):
    """Retired generated wrapper IDs may persist in an older learner record.

    They must not count toward current authored-activity completion, and a
    stale currentActivityId must not prevent re-entry. Synthetic isolated DB.
    """
    page.goto(f"{BASE}/?view=curriculum&school=reliability-engineer", wait_until="networkidle")
    page.get_by_role("button", name=MODULE).first.wait_for()
    page.evaluate("""async () => {
      const db = await new Promise((resolve, reject) => {
        const req = indexedDB.open('tsa-academy', 5);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      try {
        const tx = db.transaction('path-progress','readwrite');
        tx.objectStore('path-progress').put({
          pathId:'reliability-and-sre',schemaVersion:1,
          currentActivityId:'reliability-and-sre-reliability-model-reading',
          completedActivityIds:Array.from({length:50},(_,i)=>
            'legacy-synthetic-reliability-preparation-'+i),
          reflectionResponses:{},
          startedAt:'2026-10-01T00:00:00.000Z',
          updatedAt:'2026-10-01T00:00:00.000Z'
        });
        await new Promise((resolve,reject)=>{
          tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error);
        });
      } finally { db.close(); }
    }""")
    page.reload(wait_until="networkidle")
    module = page.locator("article").filter(
        has=page.get_by_role("heading",name="Reliability and SRE Foundations",exact=True)
    ).first
    module.get_by_text("0%",exact=True).wait_for(timeout=12000)
    assert module.get_by_text("Completed",exact=True).count() == 0, (
        "Retired activities were incorrectly counted as completed curriculum")
    module.get_by_role("button",name="Continue module").click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    activity = page.evaluate("new URLSearchParams(location.search).get('activity')")
    assert activity and "reliability-model" not in activity, (
        f"Re-entry followed removed generated wrapper: {activity}")
    print("PASS Reliability retired-wrapper progress excluded and safe re-entry",flush=True)


def check_reliability_reentry(page):
    """Persistence regression with a synthetic learner in a fresh browser profile.

    Tests actual IndexedDB read/write across reload, not pedagogy, real lab
    execution, independent learning or multi-device synchronization.
    """
    page.goto(f"{BASE}/?view=curriculum&school=reliability-engineer", wait_until="networkidle")
    page.get_by_role("button", name=MODULE).first.click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    params = page.evaluate("new URLSearchParams(location.search).toString()")
    assert "path=" in params, "Module did not open with durable path identity"

    # First reading -> first practical: evidence must survive a hard reload.
    page.get_by_role("button", name=NEXT).click()
    page.get_by_placeholder("What did you build, inspect, break, diagnose, or change? Include commands, observations, and important decisions.").wait_for()
    notes = "Synthetic Reliability Engineer evidence: a named C4 boundary and a rejected assumption."
    page.get_by_placeholder("What did you build, inspect, break, diagnose, or change? Include commands, observations, and important decisions.").fill(notes)
    page.get_by_placeholder("What was the result? What did the evidence prove, and what would you do differently next time?").fill("This is a storage regression, not validated reliability competence.")
    page.get_by_role("button", name="Save evidence").click()
    page.get_by_text("Saved locally", exact=True).wait_for()
    practical_id = page.evaluate("new URLSearchParams(location.search).get('activity')")
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    page.get_by_placeholder("What did you build, inspect, break, diagnose, or change? Include commands, observations, and important decisions.").wait_for()
    actual = page.get_by_placeholder("What did you build, inspect, break, diagnose, or change? Include commands, observations, and important decisions.").input_value()
    assert actual == notes, f"Practical evidence lost on reload: {practical_id}"

    # First reflection -> persist the completed text, then reload on the same URL.
    page.get_by_role("button", name=NEXT).click()
    reflection = page.get_by_placeholder("Write your response here...")
    reflection.wait_for()
    reflection_id = page.evaluate("new URLSearchParams(location.search).get('activity')")
    path_id = page.evaluate("new URLSearchParams(location.search).get('path')")
    answer = "Synthetic transfer check only. " * 12
    reflection.fill(answer)
    # Wait for IndexedDB commit, not just React state, before navigation.
    page.wait_for_function("""async ({pathId, activityId, expected}) => {
      const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open("tsa-academy", 5);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      try {
        const tx = db.transaction("path-progress", "readonly");
        const record = await new Promise((resolve, reject) => {
          const request = tx.objectStore("path-progress").get(pathId);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        return record?.reflectionResponses?.[activityId] === expected;
      } finally {
        db.close();
      }
    }""", arg={"pathId": path_id, "activityId": reflection_id, "expected": answer}, timeout=12000)
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    assert page.get_by_placeholder("Write your response here...").input_value() == answer, (
        f"Reflection content lost on reload: {reflection_id}"
    )
    print("PASS reliability-engineer IndexedDB reentry: practical evidence and reflection persisted across hard reload", flush=True)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    inspect_school(context.new_page())
    context.close()
    mobile = browser.new_context(viewport={"width": 390, "height": 844})
    if SCHOOL == "builder":
        check_builder_mobile_modules(mobile.new_page())
    elif SCHOOL == "quality-steward":
        check_quality_mobile_all(mobile.new_page())
    elif SCHOOL == "system-thinker":
        check_system_thinker_mobile_all(mobile.new_page())
        isolated = browser.new_context(viewport={"width": 1440, "height": 900})
        check_system_thinker_reentry(isolated.new_page())
        isolated.close()
    else:
        check_mobile_first_module(mobile.new_page())
    mobile.close()
    if SCHOOL == "quality-steward":
        isolated = browser.new_context(viewport={"width": 1440, "height": 900})
        check_quality_retired_activity_progress(isolated.new_page())
        isolated.close()
    if SCHOOL == "reliability-engineer":
        isolated = browser.new_context(viewport={"width": 1440, "height": 900})
        check_reliability_retired_activity_progress(isolated.new_page())
        isolated.close()
        practice_context = browser.new_context(viewport={"width": 1440, "height": 900})
        check_reliability_reentry(practice_context.new_page())
        practice_context.close()
    browser.close()
