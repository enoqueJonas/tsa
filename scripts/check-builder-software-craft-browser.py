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
        if number in (1, 4, 5):
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
