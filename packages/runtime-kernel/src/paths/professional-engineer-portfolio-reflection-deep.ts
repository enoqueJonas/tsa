import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";
import { portfolioLenses } from "./professional-engineer-portfolio-teaching";
import { portfolioPrograms } from "./professional-engineer-portfolio-proofs";
const adr:LearningResource={title:"Architectural Decision Records",url:"https://adr.github.io/",kind:"reference"};
const acm:LearningResource={title:"ACM Code of Ethics and Professional Conduct",url:"https://www.acm.org/code-of-ethics",kind:"reference"};
const docs:LearningResource={title:"Write the Docs — Docs as Code",url:"https://www.writethedocs.org/guide/docs-as-code/",kind:"reference"};
function lesson(id:string,title:string,body:string,instructions:string[],resources:LearningResource[]):Lesson {
  const lens=portfolioLenses[id];
  if(!lens)throw new Error("No subject-specific teaching for "+id);
  const blocks:LessonBlock[]=[
    ...body.split(/\n\s*\n/).filter(Boolean).map((text)=>({type:"paragraph" as const,text})),
    {type:"heading",id:"why-evidence-is-not-a-badge",text:"Mechanism, scope and a counterexample",level:2},
    {type:"paragraph",text:"The community tool-lending illustrations, synthetic source programs and invented incident timestamps are teaching fixtures, NOT personal experience, enterprise operations, external review or evidence that the learner built an independent capstone. Keep guided, simulated, actual and untested work distinguishable."},
  ];
  for(const [index,section] of lens.sections.entries()){
    blocks.push({type:"heading",id:"evidence-mechanism-"+(index+1),text:section.heading,level:2});
    for(const paragraph of section.paragraphs)blocks.push({type:"paragraph",text:paragraph});
  }
  const program=portfolioPrograms[id];
  if(program){
    blocks.push({type:"heading",id:"run-and-reject-a-misleading-claim",text:"Execute and challenge a false-confidence example",level:2});
    blocks.push({type:"code",language:"python",code:program.code,caption:program.caption});
    blocks.push({type:"paragraph",text:program.expected});
  }
  blocks.push({type:"heading",id:"transfer-and-limits",text:"Transfer beyond the rehearsed solution",level:2});
  blocks.push({type:"paragraph",text:"Create a fresh artifact from the learner's actually completed second-domain capstone. Identify your real contribution, source revision, command, observed result, negative test, domain-specific architectural decision, permitted disclosure scope, a plausible alternative explanation and the additional review needed. If it was not built or independently assessed, mark NOT_TESTED / SELF_REVIEW. An imagined reviewer and a private-company screenshot must never be presented as valid portfolio evidence."});
  blocks.push({type:"resources",title:"Specific reference for this claim",resources:[lens.resource,...resources.filter(r=>r.url!==lens.resource.url)]});
  return {
    id:`professional-portfolio-${id}`,
    title,
    activities:[
      {id:`professional-portfolio-${id}-reading`,title,estimatedMinutes:55,
       content:{type:"reading",body:blocks.filter(b=>b.type==="paragraph").map(b=>b.text).join("\n\n"),blocks}},
      {id:`professional-portfolio-${id}-practice`,title:`Evidence exercise: ${title}`,estimatedMinutes:80,
       content:{
         type:"practical",
         objective:"Produce a falsifiable, attributed and disclosure-safe piece of evidence about "+title+".",
         scenario:"Use actual TSA/Steward and independently justified new-capstone records when available, never fictional achievements. This is a portfolio of technical judgment, counterexamples and limits rather than screenshots or course attendance.",
         instructions:[
           ...instructions,...lens.practice,
           "Document a concise claim ID, actual contribution, environment, source revision, executed command, expected and observed result, rejected alternative, negative oracle and disclosure permission.",
           "Record PASS, FAIL, NOT_TESTED, GUIDED or SELF_REVIEW accurately. If actual external evidence is unavailable, show the exact missing item without inventing or bypassing it.",
           "Apply one unseen constraint or second-domain case and identify what would disprove your claim."
         ],
         deliverables:["Claim-to-actual-evidence record and source links","Observed positive and negative case, with explicit unknowns","Authorship and disclosure permissions/limitations","Reflection, changed decision and owner of next independent validation"],
         completionCriteria:[
           "Every capability claim has a falsifiable scope and an inspectable primary artifact or is marked NOT_PROVEN.",
           "No guided program, simulated incident or synthetic browser completion is misrepresented as human independent mastery.",
           "The portfolio uses work from a genuinely distinct domain rather than a retitled Steward solution; absent work is NOT_TESTED.",
           ...lens.criteria
         ]
       }},
    ]
  };
}

