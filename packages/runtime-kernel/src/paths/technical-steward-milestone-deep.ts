import type { Lesson } from "./lesson";

const originalTechnicalStewardMilestoneLessons: Lesson[] = [
  {
    id: "technical-stewardship-review-milestone-technical-stewardship-review",
    title: "Milestone: Technical Stewardship Review",
    activities: [{
      id: "technical-stewardship-review-milestone-technical-stewardship-review-001",
      title: "Milestone: Technical Stewardship Review",
      estimatedMinutes: 600,
      content: {
        type: "practical",
        objective: "Conduct and defend an evidence-based stewardship review of the actual accumulated Steward ecosystem, including technologies introduced through TSA learning scenarios, migrations and any components later removed or replaced.",
        scenario: "Steward has evolved across the Academy from a Django/PostgreSQL service into an organization-owned engineering platform. Along the journey TSA may have created evidence for enterprise capabilities such as caching, messaging, GitLab CI/CD, artifact management, orchestration/GitOps, identity/API-edge controls and observability. Only the technologies actually adopted by the learner belong to the active estate; others may exist solely as evaluated, deferred, migrated, simplified or removed options. Leadership asks for a stewardship review before the next planning cycle. Historical implementation is not evidence that a component must remain. Present what is healthy, what is uncertain, which risks require action or acceptance, which controls operate, and which technology choices should be retained, simplified, migrated, replaced or removed.",
        instructions: [
          "Define scope, stakeholders, decision rights and evidence cutoff; state what is outside scope and which organizational assumptions are supplied rather than invented.",
          "Start from the final Architect baseline and record its exact Steward release/environment/evidence cutoff. Build an evidence index from the full TSA journey: product decisions, architecture records, actual migrations, delivery evidence, infrastructure/platform state, QA results, security assessments, SLO/reliability evidence, incidents, risks, control tests, dependency lifecycle records, engineering-health data and handbook standards.",
          "Create an actual-stack inventory. Classify each technology as active primary implementation, temporary migration component, comparison-only technology, retired component or proposed future option. Do not mark a tool active merely because a lesson once used it.",
          "Refresh the technology-risk register from current evidence, distinguishing issues from risks, inherent from residual exposure, and demonstrated controls from paper controls; identify acceptance authority and review triggers.",
          "Select representative controls across delivery/change, security/data, recoverability/reliability, access/identity, dependencies/supply chain, cloud/platform control planes and operational ownership; test design and operating effectiveness.",
          "Review architecture, security/data and change/service governance decisions; identify useful guardrails as well as stale rules, repeated exceptions and unnecessary approval friction.",
          "For every active primary platform component, record the capability it owns, accountable owner, approved source/provenance, lifecycle/version policy, access boundary, support expectation, recovery concern, health/review signal and exception path. Explicitly reconcile every technology that Architect retained from the required hands-on path so none survives merely as inherited infrastructure.",
          "Detect redundant capability ownership. If two active technologies substantially solve the same capability, prove the separate requirement for both or create a consolidation/migration recommendation. Conversely, verify that a component removed by Architect did not leave an unowned capability, control, recovery obligation or operational dependency behind.",
          "Review only migrations that were actually executed. Verify each superseded technology was decommissioned or has an explicit remaining responsibility. Evaluated-but-unimplemented migrations remain decision history, not active estate. Temporary coexistence must not silently become permanent duplication.",
          "Challenge platform permanence. For each expensive/high-complexity layer, record the capability it enables, operating cost/risk and evidence that supports retain, simplify, migrate, replace or remove.",
          "Check responsibility boundaries: CI builds/evidences, artifact repositories store approved artifacts, GitOps reconciles declared workload state, IaC manages infrastructure, orchestration manages workload state, identity authenticates, edge infrastructure handles edge policy, and Steward retains domain authorization/business invariants. Apply only to components actually present.",
          "Produce an engineering-health view linking technical debt, KPIs/KRIs, operational evidence and delivery constraints to actual decisions; reject vanity metrics. For each important target, identify how it could be gamed or distorted by scope/denominator changes and pair it with a counter-signal or qualitative review where needed.",
          "Audit the engineering handbook as a working governance product and verify engineers can find applicable standards, runbooks/playbooks, decisions, owners and exception paths.",
          "Test knowledge and ownership continuity: choose at least one critical service/platform responsibility and one priority risk/control, assume the primary owner is unavailable, and prove another authorized engineer can recover the current decision context, access path, operating procedure, evidence, open actions and escalation route without private oral knowledge.",
          "Create a prioritized roadmap where each material action states problem/risk, expected outcome, owner, evidence of completion, sequencing/dependencies and trade-offs. Include explicit lifecycle actions for technologies approaching review, upgrade, replacement or retirement triggers; do not turn every review trigger into immediate migration work.",
          "Facilitate a mock stewardship review with at least two stakeholder perspectives, invite challenge, separate facts from assumptions and record decisions, dissent, acceptance/escalation and follow-up ownership.",
          "Close the loop by updating authoritative artifacts rather than creating a disconnected shelf report.",
        ],
        deliverables: [
          "Review scope, stakeholder/decision-rights map and evidence index",
          "Actual-stack inventory with primary/comparison/migration/retired classifications",
          "Refreshed technology-risk register with residual-risk decisions",
          "Control assurance set with operating-effectiveness evidence",
          "Architecture, security/data and change/service governance review",
          "Active platform ownership/lifecycle review",
          "Redundant-capability and migration-decommission review",
          "Engineering-health and technical-debt decision view",
          "Engineering handbook/standards usability and owner-handoff review",
          "Exception/waiver and risk-acceptance view",
          "Retain/simplify/migrate/replace/remove decision set",
          "Prioritized improvement roadmap",
          "Technical Stewardship Review decision record",
          "Updated authoritative Steward artifacts"
        ],
        completionCriteria: [
          "Maturity, risk, control-effectiveness and engineering-health claims are traceable to current evidence; unknowns and assumptions are explicit.",
          "The review distinguishes technologies once implemented for learning from technologies currently active in Steward.",
          "Risks, issues, vulnerabilities, controls, findings, debt and exceptions remain distinct concepts.",
          "At least one material risk receives a defensible treatment, acceptance, escalation or monitoring decision with clear authority and follow-up.",
          "Control effectiveness is demonstrated through operating evidence rather than tool presence.",
          "No redundant pair of active technologies is justified merely by curriculum exposure; separate responsibilities or a migration end-state are explicit.",
          "Every actually completed migration includes a decommission/retention decision for the superseded technology; evaluated-only migrations are clearly classified as decision history.",
          "Governance recommendations are proportionate and remove unnecessary ceremony as readily as they add justified guardrails.",
          "Architecture and lifecycle recommendations respond to evidence rather than fashion or historical permanence.",
          "Active enterprise platform responsibilities have named owners, lifecycle/support expectations, recovery assumptions and exception paths.",
          "The learner can justify retaining, simplifying, migrating, replacing or removing major platform layers.",
          "Engineering-health evidence leads to concrete prioritization decisions without vanity metrics, and important targets include explicit gaming/counter-signal analysis.",
          "Critical ownership is not a single-person memory dependency: handoff evidence proves that service, risk and control responsibilities can continue when the primary owner is unavailable.",
          "The handbook is usable by another engineer and points to authoritative sources rather than duplicating them indiscriminately.",
          "The roadmap states outcomes, owners, evidence and trade-offs and includes at least one justified retain-current-state, simplify-current-state or remove-current-state decision.",
          "The learner can defend the review under challenge, acknowledge uncertainty and escalate decisions outside delegated authority.",
          "The final result demonstrates that governance enables accountable engineering judgment rather than preserving technology for its own sake."
        ],
      },
    }],
  },
];

