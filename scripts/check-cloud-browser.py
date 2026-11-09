"""Browser-only evidence for Cloud Engineer modules 1–3 first ORIGINAL topic.
The learner must solve the actual knowledge check to reach later topics. We do
not invent responses, bypass the gate or claim learner mastery/live VPS.
"""
import os
import re
from urllib.parse import parse_qs, urlparse
from playwright.sync_api import sync_playwright

BASE=os.getenv("TSA_BASE_URL","http://127.0.0.1:4173")
school="cloud-engineer"
NEXT=re.compile(r"^(Next|Next lesson|Complete path)$")
MODULE=re.compile(r"^(Start|Continue|Review) module$")
modules=[
    {
        "index":0,
        "path":"cloud-and-hosting-models",
        "reading":"cloud-and-hosting-models-on-prem-colocation-vps-cloud-001",
        "practice":"cloud-and-hosting-models-on-prem-colocation-vps-cloud-002",
        "reflection":"cloud-and-hosting-models-on-prem-colocation-vps-cloud-003",
        "heading":"Begin with the isolation and ownership boundary, not a product label",
    },
    {
        "index":1,
        "path":"vps-operations",
        "reading":"vps-operations-choosing-budget-vps-001",
        "practice":"vps-operations-choosing-budget-vps-002",
        "reflection":"vps-operations-choosing-budget-vps-003",
        "heading":"Convert demand into an explicit capacity hypothesis",
    },
    {
        "index":2,
        "path":"internet-networking",
        "reading":"internet-networking-public-private-addressing-001",
        # Preserve the pre-existing runtime progress ID, but FIX its old
        # ordering: practical belongs BEFORE the 180-char reflection.
        "practice":"internet-networking-public-private-addressing-practice",
        "reflection":"internet-networking-public-private-addressing-003",
        "heading":"Follow one packet from public destination to a listening socket",
    }
]

def activity(page):
    return parse_qs(urlparse(page.url).query).get("activity",[None])[0]

with sync_playwright() as playwright:
    browser=playwright.chromium.launch(headless=True,channel="chrome")
    for target in modules:
        context=browser.new_context(viewport={"width":1440,"height":900})
        page=context.new_page()
        errors=[]
        page.on("pageerror",lambda err:errors.append(str(err)))
        page.goto(BASE+"/?view=curriculum&school="+school,wait_until="networkidle")
        module_buttons=page.get_by_role("button",name=MODULE)
        # Progress is local to this fresh browser context, so expected start.
        module_buttons.first.wait_for(state="visible",timeout=30000)
        assert module_buttons.count()==11,"Cloud Engineer lost one of 11 canonical modules"
        module_buttons.nth(target["index"]).click()
        page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
        assert target["path"] in page.url, "Wrong module: "+page.url
        assert activity(page)==target["reading"], "First original lesson unavailable: "+page.url
        main=page.locator("main").last
        body=main.inner_text()
        assert target["heading"] in body, (
            "Deepened original mechanism not rendered: "+target["reading"])
        assert len(body)>2400, "Original first reading lacks depth: "+target["reading"]
        page.set_viewport_size({"width":390,"height":844})
        assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"), (
            "Reading mobile overflow: "+target["reading"])
        page.set_viewport_size({"width":1440,"height":900})
        print("PASS Cloud original first reading and 390px:",target["reading"],flush=True)
        page.get_by_role("button",name=NEXT).click()
        page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
        assert activity(page)==target["practice"], (
            "Learner practical not placed before reflection: "+target["practice"]+" "+page.url)
        body=page.locator("main").last.inner_text()
        assert "evidence" in body.lower() and len(body)>700, (
            "Practical not evidence-driven: "+target["practice"])
        page.set_viewport_size({"width":390,"height":844})
        assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"), (
            "Practical mobile overflow: "+target["practice"])
        page.set_viewport_size({"width":1440,"height":900})
        print("PASS Cloud original applied practice before reflection:",target["practice"],flush=True)
        page.get_by_role("button",name=NEXT).click()
        page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
        assert activity(page)==target["reflection"], (
            "First original reflection no longer follows practice")
        gate=page.get_by_role("button",name=NEXT)
        assert not gate.is_enabled(), "Knowledge check incorrectly permits blank learner answer"
        page.reload(wait_until="networkidle")
        page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
        assert activity(page)==target["reflection"],"Learner progress/reload was lost"
        assert not page.get_by_role("button",name=NEXT).is_enabled(), (
            "Reload bypasses genuine learner knowledge check")
        assert not errors,"Browser runtime exception "+str(errors)
        print("PASS Cloud 180-character reflection requires real response, no bypass, reload:",
              target["path"],flush=True)
        context.close()
    browser.close()
print("PASS first original Cloud hosting/VPS/networking reading→practice→reflection, mobile and reload; all later topics remain source-only reviewed")
