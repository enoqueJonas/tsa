import type { LearningResource } from "../activities/content";
import type { Lesson } from "./lesson";
const adr={title:"Architectural Decision Records",url:"https://adr.github.io/",kind:"reference"} satisfies LearningResource;
const sreRunbook={title:"Google SRE — Being On-Call",url:"https://sre.google/sre-book/being-on-call/",kind:"reference"} satisfies LearningResource;
const semver={title:"Semantic Versioning",url:"https://semver.org/",kind:"reference"} satisfies LearningResource;
const docsCode={title:"Write the Docs — Docs as Code",url:"https://www.writethedocs.org/guide/docs-as-code/",kind:"reference"} satisfies LearningResource;
const resourcesByHandbook:Record<string,LearningResource[]>={
 "handbook-and-standards-writing-usable-standards":[docsCode],"handbook-and-standards-runbooks-and-playbooks":[sreRunbook,docsCode],
 "handbook-and-standards-decision-records":[adr],"handbook-and-standards-review-checklists":[docsCode],
 "handbook-and-standards-knowledge-stewardship":[docsCode],"handbook-and-standards-standards-ownership-and-versioning":[semver,docsCode],
 "handbook-and-standards-exception-and-waiver-records":[adr,docsCode],"handbook-and-standards-keeping-the-handbook-alive":[docsCode],
};

const scenario = "Steward is a mature organization-owned service whose architecture, delivery, quality, security, reliability, dependency, risk and governance decisions need durable guidance that engineers can find, understand, challenge and maintain. The handbook is an organizational-memory and navigation layer, not a duplicate of every technical artifact.";