/**
 * The original 600-minute catch-all capstone hid four different deliverable
 * types inside a single completion event. Preserve its authored activity ID
 * as Phase 1, then require separate evidence to complete the remaining phases.
 * A saved completion of the old all-in-one ID never counts as a pass for new
 * operational assurance, investment choices or stakeholder defence.
 */
const sourceMilestone = originalTechnicalStewardMilestoneLessons[0]!;
const sourceActivity = sourceMilestone.activities[0]!;
if (sourceActivity.content.type !== "practical") {
  throw new Error("Technical Steward milestone must remain an authored practical");
}
const sourcePractical = sourceActivity.content;
function milestonePhase(
  id: string,
  title: string,
  minutes: number,
  objective: string,
  from: number,
  to: number,
  deliverables: string[],
  criteria: string[],
) {
  return {
    ...sourceActivity,
    id,
    title,
    estimatedMinutes: minutes,
    content: {
      ...sourcePractical,
      objective,
      instructions: sourcePractical.instructions.slice(from, to),
      deliverables,
      completionCriteria: criteria,
    },
  };
}
export const technicalStewardMilestoneDeepLessons: Lesson[] = [{
  ...sourceMilestone,
  activities: [
    milestonePhase(
      sourceActivity.id,
      "Phase 1 — Establish the Actual Estate and Evidence Cutoff",
      130,
      "Show which Steward technologies, owners and obligations are real at the evidence cutoff before any risk or investment verdict.",
      0, 3,
      ["Scope, roles and supplied policy assumptions", "Artifact/evidence index with provenance and date", "Current/retired/deferred/migrating technology map"],
      [
        "Every active technology claim is linked to an actual observed deployment or retained Architect decision, not a prior classroom recommendation.",
        "One intentionally absent or retired component is correctly excluded from the active estate; an unavailable artifact is explicitly UNKNOWN.",
        "Evidence has a date/environment/owner; another engineer can locate the source without oral guidance.",
      ],
    ),
    milestonePhase(
      `${sourceActivity.id}-phase-2`,
      "Phase 2 — Test Risks, Controls and Lifecycle Accountability",
      160,
      "Demonstrate an inspectable risk-control-ownership chain with a real negative or unavailable-evidence disposition.",
      3, 7,
      ["Current risk register with authority, expiry/review and uncertainty", "Controls design-vs-operation test evidence", "Governance decision and active component ownership map"],
      [
        "At least one risk links cause/event/consequence, a control claim, its actual test and an explicit residual-risk disposition.",
        "The reviewer can distinguish a control that exists from one that passed operating-effectiveness testing.",
        "An absent or failed critical control cannot be marked effective, and business risk is not silently accepted by the implementer.",
      ],
    ),
    milestonePhase(
      `${sourceActivity.id}-phase-3`,
      "Phase 3 — Defend Retain, Simplify, Replace and Retire Choices",
      220,
      "Make a funded, evidence-gated next-horizon technology and engineering-health decision including an explicit non-choice.",
      7, 15,
      ["Capability/lifecycle comparison and migration/retirement dispositions", "Engineering-health evidence and counter-metrics", "Handbook/ownership handoff proof", "Ranked roadmap with alternatives and revisit triggers"],
      [
        "At least one plausible technology investment is rejected or deferred with opportunity cost, risk owner and reversal evidence.",
        "A proposed retirement lists consumers and a rollback/decommission disposition; an unproven migration is not declared completed.",
        "A substitute engineer can find and apply the required ownership/runbook context without private hints, or the outcome is recorded as failed.",
        "Metrics have population, owner and a counter-signal so process improvements cannot be claimed by hiding risky work.",
      ],
    ),
    milestonePhase(
      `${sourceActivity.id}-phase-4`,
      "Phase 4 — Adversarial Review, Decision and Authoritative Handoff",
      90,
      "Defend the actual review under stakeholder challenge and close actions in the original sources of truth.",
      15, 17,
      ["Recorded stakeholder questions, disagreements and decisions", "Final risk/exception approval boundary and action owners", "Updated source-of-truth artifacts with verification and revisit dates"],
      [
        "The learner responds to an unfamiliar counterexample without relying on a prewritten recommendation; assessor records gaps and corrective actions.",
        "Every accepted material risk names the actually delegated authority; missing authority requires escalation instead of inventing a decision.",
        "At least one governance requirement is simplified or removed where evidence shows it adds no control value.",
        "The final stakeholder record links back to verified evidence and identifies the decision that changes if new facts emerge.",
      ],
    ),
  ],
}];
