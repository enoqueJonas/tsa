"""Browser proof for Builder Identity final checkpoints, using disposable progress.

Checks rendered teaching blocks, mobile overflow, scroll reset and IndexedDB
re-entry. This does NOT validate independent learner competence or real security.
"""
import os
import re
from pathlib import Path
from urllib.parse import urlencode

from playwright.sync_api import sync_playwright


BASE = os.getenv("TSA_BASE_URL", "http://127.0.0.1:4173")
PATH_ID = "identity-authentication-authorization"
MODULE_TITLE = "Identity, Authentication and Authorization"
PREFIX = PATH_ID + "-"
ARTIFACTS = Path("artifacts/identity-learner")
ARTIFACTS.mkdir(parents=True, exist_ok=True)
NEXT = re.compile(r"^(Next|Next lesson|Complete path)$")
MODULE = re.compile(r"^(Start|Continue|Review) module$")


def activity_url(activity):
    return BASE + "/?" + urlencode({
        "view": "curriculum",
        "school": "builder",
        "path": PATH_ID,
        "activity": activity,
    })


def open_activity(page, activity):
    page.goto(activity_url(activity), wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    actual = page.evaluate("new URLSearchParams(location.search).get('activity')")
    assert actual == activity, f"Deep link failed: expected {activity}, got {actual}"
    main = page.locator("main").last
    main.wait_for(timeout=30000)
    return main


def assert_rendered_source(page, activity, heading, min_copies):
    main = open_activity(page, activity)
    assert len(main.inner_text()) >= 2000, f"Thin rendered Identity reading: {activity}"
    assert main.get_by_text(heading, exact=True).count() >= 1, (
        f"Missing rendered mechanism heading {heading} in {activity}"
    )
    copies = main.get_by_role("button", name="Copy").count()
    assert copies >= min_copies, (
        f"Expected {min_copies} copyable code blocks in {activity}, found {copies}"
    )
    return main


def assert_phone_no_document_overflow(page, activity):
    page.set_viewport_size({"width": 390, "height": 844})
    assert not page.evaluate(
        "document.documentElement.scrollWidth > window.innerWidth + 2"
    ), f"Document-level mobile horizontal overflow: {activity}"
    main = page.locator("main").last
    assert main.locator("figure pre").count() >= 1, (
        f"No rendered mobile code figure for {activity}"
    )
    page.screenshot(path=str(ARTIFACTS / (activity + "-390.png")), full_page=True)
    page.set_viewport_size({"width": 1440, "height": 900})


def seed_synthetic_prerequisites(page):
    """Unlock advanced lessons in a disposable profile without changing app policy.

    These fake completions are ONLY a browser fixture. They do not establish
    learner understanding or real exercise completion. Never seed real profiles.
    """
    curriculum = Path(
        "packages/runtime-kernel/src/paths/builder-identity-auth-deep.ts"
    ).read_text(encoding="utf-8")
    lesson_ids = re.findall(r'richLesson\(\s*"([^"]+)"', curriculum)
    assert len(lesson_ids) == 25 and len(set(lesson_ids)) == len(lesson_ids), (
        f"Identity lesson count/order changed: {len(lesson_ids)}"
    )
    all_previous = [
        f"{lesson_id}-{activity}"
        for lesson_id in lesson_ids
        for activity in ("reading", "practice", "check")
    ]
    capstone_reading = PREFIX + "lab-secure-steward-api-reading"
    completions = all_previous + [capstone_reading]
    reflections = {
        activity_id: "SYNTHETIC browser prerequisite, not a learner submission."
        for activity_id in completions
        if activity_id.endswith("-check")
    }
    page.goto(BASE + "/?view=curriculum&school=builder", wait_until="networkidle")
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
          pathId, schemaVersion: 5,
          currentActivityId: completed[0],
          completedActivityIds: completed,
          reflectionResponses: responses,
          startedAt: now,
          updatedAt: now,
        });
        await new Promise((resolve, reject) => {
          tx.oncomplete = resolve;
          tx.onerror = () => reject(tx.error);
          tx.onabort = () => reject(tx.error);
        });
      } finally {
        db.close();
      }
    }""", {"pathId": PATH_ID, "completed": completions, "responses": reflections})
    page.reload(wait_until="networkidle")
    print(
        f"SEEDED synthetic prerequisite unlocks for {len(completions)} activities; "
        "not learner competence",
        flush=True,
    )


def check_identity(page):
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    seed_synthetic_prerequisites(page)
    page.goto(BASE + "/?view=curriculum&school=builder", wait_until="networkidle")
    module = page.locator("article").filter(
        has=page.get_by_role("heading", name=MODULE_TITLE, exact=True)
    ).first
    assert module.count() == 1, f"Builder module card not visible: {MODULE_TITLE}"
    module.get_by_role("button", name=MODULE).click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    assert page.evaluate("new URLSearchParams(location.search).get('path')") == PATH_ID, (
        "Identity module does not preserve its canonical path ID"
    )
    assert page.evaluate("new URLSearchParams(location.search).get('activity')"), (
        "Identity module opened without an activity"
    )

    refresh_id = PREFIX + "refresh-logout-http-reading"
    assert_rendered_source(page, refresh_id,
        "Run real issuance, rotation, replay, logout and expiry", 3)
    assert_phone_no_document_overflow(page, refresh_id)
    print("PASS Identity refresh/log-out source rendered and mobile-safe", flush=True)

    schema_id = PREFIX + "secured-openapi-evidence-reading"
    assert_rendered_source(page, schema_id,
        "Register drf-spectacular on the SAME Steward project", 5)
    assert_phone_no_document_overflow(page, schema_id)
    print("PASS Identity signed OpenAPI config and code visible on desktop/mobile", flush=True)

    capstone = PREFIX + "lab-secure-steward-api-reading"
    main = assert_rendered_source(page, capstone,
        "Create a seven-row falsifiable evidence matrix", 1)
    code = "\n".join(main.locator("pre").all_inner_texts())
    assert "STAGE 1" in code and "STAGE 2" in code and "STAGE 3" in code, (
        "The rendered capstone no longer contains the ordered executable stages"
    )
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_function("window.scrollY > 8", timeout=8000)
    page.get_by_role("button", name=NEXT).click()
    page.wait_for_function("window.scrollY <= 8", timeout=8000)
    practice_id = PREFIX + "lab-secure-steward-api-practice"
    assert page.evaluate("new URLSearchParams(location.search).get('activity')") == practice_id, (
        "Capstone Next did not land on the retained independent-practice activity"
    )
    print("PASS Identity capstone staged source and Next navigation scroll reset", flush=True)

    notes = (
        "SYNTHETIC browser-only Identity evidence: a denied transfer preserved "
        "the stored owner and audit count. Not a real learner submission."
    )
    result = "Synthetic IndexedDB persistence proof, not JWT/PostgreSQL or skill proof."
    first = page.get_by_placeholder(
        "What did you build, inspect, break, diagnose, or change? Include commands, observations, and important decisions."
    )
    first.fill(notes)
    page.get_by_placeholder(
        "What was the result? What did the evidence prove, and what would you do differently next time?"
    ).fill(result)
    page.get_by_role("button", name="Save evidence").click()
    page.get_by_text("Saved locally", exact=True).wait_for(timeout=12000)
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    assert first.input_value() == notes, "Capstone practical evidence was lost on reload"

    page.get_by_role("button", name=NEXT).click()
    check_id = PREFIX + "lab-secure-steward-api-check"
    assert page.evaluate("new URLSearchParams(location.search).get('activity')") == check_id, (
        "Capstone check activity ID changed; existing learner progress would be at risk"
    )
    answer = (
        "SYNTHETIC only: identity is distinct from current authorization; "
        "token logout does not immediately cancel access; PostgreSQL and browser "
        "verification do not by themselves prove novice competency. "
    ) * 4
    reflection = page.get_by_placeholder("Write your response here...")
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
      } finally {
        db.close();
      }
    }""", arg={"pathId": PATH_ID, "activityId": check_id, "expected": answer},
                           timeout=12000)
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    assert page.get_by_placeholder("Write your response here...").input_value() == answer, (
        "Identity capstone reflection was lost on hard reload"
    )
    assert not errors, "Browser JavaScript errors while rendering Identity: " + repr(errors)
    print("PASS Identity capstone practical + reflection IndexedDB re-entry", flush=True)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    try:
        check_identity(context.new_page())
    finally:
        context.close()
        browser.close()
