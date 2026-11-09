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


def wait_current_progress_saved(page):
    """Observe the committed IndexedDB path-progress record, not a UI URL race.

    The app persists asynchronously after navigation. A reload before the IDB
    transaction commits can cancel the write and create a false regression.
    This helper does not invent progress or modify the learner's records.
    """
    params=parse_qs(urlparse(page.url).query)
    path=params.get("path",[None])[0]
    expected=params.get("activity",[None])[0]
    assert path and expected,"Cannot verify progress for route: "+page.url
    page.wait_for_function(
        """async ({pathId, activityId}) => {
          const db = await new Promise((resolve, reject) => {
            const req = indexedDB.open('tsa-academy', 5);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
          });
          try {
            const record = await new Promise((resolve, reject) => {
              const request = db.transaction('path-progress', 'readonly')
                                .objectStore('path-progress').get(pathId);
              request.onsuccess = () => resolve(request.result);
              request.onerror = () => reject(request.error);
            });
            return record?.currentActivityId === activityId;
          } finally { db.close(); }
        }""",
        arg={"pathId":path,"activityId":expected},timeout=20000)

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
        wait_current_progress_saved(page)
        page.reload(wait_until="networkidle")
        page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
        assert activity(page)==target["reflection"],"Learner progress/reload was lost"
        assert not page.get_by_role("button",name=NEXT).is_enabled(), (
            "Reload bypasses genuine learner knowledge check")
        assert not errors,"Browser runtime exception "+str(errors)
        print("PASS Cloud 180-character reflection requires real response, no bypass, reload:",
              target["path"],flush=True)
        context.close()
    # Module 4 is a single original topic with one original reading, three
    # new focused readings, four original practices, and a real 350-character
    # gated reflection. It can be fully traversed without inventing answers.
    cert_expected=[
        ("cloud-certificate-lifecycle-operations-001", "What the client actually validates"),
        ("cloud-certificate-lifecycle-operations-007", "ACME separates account identity"),
        ("cloud-certificate-lifecycle-operations-008", "Execute old → staged but stale"),
        ("cloud-certificate-lifecycle-operations-009", "Build two separate monitoring signals"),
        ("cloud-certificate-lifecycle-operations-002", "trust"),
        ("cloud-certificate-lifecycle-operations-003", "renew"),
        ("cloud-certificate-lifecycle-operations-004", "monitor"),
        ("cloud-certificate-lifecycle-operations-005", "recovery"),
        ("cloud-certificate-lifecycle-operations-006", "Certificate"),
    ]
    context=browser.new_context(viewport={"width":1440,"height":900})
    page=context.new_page()
    errors=[]
    page.on("pageerror",lambda err:errors.append(str(err)))
    page.goto(BASE+"/?view=curriculum&school="+school,wait_until="networkidle")
    modules_ui=page.get_by_role("button",name=MODULE)
    modules_ui.first.wait_for(state="visible",timeout=30000)
    assert modules_ui.count()==11
    modules_ui.nth(3).click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert "certificate-lifecycle-operations" in page.url
    for idx,(expected,phrase) in enumerate(cert_expected):
        actual=activity(page)
        assert actual==expected, (
            "Original certificate learner order changed at "+str(idx)+": "+str(actual))
        main=page.locator("main").last
        body=main.inner_text()
        assert phrase.lower() in body.lower(), (
            "Certificate source reading/practical did not render: "+expected)
        if expected=="cloud-certificate-lifecycle-operations-006":
            assert len(body)>250 and "renewal" in body.lower(), (
                "Certificate final reflection prompt missing")
        else:
            assert len(body)>520,"Certificate reading/practical too thin: "+expected
        if expected=="cloud-certificate-lifecycle-operations-008":
            assert main.get_by_role("button",name="Copy").count()>=1, (
                "Actual renewal/reload Python code not copyable")
            assert "CERT_RELOAD_VERIFIED_FROM_INDEPENDENT_TLS_CLIENT" in body
        page.set_viewport_size({"width":390,"height":844})
        assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"), (
            "Certificate mobile overflow: "+expected)
        page.set_viewport_size({"width":1440,"height":900})
        print("PASS certificate original/focused lesson + 390px:",expected,flush=True)
        if idx<len(cert_expected)-1:
            nxt=page.get_by_role("button",name=NEXT)
            assert nxt.is_enabled(),"Unexpected certificate progression lock: "+expected
            nxt.click()
            page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert not page.get_by_role("button",name=NEXT).is_enabled(), (
        "Original 350-character certificate reflection bypassed without learner response")
    wait_current_progress_saved(page)
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert activity(page)=="cloud-certificate-lifecycle-operations-006"
    assert not page.get_by_role("button",name=NEXT).is_enabled()
    assert not errors,"Certificate runtime errors: "+str(errors)
    print("PASS complete certificate reading→3 focused readings→4 real practicals→gated reflection, mobile/reload; NO real ACME/Kong claim",flush=True)
    context.close()

    # Module 5 source has 12 topic knowledge checks; inspect the first original
    # reading/practice and real 180-char reflection gate. IAM/Secrets later
    # remain source-executed but NOT later-page-browser-validated.
    context=browser.new_context(viewport={"width":1440,"height":900})
    page=context.new_page()
    errors=[]
    page.on("pageerror",lambda err:errors.append(str(err)))
    page.goto(BASE+"/?view=curriculum&school="+school,wait_until="networkidle")
    buttons=page.get_by_role("button",name=MODULE)
    buttons.first.wait_for(state="visible",timeout=30000)
    buttons.nth(4).click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    expected=[
        ("cloud-building-blocks-compute-001","Worked capacity decision: requests, service time and queueing"),
        ("cloud-building-blocks-compute-002","capacity"),
        ("cloud-building-blocks-compute-003","larger VM not the same as higher availability"),
    ]
    for i,(name,phrase) in enumerate(expected):
        assert activity(page)==name,"Building Blocks original order unexpectedly changed: "+page.url
        content=page.locator("main").last.inner_text()
        assert phrase.lower() in content.lower(), "Building Block content missing "+name
        if name.endswith("-003"):
            assert len(content)>150, "Original Building Blocks reflection prompt not rendered"
        else:
            assert len(content)>450,"Building Block reading/practical too short "+name
        page.set_viewport_size({"width":390,"height":844})
        assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"), (
            "Building Block mobile overflow "+name)
        page.set_viewport_size({"width":1440,"height":900})
        print("PASS Building Blocks first original activity + mobile:",name,flush=True)
        if i<len(expected)-1:
            page.get_by_role("button",name=NEXT).click()
            page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert not page.get_by_role("button",name=NEXT).is_enabled(), (
        "Building Blocks original 180-char learner check unexpectedly bypassed")
    wait_current_progress_saved(page)
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert activity(page)=="cloud-building-blocks-compute-003"
    assert not errors,"Building Blocks runtime errors "+str(errors)
    print("PASS Cloud Building Blocks first original reading, practice, gated reflection and reload; IAM/Secrets later pages NOT browser-tested",flush=True)
    context.close()
    # Cloud module 6 is one canonical topic, so unlike the twelve individual
    # Building Blocks topics, every focused S3 reading and original practical
    # can be navigated before the original 350-character gated reflection.
    s3_sequence=[
        ("cloud-object-storage-implementation-001","Choose the storage model deliberately"),
        ("cloud-object-storage-implementation-006","Explain why a bucket/key is not a POSIX path"),
        ("cloud-object-storage-implementation-007","Follow PUT, GET, HEAD and LIST as separate API operations"),
        ("cloud-object-storage-implementation-008","Trace who is allowed to sign which API request"),
        ("cloud-object-storage-implementation-009","Define one content digest that Steward owns end to end"),
        ("cloud-object-storage-implementation-010","A persisted volume is not a durable recovery plan"),
        ("cloud-object-storage-implementation-011","Run real versioning, authorization-boundary and integrity checks"),
        ("cloud-object-storage-implementation-002","Deploy and Secure the Object Store"),
        ("cloud-object-storage-implementation-003","Integrate Steward Export Evidence"),
        ("cloud-object-storage-implementation-004","Operate Lifecycle, Failure and Recovery"),
        ("cloud-object-storage-implementation-005","Defend the Steward data placement across PostgreSQL"),
    ]
    context=browser.new_context(viewport={"width":1440,"height":900})
    page=context.new_page()
    errors=[]
    page.on("pageerror",lambda err:errors.append(str(err)))
    page.goto(BASE+"/?view=curriculum&school="+school,wait_until="networkidle")
    module_buttons=page.get_by_role("button",name=MODULE)
    module_buttons.first.wait_for(state="visible",timeout=30000)
    assert module_buttons.count()==11
    module_buttons.nth(5).click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert "object-storage-implementation" in page.url
    for index,(expected,phrase) in enumerate(s3_sequence):
        observed=activity(page)
        assert observed==expected, (
            "S3 canonical activity order lost at "+str(index)+": "+str(observed))
        main=page.locator("main").last
        actual=main.inner_text()
        assert phrase.lower() in actual.lower(), (
            "S3 source not rendered: "+expected)
        if expected.endswith("-005"):
            assert len(actual)>200,"Original S3 reflection prompt not rendered"
        else:
            assert len(actual)>550,"S3 reading/practical underdeveloped: "+expected
        if expected=="cloud-object-storage-implementation-011":
            assert main.get_by_role("button",name="Copy").count()>=1, (
                "Real boto3/MinIO S3 code is not copyable")
            assert "S3_REAL_RESTART_PERSISTED_BYTES_AND_SHA256_VERIFIED" in actual
        page.set_viewport_size({"width":390,"height":844})
        assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"), (
            "S3 390px layout overflow: "+expected)
        page.set_viewport_size({"width":1440,"height":900})
        print("PASS Cloud S3 original/focused activity and mobile:",expected,flush=True)
        if index<len(s3_sequence)-1:
            nxt=page.get_by_role("button",name=NEXT)
            assert nxt.is_enabled(),"Unexpected S3 prerequisite gate: "+expected
            nxt.click()
            page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert not page.get_by_role("button",name=NEXT).is_enabled(), (
        "S3 original 350-character reflection allows empty learner answer")
    wait_current_progress_saved(page)
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert activity(page)=="cloud-object-storage-implementation-005"
    assert not page.get_by_role("button",name=NEXT).is_enabled(), (
        "S3 reflection gate bypassed on hard reload")
    assert not errors,"S3 Chrome runtime errors: "+str(errors)
    print("PASS complete S3 original reading→6 deep readings→3 real practicals→gated reflection, 390px/reload; no invented answer",flush=True)
    context.close()


    # Cloud Engineer module 7: keep the first original reading→practical→
    # reflection and saved learner gate intact. Later original topics have
    # genuine 180-character gates and are not advanced using fake answers.
    context=browser.new_context(viewport={"width":1440,"height":900})
    page=context.new_page()
    runtime_errors=[]
    page.on("pageerror",lambda err: runtime_errors.append(str(err)))
    page.goto(BASE+"/?view=curriculum&school="+school,wait_until="networkidle")
    buttons=page.get_by_role("button",name=MODULE)
    buttons.first.wait_for(state="visible",timeout=30000)
    assert buttons.count()==11,"Cloud 11 canonical modules must remain"
    buttons.nth(6).click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert "infrastructure-as-code" in page.url
    expected_iac=[
        ("infrastructure-as-code-why-infrastructure-as-code-001",
         "Manual infrastructure accumulates hidden knowledge"),
        ("infrastructure-as-code-why-infrastructure-as-code-002",
         "Console-to-Code Audit"),
        ("infrastructure-as-code-why-infrastructure-as-code-003",
         "Infrastructure as Code more than faster provisioning"),
    ]
    for index,(expected,phrase) in enumerate(expected_iac):
        assert activity(page)==expected,"IaC original progress ID/order changed: "+page.url
        body=page.locator("main").last.inner_text()
        assert phrase.lower() in body.lower(),"IaC learner content absent "+expected
        if index<2:
            assert len(body)>520,"IaC original reading/practical too shallow "+expected
        else:
            assert len(body)>140,"IaC reflection question not shown "+expected
        page.set_viewport_size({"width":390,"height":844})
        assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"), (
            "IaC 390px layout overflow "+expected)
        page.set_viewport_size({"width":1440,"height":900})
        print("PASS original IaC learning activity and mobile:",expected,flush=True)
        if index<2:
            next_button=page.get_by_role("button",name=NEXT)
            assert next_button.is_enabled(),"IaC activity navigation unexpectedly blocked "+expected
            next_button.click()
            page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert not page.get_by_role("button",name=NEXT).is_enabled(),(
        "IaC original 180-character reflection permitted blank answer")
    wait_current_progress_saved(page)
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert activity(page)=="infrastructure-as-code-why-infrastructure-as-code-003"
    assert not page.get_by_role("button",name=NEXT).is_enabled()
    assert not runtime_errors,"IaC browser runtime errors "+str(runtime_errors)
    print("PASS IaC original first-topic desktop/390px and genuine reflection/reload gate; later source and real CLI tests distinct",flush=True)
    context.close()

    # Module 8 first original topic: do not bypass any human reflection.
    # Later Pods/Deployment original readings have exact Python source checked
    # by source tests + real kind CLI, not fake browser progress.
    context=browser.new_context(viewport={"width":1440,"height":900})
    page=context.new_page()
    runtime_errors=[]
    page.on("pageerror",lambda err:runtime_errors.append(str(err)))
    page.goto(BASE+"/?view=curriculum&school="+school,wait_until="networkidle")
    module_buttons=page.get_by_role("button",name=MODULE)
    module_buttons.first.wait_for(state="visible",timeout=30000)
    assert module_buttons.count()==11,"Cloud canonical 11 modules changed"
    module_buttons.nth(7).click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert "cloud-orchestration-gitops" in page.url, "Wrong Kubernetes module URL"
    first=[
        ("cloud-orchestration-gitops-why-orchestration-001",
         "Build the mental model from a failure, not a product diagram"),
        ("cloud-orchestration-gitops-why-orchestration-002",
         "Orchestration Requirement Gate"),
        ("cloud-orchestration-gitops-why-orchestration-003",
         "Kubernetes control loop solve"),
    ]
    for index,(expected,phrase) in enumerate(first):
        assert activity(page)==expected,"Original K8s activity order/progress lost "+page.url
        main=page.locator("main").last
        body=main.inner_text()
        assert phrase.lower() in body.lower(), "K8s original content absent "+expected
        if index<2:
            assert len(body)>620,"Original K8s reading/practice too shallow "+expected
        else:
            assert len(body)>140,"Original K8s reflection question missing"
        page.set_viewport_size({"width":390,"height":844})
        assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"), (
            "K8s original activity mobile overflow "+expected)
        page.set_viewport_size({"width":1440,"height":900})
        print("PASS original K8s activity and mobile:",expected,flush=True)
        if index<2:
            nxt=page.get_by_role("button",name=NEXT)
            assert nxt.is_enabled(),"K8s activity incorrectly locked: "+expected
            nxt.click()
            page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert not page.get_by_role("button",name=NEXT).is_enabled(),(
        "Original 180-character K8s reflection bypassable without response")
    wait_current_progress_saved(page)
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert activity(page)=="cloud-orchestration-gitops-why-orchestration-003"
    assert not page.get_by_role("button",name=NEXT).is_enabled()
    assert not runtime_errors,"K8s runtime browser exceptions "+str(runtime_errors)
    print("PASS original Kubernetes intro→practice→gated reflection desktop/390px and reload; later original topic browser pages NOT_TESTED",flush=True)
    context.close()


    # Cloud module 9 is intentionally one original reading, four focused
    # mechanism readings, four unchanged original practicals and the original
    # final human reflection. This path has no earlier knowledge gate.
    canary_sequence=[
        ("cloud-progressive-delivery-canary-001",
         "Canary is the primary learning strategy"),
        ("cloud-progressive-delivery-canary-007",
         "Start with the actual HTTP path and preserve version identity"),
        ("cloud-progressive-delivery-canary-008",
         "Build the observation contract before accepting any sample count"),
        ("cloud-progressive-delivery-canary-009",
         "Represent the release state machine instead of manually toggling pods"),
        ("cloud-progressive-delivery-canary-010",
         "Distinguish delivery authority from progressive rollout machinery"),
        ("cloud-progressive-delivery-canary-002",
         "Design Steward's Canary Contract"),
        ("cloud-progressive-delivery-canary-003",
         "Implement Argo Rollouts Canary Delivery"),
        ("cloud-progressive-delivery-canary-004",
         "Automate Analysis and Abort a Bad Canary"),
        ("cloud-progressive-delivery-canary-005",
         "Break the Progressive Delivery Control Plane"),
        ("cloud-progressive-delivery-canary-006",
         "Defend Steward's canary implementation"),
    ]
    context=browser.new_context(viewport={"width":1440,"height":900})
    page=context.new_page()
    runtime_errors=[]
    page.on("pageerror",lambda err:runtime_errors.append(str(err)))
    page.goto(BASE+"/?view=curriculum&school="+school,wait_until="networkidle")
    buttons=page.get_by_role("button",name=MODULE)
    buttons.first.wait_for(state="visible",timeout=30000)
    assert buttons.count()==11
    buttons.nth(8).click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert "progressive-delivery-canary" in page.url
    for idx,(expected,phrase) in enumerate(canary_sequence):
        assert activity(page)==expected,"Canary activity/progress ID changed: "+page.url
        main=page.locator("main").last
        body=main.inner_text()
        assert phrase.lower() in body.lower(),(
            "Canonical canary source not rendered: "+expected)
        if idx==len(canary_sequence)-1:
            assert len(body)>200,"Original final canary reflection missing"
        else:
            assert len(body)>540,"Shallow canary reading/practical "+expected
        if expected=="cloud-progressive-delivery-canary-007":
            assert main.get_by_role("button",name="Copy").count()>=1,\
                "Real HTTP proof not copyable from focused reading"
            assert "CANARY_REAL_METRICS_OUTAGE_FAILS_CLOSED" in body
        page.set_viewport_size({"width":390,"height":844})
        assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),(
            "Canary 390px horizontal overflow "+expected)
        page.set_viewport_size({"width":1440,"height":900})
        print("PASS original/focused canary activity 390px:",expected,flush=True)
        if idx<len(canary_sequence)-1:
            next_button=page.get_by_role("button",name=NEXT)
            assert next_button.is_enabled(),"Unexpected earlier canary gate "+expected
            next_button.click()
            page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert not page.get_by_role("button",name=NEXT).is_enabled(),(
        "Original 350-character canary reflection accepted without response")
    wait_current_progress_saved(page)
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert activity(page)=="cloud-progressive-delivery-canary-006"
    assert not page.get_by_role("button",name=NEXT).is_enabled()
    assert not runtime_errors,"Canary Chrome runtime exceptions "+str(runtime_errors)
    print("PASS entire module 9: original + four focused readings + four original practicals + genuine gated final reflection/reload; no fake learner answer",flush=True)
    context.close()

    browser.close()
print("PASS Cloud modules 1–9 bounded browser evidence; human learner transfer and real Argo Rollouts remain unverified")
