import type { LearningResource } from "../activities/content";
import type { Lesson } from "./lesson";
const fowlerDebt={title:"Martin Fowler — Technical Debt",url:"https://martinfowler.com/bliki/TechnicalDebt.html",kind:"reference"} satisfies LearningResource;
const dora={title:"DORA — Research Program",url:"https://dora.dev/research/",kind:"reference"} satisfies LearningResource;
const sreToil={title:"Google SRE — Eliminating Toil",url:"https://sre.google/sre-book/eliminating-toil/",kind:"reference"} satisfies LearningResource;
const resourcesByHealth:Record<string,LearningResource[]>={
 "technical-debt-health-identifying-technical-debt":[fowlerDebt],"technical-debt-health-measuring-and-communicating-debt":[fowlerDebt,dora],
 "technical-debt-health-prioritization":[fowlerDebt,sreToil],"technical-debt-health-engineering-health-metrics":[dora,sreToil],
 "technical-debt-health-kpi-vs-kri":[dora],"technical-debt-health-sustainable-remediation":[sreToil,fowlerDebt],
 "technical-debt-health-debt-ownership-and-review-cadence":[fowlerDebt],"technical-debt-health-balancing-feature-delivery-and-engineering-health":[dora,sreToil],
};

const debtCases: Record<string, {title:string;worked:string;failure:string;transfer:string}> = {
  "technical-debt-health-identifying-technical-debt": {
    "title": "Distinguish debt from a bug, a constraint and an aesthetic preference",
    "worked": "Illustrative Steward case: authentication tests rely on a single shared account and intermittently corrupt each other's setup. The immediate test failure is a defect; the repeated decision to avoid independent fixtures for release speed created a debt-like trade-off with measurable future testing cost. Record the historical choice if known, present consequences (retries, triage time, masked regressions), owner and candidate repayment. A plain old framework is not automatically debt simply because a newer one exists.",
    "failure": "Label any unpopular code as 'technical debt' and estimate its priority from taste, or count a critical current authorization vulnerability as mere future debt to defer immediate treatment.",
    "transfer": "Classify an unused feature flag, a stale dependency, a poorly named variable and an incomplete restore procedure. For each state the observed consequence, uncertainty and whether the right action is fix, debt management, risk treatment or no action."
  },
  "technical-debt-health-measuring-and-communicating-debt": {
    "title": "Present the consequence and uncertainty, not a fabricated debt score",
    "worked": "Illustrative baseline: three releases each required two hours of manual package compatibility repair, for six engineer-hours of observed rework. The candidate automation is estimated to require twelve hours to build plus maintenance, but that estimate is not observed savings. Present both quantities, expected frequency, operational constraints, alternatives and uncertainty. A decision owner can compare a short experiment with continuing manual work. Avoid inventing a financial ROI if engineer-hour cost or future frequency is unknown.",
    "failure": "Declare debt reduced because the number of TODO comments fell, while release incompatibility incidents rise; or multiply guessed impact scores and present the result as precise monetary loss.",
    "transfer": "From five CI failures and two incident reports, write a one-page debt impact statement distinguishing measured effort, opportunity cost, severe but rare consequences and the evidence needed for a reliable forecast."
  },
  "technical-debt-health-prioritization": {
    "title": "Prioritize a repayment experiment against real alternative uses of capacity",
    "worked": "Illustrative backlog: option A reduces repeated test fixture cleanup that cost six observed hours in three releases; option B patches an unsupported dependency with potential high security impact; option C upgrades a cosmetic dashboard. Evaluate impact/risk, confidence, cost, deadline, reversibility and opportunity cost. Prioritize B's time-sensitive exposure for authorized risk review, then run a bounded A experiment with a measurable before/after oracle; defer C unless another driver emerges. This is a decision model, not a universal weighted ranking.",
    "failure": "Pick the highest developer annoyance score while ignoring support expiry and adverse business effects. Or declare that all debts must be repaid before features, creating an infinite backlog.",
    "transfer": "Choose between a flaky integration suite, a slow migration and a rarely used feature with expensive maintenance. Record one rejected option, its cost and a revisit trigger."
  },
  "technical-debt-health-kpi-vs-kri": {
    "title": "Do not conflate delivery performance with exposure to future loss",
    "worked": "Illustrative KPI: time to validate a release measures operational performance. Illustrative KRI: number and age of critical dependencies outside support indicates increasing technology exposure. Both need source, owner, interval and interpretation. If lead time improves because security tests were disabled, the KPI trend is positive but the risk may be worse. Pair the metrics with mandatory regression evidence and an explicit threshold/response, rather than optimizing one number in isolation.",
    "failure": "A manager concludes that shorter lead time proves engineering health while the unauthorized-transfer check stopped running. A metric is not an oracle unless it reflects the claimed outcome.",
    "transfer": "Design one KPI and one KRI for recovery readiness. Identify a scenario where the KPI improves while the KRI deteriorates, and name a management response."
  },
  "technical-debt-health-balancing-feature-delivery-and-engineering-health": {
    "title": "Make the next increment explicit and evidence gated",
    "worked": "Hypothetical planning choice: a new report feature needs three days, while an unstable CI gate adds a day of failure diagnosis to each release. Options include shipping the feature with an owned test debt exception, repairing the gate first, or isolating a safe feature subset. Review actual critical defect escape and triage evidence, then choose a time-boxed repair with one measurable invariant (a true authorization failure still blocks release) and a review date. Product velocity and reliability are not competing abstract virtues; they are observable constraints on the same service.",
    "failure": "Mandate an arbitrary '20% refactoring time' without an identified consequence, or permanently disable a critical regression check to show faster throughput.",
    "transfer": "Write a two-sprint decision for a team facing a payment integration requirement and a risky untested migration. Include accountable risk owner, capacity choice, one explicit non-choice and the evidence that changes the allocation."
  },
  "technical-debt-health-engineering-health-metrics": {
    "title": "Construct engineering-health measures that resist false improvement",
    "worked": "Illustrative Steward release process: measure change failure rate alongside median recovery time, escaped authorization defects, test selection completeness and unplanned on-call interruption. Define exact denominators, rolling period, source, owner and incident severity. If release frequency falls to zero, defect escape rate can appear perfect while the team is stuck; pair throughput with quality and service outcomes. Investigate a change in workload mix before treating a single trend as improvement.",
    "failure": "Publish a '100% green CI' KPI when mandatory test selection executes zero tests, or improve deployment lead time by abandoning critical rollback drills.",
    "transfer": "Choose two leading and two lagging indicators for a slow CI pipeline. Explain how each could be gamed and what complementary invariant would disprove misleading success."
  },
  "technical-debt-health-sustainable-remediation": {
    "title": "Pay debt without introducing a second hidden ownership problem",
    "worked": "Illustrative 12-week improvement: replacing a fragile shared fixture will take one sprint, but a complete test-framework rewrite would take a quarter. Evaluate a minimal isolated fixture per worker, verify 20 deterministic replays, ensure no customer data is touched, and use failed-run diagnosis time as a second measure. Assign a maintainer and a removal plan for obsolete fixture code. A remediation is sustainable when it lowers repeated effort without creating unowned infrastructure or large dependency blast radius.",
    "failure": "A massive platform rewrite is funded because it feels cleaner, but old and new frameworks run in parallel without owners and every test becomes slower to maintain.",
    "transfer": "Plan a time-boxed remediation of an unreliable logging parser. Include baseline, small experiment, failure oracle, owner, rollback and a decision to stop if benefits fail to appear."
  },
  "technical-debt-health-debt-ownership-and-review-cadence": {
    "title": "Assign one accountable owner and an event-driven review trigger",
    "worked": "Illustrative tech debt register entry: CI relies on obsolete runner image; evidence is a failed security patch and fragile test setup; owner is pipeline maintainer; impacted consumers are all release teams; risk acceptance authority is distinct. The owner documents a migration option, estimated work, actual failure recurrence and dates tied to support expiry. Review whenever vulnerability, outage or major consumer change occurs, not just because an arbitrary monthly meeting was scheduled.",
    "failure": "A backlog item says 'cleanup later' with no consequence, decision owner, deadline or event trigger; it can survive years without anyone making an accountable choice.",
    "transfer": "Make an ownership record for a legacy SQL migration script used by two teams, with explicit customer-impact trigger, cross-team approver and observable evidence for closing the debt."
  }
};
function reading(id: string, title: string, body: string): Lesson {
  return { id, title, activities: [
    { id: `${id}-001`, title, estimatedMinutes: 35, content: { type: "reading", body, blocks: [
  ...body.split(/\n\s*\n/).filter(Boolean).map((text) => ({type:"paragraph" as const,text})),
  ...(debtCases[id] ? [
    {type:"heading" as const,id:`${id}-worked`,text:debtCases[id].title,level:2 as const},
    {type:"paragraph" as const,text:debtCases[id].worked},
    {type:"callout" as const,tone:"warning" as const,title:"False engineering-health signal",body:debtCases[id].failure},
    {type:"heading" as const,id:`${id}-transfer`,text:"Independent decision",level:2 as const},
    {type:"paragraph" as const,text:debtCases[id].transfer}
  ] : []),
  {type:"resources" as const,title:"Engineering health reference",resources:resourcesByHealth[id] ?? [fowlerDebt]}
] } },
    { id: `${id}-practice`, title: `Practice: ${title}`, estimatedMinutes: 45, content: {
      type: "practical",
      objective: `Apply ${title} to current Steward engineering-health evidence.`,
      scenario:`${scenario}\n\nINDEPENDENT ENGINEERING-HEALTH DECISION: ${debtCases[id].transfer}`,
      instructions: [
        "Select one concrete Steward example supported by an existing artifact, metric, incident, dependency record, exception or delivery observation.",
        "Apply the lesson concept and separate observed evidence from interpretation or assumption.",
        "Make one explicit decision: remediate, contain, schedule, tolerate/monitor, reject the proposed debt label, or escalate where authority is insufficient.",
        "Record the owner, decision consequence and evidence/review trigger that would cause the decision to change.",
        "For the unseen case, state one alternative not chosen, a measurable baseline, a negative observation and how the next checkpoint could change the choice."
      ],
      deliverables: ["Focused engineering-health analysis", "Evidence reference", "Decision and rationale", "Owner and reconsideration trigger"],
      completionCriteria: [
        `Reject the decision if it repeats this false improvement: ${debtCases[id].failure}`,
        "The unfamiliar case has a current measurement, explicit uncertainty, decision owner, rejected alternative and observable outcome.",
        "The example is grounded in current Steward evidence rather than a hypothetical dislike of code.",
        "Debt, defect, risk, maintenance and feature work are not conflated.",
        "The decision has an engineering or organizational consequence rather than ending at classification.",
        "Uncertainty and reconsideration evidence are explicit."
      ]
    } }
  ] };
}

