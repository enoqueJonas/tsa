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
function reading(id: string, title: string, body: string, outcomes: string[], example: string, mistakes: string[], practice: string[]): Lesson {
  const check = handbookChecks[id];
  if (!check) throw new Error(`Missing evidence/failure case for handbook lesson ${id}`);
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

export const handbookAndStandardsDeepLessons: Lesson[] = [
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
