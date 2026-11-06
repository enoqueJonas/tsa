import type { Activity } from "../activities";
import type { Lesson } from "./lesson";
import type { LessonBlock } from "../activities/content";
import { defenceLenses } from "./professional-engineer-defence-teaching";
import { defencePrograms } from "./professional-engineer-defence-proofs";

const pathId = "capstone-defence";
const standard = "Professional Engineer standard: defend decisions with traceable evidence, acknowledge uncertainty without evasion, and show that the judgment developed through TSA transfers to a new system. The defence evaluates reasoning and evidence, not confidence, presentation polish or similarity to Steward.";

function reading(id: string, title: string, body: string, defencePrompts: string[]): Lesson {
  // Deepen the actual authored reading. Original reading IDs must remain
  // stable: no shallow synthetic preparation wrapper for exercises.
  const lens=defenceLenses[id];
  if(!lens)throw new Error("Missing subject-specific Defence teaching: "+id);
  const blocks: LessonBlock[]=[
    {type:"paragraph",text:body},
    {type:"heading",id:"claim-evidence-boundary",text:"Define the claim and what would disprove it",level:2},
    {type:"paragraph",text:"The tool-lending cooperative, Python source examples and any suggested incident or stakeholder evidence here are fictional TEACHING FIXTURES. They are not the learner's independent capstone, original field research, signed reviewer, production environment or evidence of professional mastery. Transfer the reasoning to the ACTUAL second-domain system and preserve unknowns."}
  ];
  for(const [index,section] of lens.sections.entries()){
    blocks.push({type:"heading",id:"defence-mechanism-"+(index+1),text:section.heading,level:2});
    for(const paragraph of section.paragraphs)blocks.push({type:"paragraph",text:paragraph});
  }
  const program=defencePrograms[id];
  if(program){
    blocks.push({type:"heading",id:"executable-counterclaim",text:"Execute the worked proof and reject a misleading decision",level:2});
    blocks.push({type:"code",language:"python",caption:program.caption,code:program.code});
    blocks.push({type:"paragraph",text:program.expected});
  }
  blocks.push({type:"heading",id:"unseen-transfer",text:"Unseen-domain and reviewer transfer",level:2});
  blocks.push({type:"paragraph",text:standard});
  blocks.push({type:"paragraph",text:"From your actual new-domain capstone, cite the discovered need, actual source commit and deployed artifact when applicable, independent contribution, environment, exact command, positive and negative observation, alternate explanation, acknowledged limitation, authorized decision owner and measurable reversal threshold. If the system or independent panel is unavailable, state NOT_TESTED / NOT_INDEPENDENTLY_VALIDATED; a simulated Python model must never be claimed as actual system validation."});
  blocks.push({type:"resources",title:"Targeted technical reference",resources:[lens.resource]});
  return {id:`${pathId}-${id}`,title,activities:[
    {id:`${pathId}-${id}-001`,title,estimatedMinutes:60,
     content:{type:"reading",body:blocks.filter(b=>b.type==="paragraph").map(b=>b.text).join("\n\n"),blocks}},
    {id:`${pathId}-${id}-defence-practice`,title:"Defence challenge: "+title,estimatedMinutes:75,
     content:{
      type:"practical",objective:"Defend "+title+" using the actual independent capstone and a falsifiable observation.",
      scenario:"A skeptical engineer introduces unseen constraints to the genuinely new-domain capstone. Use actual, authorized system evidence; neither Steward nor a fictional fixture is a substitute for original implementation. A correct answer may be that evidence is missing and the proposed release must be deferred.",
      instructions:[
        ...defencePrompts,
        ...lens.practice,
        "Show one ACTUAL independent capstone claim, commit/environment, producing command, expected result, observed result and negative case. If not executed, mark NOT_TESTED and say why.",
        "Introduce an unseen counterargument that would challenge your implementation or evidence scope, and explain a bounded diagnostic or experiment. Keep the wrong explanation visible.",
        "Record the source and identity of any real independent reviewer. Self-questioning is SELF_REVIEW, not a passed panel defence."
      ],
      deliverables:["Claim and actual primary evidence or honest NOT_TESTED status","Observed negative result or explicitly missing failure gate","Strongest competing explanation and reversible test","Responsibility, residual risk and authorized release/decision boundary"],
      completionCriteria:[
        "A reviewer could challenge the precise mechanism rather than only presentation confidence.",
        "A guided/source-only fixture is never used as proof of real user benefit or released operation.",
        "A missing critical negative or restoration test cannot be marked PASS.",
        ...lens.criteria
      ]
     }},
  ]};
}

