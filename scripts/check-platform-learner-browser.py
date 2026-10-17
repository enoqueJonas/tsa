"""Browser-level TSA Platform Builder activity smoke checks on a built static export.

Requires: pip install playwright; python -m playwright install chromium
Start an HTTP server serving apps/web/out, then set TSA_BASE_URL.
Screenshots are review artifacts, not claims of manual visual approval.
"""
import os
import re
import json
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



def check_complete_modules(page):
    """Traverse all Platform Builder activities with synthetic browser-only progress.

    Progress is isolated to the CI browser profile and must never be presented
    as real infrastructure execution or learner competence.
    """
    page.goto(BASE + "/?view=curriculum&school=platform-builder", wait_until="networkidle")
    module_button = re.compile(r"^(Start|Continue|Review) module$")
    modules = page.get_by_role("button", name=module_button).count()
    visited_total = 0
    evidence = []
    client_errors = []
    page.on("pageerror", lambda error: client_errors.append(str(error)))
    assert modules >= 10
    for module_index in range(modules):
        page.goto(BASE + "/?view=curriculum&school=platform-builder", wait_until="networkidle")
        page.get_by_role("button", name=module_button).nth(module_index).click()
        page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
        sidebar = page.locator("aside").filter(has=page.get_by_text("Curriculum", exact=True)).first
        total = sidebar.locator("button").count()
        assert total >= 1, f"No activities in Platform module {module_index + 1}"
        visited = set()
        for index in range(total):
            activity_id = page.evaluate("new URLSearchParams(window.location.search).get('activity')")
            assert activity_id, f"Missing URL activity in module {module_index + 1}"
            assert activity_id not in visited, f"Navigation stuck at {activity_id}"
            visited.add(activity_id)
            assert page.locator("main").last.is_visible()
            if page.locator("main h1").count():
                assert page.locator("main h1").first.inner_text().strip()
            else:
                assert page.get_by_placeholder("Write your response here...").is_visible()
            # Confirm the rendered activity has meaningful type-specific content.
            activity_type = "reading"
            if page.get_by_placeholder("Write your response here...").count():
                activity_type = "reflection"
                assert page.locator("main").last.get_by_text("Your reflection", exact=True).count() >= 1
            elif page.get_by_text("Engineering Practice", exact=True).count():
                activity_type = "practical"
                assert page.get_by_text("Work through the problem", exact=True).count() >= 1
                assert page.get_by_text("Evidence to keep", exact=True).count() >= 1
            else:
                assert page.locator("main").last.locator("p").count() >= 1, (
                    f"Reading has no visible explanatory paragraphs: {activity_id}"
                )
            # Inspect code block presentation whenever this reading contains code.
            code_blocks = page.locator("main figure").filter(has=page.get_by_role("button", name="Copy"))
            for code_index in range(code_blocks.count()):
                block = code_blocks.nth(code_index)
                assert block.locator("pre").count() >= 1, (
                    f"Code block lacks a displayed preformatted source at {activity_id}"
                )
                copy = block.get_by_role("button", name="Copy")
                assert copy.is_visible(), f"Code block has no visible copy control at {activity_id}"
            # Catch unreadable, empty, or placeholder-only learner text.
            learner_text = page.locator("main").last.inner_text().strip()
            assert len(learner_text) >= 90, f"Insufficient learner content at {activity_id}"
            assert not re.search(r"\b(?:TODO|TBD|Lorem ipsum)\b", learner_text, re.IGNORECASE), (
                f"Unfinished editorial placeholder at {activity_id}"
            )
            evidence.append({"module": module_index + 1, "activity_id": activity_id, "activity_type": activity_type, "code_blocks": code_blocks.count(), "visible_characters": len(learner_text)})
            if activity_id == "computer-and-os-foundations-cpu-memory-storage-and-i-o-reading":
                assert page.get_by_text("Illustrative excerpts (not captured from your host):").count() >= 1, (
                    "CPU example output missing from the learner rendering"
                )
                sample = page.locator("main figure").first.locator("pre").last.inner_text()
                assert "\n$ nproc\n4\n" in sample, (
                    "Worked CPU output is not rendered as multiple readable lines"
                )
            if activity_id == "computer-and-os-foundations-filesystems-reading":
                assert page.get_by_text("Illustrative excerpts (not your host):").count() >= 1, (
                    "Filesystem example output missing from learner rendering"
                )
            # Exercise the user-facing copy control in Chromium, not only its appearance.
            if code_blocks.count() and index == 0:
                page.context.grant_permissions(["clipboard-read", "clipboard-write"])
                first = code_blocks.first
                source = first.locator("pre").first.inner_text().strip()
                assert source, f"Empty displayed code source at {activity_id}"
                first.get_by_role("button", name="Copy").click()
                clipboard_text = page.evaluate("navigator.clipboard.readText()")
                assert clipboard_text.strip(), f"Copy produced empty clipboard at {activity_id}"
                # Syntax highlighting renders line-number elements alongside code.
                # Independently assert the known first worked example rather than
                # treating pre/code textContent (including gutters) as raw source.
                if module_index == 0:
                    assert clipboard_text.startswith("nproc\nlscpu\nuptime\n"), (
                        f"Unexpected CPU inventory example copied at {activity_id}"
                    )
            reflection = page.get_by_placeholder("Write your response here...")
            if reflection.count():
                reflection.fill(
                    "Synthetic CI browser traversal only: this response is not engineering evidence. "
                    "Actual infrastructure testing must establish baseline conditions, observed symptoms, "
                    "root cause, recovery actions and independent end-to-end verification. "
                    "The selected system and evidence must be examined in a controlled live lab. "
                    "No production, customer or external infrastructure changes were carried out."
                )
            next_button = page.get_by_role(
                "button", name=re.compile(r"^(Next|Next lesson|Complete path)$")
            )
            assert next_button.count() == 1, f"No progression button at {activity_id}"
            assert next_button.is_enabled(), f"Progression blocked at {activity_id}"
            next_button.click()
        visited_total += len(visited)
        print(f"PASS module {module_index + 1}/{modules}: traversed {len(visited)} activities", flush=True)
    assert not client_errors, f"Browser exceptions during full traversal: {client_errors}"
    assert visited_total == 328, f"Platform Builder activity count changed: {visited_total}; update audit census deliberately"
    (OUT / "activity-coverage.json").write_text(
        json.dumps({"modules": modules, "activities": evidence}, indent=2), encoding="utf-8"
    )
    print(f"PASS full synthetic learner progression: {visited_total} activities across {modules} modules")



def check_cross_school_first_reading(page):
    """Open the first available learning module in each school, not just Platform Builder."""
    schools = (
        "system-thinker", "platform-builder", "delivery-engineer", "cloud-engineer",
        "quality-steward", "security-steward", "reliability-engineer",
        "architect", "technical-steward", "professional-engineer",
    )
    for slug in schools:
        page.goto(BASE + "/?view=curriculum&school=" + slug, wait_until="networkidle")
        launch = page.get_by_role("button", name=re.compile(r"^(Start|Continue|Review) module$"))
        assert launch.count() > 0, f"No accessible module entry for school {slug}"
        launch.first.click()
        page.get_by_text("Loading your progress…").wait_for(state="hidden", timeout=30000)
        heading = page.locator("main h1").first
        heading.wait_for(timeout=30000)
        assert heading.inner_text().strip(), f"Empty first reading title for school {slug}"
        assert page.locator("main").last.inner_text().strip(), f"Empty first reading content for school {slug}"
        print(f"PASS school entry and first reading: {slug}", flush=True)



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
    check_cross_school_first_reading(page)
    check_all_module_entries(page)
    check_all_activity_pages(page)
    check_complete_modules(page)
    context.close()
    browser.close()