const handbookChecks: Record<string,{failure:string;transfer:string}> = {
  "handbook-and-standards-writing-usable-standards": {
    "failure": "A 'coding standard' mandates an obsolete Nexus hostname and 'secure code' without a testable invariant. A team can obey the document and still deploy unverified binaries.",
    "transfer": "Write a short standard for disallowing unauthorized owner changes: scope, MUST requirement, allowed implementation flexibility, negative read-after-denial evidence, owner and exception authority."
  },
  "handbook-and-standards-runbooks-and-playbooks": {
    "failure": "A restore runbook says 'restore the most recent backup' but does not explain how to identify the authoritative source, verify checksum, avoid overwriting production or prove records are readable.",
    "transfer": "Draft an executable read-only runbook for investigating an unavailable scheduled job, specifying prerequisites, commands or observations, expected output, stop conditions and escalation. State the commands that require staging-only access."
  },
  "handbook-and-standards-decision-records": {
    "failure": "A team rewrites an old ADR to show its current choice and erases the rejected option that explained why a prior migration was risky. The next team repeats the failed experiment.",
    "transfer": "Produce a superseding ADR for an API authorization design that was initially based on a gateway but now enforces ownership in the domain service. Include evidence, a rejected alternative and a reversal trigger."
  },
  "handbook-and-standards-review-checklists": {
    "failure": "Every engineer marks 'tests passed' on a checklist while the required negative authorization suite ran zero tests. The checklist increases apparent assurance and fails to catch the defect.",
    "transfer": "Design a risk-tiered release checklist that distinguishes a documentation-only change from an irreversible database migration, and identify a machine-checkable negative criterion that rejects a stale report."
  },
  "handbook-and-standards-knowledge-stewardship": {
    "failure": "A handbook lists the specialist's name but the substitute on-call cannot locate the relevant secret-rotation procedure or access the approved evidence system when the specialist is away.",
    "transfer": "Run a no-hints simulated handoff for GitLab CI ownership to a deputy. Specify the exact evidence they must find, the allowed read-only actions and the failed/partial/pass rubric."
  },
  "handbook-and-standards-standards-ownership-and-versioning": {
    "failure": "A mandatory provenance requirement changes during a live release but the team cannot identify which version was in force at its approval cutoff.",
    "transfer": "Define effective-date, migration, exception and retirement metadata for a standard whose signing requirement changes between release candidates; explain how historical evidence remains interpretable."
  },
  "handbook-and-standards-exception-and-waiver-records": {
    "failure": "A scanner exception is marked 'temporary' for an unbounded period; the risk owner left, and no CI gate warns when the affected library passes support end date.",
    "transfer": "Write a 30-day exception for a broken provenance signing path with affected artifact scope, approved compensating verification, delegated acceptance role, expiry enforcement and exit proof."
  },
  "handbook-and-standards-keeping-the-handbook-alive": {
    "failure": "A recovery procedure was invalidated by a recent database migration but remains the top search result and falsely promises a tested rollback.",
    "transfer": "Design an event-triggered update workflow that catches stale procedures after incidents, migrations and vendor EOL. Define a reviewer action, freshness signal and one document that should be retired rather than edited."
  }
};
// Every original handbook lesson must show a concrete artifact with an
// operational counterexample and the prerequisites needed to challenge it.
const handbookConcepts:Record<string,{prerequisites:string;mechanism:string;alternatives:string;failure:string;artifact:string}> = {
  "handbook-and-standards-writing-usable-standards": {
    "prerequisites": "A policy is authoritative organizational intent; a standard is its measurable, usually mandatory engineering expectation; a procedure tells an operator what to do; a guideline recommends optional practices. Understand exact source/artifact identity and resource-scoped authorization before writing MUST rules. A team preference must not be presented as an approved organization policy.",
    "mechanism": "Start from a demonstrated repeated failure, such as release B deploying without mandatory owner-authorization tests. Write a standard with exact scope, binding obligation, reason, evidence source, success/denial oracle, accountable owner, effective version and approved exception route. Test usability by handing the rule to an engineer who did not write it and asking which artifact they would block. Run one positive and one false-green variant: mandatory tests present and passing versus zero selected tests on an otherwise green job. A useful standard enables that discrimination without asking the author what they meant. Review proportionality: version-digest integrity may be mandatory while a team's choice of local test file naming need not be.",
    "alternatives": "Prescribing a single tool can reduce support burden when a real shared need exists, but a verifiable outcome requirement often survives technology changes better. An advisory guideline is appropriate for reversible local preferences. A mandatory standard without a legitimate issuer should be explicitly proposed rather than enforced by fictitious authority.",
    "failure": "'All services MUST be secure and use modern tools' has no testable decision boundary, version or owner. It cannot tell a reviewer whether a deployed unauthorized-write effect should block release.",
    "artifact": "# Proposed STD-OWN-01 — Forbidden owner writes\nStatus: PROPOSED / not an approved enterprise policy\nScope: Steward owner-update endpoints, active API artifacts\nMUST: A principal without resource ownership must not change the target record\nVerify: exact tested digest; selected denied-resource test > 0; response denied; persisted owner unchanged\nOwner: service outcome owner (actual delegated name required)\nException: business/security risk delegate; scoped, evidenced, expiring\nRevisit: any schema, identity or authorization-contract change"
  },
  "handbook-and-standards-runbooks-and-playbooks": {
    "prerequisites": "A runbook is a precise procedure for a known operational condition; a playbook organizes diagnosis and decisions across branches. A procedure can be reliable only within known prerequisites, permissions, version and environment. Be able to read a failure event, identify a non-destructive observation, and distinguish service restoration from data repair.",
    "mechanism": "Choose a single safe first action: an unavailable scheduled job. State scope, role permission, exact environment and stop conditions; instruct the operator to inspect job state and preserve a timestamped result, then branch on observed outcomes. For an actual command, give a dry-run/test environment, expected output and a negative result. Do not tell learners to restart production or delete data to 'see what happens'. If the job uses a queue, verify whether work has already committed before replay, or a double effect may occur. After recovery require application-level observation and customer-impact reconciliation, not only process start. Test the runbook by letting a deputy use it without verbal hints and recording ambiguity as a defect.",
    "alternatives": "A long crisis playbook can be useful for cross-service outages; a terse read-only runbook is better for frequent safe diagnosis. Automation reduces mistakes if it verifies preconditions and fails closed, but operational procedures still require a bounded manual fallback. Keep credentials in approved secret storage, never in a shared Markdown snippet.",
    "failure": "'Run the restore script and see if it works' lacks database target, data integrity check, recovery measurement and prohibition on overwriting production. A written instruction does not prove a successful restoration.",
    "artifact": "# Runbook draft — Scheduled job not observed\nEnvironment: ISOLATED/authorized test only; no production writes\nActor: authorized operator with read-only visibility\nPrecondition: identify job ID, expected schedule, current UTC timestamp\n1. Record scheduler status and last-run identifier (use platform-approved read-only interface)\n2. Record job log source, failure/absence and last successful business effect\n3. If last commit state is unknown, STOP: do not manually replay\n4. Escalate to job owner with evidence link and affected consumer count\n5. If safe test is approved, rehearse in disposable fixture and compare expected/actual effects\nSuccess: attributable user/service outcome restored; historical gaps reconciled\nFailure/stop: conflicting commit evidence, wrong environment or missing authority"
  },
  "handbook-and-standards-decision-records": {
    "prerequisites": "An architectural/technical decision record (ADR) explains a choice made in a specific context. It is historical evidence, not a timeless binding rule. Separate the observed driver, options, chosen action, consequence, current validity and reconsideration trigger. A new finding should supersede the old record rather than quietly rewriting history.",
    "mechanism": "For a proposed external gateway authorization approach, record context: cross-team owner writes must be denied by the service's domain boundary. Compare gateway-only enforcement, service/domain enforcement and layered controls. Reproduce the crucial negative: a valid token for Team A cannot mutate Team B records, even if the gateway accepts authentication. Choose the design whose domain invariants can be tested; name the evidence at the exact API artifact. Write the rejected alternative's failure mode and cost. After a changed requirement or observed bypass, create a superseding ADR linked to the original so a future engineer understands why the decision changed.",
    "alternatives": "A brief design note is adequate for trivial reversible decisions, while high-impact identity/data changes deserve a durable ADR and approval trace. An ADR cannot authorize a privacy or business risk outside its decision owner's delegation. Avoid massive architecture documents that conceal the decisive trade-off.",
    "failure": "The current ADR is rewritten to make the latest design appear inevitable; a later engineer loses the evidence that the previous gateway-only option failed under direct service access.",
    "artifact": "# ADR-012 — Ownership authorization at service boundary\nStatus: PROPOSED; supersedes ADR-006 only after delegated decision\nContext: cross-team writes must not change owner records\nOptions: gateway-only; domain-only; domain check + gateway defense-in-depth\nDecision: preserve resource-level domain check; gateway handles shared auth signals\nEvidence: allowed Team A→A and denied Team A→B, including persisted after-state\nRejected: gateway-only cannot guarantee domain ownership invariant\nConsequence: service maintains role/resource mapping and tests on every release\nRevisit if: protected resource semantics or identity trust boundary changes"
  },
  "handbook-and-standards-review-checklists": {
    "prerequisites": "A checklist is a decision aid: every item should ask a question whose answer can change an action. 'Tests passed' without selected population or exact artifact is not a reliable oracle. Know how to distinguish a routine reversible change from one crossing a data, identity or recovery boundary.",
    "mechanism": "Build a risk-tiered checklist with a short default path and higher-consequence branches. Common items identify what is changing, affected service, exact artifact and accountable owner. For a protected-data change require relevant selected negative tests, immutable digest match, safe rollback and approved residual risk. For a documentation update do not demand a disaster-recovery drill. Add a deliberate mutant: CI succeeds while selecting zero mandatory authorization tests. If the reviewer still ticks 'Passed', the checklist is defective. Each item must have evidence location and 'Unknown / blocked' behavior; a checklist with fifty generic yes/no questions may make verification worse.",
    "alternatives": "Machine-checkable criteria should be automated where possible; human reviewers are better at ambiguous risk/authority decisions. An independent checklist can be small if it focuses on the highest-consequence boundary. Reassess items that consistently produce no changes to decisions.",
    "failure": "An operator ticks a green test box despite test selection being empty and no denial after-state check. The checklist created fake assurance rather than detecting an unsafe release.",
    "artifact": "# Release checklist — proposed\n[ ] Exact deployed artifact digest equals digest under review (URI / timestamp)\n[ ] Changed business invariant and affected consumer set are identified\n[ ] Mandatory selected tests: count, IDs, results and source are linked\n[ ] Denied effect: actor/resource/action + unchanged durable state demonstrated\n[ ] Recovery/rollback and data compatibility are applicable and evidenced\n[ ] Outstanding material risk has actual authorized disposition; otherwise HOLD\n[ ] Post-deploy user/service verification is assigned and scoped\nDecision: GO / CONDITIONAL (scope + expiry) / NO-GO"
  },
  "handbook-and-standards-knowledge-stewardship": {
    "prerequisites": "Organizational knowledge is usable only if an authorized replacement can find, understand and safely apply it when the primary expert is absent. A named owner is not proof of access, documentation currency or operational competence. Identify which records are authoritative, which are duplicated and who can access necessary read-only evidence.",
    "mechanism": "Simulate a primary on-call engineer being unavailable. Freeze handbook contents before the test and give a deputy only the documented entry point, the service symptom and an authorized disposable environment. Observe whether they locate the correct service owner, deployed digest, incident runbook, evidence source, escalation route and a safe diagnostic action without hints. Score discovery, correct interpretation, permission boundaries, observed result and handoff separately. Intentionally introduce a stale top search result and see whether the deputy identifies supersession from version metadata. Record missing links, excess privilege requirements and unclear stops as real defects, fix them and repeat with a new uncoached variant.",
    "alternatives": "Making everyone expert in every system creates excessive privilege and training burden. Focus on key-person dependencies that threaten service continuity, with delegated safe access and explicit escalation. More documentation is not necessarily more discoverability; stable source-of-truth indexes often matter more.",
    "failure": "A wiki contains five pages about the incident, but the deputy cannot tell which is current or safely execute a read-only diagnosis. The organization's memory did not survive the specialist's absence.",
    "artifact": "# No-hints deputy exercise — knowledge continuity\nScenario: scheduled owner-sync job absent; primary maintainer unavailable\nEntry: public-to-team handbook index only; no verbal hints\nRecord: time to find authoritative runbook, scope, last reviewed date\nRequired: named service owner, current artifact, read-only evidence path, safe stop\nPass: independently locates and correctly interprets all; no prohibited writes\nPartial: locates record but needs a hint or unavailable privilege\nFail: follows retired guide, invents access, or changes production state\nHuman assessor: NOT YET TESTED until an actual authorized deputy participates"
  },
  "handbook-and-standards-standards-ownership-and-versioning": {
    "prerequisites": "Standards are living agreements with an issuer, effective date, owner and migration expectation. A source Git revision, published document version and package semantic version are not automatically the same identifier. Review evidence must be interpreted against the version in force when the action occurred, not today's current text.",
    "mechanism": "Consider a provenance standard upgraded from digest pinning to signed artifact attestation. Record version 1's effective window, affected environments and exception path; propose version 2 with migration owners, verification tests and cutover date approved by the correct authority. A release from the old window is assessed under the requirements actually in force, and later releases under the new version. Keep explicit links between superseding standards, historical evidence and known exceptions. Test a bad case: an operator changes the standard during release review and retrospectively marks earlier artifacts noncompliant without evaluating their true applicable policy. Use source-controlled docs and review but preserve the authorized publication event.",
    "alternatives": "Semantic version patterns can communicate change classes, but document governance is not software API compatibility by default. Excessive version ceremony can obstruct simple guidance changes; under-versioning makes mandatory obligations ambiguous. Choose granularity according to consequence and audit need.",
    "failure": "A mandatory rule is modified without an effective date; the team cannot determine whether artifact A was approved legitimately under the earlier requirement. Governance evidence becomes undecidable.",
    "artifact": "# Standard metadata — proposed\nID: STD-ARTIFACT-02\nStatus: PROPOSED / pending authorized publication\nOwner: deployment governance authority (name required)\nVersion: 2.0; supersedes 1.2 on approved effective date\nScope: active production image artifacts\nMUST: published digest verified with approved build provenance\nMigration: consumer-by-consumer compatibility and noncompliant stop rule\nHistorical rule: evaluate releases against edition effective at their decision time\nException: authority + affected digests + expiry + monitored verification"
  },
  "handbook-and-standards-exception-and-waiver-records": {
    "prerequisites": "An exception is scoped departure from a specific binding rule; a waiver is an authorized non-application in a defined case where policy permits it; risk acceptance evaluates residual exposure. The exact vocabulary may vary by organization, but an implementer cannot create authority by filling a form. Distinguish temporary change from unconditional permanent disappearance of a safety requirement.",
    "mechanism": "For a signing service outage, identify the affected standard version, exact artifacts, delivery population, tested compensating verification (trusted digest from approved build), remaining compromise path, alternatives and stop conditions. Require actual delegated acceptor, owner, creation time, expiry/renewal limit and event-driven revocation. Exercise two negative cases: a different artifact should not inherit the exception; an expired approval should fail the gate or be escalated as missing authority. Preserve monitoring so a green report indicates a bounded exception, not suppressed risk. When the signing path is repaired, remove the waiver and verify the normal route resumes.",
    "alternatives": "A rigid zero-exception posture can delay critical recovery; broad permanent suppressions hide real risk. Short-lived, evidentially testable deviations are defensible only within actual delegated policy. A vulnerability false positive requires proof of non-applicability, not merely an exemption label.",
    "failure": "The exception is called temporary but lacks an expiry and its owner has departed. The green build is not evidence of a valid current waiver.",
    "artifact": "# EXC-007 — Provenance-signing outage (hypothetical)\nRequirement: STD-ARTIFACT-02 v2.0; exact digest scope REQUIRED\nJustification: signing service unavailable; release choice unresolved\nCompensating check: independent digest verification from trusted build logs\nResidual risk: publisher/build compromise not fully excluded\nAuthority: PENDING — do NOT report approved\nRequested expiry: 30 days maximum if legitimately approved\nMonitor: every candidate digest and signing-service recovery\nStop: digest mismatch, expanded scope, unapproved date or new compromise evidence\nExit: signing restored, normal gate negative retested"
  },
  "handbook-and-standards-keeping-the-handbook-alive": {
    "prerequisites": "Documentation decays because systems, owners, permissions and versions change. Docs-as-code gives reviewability but does not make statements true. The handbook's role is to route a reader to authoritative, currently applicable sources with an explicit supersession and review mechanism.",
    "mechanism": "Define event-driven update triggers: incident root-cause correction, deployment topology change, security exception expiry, supplier end-of-support, runbook failure and owner departure. For each, identify source-of-truth artifact, affected pages, documentation owner and verification requirement. A CI link checker catches missing URLs; a human or safe automated drill must also catch *valid but obsolete* instructions. Add a deliberate stale page that refers to a retired registry but still returns HTTP 200; use revision metadata and active architecture inventory to reject it. Compare search results with actual operation and assign an owner to fix or retire the page. Measure retrieval success and false-guide incidents, not page count.",
    "alternatives": "Regular calendar review provides a baseline but misses urgent migration-induced drift. Event-driven updates with periodic sample audits are more responsive. Retiring obsolete guidance is sometimes safer than layering disclaimers, especially if the old procedure could cause destructive action.",
    "failure": "A restore runbook still opens and has no broken links, but its commands refer to pre-migration schema and could overwrite current records. Link health is not operational correctness.",
    "artifact": "# Handbook maintenance rule — proposed\nTrigger: incident; major release; dependency/owner change; policy/exception expiry\nOwner: named artifact maintainer with delegated reviewer\nCheck: valid source link AND version/effective scope AND safe observed procedure\nDrift test: retire/supersede an old page; ensure search/navigation flags it\nEvidence: last verified environment, date, operator, result and known omissions\nIf unsafe: mark DO NOT USE, link current recovery guidance, escalate service risk\nRetire: preserve historical decision only where justified and clearly labeled"
  }
};
function reading(id: string, title: string, body: string, outcomes: string[], example: string, mistakes: string[], practice: string[]): Lesson {
  const check = handbookChecks[id];
  const concept = handbookConcepts[id];
  if (!check || !concept) throw new Error(`Missing concept/evidence/failure case for handbook lesson ${id}`);
  const fullBody = [
    scenario, "Learning outcomes", outcomes.join("; "), body, "Worked Steward example",
    example, "Common failure", check.failure, "Independent transfer",
    check.transfer, "Original practice", practice.join("; ")
  ].join("\n\n");
  return {
    id, title,
    activities: [{
      id: `${id}-001`,
      title,
      estimatedMinutes: 50,
      content: {
        type: "reading",
        body: fullBody,
        blocks: [
          {type:"paragraph",text:scenario},
          {type:"heading",id:`${id}-outcomes`,text:"What you will learn to demonstrate",level:2},
          {type:"list",items:outcomes},
          {type:"heading",id:`${id}-mechanism`,text:"Concept and mechanism",level:2},
          {type:"paragraph",text:body},
          {type:"heading",id:`${id}-prerequisites`,text:"Prerequisites and limits of this artifact",level:2},
          {type:"paragraph",text:concept.prerequisites},
          {type:"heading",id:`${id}-causal-trace`,text:"Mechanism: how another engineer can verify the artifact",level:2},
          {type:"paragraph",text:concept.mechanism},
          {type:"heading",id:`${id}-alternatives`,text:"Trade-offs and alternatives",level:2},
          {type:"paragraph",text:concept.alternatives},
          {type:"callout",tone:"warning",title:"Misleading document or verification",body:concept.failure},
          {type:"heading",id:`${id}-artifact`,text:"Copyable worked artifact",level:2},
          {type:"code",language:"markdown",caption:"Proposed/example document — not an approved Steward policy",code:concept.artifact},
          {type:"heading",id:`${id}-worked`,text:"Worked Steward decision",level:2},
          {type:"paragraph",text:example},
          {type:"callout",tone:"warning",title:"How an apparently reasonable artifact fails",body:check.failure},
          {type:"heading",id:`${id}-transfer`,text:"Independent transfer",level:2},
          {type:"paragraph",text:check.transfer},
          {type:"heading",id:`${id}-practice`,text:"Practice and evidence",level:2},
          {type:"list",items:practice,ordered:true},
          {type:"resources",title:"Continue learning",resources:resourcesByHandbook[id] ?? [docsCode]},
        ],
      },
    }],
  };
}

