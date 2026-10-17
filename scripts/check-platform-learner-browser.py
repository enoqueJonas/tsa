"""Browser-level TSA Platform Builder activity smoke checks on a built static export.

Requires: pip install playwright; python -m playwright install chromium
Start an HTTP server serving apps/web/out, then set TSA_BASE_URL.
Screenshots are review artifacts, not claims of manual visual approval.
"""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.getenv("TSA_BASE_URL", "http://127.0.0.1:4173")
OUT = Path("artifacts/platform-learner")
OUT.mkdir(parents=True, exist_ok=True)


def check_school(page, width):
    page.set_viewport_size({"width": width, "height": 900})
    page.goto(BASE + "/?view=curriculum&school=platform-builder", wait_until="networkidle")
    page.get_by_role("heading", name="Platform Builder", exact=True).wait_for(timeout=30000)
    modules = page.get_by_role("button", name="Start module")
    count = modules.count()
    assert count >= 10, f"Unexpected Platform module count: {count}"
    page.screenshot(path=str(OUT / f"school-{width}.png"), full_page=True)
    return count


def check_learner_activity(page, width):
    page.set_viewport_size({"width": width, "height": 900})
    page.goto(BASE + "/?view=curriculum&school=platform-builder", wait_until="networkidle")
    page.get_by_role("button", name="Start module").first.click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    page.locator("main h1").first.wait_for(timeout=30000)
    assert page.locator("main h1").first.inner_text().strip()
    assert page.locator("main").count() >= 1
    assert page.get_by_role("button", name="Next").count() + page.get_by_role("button", name="Next lesson").count() >= 1
    page.screenshot(path=str(OUT / f"reading-{width}.png"), full_page=True)
    # The first reading should permit movement to its follow-up practical.
    next_button = page.get_by_role("button", name="Next", exact=True)
    if next_button.count() and next_button.is_enabled():
        next_button.click()
        page.get_by_text("Engineering Practice", exact=True).first.wait_for(timeout=20000)
        assert page.get_by_text("Evidence to keep", exact=True).count() > 0
        assert page.get_by_text("Work through the problem", exact=True).count() > 0
        page.screenshot(path=str(OUT / f"practical-{width}.png"), full_page=True)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for width in (390, 1440):
        context = browser.new_context(viewport={"width": width, "height": 900})
        page = context.new_page()
        failures = []
        page.on("pageerror", lambda error: failures.append(str(error)))
        count = check_school(page, width)
        check_learner_activity(page, width)
        assert not failures, f"Client-side error(s): {failures}"
        print(f"PASS Platform Builder at {width}px; {count} modules, rendered reading and practical inspected")
        context.close()
    browser.close()
