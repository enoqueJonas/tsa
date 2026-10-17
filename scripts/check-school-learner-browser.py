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
            assert not re.search(r"\b(?:TODO|TBD|Lorem ipsum)\b", text, re.I), (
                f"Unfinished teaching placeholder: {activity_id}"
            )
            code = content.locator("figure").filter(has=page.get_by_role("button", name="Copy"))
            for k in range(code.count()):
                assert code.nth(k).locator("pre").count() > 0, (
                    f"Code block not rendered: {activity_id}"
                )
            reflection = page.get_by_placeholder("Write your response here...")
            if reflection.count():
                reflection.fill(SYNTHETIC_REFLECTION)
            else:
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
                "visible_characters": len(text),
                "code_blocks": code.count(),
            })
            nxt.click()
        print(f"PASS {SCHOOL} module {module_index+1}/{module_count}: {count} activities", flush=True)
    assert not errors, f"Browser exceptions in {SCHOOL}: {errors}"
    output = {"school": SCHOOL, "modules": module_count, "activities": evidence}
    path = ARTIFACTS / f"{SCHOOL}.json"
    path.write_text(json.dumps(output, indent=2), encoding="utf-8")
    print(f"PASS {SCHOOL}: traversed {len(evidence)} real rendered activities", flush=True)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    inspect_school(context.new_page())
    context.close()
    browser.close()