const originalHandbookAndStandardsLessons: Lesson[] = [
  reading("handbook-and-standards-writing-usable-standards", "Writing Usable Standards", "A standard converts governance intent into repeatable engineering expectations. A useful standard states scope, requirement, rationale, ownership, verification and the legitimate exception path. Prefer outcome-oriented requirements where implementation flexibility matters, and prescribe a mechanism only when interoperability, risk or organizational consistency justifies it. Every mandatory rule creates maintenance and compliance cost, so do not standardize choices teams can safely make locally.", ["Distinguish standards from policies, procedures and guidelines.", "Write clear, testable and proportionate requirements.", "Avoid encoding personal tool preferences as organization-wide mandates."], "Require internal packages that actually exist to be published through the approved artifact repository with traceable provenance; use Nexus where it remains the retained implementation, while allowing package-specific choices that do not affect consumers or supply-chain controls.", ["Turning preferences into mandatory standards.", "Writing vague requirements that cannot be verified.", "Copying frameworks without adapting them to Steward.", "Creating requirements without an owner or exception path."], ["Rewrite three vague Steward expectations as testable standards.", "For each, identify scope, rationale, verification evidence and exception authority.", "Remove one proposed rule that does not justify organization-wide standardization."]),
  reading("handbook-and-standards-runbooks-and-playbooks", "Runbooks and Playbooks", "A runbook gives concrete steps for a known operational task or condition; a playbook guides decisions across a class of situations where judgment is still required. Good operational guidance includes prerequisites, safety boundaries, expected observations, verification, rollback or stop conditions, escalation and ownership. A document that has never been exercised is an assumption, so high-consequence procedures must be tested and revised when reality differs.", ["Distinguish runbooks from playbooks.", "Design operational guidance for time-sensitive work.", "Keep procedures aligned with real system behavior."], "A PostgreSQL restore runbook identifies backup source, target, safety checks, commands or automation, validation queries, RTO/RPO evidence and escalation conditions rather than merely saying 'restore the database'.", ["Writing procedures from memory without executing them.", "Omitting stop or rollback conditions.", "Embedding secrets in examples.", "Treating uncertain incidents as deterministic runbooks."], ["Choose one Steward operational capability and classify the needed artifact as runbook or playbook.", "Draft prerequisites, verification and escalation sections.", "Define how it will be exercised and kept current."]),
  reading("handbook-and-standards-decision-records", "Decision Records", "Decision records preserve why consequential choices were made so future engineers can distinguish deliberate trade-offs from accidents. Reuse ADR discipline: context, decision, alternatives, evidence, consequences and status. Historical decisions should normally remain immutable; later decisions supersede them. Do not create ADRs for trivial implementation choices or use them as approval forms.", ["Capture durable decision context without rewriting design documents.", "Record alternatives, evidence and consequences.", "Know when a decision should be superseded rather than silently edited."], "If Steward retains a single PostgreSQL database after evaluating decomposition, preserve the quality-attribute evidence and rejected alternatives so a future team does not split it merely because the rationale disappeared.", ["Recording only the chosen solution.", "Editing away historical rationale.", "Creating records for every code change.", "Using ADRs as substitutes for implementation documentation."], ["Review one Steward architecture or governance decision.", "Identify what a future engineer needs to understand its rationale.", "Draft or supersede the record if the decision changed."]),
  reading("handbook-and-standards-review-checklists", "Review Checklists", "A checklist protects against predictable omissions in repeatable work; it is not evidence that the work is correct. Steward checklists should prompt reviewers to inspect relevant evidence according to change risk. Keep items concrete and short, use conditional sections, and automate machine-verifiable rules. Review escaped failures and ignored prompts to improve or retire checklist items.", ["Use checklists as cognitive aids rather than approval theater.", "Design risk-sensitive review prompts.", "Retire checklist items that no longer improve decisions."], "A low-risk documentation change should not receive the same operational-readiness checklist as a PostgreSQL schema migration; the latter can trigger data-migration, backup, rollback and monitoring prompts.", ["Treating checked boxes as operating evidence.", "Applying one checklist to every change.", "Keeping obsolete prompts forever.", "Using humans for rules CI can enforce reliably."], ["Design a short production-change checklist with conditional prompts.", "Mark which items should be automated.", "Define a signal that would cause a prompt to be revised or retired."]),
  reading("handbook-and-standards-knowledge-stewardship", "Knowledge Stewardship", "Knowledge stewardship makes critical engineering context discoverable, trustworthy and transferable. The goal is not maximum documentation; it is enough maintained knowledge to operate and evolve Steward without depending on one person's memory. Prefer documentation close to the system or decision it describes, stable links, ownership metadata and explicit freshness signals. Treat concentrated undocumented knowledge as an operational risk.", ["Treat technical knowledge as an owned lifecycle asset.", "Reduce dependence on undocumented individual knowledge.", "Choose durable locations and discovery paths."], "For internal packages that actually exist, owner and support policy belong in discoverable package/handbook metadata while detailed API documentation remains close to the package. Include `steward-common` only if its earlier extraction gate was earned. For `tsa-test-core`, document the future extraction criteria and intended ownership decision point; do not write support policy for a package that does not exist yet.", ["Centralizing every detail into one enormous handbook.", "Duplicating documentation until copies disagree.", "Assuming a wiki page transfers operational capability.", "Leaving critical knowledge without a maintainer."], ["Map five critical Steward knowledge assets to authoritative locations and owners.", "Identify one single-person knowledge dependency.", "Design a transfer or validation activity."]),
  reading("handbook-and-standards-standards-ownership-and-versioning", "Standards Ownership and Versioning", "Standards are products with consumers. Owners are accountable for clarity, review, feedback, exceptions and lifecycle decisions, not for personally enforcing every rule. Material changes should be traceable so engineers know which expectation applied when evidence was produced. Define effective dates, migration expectations where needed, review cadence and deprecation or supersession status without overengineering prose versioning.", ["Assign accountable ownership for standards.", "Version material changes without freezing guidance forever.", "Define review and deprecation lifecycles."], "When the internal-package provenance requirement becomes stricter, publish the new effective requirement, define which packages must migrate and by when, and preserve the prior version for historical evidence.", ["Publishing standards with no owner.", "Changing requirements silently.", "Treating wording fixes as major governance events.", "Keeping obsolete standards active indefinitely."], ["Define ownership/lifecycle metadata for three Steward standards.", "Classify sample changes as editorial, material or superseding.", "Specify how consumers discover the effective requirement."]),
  reading("handbook-and-standards-exception-and-waiver-records", "Exception and Waiver Records", "An exception is an explicit, bounded decision not to meet a normally applicable requirement. Record requirement, reason, scope, residual risk, compensating controls, authority, owner, expiry or review trigger and remediation plan where applicable. Repeated exceptions are governance evidence: the standard may be unrealistic, the paved road inadequate or teams insufficiently enabled.", ["Record deviations without normalizing silent non-compliance.", "Connect exceptions to risk acceptance and compensating controls.", "Use recurring exceptions as feedback about standards."], "A package temporarily unable to publish required provenance evidence may receive a time-bound exception only after supply-chain exposure, compensating verification and migration ownership are explicit.", ["Bypassing inconvenient controls silently.", "Approving without expiry or review trigger.", "Treating all deviations as equally risky.", "Renewing the same waiver without challenging the standard or platform."], ["Draft one Steward exception record tied to an existing standard.", "Define acceptance authority and compensating-control evidence.", "State what repeated exceptions would tell you about the standard."]),
  reading("handbook-and-standards-keeping-the-handbook-alive", "Keeping the Handbook Alive", "A handbook is useful only while it reflects how engineering actually works. Make maintenance event-driven as well as periodic: incidents, architecture decisions, control failures, repeated exceptions, new platform capabilities, dependency lifecycle changes and onboarding confusion should trigger review. Use repository ownership, pull-request review and lightweight scheduled checks rather than a parallel documentation bureaucracy. Delete or supersede guidance when it no longer earns its maintenance cost.", ["Design feedback loops that keep guidance current.", "Detect stale or unused documentation.", "Evolve guidance from incidents, reviews, exceptions and engineering-health evidence."], "If repeated exceptions target a manual release-control step after CI gains an equivalent automated guardrail, revise the handbook rather than preserving obsolete ceremony.", ["Annual review as the only freshness mechanism.", "Measuring documentation volume instead of usability.", "Never deleting outdated guidance.", "Updating policy without changing the engineering path it describes."], ["Define event-driven update triggers for the Steward handbook.", "Choose two freshness/usability signals with explicit actions.", "Identify one class of documentation that should stay outside the handbook."]),
  {
    id: "handbook-and-standards-lab-build-the-steward-engineering-handbook",
    title: "Lab: Build the Steward Engineering Handbook",
    activities: [{
      id: "handbook-and-standards-lab-build-the-steward-engineering-handbook-001",
      title: "Lab: Build the Steward Engineering Handbook",
      estimatedMinutes: 390,
      content: {
        type: "practical",
        objective: "Build and exercise a maintainable Steward engineering handbook that consolidates the minimum durable standards, operational guidance, decision records, review aids and exception mechanisms needed to govern the mature service.",
        scenario: "Steward has accumulated evidence across the full TSA journey. Your task is not to copy everything into one document, but to build a trustworthy navigation and standards layer over authoritative sources.",
        instructions: ["Inventory existing Steward governance and engineering artifacts and identify audiences and recurring decisions.", "Design handbook information architecture covering principles/standards, operational guidance, decision records, review aids, ownership/lifecycle metadata and exceptions.", "Write a small set of high-value standards and define scope, rationale, verification and exception path for each mandatory requirement.", "Add or refine at least one exercised `runbook`/`playbook`, one decision record and one risk-sensitive review checklist; record evidence of real use.", "Define owners, status/version approach, review triggers, deprecation rules and a discoverable exception record format.", "Run a usability review in which a new engineer must find the applicable standard, evidence expectations, operational guidance and exception path without oral explanation.", "Capture stale, duplicated or bureaucratic guidance, revise it and record follow-up ownership."],
        deliverables: ["Steward engineering handbook structure and navigation", "High-value standards with ownership, verification and exception paths", "Exercised runbook/playbook and evidence", "Decision record and risk-sensitive review checklist", "Standards lifecycle/versioning model", "Exception/waiver record model", "Handbook usability review and improvement record"],
        completionCriteria: ["Another engineer can find authoritative guidance and evidence paths without oral history.", "Mandatory standards are testable, proportionate and owned.", "Operational guidance has been exercised rather than merely written.", "Exceptions are explicit, risk-aware, authorized and time/review bounded.", "The handbook links to authoritative sources instead of duplicating them indiscriminately.", "A usability review produces at least one evidence-backed improvement or justified retain-current-state decision."],
      },
    }],
  },
];

