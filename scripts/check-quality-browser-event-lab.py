"""Exercise real browser events against TSA's isolated static teaching fixtures.

This proves fixture behavior and event-wait mechanics, NOT the Steward product,
Java Playwright execution, independent learner competence or external systems.
"""
import os
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
    assert not page.evaluate("document.documentElement.scrollWidth > innerWidth + 2")

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

    assert not errors, f"Browser fixture JS exceptions: {errors}"
    context.close()
    browser.close()
print("PASS isolated Quality browser event fixture: real Chromium at 390px", flush=True)
