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
 # Wait for the real app to create IndexedDB's stores. Opening db v5 from
 # this test BEFORE the app initializes creates an empty v5 DB without
 # path-progress (the fixture must never create/migrate the schema itself).
 page.get_by_role("button",name=re.compile(r"^(Start|Continue|Review) module$")).first.wait_for(
     state="visible",timeout=30000)
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
  page.get_by_role("button",name=re.compile(r"^(Start|Continue|Review) module$")).first.wait_for(
      state="visible",timeout=30000)
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
  # Newly expanded FIRST ORIGINAL Capstone Problem Discovery reading.
  # Seed only the existing evidence-provenance prerequisite in an isolated
  # browser profile; this is navigation coverage, not learner validation.
  from urllib.parse import urlencode
  seed_completed_path(page,"capstone-problem-discovery",[
    "capstone-problem-discovery-evidence-provenance-reading",
    "capstone-problem-discovery-evidence-provenance-practice",
    "capstone-problem-discovery-evidence-provenance-check",
  ])
  choice_id="capstone-problem-discovery-choosing-a-substantial-problem-001"
  page.goto(BASE+"/?"+urlencode({
    "view":"curriculum","school":"professional-engineer",
    "path":"capstone-problem-discovery","activity":choice_id
  }),wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==choice_id
  choice_main=page.locator("main").last
  choice_text=choice_main.inner_text()
  assert len(choice_text)>=3800,"Problem choice remains a thin original reading"
  for requirement in (
    "A problem is not a feature request",
    "Evidence has a type, source and permission boundary",
    "Compare two imperfect candidates, not two technologies",
    "Break the rule before trusting it",
    "DISCOVERY_SELECTION_GATES_PASS",
  ):
   assert requirement in choice_text,"Missing original-choice teaching: "+requirement
  assert choice_main.get_by_role("button",name="Copy").count()>0,"Discovery Python is not copyable"
  assert choice_main.locator("figure pre").count()>0,"Discovery Python block was not rendered"
  page.set_viewport_size({"width":390,"height":844})
  assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),"Discovery choice 390px overflow"
  page.screenshot(path=str(ART/"discovery-problem-choice-390.png"),full_page=True)
  page.set_viewport_size({"width":1440,"height":900})
  choice_practice="capstone-problem-discovery-choosing-a-substantial-problem-practice"
  # Use the real lesson's Next action to advance through the gating flow;
  # direct-linking to an unstarted practical can legitimately be redirected.
  page.get_by_role("button",name=re.compile(r"^(Next|Next lesson|Complete path)$")).click()
  # The change is asynchronous; a hidden Loading label is not a navigation
  # oracle. Require the actual target URL, rather than checking too early.
  page.wait_for_function("""expected => (
    new URLSearchParams(location.search).get("activity") === expected
  )""",arg=choice_practice,timeout=15000)
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  actual_choice=page.evaluate("new URLSearchParams(location.search).get('activity')")
  assert actual_choice==choice_practice,(
    f"Original first-reading Next did not open its paired practice: {actual_choice}"
  )
  assert "promised stakeholder access" in page.locator("main").last.inner_text(),(
    "Original problem-choice practice must challenge false access claims"
  )
  page.reload(wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==choice_practice
  print("PASS original discovery problem-choice reading/practice, copyable code, 390px and reload",flush=True)
  # Stakeholder Discovery: original reading, two focused prerequisites and
  # original practical all travel through the REAL Next action. Synthetic seed
  # only allows navigation to this not-yet-studied topic; not learner evidence.
  seed_completed_path(page,"capstone-problem-discovery",[
    "capstone-problem-discovery-evidence-provenance-reading",
    "capstone-problem-discovery-evidence-provenance-practice",
    "capstone-problem-discovery-evidence-provenance-check",
    "capstone-problem-discovery-choosing-a-substantial-problem-001",
    "capstone-problem-discovery-choosing-a-substantial-problem-practice",
  ])
  stakeholder_steps=(
    ("capstone-problem-discovery-stakeholder-discovery-001",
     ("Who counts as a stakeholder", "Sampling, access and ethical authority", "STAKEHOLDER_COVERAGE_BIAS_GATE_PASS")),
    ("capstone-problem-discovery-stakeholder-discovery-interview-method-reading",
     ("Separate a research question", "Compare a leading exchange", "Make notes auditable")),
    ("capstone-problem-discovery-stakeholder-discovery-triangulation-reading",
     ("What triangulation does", "Trace a disagreement", "Move from stakeholder claims")),
  )
  page.goto(BASE+"/?"+urlencode({
    "view":"curriculum","school":"professional-engineer",
    "path":"capstone-problem-discovery","activity":stakeholder_steps[0][0]
  }),wait_until="networkidle")
  for index,(activity,requirements) in enumerate(stakeholder_steps):
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   actual=page.evaluate("new URLSearchParams(location.search).get('activity')")
   assert actual==activity,f"Wrong stakeholder order: {actual} != {activity}"
   section=page.locator("main").last
   displayed=section.inner_text()
   assert len(displayed)>=2500,f"Stakeholder reading remains thin: {activity}, {len(displayed)}"
   for requirement in requirements:
    assert requirement in displayed,f"Missing stakeholder teaching {activity}: {requirement}"
   if index==0:
    assert section.get_by_role("button",name="Copy").count()>0,"Stakeholder Python not copyable"
    assert section.locator("figure pre").count()>0,"Stakeholder Python source not rendered"
   page.set_viewport_size({"width":390,"height":844})
   assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),(
    "Stakeholder mobile overflow: "+activity
   )
   page.screenshot(path=str(ART/f"discovery-stakeholder-{index+1}-390.png"),full_page=True)
   page.set_viewport_size({"width":1440,"height":900})
   page.get_by_role("button",name=re.compile(r"^(Next|Next lesson|Complete path)$")).click()
   expected_next=(stakeholder_steps[index+1][0] if index+1<len(stakeholder_steps)
                  else "capstone-problem-discovery-stakeholder-discovery-practice")
   page.wait_for_function("""expected => (
     new URLSearchParams(location.search).get("activity") === expected
   )""",arg=expected_next,timeout=15000)
  final_stakeholder_practice="capstone-problem-discovery-stakeholder-discovery-practice"
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  actual=page.evaluate("new URLSearchParams(location.search).get('activity')")
  assert actual==final_stakeholder_practice,(
   f"Original Stakeholder practice did not follow focused readings: {actual}"
  )
  practice_text=page.locator("main").last.inner_text()
  for requirement in ("stakeholder-by-workflow handoff matrix",
                      "deliberately leading question rewritten neutrally",
                      "opposing stakeholder accounts",
                      "UNKNOWN/NOT_TESTED"):
   assert requirement in practice_text,"Original stakeholder practice missing "+requirement
  page.reload(wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==final_stakeholder_practice
  print("PASS original stakeholder reading -> separate interview and triangulation -> original practice; 390px, code, reload",flush=True)
  # Problem Framing: original authored reading -> measured cohort -> causal
  # boundary -> preserved practice, through the actual Next action. This
  # synthetic prerequisite seeding is navigation, NOT learner competence.
  seed_completed_path(page,"capstone-problem-discovery",[
    "capstone-problem-discovery-evidence-provenance-reading",
    "capstone-problem-discovery-evidence-provenance-practice",
    "capstone-problem-discovery-evidence-provenance-check",
    "capstone-problem-discovery-choosing-a-substantial-problem-001",
    "capstone-problem-discovery-choosing-a-substantial-problem-practice",
    "capstone-problem-discovery-stakeholder-discovery-001",
    "capstone-problem-discovery-stakeholder-discovery-interview-method-reading",
    "capstone-problem-discovery-stakeholder-discovery-triangulation-reading",
    "capstone-problem-discovery-stakeholder-discovery-practice",
  ])
  framing_steps=(
    ("capstone-problem-discovery-problem-framing-001",
     ("Define the unit of work and its observable states",
      "Distinguish symptoms, mechanisms and hypotheses",
      "Map evidence, permissions and unknown states")),
    ("capstone-problem-discovery-problem-framing-measurement-reading",
     ("Count a lifecycle cohort before summarizing durations",
      "COHORT complete=6/9 unverified=3/9",
      "Break the measurement without changing the expected answer")),
    ("capstone-problem-discovery-problem-framing-causality-boundary-reading",
     ("Use competing causes, not a vote among stakeholders",
      "Translate symptoms into a bounded, solution-neutral statement",
      "Identify who can actually change the system")),
  )
  page.goto(BASE+"/?"+urlencode({
    "view":"curriculum","school":"professional-engineer",
    "path":"capstone-problem-discovery","activity":framing_steps[0][0]
  }),wait_until="networkidle")
  for index,(activity,requirements) in enumerate(framing_steps):
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   actual=page.evaluate("new URLSearchParams(location.search).get('activity')")
   assert actual==activity,f"Original framing order changed: {actual} != {activity}"
   main=page.locator("main").last
   visible=main.inner_text()
   assert len(visible)>=2750,f"Shallow Problem Framing reading {activity}: {len(visible)}"
   for phrase in requirements:
    assert phrase in visible,f"Problem Framing teaching missing {activity}: {phrase}"
   if index==1:
    assert main.get_by_role("button",name="Copy").count()>0,"Timeline Python not copyable"
    assert main.locator("figure pre").count()>0,"Timeline Python not visible in code block"
   page.set_viewport_size({"width":390,"height":844})
   assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),(
     "Problem Framing mobile overflow: "+activity
   )
   page.screenshot(path=str(ART/f"discovery-framing-{index+1}-390.png"),full_page=True)
   page.set_viewport_size({"width":1440,"height":900})
   page.get_by_role("button",name=re.compile(r"^(Next|Next lesson|Complete path)$")).click()
   expected_next=(framing_steps[index+1][0] if index+1<len(framing_steps)
                  else "capstone-problem-discovery-problem-framing-practice")
   page.wait_for_function("""expected => (
      new URLSearchParams(location.search).get("activity") === expected
   )""",arg=expected_next,timeout=15000)
  framing_practice="capstone-problem-discovery-problem-framing-practice"
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==framing_practice
  practice_text=page.locator("main").last.inner_text()
  for phrase in ("nine-case timeline experiment","four correct assertion failures",
                 "missing-data/authorized-evidence plan","two competing causal hypotheses"):
   assert phrase in practice_text,"Original Problem Framing practical missing "+phrase
  page.reload(wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==framing_practice
  print("PASS original Problem Framing reading -> measurement -> causal boundary -> original practice; 390px, Python copy and reentry",flush=True)
  # Requirements: original authored reading -> exact acceptance/oracles ->
  # traceability/change control -> original practice. Synthetic prerequisites
  # only test navigation, never real approval or learner performance.
  seed_completed_path(page,"capstone-problem-discovery",[
    "capstone-problem-discovery-evidence-provenance-reading",
    "capstone-problem-discovery-evidence-provenance-practice",
    "capstone-problem-discovery-evidence-provenance-check",
    "capstone-problem-discovery-choosing-a-substantial-problem-001",
    "capstone-problem-discovery-choosing-a-substantial-problem-practice",
    "capstone-problem-discovery-stakeholder-discovery-001",
    "capstone-problem-discovery-stakeholder-discovery-interview-method-reading",
    "capstone-problem-discovery-stakeholder-discovery-triangulation-reading",
    "capstone-problem-discovery-stakeholder-discovery-practice",
    "capstone-problem-discovery-problem-framing-001",
    "capstone-problem-discovery-problem-framing-measurement-reading",
    "capstone-problem-discovery-problem-framing-causality-boundary-reading",
    "capstone-problem-discovery-problem-framing-practice",
  ])
  requirements_steps=(
    ("capstone-problem-discovery-requirements-001",
     ("What a requirement is, and why a stakeholder request is not one",
      "Separate business goals, capabilities, domain rules and quality constraints",
      "Make provenance, consent and decision authority explicit")),
    ("capstone-problem-discovery-requirements-acceptance-reading",
     ("Give an acceptance test a situation, action and independently checked result",
      "Execute the learner-visible requirement review and denial oracle",
      "REQUIREMENTS_EVIDENCE_ORACLE_PASS")),
    ("capstone-problem-discovery-requirements-traceability-reading",
     ("Trace upstream harm to downstream observable evidence",
      "Resolve conflicts without silently choosing the loudest sponsor",
      "When evidence changes, re-evaluate the chain")),
  )
  page.goto(BASE+"/?"+urlencode({
    "view":"curriculum","school":"professional-engineer",
    "path":"capstone-problem-discovery","activity":requirements_steps[0][0]
  }),wait_until="networkidle")
  for index,(activity,requirements) in enumerate(requirements_steps):
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   actual=page.evaluate("new URLSearchParams(location.search).get('activity')")
   assert actual==activity,f"Wrong Requirements reading order: {actual} != {activity}"
   main=page.locator("main").last
   visible=main.inner_text()
   assert len(visible)>=3500,f"Requirements reading lacks actual depth {activity}: {len(visible)}"
   for phrase in requirements:
    assert phrase in visible,f"Requirements teaching missing {activity}: {phrase}"
   if index==1:
    assert main.get_by_role("button",name="Copy").count()>0,"Requirements Python is not copyable"
    assert main.locator("figure pre").count()>0,"Requirements published Python not rendered"
   page.set_viewport_size({"width":390,"height":844})
   assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),(
    "Requirements 390px overflow "+activity
   )
   page.screenshot(path=str(ART/f"discovery-requirements-{index+1}-390.png"),full_page=True)
   page.set_viewport_size({"width":1440,"height":900})
   page.get_by_role("button",name=re.compile(r"^(Next|Next lesson|Complete path)$")).click()
   expected_next=(requirements_steps[index+1][0] if index+1<len(requirements_steps)
                  else "capstone-problem-discovery-requirements-practice")
   page.wait_for_function("""expected => (
     new URLSearchParams(location.search).get("activity") === expected
   )""",arg=expected_next,timeout=15000)
  original_requirements_practice="capstone-problem-discovery-requirements-practice"
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==original_requirements_practice
  practice_text=page.locator("main").last.inner_text()
  for phrase in ("six-row requirements ledger","five unsafe mutations",
                 "Given–When–Then acceptance","unproven requirements"):
   assert phrase in practice_text,"Original Requirements practice missing "+phrase
  page.reload(wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==original_requirements_practice
  print("PASS original Requirements -> acceptance -> traceability -> original practice; 390px, copyable source, actual Next and reload",flush=True)
  # Constraints: preserve original 001 and practice while navigating two
  # genuinely independent authored readings. Synthetic prerequisites test
  # progress transitions only; they do not validate actual learner mastery.
  seed_completed_path(page,"capstone-problem-discovery",[
    "capstone-problem-discovery-evidence-provenance-reading",
    "capstone-problem-discovery-evidence-provenance-practice",
    "capstone-problem-discovery-evidence-provenance-check",
    "capstone-problem-discovery-choosing-a-substantial-problem-001",
    "capstone-problem-discovery-choosing-a-substantial-problem-practice",
    "capstone-problem-discovery-stakeholder-discovery-001",
    "capstone-problem-discovery-stakeholder-discovery-interview-method-reading",
    "capstone-problem-discovery-stakeholder-discovery-triangulation-reading",
    "capstone-problem-discovery-stakeholder-discovery-practice",
    "capstone-problem-discovery-problem-framing-001",
    "capstone-problem-discovery-problem-framing-measurement-reading",
    "capstone-problem-discovery-problem-framing-causality-boundary-reading",
    "capstone-problem-discovery-problem-framing-practice",
    "capstone-problem-discovery-requirements-001",
    "capstone-problem-discovery-requirements-acceptance-reading",
    "capstone-problem-discovery-requirements-traceability-reading",
    "capstone-problem-discovery-requirements-practice",
  ])
  constraint_steps=(
    ("capstone-problem-discovery-constraints-001",
     ("Constraint, need, assumption and decision are different objects",
      "Where constraints come from, and who can verify them",
      "Worked constraints register for a fictional handoff")),
    ("capstone-problem-discovery-constraints-feasibility-reading",
     ("Verify evidence, authority and applicability before enforcing a constraint",
      "Execute the exact classification and candidate-elimination code",
      "CONSTRAINT_SOURCE_AND_FEASIBILITY_PASS")),
    ("capstone-problem-discovery-constraints-conflict-revision-reading",
     ("A set of individually valid constraints can be jointly impossible",
      "Make budgets, timelines and staffing testable assumptions",
      "Revise decisions when a constraint changes or expires")),
  )
  page.goto(BASE+"/?"+urlencode({
    "view":"curriculum","school":"professional-engineer",
    "path":"capstone-problem-discovery","activity":constraint_steps[0][0]
  }),wait_until="networkidle")
  for index,(activity,requirements) in enumerate(constraint_steps):
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   actual=page.evaluate("new URLSearchParams(location.search).get('activity')")
   assert actual==activity,f"Constraint order or prerequisite is wrong: {actual} != {activity}"
   main=page.locator("main").last
   rendered=main.inner_text()
   assert len(rendered)>=3500,f"Original Constraints teaching remains thin: {activity} {len(rendered)}"
   for phrase in requirements:
    assert phrase in rendered,f"Missing subject-specific Constraints teaching {activity}: {phrase}"
   if index==1:
    assert main.get_by_role("button",name="Copy").count()>0,"Constraints exact Python not copyable"
    assert main.locator("figure pre").count()>0,"Constraints code was not rendered"
   page.set_viewport_size({"width":390,"height":844})
   assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),(
     "Constraints teaching has 390px overflow "+activity
   )
   page.screenshot(path=str(ART/f"discovery-constraints-{index+1}-390.png"),full_page=True)
   page.set_viewport_size({"width":1440,"height":900})
   page.get_by_role("button",name=re.compile(r"^(Next|Next lesson|Complete path)$")).click()
   expected=(constraint_steps[index+1][0] if index+1<len(constraint_steps)
             else "capstone-problem-discovery-constraints-practice")
   page.wait_for_function("""expected => (
     new URLSearchParams(location.search).get("activity") === expected
   )""",arg=expected,timeout=15000)
  original_constraints_practice="capstone-problem-discovery-constraints-practice"
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==original_constraints_practice
  practice_text=page.locator("main").last.inner_text()
  for phrase in ("eight-row constraints register",
                 "break eight distinct evidence or feasibility gates",
                 "revoke a previously claimed data-use permission","halve available operations capacity"):
   assert phrase in practice_text,"Original Constraints practical missing "+phrase
  page.reload(wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==original_constraints_practice
  print("PASS original Constraints -> feasibility -> conflict/revision -> original practical; 390px, copyable code, Next and reload",flush=True)
  # Working with Ambiguity: original evidence-classification reading, separate
  # exact-source sensitivity/EVPI reading, authorized experiment/reversal, then
  # the original paired practice. Synthetic prerequisites are navigation-only.
  seed_completed_path(page,"capstone-problem-discovery",[
    "capstone-problem-discovery-evidence-provenance-reading",
    "capstone-problem-discovery-evidence-provenance-practice",
    "capstone-problem-discovery-evidence-provenance-check",
    "capstone-problem-discovery-choosing-a-substantial-problem-001",
    "capstone-problem-discovery-choosing-a-substantial-problem-practice",
    "capstone-problem-discovery-stakeholder-discovery-001",
    "capstone-problem-discovery-stakeholder-discovery-interview-method-reading",
    "capstone-problem-discovery-stakeholder-discovery-triangulation-reading",
    "capstone-problem-discovery-stakeholder-discovery-practice",
    "capstone-problem-discovery-problem-framing-001",
    "capstone-problem-discovery-problem-framing-measurement-reading",
    "capstone-problem-discovery-problem-framing-causality-boundary-reading",
    "capstone-problem-discovery-problem-framing-practice",
    "capstone-problem-discovery-requirements-001",
    "capstone-problem-discovery-requirements-acceptance-reading",
    "capstone-problem-discovery-requirements-traceability-reading",
    "capstone-problem-discovery-requirements-practice",
    "capstone-problem-discovery-constraints-001",
    "capstone-problem-discovery-constraints-feasibility-reading",
    "capstone-problem-discovery-constraints-conflict-revision-reading",
    "capstone-problem-discovery-constraints-practice",
  ])
  ambiguity_steps=(
    ("capstone-problem-discovery-working-with-ambiguity-001",
     ("Uncertainty, ambiguity and disagreement are not interchangeable",
      "Build a register that supports decisions, not a list of vague concerns",
      "Recognize five ways teams fake clarity")),
    ("capstone-problem-discovery-working-with-ambiguity-sensitivity-reading",
     ("Keep actions, outcomes and belief assumptions separate",
      "Perfect-information value is a ceiling, not a forecast",
      "AMBIGUITY_REVERSIBLE_DECISION_PROOF_PASS")),
    ("capstone-problem-discovery-working-with-ambiguity-experiment-design-reading",
     ("Choose one discriminating question, not a demonstration",
      "Design a bounded experiment with a stop rule",
      "Preserve options while protecting irreversible boundaries")),
  )
  page.goto(BASE+"/?"+urlencode({
    "view":"curriculum","school":"professional-engineer",
    "path":"capstone-problem-discovery","activity":ambiguity_steps[0][0]
  }),wait_until="networkidle")
  for index,(activity,requirements) in enumerate(ambiguity_steps):
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   actual=page.evaluate("new URLSearchParams(location.search).get('activity')")
   assert actual==activity,f"Original ambiguity order/gating mismatch: {actual} != {activity}"
   main=page.locator("main").last
   rendered=main.inner_text()
   assert len(rendered)>=3500,f"Working with Ambiguity reading remains thin: {activity}, {len(rendered)}"
   for phrase in requirements:
    assert phrase in rendered,f"Missing specific ambiguity teaching {activity}: {phrase}"
   if index==1:
    assert main.get_by_role("button",name="Copy").count()>0,"Exact ambiguity Python not copyable"
    assert main.locator("figure pre").count()>0,"Ambiguity Python source not rendered"
   page.set_viewport_size({"width":390,"height":844})
   assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),(
     "Ambiguity 390px horizontal overflow "+activity
   )
   page.screenshot(path=str(ART/f"discovery-ambiguity-{index+1}-390.png"),full_page=True)
   page.set_viewport_size({"width":1440,"height":900})
   page.get_by_role("button",name=re.compile(r"^(Next|Next lesson|Complete path)$")).click()
   expected=(ambiguity_steps[index+1][0] if index+1<len(ambiguity_steps)
             else "capstone-problem-discovery-working-with-ambiguity-practice")
   page.wait_for_function("""expected => (
     new URLSearchParams(location.search).get("activity") === expected
   )""",arg=expected,timeout=15000)
  original_ambiguity_practice="capstone-problem-discovery-working-with-ambiguity-practice"
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==original_ambiguity_practice
  practice_text=page.locator("main").last.inner_text()
  for phrase in ("six-entry uncertainty register",
                 "reject eight incorrect implementations",
                 "permission-aware experiment charter",
                 "probability","NO_AUTHORIZATION_TO_ACT"):
   assert phrase in practice_text,"Original Ambiguity practical missing "+phrase
  page.reload(wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==original_ambiguity_practice
  print("PASS original Ambiguity -> sensitivity/EVPI -> ethical experiment -> original practice; 390px, source copy, Next and reload",flush=True)
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
  page.get_by_role("button",name=re.compile(r"^(Start|Continue|Review) module$")).first.wait_for(
      state="visible",timeout=30000)
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
  # Module 5: the original twelve single-reading topics now teach and verify
  # operational evidence; a distinct accessibility prerequisite is inserted.
  # All 13 readings are rendered at 390px, and all staged IDs remain navigable.
  readiness_topics=(
    "deployment-readiness","observability","security-assessment",
    "accessibility-and-human-workflow-readiness","performance-evidence",
    "reliability-and-failure-testing","backup-and-recovery","runbooks",
    "operational-ownership","risk-and-control-evidence",
    "dependency-and-supply-chain-readiness","cost-and-capacity-review",
    "release-decision"
  )
  readiness_stage_ids=(
    "capstone-production-readiness-stage-release-observation-and-human-use",
    "capstone-production-readiness-stage-fault-restore-and-operational-ownership",
    "capstone-production-readiness-stage-risk-dependency-cost-and-release-authority"
  )
  readiness_final="capstone-production-readiness-lab-run-the-capstone-production-readiness-review-001"
  readiness_completed=[
    f"capstone-production-readiness-{topic}-{suffix}"
    for topic in readiness_topics for suffix in ("001","practice")
  ]
  for stage in readiness_stage_ids:
   readiness_completed.extend((stage+"-practice",stage+"-check"))
  readiness_completed.append(readiness_final)
  assert len(readiness_completed)==33
  seed_completed_path(page,"capstone-production-readiness",readiness_completed)
  readiness_code_topics={
    "deployment-readiness","observability","performance-evidence",
    "backup-and-recovery","risk-and-control-evidence",
    "dependency-and-supply-chain-readiness","cost-and-capacity-review"
  }
  for index,topic in enumerate(readiness_topics):
   aid=f"capstone-production-readiness-{topic}-001"
   page.goto(BASE+"/?"+urlencode({
     "view":"curriculum","school":"professional-engineer",
     "path":"capstone-production-readiness","activity":aid
   }),wait_until="networkidle")
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   current=page.evaluate("new URLSearchParams(location.search).get('activity')")
   assert current==aid,f"Original readiness ID not navigable: {aid} => {current}"
   main=page.locator("main").last
   body=main.inner_text()
   assert len(body)>=1750,f"Original readiness reading still thin: {aid}: {len(body)}"
   assert "The actual readiness claim and its evidence boundary" in body,aid
   assert "Independent transfer and negative-case review" in body,aid
   if topic in readiness_code_topics:
    assert main.get_by_role("button",name="Copy").count()>0,"Noncopyable exact source "+aid
    assert main.locator("figure pre").count()>0,"No visible code block "+aid
   page.set_viewport_size({"width":390,"height":844})
   assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),"390px readiness overflow: "+aid
   if index in (0,1,3,4,6,9,12):
    page.screenshot(path=str(ART/f"readiness-{index+1}-390.png"),full_page=True)
   page.set_viewport_size({"width":1440,"height":900})
   print("PASS original readiness reading + mobile:",aid,flush=True)
  for aid in [stage+"-practice" for stage in readiness_stage_ids]+[stage+"-check" for stage in readiness_stage_ids]+[readiness_final]:
   page.goto(BASE+"/?"+urlencode({
      "view":"curriculum","school":"professional-engineer",
      "path":"capstone-production-readiness","activity":aid
   }),wait_until="networkidle")
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   assert page.evaluate("new URLSearchParams(location.search).get('activity')")==aid,aid
   assert page.locator("main").last.is_visible(),aid
  page.reload(wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==readiness_final
  found=page.evaluate("""async () => {
    const db=await new Promise((resolve,reject)=>{
      const q=indexedDB.open("tsa-academy",5);
      q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);
    });
    try{
      const req=db.transaction("path-progress","readonly")
            .objectStore("path-progress").get("capstone-production-readiness");
      return await new Promise((resolve,reject)=>{
        req.onsuccess=()=>resolve(req.result?.completedActivityIds ?? []);
        req.onerror=()=>reject(req.error);
      });
    } finally {db.close();}
  }""")
  assert all(activity in found for activity in readiness_completed),"Readiness authored activity IDs not persisted"
  print("PASS Production Readiness 13 source readings / 7 original copyable code proofs / 3 integrated stages / 33 stable IDs",flush=True)
  # Module 6: all 3 original IDs remain and four new prerequisite concepts
  # are independently navigable. Isolated synthetic completion tests only URL,
  # rendering and persistence, NEVER actual authorship or peer competence.
  portfolio_topics=(
    "evidence-portfolio","portfolio-claim-calibration","reflective-practice",
    "engineering-decision-postmortems","responsible-evidence-disclosure",
    "independent-peer-review","professional-development",
  )
  portfolio_stage_ids=(
    "professional-portfolio-stage-claim-evidence-authentication",
    "professional-portfolio-stage-causal-review-and-responsible-publication",
  )
  portfolio_final="professional-portfolio-lab-independent-evidence-handoff-001"
  portfolio_completed=[
    f"professional-portfolio-{topic}-{suffix}"
    for topic in portfolio_topics for suffix in ("reading","practice")
  ]
  for stage in portfolio_stage_ids:
   portfolio_completed.extend((stage+"-practice",stage+"-check"))
  portfolio_completed.append(portfolio_final)
  assert len(portfolio_completed)==19
  seed_completed_path(page,"professional-portfolio-reflection",portfolio_completed)
  portfolio_code_topics={
    "evidence-portfolio","portfolio-claim-calibration",
    "engineering-decision-postmortems",
    "responsible-evidence-disclosure","professional-development"
  }
  for index,topic in enumerate(portfolio_topics):
   aid=f"professional-portfolio-{topic}-reading"
   page.goto(BASE+"/?"+urlencode({
    "view":"curriculum","school":"professional-engineer",
    "path":"professional-portfolio-reflection","activity":aid
   }),wait_until="networkidle")
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   current=page.evaluate("new URLSearchParams(location.search).get('activity')")
   assert current==aid,f"Portfolio ID not navigable: {aid} => {current}"
   main=page.locator("main").last
   content=main.inner_text()
   assert len(content)>=1900,f"Thin original/new portfolio reading {aid}: {len(content)} chars"
   assert "Mechanism, scope and a counterexample" in content,aid
   assert "Transfer beyond the rehearsed solution" in content,aid
   if topic in portfolio_code_topics:
    assert main.get_by_role("button",name="Copy").count()>0,f"Original source not copyable: {aid}"
    assert main.locator("figure pre").count()>0,f"Original source code not rendered: {aid}"
   page.set_viewport_size({"width":390,"height":844})
   assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),"390px Portfolio overflow: "+aid
   if index in (0,1,3,4,5,6):
    page.screenshot(path=str(ART/f"portfolio-{index+1}-390.png"),full_page=True)
   page.set_viewport_size({"width":1440,"height":900})
   print("PASS original/new portfolio reading + mobile:",aid,flush=True)
  for aid in [stage+"-practice" for stage in portfolio_stage_ids]+[stage+"-check" for stage in portfolio_stage_ids]+[portfolio_final]:
   page.goto(BASE+"/?"+urlencode({
    "view":"curriculum","school":"professional-engineer",
    "path":"professional-portfolio-reflection","activity":aid
   }),wait_until="networkidle")
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   assert page.evaluate("new URLSearchParams(location.search).get('activity')")==aid,aid
   assert page.locator("main").last.is_visible(),aid
  page.reload(wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==portfolio_final
  stored_portfolio=page.evaluate("""async () => {
    const db=await new Promise((resolve,reject)=>{
      const req=indexedDB.open("tsa-academy",5);
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
    try {
      const req=db.transaction("path-progress","readonly")
        .objectStore("path-progress").get("professional-portfolio-reflection");
      return await new Promise((resolve,reject)=>{
        req.onsuccess=()=>resolve(req.result?.completedActivityIds ?? []);
        req.onerror=()=>reject(req.error);
      });
    } finally {db.close();}
  }""")
  assert all(activity in stored_portfolio for activity in portfolio_completed),"Portfolio progress IDs lost on reload"
  print("PASS Professional Portfolio 7 concept readings / 5 copyable scripts / 2 stage gates / final handoff / 19 synthetic progress IDs",flush=True)
  # Final Professional Engineer module: preserve all twelve original reading
  # IDs, add independent practical/response activities and retain final lab.
  # Progress is synthetic and NEVER constitutes a real oral defence.
  defence_topics=(
    "present-the-problem-and-outcomes","present-the-architecture",
    "explain-trade-offs","present-engineering-evidence",
    "defend-quality-decisions","defend-security-decisions",
    "defend-reliability-decisions","defend-governance-decisions",
    "respond-to-challenges","state-limitations","propose-future-evolution",
    "reflect-on-the-tsa-journey",
  )
  defence_stage_ids=(
    "capstone-defence-stage-problem-architecture-and-evidence",
    "capstone-defence-stage-quality-security-reliability-and-governance",
    "capstone-defence-stage-limitations-surprise-and-independent-transfer",
  )
  defence_final="capstone-defence-professional-engineering-capstone-and-defence-001"
  defence_completed=[
    f"capstone-defence-{topic}-{suffix}"
    for topic in defence_topics for suffix in ("001","defence-practice")
  ]
  for stage in defence_stage_ids:
   defence_completed.extend((stage+"-practice",stage+"-check"))
  defence_completed.append(defence_final)
  assert len(defence_completed)==31
  seed_completed_path(page,"capstone-defence",defence_completed)
  defence_code_topics={
    "present-the-problem-and-outcomes","present-the-architecture",
    "present-engineering-evidence","defend-quality-decisions",
    "defend-governance-decisions","respond-to-challenges",
  }
  for index,topic in enumerate(defence_topics):
   activity=f"capstone-defence-{topic}-001"
   page.goto(BASE+"/?"+urlencode({
    "view":"curriculum","school":"professional-engineer",
    "path":"capstone-defence","activity":activity
   }),wait_until="networkidle")
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   current=page.evaluate("new URLSearchParams(location.search).get('activity')")
   assert current==activity,f"Original Defence reading ID lost: {activity} => {current}"
   main=page.locator("main").last
   text_content=main.inner_text()
   assert len(text_content)>=1700,f"Shallow Defence reading: {activity} len={len(text_content)}"
   assert "Define the claim and what would disprove it" in text_content,activity
   assert "Unseen-domain and reviewer transfer" in text_content,activity
   if topic in defence_code_topics:
    assert main.get_by_role("button",name="Copy").count()>0,"Noncopyable published code: "+activity
    assert main.locator("figure pre").count()>0,"Published code source not rendered: "+activity
   page.set_viewport_size({"width":390,"height":844})
   assert not page.evaluate("document.documentElement.scrollWidth>innerWidth+2"),"Defence mobile overflow: "+activity
   if index in (0,1,3,4,7,8,11):
    page.screenshot(path=str(ART/f"defence-{index+1}-390.png"),full_page=True)
   page.set_viewport_size({"width":1440,"height":900})
   print("PASS original Defence reading + mobile:",activity,flush=True)
  for activity in [stage+"-practice" for stage in defence_stage_ids]+[stage+"-check" for stage in defence_stage_ids]+[defence_final]:
   page.goto(BASE+"/?"+urlencode({
     "view":"curriculum","school":"professional-engineer",
     "path":"capstone-defence","activity":activity
   }),wait_until="networkidle")
   page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
   assert page.evaluate("new URLSearchParams(location.search).get('activity')")==activity,activity
   assert page.locator("main").last.is_visible(),activity
  page.reload(wait_until="networkidle")
  page.get_by_text("Loading your progress…").wait_for(state="hidden",timeout=30000)
  assert page.evaluate("new URLSearchParams(location.search).get('activity')")==defence_final
  stored_defence=page.evaluate("""async () => {
    const db=await new Promise((resolve,reject)=>{
      const q=indexedDB.open("tsa-academy",5);
      q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);
    });
    try{
      const req=db.transaction("path-progress","readonly")
        .objectStore("path-progress").get("capstone-defence");
      return await new Promise((resolve,reject)=>{
        req.onsuccess=()=>resolve(req.result?.completedActivityIds ?? []);
        req.onerror=()=>reject(req.error);
      });
    }finally{db.close();}
  }""")
  assert all(activity in stored_defence for activity in defence_completed),"Defence original/staged progress was lost on reload"
  print("PASS all 12 original Defence readings, six source examples, 3 staged gates, final original milestone and 31 synthetic IDs",flush=True)
  assert not errors,"Browser console errors: "+str(errors)
  browser.close()
if __name__=="__main__":run()