function milestone(id: string, title: string, objective: string, instructions: string[], deliverables: string[], completionCriteria: string[], estimatedMinutes: number): Lesson {
  return { id: `${pathId}-${id}`, title, activities: [{ id: `${pathId}-${id}-001`, title, estimatedMinutes, content: { type: "practical", objective, scenario: "The independent capstone has passed through discovery, proposal, implementation and a production-readiness decision. You now face a technical review panel acting as engineering, product, security, reliability, operations and governance stakeholders. They may challenge assumptions, request evidence, reject weak claims and introduce plausible changes in constraints. Your task is not to prove the system is perfect; it is to demonstrate transferable professional engineering judgment and make the system, its evidence and its limitations defensible.", instructions, deliverables, completionCriteria } }] };
}

const originalDefenceLessons: Lesson[] = [
  reading("present-the-problem-and-outcomes", "Present the Problem and Outcomes", "Begin with the problem rather than the stack. Explain stakeholders, harmful current state, intended outcomes, constraints, scope and how the implemented system changes something that matters. Separate delivered outcomes from planned outcomes and technical activity from stakeholder value.", ["What evidence shows this problem was worth solving?", "Which intended outcomes are actually demonstrated by the capstone?", "What did you deliberately not solve, and why?"]),
  reading("present-the-architecture", "Present the Architecture", "Explain the implemented architecture as a set of responsibilities, boundaries, data flows and deployment/runtime relationships. Show how it evolved from the proposal and connect important structures to domain and quality-attribute needs. A diagram is a navigation aid; the defence must reach code, configuration and operating evidence.", ["Which boundary carries the most architectural risk and why?", "Where did implementation evidence cause the architecture to change?", "What simpler architecture did you reject or retain?"]),
  reading("explain-trade-offs", "Explain Trade-offs", "Professional decisions optimize among competing objectives under constraints. For consequential choices, state the alternatives, evidence available at the time, benefits purchased, costs introduced, reversibility and conditions that would change the decision. Avoid retroactively presenting every outcome as inevitable.", ["Which decision was closest or most uncertain?", "What did the chosen option make worse?", "What new evidence would cause you to reverse it?"]),
  reading("present-engineering-evidence", "Present Engineering Evidence", "Build a compact evidence map from claims to authoritative artifacts: working behavior, tests, CI/CD, release identity, telemetry, security findings, performance experiments, recovery exercises, decision records and operational reviews. Demonstrate representative evidence live or reproducibly where practical instead of flooding the panel with screenshots.", ["Which important claim has the strongest evidence?", "Which claim still depends on assumption or limited sampling?", "Can another engineer reproduce the evidence without your oral history?"]),
  reading("defend-quality-decisions", "Defend Quality Decisions", "Defend why the quality strategy provides enough confidence for the capstone's actual risks. Explain test levels, automation boundaries, exploratory work, accessibility/inclusion evidence where relevant, defects that changed the system, flaky-test handling and important gaps. Test count, coverage percentage and automated accessibility scores are supporting signals, not substitutes for risk reasoning or human workflow evidence.", ["Which failure would your current tests be most likely to miss?", "Why is a particular risk tested at this level rather than another?", "What quality evidence changed an engineering decision?", "Which user interaction assumption could exclude someone, and what evidence supports the current accessibility conclusion?"]),
  reading("defend-security-decisions", "Defend Security Decisions", "Use the implemented threat model and security evidence to explain trust boundaries, controls, findings, remediation and accepted residual risk. Distinguish secure configuration from demonstrated control behavior and framework defaults from decisions you verified.", ["What is the most credible remaining attack path?", "Which security control has operating evidence rather than configuration evidence only?", "Which residual risk is accepted and by whom?"]),
  reading("defend-reliability-decisions", "Defend Reliability Decisions", "Explain reliability from stakeholder-relevant objectives through telemetry, failure behavior, capacity and recovery evidence. Demonstrate what happens when dependencies fail, load changes or data must be restored. Do not claim resilience that has only been designed but not exercised.", ["Which failure mode was actually exercised and what changed afterward?", "Where are your recovery objectives supported or still provisional?", "What would wake an operator, and why?"]),
  reading("defend-governance-decisions", "Defend Governance Decisions", "Show that ownership, risk, controls, exceptions, change decisions, dependencies and lifecycle choices remain accountable without turning the capstone into bureaucracy. Governance evidence should explain who can decide, what evidence matters and where residual risk is accepted. Dependency governance must also distinguish technical risk acceptance from legal/license obligations that require appropriate organizational authority or replacement of the dependency.", ["Which control or review step could be removed with little loss?", "Where is an exception more appropriate than changing the standard?", "Who owns the system and its critical dependencies after handover?", "Which dependency license or notice obligation materially affects how the release may be used or distributed, and where is that obligation evidenced?"]),
  reading("respond-to-challenges", "Respond to Challenges", "A defence is interactive engineering work. Listen to the challenge, identify whether it disputes evidence, assumptions, objectives or trade-offs, and answer at that level. It is acceptable to say that evidence is insufficient and define how you would obtain it. Do not invent facts to preserve a previous decision.", ["Can you distinguish disagreement from newly discovered evidence?", "What would you do when the panel exposes an unknown you cannot resolve immediately?", "Can you change a recommendation without treating that as failure?"]),
  reading("state-limitations", "State Limitations", "Make limitations first-class engineering information. Classify known defects, unvalidated assumptions, scale boundaries, operational gaps, security/reliability residual risks and intentionally deferred scope. Explain consequence, owner and trigger for reconsideration where material.", ["What is the most consequential thing the system cannot currently guarantee?", "Which limitation is acceptable only because of current scale or context?", "Which limitation should block broader use?"]),
  reading("propose-future-evolution", "Propose Future Evolution", "Propose evolution from evidence rather than technology fashion. Tie improvements to changing outcomes, risks, capacity, operating cost, developer friction or lifecycle pressure. Include credible no-change options and identify signals that would justify investment.", ["What should be improved next, and why before other work?", "What should explicitly not be redesigned yet?", "Which metric, incident or business change would trigger architectural evolution?"]),
  reading("reflect-on-the-tsa-journey", "Reflect on the TSA Journey", "Close the learning loop by identifying how your engineering reasoning changed across the apprenticeship. Use Steward and the independent capstone as contrasting evidence: what principles transferred, what context changed the implementation, what earlier beliefs you revised and what capabilities still require deliberate practice.", ["Which TSA principle transferred most clearly to the new domain?", "Where did copying Steward would have produced a worse result?", "Which part of your judgment is materially different from when you began the journey?"]),
  milestone("professional-engineering-capstone-and-defence", "Milestone: Professional Engineering Capstone and Defence", "Deliver and defend the complete independent capstone as evidence that you can frame, build, operate, evaluate and evolve a production-style system using transferable engineering judgment.", ["Freeze a defence candidate and record its release identity, deployed environment, production-readiness decision, known limitations and evidence snapshot; do not silently improve evidence during the review.", "Prepare a concise narrative from problem and outcomes through domain/architecture, implementation, delivery, quality, security, reliability, operations, governance, cost and evolution. Every major claim must link to authoritative evidence.", "Create an evidence index that distinguishes verified behavior, observations, assumptions, accepted residual risks, unresolved unknowns and decisions outside your authority.", "Demonstrate the running system and representative engineering evidence through reproducible commands, dashboards, tests, pipelines, records or exercises rather than screenshots alone where practical.", "Conduct a panel-style defence. Require challenges to at least architecture/trade-offs, quality, security, reliability/operations and governance/risk. Record questions, answers, evidence used and any claim that could not be supported.", "Introduce at least two realistic challenge scenarios during the defence, such as significant load growth, a critical dependency reaching end of life, a security finding, stricter recovery expectations, cost pressure or a changed business constraint. Re-evaluate decisions rather than mechanically preserving the current architecture.", "For unsupported or weakened claims, classify the consequence and choose remediation, additional evidence, risk acceptance, scope restriction, release-condition change or redesign. Do not manufacture certainty.", "Explain the lifecycle of any TSA internal products reused by the capstone, including why their contracts fit, source/version/provenance evidence and how the capstone behaves if that dependency changes or disappears. Explain justified rejection where reuse did not fit.", "Present a prioritized evolution roadmap tied to evidence, stakeholder value and risk. Include explicit no-change decisions and triggers that would cause reconsideration.", "Finish with a journey retrospective comparing Steward and the capstone: identify principles that transferred, implementations that correctly differed, decisions you would now make differently, and concrete areas for continued professional development."], ["Independent production-style capstone repository and running release", "Capstone defence narrative and architecture/domain views", "Claim-to-evidence index with assumptions, unknowns and residual risks", "Quality, security, reliability, operational, governance and cost evidence portfolio", "Production-readiness and release decision record", "Panel challenge/question log with evidence-backed responses and follow-up decisions", "Challenge-scenario decision records", "Internal dependency reuse/evolve/reject and lifecycle evidence", "Prioritized evolution roadmap with no-change decisions and triggers", "TSA journey retrospective and professional-development gaps"], ["The capstone is demonstrably independent from Steward while showing transfer of engineering principles.", "Major claims are traceable to working, reviewable or reproducible evidence; unsupported claims are explicitly downgraded rather than defended rhetorically.", "The learner can explain alternatives, trade-offs, consequences and reversal triggers for consequential decisions.", "Quality, security and reliability arguments are risk-based and include evidence of real behavior or explicit limitations; relevant accessibility claims are supported by critical-workflow evidence rather than automated scores alone.",
"Material dependency license/notice obligations are traceable to the delivered release, and unresolved incompatibility is escalated rather than rhetorically accepted as ordinary residual engineering risk.", "Operational ownership, recovery, dependencies, controls, residual risks and release decisions are coherent and accountable.", "The learner responds to challenge by reasoning from objectives and evidence, can revise a decision when new evidence warrants it, and escalates decisions beyond their authority.", "Future evolution is prioritized by value, risk and evidence rather than fashionable technology or unnecessary complexity.", "Another engineer can reproduce the system, navigate the evidence and continue its operation/evolution without depending on the learner's memory.", "The final defence proves the journey outcome: the learner can build, model, host, deliver, test, secure, observe, operate, evolve, govern and defend the decisions of a substantial system."], 115),
];

