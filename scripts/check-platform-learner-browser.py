"""Browser-level TSA Platform Builder activity smoke checks on a built static export.

Requires: pip install playwright; python -m playwright install chromium
Start an HTTP server serving apps/web/out, then set TSA_BASE_URL.
Screenshots are review artifacts, not claims of manual visual approval.
"""
import os
import re
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
    if width == 390:
        horizontal_overflow = page.evaluate("document.documentElement.scrollWidth > window.innerWidth + 2")
        assert not horizontal_overflow, "Learner reading creates horizontal page overflow on mobile"
    page.screenshot(path=str(OUT / f"reading-{width}.png"), full_page=True)
    # The first reading should permit movement to its follow-up practical.
    next_button = page.get_by_role("button", name="Next", exact=True)
    if next_button.count() and next_button.is_enabled():
        next_button.click()
        page.get_by_text("Engineering Practice", exact=True).first.wait_for(timeout=20000)
        assert page.get_by_text("Evidence to keep", exact=True).count() > 0
        assert page.get_by_text("Work through the problem", exact=True).count() > 0
        if width == 390:
            overflow = page.evaluate("document.documentElement.scrollWidth > window.innerWidth + 2")
            assert not overflow, "Learner practical creates horizontal page overflow on mobile"
        page.screenshot(path=str(OUT / f"practical-{width}.png"), full_page=True)



def check_all_module_entries(page):
    """Open every live Platform Builder module, not just the first module."""
    page.set_viewport_size({"width": 1440, "height": 900})
    page.goto(BASE + "/?view=curriculum&school=platform-builder", wait_until="networkidle")
    selector = page.get_by_role("button", name=re.compile(r"^(Start|Continue|Review) module$"))
    count = selector.count()
    assert count >= 10
    for index in range(count):
        page.goto(BASE + "/?view=curriculum&school=platform-builder", wait_until="networkidle")
        button = page.get_by_role("button", name=re.compile(r"^(Start|Continue|Review) module$")).nth(index)
        button.click()
        page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
        headline = page.locator("main h1").first
        headline.wait_for(timeout=30000)
        assert headline.inner_text().strip(), f"Empty learner heading for module {index + 1}"
        assert page.locator("main").count() > 0
        page.screenshot(path=str(OUT / f"module-{index + 1:02d}.png"), full_page=True)
    print(f"PASS opened and screenshotted all {count} Platform Builder modules")

def check_all_activity_pages(page):
    """Inspect each activity entry in the Platform module sidebar.

    This checks navigation structure and lock state without visiting locked
    activities, altering learner progress, or claiming full visual approval.
    """
    page.set_viewport_size({"width": 1440, "height": 900})
    page.goto(BASE + "/?view=curriculum&school=platform-builder", wait_until="networkidle")
    count = page.get_by_role("button", name=re.compile(r"^(Start|Continue|Review) module$")).count()
    visited = 0
    for module_index in range(count):
        page.goto(BASE + "/?view=curriculum&school=platform-builder", wait_until="networkidle")
        page.get_by_role("button", name=re.compile(r"^(Start|Continue|Review) module$")).nth(module_index).click()
        page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
        # The sidebar lists all activities, including locked future activities.
        sidebar = page.locator("aside").filter(has=page.get_by_text("Curriculum", exact=True)).first
        activity_buttons = sidebar.locator("button")
        assert activity_buttons.count() >= 1, f"Missing activity navigation in module {module_index + 1}"
        assert activity_buttons.first.is_enabled(), "Current activity must be navigable"
        assert page.locator("main h1").first.inner_text().strip()
        visited += activity_buttons.count()
    print(f"PASS inspected {visited} Platform sidebar activity entries across {count} modules")



def check_complete_first_module(page):
    """Traverse every activity in the first module in a disposable browser profile.

    Generated reflection text is a navigation fixture, not learner evidence.
    """
    page.goto(BASE + "/?view=curriculum&school=platform-builder", wait_until="networkidle")
    page.get_by_role("button", name="Start module").first.click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
    sidebar = page.locator("aside").filter(has=page.get_by_text("Curriculum", exact=True)).first
    total = sidebar.locator("button").count()
    assert total >= 3, f"Unexpected first module activity count: {total}"
    visited = set()
    for index in range(total):
        activity_id = page.evaluate("new URLSearchParams(window.location.search).get('activity')")
        assert activity_id, f"Missing activity URL at step {index}"
        assert activity_id not in visited, f"Navigation stuck at {activity_id}"
        visited.add(activity_id)
        # Reflection activities have a prompt and textarea, but no h1.
        assert page.locator("main").last.is_visible()
        if page.locator("main h1").count():
            assert page.locator("main h1").first.inner_text().strip()
        else:
            assert page.get_by_placeholder("Write your response here...").is_visible()
        if page.get_by_placeholder("Write your response here...").count():
            page.get_by_placeholder("Write your response here...").fill(
                "This synthetic browser fixture records a controlled observation and "
                "differentiates cause, symptom, evidence and recovery. "
                "It is not an actual learner submission or infrastructure proof."
            )
        next_button = page.get_by_role(
            "button", name=re.compile(r"^(Next|Next lesson|Complete path)$")
        )
        assert next_button.count() == 1, f"Missing progression control at {activity_id}"
        assert next_button.is_enabled(), f"Activity completion blocked at {activity_id}"
        next_button.click()
    assert len(visited) == total
    print(f"PASS traversed all {total} first-module learner activities in isolated browser")


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
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()
    check_all_module_entries(page)
    check_all_activity_pages(page)
    check_complete_first_module(page)
    context.close()
    browser.close()
