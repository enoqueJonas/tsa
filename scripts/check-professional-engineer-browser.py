"""Check two original Professional Engineer school entrypoints in actual Chromium.
Synthetic browser navigation is not independent learner or real workplace validation.
"""
import re
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE="http://127.0.0.1:4173"
ART=Path("artifacts/professional-engineer-browser")
ART.mkdir(parents=True,exist_ok=True)
READINGS=(
 ("professional-practice-accountable-engineering-decisions-reading","Accountable Decisions"),
 ("capstone-problem-discovery-evidence-provenance-reading","Discovery Evidence"),
)

def seed_completed_path(page, path_id, completed):
 """Synthetic browser-only prerequisite completion. Never classify as learning."""
 page.goto(BASE+"/?view=curriculum&school=professional-engineer",wait_until="networkidle")
 page.evaluate("""async ({pathId, completed}) => {
   const db=await new Promise((resolve,reject)=>{
     const q=indexedDB.open('tsa-academy',5);
     q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);
   });
   try {
     const tx=db.transaction('path-progress','readwrite');
     const now=new Date().toISOString();
     tx.objectStore('path-progress').put({
       schemaVersion:5,pathId,currentActivityId:completed[0],
       completedActivityIds:completed,
       reflectionResponses:Object.fromEntries(
         completed.filter(id=>id.endsWith('-check'))
                  .map(id=>[id,'SYNTHETIC progression only; no learner evidence'])),
       startedAt:now,updatedAt:now
     });
     await new Promise((resolve,reject)=>{
       tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
     });
   }finally{db.close();}
 }""",{"pathId":path_id,"completed":completed})
 page.reload(wait_until="networkidle")
 print(f"SEEDED synthetic prerequisites for {path_id}: {len(completed)} IDs, NOT learner evidence",flush=True)

def synthetic_practice_complete(page):
 fundamentals=["professional-practice-accountable-engineering-decisions-"+s
               for s in ("reading","practice","check")]
 originals=(
  "ethics-public-interest","privacy-data-responsibility","accessibility-inclusion",
  "competence-uncertainty","conflicts-pressure","traceability-accountability"
 )
 complete=fundamentals+[
  "professional-practice-"+topic+"-"+suffix
  for topic in originals for suffix in ("reading","practice")
 ]
 assert len(complete)==15
 seed_completed_path(page,"professional-practice",complete)

def synthetic_discovery_complete(page):
 fundamentals=["capstone-problem-discovery-evidence-provenance-"+s
               for s in ("reading","practice","check")]
 original=(
  "choosing-a-substantial-problem","stakeholder-discovery","problem-framing",
  "requirements","constraints","working-with-ambiguity","quality-attributes",
  "risk","success-measures-and-evidence","scope-and-non-goals"
 )
 complete=fundamentals+[
  "capstone-problem-discovery-"+topic+"-"+suffix
  for topic in original for suffix in ("001","practice")
 ]
 complete.append("capstone-problem-discovery-lab-produce-the-capstone-discovery-brief-001")
 assert len(complete)==24
 seed_completed_path(page,"capstone-problem-discovery",complete)

