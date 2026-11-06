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
    # Module 4, continuous integration: inspect the full learner-facing original
    # lesson sequence, including the five newly deepened conceptual boundaries.
    # This is real UI/390px evidence, not a real GitLab Runner or learner exam.
    ci_topics=(
      "architecture","jobs-stages","runners","github-gitlab","self-hosted",
      "caching","artifacts","secrets","parallelism","automated-checks",
      "test-stages","quality-gates","container-build"
    )
    ci_headings={
      "architecture":"What integration actually means",
      "jobs-stages":"A job graph is a contract for eligibility, not only ordering",
      "runners":"Follow a job from scheduling to an isolated workspace",
      "github-gitlab":"Map semantics rather than translate indentation",
      "self-hosted":"Runner installation is an operational decision",
      "caching":"Cache keys represent dependency assumptions; a cache is never an authority",
      "artifacts":"An artifact is the produced state of one execution",
      "secrets":"Secrets are a runtime capability, not a harmless string",
      "parallelism":"A faster graph needs dependencies and capacity",
      "automated-checks":"A check is only useful with an oracle",
      "test-stages":"Order tests by cost and the property they defend",
      "quality-gates":"A gate ties a named risk to a blocking observation",
      "container-build":"Commit, tag, local image ID, manifest digest and deployment are different records",
    }
    page.goto(BASE+"/?view=curriculum&school=delivery-engineer",wait_until="networkidle")
    page.get_by_role("button",name=MODULE).first.wait_for(state="visible",timeout=30000)
    page.get_by_role("button",name=MODULE).nth(3).click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    aside=page.locator("aside").filter(has=page.get_by_text("Curriculum",exact=True)).first
    count=aside.locator("button").count()
    assert count>25,f"CI module unexpectedly lost original lessons/practicals: {count}"
    visited_ci=set()
    for i in range(count):
        activity=parse_qs(urlparse(page.url).query).get("activity",[None])[0]
        if activity in {f"continuous-integration-{topic}-001" for topic in ci_topics}:
            topic=activity[len("continuous-integration-"):-len("-001")]
            main=page.locator("main").last
            body=main.inner_text()
            assert ci_headings[topic] in body,f"Original CI mechanism not published: {activity}: {ci_headings[topic]}"
            assert len(body)>1550,f"Original CI reading too short after teaching: {activity} {len(body)}"
            if topic in {"jobs-stages","container-build"}:
                assert main.get_by_role("button",name="Copy").count()>0, "No copyable actual CI source on "+activity
            if topic=="jobs-stages":
                assert "Worked GitLab YAML: four jobs" in body
                assert "candidate_manifest" in body and "candidate_audit" in body
            page.set_viewport_size({"width":390,"height":844})
            assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"), f"390px CI overflow {activity}"
            page.set_viewport_size({"width":1440,"height":900})
            visited_ci.add(activity)
            print("PASS original CI source + mechanism + mobile:",activity,flush=True)
        if i<count-1:
            page.get_by_role("button",name=NEXT).click()
            page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    expected_ci={f"continuous-integration-{topic}-001" for topic in ci_topics}
    assert visited_ci==expected_ci, "Lost CI original IDs: "+str(expected_ci-visited_ci)
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert "continuous-integration" in page.url, "CI module reentry lost across hard reload"
    assert not errors,"Browser runtime error during complete CI module review: "+str(errors)
    print("PASS all 13 original CI readings at 390px, exact YAML source and module reload",flush=True)
    # Module 5 / all ten original CD readings, the exact local proof blocks,
    # all original applied practices and the four-activity final lab.
    # Chrome completion/navigation is synthetic UI evidence, not a deployed
    # Steward system, external approval, real data migration or learner mastery.
    cd_topics=(
      "ci-cd-cd","environment-management","deployment-automation",
      "release-approvals","database-migrations","rollback",
      "rolling-deployments","blue-green","canary","feature-flags"
    )
    cd_headings={
      "ci-cd-cd":"Three different promises, three different exit criteria",
      "environment-management":"Environment means dependencies plus trust",
      "deployment-automation":"Deployment is an ordered state transition",
      "release-approvals":"GitLab deployment approvals are not automatically available on every self-managed tier",
      "database-migrations":"A schema version is shared mutable state, not a private application implementation",
      "rollback":"Define exactly which state can be restored",
      "rolling-deployments":"An algorithm only works if capacity and compatibility exist",
      "blue-green":"Two environments reduce switch-over risk, not shared-state risk",
      "canary":"Partial traffic is an experiment with exposure and stopping rules",
      "feature-flags":"Distinguish deployment, targeting and side-effect authorization"
    }
    cd_code={"release-approvals","database-migrations","rollback","blue-green","canary","feature-flags"}
    page.goto(BASE+"/?view=curriculum&school=delivery-engineer",wait_until="networkidle")
    page.get_by_role("button",name=MODULE).first.wait_for(state="visible",timeout=30000)
    page.get_by_role("button",name=MODULE).nth(4).click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    cd_sidebar=page.locator("aside").filter(has=page.get_by_text("Curriculum",exact=True)).first
    cd_count=cd_sidebar.locator("button").count()
    assert cd_count>=24,f"CD original concept/practice/lab activity count unexpectedly small: {cd_count}"
    cd_seen=set()
    cd_final_labs=set()
    cd_lab_ids={
      f"continuous-delivery-deployment-lab-automate-steward-api-deployment-and-rollback-{n:03d}"
      for n in range(1,5)
    }
    for i in range(cd_count):
        activity=parse_qs(urlparse(page.url).query).get("activity",[None])[0]
        if activity in {f"continuous-delivery-deployment-{topic}-001" for topic in cd_topics}:
            topic=activity[len("continuous-delivery-deployment-"):-len("-001")]
            main=page.locator("main").last
            body=main.inner_text()
            assert cd_headings[topic] in body,f"Original CD mechanism not rendered: {activity}: {cd_headings[topic]}"
            assert len(body)>1800,f"Short learner-facing CD reading {activity}: {len(body)}"
            if topic in cd_code:
                assert main.get_by_role("button",name="Copy").count()>0,f"Exact CD example code not rendered: {activity}"
            if topic=="blue-green":
                assert "CD_BROKEN_CANDIDATE_LEFT_ACTIVE_A_UNCHANGED" in body
                assert "-p 127.0.0.1::8080" in body
            page.set_viewport_size({"width":390,"height":844})
            assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),f"CD overflow at 390px: {activity}"
            page.set_viewport_size({"width":1440,"height":900})
            cd_seen.add(activity)
            print("PASS original CD reading + exact proof + 390px:",activity,flush=True)
        if activity in cd_lab_ids:
            assert page.locator("main").last.is_visible(),f"Original final CD lab not navigable: {activity}"
            cd_final_labs.add(activity)
        if i<cd_count-1:
            page.get_by_role("button",name=NEXT).click()
            page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    expected_cd={f"continuous-delivery-deployment-{topic}-001" for topic in cd_topics}
    assert cd_seen==expected_cd,"Lost CD original lesson IDs: "+str(expected_cd-cd_seen)
    assert cd_final_labs==cd_lab_ids,"Lost or renamed original CD final practicals: "+str(cd_lab_ids-cd_final_labs)
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert "continuous-delivery-deployment" in page.url,"CD reentry lost after reload"
    assert not errors,"Browser runtime errors in original CD lessons: "+str(errors)
    print("PASS ten original CD reading IDs, 6 copyable proof blocks, four original milestone IDs and reload",flush=True)
    # Module 8: all SIX original Release Engineering readings, original
    # applied practices, the four-part final lab and final module review.
    # Source navigation and synthetic progress are NOT real Nexus/Steward
    # publication or independently evaluated human competence.
    release_topics=(
      "release-candidates","promotion-and-gates","deployment-evidence",
      "release-observability","release-failure-handling","release-runbooks"
    )
    release_mechanisms={
      "release-candidates":"A candidate is a nominated set of immutable bytes and execution assumptions",
      "promotion-and-gates":"Draw a promotion state machine with guards rather than a slide",
      "deployment-evidence":"Pipeline, runtime and client observations prove different claims",
      "release-observability":"A release marker is not a service-level indicator",
      "release-failure-handling":"Classify a failure by the first unsafe boundary reached",
      "release-runbooks":"A runbook has a state-dependent branch at each dangerous command",
    }
    release_readings={f"release-engineering-{topic}-001" for topic in release_topics}
    release_practices={f"release-engineering-{topic}-002" for topic in release_topics}
    release_lab={f"release-engineering-steward-release-lab-{n:03d}" for n in range(1,5)}
    release_review="release-engineering-module-review-001"
    page.goto(BASE+"/?view=curriculum&school=delivery-engineer",wait_until="networkidle")
    page.get_by_role("button",name=MODULE).first.wait_for(state="visible",timeout=30000)
    # Module 7 is Artifact & Dependency Supply Chain; Release Engineering is 8th.
    page.get_by_role("button",name=MODULE).nth(7).click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    release_sidebar=page.locator("aside").filter(has=page.get_by_text("Curriculum",exact=True)).first
    release_count=release_sidebar.locator("button").count()
    assert release_count>=17,f"Release Engineering missing original practice/lab activities: {release_count}"
    release_seen_readings=set()
    release_seen_practices=set()
    release_seen_lab=set()
    release_seen_review=False
    release_review_protected=False
    for i in range(release_count):
        activity=parse_qs(urlparse(page.url).query).get("activity",[None])[0]
        assert activity,f"Release Engineering lost an activity URL at index {i}"
        if activity in release_readings:
            topic=activity[len("release-engineering-"):-len("-001")]
            main=page.locator("main").last
            text_content=main.inner_text()
            assert release_mechanisms[topic] in text_content, f"Original release mechanism not published: {activity}"
            assert "Teach the decision and its limit" in text_content,activity
            assert len(text_content)>2700,f"Shallow release reading after rewrite: {activity}: {len(text_content)}"
            assert main.get_by_role("button",name="Copy").count()>=1,f"Published runnable release proof uncopyable: {activity}"
            if topic=="release-candidates":
                assert main.get_by_role("button",name="Copy").count()>=2,"Missing second original Docker mutable-tag example"
                assert "RELEASE_MUTABLE_TAG_CHANGED_IMAGE_ID" in text_content
            page.set_viewport_size({"width":390,"height":844})
            assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),f"Release 390px overflow: {activity}"
            page.set_viewport_size({"width":1440,"height":900})
            release_seen_readings.add(activity)
            print("PASS original Release Engineering reading + 390px + executable proof:",activity,flush=True)
        elif activity in release_practices:
            main=page.locator("main").last
            assert main.is_visible(),f"Release original practice missing: {activity}"
            body=main.inner_text()
            assert "Run" in body and "evidence" in body.lower(), f"Unremediated release practice: {activity}"
            release_seen_practices.add(activity)
        elif activity in release_lab:
            assert page.locator("main").last.is_visible(),f"Lost original release final lab {activity}"
            release_seen_lab.add(activity)
        elif activity==release_review:
            assert page.locator("main").last.is_visible(),"Lost final module review"
            release_seen_review=True
        if i<release_count-1:
            next_button=page.get_by_role("button",name=NEXT)
            if next_button.is_enabled():
                next_button.click()
                page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
            else:
                # The fourth ORIGINAL lab activity requires a real 250-character
                # learner reflection before the Next button unlocks. This is an
                # intended learning gate, not a rendering failure. The browser
                # cannot fake a learner response or claim mastery. Inspect the
                # subsequent module review by its stable deep-link separately.
                assert activity=="release-engineering-steward-release-lab-004", (
                    "Unexpected Release progression block at "+str(activity))
                assert "reflection" in page.locator("main").last.inner_text().lower() or (
                    "Which release signal" in page.locator("main").last.inner_text())
                print("PASS original release-lab-004 reflection correctly gates Next; no synthetic answer supplied",flush=True)
                page.goto(BASE+"/?view=curriculum&school=delivery-engineer&path=release-engineering&activity="+release_review,wait_until="networkidle")
                page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
                observed_review_activity=parse_qs(urlparse(page.url).query).get("activity",[None])[0]
                assert observed_review_activity!=release_review, (
                    "Final review unexpectedly bypasses the required learner reflection")
                assert "release-engineering" in page.url, (
                    "Gated final review deep-link escaped the Release Engineering module")
                release_review_protected=True
                print("PASS final Release review correctly gated behind uncompleted learner reflection; no fake answer or completion",flush=True)
                break
    assert release_seen_readings==release_readings,"Original Release reading IDs missing: "+str(release_readings-release_seen_readings)
    assert release_seen_practices==release_practices,"Original Release practices missing: "+str(release_practices-release_seen_practices)
    assert release_seen_lab==release_lab,"Original Release lab IDs missing: "+str(release_lab-release_seen_lab)
    assert release_seen_review or release_review_protected,"Original final review neither rendered nor correctly gated"
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert "release-engineering" in page.url,"Release module navigation not retained after reload"
    assert not errors,"Browser runtime errors in Release module: "+str(errors)
    print("PASS 6 original Release readings, 6 practices, 4 final labs, protected final review, Chrome 390px and reload",flush=True)
    # Module 7: verify the ORIGINAL first-five Artifact Supply Chain readings and
    # their topic-specific practicals. This is a limited source/rendering check,
    # not a complete twenty-five-reading school certification or learner mastery.
    supply_topics=(
        "why-internal-repositories","registries-vs-repositories",
        "public-private-dependencies","repository-manager-architecture",
        "hosted-proxy-group","python-pypi-distribution"
    )
    # Repository Manager Architecture is already present and preserved; five
    # reconstructed topics are selected independently of their sequential positions.
    supply_rebuilt={supply_topics[i] for i in (0,1,2,4,5)}
    supply_mechanisms={
        "why-internal-repositories":"Follow an artifact across independent machines",
        "registries-vs-repositories":"A registry is a protocol contract, not a directory nickname",
        "public-private-dependencies":"Run real pip candidate selection against two disposable index endpoints",
        "hosted-proxy-group":"Follow write authority separately from read resolution",
        "python-pypi-distribution":"Walk from Python project to wheel and installation"
    }
    page.goto(BASE+"/?view=curriculum&school=delivery-engineer",wait_until="networkidle")
    page.get_by_role("button",name=MODULE).first.wait_for(state="visible",timeout=30000)
    assert page.get_by_role("button",name=MODULE).count()==11
    page.get_by_role("button",name=MODULE).nth(6).click()
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    sidebar=page.locator("aside").filter(has=page.get_by_text("Curriculum",exact=True)).first
    count=sidebar.locator("button").count()
    assert count>=75,f"Artifact Supply Chain original 25*3 activities missing: {count}"
    read_seen=set()
    practice_seen=set()
    gated_reflection=None
    for i in range(count):
        activity=parse_qs(urlparse(page.url).query).get("activity",[None])[0]
        if not activity:
            raise AssertionError(f"Supply-chain page lost activity URL at {i}")
        for topic in supply_rebuilt:
            if activity==f"artifact-and-supply-chain-{topic}-001":
                main=page.locator("main").last
                content=main.inner_text()
                assert supply_mechanisms[topic] in content, f"Missing original-topic mechanism: {activity}"
                assert len(content)>1800, f"Supply-chain reading still too short: {activity}: {len(content)}"
                if topic=="public-private-dependencies":
                    assert main.get_by_role("button",name="Copy").count()>=1, "Actual pip fixture not copyable in original reading"
                    assert "MIXED_INDEX_SELECTED_EXTERNAL_9_9_9" in content, "Expected pip negative control missing"
                page.set_viewport_size({"width":390,"height":844})
                assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),f"Supply chain mobile overflow: {activity}"
                page.set_viewport_size({"width":1440,"height":900})
                read_seen.add(topic)
                print("PASS original Supply Chain reading + 390px:",activity,flush=True)
            if activity==f"artifact-and-supply-chain-{topic}-002":
                main=page.locator("main").last
                assert main.is_visible(), "Original applied practical not visible: "+activity
                assert len(main.inner_text())>450,"Original applied practical has no executable task: "+activity
                practice_seen.add(topic)
        if read_seen==supply_rebuilt and practice_seen==supply_rebuilt:
            break
        if i<count-1:
            next_button=page.get_by_role("button",name=NEXT)
            if not next_button.is_enabled():
                assert activity=="artifact-and-supply-chain-why-internal-repositories-003", (
                    "Unexpected Supply Chain progression gate at "+str(activity))
                gated_reflection=activity
                print("PASS original Supply Chain knowledge check requires genuine 180-character learner response; synthetic browser does not invent one",flush=True)
                break
            next_button.click()
            page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    # A gated 180-character knowledge check is an actual UX acceptance
    # boundary, not permission to fabricate a reply. Other source-rebuilt
    # readings are checked by exact-source tests and remain browser-UNVERIFIED.
    assert "why-internal-repositories" in read_seen
    assert "why-internal-repositories" in practice_seen
    assert gated_reflection=="artifact-and-supply-chain-why-internal-repositories-003"
    page.reload(wait_until="networkidle")
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    assert "artifact-and-supply-chain" in page.url,"Supply-chain lesson reentry lost on reload"
    assert not errors,"Browser runtime errors after Supply Chain traversal: "+str(errors)
    print("PASS first original Supply Chain reading/practical, 390px, genuine reflection gate and reload; later source-rebuilt lessons NOT browser-tested",flush=True)

    browser.close()
print("PASS Configuration Management rendered evidence and reload (synthetic navigation only)")