function defenceStage(id:string,title:string,objective:string,instructions:string[],criteria:string[],questions:string[]):Lesson {
  const stableId=pathId+"-"+id;
  return {id:stableId,title,activities:[
    {id:stableId+"-practice",title:"Adversarial proof: "+title,estimatedMinutes:110,
     content:{type:"practical",objective,
      scenario:"Conduct a scoped, source-traceable review of the ACTUAL independent capstone, not Steward. The panel may introduce a challenge without warning; if no real independent panel exists, mark SELF_REVIEW / NOT_INDEPENDENTLY_VALIDATED.",
      instructions,
      deliverables:["Actual commit, environment and claim→source→test→observed result chain","One failed or missing required gate with correct consequence","Revised decision with real owner, alternative and threshold","Panel questions and real reviewer names or explicit self-review status"],
      completionCriteria:[
        ...criteria,
        "Each real PASS has matching runtime or authored evidence; guidance and simulated programs are separately labeled.",
        "No fictitious second-domain capstone, real operator, interview, external reviewer or production sign-off is recorded.",
        "A critical negative or unknown gate can block advancement without requiring a false positive assessment."
      ]
     }},
    {id:stableId+"-check",title:"Surprise challenge: "+title,estimatedMinutes:20,
     content:{type:"reflection",prompt:questions.map((q,i)=>(i+1)+". "+q).join("\n")+"\nDocument whether a real outside assessor challenged this argument. In their absence independent transfer remains NOT VALIDATED."}}
  ]};
}
const contextGate=defenceStage(
 "stage-problem-architecture-and-evidence",
 "Stage A: Problem, Architecture, Trade-off and Evidence Defence",
 "Defend a genuine new-domain problem and one implemented vertical workflow through actual source evidence, a rejected alternative and an unseen changed constraint.",
 [
  "Freeze an ACTUAL capstone commit and trace a discovered stakeholder problem to one implemented user outcome; separate domain verification from unverified user benefit.",
  "Walk one authorized request and one valid forbidden request across trust, data and deployment boundaries. Inspect the persisted side effect or mark its runtime execution NOT_TESTED.",
  "Explain a dated consequential architecture decision, one simpler alternative and actual evidence that would reverse it; avoid retrospectively inventing justification.",
  "Build a claim→original requirement→source version→exact test and environment→observed positive and negative evidence table, including at least one claim you deliberately downgrade.",
  "The reviewer adds a new actor or data-ownership model; identify which original invariant is invalidated, the smallest fresh test and a safe revised recommendation."
 ],
 ["The problem is demonstrably a different domain from Steward with original discovery evidence.","The changed model produces a testable revised decision, not a rhetorical reaffirmation."],
 ["What does this capstone prove about user value rather than mere feature delivery?","Which boundary fails if an additional actor is granted cross-team access?","Which architectural component is unjustified under a smaller operating budget?"]
);
const assuranceGate=defenceStage(
 "stage-quality-security-reliability-and-governance",
 "Stage B: Safety, Recovery, Rights and Accountable Release Challenge",
 "Demonstrate how real tests, threat controls, recoverable data and decision authority constrain a risky release decision.",
 [
  "Take a high-harm capstone rule and defend the test boundary. Introduce a write-before-deny bug and inspect both HTTP semantics and the actual persisted/external effect.",
  "Challenge an authorization boundary with signed ownership-scoped data from the deployed application. Do not present a malformed 400 or a local Python model as the signed negative.",
  "Demonstrate a bounded failure and an actual useful restore, where authorized. If production-like restore or simultaneous client behavior is unavailable, mark NOT_TESTED and identify its release consequence.",
  "Review external/internal package license, provenance, owner and failure behavior. An unknown legal permission cannot be cured by a checksum or arbitrary developer risk acceptance.",
  "Panel members remove one critical evidence report and propose a release anyway. Distinguish the raw FAIL/NOT_TESTED from an expressly authorized, scoped policy exception, and defend DEFER when appropriate."
 ],
 ["A failed control never becomes PASS because CI or a second gate passed.","The reviewer can identify the actual test coverage and the authorized owner of residual-risk decisions."],
 ["How can a 403 response still hide an unauthorized write?","Which real measurement establishes the RTO rather than merely a backup file?","Who could lawfully accept a missing license grant, if anyone?"]
);
const evolutionGate=defenceStage(
 "stage-limitations-surprise-and-independent-transfer",
 "Stage C: Unknown Constraint, Limitations and Evidence-Led Evolution",
 "Handle unseen review questions, acknowledge release-blocking limits and demonstrate a disciplined alternative/revisit decision beyond Steward.",
 [
  "Give each material limitation an owner, affected user/data, observed state, next safe experiment and explicit stop/reconsideration condition; differentiate defect, unknown, excluded feature and accepted residual risk.",
  "Have a real assessor, if available, introduce at least two previously unseen changes: e.g., lost operator plus tenfold load, inaccessible workflow plus a new compliance rule, or provider failure plus budget reduction.",
  "Recalculate which invariant and safety gates remain mandatory, which work can be postponed, which architecture decision should change and why. An evidence gap may correctly yield DEFER.",
  "Demonstrate one algorithm or engineering principle transferring from Steward to the new capstone while the domain entities, authorizations and implementation decisions differ for sound reasons.",
  "Prepare a five-dimension 0–2 review for problem/evidence, failure reasoning, new-domain transfer, responsible decision authority and evolution under surprises; record actual panel comments or NOT_INDEPENDENTLY_VALIDATED. Do not invent sign-off.",
  "Produce a defendable 90-day further-development plan with three actual gaps, novel exercises, negative tests and outside review where possible."
 ],
 ["No source-only or previously rehearsed question is presented as an unseen outside assessment.","Missing production evidence and real outside review remain unvalidated even when the learner gives a coherent answer."],
 ["Which single missing control should stop wider use of the capstone?","How would losing half the budget change the roadmap without abandoning necessary safety?","What actually differs between the Steward mechanism and this independent system?"]
);
export const capstoneDefenceDeepLessons:Lesson[]=originalDefenceLessons.flatMap((lesson,index)=>{
 if(index===3)return [lesson,contextGate];
 if(index===7)return [lesson,assuranceGate];
 if(index===11)return [lesson,evolutionGate];
 return [lesson];
});
