import type { Activity } from "../activities";
import type { Lesson } from "./lesson";
import type { LessonBlock } from "../activities/content";
import { readinessLenses } from "./professional-engineer-readiness-teaching";
import { readinessPrograms } from "./professional-engineer-readiness-proofs";

const pathId = "capstone-production-readiness";
const reviewStandard = "Production readiness is an evidence-based release decision, not a checklist completion exercise. Every conclusion must distinguish demonstrated behavior, assumptions, accepted residual risk and unresolved gaps.";

function reading(id: string, title: string, body: string, evidence: string[]): Lesson {
  // Extend the ACTUAL authored reading, not synthetic preparation wrappers.
  // Preserve original activity IDs and new-domain capstone independence.
  const lens=readinessLenses[id];
  if (!lens) throw new Error("Unremediated Production Readiness reading: "+id);
  const blocks: LessonBlock[] = [
    { type: "paragraph", text: body },
    { type: "heading", id: "readiness-claim", text: "The actual readiness claim and its evidence boundary", level: 2 },
    { type: "paragraph", text: "The following cooperative tool-lending scenario is a deliberately FICTIONAL training fixture. It represents neither stakeholder research nor the learner's independent capstone release, actual credentials, deployment, real incidents or measured production success. Learn the mechanism, then create separate real evidence in your approved new domain." },
  ];
  for (const [index,section] of lens.sections.entries()) {
    blocks.push({ type: "heading", id: "readiness-mechanism-"+(index+1), text: section.heading, level: 2 });
    for (const p of section.paragraphs) blocks.push({ type: "paragraph", text:p });
  }
  const program=readinessPrograms[id];
  if (program) {
    blocks.push({ type: "heading", id: "runnable-readiness-evidence", text: "Run, inspect and challenge a wrong implementation", level: 2 });
    blocks.push({ type: "code", language: "python", code:program.code, caption:program.caption });
    blocks.push({ type: "paragraph", text: program.expected });
  }
  blocks.push({ type: "heading", id: "independent-readiness-transfer", text: "Independent transfer and negative-case review", level: 2 });
  blocks.push({ type: "paragraph", text: reviewStandard });
  blocks.push({ type: "paragraph", text: "From the ACTUAL independent capstone: cite the requirement and discovered risk; the target environment and source/artifact identity; exact executed command and its observable positive and negative result; the person entitled to accept the consequence; the missing/failed evidence; and the condition that would reverse the recommendation. Mark NOT_TESTED rather than substituting the fictional Python output, a CI screenshot, a supplier brochure or a simulated reviewer's signature." });
  blocks.push({ type: "resources", title:"Targeted primary reference", resources:[lens.resource] });
  const first: Activity={
    id:`${pathId}-${id}-001`, title, estimatedMinutes:60,
    content:{type:"reading",body:blocks.filter(b=>b.type==="paragraph").map(b=>b.text).join("\n\n"),blocks},
  };
  const verify: Activity={
    id:`${pathId}-${id}-practice`,title:"Readiness verification: "+title,estimatedMinutes:75,
    content:{
      type:"practical",
      objective:"Prove or explicitly withhold a readiness claim for "+title+" in the learner's ACTUAL independent capstone.",
      scenario:"The deployed-looking capstone can still fail real users. Use authorized, disposable target environments, inspect exact observations and distinguish source-level simulation from operational acceptance. A professional gate may correctly recommend DEFER.",
      instructions:[
        ...evidence,
        ...lens.practice,
        "Record requirement → risk → gate → environment/source digest → exact command → actual output → owner, including at least one observed negative case.",
        "Separate PASS, FAIL and NOT_TESTED; a missing report or simulated fixture must never be entered as production PASS.",
        "Record a rejected short-cut, a measurable revisit threshold and the authorized release decision owner; revise the operational dossier if claims contradict observed behavior.",
      ],
      deliverables:["Actual system evidence/command or explicit NOT_TESTED block", "Named negative-case failure and observed side-effect scope", "Readiness decision and precise gap owner", "Alternative/reversal trigger plus source reference"],
      completionCriteria:[
        "The result pertains to the learner's independently implemented system, not the fictional example.",
        "Every claimed PASS is grounded in reproducible observed runtime or evidence under a documented scope.",
        "The reviewer can distinguish a missing measurement from a tested failure or actual success.",
        ...lens.acceptance,
      ]
    }
  };
  return { id:`${pathId}-${id}`,title,activities:[first,verify] };
}

