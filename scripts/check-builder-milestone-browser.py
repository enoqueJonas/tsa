"""Synthetic Chromium navigation proof for Builder Steward v1 milestone.
This is NOT independent learner acceptance or real Django HTTP evidence."""
from pathlib import Path
from urllib.parse import urlencode
from playwright.sync_api import sync_playwright

BASE="http://127.0.0.1:4173"
PATH_ID="steward-api-v1"
ART=Path("artifacts/steward-v1-milestone-browser")
ART.mkdir(parents=True,exist_ok=True)
READINGS=[
 "steward-api-v1-contract-invariants-reading",
 "steward-api-v1-postgres-constraints-reading",
 "steward-api-v1-http-boundaries-reading",
 "steward-api-v1-handoff-proof-reading"
]
PREP=["contract-invariants","postgres-constraints","http-boundaries","handoff-proof"]
ORIGINAL=["brief","design-review","build","data-evidence","security-evidence","handoff","review"]
def url(activity):
 return BASE+"/?"+urlencode({"view":"curriculum","school":"builder",
                            "path":PATH_ID,"activity":activity})
def seed(page):
 complete=[]
 for suffix in PREP:
  for kind in ("reading","practice","check"):
   complete.append("steward-api-v1-"+suffix+"-"+kind)
 complete+=["steward-api-v1-milestone-"+x for x in ORIGINAL[:-1]]
 complete.append("steward-api-v1-milestone-brief")
 page.goto(BASE+"/?view=curriculum&school=builder",wait_until="networkidle")
 page.evaluate("""async ({pathId, completed}) => {
    const db=await new Promise((resolve,reject)=>{
      const req=indexedDB.open('tsa-academy',5);
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    try{
      const tx=db.transaction('path-progress','readwrite');
      const now=new Date().toISOString();
      tx.objectStore('path-progress').put({
        schemaVersion:5,pathId,currentActivityId:completed[0],
        completedActivityIds:completed,
        reflectionResponses:Object.fromEntries(
          completed.filter(x=>x.endsWith('-check')).map(x=>[x,'SYNTHETIC only'])),
        startedAt:now,updatedAt:now
      });
      await new Promise((resolve,reject)=>{
        tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
        tx.onabort=()=>reject(tx.error);
      });
    }finally{db.close();}
  }""",{"pathId":PATH_ID,"completed":complete})
 page.reload(wait_until="networkidle")
 print("SEEDED synthetic milestone progress, not learner validation",flush=True)
def run():
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True)
  page=browser.new_page(viewport={"width":1440,"height":900})
  seed(page)
  for i,activity in enumerate(READINGS,1):
   page.goto(url(activity),wait_until="networkidle")
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   assert page.evaluate("new URLSearchParams(location.search).get('activity')")==activity, activity
   main=page.locator("main").last
   assert len(main.inner_text().strip())>2000, "Thin reading "+activity
   assert main.get_by_role("button",name="Copy").count()>0,"Missing copyable executable code "+activity
   page.set_viewport_size({"width":390,"height":844})
   assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),"390px overflow "+activity
   assert main.locator("figure pre").count()>0,"Code failed to render "+activity
   if i in (1,3):page.screenshot(path=str(ART/f"milestone-{i}-390.png"),full_page=True)
   page.set_viewport_size({"width":1440,"height":900})
   print("PASS milestone rendered lesson",activity,flush=True)
  activity=READINGS[0]
  page.goto(url(activity),wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  page.evaluate("window.scrollTo(0,document.body.scrollHeight)")
  page.wait_for_function("scrollY>8",timeout=8000)
  page.get_by_role("button",name="Next",exact=False).first.click()
  page.wait_for_function("scrollY<=8",timeout=8000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")=="steward-api-v1-contract-invariants-practice"
  final="steward-api-v1-milestone-review"
  page.goto(url(final),wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==final,"Final preserved ID locked or dropped"
  page.reload(wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==final,"Milestone progress did not persist"
  print("PASS milestone synthetic progress, final deep link, reload, scroll reset",flush=True)
  browser.close()
if __name__=="__main__":run()
