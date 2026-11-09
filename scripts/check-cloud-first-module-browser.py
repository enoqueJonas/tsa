"""Cloud Engineer first original reading/practical per module, not learner competence."""
import os
import re
from urllib.parse import parse_qs, urlparse
from playwright.sync_api import sync_playwright

BASE=os.getenv("TSA_BASE_URL","http://127.0.0.1:4173")
MODULE=re.compile(r"^(Start|Continue|Review) module$")
NEXT=re.compile(r"^(Next|Next lesson|Complete path)$")
targets=[
    (0, "cloud-and-hosting-models", "cloud-and-hosting-models-on-prem-colocation-vps-cloud",
     "Four boundaries: capital ownership, virtualization, platform and application"),
    (1, "vps-operations", "vps-operations-choosing-budget-vps",
     "Calculate capacity from processes before selecting a provider"),
    (2, "internet-networking", "internet-networking-public-private-addressing",
     "Apply address scope to each actual Steward listener"),
]

with sync_playwright() as play:
    browser=play.chromium.launch(headless=True,channel="chrome")
    page=browser.new_page(viewport={"width":1440,"height":900})
    errors=[]
    page.on("pageerror", lambda error: errors.append(str(error)))
    for module_index,path,topic,heading in targets:
        page.goto(BASE+"/?view=curriculum&school=cloud-engineer",wait_until="networkidle")
        buttons=page.get_by_role("button",name=MODULE)
        buttons.first.wait_for(state="visible",timeout=30000)
        assert buttons.count()==11,"Cloud Engineer must preserve eleven canonical modules"
        buttons.nth(module_index).click()
        page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
        activity=parse_qs(urlparse(page.url).query).get("activity",[None])[0]
        assert activity==topic+"-001",f"Unexpected first original reading in {path}: {activity}"
        main=page.locator("main").last
        content=main.inner_text()
        assert heading in content,f"Missing source-remediated Cloud mechanism in {topic}"
        assert len(content)>2200,f"Original Cloud reading still superficial: {topic}, {len(content)}"
        page.set_viewport_size({"width":390,"height":844})
        assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"), (
            "Cloud original reading overflows mobile width: "+topic)
        page.set_viewport_size({"width":1440,"height":900})
        print("PASS Cloud original reading source + 390px:",activity,flush=True)

        nxt=page.get_by_role("button",name=NEXT)
        assert nxt.is_enabled(),"Reading should allow original practical navigation"
        nxt.click()
        page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
        practical=parse_qs(urlparse(page.url).query).get("activity",[None])[0]
        assert practical==topic+"-002",f"Original practical changed progress ID: {practical}"
        body=page.locator("main").last.inner_text()
        assert len(body)>650, f"Shallow/no original practical content: {topic}"
        page.set_viewport_size({"width":390,"height":844})
        assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"), (
            "Cloud original practical overflows at 390px: "+topic)
        page.set_viewport_size({"width":1440,"height":900})
        print("PASS Cloud original applied practice + 390px:",practical,flush=True)

        nxt=page.get_by_role("button",name=NEXT)
        assert nxt.is_enabled(),"Original practical should allow reflection"
        nxt.click()
        page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
        reflection=parse_qs(urlparse(page.url).query).get("activity",[None])[0]
        assert reflection==topic+"-003",f"Original learner check lost: {reflection}"
        assert not page.get_by_role("button",name=NEXT).is_enabled(), (
            "Knowledge Check unexpectedly bypassable without a human answer: "+topic)
        page.reload(wait_until="networkidle")
        page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
        assert path in page.url, "Cloud module context lost on reload: "+path
        assert not errors,"Cloud UI runtime errors: "+repr(errors)
        print("PASS Cloud genuine 180-character reflection gate + reload:",reflection,flush=True)
    browser.close()
print("PASS initial Hosting, VPS, Networking browser evidence; later gated readings remain NOT TESTED")
