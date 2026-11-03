import type { LearningResource } from "../activities/content";
import type { Lesson } from "./lesson";
const cobit={title:"ISACA — COBIT",url:"https://www.isaca.org/resources/cobit",kind:"reference"} satisfies LearningResource;
const itil={title:"PeopleCert — ITIL",url:"https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1",kind:"reference"} satisfies LearningResource;
const iso38500={title:"ISO/IEC 38500 — Governance of IT overview",url:"https://www.iso.org/standard/62816.html",kind:"reference"} satisfies LearningResource;
const isoMgmt={title:"ISO — Management System Standards",url:"https://www.iso.org/management-system-standards.html",kind:"reference"} satisfies LearningResource;
const nistCsf={title:"NIST Cybersecurity Framework 2.0",url:"https://www.nist.gov/cyberframework",kind:"reference"} satisfies LearningResource;
const resourcesByTechGovernance:Record<string,LearningResource[]>={
 "technology-governance-business-technology-alignment":[cobit,iso38500],"technology-governance-value-delivery":[cobit],
 "technology-governance-resource-stewardship":[cobit,iso38500],"technology-governance-performance-oversight":[cobit],
 "technology-governance-governance-structures":[iso38500,cobit],"technology-governance-cobit-concepts":[cobit],
 "technology-governance-itil-service-management":[itil],"technology-governance-iso-management-systems":[isoMgmt],
 "technology-governance-nist-framework-landscape":[nistCsf],"technology-governance-frameworks-without-checklists":[iso38500,cobit],
};