function practical(id: string, title: string, objective: string, instructions: string[], deliverables: string[], completionCriteria: string[], estimatedMinutes: number): Lesson {
  return { id: `${pathId}-${id}`, title, activities: [{ id: `${pathId}-${id}-001`, title, estimatedMinutes, content: { type: "practical", objective, scenario: "The capstone has completed its first end-to-end release and now needs a formal production-readiness decision. Review the system as if real users, data, operating costs and incident consequences depend on it. Do not invent evidence to satisfy the rubric; unresolved gaps may legitimately block release.", instructions, deliverables, completionCriteria } }] };
}

const originalProductionReadinessLessons: Lesson[] = [
  reading("deployment-readiness", "Deployment Readiness", "Confirm that the release can be produced, configured, deployed, verified and recovered through a repeatable path. Readiness includes artifact identity, environment configuration, migrations, secrets, dependencies, rollback or forward-recovery, release ownership and post-deploy verification. A successful one-off deployment is weaker evidence than a reproducible process.", ["Release artifact/version is traceable to source and build evidence.", "Deployment and migration path is repeatable in the target environment.", "Rollback or forward-recovery conditions and verification are exercised or explicitly risk-accepted."]),
  reading("observability", "Observability", "Verify that operators can detect user-impacting degradation, understand service health and diagnose important failures using the implemented telemetry. Readiness is not measured by dashboard count. Every critical signal should answer an operational question and have an owner or response expectation where action is required.", ["Health/service indicators map to meaningful user or system outcomes.", "A demonstrated failure can be diagnosed from logs/metrics/traces or equivalent telemetry.", "Alert/noise gaps and sensitive-data concerns are recorded."]),
  reading("security-assessment", "Security Assessment", "Assess the implemented system against its current threat model and attack surface. Combine automated scanning with targeted review and controlled testing appropriate to the domain. Findings must be triaged by impact and exploitability; unresolved security risk needs an explicit treatment, acceptance or release-blocking decision.", ["Threat model reflects deployed boundaries and dependencies.", "Security test/scan/manual-review evidence covers material threats.", "Findings have severity, owner, treatment status and residual-risk decision."]),
  reading("accessibility-and-human-workflow-readiness", "Accessibility and Human Workflow Readiness", "Functional, reachable endpoints do not prove that staff and members can complete critical tasks with keyboard, assistive technology and clear error recovery. Accessibility is a first-class user-acceptance and operational-readiness risk, not a badge from a scan.", ["Main workflow is navigable with keyboard and readable error semantics.", "Automated accessibility results and actual assistive-technology/human review remain separately labeled.", "Blocking accessibility findings have an owner, mitigation and explicit decision."]),
  reading("performance-evidence", "Performance Evidence", "Test performance against realistic workload assumptions and user-relevant thresholds rather than arbitrary benchmark numbers. Measure latency, throughput, saturation or resource behavior where relevant, identify bottlenecks and state the limits of the test. Performance claims without workload context are not meaningful.", ["Workload model and test assumptions are explicit.", "Observed results are compared with stakeholder-relevant thresholds.", "Capacity limits, bottlenecks and untested scenarios are documented."]),
  reading("reliability-and-failure-testing", "Reliability and Failure Testing", "Challenge the system under credible dependency, network, process, resource or data-path failures. Validate timeout, retry, isolation, degradation and recovery behavior only where those mechanisms are actually part of the design. The purpose is to learn how the system fails, not to manufacture a resilience score.", ["At least one material failure mode is exercised end to end.", "Observed behavior is compared with intended behavior and service objectives.", "Unexpected failure behavior creates remediation or residual-risk records."]),
  reading("backup-and-recovery", "Backup and Recovery", "Demonstrate that important state can be recovered, not merely that backups are configured. Verify backup integrity, restore procedure, permissions, retention and recovery objectives. If the system can rebuild state from another authoritative source, prove that recovery path instead of creating ceremonial backups.", ["Recovery strategy matches the system's data ownership model.", "A restore/rebuild exercise produces verifiable usable state.", "Observed recovery time/data loss is compared with stated objectives or accepted assumptions."]),
  reading("runbooks", "Runbooks", "Ensure operators have concise, exercised guidance for high-consequence or recurring operational actions. Runbooks need prerequisites, commands or actions, expected observations, verification, stop/rollback conditions and escalation. A document that has never been exercised is a hypothesis.", ["Critical runbook(s) are discoverable and owned.", "At least one runbook is exercised against the real environment.", "Exercise findings result in documented corrections where needed."]),
  reading("operational-ownership", "Operational Ownership", "Confirm who owns the service after release: monitoring, incident response, access, dependency updates, maintenance, capacity, backups, changes and stakeholder communication. Ownership must include decision rights and escalation paths, not merely a team name.", ["Service owner and operational responsibilities are explicit.", "Escalation and out-of-hours assumptions are documented where relevant.", "Recurring maintenance and dependency responsibilities have owners/cadence."]),
  reading("risk-and-control-evidence", "Risk and Control Evidence", "Refresh material risks and verify that claimed controls are both appropriately designed and operating. Separate issue status from future uncertainty, and control existence from control effectiveness. Release readiness depends on residual exposure and decision authority, not whether every risk is closed.", ["Risk register reflects current implementation evidence.", "Representative controls have operating evidence.", "Material residual risks have treatment/acceptance/escalation decisions."]),
  reading("dependency-and-supply-chain-readiness", "Dependency and Supply-chain Readiness", "Review external services, open-source packages and internal products as operational dependencies. Confirm approved source, version/provenance, support status, ownership, compatibility, vulnerability exposure, license/notice obligations and continuity/exit thinking proportionate to criticality. Reused TSA products must remain governed as dependencies rather than copied conveniences. A known artifact hash or SBOM proves identity/composition, not that its license permits the intended use or distribution.", ["Critical dependency inventory identifies owner/source/version/support status.", "Provenance or equivalent trust evidence exists for release artifacts/dependencies where applicable.", "Material open-source/commercial license obligations and required notices are identified for the delivered form.", "Unsupported, vulnerable, license-incompatible/unknown or high-concentration dependencies have explicit decisions."]),
  reading("cost-and-capacity-review", "Cost and Capacity Review", "Validate whether the implemented system remains economically and operationally plausible under expected usage. Compare measured resource behavior with the proposal's cost assumptions, identify dominant cost drivers and note scaling thresholds. More capacity is not automatically better if it buys no required outcome.", ["Current operating-cost estimate is based on implemented architecture.", "Capacity assumptions reference performance/resource evidence.", "Material cost surprises or scaling thresholds have decisions/owners."]),
  reading("release-decision", "Release Decision", "Synthesize readiness evidence into an accountable decision: release, release with conditions, defer, or redesign. The decision should state scope, evidence, accepted residual risks, blocking gaps, owners and follow-up triggers. A checklist cannot make the decision; accountable engineering judgment must.", ["Decision clearly distinguishes blockers, accepted risks and follow-up conditions.", "Decision authority and ownership are explicit.", "Evidence links allow another reviewer to challenge the conclusion."]),
  practical("lab-run-the-capstone-production-readiness-review", "Lab: Run the Capstone Production Readiness Review", "Conduct and defend a full production-readiness review of the independent capstone and make an evidence-backed release decision.", ["Assemble a readiness evidence index covering deployment, observability, accessibility/inclusion where relevant, security, performance, failure behavior, recovery, operations, risk/controls, dependencies including licensing/notice obligations, and cost/capacity.", "Run or refresh the most material evidence rather than relying on stale screenshots or proposal assumptions.", "Identify contradictions: green CI with weak operational evidence, configured backups without restore proof, alerts without actionability, standards without operating controls, or dependencies without owners.", "Classify every material gap as blocker, condition, accepted residual risk or future improvement; assign owner and evidence required for closure.", "Hold a mock readiness review with engineering, operations and risk/security perspectives. Record challenge, dissent and changed conclusions.", "Issue a final release / conditional release / defer / redesign decision and update authoritative artifacts, runbooks, risks and roadmap accordingly.", "Synthesize the previously completed Stage A/B/C evidence; record for each material claim the ACTUAL capstone version, environment, timestamp, responsible operator, primary proof, observed PASS/FAIL/NOT_TESTED and precise absence of prohibited side effects.", "Introduce an unseen counterfactual: recovery failure after a nominally green release, inaccessible core workflow, change of dependency license, or doubled supported load. Explain exactly how the original recommendation changes; a green CI status alone may not hold it steady.", "Separate SELF-REVIEW from independent review. Ask a real reviewer to score five dimensions (release identity, user-impacting failure diagnosis, security/accessibility, restored operability and accountable risk/cost decisions) 0–2 each, with a target of 8/10 and zero for any fabricated evidence. If nobody reviewed it, record NOT INDEPENDENTLY VALIDATED and do not invent a signature."], ["Production-readiness evidence index", "Deployment/observability/security/performance/reliability/recovery evidence", "Operational ownership and runbook evidence", "Risk/control and dependency readiness summary", "Cost/capacity review", "Readiness findings and decision log", "Final release decision with conditions, owners and follow-up"], ["Every material readiness claim is traceable to current evidence or explicitly labeled assumption.", "At least one failure or recovery behavior is demonstrated rather than inferred from configuration.", "Security and dependency findings are triaged with explicit residual-risk decisions; unresolved legal/license incompatibility is not silently treated as an ordinary technical risk acceptance.",
"Relevant accessibility requirements are exercised against critical user workflows, with automated findings distinguished from human usability evidence.", "Operational ownership and runbooks are usable by another engineer.", "The decision can legitimately block release; passing the module does not require a release decision of 'go'.", "The learner can defend trade-offs, uncertainty and decision authority under stakeholder challenge.", "Stage A, B and C have independently inspectable evidence with environment boundaries; a simulated Python model never counts as real production readiness.", "An unseen adverse case triggers a documented change of recommendation or an evidence-based explanation for retaining it.", "The review record names actual participants and their authority; without them independence and release approval are explicitly NOT VALIDATED.", "Release, conditional, defer and redesign remain legitimate outcomes depending on observed blockers."], 95),
];