def run():
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True, **({"channel":"chrome"} if os.getenv("TSA_BROWSER_CHANNEL")=="chrome" else {}))
  page=browser.new_page(viewport={"width":1440,"height":900})
  errors=[]
  page.on("pageerror",lambda error:errors.append(str(error)))
  # Simulate an older profile that completed only deleted synthetic preparation.
  # Such IDs are not proof of completion of any authored Professional lesson.
  page.goto(BASE+"/?view=curriculum&school=professional-engineer",wait_until="networkidle")
  page.evaluate("""async () => {
    const db=await new Promise((resolve,reject)=>{
      const request=indexedDB.open('tsa-academy',5);
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    try{
      const tx=db.transaction('path-progress','readwrite');
      const stale=[
        'professional-practice-professional-model-reading',
        'professional-practice-ethics-public-interest-practice-professional-preparation'
      ];
      const now=new Date().toISOString();
      tx.objectStore('path-progress').put({
        schemaVersion:5,pathId:'professional-practice',
        currentActivityId:stale[1],completedActivityIds:stale,
        reflectionResponses:{},startedAt:now,updatedAt:now
      });
      await new Promise((resolve,reject)=>{
        tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
      });
    }finally{db.close();}
  }""")
  print("SEEDED only obsolete synthetic-preparation IDs; no learner achievement inferred",flush=True)
  for index,(expected,headline) in enumerate(READINGS):
   if index == 1:
    # Later modules must not be considered unlocked merely because their
    # cards exist or the previous module has a synthetic, deleted wrapper ID.
    synthetic_practice_complete(page)
   page.goto(BASE+"/?view=curriculum&school=professional-engineer",wait_until="networkidle")
   page.get_by_role("button",name=re.compile(r"^(Start|Continue|Review) module$")).nth(index).click()
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   activity=page.evaluate("new URLSearchParams(location.search).get('activity')")
   assert activity==expected, f"Wrong Professional entrypoint: {activity} != {expected}"
   main=page.locator("main").last
   assert headline in main.inner_text(),f"Original lesson not displayed: {headline}"
   assert len(main.inner_text().strip())>=2300,f"Thin Professional first-principles reading: {activity}"
   assert main.get_by_role("button",name="Copy").count()>0,"Published executable code not copyable"
   assert "Plan independent evidence" not in main.inner_text(),"Synthetic wrapper returned"
   page.set_viewport_size({"width":390,"height":844})
   assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),"390px Professional overflow"
   assert main.locator("figure pre").count()>0,"Learner source not readable at mobile width"
   page.screenshot(path=str(ART/f"professional-{index+1}-390.png"),full_page=True)
   page.set_viewport_size({"width":1440,"height":900})
   page.evaluate("scrollTo(0,document.body.scrollHeight)")
   page.wait_for_function("scrollY>8",timeout=10000)
   page.get_by_role("button",name=re.compile(r"^(Next|Next lesson|Complete path)$")).click()
   page.wait_for_function("scrollY<=8",timeout=10000)
   # URL transition is deliberately published only AFTER the IndexedDB write.
   next_activity=expected.removesuffix("-reading")+"-practice"
   page.wait_for_function("(id) => new URLSearchParams(location.search).get('activity') === id",
                          arg=next_activity,timeout=12000)
   page.reload(wait_until="networkidle")
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   assert page.evaluate("new URLSearchParams(location.search).get('activity')")==expected.removesuffix("-reading")+"-practice"
   print("PASS Professional rendered source, mobile, next-at-top and reload:",expected,flush=True)
  # Gate the third module through completion of the second module's *actual*
  # authored IDs. This synthetic fixture is not independent learner evidence.
  synthetic_discovery_complete(page)
  # Exercise the entire newly remediated proposal module. Progress is seeded
  # only in this isolated Chromium profile; it is NOT learner acceptance.
  from urllib.parse import urlencode
  topics=(
    "system-context-and-boundaries","domain-and-data-model-proposal",
    "architecture-proposal","infrastructure-and-hosting-proposal",
    "delivery-plan","quality-strategy","security-strategy",
    "reliability-strategy","operational-model","cost-model",
    "governance-approach","dependency-and-internal-platform-decisions",
    "implementation-milestones","architecture-and-risk-review"
  )
  stage_ids=(
    "capstone-engineering-proposal-stage-domain-boundary-decision",
    "capstone-engineering-proposal-stage-quality-security-operations",
    "capstone-engineering-proposal-stage-cost-governance-review"
  )
  completed=[]
  for topic in topics:
   completed.extend((f"capstone-engineering-proposal-{topic}-001",
                     f"capstone-engineering-proposal-{topic}-application"))
  for stage in stage_ids:
   completed.extend((stage+"-practice",stage+"-check"))
  completed.append("capstone-engineering-proposal-lab-defend-the-capstone-engineering-proposal-001")
  assert len(completed)==35
  page.goto(BASE+"/?view=curriculum&school=professional-engineer",wait_until="networkidle")
  page.evaluate("""async ({completed}) => {
    const db=await new Promise((resolve,reject)=>{
      const q=indexedDB.open("tsa-academy",5);
      q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);
    });
    try {
      const tx=db.transaction("path-progress","readwrite");
      const now=new Date().toISOString();
      tx.objectStore("path-progress").put({
        schemaVersion:5,pathId:"capstone-engineering-proposal",
        currentActivityId:completed[0],completedActivityIds:completed,
        reflectionResponses:Object.fromEntries(
          completed.filter(id=>id.endsWith("-check"))
                   .map(id=>[id,"SYNTHETIC browser fixture; no independent learner"])),
        startedAt:now,updatedAt:now,
      });
      await new Promise((resolve,reject)=>{
        tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
        tx.onabort=()=>reject(tx.error);
      });
    } finally {db.close();}
  }""",{"completed":completed})
  page.reload(wait_until="networkidle")
  for index,topic in enumerate(topics):
   activity=f"capstone-engineering-proposal-{topic}-001"
   direct=BASE+"/?"+urlencode({
     "view":"curriculum","school":"professional-engineer",
     "path":"capstone-engineering-proposal","activity":activity})
   page.goto(direct,wait_until="networkidle")
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   current=page.evaluate("new URLSearchParams(location.search).get('activity')")
   assert current==activity,f"Original proposal ID not navigable: {activity} => {current}"
   main=page.locator("main").last
   body=main.inner_text()
   assert len(body)>=1800,f"Original proposal reading still thin: {activity} = {len(body)} chars"
   assert "Mechanism, a worked decision, failure and counterargument" in body,activity
   assert "Transfer beyond this fictional scenario" in body,activity
   expect_code=topic in ("domain-and-data-model-proposal","delivery-plan","cost-model")
   if expect_code:
    assert main.get_by_role("button",name="Copy").count()>0,"Source code missing: "+topic
    assert main.locator("figure pre").count()>0,"Code text not rendered: "+topic
   page.set_viewport_size({"width":390,"height":844})
   assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),"Proposal 390px overflow: "+activity
   if index in (0,1,4,9,13):
    page.screenshot(path=str(ART/f"proposal-{index+1}-390.png"),full_page=True)
   page.set_viewport_size({"width":1440,"height":900})
   print("PASS original proposal reading + mobile:",activity,flush=True)
  for activity in [stage+"-practice" for stage in stage_ids]+[
    "capstone-engineering-proposal-lab-defend-the-capstone-engineering-proposal-001"]:
   page.goto(BASE+"/?"+urlencode({
     "view":"curriculum","school":"professional-engineer",
     "path":"capstone-engineering-proposal","activity":activity}),wait_until="networkidle")
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   assert page.evaluate("new URLSearchParams(location.search).get('activity')")==activity,activity
   assert page.locator("main").last.is_visible(),activity
  page.reload(wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==(
    "capstone-engineering-proposal-lab-defend-the-capstone-engineering-proposal-001")
  persisted=page.evaluate("""async () => {
    const db=await new Promise((resolve,reject)=>{
      const q=indexedDB.open("tsa-academy",5);
      q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);
    });
    try {
      const q=db.transaction("path-progress","readonly")
                .objectStore("path-progress").get("capstone-engineering-proposal");
      return await new Promise((resolve,reject)=>{
        q.onsuccess=()=>resolve(q.result?.completedActivityIds ?? []);
        q.onerror=()=>reject(q.error);
      });
    } finally {db.close();}
  }""")
  assert all(activity in persisted for activity in completed),"Legacy original/staged completion IDs lost"
  print("PASS full original 14 proposal readings, three staged gates, preserved final ID and synthetic reload",flush=True)
  # Entire Module 4 — original 15 authored concepts, six published code
  # examples, three staged labs and the original two long-lab IDs. Synthetic
  # completion in isolated IndexedDB tests navigation only, never competence.
  build_topics=(
    "start-from-a-blank-repository","establish-engineering-conventions",
    "model-the-domain","implement-the-system","design-and-evolve-the-data",
    "build-infrastructure","automate-delivery","build-quality-evidence",
    "secure-the-system","instrument-the-system",
    "build-reliability-evidence","operate-internal-dependencies-deliberately",
    "iterate-on-engineering-decisions","document-significant-decisions",
    "manage-scope-and-technical-debt",
  )
  build_stage_ids=(
    "capstone-independent-build-stage-first-vertical-slice",
    "capstone-independent-build-stage-deployment-and-security-boundaries",
    "capstone-independent-build-stage-operability-recovery-and-reuse",
  )
  build_original_labs=(
    "capstone-independent-build-lab-evaluate-shared-test-capability-001",
    "capstone-independent-build-lab-deliver-the-first-end-to-end-capstone-release-001",
  )
  build_completed=[
    f"capstone-independent-build-{topic}-{suffix}"
    for topic in build_topics for suffix in ("001","build")
  ]
  for stage in build_stage_ids:
   build_completed.extend((stage+"-practice",stage+"-check"))
  build_completed.extend(build_original_labs)
  assert len(build_completed)==38
  seed_completed_path(page,"capstone-independent-build",build_completed)
  build_code_topics={
    "model-the-domain","design-and-evolve-the-data",
    "automate-delivery","secure-the-system",
    "instrument-the-system","build-reliability-evidence"
  }
  for index,topic in enumerate(build_topics):
   aid=f"capstone-independent-build-{topic}-001"
   deep=BASE+"/?"+urlencode({
      "view":"curriculum","school":"professional-engineer",
      "path":"capstone-independent-build","activity":aid
   })
   page.goto(deep,wait_until="networkidle")
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   current=page.evaluate("new URLSearchParams(location.search).get('activity')")
   assert current==aid,f"Independent Build authored deep link lost: {aid} => {current}"
   content=page.locator("main").last
   rendered=content.inner_text()
   assert len(rendered)>=1600,f"Thin Independent Build reading: {aid}, {len(rendered)} chars"
   assert "Understand the engineering claim before implementation" in rendered,aid
   assert "Independent application" in rendered,aid
   if topic in build_code_topics:
    assert content.get_by_role("button",name="Copy").count()>0,f"Uncopyable actual source: {aid}"
    assert content.locator("figure pre").count()>0,f"Missing executable source: {aid}"
   page.set_viewport_size({"width":390,"height":844})
   assert not page.evaluate("document.documentElement.scrollWidth > innerWidth + 2"),"390px Independent Build horizontal overflow: "+aid
   if index in (0,2,4,6,8,9,10,14):
    page.screenshot(path=str(ART/f"independent-build-{index+1}-390.png"),full_page=True)
   page.set_viewport_size({"width":1440,"height":900})
   print("PASS original Independent Build reading and mobile:",aid,flush=True)
  for aid in [stage+"-practice" for stage in build_stage_ids]+[stage+"-check" for stage in build_stage_ids]+list(build_original_labs):
   page.goto(BASE+"/?"+urlencode({
     "view":"curriculum","school":"professional-engineer",
     "path":"capstone-independent-build","activity":aid}),wait_until="networkidle")
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   assert page.evaluate("new URLSearchParams(location.search).get('activity')")==aid,aid
   assert page.locator("main").last.is_visible(),aid
  page.reload(wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==build_original_labs[-1]
  print("PASS full Independent Build module: 15 source readings, 6 copyable examples, 3 gates and both original labs",flush=True)
  # Ensure active historical IDs plus new IDs persist; older generated
  # wrappers are not accepted as learner completion.
  stored=page.evaluate("""async () => {
    const db=await new Promise((resolve,reject)=>{
      const q=indexedDB.open("tsa-academy",5);
      q.onsuccess=()=>resolve(q.result);
      q.onerror=()=>reject(q.error);
    });
    try {
      const q=db.transaction("path-progress","readonly")
        .objectStore("path-progress").get("capstone-independent-build");
      return await new Promise((resolve,reject)=>{
        q.onsuccess=()=>resolve(q.result?.completedActivityIds ?? []);
        q.onerror=()=>reject(q.error);
      });
    }finally{db.close();}
  }""")
  assert all(aid in stored for aid in build_completed),"Original or stage Independent Build IDs lost on reload"
  print("PASS Independent Build 38/38 synthetic author-ID persistence (not mastery)",flush=True)
  assert not errors,"Browser console errors: "+str(errors)
  browser.close()
if __name__=="__main__":run()
