import type { LearningResource } from "../activities/content";
import type { Lesson } from "./lesson";
const iso38500={title:"ISO/IEC 38500 — Governance of IT overview",url:"https://www.iso.org/standard/62816.html",kind:"reference"} satisfies LearningResource;
const cobit={title:"ISACA — COBIT",url:"https://www.isaca.org/resources/cobit",kind:"reference"} satisfies LearningResource;
const adr={title:"Architectural Decision Records",url:"https://adr.github.io/",kind:"reference"} satisfies LearningResource;
const resourcesByGovernance:Record<string,LearningResource[]>={
 "engineering-governance-governance-vs-management":[iso38500,cobit],"engineering-governance-decision-rights":[iso38500],
 "engineering-governance-accountability":[iso38500],"engineering-governance-policy-standard-procedure-guideline":[cobit],
 "engineering-governance-exceptions":[adr,cobit],"engineering-governance-evidence-review-cadence":[cobit],
 "engineering-governance-without-bureaucracy":[iso38500,adr],
};

// These topic-specific examples belong in original readings, not generated path wrappers.
const governanceCases: Record<string, { question: string; example: string; counterexample: string; transfer: string }> = {
  "engineering-governance-governance-vs-management": {
    "question": "Who defines the boundary, and who executes within it?",
    "example": "Illustrative Steward control: the organization requires that an ownership-transfer API never modify data for an unauthorized principal. Governance states the non-negotiable outcome, names the accountable risk authority and requires independently repeatable denial/read-after-denial evidence. The engineering manager chooses staffing and sequencing; engineers choose implementation and test doubles; QA produces evidence; a release decision owner determines whether the gate is satisfied. No committee should prescribe the HTTP handler's internal function layout.",
    "counterexample": "A review board demands sign-off for every refactor but cannot identify a risk owner or acceptance invariant for an actual authorization change. It creates approvals without controlling the consequence.",
    "transfer": "Classify the following as direction/oversight, work management or technical execution: defining restore tolerance, scheduling a restore rehearsal, selecting a Postgres command, approving an exception and measuring actual recovery time. Defend any overlaps."
  },
  "engineering-governance-decision-rights": {
    "question": "What decision can each role make before the disagreement happens?",
    "example": "Hypothetical release: a patched service contains a dependency with an unreviewed critical security advisory. A developer can propose and implement a patch; the QA lead can report failing acceptance evidence; security can assess exploitability and exercise a defined stop-the-line criterion; the designated release/risk authority decides on deferral or a documented exception within delegated limits; operations confirms rollback readiness. Write an explicit decision-rights table with decision, proposer, consulted expertise, accountable approver, escalation path and time limit. The table should not invent a universal security veto.",
    "counterexample": "A group votes to 'accept the risk' without a delegated authority or specifies that only the most senior engineer can merge a harmless documentation edit. Both confuse participation with decision rights.",
    "transfer": "Design decision rights for a routine minor dependency update and for a production PII retention exception. State why the authority paths differ and identify the observable trigger for escalation."
  },
  "engineering-governance-accountability": {
    "question": "Can the accountable owner demonstrate follow-through?",
    "example": "Illustrative reconciliation failure: QA raises a missing-result evidence ticket, an SRE repairs the worker, an application maintainer adds a commit, but users have still not received completion outcomes. Assign one accountable service owner for closure; define contributors for the repair, verification and communication. The closure record contains the exact failed run, fix evidence, independent replay result, stakeholder notification and an explicit remaining-risk decision. Personal accountability does not imply that one person performed all actions.",
    "counterexample": "Three teams each mark their subtask Done, while the affected users still have no valid completion result. A dashboard with named teams but no closure owner has not solved the accountability problem.",
    "transfer": "A retiring CI maintainer owns a scheduled security scan. Make a handover record sufficient for another person to find the schedule, protected variables, failure artifact and decision authority without asking the former maintainer."
  },
  "engineering-governance-policy-standard-procedure-guideline": {
    "question": "Which artifact makes the correct obligation testable?",
    "example": "Example hierarchy for illustrative Steward data export: Policy—only authorized actors may export protected records. Standard—every export must check resource-level authorization and record auditable actor, resource and outcome metadata without exposing secrets. Procedure—an operator's reproducible investigation steps for an export-related alert. Guideline—recommended naming and code-organization approaches for export handlers. Each layer has its own owner and change authority. The standard is testable with one authorized export and an unauthorized export that leaves no protected result.",
    "counterexample": "A policy mandates a specific Java method name, or a guideline says 'it is recommended to authenticate' for a mandatory access control. The former over-constrains implementation; the latter makes an obligation optional.",
    "transfer": "Classify and rewrite four candidate statements: 'Use short functions', 'Purge protected records according to an approved retention schedule', 'Rotate a leaked credential with these command steps', and 'Show a rollback drill before high-risk deployment'. Identify any missing organizational policy input."
  },
  "engineering-governance-exceptions": {
    "question": "When does a temporary departure become controlled risk rather than a bypass?",
    "example": "Illustrative exception: a low-risk internal report dependency reaches end-of-support during a supplier outage. The standard forbids unsupported dependencies. An exception record identifies affected package/version, reason, service exposure, evidence of compensating network/isolation controls, approver with risk authority, expiration in 30 days and replacement/rollback owner. A weekly CI check reports the exception's age and fails closed once the approved date passes unless renewed by authorized review.",
    "counterexample": "A developer adds 'temporary ignore' to a scanner with no ticket, owner or expiry. Another false positive is creating an exception for a requirement that was merely nonbinding guidance.",
    "transfer": "Draft an exception for a restore rehearsal deferred due to a migration freeze. Specify what can and cannot be waived, the compensating detection measure, expiry, required approver and the evidence that ends the exception."
  },
  "engineering-governance-evidence-review-cadence": {
    "question": "How often should we demand fresh proof, and why?",
    "example": "Hypothetical control inventory: every protected API change requires per-change denial/read-after-denial evidence; a backup restore needs periodic timed rehearsal; provider end-of-support triggers event-driven review; an ADR needs reconsideration when its documented assumptions change. For each record capture source, revision/time, owner, retention, review trigger and what a failed or missing artifact means. A green pipeline run against another commit is stale evidence, not a pass for this release.",
    "counterexample": "A quarterly committee sees a screenshot of last month's tests and declares the current release compliant without checking commit or scope. Equally inefficient: forcing an hour-long meeting for every low-risk change already blocked by an automated policy.",
    "transfer": "Given a new authentication key rotation, a documentation typo and a failed production restore, choose per-change/periodic/event-driven proof; specify the missing-evidence handling for each."
  },
  "engineering-governance-without-bureaucracy": {
    "question": "What is the lightest mechanism that still changes risky behavior?",
    "example": "Illustrative change classes: (1) a spelling correction merges on normal review, (2) a new endpoint needs automated negative authorization checks and service-owner sign-off on the contract, (3) a major schema migration requires backward-compatibility evidence, rollback rehearsal and accountable production approval. Start by declaring consequence and reversibility, then assign proportional checks. Track median time-to-decision and actual escaped-risk events to discover when oversight costs exceed protection. Exception handling remains available without making every safe path exceptional.",
    "counterexample": "Introduce a weekly all-hands review for every pull request. Although the process generates signatures, it does not show which defects it prevents and may delay a critical security patch.",
    "transfer": "Redesign a proposed five-stage manual approval flow for all releases into risk-tiered automated checks and targeted human decisions. For each removed gate state which evidence replaces it and where an explicit human authorization is still essential."
  }
};