const authoredPortfolioLessons:Lesson[]=[
lesson("evidence-portfolio","Engineering Evidence Portfolio","An engineering portfolio should support precise capability claims with inspectable decisions, outcomes and limitations. A screenshot of a CI job or a list of frameworks does not establish that the author understood failure boundaries. Strong evidence includes a problem statement, relevant code or configuration, meaningful tests, the observed failure and recovery, and a reasoned explanation of trade-offs.\n\nFor TSA, choose a small set of Steward artifacts: a Python domain-model change with tests, a repeatable deployment pipeline, a backed-up and restored database, a vulnerability decision and a documented architecture compromise. For each, identify which role you played, what was executed in a real lab, and what was only simulated by curriculum CI. Link to specific commits and evidence rather than unverified summaries.\n\nAdd an independent capstone artifact that demonstrates transfer beyond the Steward assumptions. Present one failure or mistaken design and how the evidence changed the decision. The portfolio must make it possible for an external reviewer to distinguish your real ability from the academy's prepared instructions.",["Build a claim-to-evidence matrix across the TSA schools.","Prefer a small number of strong artifacts over exhaustive screenshots.","Include both Steward progression and independent-capstone evidence for transferable capabilities."],[docs,adr]),
lesson("portfolio-claim-calibration","Claim Calibration, Provenance and Evidence Quality","A link to an artifact is not proof of behavior, authorship or independent skill. Establish the exact execution scope and challenge what a green report might fail to measure. Treat every observation as a bounded claim rather than an all-purpose certificate.",["Audit three artifact claims for actual provenance, environment and negative test coverage.","Reject one claim that uses only a source link or a guided example as proof of competence."],[docs,adr]),
lesson("reflective-practice","Reflective Engineering Practice","Reflection is a disciplined reconstruction of how a decision was made, not a story in which every outcome retrospectively looks inevitable. Separate facts known at the time from information discovered later. A decision can be reasonable under uncertainty and still lead to a poor outcome; an unjustified decision can accidentally work.\n\nSuppose you initially chose a shared library before identifying a second independent consumer. The project then accumulated version coupling and release coordination without sufficient reuse benefit. Record the original assumption, alternative considered, first signal that contradicted it and what you would now demand before extracting a package. Preserve the earlier ADR instead of editing it to appear prescient.\n\nReflect on at least one code design, operational recovery and collaboration decision. For each, state which experiment would have reduced uncertainty sooner and what measurable behavior you will change in future work.",["Choose three decisions that changed materially during TSA or the capstone.","For each, record original evidence, assumption, outcome and learning.","Define a concrete rule, question or practice you will carry forward."],[adr,acm]),
lesson("engineering-decision-postmortems","Engineering Decision Reconstruction and Causal Reasoning","An incident or engineering reversal is a time-ordered sequence of observations and uncertain hypotheses, not an after-the-fact victory narrative. Recover what each participant could actually know and test alternative explanations.",["Build a source-timestamped timeline with known facts and later knowledge kept separate.","Test a second plausible cause and document the evidence that would discriminate it."],[adr]),
lesson("responsible-evidence-disclosure","Confidentiality, Consent and Responsible Portfolio Publishing","A real engineering achievement may be unsafe or unauthorized to publish. The portfolio must distinguish owned synthetic reconstructions, permitted private evidence and restricted workplace artifacts. Redaction by itself does not confer disclosure rights.",["Classify an artifact's ownership, privacy, permission and reconstruction status before disclosure.","Create a harmless synthetic substitute for one withheld capability claim and label its limits."],[acm,docs]),
lesson("independent-peer-review","Independent Review and Unseen Transfer Challenges","A reviewer should challenge novel domain constraints using real evidence and a transparent rubric. Scoring your own work is a useful diagnostic but must never be labeled independent validation. A failed challenge can reveal exactly what to learn next.",["Prepare an adversarial review packet with a new-domain scenario and rubric.","Record real reviewer feedback and dissent, or explicitly mark NOT INDEPENDENTLY VALIDATED."],[adr,acm]),
lesson("professional-development","Continuing Professional Development","Professional development begins with an evidence-based view of current capability and the problems the next role requires solving. Courses, certifications and postgraduate study can create structured learning opportunities, but completed credentials are not substitutes for design judgment, reliable implementation or clear communication.\n\nUse the completed TSA portfolio to distinguish fundamentals you can explain, work you have independently executed, and activities only observed in a guided or synthetic environment. For example, passing the Platform Builder browser test is not equivalent to operating a Rocky Linux service after real failure. A developer moving toward architecture needs stronger domain modeling and decision communication; a reliability-focused engineer needs deeper incident and recovery practice.\n\nBuild a twelve-month plan with a few measurable objectives. Each objective should have a learning source, an applied project, a review mechanism and evidence of competence. Reassess the plan when work responsibilities or technology needs change, rather than pursuing a long credential list for its own sake.",["Identify current capability strengths and limits from portfolio evidence.","Choose the next 12-month development objectives based on role direction and evidence gaps.","For each objective define learning, applied practice and proof—not only a credential."],[acm]),
];
function portfolioGate(id:string,title:string,objective:string,instructions:string[],criteria:string[],questions:string[]):Lesson{
  const stableId="professional-portfolio-"+id;
  return {id:stableId,title,activities:[
    {id:stableId+"-practice",title:"Integrated evidence: "+title,estimatedMinutes:95,
     content:{type:"practical",objective,
       scenario:"Use the learner's actual independent new-domain capstone and legally shareable TSA evidence. Fictional examples, curriculum fixtures and other people's work are NOT learner achievements.",
       instructions,
       deliverables:["Claim-to-source trace with actual environment and command","Positive and negative observation, plus falsifying alternative","Disclosure decision and evidence gaps","Reasoned changed decision or revised capability claim"],
       completionCriteria:[
         ...criteria,
         "Every real artifact has an actual authorship and disclosure classification.",
         "No speculative deployment, signed reviewer, real incident or capstone is manufactured from training material.",
         "At least one claim is downgraded or marked NOT_TESTED when its evidence does not support the scope."
       ]
     }},
    {id:stableId+"-check",title:"Unseen counterargument: "+title,estimatedMinutes:20,
     content:{type:"reflection",prompt:questions.map((q,i)=>(i+1)+". "+q).join("\n")+"\nIf no genuinely external reviewer has challenged this work, classify it SELF_REVIEW / NOT INDEPENDENTLY VALIDATED."}},
  ]};
}
const claimGate=portfolioGate(
  "stage-claim-evidence-authentication",
  "Stage A: Authenticate and Calibrate Actual Engineering Evidence",
  "Produce a falsifiable evidence register that can withstand an outsider inspecting commands, source versions, negative cases and environment limitations.",
  [
    "Choose three distinct claims: one from Steward, one from a genuinely independent new-domain capstone, and one operational/ethical decision. If the capstone work has not happened, the second claim remains NOT_TESTED rather than borrowing a curriculum fixture.",
    "For each state the real contribution, source, immutable revision, exact command, environment, time, observed output and a negative case whose outcome would falsify the claim.",
    "Deliberately overclaim a local or guided result as production/independent evidence; detect and correct it using the published claim-calibration mechanism.",
    "Demonstrate that two authentic artifacts may still fail to prove the desired behavior if their test oracle never inspects forbidden side effects.",
    "Produce a concise claim-to-proof matrix with disclosure permission, unknowns, rejected interpretations and a specific next validation owner."
  ],
  ["At least one overbroad claim is correctly narrowed or rejected.","Original and independent capstone claims are traceably separated."],
  ["Why does an authentic CI screenshot not prove the correct test oracle?", "What exact new-domain observation would falsify your strongest claim?", "Which supposed achievement relies only on a guided academy fixture?"]
);
const reviewGate=portfolioGate(
  "stage-causal-review-and-responsible-publication",
  "Stage B: Reconstruct Decisions, Protect Evidence and Invite Challenge",
  "Produce a causal, ethical and independently challengeable engineering narrative without leaking confidential or third-party material.",
  [
    "Reconstruct one actual engineering reversal with time-stamped evidence, at least two alternative explanations and a discriminating future test.",
    "Show an original ADR and later superseding evidence without rewriting the initial history to imply hindsight.",
    "Classify every proposed portfolio link as PUBLIC_RECONSTRUCTION, PERMITTED_REVIEW or WITHHOLD, checking ownership, secrecy, privacy and required authorization.",
    "Prepare a real independent reviewer packet: source revision, setup, exact test inputs, an unseen domain transfer case, critical questions and a five-dimension 0–2 rubric.",
    "If a reviewer is available, retain their dated objections and revised decisions. If not, mark SELF_REVIEW and do not claim independent transfer assessment."
  ],
  ["Private or employer-owned information cannot enter the public portfolio merely because it was redacted.","The assessor identity and counterevidence are genuine or expressly NOT VALIDATED."],
  ["What did the decision-maker know at the time that differs from hindsight?", "Which redacted artifact is still not authorized for publication?", "How might a skeptical independent reviewer disprove your transfer claim?"]
);
const handoff:Lesson={
  id:"professional-portfolio-lab-independent-evidence-handoff",
  title:"Lab: Curate and Defend a Falsifiable Engineering Portfolio",
  activities:[
    {id:"professional-portfolio-lab-independent-evidence-handoff-001",
     title:"Final portfolio evidence and twelve-month development handoff",estimatedMinutes:100,
     content:{type:"practical",
       objective:"Assemble an inspectable portfolio and development roadmap that distinguishes independently earned capabilities, guided practice and real gaps before the subsequent Capstone Defence module.",
       scenario:"The final portfolio is a record of actual engineering judgment, not a certification or claim that real external environments, employers, stakeholders or reviewers endorsed the learner. Capstone Defence later tests the claimed transfer separately.",
       instructions:[
         "Combine Stage A and Stage B records into a concise index of 4–6 strong, nonredundant capabilities. For each, include source, role, verification boundary, one failure observation, actual disclosure permission and limitation.",
         "Pick one architecture/ethics decision that later evidence overturned. Present the dated original decision, new observations, competing hypothesis and safe next experiment without hindsight rewriting.",
         "Demonstrate an independent-domain counterexample or clearly mark that capstone or reviewer evidence NOT_TESTED; do not reuse Steward as the second system.",
         "Have a real second reviewer score evidence authenticity, mechanism reasoning, novel transfer, safe disclosure and changed-decision insight from 0 to 2. Target >=8/10 with no zero in authenticity or safe disclosure. If no reviewer participated, record NOT INDEPENDENTLY VALIDATED rather than inventing feedback.",
         "Build the 12-month development plan from the actual gaps: three objectives, available time, study source, new-domain practical, negative oracle, review method, dated revisit and a stop/replan trigger.",
         "Prepare a handoff to the following Defence module: exact claims being defended, missing evidence, unresolved legal/privacy permissions and what adversarial questions would change your confidence."
       ],
       deliverables:["4–6-claim source-to-outcome portfolio index","Dated decision reconstruction and plausible counterhypothesis","Permission/redaction/disclosure register","Actual reviewer rubric or NOT INDEPENDENTLY VALIDATED record","Three-objective evidence-based development plan","Defence handoff with blockers and negative-case scenarios"],
       completionCriteria:[
         "The portfolio is sufficient for a reviewer to identify which source was executed, by whom and under what limited environment.",
         "At least one plausible wrong implementation or hypothesis is ruled out with an observed negative result or explicitly marked NOT_TESTED.",
         "Restricted workplace or third-party data has not been disclosed without express permission.",
         "A genuine independent second-domain capstone is distinguished from guided Steward work; missing implementation is not fabricated.",
         "The final review outcome may legitimately be NOT_VALIDATED, and the next steps identify the smallest real proof required.",
         "The development roadmap measures new performance and changed judgment, not credential or reading counts."
       ]
     }}
  ]
};
export const professionalPortfolioReflectionDeepLessons:Lesson[]=authoredPortfolioLessons.flatMap((lesson,index)=>{
  if(index===1)return [lesson,claimGate];
  if(index===5)return [lesson,reviewGate];
  return [lesson];
}).concat(handoff);