// Frameworks are not the teaching plan. Cases show when each lens changes a concrete decision.
const frameworkCases: Record<string, {title:string; mechanism:string; failure:string; transfer:string}> = {
  "technology-governance-cobit-concepts": {
    "title": "Use COBIT to separate evaluation, direction and monitoring from execution",
    "mechanism": "Illustrative Steward situation: failed release gates are being overridden. Governance first EVALUATES stakeholder risk and evidence, then DIRECTS a minimum release-acceptance rule with assigned risk authority, then MONITORS overriden releases and escaped defects. Management PLANs who fixes the pipeline, BUILDs the checks, RUNs the deployment and MONITORS the job status. These are different kinds of accountability; they may be enacted by different people without requiring a separate committee for each objective. The observable artifact is a decision-rights and evidence map, not a completed framework checklist.",
    "failure": "A team says it has implemented COBIT because an audit spreadsheet marks every process green, yet a developer can still override a failing authorization gate with no traceable approval. Names and ratings are not functioning control evidence.",
    "transfer": "Create a three-row Evaluate/Direct/Monitor mapping for an untested database restore objective; add management actions underneath and name one observation that would force governance to revisit its direction."
  },
  "technology-governance-itil-service-management": {
    "title": "Follow service value through incident, problem and change",
    "mechanism": "Illustrative service event: Steward sends an accepted response but the downstream registration outcome never reaches the consumer. The INCIDENT process restores expected service or establishes a safe workaround and communicates customer impact. PROBLEM work investigates the recurring cause, for instance a missing event acknowledgement, even after the incident is resolved. CHANGE work evaluates and deploys a corrective fix with rollback and evidence. A service owner coordinates consumers' expectations and measures whether the service now delivers the intended outcome. A successful deployment alone is an output, not restored service value.",
    "failure": "Mark an incident resolved because a patch merged, despite the unreconciled records and absent customer outcomes. Another error is forcing every low-risk documentation change through an emergency change meeting.",
    "transfer": "Map a two-hour database outage to incident restoration, persistent problem investigation, change validation and consumer communication. Explain the point where each activity ends and the evidence of actual recovery."
  },
  "technology-governance-iso-management-systems": {
    "title": "Show a Plan–Do–Check–Act loop with a failing control",
    "mechanism": "Illustrative management-system cycle for backup recovery: PLAN states approved RTO, owner, control design and measurement; DO configures scheduled backups and a rehearsal; CHECK records the timed isolated restore, checksum and application readback; ACT revises the runbook, recovery design or objective through authorized review when measured recovery misses target. Audit evidence must reference the exact rehearsal date, environment and result. A published policy proves intent, while an observed restore proves operation within that specific tested scope.",
    "failure": "Claim compliance because backup-job logs are green even though no restore has been tried. Conversely, changing an RTO threshold after a failed exercise without delegated authority is not continuous improvement.",
    "transfer": "Apply Plan–Do–Check–Act to an access review where user departures are not promptly reflected in privileges; define one corrective action, one verification and a threshold requiring escalation. Do not claim ISO certification."
  },
  "technology-governance-nist-framework-landscape": {
    "title": "Choose the guidance family that matches the decision",
    "mechanism": "Illustrative change: a Steward API permits a denied ownership transfer to mutate records. Cybersecurity Framework (CSF) outcomes help articulate desired governance/protection/detection responsibilities. Risk Management Framework (RMF) concepts help assign assessment, authorization and monitoring decisions for the affected service boundary. Secure Software Development Framework (SSDF) practices inform the software lifecycle—secure design, code review, test and evidence of defect correction. These are complementary lenses, not three substitute implementations. Start from the failed business invariant, select the smallest relevant guidance, then map it to an accountable owner and test artifact.",
    "failure": "A report cites one NIST control family and treats that citation as proof that the HTTP denial is safe; or sends a software-design issue solely through enterprise risk paperwork without testing the effect.",
    "transfer": "A third-party package has unverifiable provenance while an access-control policy exception has expired. Select the first useful NIST guidance families for each, explain which technical evidence still must be produced and who may accept residual risk."
  },
  "technology-governance-frameworks-without-checklists": {
    "title": "One demonstrated control may serve several objectives, but not every objective",
    "mechanism": "Illustrative case: an organization wants traceability for unauthorized ownership-transfer attempts. A source-controlled denial/read-after-denial test, linked to a requirement, reviewed at the correct commit, can support a secure-development practice, a control-assessment record and a service-release gate. Map those three governance questions to the exact same technical artifact, then identify what is NOT proved: live production authorization policy, alert receipt, data retention legality and real user behavior. The efficient decision is to reuse evidence where its scope truly matches, not multiply identical committees.",
    "failure": "Four frameworks produce four identical sign-off forms, while nobody tests state after a 403; or a single green unit test is used to claim every control across all frameworks is satisfied.",
    "transfer": "For a recent restore rehearsal, map the evidence to service continuity, technology risk and assurance needs. Identify two governance claims that the restore log cannot support, and reject at least one unnecessary review meeting."
  },
  "technology-governance-business-technology-alignment": {
    "title": "Trace an outcome through capability, risk and an acceptance decision",
    "mechanism": "Illustrative stakeholder request: 'onboard service owners twice as fast'. First define the outcome (verified owner assignment within an agreed time), establish the baseline from service records, and trace to the capability that could change it—an accountable owner-lookup and approval workflow. Compare process simplification, an internal workflow and a purchased service. For each, identify security/privacy constraints and measured cycle time, then reject assumptions about a new tool until a controlled pilot demonstrates improvement. Record one decision owner and the trigger for review.",
    "failure": "Approve a new directory platform because teams ask for 'modern onboarding' without measuring whether the delay is approvals, missing identity data or runtime performance. The platform may ship and the business outcome remain unchanged.",
    "transfer": "A sponsor wants '90% fewer incidents' in six months. Translate the phrase into one measurable outcome, a plausible capability hypothesis, necessary baseline evidence, realistic alternatives and a governance review trigger."
  },
  "technology-governance-value-delivery": {
    "title": "Separate production output from outcome and causality",
    "mechanism": "Illustrative improvement: release automation halves manual deployment steps, but production change failures increase. Deployment count is an output; business value depends on whether users receive more reliable functionality with acceptable operating cost. Record pre/post change failure, recovery duration, affected users and support load with comparable definitions. A single before/after correlation is not proof of causality; investigate the change mix and missing mandatory tests. Approve another increment only if evidence supports the expected outcome.",
    "failure": "Claim value because six dashboards and twenty pipeline jobs were built even though no operational decision changes and outages become longer.",
    "transfer": "Assess a proposed portal rewrite with an expensive migration. Define a measure of user value, an operational cost signal, an alternative to rewriting and a falsifying pilot outcome."
  },
  "technology-governance-resource-stewardship": {
    "title": "Count recurring human and lifecycle cost, not just purchase price",
    "mechanism": "Illustrative hosted CI proposal: vendor price is lower than a self-hosted runner invoice, but projected migration, retention, secret handling, operational support and exit work may reverse the comparison. Build a three-year illustrative ledger with one-time, recurring, variable and uncertain items; separately record risk of source unavailability and loss of release evidence. Compare retaining current runners, hardening them and migrating. Use a bounded proof-of-concept to measure execution time and artifact retrieval before committing. An unknown cost is marked unknown, not zero.",
    "failure": "Approve the cheapest monthly subscription while overlooking required encrypted artifact retention or a vendor-specific build plugin with no exit route.",
    "transfer": "Compare managed logging with local Graylog for an organization with a small SRE team; list cost categories, nonfinancial constraints and the evidence needed to reject both choices for now."
  },
  "technology-governance-performance-oversight": {
    "title": "Design a metric with source, owner, response and gaming resistance",
    "mechanism": "Illustrative governance objective: maintain reliable recovery. Indicator A is backup job success count; indicator B is elapsed time for the last isolated restore with application readback. B is closer to the intended objective. Specify collection location, population, timestamp, target as approved by the service owner, confidence/limitations and exactly who acts after a breach. Include a countermeasure that shows if a team has stopped running difficult recovery exercises to keep the score green.",
    "failure": "Report '100% successful backups' as an RTO guarantee while the only restore took six hours. A metric without a response owner provides decoration rather than oversight.",
    "transfer": "Design a metric pair for deployment quality that cannot be optimized solely by hiding failed tests or reducing the number of deployments. Provide one intervention if the signals diverge."
  },
  "technology-governance-governance-structures": {
    "title": "Route a real decision to the smallest competent accountable group",
    "mechanism": "Illustrative changes: a harmless formatting refactor remains with the engineering owner; a new regulated-data export triggers data-owner, security and legal-policy consultation; retirement of a shared identity service involves business continuity, operations, security and lifecycle authority. Construct a decision table: risk scope, accountable decider, required consultation, veto/stop-the-line criteria if delegated, escalation threshold and deadline. A governance forum is justified only where it resolves actual cross-boundary responsibility.",
    "failure": "A single architecture committee approves every commit and simultaneously claims sole authority to accept every privacy risk, despite lacking the business/legal mandate.",
    "transfer": "Assign decision rights for a low-risk dependency patch, a new production third-party data processor and a failed critical control. Defend the different participation and evidence requirements."
  }
};