function readingLesson(id: string, title: string, body: string, practice: string[]): Lesson {
  return {
    id,
    title,
    activities: [
      {
        id: `${id}-reading`,
        title,
        estimatedMinutes: 55,
        content: { type: "reading", body, blocks: [
          ...body.split(/\n\s*\n/).filter(Boolean).map((text) => ({ type: "paragraph" as const, text })),
          ...(governanceCases[id] ? [
            { type: "heading" as const, id: `${id}-worked`, text: governanceCases[id].question, level: 2 as const },
            { type: "paragraph" as const, text: governanceCases[id].example },
            { type: "callout" as const, tone: "warning" as const, title: "False assurance", body: governanceCases[id].counterexample },
            { type: "heading" as const, id: `${id}-transfer`, text: "Unseen decision exercise", level: 2 as const },
            { type: "paragraph" as const, text: governanceCases[id].transfer },
          ] : []),
          { type: "resources" as const, title: "Continue learning", resources: resourcesByGovernance[id] ?? [iso38500] },
        ] },
      },
      {
        id: `${id}-practice`,
        title: `Practice: ${title}`,
        estimatedMinutes: 60,
        content: {
          type: "practical",
          objective: `Apply ${title} to the Steward ecosystem.`,
          scenario: "Use Steward's existing architecture, delivery, QA, security, reliability, dependency and operational evidence. Governance exists to make decision rights, accountability, evidence and exceptions explicit without turning ordinary engineering work into ceremony.",
          instructions: practice,
          deliverables: ["Governance decision or artifact", "Evidence and rationale", "Owner and review/follow-up record"],
          completionCriteria: ["Decision rights and accountability are explicit.", "The mechanism is proportionate to the risk and decision being governed.", "The artifact can be used by another engineer without relying on oral context."],
        },
      },
    ],
  };
}

