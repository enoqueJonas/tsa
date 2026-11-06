"""Rendered original Configuration Management lessons, not a human mastery test."""
import os
import re
from urllib.parse import parse_qs, urlparse
from playwright.sync_api import sync_playwright

BASE=os.getenv("TSA_BASE_URL","http://127.0.0.1:4173")
MODULE=re.compile(r"^(Start|Continue|Review) module$")
NEXT=re.compile(r"^(Next|Next lesson|Complete path)$")
TARGETS={
  "configuration-management-drift-001":
      ("Desired, observed, and unexplained state are different",False),
  "configuration-management-inventories-001":
      ("How Ansible resolves a host target",True),
  "configuration-management-playbooks-001":
      ("Follow the path from a play to a module's state result",True),
  "configuration-management-roles-001":
      ("Build a complete tiny role before reusing it",True),
}
with sync_playwright() as playwright:
    browser=playwright.chromium.launch(headless=True,channel="chrome")
    page=browser.new_page(viewport={"width":1440,"height":900})
    errors=[]
    page.on("pageerror",lambda err:errors.append(str(err)))
    page.goto(BASE+"/?view=curriculum&school=delivery-engineer",wait_until="networkidle")
    buttons=page.get_by_role("button",name=MODULE)
    buttons.first.wait_for(state="visible",timeout=30000)
    assert buttons.count()==11,"Expected 11 Delivery Engineer modules"
    buttons.nth(5).click()  # sixth canonical module: Configuration Management
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    sidebar=page.locator("aside").filter(has=page.get_by_text("Curriculum",exact=True)).first
    count=sidebar.locator("button").count()
    assert count>12,"Expected original Configuration Management reading and practice pages"
    seen=set()
    for i in range(count):
        activity=parse_qs(urlparse(page.url).query).get("activity",[None])[0]
        assert activity,"No activity ID in URL"
        if activity in TARGETS:
            main=page.locator("main").last
            body=main.inner_text()
            heading,needs_code=TARGETS[activity]
            assert heading in body,f"Original author-source mechanism not rendered: {activity}: {heading}"
            assert len(body)>1600,f"Short learner reading: {activity}, {len(body)} chars"
            if needs_code:
                assert main.get_by_role("button",name="Copy").count()>0, f"Expected copyable code on {activity}"
            page.set_viewport_size({"width":390,"height":844})
            assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),f"Mobile 390px overflow on {activity}"
            page.set_viewport_size({"width":1440,"height":900})
            seen.add(activity)
            print("PASS rendered original Configuration Management + 390px:",activity,flush=True)
        if i<count-1:
            next_button=page.get_by_role("button",name=NEXT)
            assert next_button.is_enabled(),f"Can't advance after {activity}"
            next_button.click()
            page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert seen==set(TARGETS),"Missing original author-source readings: "+str(set(TARGETS)-seen)
    assert not errors,"Unexpected browser runtime errors: "+str(errors)
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert "configuration-management" in page.url, "Reload lost current Delivery module"
    # Docker lesson evidence: the earlier author-source audit had substantial
    # classroom explanations, but its actual BusyBox container sample was not
    # executed. The accompanying Node CI runs that exact source against Docker.
    docker_targets={
      "containers-and-docker-namespaces-cgroups-001":
        ("Guided observable inspection with a disposable container",True),
      "containers-and-docker-architecture-001":
        ("Trace the Docker control plane explicitly",True),
      "containers-and-docker-registries-001":
        ("A registry reference has multiple layers of identity",False),
    }
    page.goto(BASE+"/?view=curriculum&school=delivery-engineer",wait_until="networkidle")
    page.get_by_role("button",name=MODULE).first.wait_for(state="visible",timeout=30000)
    page.get_by_role("button",name=MODULE).nth(2).click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    aside=page.locator("aside").filter(has=page.get_by_text("Curriculum",exact=True)).first
    count=aside.locator("button").count()
    seen_docker=set()
    for i in range(count):
        activity=parse_qs(urlparse(page.url).query).get("activity",[None])[0]
        if activity in docker_targets:
            main=page.locator("main").last
            body=main.inner_text()
            heading,needs_code=docker_targets[activity]
            assert len(body)>1700, f"Docker source lesson still thin: {activity} ({len(body)} chars)"
            assert heading in body,f"Missing original source mechanism {activity}: {heading}"
            if needs_code:
                assert main.get_by_role("button",name="Copy").count()>0,f"Uncopyable Docker code: {activity}"
            page.set_viewport_size({"width":390,"height":844})
            assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),f"Docker page overflow at 390px: {activity}"
            page.set_viewport_size({"width":1440,"height":900})
            seen_docker.add(activity)
            print("PASS original Docker source + 390px:",activity,flush=True)
        if i<count-1:
            page.get_by_role("button",name=NEXT).click()
            page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert seen_docker==set(docker_targets),"Missing Docker original activities: "+str(set(docker_targets)-seen_docker)
    assert not errors,"Browser errors during Docker source traversal: "+str(errors)
    browser.close()
print("PASS Configuration Management rendered evidence and reload (synthetic navigation only)")
