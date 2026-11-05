"""Isolated Chromium checks for the rebuilt Software Craft learner surface.

Synthetic completed activities only unlock late lessons in a disposable browser.
This does NOT prove independent learner competence or real deployed security.
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


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def seed_progress(page):
    source = SOURCE.read_text(encoding="utf-8")
    titles = re.findall(r'\n\s+lesson\(\s*\n\s*"([^"]+)"', source)
    assert len(titles) == 25 and len(set(titles)) == 25, (
        f"Software Craft module lesson sequence changed: {len(titles)}")
    # The review lesson has a legacy, intentionally preserved stable ID.
    # Title-based slugs are not authoritative when a lesson supplies stableId.
    stable = {"Review a Code Change": "software-craft-code-review-and-technical-debt"}
    ids = [
        f"{stable.get(title, 'software-craft-' + slug(title))}-{kind}"
        for title in titles for kind in ("reading", "practice", "check")
    ]
    responses = {id: "SYNTHETIC browser unlock only, not learner evidence."
                 for id in ids if id.endswith("-check")}
    page.goto(BASE + "/?view=curriculum&school=builder", wait_until="networkidle")
    page.evaluate("""async ({pathId, completed, responses}) => {
      const db = await new Promise((resolve, reject) => {
        const req = indexedDB.open("tsa-academy", 5);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      try {
        const tx = db.transaction("path-progress", "readwrite");
        const now = new Date().toISOString();
        tx.objectStore("path-progress").put({
          schemaVersion: 5, pathId, completedActivityIds: completed,
          reflectionResponses: responses, currentActivityId: completed[0],
          startedAt: now, updatedAt: now,
        });
        await new Promise((resolve, reject) => {
          tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
          tx.onabort = () => reject(tx.error);
        });
      } finally { db.close(); }
    }""", {"pathId": PATH_ID, "completed": ids, "responses": responses})
    page.reload(wait_until="networkidle")


def open_activity(page, lesson_title, kind="reading"):
    activity = f"software-craft-{slug(lesson_title)}-{kind}"
    url = BASE + "/?" + urlencode({
        "view": "curriculum", "school": "builder",
        "path": PATH_ID, "activity": activity,
    })
    page.goto(url, wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    actual = page.evaluate("new URLSearchParams(location.search).get('activity')")
    assert actual == activity, f"Unlocked Software Craft deep link failed: {actual} != {activity}"
    main = page.locator("main").last
    main.wait_for()
    return main, activity


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    try:
        seed_progress(page)
        readings = [
            ("Configuration Precedence and Startup Gates",
             "Fail before side effects and prove negative paths", 2),
            ("Logging Failure Paths and Correlation",
             "Capture the success and denial paths with positive and negative oracles", 2),
            ("HTTP Error Contracts and Client Oracles",
             "Make every denial independently observable", 2),
            ("Managing Dependencies",
             "Execute an offline inventory and catch a hidden transitive import", 1),
            ("Technical Documentation",
             "A concrete ADR and a safe operational runbook are not interchangeable", 1),
        ]
        for title, heading, required_copies in readings:
            main, activity = open_activity(page, title)
            assert len(main.inner_text().strip()) >= 2200, (
                f"Rendered Software Craft lesson too thin: {activity}")
            assert main.get_by_text(heading, exact=True).count() >= 1, (
                f"Mechanism missing in learner-facing page: {heading}")
            assert main.get_by_role("button", name="Copy").count() >= required_copies, (
                f"Executable/documented source not copyable: {activity}")
            page.set_viewport_size({"width": 390, "height": 844})
            assert not page.evaluate(
                "document.documentElement.scrollWidth > innerWidth + 2"
            ), f"Software Craft mobile document overflow: {activity}"
            page.screenshot(path=str(ARTIFACTS / (slug(title) + "-390.png")),
                            full_page=True)
            page.set_viewport_size({"width": 1440, "height": 900})
            print("PASS Software Craft rendered desktop/mobile:", title, flush=True)

        capstone, capstone_id = open_activity(
            page, "Lab: Refine Steward API for Review", "brief")
        assert len(capstone.inner_text().strip()) >= 3500, (
            "Software Craft integration rubric is not fully rendered")
        assert capstone.get_by_text(
            "Build an eight-row evidence matrix, not a green checklist",
            exact=True).count() == 1
        assert capstone.get_by_text(
            "Independent review rubric and pass threshold",
            exact=True).count() == 1
        assert capstone.get_by_role("button", name="Copy").count() >= 1
        page.set_viewport_size({"width": 390, "height": 844})
        assert not page.evaluate(
            "document.documentElement.scrollWidth > innerWidth + 2"
        ), "Software Craft capstone 390px horizontal overflow"
        page.screenshot(path=str(ARTIFACTS / "capstone-390.png"),
                        full_page=True)
        page.set_viewport_size({"width": 1440, "height": 900})
        print("PASS Software Craft capstone evidence/rubric rendered on mobile",
              flush=True)

        main, _ = open_activity(page, "HTTP Error Contracts and Client Oracles")
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_function("window.scrollY > 8")
        page.get_by_role("button", name=re.compile(r"^(Next|Next lesson)$")).click()
        page.wait_for_function("window.scrollY <= 8")
        expected_practice = "software-craft-http-error-contracts-and-client-oracles-practice"
        assert page.evaluate(
            "new URLSearchParams(location.search).get('activity')"
        ) == expected_practice, "Next did not open the new practical"

        note = "SYNTHETIC interface proof, not a real JWT or HTTP implementation."
        result = "The UI saved a scratch note in IndexedDB after deliberate navigation."
        first = page.get_by_placeholder(
            "What did you build, inspect, break, diagnose, or change? Include commands, observations, and important decisions.")
        first.fill(note)
        page.get_by_placeholder(
            "What was the result? What did the evidence prove, and what would you do differently next time?").fill(result)
        page.get_by_role("button", name="Save evidence").click()
        page.get_by_text("Saved locally", exact=True).wait_for(timeout=12000)
        page.reload(wait_until="networkidle")
        page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
        assert first.input_value() == note, "Practical evidence lost after reload"

        page.get_by_role("button", name=re.compile(r"^(Next|Next lesson)$")).click()
        check_id = "software-craft-http-error-contracts-and-client-oracles-check"
        assert page.evaluate(
            "new URLSearchParams(location.search).get('activity')"
        ) == check_id
        reflection = page.get_by_placeholder("Write your response here...")
        answer = "SYNTHETIC check: HTTP contract, negative mutation and persistence only. " * 5
        reflection.fill(answer)
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
          } finally { db.close(); }
        }""", arg={"pathId": PATH_ID, "activityId": check_id, "expected": answer},
                               timeout=12000)
        page.reload(wait_until="networkidle")
        page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
        assert reflection.input_value() == answer, "Reflection lost after hard reload"
        assert not errors, "Browser errors: " + repr(errors)
        print("PASS Software Craft scroll, practical and reflection IndexedDB reentry",
              flush=True)
    finally:
        context.close()
        browser.close()