export const engineeringGovernanceDeepLessons: Lesson[] = [
  readingLesson("engineering-governance-governance-vs-management", "Governance vs Management", "Governance sets direction, decision rights, boundaries, accountability and oversight; management organizes people and work to execute within those boundaries. Confusing them creates either unmanaged risk or approval-heavy bureaucracy. In Steward, governance should answer what must be true, who may decide, what evidence is required and when oversight is needed, while implementation teams retain room to choose how to deliver within those constraints.", ["Pick three existing Steward decisions and classify each as governance, management or engineering execution.", "Identify one place where approval would add little value and one where independent oversight is justified.", "Rewrite an overly procedural rule as a governance outcome plus delegated implementation freedom."]),
  readingLesson("engineering-governance-decision-rights", "Decision Rights", "Good governance makes decision authority explicit before conflict occurs. Decision rights distinguish who proposes, who decides, who must be consulted, who can block for defined risk reasons and who owns escalation. They should follow risk, expertise and accountability rather than title alone. A low-risk library patch should not require the same authority path as a production data-retention exception or a change to a critical service boundary.", ["Map decision rights for a Steward production release, architecture exception, security exception and internal-package breaking change.", "Separate decision owner, contributors, required reviewers and escalation path.", "Identify one decision currently vulnerable to ambiguous ownership."]),
  readingLesson("engineering-governance-accountability", "Accountability", "Accountability means a named owner remains answerable for an outcome, including follow-through after a decision. It is not the same as doing every task personally. Shared responsibility can exist, but diffuse accountability creates decisions that nobody closes. Steward governance should make ownership visible for services, risks, standards, controls, exceptions, packages and lifecycle decisions, with explicit handoff when ownership changes.", ["Create an accountability map for Steward service ownership and the active Architect-approved platform estate. Include Nexus only if retained and `steward-common` only if its extraction gate was earned and it remains active. Record `tsa-test-core` only as a future Professional Engineer extraction gate, not an owned current package.", "For one current risk, distinguish accountable owner from contributors and operators.", "Define what evidence shows that ownership has actually been exercised."]),
  readingLesson("engineering-governance-policy-standard-procedure-guideline", "Policies, Standards, Procedures and Guidelines", "These artifacts serve different purposes. A policy states mandatory intent and organizational expectation. A standard defines mandatory measurable rules that support policy. A procedure describes required execution steps where consistency matters. A guideline recommends practices while allowing justified variation. Treating every recommendation as policy creates unnecessary exceptions; treating mandatory controls as suggestions creates governance gaps. Steward artifacts should use the lightest form that still expresses the needed obligation.", ["Classify existing Steward rules as policy, standard, procedure or guideline.", "Convert one vague requirement into the correct artifact type with testable language.", "Identify implementation details that should be removed from policy-level text."]),
  readingLesson("engineering-governance-exceptions", "Exceptions", "A mature governance model expects legitimate exceptions. An exception is a time-bounded, owned departure from a requirement based on documented context and risk; it is not an undocumented bypass. A useful record states the rule, rationale, affected scope, risk, compensating controls, approver, expiry or review date and exit plan. Permanent exceptions should trigger reconsideration of whether the governing rule is still valid.", ["Draft a Steward exception for a plausible temporary deviation from a technical standard.", "Define compensating controls and an expiry trigger.", "Describe when repeated exceptions should cause the standard itself to be reviewed."]),
  readingLesson("engineering-governance-evidence-review-cadence", "Evidence and Review Cadence", "Governance is credible only when operating evidence shows that important expectations are being followed and remain useful. Evidence can come from CI results, deployment records, test reports, security scans, incident data, SLOs, ADRs, package metadata or review records. Cadence should follow volatility and risk: some controls need per-change evidence, some periodic review, and some event-driven review after incidents, major architecture changes or end-of-life notices.", ["Choose five Steward governance expectations and identify the strongest existing operating evidence for each.", "Assign per-change, periodic or event-driven review cadence with rationale.", "Remove one proposed review meeting by replacing it with durable automated or repository evidence where appropriate."]),
  readingLesson("engineering-governance-without-bureaucracy", "Governance Without Bureaucracy", "Effective governance minimizes the cost of making the right decision. Prefer paved roads, automation, defaults, templates, repository-visible evidence and risk-tiered review over central approval for everything. Escalate only when risk, uncertainty, policy conflict or impact crosses a meaningful threshold. Governance should make safe work faster: for example, an approved dependency source, reusable CI control or architecture fitness function can enforce expectations without adding a meeting.", ["Identify three Steward governance needs that can be enforced through automation or defaults rather than manual approval.", "Define a risk-tiered review model for low, medium and high-impact technical changes.", "Document one governance mechanism that should be removed if its evidence value is lower than its operational burden."]),
  {
    id: "engineering-governance-lab-design-steward-model",
    title: "Lab: Design the Steward Engineering Governance Model",
    activities: [
      {
        id: "engineering-governance-lab-design-steward-model-001",
        title: "Map Steward Decisions and Accountability",
        estimatedMinutes: 105,
        content: { type: "practical", objective: "Create a decision-rights and accountability model for the mature Steward ecosystem.", scenario: "Steward now spans application code, PostgreSQL, delivery/runtime infrastructure, test automation, security controls and reliability practices, plus only those artifact repositories, internal packages and platform components that remain active in the Architect baseline. The organization needs clear ownership without routing every engineering decision through a central board.", instructions: ["Inventory recurring and high-impact decisions across architecture, delivery, security, reliability, data, dependencies and service operation.", "For each, identify accountable owner, decision authority, required consultation/review and escalation conditions.", "Classify decisions by risk/impact and specify which can be delegated by default.", "Identify ambiguous or overlapping ownership and resolve it."], deliverables: ["Decision-rights matrix", "Accountability map", "Risk-tier model", "Escalation rules"], completionCriteria: ["Authority follows risk and expertise rather than title alone.", "Low-risk engineering work remains delegated.", "Critical decisions have explicit accountable owners and escalation paths."] },
      },
      {
        id: "engineering-governance-lab-design-steward-model-002",
        title: "Design the Governance Artifact and Exception System",
        estimatedMinutes: 120,
        content: { type: "practical", objective: "Define a usable hierarchy of governance artifacts and a proportionate exception mechanism.", scenario: "The goal is a governance system engineers can apply consistently without turning guidance into accidental policy or creating undocumented bypasses.", instructions: ["Define when Steward uses policy, standard, procedure, guideline, ADR, checklist and runbook artifacts.", "Select several real Steward requirements and express each using the correct artifact type.", "Design the exception record: rule, scope, rationale, risk, compensating controls, approver, expiry/review date and exit plan.", "Define when repeated exceptions trigger review of the underlying rule."], deliverables: ["Governance artifact hierarchy", "Representative Steward governance artifacts", "Exception/waiver template", "Rule-review triggers"], completionCriteria: ["Mandatory and advisory language is distinguishable.", "Exceptions are owned and time-bounded.", "The model avoids creating policy for issues that only need guidance or local decisions."] },
      },
      {
        id: "engineering-governance-lab-design-steward-model-003",
        title: "Define Evidence, Cadence and Lightweight Oversight",
        estimatedMinutes: 105,
        content: { type: "practical", objective: "Make Steward governance evidence-based and cheap enough to operate continuously.", scenario: "Existing CI, QA, security, reliability and repository evidence should be reused before inventing manual governance ceremonies.", instructions: ["Map each important governance expectation to existing or required operating evidence.", "Set per-change, periodic or event-driven review cadence based on risk and volatility.", "Identify controls that can be implemented as automation, defaults, templates or fitness functions.", "Define a minimal governance review that surfaces exceptions, overdue risks, failed controls and decisions needing escalation.", "Record indicators that would show governance itself has become a bottleneck."], deliverables: ["Evidence-to-expectation matrix", "Review cadence", "Automated governance opportunities", "Lightweight oversight model", "Governance health indicators"], completionCriteria: ["Evidence is reusable and durable rather than meeting-only.", "Review cadence is justified by risk.", "Manual approval is reserved for decisions where independent oversight adds material value.", "The governance model includes a way to detect and reduce its own bureaucracy."] },
      },
    ],
  },
];