/**
 * Keep the original handbook build activity ID for the source inventory phase.
 * Subsequent practice phases require their own independent completion. The
 * previous 390-minute single check was too broad to assess usage/recovery.
 */
const originalHandbookLessons = originalHandbookAndStandardsLessons;
const handbookLab = originalHandbookLessons.find((lesson) =>
  lesson.id === "handbook-and-standards-lab-build-the-steward-engineering-handbook");
if (!handbookLab) throw new Error("Handbook practical missing");
const handbookOriginal = handbookLab.activities[0]!;
if (handbookOriginal.content.type !== "practical") throw new Error("Handbook practical content missing");
const handbookInput = handbookOriginal.content;
function handbookPhase(id: string, title: string, estimatedMinutes: number, objective: string,
  instructionStart: number, instructionEnd: number, deliverables: string[], completionCriteria: string[]) {
  return {
    ...handbookOriginal,
    id, title, estimatedMinutes,
    content: {
      ...handbookInput,
      objective,
      instructions: handbookInput.instructions.slice(instructionStart, instructionEnd),
      deliverables,
      completionCriteria,
    },
  };
}
export const handbookAndStandardsDeepLessons: Lesson[] = originalHandbookLessons.map((lesson) =>
  lesson.id !== handbookLab.id ? lesson : {
    ...lesson,
    activities: [
      handbookPhase(
        handbookOriginal.id,
        "Phase 1 — Create a navigable and verifiable handbook",
        120,
        "Inventory the actual Steward evidence, then publish one minimal handbook index and testable rule without inventing current infrastructure.",
        0, 3,
        ["Authoritative artifact map with verified owner and revision",
         "Minimal handbook navigation and explicit standards scope",
         "One MUST-level standard with permitted exception path and negative acceptance check"],
        ["The index points to current evidence, not dead links or hypothetical retained infrastructure.",
         "A distinct engineer can find the actual authoritative reference without oral help.",
         "The standard has a testable obligation, owner, effective date and a rejected false-compliance example."],
      ),
      handbookPhase(
        `${handbookOriginal.id}-phase-2`,
        "Phase 2 — Exercise runbook, decision and exception evidence",
        150,
        "Demonstrate operational guidance and decision trace on an isolated, safe failure rather than claiming that written instructions work.",
        3, 5,
        ["Safe dry-run or isolated runbook execution transcript with failed and successful observations",
         "Decision record with one credible rejected alternative and reconsideration condition",
         "Risk-sensitive review checklist and time-limited exception with approval authority"],
        ["The runbook has prerequisites, stop conditions, expected output and a repeatable safe failure probe.",
         "Unexecuted instructions must be labelled UNVERIFIED; a screenshot of a document does not establish recoverability.",
         "Exceptions have declared authority, exact scope, expiry, compensating proof and exit criteria.",
         "A reviewer can state which evidence would falsify the claimed procedure or decision."],
      ),
      handbookPhase(
        `${handbookOriginal.id}-phase-3`,
        "Phase 3 — Uncoached navigation and stale-guidance correction",
        120,
        "Make another authorized person find, follow, challenge and update the handbook independently.",
        5, 7,
        ["Dated uncoached discovery/operation observation with pass/fail evidence",
         "Stale/duplicate/unsafe content report and concrete correction",
         "Owner and periodic/event-driven maintenance trigger with re-test result"],
        ["A substitute engineer locates the correct standard, escalation path and runbook without the writer's hints, or the assessment records a failure.",
         "A deliberate stale-link or superseded-decision case is rejected and corrected rather than silently treated as valid.",
         "A revised navigation or document passes the same assessment after remediation.",
         "The result is not marked human-validated until a real authorized independent participant completes the exercise."],
      ),
    ],
  });
