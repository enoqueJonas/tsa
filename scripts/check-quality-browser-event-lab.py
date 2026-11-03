"""Exercise real browser events against TSA's isolated static teaching fixtures.

This proves fixture behavior and event-wait mechanics, NOT the Steward product,
Java Playwright execution, independent learner competence or external systems.
"""
import os
import json
from pathlib import Path
from tempfile import TemporaryDirectory

from playwright.sync_api import sync_playwright, expect

BASE = os.getenv("TSA_BASE_URL", "http://127.0.0.1:4173")
ROOT = Path("apps/web/out/labs")
assert (ROOT / "quality-upload-good.txt").read_text(encoding="utf-8") == "HELLO-QUALITY-42\n"

with TemporaryDirectory(prefix="tsa-quality-events-") as tmp, sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 390, "height": 844}, accept_downloads=True)
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(BASE + "/labs/quality-browser-events.html", wait_until="load")
    expect(page.get_by_role("heading", name="Browser Events — Local Quality Lab")).to_be_visible()
    if page.evaluate("document.documentElement.scrollWidth > innerWidth + 2"):
        offenders = page.evaluate("""() => ({
          viewport: innerWidth,
          document: document.documentElement.scrollWidth,
          elements: [...document.querySelectorAll('body *')].filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.right > innerWidth + 2;
          }).map(el => {
            const box = el.getBoundingClientRect();
            return {
              tag: el.tagName.toLowerCase(), id: el.id,
              className: String(el.className).slice(0, 120),
              right: Math.round(box.right), width: Math.round(box.width),
              scrollWidth: el.scrollWidth,
              text: (el.innerText || '').slice(0, 100),
            };
          }).slice(-16)
        })""")
        print(f"QUALITY EVENT SANDBOX MOBILE OVERFLOW: {offenders}", flush=True)
        page.screenshot(path="artifacts/cross-school-learner/quality-event-overflow.png", full_page=True)
        raise AssertionError(f"Isolated Quality event lab has horizontal overflow: {offenders}")

    # Four meaningful viewport classes and keyboard execution, not screenshots only.
    # Reuse the SAME controlled lab fixture, never imply a Steward UI is present.
    for width in (320, 390, 768, 1280):
        page.set_viewport_size({"width": width, "height": 844})
        page.goto(BASE + "/labs/quality-browser-events.html", wait_until="load")
        expect(page.get_by_role("heading", name="Browser Events — Local Quality Lab")).to_be_visible()
        right_edge = page.evaluate("document.documentElement.scrollWidth")
        assert right_edge <= width + 2, f"Responsive lab overflow at {width}px: scrollWidth={right_edge}"
        control = page.get_by_role("button", name="Read sample state")
        control.focus()
        expect(control).to_be_focused()
        page.keyboard.press("Enter")
        expect(page.locator("#state-result")).to_have_text("origin=absent; tab=absent")
        print(f"PASS responsive fixture: {width}px no document overflow and keyboard action works", flush=True)
    page.set_viewport_size({"width": 390, "height": 844})
    page.reload(wait_until="load")

    # A page reload retains this tab's sessionStorage and its origin's localStorage.
    # This is NOT an authentication test; values are harmless fixture strings.
    page.get_by_role("button", name="Save isolated sample state").click()
    expect(page.locator("#state-result")).to_have_text("origin=sample-42; tab=tab-42")
    page.reload(wait_until="load")
    page.get_by_role("button", name="Read sample state").click()
    expect(page.locator("#state-result")).to_have_text("origin=sample-42; tab=tab-42")

    # Two Pages in the SAME BrowserContext share origin localStorage, but
    # independently created tabs have different sessionStorage.
    sibling = context.new_page()
    sibling.goto(BASE + "/labs/quality-browser-events.html", wait_until="load")
    sibling.get_by_role("button", name="Read sample state").click()
    expect(sibling.locator("#state-result")).to_have_text("origin=sample-42; tab=absent")
    sibling.close()

    # A new BrowserContext is a separate storage partition, despite the same URL.
    isolated_context = browser.new_context(viewport={"width": 390, "height": 844})
    isolated_page = isolated_context.new_page()
    isolated_page.goto(BASE + "/labs/quality-browser-events.html", wait_until="load")
    isolated_page.get_by_role("button", name="Read sample state").click()
    expect(isolated_page.locator("#state-result")).to_have_text("origin=absent; tab=absent")
    isolated_context.close()

    page.get_by_role("button", name="Clear sample state").click()
    expect(page.locator("#state-result")).to_have_text("origin=absent; tab=absent")
    print("PASS browser state: reload persistence, same-context origin sharing, tab session isolation, separate context, cleanup", flush=True)

    # File input is not server persistence: this checks local fixture handling only.
    page.get_by_label("Choose sample text file").set_input_files(str(ROOT / "quality-upload-good.txt"))
    expect(page.locator("#upload-result")).to_have_text("Fixture accepted: record 42")
    bad = Path(tmp) / "wrong.txt"
    bad.write_text("WRONG\n", encoding="utf-8")
    page.get_by_label("Choose sample text file").set_input_files(str(bad))
    expect(page.locator("#upload-result")).to_have_text("Fixture rejected: unexpected content or file type")
    print("PASS browser events: controlled upload and rejected content", flush=True)

    # Register download event before click, then verify actual saved bytes.
    with page.expect_download() as incoming:
        page.get_by_role("link", name="Download sample report").click()
    download = incoming.value
    assert download.suggested_filename == "quality-record-42.csv"
    saved = Path(tmp) / download.suggested_filename
    download.save_as(saved)
    assert saved.read_text(encoding="utf-8") == "record_id,owner\n42,team7\n"
    print("PASS browser events: event-safe download and verified CSV content", flush=True)

    # Popup event and its separate Page must be inspected explicitly.
    with page.expect_popup() as popup_event:
        page.get_by_role("button", name="Open sample detail popup").click()
    popup = popup_event.value
    expect(popup.get_by_role("heading", name="Sample record 42")).to_be_visible()
    expect(popup.get_by_text("team7", exact=True)).to_be_visible()
    popup.close()
    print("PASS browser events: new Page identity and cleanup", flush=True)

    # Separate frame DOM, not a parent-page locator.
    frame = page.frame_locator("iframe[data-purpose='sample-frame']")
    frame.get_by_label("Reference").fill("CASE-42")
    frame.get_by_role("button", name="Save frame reference").click()
    expect(frame.locator("#frame-result")).to_have_text("Frame reference saved: CASE-42")
    print("PASS browser events: frame-specific input and outcome", flush=True)

    # Explicitly dismiss then accept, observing different postconditions.
    page.once("dialog", lambda dialog: dialog.dismiss())
    page.get_by_role("button", name="Remove sample record").click()
    expect(page.locator("#dialog-result")).to_have_text("Sample record preserved")
    page.once("dialog", lambda dialog: dialog.accept())
    page.get_by_role("button", name="Remove sample record").click()
    expect(page.locator("#dialog-result")).to_have_text("Sample record removed")
    page.get_by_role("button", name="Reset sample record").click()
    expect(page.locator("#dialog-result")).to_have_text("Sample record intact")
    print("PASS browser events: dialog dismissal/acceptance and state restoration", flush=True)

    # Seed a deliberately broken response behind a teaching-only query switch.
    # Keep the normal fixture green; verify the *real bytes* of a reproducible defect.
    defect_page = context.new_page()
    defect_page.goto(BASE + "/labs/quality-browser-events.html?teach-defect=owner-mismatch", wait_until="load")
    with defect_page.expect_download() as mismatch_event:
        defect_page.get_by_role("link", name="Download sample report").click()
    wrong_download = mismatch_event.value
    assert wrong_download.suggested_filename == "quality-record-42.csv"
    bad_report = Path(tmp) / "wrong-owner.csv"
    wrong_download.save_as(bad_report)
    actual = bad_report.read_text(encoding="utf-8")
    expected = "record_id,owner\\n42,team7\\n"
    assert actual == "record_id,owner\\n42,team9\\n"
    assert actual != expected, "The teaching defect should not falsely pass the correct-owner oracle"
    evidence_dir = Path("artifacts/cross-school-learner")
    evidence_dir.mkdir(parents=True, exist_ok=True)
    (evidence_dir / "quality-defect-evidence.json").write_text(json.dumps({
        "fixture": "local Quality browser lab (NOT Steward)",
        "reproduction_url_path": "/labs/quality-browser-events.html?teach-defect=owner-mismatch",
        "action": "Download sample report",
        "expected_csv": expected,
        "observed_csv": actual,
        "impact": "Downloaded record 42 attributes ownership to the wrong team",
        "root_cause": "unverified hypothesis - not included",
    }, indent=2) + "\\n", encoding="utf-8")
    (evidence_dir / "quality-defect-observed.csv").write_text(actual, encoding="utf-8")
    defect_page.screenshot(path=str(evidence_dir / "quality-defect-page.png"), full_page=True)
    defect_page.close()
    print("PASS controlled defect reproduction: exact mismatching CSV bytes plus redacted evidence artifact", flush=True)

    assert not errors, f"Browser fixture JS exceptions: {errors}"
    context.close()
    browser.close()
print("PASS isolated Quality browser event fixture: real Chromium at 390px", flush=True)