// A named IT-governance framework is a decision lens, never evidence that the
// operational service met its underlying outcome. Teach each boundary explicitly.
const technologyGovernanceConcepts:Record<string,{prerequisites:string;mechanism:string;alternatives:string;failure:string}> = {
  "technology-governance-business-technology-alignment": {
    "prerequisites": "Business outcomes are user or organizational changes, not a list of technical assets. Know the capabilities that actually exist in the final Architect estate and distinguish an expected service outcome from a Jira delivery task. A technology can operate correctly while providing no measurable value. You must be able to trace a requirement to acceptance criteria and an observed user effect.",
    "mechanism": "Start with a hypothetical objective: route service incidents to an accountable team without cross-team assignment errors. Define what success means—percentage of incidents routed correctly, correction delay and denied improper owner changes—before choosing infrastructure. Map required business capability to team ownership data, approval workflow, API, data store, delivery and support. Attach each technical component to an actual, measurable dependency on the outcome. Examine a counterexample: adding a distributed queue increases throughput yet incorrect owner data persists; the spend did not improve incident routing. Identify business sponsor/decision authority, capability owner, signal source and an evidence-driven planning trigger. Keep unmeasured values UNKNOWN rather than inventing 99% targets.",
    "alternatives": "A roadmap aligned by matching product names to departments is weaker than a causal outcome map. Alignment can be achieved by improving data quality or escalation process without buying technology. If constraints conflict, make the opportunity cost explicit and seek the appropriate authority instead of assuming any technical preference is a business mandate.",
    "failure": "The roadmap commits to Keycloak migration because it appears in a reference architecture, though no one has established the identity bottleneck behind misrouted incidents. The plan is technology-led, not outcome-led."
  },
  "technology-governance-value-delivery": {
    "prerequisites": "Delivery output (features shipped, PRs merged, servers available) differs from outcome (users recover faster, fewer ownership errors) and benefit (economic or organizational consequence). Benefits may be uncertain or delayed. Distinguish baseline observations from estimates and don't treat a 1–5 subjective score as financial return on investment.",
    "mechanism": "Construct a benefit chain: observed user issue → intervention → leading signal → business outcome → cost and new risk. For example, a data-quality validation may reduce wrongly routed incidents. Establish the initial misrouting rate from complete incident records, deploy a bounded correction pilot, then compare measured corrective routing without changing the denominator to hide failures. Include delivery labor, support workload and residual data-privacy exposure. Record what would make the investment a failure or require rollback, including unintended access escalation. Evaluate value at agreed checkpoints rather than declaring it at launch. The accountable sponsor owns the benefit decision; engineering supplies evidence about mechanism and costs.",
    "alternatives": "Qualitative value is legitimate when precise monetary data is missing, provided assumptions and uncertainty remain visible. A reduced unit cost that worsens reliability or customer harm is not clear value. Delivering fewer carefully chosen controls can outperform publishing more new features if existing service outcomes are unsafe.",
    "failure": "A dashboard calls a rewrite '150% ROI' based only on enthusiastic interview scores. Without defensible costs, benefit population and counterfactual, this is fabricated precision rather than measured value."
  },
  "technology-governance-resource-stewardship": {
    "prerequisites": "Technology resources include people, time, operational support, compute, licensing, intellectual property, vendor capacity and recoverability. The largest apparent budget item may not be the dominant risk: one engineer with unrehearsed restore knowledge can be a critical resource dependency. Know the distinction between one-time project spend and lifecycle ownership.",
    "mechanism": "Inventory the actual active services and critical responsibilities. For a new message broker, calculate or estimate separately infrastructure, monitoring, patching, on-call skills, upgrade and migration labor, incident recovery, training and exit path; mark estimates explicitly. Compare with using the existing queue and fixing idempotency, including residual duplicate-effect risk. Trace the staff opportunity cost: time on broker operations cannot also be spent on a verified authorization defect. Select investment constraints such as maximum committed team hours and operational readiness, then seek financial or risk authority if beyond delegation. Periodically review unused capacity and orphaned ownership rather than equating high utilization with good stewardship.",
    "alternatives": "Central pooling can reduce duplication but creates new dependency and coordination risk; local autonomy can be fast but may fragment support. Choose resource allocation against observed outcomes and resilience, not an arbitrary effort-equalization scheme.",
    "failure": "A low-priced managed service wins solely on subscription cost, but no one can operate or migrate it after a regional outage. The total resource obligation and exit risk were ignored."
  },
  "technology-governance-performance-oversight": {
    "prerequisites": "A metric requires a defined population, source, unit, period, owner and interpretation; a green average can conceal failures in critical cohorts. Distinguish activity measures (jobs run), service indicators (successful authorized outcomes) and risk indicators (overdue support/restore evidence). SLO targets require authorized acceptance and measurement rules.",
    "mechanism": "Choose a specific decision: whether owner-update service quality is adequate for broader rollout. Define signals such as correct committed owner updates per eligible attempt, prohibited writes with durable after-state, user-visible latency percentile with population, consumer processing lag, and age of last proven recovery. Specify numerator, denominator, sampling period and excluded statuses. Write the action tied to each threshold—stop release, investigate, scale or accept with authority. Challenge the scorecard with an incident in which the pipeline is 100% green because the mandatory authorization tests are not selected. Ensure the result becomes Unknown or Red, and that an owner is notified. Different stakeholders may need different views, but their underlying facts must remain consistent.",
    "alternatives": "Few causal indicators beat dozens of vanity dashboards. Automated collection is usually better for CI and event evidence, while governance still decides whether the metric represents the right outcome. Don't force arbitrary numerical SLOs when no approved service obligation or baseline exists.",
    "failure": "Average latency falls after silently dropping all failed requests from the denominator. A reported improvement is unusable until the measurement population and error budget are trustworthy."
  },
  "technology-governance-governance-structures": {
    "prerequisites": "A governance structure is a set of decision roles and accountability routes; it need not be a board or committee. Distinguish who evaluates direction, who manages implementation, who operates controls and who verifies outcomes. A RACI chart without actual delegated rights can codify a fiction.",
    "mechanism": "Map decisions by consequence: local reversible code change, shared interface/architecture change, production data-purpose or high-residual-risk decision. For each give default accountable decider, required technical input, stop condition, evidence, escalation and periodic review. Test one contested scenario: a release is green except for a missing cross-tenant authorization result. The release manager can stop deployment under an approved gate, QA supplies evidence, security advises on threat consequence, and a truly authorized business/security delegate handles any acceptability decision; do not presume a technical manager can waive the rule. Use minimal forums that settle *real* cross-functional conflicts and publish a decision with review trigger. Audit whether the system changed the outcome, not whether minutes were recorded.",
    "alternatives": "Universal governance committees can introduce delay and conceal ownership. Unrestricted team autonomy can underprotect shared data and services. Risk-tiered delegation combined with transparent escalation and accountable outcomes is usually stronger than committee proliferation.",
    "failure": "Five committees signed a release but none had authority over the customer data control and none inspected the failed denied-effect test. Numerous signatures are not a decision-right model."
  },
  "technology-governance-cobit-concepts": {
    "prerequisites": "COBIT is a governance and management framework from ISACA, not a product, software test or certification of a particular system. Its governance objective orientation distinguishes Evaluate, Direct and Monitor (EDM) from management work. You should already be able to name a business objective, risk owner, evidence source and implementation operator.",
    "mechanism": "Apply EDM to untested database recovery. EVALUATE business consequence, candidate tolerances and missing restore evidence. DIRECT that accountable service owners must produce time-bounded recovery proof and that a defined risk delegate handles exceptions. MONITOR the completion and actual restore result, not just a ticket status. Management then PLANs the rehearsal, BUILDs a disposable restore environment, RUNs the experiment and MONITORs the operational signals. Connect each governance question to an actual evidence artifact with source, owner and date. Do not treat COBIT process names as mandatory organizational roles or a script that decides business risk without human authority.",
    "alternatives": "COBIT concepts can help close decision-rights gaps in complex organizations, but a small service may only need a compact accountability table and two well-designed controls. Reuse evidence from an existing release/runbook instead of generating a separate checklist for every objective.",
    "failure": "The COBIT mapping spreadsheet is 100% filled while an implementer can bypass the authorization gate without a trace. A mapped process does not prove functioning governance."
  },
  "technology-governance-itil-service-management": {
    "prerequisites": "ITIL describes service management practices and value-oriented operating concepts, not a network protocol or proof that a service operates correctly. Recall incident versus problem versus change, the meaning of a service consumer and why technical component uptime may diverge from user outcome. Don't infer a specific ITIL certification or exact organization process from the training case.",
    "mechanism": "Trace a lost-acknowledgement incident. Incident response detects delayed ownership updates, bounds affected consumers, communicates impact and restores the safe service state. Problem work reconstructs the retry/commit timing and establishes a root-cause hypothesis with discriminating tests. Change work introduces idempotent replay and exact artifact/deployment proof. A service owner verifies unresolved historical records were reconciled and updates service obligations and runbooks. Link those practices with a single evidence chain and separate closure conditions: restored consumption, cause addressed and safe code change deployed. Define service value as reliable authorized outcomes rather than 'number of incident tickets closed'.",
    "alternatives": "Forcing every minor bug through a heavyweight process creates delays; letting each team invent incompatible incident IDs obstructs shared investigation. Adapt useful ITIL practice relationships to actual service size and consequence rather than reproducing a framework diagram.",
    "failure": "A problem ticket says root cause fixed when the PR merged, but incident effects and consumer messages remain unresolved. The three practice objectives were conflated."
  },
  "technology-governance-iso-management-systems": {
    "prerequisites": "ISO management-system concepts concern controlled organizational processes, responsibility and continual improvement; naming an ISO standard is not proof of certification or legal conformity. Plan–Do–Check–Act (PDCA) is one useful feedback model. Understand the difference between an approved target, performed action and evidence that the action worked.",
    "mechanism": "Build a PDCA loop around restore readiness. PLAN the scope, actual authority for recovery objective, owner and expected rehearsal criteria. DO create verified copies and exercise a restore into an isolated environment. CHECK measure recovery duration, data integrity and application readback against the *approved* target; explicitly preserve failed and unknown results. ACT repair the runbook, data snapshot procedure or control architecture and schedule re-performance, escalating objective changes to actual business authority. Store versioned control and evidence so the next assessor can repeat the result. A management system is functioning when this feedback changes decisions, not when a policy document exists.",
    "alternatives": "A small team may operationalize PDCA with one issue, one tested runbook and scheduled review rather than a large document repository. Formal external certification is a distinct project requiring scope, auditor and standard-specific evidence, and must not be implied by these lessons.",
    "failure": "A manager responds to a six-hour failed restore by silently extending the four-hour RTO in a slide. Without delegated business approval, the action changed the dashboard rather than the service's recoverability."
  },
  "technology-governance-nist-framework-landscape": {
    "prerequisites": "NIST CSF organizes cybersecurity outcomes; RMF guides risk-management steps for information systems; SSDF provides secure software-development practices. They differ in scope and target audience. NIST SP 800-53 controls, CSF categories and an actual vulnerability test are not interchangeable evidence. Applicability of any framework to a real organization depends on authoritative policy and context.",
    "mechanism": "Take a denied ownership write that nonetheless changed persistent state. CSF can guide the organization's desired govern/protect/detect outcomes and accountability. SSDF informs secure design, threat-aware coding, independent negative tests and supply-chain practices that prevent reintroduction. RMF-type steps can structure formal assessment/authorization and continuous monitoring for a defined system boundary when applicable. Start by identifying the concrete failure and the needed next action: contain the effect, fix authorization, prove state unchanged, then decide residual exposure. Map each guidance lens to the exact question it improves, evidence it still lacks and who may decide. Avoid pretending that citing three NIST documents creates three independent controls.",
    "alternatives": "For a narrow software flaw, secure-development evidence may be the immediate priority rather than a new governance meeting. For a major cross-system authority boundary, enterprise assessment concepts may add real value. Mix frameworks only when they answer distinct questions, and document which are merely references.",
    "failure": "An assessor labels the API 'NIST compliant' because a control ID appears in a wiki, even though a test actor can still mutate another team's record. The source reference is irrelevant to the observed forbidden effect."
  },
  "technology-governance-frameworks-without-checklists": {
    "prerequisites": "Frameworks describe useful governance questions, not answers for a specific service. Shared evidence may support several legitimate assessments, but evidence has a scope: exact artifact, population, interval, environment and expected effect. A unit test may show a function contract without proving production authorization or operational alert receipt.",
    "mechanism": "Create a claim–evidence mapping, not one form per framework. For an authorization control, a signed exact-digest negative request with after-state proof may support secure-development, controls-assurance and release-governance claims. For backup recovery, an isolated timed restore can inform technology risk, resilience and management-system review. Write down where the artifact does NOT transfer: the CI log cannot prove a real customer never saw data; the restore transcript cannot prove enterprise-approved RPO; the negative API test cannot prove production log retention legality. Name the remaining decisions and their real authorities. For each proposed added form, ask whether it increases coverage, independence or detection of a meaningful new failure. Remove duplicate form-filling that changes no decision.",
    "alternatives": "A comprehensive framework mapping may be useful in regulated reporting, but it is a translation layer over authoritative controls and actual observations. The right amount of framework language is what improves traceability and risk decisions—not what fills a framework spreadsheet.",
    "failure": "Four frameworks produce four sign-off decks while the actual denied-write regression is omitted from the release. That organization has more paperwork but less demonstrated protection."
  }
};
function reading(id: string, title: string, body: string): Lesson {
    return {
        id,
        title,
        activities: [{
            id: `${id}-001`,
            title,
            estimatedMinutes: 55,
            content: { type: "reading", body, blocks: [
              ...body.split(/\n\s*\n/).filter(Boolean).map((text) => ({ type: "paragraph" as const, text })),
              ...(technologyGovernanceConcepts[id] ? [
                {type:"heading" as const,id:`${id}-prerequisites`,text:"Prerequisites and limits of the framework",level:2 as const},
                {type:"paragraph" as const,text:technologyGovernanceConcepts[id]!.prerequisites},
                {type:"heading" as const,id:`${id}-mechanism`,text:"Follow the outcome, decision and evidence",level:2 as const},
                {type:"paragraph" as const,text:technologyGovernanceConcepts[id]!.mechanism},
                {type:"heading" as const,id:`${id}-alternatives`,text:"Alternatives and proportional use",level:2 as const},
                {type:"paragraph" as const,text:technologyGovernanceConcepts[id]!.alternatives},
                {type:"callout" as const,tone:"warning" as const,title:"Do not mistake framework terminology for proof",body:technologyGovernanceConcepts[id]!.failure},
              ] : []),
              ...(frameworkCases[id] ? [
                { type: "heading" as const, id: `${id}-case`, text: frameworkCases[id].title, level: 2 as const },
                { type: "paragraph" as const, text: frameworkCases[id].mechanism },
                { type: "callout" as const, tone: "warning" as const, title: "False assurance", body: frameworkCases[id].failure },
                { type: "heading" as const, id: `${id}-transfer`, text: "New decision without the answer", level: 2 as const },
                { type: "paragraph" as const, text: frameworkCases[id].transfer },
              ] : []),
              { type: "resources" as const, title: "Framework/reference", resources: resourcesByTechGovernance[id] ?? [iso38500] },
            ] },
        }],
    };
}