const scenario = "Steward is a mature organization-owned service spanning the final Architect actual application/data estate plus the platform, delivery, security, observability and operational capabilities actually retained. Nexus and `steward-common` are active debt targets only when they remain in that estate and the package extraction gate was earned. Components simplified or retired by Architect remain historical decision evidence rather than active debt targets. `tsa-test-core` does not exist yet; its deferred extraction is not technical debt unless later evidence establishes a real unmet need. Engineering-health decisions must connect debt to delivery, reliability, security, cost or maintainability outcomes rather than treating every imperfection or deferred idea as debt.";

export const technicalDebtHealthDeepLessons: Lesson[] = [
  reading("technical-debt-health-identifying-technical-debt", "Identifying Technical Debt", `${scenario}\n\nTechnical debt is a deliberate or accumulated compromise that creates future cost, risk or constraint. Distinguish debt from defects, feature gaps, ordinary maintenance and architectural preferences. Useful debt records identify the compromise, why it exists, affected assets or teams, current consequence, expected future cost and evidence. Steward examples include unsupported dependencies, duplicated deployment logic, brittle tests, manual release steps, aging PostgreSQL assumptions, weak package boundaries and repeated architecture exceptions.`),
  reading("technical-debt-health-measuring-and-communicating-debt", "Measuring and Communicating Debt", `${scenario}\n\nDebt should be communicated through consequences, not dramatic labels. Use evidence such as change-failure patterns, lead-time drag, flaky-test rates, recurring incidents, dependency age, exception frequency, manual toil, security exposure or developer effort. Avoid pretending that one score precisely measures debt. Combine quantitative indicators with qualitative context, confidence and trend. Translate engineering effects into stakeholder language: slower change, higher outage exposure, harder onboarding, increased cost or reduced ability to meet commitments.`),
  reading("technical-debt-health-prioritization", "Prioritization", `${scenario}\n\nPrioritize debt by expected harm and opportunity cost, not by who complains loudest. Consider risk reduction, frequency of friction, blast radius, strategic dependency, remediation effort, reversibility and whether upcoming work will amplify the problem. Treat "do nothing for now" as a legitimate option when evidence supports it. High-impact debt may deserve immediate remediation; lower-impact debt can be scheduled, tolerated or addressed opportunistically.`),
  reading("technical-debt-health-engineering-health-metrics", "Engineering Health Metrics", `${scenario}\n\nEngineering-health metrics should answer decision questions. Useful measures can include deployment frequency, lead time, change-failure rate, recovery time, flaky-test rate, build duration, dependency freshness, vulnerability aging, restore-test success, toil, review latency and exception volume. Metrics need definitions, owners, data sources and interpretation rules. Once a metric becomes a target, people can optimize the number instead of the underlying outcome: deployment frequency can rise through trivial releases, review latency can fall through shallow review, and vulnerability counts can fall by changing classification or scope. Pair important indicators with counter-metrics and qualitative evidence, watch for denominator/scope changes, and periodically ask whether behavior changed in a way that invalidates the metric. Do not create dashboards that reward gaming or confuse activity with health.`),
  reading("technical-debt-health-kpi-vs-kri", "KPI vs KRI", `${scenario}\n\nA KPI shows progress or performance toward an objective; a KRI signals increasing exposure to risk or proximity to a boundary. The same raw data can serve different purposes depending on the question. Deployment lead time may be a KPI for flow, while growth in unsupported critical dependencies can be a KRI for lifecycle exposure. Define what decision each indicator supports, threshold or target, owner, review cadence and response.\n\nWorked hypothetical example: suppose the engineering team targets a reduction in median change lead time from five working days to three; that trend is a performance KPI because it answers whether delivery flow is improving. Separately, the fraction of actively deployed services relying on unsupported critical dependencies rises from one of ten to three of ten. That is a lifecycle-risk KRI because it signals growing exposure, even if delivery speed improves. Record the denominator and sampling period, identify which services are affected, set an explicit escalation trigger, and avoid celebrating a faster KPI while ignoring the worsening KRI. These numbers are illustrative, not observed Steward metrics.`),
  reading("technical-debt-health-sustainable-remediation", "Sustainable Remediation", `${scenario}\n\nRemediation should improve the system without creating a perpetual cleanup programme. Prefer changes that remove recurring causes: paved roads, shared packages, automation, clearer ownership, stronger boundaries, migration plans or better defaults. Validate that remediation actually changes the measured consequence. Large rewrites require especially strong evidence because they can replace known debt with new uncertainty.`),
  reading("technical-debt-health-debt-ownership-and-review-cadence", "Debt Ownership and Review Cadence", `${scenario}\n\nDebt needs an accountable owner who can monitor consequences and drive a decision, but ownership does not imply personally implementing every fix. Record owner, rationale, evidence, treatment, due or review date and escalation trigger. Review cadence should match materiality: critical lifecycle or security debt may need frequent review, while low-impact maintainability debt can be revisited less often. Stale debt records should be closed, reframed or revalidated.`),
  reading("technical-debt-health-balancing-feature-delivery-and-engineering-health", "Balancing Feature Delivery and Engineering Health", `${scenario}\n\nFeature delivery and engineering health are not opposing moral choices. Both consume finite capacity and serve organizational outcomes. Make trade-offs explicit: what feature value is gained, what engineering-health cost is accepted, how long it is tolerable, and what signal forces reconsideration. Reserve capacity where evidence shows recurring health work is necessary, but avoid fixed percentages treated as universal law.`),
  { id: "technical-debt-health-lab-build-the-steward-engineering-health-review", title: "Lab: Build the Steward Engineering Health Review", activities: [{ id: "technical-debt-health-lab-build-the-steward-engineering-health-review-001", title: "Lab: Build the Steward Engineering Health Review", estimatedMinutes: 240, content: { type: "practical", objective: "Build and defend a recurring engineering-health review for Steward that converts evidence about debt, flow, reliability, security, dependencies and toil into prioritized decisions.", scenario, instructions: ["Create a debt inventory from existing Steward evidence and distinguish debt from defects, risks, feature gaps and routine maintenance.", "Select a small set of engineering-health KPIs and KRIs, defining source, meaning, owner, cadence and action thresholds; for each important target, identify a plausible gaming behavior and a counter-metric or review that would expose it.", "Prioritize debt using consequence, likelihood, strategic impact, remediation cost and timing rather than a cosmetic score alone.", "Choose treatment for the highest-value items: remediate, contain, schedule, accept temporarily or monitor.", "Define ownership, review cadence, expiry or escalation triggers, and connect material debt to the technology-risk register where appropriate.", "Run a mock engineering-health review and record at least one explicit trade-off between feature delivery and remediation."], deliverables: ["Steward technical-debt register", "Engineering-health KPI/KRI scorecard", "Prioritized remediation and acceptance plan", "Ownership and review-cadence model", "Engineering-health review decision record"], completionCriteria: ["Debt records explain future cost or risk and are not merely lists of disliked code.", "Metrics are tied to decisions and cannot be confused with activity vanity metrics.", "Priorities and treatment choices are evidence-based and proportionate.", "Ownership and review triggers are explicit.", "The review demonstrates a defensible balance between delivery value and engineering sustainability."] } }] }
];
