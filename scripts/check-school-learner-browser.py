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
                    "browser-environment-browser-surface-decision-primer": ("Define the evidence boundary", False),
                    "non-functional-quality-performance-tool-decision-primer": ("Arrival rate is not the same as concurrent users", False),
                }
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
                    "logging-centralized-logging-001": "Follow a log from code to Graylog search",
                    "service-level-engineering-slis-001": "Execute a small positive and negative SLI model",
                    "metrics-prometheus-grafana-metric-types-001": "Why counters need reset-aware queries",
                    "reliability-distributed-tracing-implementation-001": "Execute two real local HTTP hops",
                    "reliability-alertmanager-implementation-001": "Exercise the HTTP notification boundary and its failure",
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
                        "reliability-observability-stack-integration-000",
                        "steward-reliability-program-milestone-000",
                    }:
                        assert code.count() >= 1, (
                            f"Source-authored executable or SQL fixture missing from rendered reading: {activity_id}"
                        )
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
        "shortest_readings_for_manual_review": short_readings,
    }
    print(f"REVIEW {SCHOOL} shortest rendered readings (not CI failures):", flush=True)
    for item in short_readings:
        print(f"  {item['visible_characters']:5} chars {item['activity_id']}", flush=True)
    path = ARTIFACTS / f"{SCHOOL}.json"
    path.write_text(json.dumps(output, indent=2), encoding="utf-8")
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
            assert content.is_visible() and len(content.inner_text().strip()) >= 90, (
                f"Quality mobile content missing: {activity_id}"
            )
            assert not page.evaluate("document.documentElement.scrollWidth > innerWidth + 2"), (
                f"Quality mobile page overflow: {activity_id}"
            )
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
