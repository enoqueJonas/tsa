"""Verify rendered Software Craft teaching on a disposable Chromium profile.

No learner competence is inferred from synthetic IndexedDB completions.
"""
import re
from pathlib import Path
from urllib.parse import urlencode

from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:4173"
PATH_ID = "software-craft"
SOURCE = Path("packages/runtime-kernel/src/paths/builder-software-craft-deep.ts")
ARTIFACTS = Path("artifacts/software-craft-browser")
ARTIFACTS.mkdir(parents=True, exist_ok=True)

READINGS = [
    ("software-craft-managing-dependencies-reading",
     "Execute an offline direct-import versus declared-distribution review"),
    ("software-craft-python-logging-from-first-principles-reading",
     "Execute a logger with two thresholds and one negative control"),
    ("software-craft-useful-logging-reading",
     "Prove logs capture context but not credentials"),
    ("software-craft-architecture-decision-records-reading",
     "Inspect a complete, falsifiable Steward ADR"),
    ("software-craft-operational-runbooks-and-safe-diagnostic-handoffs-reading",
     "Study a full bounded Steward troubleshooting runbook"),
    ("software-craft-failure-boundaries-and-public-error-contracts-reading",
     "Create and break a public response-policy oracle"),
    ("software-craft-designing-errors-reading",
     "Verify public failure behavior against the previously implemented signed DRF routes"),
    ("software-craft-lab-change-safety-review-reading",
     "Stage 1 — baseline before modification"),
    ("software-craft-lab-configuration-observability-errors-reading",
     "Stage 1 — make startup errors explicit"),
    ("software-craft-lab-reproducible-handoff-performance-reading",
     "Stage 1 — validate the handoff from a clean environment"),
]


def deep_link(activity):
    return BASE + "/?" + urlencode({
        "view": "curriculum", "school": "builder",
        "path": PATH_ID, "activity": activity
    })


def seed_disposable_progress(page):
    text = SOURCE.read_text(encoding="utf-8")
    titles = re.findall(r'\n\s*lesson\(\s*"([^"]+)"', text)
    assert len(titles) == 26 and len(set(titles)) == 26, (
        f"Expected 26 source lessons, found {len(titles)}"
    )
    def slug(title):
        return re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", title.lower()))

    ids = [
        "software-craft-code-review-and-technical-debt"
        if title == "Review a Code Change"
        else "software-craft-" + slug(title)
        for title in titles
    ]
    completed = [
        f"{lesson_id}-{kind}"
        for lesson_id in ids for kind in ("reading", "practice", "check")
    ]
    # Only this synthetic Playwright context is unlocked. The final learner
    # still needs to complete each independent evidence stage for real.
    staged_ids = (
        "software-craft-lab-change-safety-review",
        "software-craft-lab-configuration-observability-errors",
        "software-craft-lab-reproducible-handoff-performance",
    )
    completed.extend(
        f"{stage}-{kind}"
        for stage in staged_ids
        for kind in ("reading", "practice", "check")
    )
    completed.append("software-craft-lab-refine-steward-api-for-review-brief")
    responses = {
        activity: "SYNTHETIC browser prerequisite; not a genuine reflection."
        for activity in completed if activity.endswith("-check")
    }
    page.goto(BASE + "/?view=curriculum&school=builder", wait_until="networkidle")
    page.get_by_role("heading", name="Software Craft", exact=True).first.wait_for()
    page.evaluate("""async ({pathId, completed, responses}) => {
      const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open("tsa-academy", 5);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      try {
        const tx = db.transaction("path-progress", "readwrite");
        const now = new Date().toISOString();
        tx.objectStore("path-progress").put({
          schemaVersion: 5, pathId,
          currentActivityId: completed[0],
          completedActivityIds: completed,
          reflectionResponses: responses,
          startedAt: now, updatedAt: now
        });
        await new Promise((resolve, reject) => {
          tx.oncomplete = resolve;
          tx.onerror = () => reject(tx.error);
          tx.onabort = () => reject(tx.error);
        });
      } finally { db.close(); }
    }""", {"pathId": PATH_ID, "completed": completed, "responses": responses})
    page.reload(wait_until="networkidle")
    print(f"SEED synthetic progress: {len(completed)} activities; not learner evidence", flush=True)