function readinessGate(id:string,title:string,objective:string,instructions:string[],criteria:string[],questions:string[]):Lesson {
  const stableId=pathId+"-"+id;
  return {id:stableId,title,activities:[
    {id:stableId+"-practice",title:"Integrated operational proof: "+title,estimatedMinutes:95,
     content:{type:"practical",objective,
      scenario:"Apply this gate to the ACTUAL new-domain independent capstone in an authorized environment. The fictional cooperative is a learning example; no release, stakeholder interview, production restore or independent approval has been performed by the curriculum.",
      instructions,
      deliverables:["Trace from capstone risk to runtime evidence with source digest and date", "One observed successful and one observed failed/unknown boundary", "Documented stop condition, operator and accepted/rejected alternative", "Gate result PASS / FAIL / NOT_TESTED with accountable decision owner"],
      completionCriteria:[
        ...criteria,
        "Synthetic local data and source-program output are NEVER represented as production evidence.",
        "The evidence record includes at least one explicit gap and a falsifiable acceptance threshold.",
        "Reviewers have not been invented; self-checks are labeled SELF-REVIEW / NOT INDEPENDENTLY VALIDATED."
      ]
     }},
    {id:stableId+"-check",title:"Counterfactual challenge: "+title,estimatedMinutes:20,
     content:{type:"reflection",prompt:questions.map((q,i)=>(i+1)+". "+q).join("\n")+"\nIf the result was not observed in the actual system, label it NOT_TESTED. Record source and reviewer identity instead of asserting hypothetical sign-off."}}
  ]};
}
const releaseGate=readinessGate(
  "stage-release-observation-and-human-use",
  "Stage A: Deployable Release, Detectable Failure and Usable Workflow",
  "Demonstrate that deployed bytes match tested artifacts, user-facing failures are visible, signed authorization holds, and the main workflow is usable under relevant access needs.",
  [
    "Identify an actual capstone source commit, immutable build digest, target version, compatible migration and a real post-deploy smoke test.",
    "Intentionally withhold a required migration or smoke result in a disposable run; show that a green build does not turn the release recommendation into green.",
    "Inject a valid signed cross-owner action and inspect HTTP outcome plus absence of unauthorized durable or external effects; report final configuration and access-control gaps.",
    "Demonstrate a user-impacting application failure while the process health check remains green; show the alert/query, owner and diagnosis from actual telemetry.",
    "Rehearse the core user journey with keyboard focus, labels and error feedback; separate automated accessibility evidence from human-assistive-technology review.",
    "Run a representative workload, recording concurrency, dataset, latency distribution, errors and persisted-state correctness—not only requests per second."
  ],
  ["Artifact/source identity, migration readiness and actual target verification are traced separately.",
   "One real negative user/permission case has an observable failure contract and side-effect check.",
   "Unknown accessibility or workload coverage remains visible in the gate record."],
  ["Would a process health check detect wrong loan state? Why not?", "What if CI passed but the production artifact digest changed?", "Which real user cannot complete the task despite a successful API response?"]
);
const recoveryGate=readinessGate(
  "stage-fault-restore-and-operational-ownership",
  "Stage B: Bounded Failure, Real Restore and Operator Handoff",
  "Prove failure response and restored useful state with accountable operational ownership and tested runbooks.",
  [
    "Design a safe fault injection with an owner, blast-radius limit, expected user behavior, stop command and return-to-service verification.",
    "Exercise an actual failure or mark NOT_TESTED; distinguish a timeout after commit from an uncommitted rejection and verify retry/idempotency side effects.",
    "Restore a backup into a fresh disposable instance under the intended operator access and compare domain invariants, not just file presence.",
    "Measure the actual recovery duration and observed data loss. Compare to business RTO/RPO as objectives, or mark those unapproved assumptions.",
    "Have a second engineer rehearse the runbook, if available; record missing access and safe STOP/ESCALATE behavior. Label self-rehearsal as NOT INDEPENDENTLY VALIDATED.",
    "State who responds, who may change sensitive data, who contacts affected users and who maintains backups, keys, certificates and patches."
  ],
  ["Restored database contents and a useful user operation are independently inspected.",
   "There is an identified operator with realistic coverage or a documented release blocker.",
   "Unavailable real fault tests, restoration or second operators are not simulated as PASS."],
  ["How would a backup taken after silent corruption mislead the reviewer?", "Who is permitted to stop service or change live data at 02:00?", "Which response is safe if a retry follows an ambiguous commit?"]
);
const decisionGate=readinessGate(
  "stage-risk-dependency-cost-and-release-authority",
  "Stage C: Independent Risk, Dependency, Cost and Release Decision",
  "Integrate current risk/control, component licensing/provenance, capacity economics and authorization into a defensible GO, CONDITIONAL, DEFER or REDESIGN record.",
  [
    "Trace every material safety/control claim to current operating evidence, not merely an implemented flag or policy label.",
    "Inventory deployed versions and their actual consumer interfaces; separate vulnerability mitigation, license permission and artifact provenance. Unknown legal permissions go to qualified review.",
    "Compare a real measured workload and resource usage to documented cost assumptions, with at least two sensitivity/reversal scenarios and human operational costs.",
    "Remove a critical gate result and demonstrate that the recommendation changes to NOT_PROVEN; introduce a FAIL and verify it changes to BLOCKED.",
    "Conduct an adversarial review with documented actual participants, or accurately mark SELF-REVIEW. Include dissent, rejected alternatives and scoped authority.",
    "Issue RELEASE, CONDITIONAL, DEFER or REDESIGN only within authorized decision powers; keep deployment status and human sign-off distinct from technical recommendation."
  ],
  ["An unknown legal/security obligation cannot be silently waived by a developer.",
   "A FAIL or NOT_TESTED result cannot become PASS because another stage passed.",
   "The decision names owners, follow-up evidence, residual risks and a falsifiable reconsideration condition."],
  ["How can a correct artifact digest coexist with an incompatible license?", "What budget or operating condition reverses the current infrastructure choice?", "Who has the actual authority to accept a failed restore, if anyone?"]
);
export const capstoneProductionReadinessDeepLessons: Lesson[] = originalProductionReadinessLessons.flatMap((lesson,index)=>{
  if(index===4)return [lesson,releaseGate];
  if(index===8)return [lesson,recoveryGate];
  if(index===12)return [lesson,decisionGate];
  return [lesson];
});
