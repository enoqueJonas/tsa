"""Check two original Professional Engineer school entrypoints in actual Chromium.
Synthetic browser navigation is not independent learner or real workplace validation.
"""
import re
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
  browser=p.chromium.launch(headless=True)
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
  assert not errors,"Browser console errors: "+str(errors)
  browser.close()
if __name__=="__main__":run()