def inspect_readings(page):
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    seed_disposable_progress(page)
    for number, (activity, heading) in enumerate(READINGS, 1):
        page.goto(deep_link(activity), wait_until="networkidle")
        page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
        actual = page.evaluate(
            "new URLSearchParams(location.search).get('activity')"
        )
        assert actual == activity, f"Deep-linked activity unexpectedly changed: {activity} -> {actual}"
        main = page.locator("main").last
        assert len(main.inner_text().strip()) > 1500, f"Thin rendered reading: {activity}"
        assert main.get_by_text(heading, exact=True).count() >= 1, (
            f"Missing learner-visible explanation heading: {heading}"
        )
        assert main.get_by_role("button", name="Copy").count() >= 1, (
            f"Missing learner-visible code/artefact to copy: {activity}"
        )
        page.set_viewport_size({"width": 390, "height": 844})
        assert not page.evaluate(
            "document.documentElement.scrollWidth > innerWidth + 2"
        ), f"Document overflow at 390px: {activity}"
        assert main.locator("figure pre").count() >= 1, (
            f"No code or artefact text rendered on mobile: {activity}"
        )
        if number in (1, 4, 5, 8, 9, 10):
            page.screenshot(
                path=str(ARTIFACTS / f"software-craft-{number}-390.png"),
                full_page=True,
            )
        page.set_viewport_size({"width": 1440, "height": 900})
        print(f"PASS Software Craft rendered source & 390px: {activity}", flush=True)

    page.goto(deep_link("software-craft-python-logging-from-first-principles-reading"),
              wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_function("window.scrollY > 8", timeout=8000)
    page.get_by_role("button", name=re.compile(r"^(Next|Next lesson|Complete path)$")).click()
    page.wait_for_function("window.scrollY <= 8", timeout=8000)
    assert page.evaluate(
        "new URLSearchParams(location.search).get('activity')"
    ) == "software-craft-python-logging-from-first-principles-practice", (
        "Next must navigate to the exact independent logging practical"
    )
    # Final review retains its long-standing activity IDs while its new stages
    # remain separately deep-linkable; direct links must not silently reset
    # to the beginning of the module after restore.
    final_id = "software-craft-lab-refine-steward-api-for-review-brief"
    page.goto(deep_link(final_id), wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    actual_final = page.evaluate(
        "new URLSearchParams(location.search).get('activity')"
    )
    if actual_final != final_id:
        last_progress = page.evaluate("""async (pathId) => {
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
            return {
              current: record?.currentActivityId,
              completedCount: record?.completedActivityIds?.length,
              lastStageCheck: record?.completedActivityIds?.includes(
                "software-craft-lab-reproducible-handoff-performance-check"),
              finalBriefCompleted: record?.completedActivityIds?.includes(
                "software-craft-lab-refine-steward-api-for-review-brief"),
              lastStageReflection: record?.reflectionResponses?.[
                "software-craft-lab-reproducible-handoff-performance-check"],
              lastStagePracticeCompleted: record?.completedActivityIds?.includes(
                "software-craft-lab-reproducible-handoff-performance-practice")
            };
          } finally { db.close(); }
        }""", PATH_ID)
        # Compare a new page in the SAME isolated browser context to
        # distinguish a stale mounted route from an inaccessible activity.
        fresh = page.context.new_page()
        fresh.goto(deep_link(final_id), wait_until="networkidle")
        fresh.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
        fresh_actual = fresh.evaluate(
            "new URLSearchParams(location.search).get('activity')"
        )
        fresh_headings = fresh.locator("main").last.locator("h1,h2").all_inner_texts()[:5]
        fresh.close()
        page.screenshot(
            path=str(ARTIFACTS / "software-craft-final-deep-link-failure.png"),
            full_page=True,
        )
        print("DEBUG fresh page after same-context reset:", {
            "expected": final_id,
            "actual": fresh_actual,
            "headings": fresh_headings
        }, flush=True)
        final_button = page.get_by_role(
            "button", name="From working API to reviewable engineering system", exact=True
        )
        final_button_status = (
            final_button.first.is_disabled() if final_button.count() else "MISSING"
        )
        stage3_section = page.locator("aside section").filter(
            has=page.get_by_role(
                "heading", name="Lab: Reproduce Steward Setup and Measure One Path",
                exact=True
            )
        ).first
        print("DEBUG final deep link:", {
            "expected": final_id,
            "actual": actual_final,
            "url": page.url,
            "headings": page.locator("main").last.locator("h1,h2").all_inner_texts()[:6],
            "saved": last_progress,
            "final_button_disabled": final_button_status,
            "last_stage_sidebar": stage3_section.inner_text()[:650]
                if stage3_section.count() else "MISSING"
        }, flush=True)
    assert actual_final == final_id, (
        f"Original final review activity was not restored: got {actual_final}"
    )
    main = page.locator("main").last
    assert main.get_by_text("Seven-row evidence matrix with PASS, FAIL or NOT TESTED and explicit constraints", exact=True).count() >= 1, (
        "Final learner-facing review no longer discloses seven-row evidence acceptance"
    )
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_function("window.scrollY > 8", timeout=8000)
    page.get_by_role("button", name=re.compile(r"^(Next|Next lesson|Complete path)$")).click()
    page.wait_for_function("window.scrollY <= 8", timeout=8000)
    assert page.evaluate(
        "new URLSearchParams(location.search).get('activity')"
    ) == "software-craft-lab-refine-steward-api-for-review-practice", (
        "Original final review practice ID or Next transition has changed"
    )
    # Wait for the asynchronous IndexedDB write, not merely the React route.
    # Reloading too early would race the legitimate progress persistence.
    page.wait_for_function("""async ({pathId, expected}) => {
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
        return record?.currentActivityId === expected;
      } finally { db.close(); }
    }""", arg={
        "pathId": PATH_ID,
        "expected": "software-craft-lab-refine-steward-api-for-review-practice",
    }, timeout=12000)
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    assert page.evaluate(
        "new URLSearchParams(location.search).get('activity')"
    ) == "software-craft-lab-refine-steward-api-for-review-practice", (
        "Final review navigation was not persisted across reload"
    )
    print("PASS Software Craft final evidence review: original ID, stage synthesis, scroll reset and reload", flush=True)
    assert not errors, "Browser runtime errors: " + repr(errors)
    print("PASS Software Craft advanced reading -> practice scroll reset", flush=True)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    try:
        inspect_readings(context.new_page())
    finally:
        context.close()
        browser.close()
