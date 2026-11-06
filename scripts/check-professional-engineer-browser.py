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
def run():
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True)
  page=browser.new_page(viewport={"width":1440,"height":900})
  errors=[]
  page.on("pageerror",lambda error:errors.append(str(error)))
  for index,(expected,headline) in enumerate(READINGS):
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
   assert page.evaluate("new URLSearchParams(location.search).get('activity')")==expected.removesuffix("-reading")+"-practice"
   page.reload(wait_until="networkidle")
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   assert page.evaluate("new URLSearchParams(location.search).get('activity')")==expected.removesuffix("-reading")+"-practice"
   print("PASS Professional rendered source, mobile, next-at-top and reload:",expected,flush=True)
  assert not errors,"Browser console errors: "+str(errors)
  browser.close()
if __name__=="__main__":run()
