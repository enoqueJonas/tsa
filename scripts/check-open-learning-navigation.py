"""Cross-school, cross-module and deep-lesson access without prior completion.

All browser visits run in an isolated Chrome profile. Navigation does NOT imply
completion, and this regression never claims educational mastery.
"""
import os
import re
from pathlib import Path
from urllib.parse import urlencode
from playwright.sync_api import sync_playwright

BASE="http://127.0.0.1:4173"
ART=Path("artifacts/open-learning-navigation")
ART.mkdir(parents=True,exist_ok=True)


def activity_id(page):
    return page.evaluate("new URLSearchParams(location.search).get('activity')")


def route_field(page, field):
    return page.evaluate("name => new URLSearchParams(location.search).get(name)",field)


def await_reading(page):
    page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
    return page.locator("main").last.inner_text()


def stored_progress(page, path_id):
    return page.evaluate("""async pathId => {
      const db=await new Promise((resolve,reject)=>{
        const request=indexedDB.open('tsa-academy',5);
        request.onsuccess=()=>resolve(request.result);
        request.onerror=()=>reject(request.error);
      });
      try{
        const transaction=db.transaction('path-progress','readonly');
        const request=transaction.objectStore('path-progress').get(pathId);
        return await new Promise((resolve,reject)=>{
          request.onsuccess=()=>resolve(request.result ?? null);
          request.onerror=()=>reject(request.error);
        });
      }finally{db.close();}
    }""",path_id)


def run():
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,**({"channel":"chrome"} if os.getenv("TSA_BROWSER_CHANNEL")=="chrome" else {}))
        page=browser.new_page(viewport={"width":1440,"height":900})
        errors=[]
        page.on("pageerror",lambda error:errors.append(str(error)))
        page.goto(BASE+"/?view=curriculum",wait_until="networkidle")
        page.get_by_role("button",name="Start module").first.wait_for(state="visible",timeout=30000)
        school_count=page.locator("aside nav button").count()
        assert school_count>=10,f"Unexpected school coverage: {school_count}"
        visited=[]
        for index in range(school_count):
            page.goto(BASE+"/?view=curriculum",wait_until="networkidle")
            school_nav=page.locator("aside nav button")
            assert school_nav.count()==school_count,"School navigation changed unexpectedly"
            school_nav.nth(index).click()
            school_id=route_field(page,"school")
            assert school_id,f"School {index} has no URL identifier"
            start_buttons=page.get_by_role("button",name="Start module",exact=True)
            start_buttons.last.wait_for(state="visible",timeout=15000)
            start_buttons.last.click()
            assert route_field(page,"school")==school_id
            module_id=route_field(page,"path")
            assert module_id,f"School {school_id} cannot start an independent module"
            assert await_reading(page).strip(),f"No first activity of last module in {school_id}"
            assert "Locked" not in page.locator("aside").first.inner_text(),(
                f"School {school_id} retains an activity prerequisite lock"
            )
            assert stored_progress(page,module_id) is None,(
                "Simply opening a later module must not invent completion/progress"
            )
            page.get_by_role("button",name=re.compile("Back to journey")).click()
            opening=page.get_by_role("button",name=re.compile(r"^Open lesson "))
            opening.last.wait_for(state="visible",timeout=15000)
            opening.last.click()
            assert route_field(page,"school")==school_id
            assert route_field(page,"path")==module_id,(
                f"Open lesson from {school_id} did not open the last module"
            )
            assert await_reading(page).strip(),"Open lesson failed to render selected lesson"
            assert "Locked" not in page.locator("aside").first.inner_text()
            visited.append(school_id)
        assert len(set(visited))==school_count
        print(f"PASS unrestricted launch for {school_count} schools, their last available module and direct lesson buttons; zero seeded completions",flush=True)

        # A fresh learner can also deep-link to a late PRACTICE in a later
        # module without completing any other path, school or preceding lesson.
        path_id="capstone-problem-discovery"
        practice_id="capstone-problem-discovery-risk-practice"
        page.goto(BASE+"/?"+urlencode({
            "view":"curriculum","school":"professional-engineer",
            "path":path_id,"activity":practice_id
        }),wait_until="networkidle")
        practice_text=await_reading(page)
        assert activity_id(page)==practice_id,"Direct link to Risk practical was redirected to a prerequisite"
        assert "Discovery work: Risk" in practice_text
        assert "Locked" not in page.locator("aside").first.inner_text()
        assert stored_progress(page,path_id) is None,"A deep-link visit must not mark earlier work complete"

        # Marking the chosen practical complete is independent from the
        # preceding readings; the system may not claim the path complete.
        page.get_by_role("button",name=re.compile(r"^(Next|Next lesson)$")).click()
        page.wait_for_function("""before =>
          new URLSearchParams(location.search).get('activity') !== before
        """,arg=practice_id,timeout=15000)
        saved=stored_progress(page,path_id)
        assert saved is not None
        assert saved["completedActivityIds"]==[practice_id],(
            f"Unvisited prerequisites were falsely completed: {saved['completedActivityIds']}"
        )
        assert not saved.get("completedAt"),"Later standalone activity falsely completed whole module"

        # Even the final activity of the module is accessible, but is not
        # mislabeled 'Complete path' until ALL activities are completed.
        sidebar=page.locator("aside").first
        sidebar.locator("button").last.click()
        page.get_by_role("button",name="Mark activity complete").wait_for(state="visible",timeout=15000)
        assert page.get_by_role("button",name="Mark activity complete").count()==1,(
            "Final activity must offer independent completion, not declare the whole path finished"
        )
        assert page.get_by_role("button",name="Path complete").count()==0
        page.set_viewport_size({"width":390,"height":844})
        assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),(
            "Nonsequential learning view overflows a 390px viewport"
        )
        page.screenshot(path=str(ART/"later-module-direct-access-390.png"),full_page=True)
        page.reload(wait_until="networkidle")
        await_reading(page)
        assert page.get_by_role("button",name="Mark activity complete").count()==1
        saved_again=stored_progress(page,path_id)
        assert saved_again["completedActivityIds"]==[practice_id]
        print("PASS later practice direct link, independent completion, final activity semantics, 390px and durable reentry",flush=True)
        assert not errors,"Browser errors while testing open navigation: "+repr(errors)
        browser.close()


if __name__=="__main__":
    run()