function practical(id: string, title: string, objective: string, instructions: string[], deliverables: string[], completionCriteria: string[]): Lesson {
    return {
        id,
        title,
        activities: [{
            id: `${id}-001`,
            title,
            estimatedMinutes: 180,
            content: {
                type: "practical",
                objective,
                scenario: "Steward is now treated as an organization-owned technology service with business stakeholders, service consumers, architecture and dependency decisions, delivery and operational costs, security and reliability obligations, and accumulated evidence from prior schools. The goal is to govern technology outcomes, not to create framework paperwork.",
                instructions,
                deliverables,
                completionCriteria,
            },
        }],
    };
}

const originalTechnologyGovernanceLessons: Lesson[] = [
    reading("technology-governance-business-technology-alignment", "Business and Technology Alignment", `Technology governance begins with a simple question: why does this technology exist for the organization? Alignment means connecting technology decisions to business outcomes, stakeholder needs, risk appetite and operational reality. It does not mean accepting every business request unchanged. A Technical Steward translates between business intent and engineering consequences.\n\nFor Steward, alignment should trace from stakeholder outcomes to service capabilities, architecture characteristics, controls and measures. A request for faster onboarding, for example, may imply availability, usability, security and delivery-speed requirements that compete with each other. The governance task is to make those tensions explicit and ensure decisions remain connected to organizational value rather than local technical preference.\n\nA useful alignment record identifies the business outcome, affected stakeholders, technology capability, decision owner, measurable success signal, material risks and assumptions. If an engineering initiative cannot explain what organizational outcome it supports, its priority should be challenged.`),
    reading("technology-governance-value-delivery", "Value Delivery", `Technology value is not the amount of software produced. Value is the useful outcome achieved relative to cost, risk and opportunity. A feature that is delivered but rarely used, a platform that costs more to operate than the problem warrants, or a control that slows delivery without meaningful risk reduction can all destroy value.\n\nValue delivery therefore requires explicit expected benefits, observable outcomes and review after implementation. Technical Stewards should distinguish outputs such as releases, dashboards and policies from outcomes such as reduced incident frequency, faster recovery, safer releases, lower lead time or more reliable dependency consumption.\n\nFor Steward, value evaluation should reuse evidence already produced across delivery, quality, security and reliability. Governance should ask whether a proposed investment changes an outcome that matters and whether the expected benefit remains plausible after deployment.`),
    reading("technology-governance-resource-stewardship", "Resource Stewardship", `Resource stewardship means using finite engineering capacity, infrastructure, licenses, cloud spend, support attention and specialist skills responsibly. It is broader than cost cutting. Under-investing in maintenance, observability or security can create future cost and risk just as surely as over-engineering can waste current capacity.\n\nA Technical Steward should expose trade-offs: what work is displaced, what recurring operational burden is created, which skills are required, and whether the organization can sustainably own the chosen technology. Build-versus-buy, cloud-service adoption, retained internal platforms such as Nexus, and shared packages such as steward-common when they actually exist, all carry long-term ownership costs.\n\nGood stewardship considers total lifecycle cost: acquisition, implementation, migration, operations, support, security, upgrades, exit and retirement.`),
    reading("technology-governance-performance-oversight", "Performance Oversight", `Governance needs feedback. Performance oversight defines whether technology is producing the outcomes and control behavior expected of it. The purpose is not to accumulate dashboards but to create enough visibility for accountable decisions.\n\nMeasures should connect to objectives. Service availability, deployment failure rate, recovery time, vulnerability remediation age, dependency freshness, exception age and architecture-debt exposure may be useful when they answer a decision question. Measures without an owner, threshold or response path are weak governance.\n\nTechnical Stewards should also guard against metric gaming. A healthy measure has a defined purpose, data source, review cadence, interpretation limits and expected action when a threshold is crossed.`),
    reading("technology-governance-governance-structures", "Governance Structures", `Governance structures define where technology decisions are made, challenged and reviewed. They may include service owners, architecture forums, security/risk functions, change authorities, product leadership and executive oversight. The structure should match decision scope and risk.\n\nNot every decision belongs in a committee. Local reversible decisions should stay close to the engineers doing the work; cross-cutting, expensive, irreversible or high-risk decisions need broader participation. A useful structure defines decision domains, accountable roles, required consultation, escalation paths and evidence expectations.\n\nFor Steward, the goal is a lightweight model that makes ownership visible across the application, PostgreSQL and the hosting, artifact-repository, internal-package, delivery, security and reliability capabilities actually present in the final Architect estate rather than centralizing every choice in one approval body.`),
    reading("technology-governance-cobit-concepts", "COBIT Concepts", `COBIT provides a governance and management framework for enterprise information and technology. Its most useful TSA lesson is the separation between governance responsibilities—evaluating stakeholder needs, directing priorities and monitoring outcomes—and management responsibilities that plan, build, run and monitor work within that direction.\n\nUse COBIT as a vocabulary and design aid, not a requirement to implement every objective. For Steward, COBIT concepts can help clarify stakeholder value, risk optimization, resource optimization, decision rights, goals and monitoring. The Technical Steward should select only the concepts that solve a real accountability or oversight problem and record why they apply.`),
    reading("technology-governance-itil-service-management", "ITIL and Service-management Concepts", `ITIL contributes service-management thinking: technology should be understood as a service that co-creates value with consumers, not merely as deployed components. Useful concepts include service ownership, value streams, incident/problem/change relationships, continual improvement and balancing utility with warranty.\n\nFor Steward, service-management thinking links architecture and delivery to operational ownership. A production service needs consumers, support expectations, operational readiness, incident paths and improvement loops. The curriculum does not require reproducing ITIL practices mechanically; the learner should adopt only practices that improve Steward's actual service lifecycle.`),
    reading("technology-governance-iso-management-systems", "ISO Management-system Concepts", `ISO management-system standards share recurring ideas: defined scope, leadership commitment, risk-based planning, documented responsibilities, operational controls, performance evaluation, corrective action and continual improvement. The important pattern is the management system itself: objectives lead to controls and evidence, evidence leads to review, and review leads to improvement.\n\nA Technical Steward should understand that documentation is not proof of effectiveness. A written policy may describe intended behavior, while operating evidence shows whether the control actually works. For Steward, this distinction will later support security, quality, service and compliance assurance without pretending that the learning environment is formally certified.`),
    reading("technology-governance-nist-framework-landscape", "NIST Framework Landscape", `NIST publishes multiple frameworks and guidance families rather than one universal checklist. Relevant examples include the Cybersecurity Framework for organizing cybersecurity outcomes, the Risk Management Framework for structured risk decisions, and Secure Software Development Framework guidance for software-development security practices.\n\nThe Technical Steward does not need to memorize every control identifier. The capability is to identify which framework addresses the problem, translate framework outcomes into Steward responsibilities and controls, and preserve traceability between risk, control objective, implementation and evidence. Framework use should improve decision quality and comparability, not create false assurance through checkbox completion.`),
    reading("technology-governance-frameworks-without-checklists", "Using Frameworks Without Checklist Thinking", `Frameworks are maps, not substitutes for judgment. Checklist thinking appears when teams implement controls because a framework names them, without connecting them to context, risk, architecture or evidence. It can also create false confidence: passing a checklist does not prove a system is secure, reliable or well governed.\n\nUse a framework by starting with the governance problem, selecting relevant outcomes, mapping them to existing practices, identifying genuine gaps, assigning ownership and deciding what evidence demonstrates operation. Tailor explicitly and record exclusions or adaptations.\n\nFor Steward, COBIT, ITIL, ISO and NIST should overlap where useful but never be stacked into four parallel bureaucracies. One well-designed control or ownership mechanism can satisfy several framework concepts when the underlying objective is the same.`),
    practical(
        "technology-governance-lab-map-steward-governance-responsibilities",
        "Lab: Map Steward Governance Responsibilities",
        "Design an evidence-based technology-governance map for Steward that connects organizational outcomes, decision rights, service ownership, risk, resources, performance and selected framework concepts.",
        [
            "Identify Steward's primary stakeholders, consumers and organizational outcomes, then trace each outcome to technology capabilities and measurable success signals.",
            "Start from the final Architect actual-stack inventory. Map only current or explicitly transitional technology domains: application/API and background roles, PostgreSQL/outbox, Redis and RabbitMQ if retained, delivery pipeline, hosting/orchestration/GitOps if retained, Kong/Keycloak/Vault where active, the retained artifact-repository capability where active, `steward-common` only if its extraction gate was earned and it remains active, observability components actually retained, security and operational support. Record tsa-test-core only as a future Professional Engineer extraction candidate, not as current estate.",
            "For each domain, assign an accountable owner, key decision rights, required consultations, escalation path and review cadence.",
            "Select only relevant concepts from COBIT, ITIL, ISO management-system thinking and the NIST landscape. For every selected concept, state the governance problem it helps solve.",
            "Define a compact performance-oversight set. Each measure must have a purpose, source, owner, threshold or interpretation rule, and expected action.",
            "Identify at least three resource or value trade-offs and explain how governance should resolve or escalate them.",
            "Produce a responsibility matrix and governance narrative that avoid duplicate forums and duplicate controls.",
            "Record at least one framework concept you intentionally did not adopt and justify why it would add ceremony without sufficient value in Steward's current context."
        ],
        [
            "Business-to-technology alignment map",
            "Technology governance responsibility and decision-rights matrix",
            "Selected-framework mapping with rationale",
            "Performance oversight scorecard definition",
            "Resource/value trade-off analysis",
            "Governance gaps, owners and improvement actions"
        ],
        [
            "Every governance mechanism is tied to an organizational outcome, risk or accountability need.",
            "Governance and management responsibilities are distinguishable.",
            "Framework concepts are tailored rather than copied wholesale.",
            "Performance measures have owners and decision consequences.",
            "Every active technology domain and the retained artifact-repository supply-chain boundary, where one exists, have explicit governance ownership; `steward-common` is governed only if it actually exists, and future tsa-test-core work is not governed as though the package already exists.",
            "The model remains proportionate: local reversible decisions stay local while material cross-cutting decisions receive appropriate oversight."
        ]
    ),
];

/**
 * The 180-minute governance lab originally combined business mapping, retained
 * platform ownership, framework choices and metric review in one completion.
 * Make three separately inspectable results; preserve original lab ID in phase 1.
 */
const governanceLab = originalTechnologyGovernanceLessons.find((entry) =>
  entry.id === "technology-governance-lab-map-steward-governance-responsibilities");
if (!governanceLab) throw new Error("Technology governance lab not found");
const governanceOriginal = governanceLab.activities[0]!;
if (governanceOriginal.content.type !== "practical") throw new Error("Technology governance lab must be practical");
const governanceInput = governanceOriginal.content;
function governancePhase(id:string,title:string,minutes:number,objective:string,
  from:number,to:number,deliverables:string[],completionCriteria:string[]) {
  return {
    ...governanceOriginal, id, title, estimatedMinutes:minutes,
    content: {
      ...governanceInput, objective,
      instructions:governanceInput.instructions.slice(from,to),
      deliverables,completionCriteria,
    },
  };
}
export const technologyGovernanceDeepLessons: Lesson[] = originalTechnologyGovernanceLessons.map((lesson) =>
  lesson.id !== governanceLab.id ? lesson : {
    ...lesson,
    activities: [
      governancePhase(
        governanceOriginal.id, "Phase 1 — Map organizational outcomes to actual estate",
        60, "Identify one real outcome and the current capabilities and owners needed for it, without treating classroom examples as active infrastructure.",
        0, 3,
        ["Stakeholder-to-capability trace with dated evidence cutoff",
         "Active/retired/proposed technology state and business ownership map",
         "Decision-rights map with at least one explicitly unresolved authority"],
        ["The map traces an organizational outcome to a measured or explicitly unknown service signal.",
         "The baseline excludes components the learner has not actually adopted.",
         "A proposed responsibility can be distinguished from a delegated authority; unsupported approvals remain UNKNOWN."],
      ),
      governancePhase(
        `${governanceOriginal.id}-phase-2`,
        "Phase 2 — Choose relevant oversight without framework theater",
        60, "Use the smallest appropriate framework and governance roles to resolve an actual cross-team decision, including a deliberately rejected control or forum.",
        3, 5,
        ["Decision-rights and consultation matrix", "Framework purpose-to-evidence map", "One rejection with cost/risk rationale"],
        ["The chosen concept addresses a specific conflict; memorizing COBIT, ITIL, ISO or NIST names is insufficient.",
         "The learner explains why an irrelevant framework concept or duplicated review is excluded.",
         "Business risk acceptance is not silently attributed to a technology implementer."],
      ),
      governancePhase(
        `${governanceOriginal.id}-phase-3`,
        "Phase 3 — Test the scorecard and choose under conflicting evidence",
        60, "Make an accountable investment/oversight decision in response to conflicting service signals, and define an evidence-gated next review.",
        5, 8,
        ["Scorecard with source, denominator, owner, action threshold and misleading-signal countercheck",
         "Explicit trade-off table with retain/current-state option",
         "Governance-gap decision and assigned follow-up evidence"],
        ["A green KPI cannot pass if its denominator excludes critical failed tests or user outcomes.",
         "At least one plausible investment is rejected and can be reconsidered against new evidence.",
         "Owners, decision authority and monitoring response are explicit; fake precision or decorative metrics fail."],
      ),
    ],
  });
