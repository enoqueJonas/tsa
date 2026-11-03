import type { Activity } from "../activities";
import type { LearningResource } from "../activities/content";
const googleLeading = { title:"Google SRE — The Evolving SRE Engagement Model", url:"https://sre.google/workbook/engagement-model/", kind:"reference" } satisfies LearningResource;
const adr = { title:"Architectural Decision Records", url:"https://adr.github.io/", kind:"reference" } satisfies LearningResource;
const googlePostmortem = { title:"Google SRE — Postmortem Culture", url:"https://sre.google/sre-book/postmortem-culture/", kind:"reference" } satisfies LearningResource;
const resourcesByLeadership:Record<string,LearningResource[]>={
 "technical-leadership-technical-ownership":[googleLeading],"technical-leadership-influence-without-authority":[googleLeading],
 "technical-leadership-decision-making":[adr],"technical-leadership-technical-communication":[adr],
 "technical-leadership-mentoring":[googleLeading],"technical-leadership-engineering-reviews":[adr],
 "technical-leadership-escalation-responsible-challenge":[googlePostmortem,googleLeading],
};
import type { Lesson } from "./lesson";
// Each case is tied to its authored reading. Examples are deliberately illustrative,
// not evidence from a deployed Steward environment or a substitute for novice assessment.
const leadershipCases: Record<string, { title: string; worked: string; failure: string; transfer: string }> = {
  "technical-leadership-technical-ownership": {
    "title": "Trace ownership from detection to an accepted outcome",
    "worked": "Illustrative incident: a scheduled Steward reconciliation produces no completion record. The QA engineer owns the missing-result assertion and failure evidence; operations owns restoring the job; the service owner owns the external user consequence; a designated risk authority decides whether an incomplete run may be accepted. First record the affected run ID and independently observable absence, then map who can inspect, change, approve and communicate. Give one named owner the end-to-end coordination responsibility, without pretending that owner personally performs every action. Define a recovery checkpoint and a next-run verification. A ticket labelled 'platform team' is an assignment pool, not an accountable individual.",
    "failure": "Failure to catch: everyone lists the incident as 'owned' because a channel or team was tagged, but nobody has authority to approve the reconciliation exception. The technical owner must escalate the decision rather than silently treat a green rerun as business acceptance.",
    "transfer": "A privileged access token expires during an incident. Produce a four-role ownership and decision-rights map that prevents the engineer who rotates the token from also silently accepting an authentication bypass. State the independent evidence required to close the issue."
  },
  "technical-leadership-influence-without-authority": {
    "title": "Build alignment without giving away the release safety boundary",
    "worked": "Illustrative release conflict: a product lead wants to ship on Friday; QA has a reproducible unauthorized ownership change after a denied request. Start by describing the shared goal (safe delivery) and the concrete failed invariant (403 response, but the owner record still changed). Hear product's deadline consequence and operations' rollback constraints. Offer three options: defer the affected change, ship an independently isolated unaffected slice, or repair the authorization defect and retest before release. State which risks cannot be accepted by the engineer alone. Ask the accountable release/risk owner for a time-boxed decision using the same evidence, not for a vote on whether the defect exists.",
    "failure": "Failure to catch: 'influence' means persuasive rhetoric to secure consensus, while the unauthorized mutation is downgraded without explicit authority. A compromise about schedule is possible; a silent waiver of an ownership invariant is not.",
    "transfer": "A third-party library enters end-of-support during a busy delivery quarter. Write separate concerns for QA, security, finance and product; propose a minimal agreement with owner, funded next action and an escalation trigger. Do not claim consensus where one party has not agreed."
  },
  "technical-leadership-decision-making": {
    "title": "Use reversibility and evidence to choose how much process is justified",
    "worked": "Take the original 3-of-20 intermittent test failures as a hypothesis, not proof of flakiness. Before allowing a quarantine, capture failed assertion, commit, runner and fixture state for three clean reruns; compare whether the product invariant ever fails. If the cause is an isolated test race, choose a named, expiring quarantine with a separate enforced product-safety check and an owner to remove the race. If the failures reflect a real product defect, quarantine is the wrong intervention even if it makes delivery faster. A decision record has a deadline, observation threshold, explicit owner and reversal trigger.",
    "failure": "Failure to catch: disable the test because 85% of recent runs passed. That score is not a product safety oracle, and the absence of red CI output hides rather than eliminates the uncertainty.",
    "transfer": "A team proposes buying a premium hosted test tool to replace an unreliable self-hosted one. Separate observed operating cost from vendor promises, include retaining the existing system as a real option, and identify the evidence that should reverse a six-month decision."
  },
  "technical-leadership-technical-communication": {
    "title": "Keep one factual core while changing the audience",
    "worked": "Illustrative evidence: a release candidate failed an owner-change denial check in 2 of 10 isolated runs. For engineers: 'POST /transfer returned 403, but a subsequent GET showed owner B; response trace and IDs are attached; cause unknown.' For service owners: 'An unauthorized ownership effect is possible in the release candidate; QA has blocked the affected change pending a verified fix and retest.' For leadership: 'Release risk: an access-control invariant is not reliably enforced. Proposed decision: hold the affected change; next evidence checkpoint at 15:00.' The three messages preserve the same observation and uncertainty; details vary with the recipient's decision.",
    "failure": "Failure to catch: an executive slide says 'security breached in production' when only a synthetic candidate test failed. Another failure is 'green build' as reassurance when a higher-risk acceptance invariant is failing.",
    "transfer": "Translate a timed database restore result that exceeded a proposed recovery objective into an engineer runbook note, a service-owner impact note and an executive decision request. Identify one material uncertainty that must remain in every version."
  },
  "technical-leadership-mentoring": {
    "title": "Diagnose the misconception, then prove independent transfer",
    "worked": "A junior engineer suggests that retrying every timed-out POST is safe because a timeout means the server did nothing. Ask them to draw two timelines: one where the server never commits, another where it commits but the response is lost. Show only the minimum hint—client timeout does not report transaction state—and ask for a unique request key plus server-side result lookup. Let them write the test plan: original request commits once; replay of the same key returns the same result; replay with a different payload is rejected. Review their evidence without rewriting their answer.",
    "failure": "Failure to catch: the mentor supplies the exact code and then grades the learner for copying it. Another false positive is a retry test that only asserts HTTP 200 and never checks the durable business effect.",
    "transfer": "Without access to the preceding example, ask the learner to reason about a queued notification whose consumer restarts after persisting work but before acknowledgement. Require an unseen failure case and the invariant that would detect duplicate effects."
  },
  "technical-leadership-knowledge-continuity": {
    "title": "Test whether a second person can recover without oral context",
    "worked": "Illustrative on-call tabletop: the only database recovery specialist is unavailable. The deputy is given an incident ID, a runbook and a test restore environment. They must locate the backup, validate its timestamp/checksum, restore to the isolated target, check authoritative record counts and document elapsed time against the approved recovery objective. The primary owner may not give hints. Record each missing permission, ambiguous instruction, undocumented dependency and failed assertion. Give the next owner a dated remediation item and rerun the exercise.",
    "failure": "Failure to catch: two names appear on the rota but the deputy cannot access the backup key or identify which data snapshot is authoritative. Documentation coverage is not recovery capability.",
    "transfer": "Design an uncoached handoff for GitLab scheduled pipeline ownership: schedules, protected variable access, failure notification and artifact provenance. Define the exact pass/fail evidence and how to prevent dangerous production writes during the tabletop."
  },
  "technical-leadership-engineering-reviews": {
    "title": "Separate evidence-backed blockers from preferences in a review",
    "worked": "Illustrative proposal: change authentication token validation in a gateway shared by Steward and another service. The pre-read contains old/new trust boundaries, sample denied and authorized requests, rollback path and the identity owner's constraints. The review chair records a required denial-with-unchanged-state test as a blocker; a request to rename a private helper is advisory. A security reviewer dissents on key-rotation failure mode, so the chair documents the unknown, owner, planned experiment and decision deadline rather than declaring unanimity. The decision record says what can proceed and what must wait.",
    "failure": "Failure to catch: a review records only 'approved by everyone' without test artifacts, a dissent log or accountable release authority. A design preference must not be upgraded into an unchallengeable security requirement.",
    "transfer": "Facilitate a hypothetical database schema migration review. Classify one backward-compatibility finding, one monitoring concern, and one naming preference. For each, state the evidence that would justify blocking or proceeding."
  },
  "technical-leadership-escalation-responsible-challenge": {
    "title": "Escalate an unresolved decision rather than a colleague disagreement",
    "worked": "Illustrative incident: a critical identity-provider integration is rejecting valid users; operators propose bypassing signature checks to meet a recovery target. The engineer first documents the error, test evidence, available safe rollback, expected customer harm and why the bypass would remove authentication assurance. If the normal incident lead cannot resolve the risk within their authority, escalation requests an explicit decision from the security/risk owner: use rollback or maintain degraded service while fixing the trust issue. Include urgency, the decision deadline, fallback and what event will reopen the escalation.",
    "failure": "Failure to catch: bypass signature verification quietly as a temporary code change without time limit, approval or evidence. The opposite failure is escalating a harmless formatting disagreement as a critical risk to win an argument.",
    "transfer": "A production emergency change has neither a verified rollback nor clear approver. Write the smallest escalation record that distinguishes the observed facts, unacceptable uncertainty, authorized choices, communication responsibility and closure proof."
  }
};


function lesson(id: string, title: string, body: string, practice: string[]): Lesson {
    const reading: Activity = {
        id: `${id}-reading`,
        title,
        estimatedMinutes: 55,
        content: { type: "reading", body, blocks: [
          ...body.split(/\n\s*\n/).filter(Boolean).map((text) => ({ type: "paragraph" as const, text })),
          ...(leadershipCases[id] ? [
            { type: "heading" as const, id: `${id}-worked`, text: leadershipCases[id].title, level: 2 as const },
            { type: "paragraph" as const, text: leadershipCases[id].worked },
            { type: "callout" as const, tone: "warning" as const, title: "How a convincing-looking decision fails", body: leadershipCases[id].failure },
            { type: "heading" as const, id: `${id}-transfer`, text: "Apply without the worked answer", level: 2 as const },
            { type: "paragraph" as const, text: leadershipCases[id].transfer },
          ] : []),
          { type: "resources" as const, title: "Continue learning", resources: resourcesByLeadership[id] ?? [adr] },
        ] },
    };
    const practical: Activity = {
        id: `${id}-practice`,
        title: `Practice: ${title}`,
        estimatedMinutes: 60,
        content: {
            type: "practical",
            objective: `Apply ${title} to a real Steward technical-leadership situation.`,
            scenario: "Steward is now a mature internal technology service whose active responsibilities come from the final Architect actual-stack inventory: application and data responsibilities plus the platform, delivery, security and reliability capabilities actually retained. Earlier technologies that were simplified, replaced, retired or deferred remain decision history rather than active ownership targets. You are responsible for improving technical outcomes even when you do not have formal authority over every contributor or stakeholder.",
            instructions: practice,
            deliverables: ["Decision or review artifact", "Evidence and rationale", "Follow-up or ownership record"],
            completionCriteria: ["The recommendation is grounded in evidence and explicit trade-offs.", "Ownership and next actions are clear without relying on positional authority.", "Technical leadership improves decision quality rather than becoming ceremony or control for its own sake."],
        },
    };
    return { id, title, activities: [reading, practical] };
}

export const technicalLeadershipDeepLessons: Lesson[] = [
    lesson("technical-leadership-technical-ownership", "Technical Ownership", "Technical ownership means accepting responsibility for the health and evolution of a technology outcome, not personally doing every task. A technical steward keeps the service's architecture, quality, security, reliability, operability, dependency lifecycle and engineering health visible; identifies unclear ownership; follows decisions through to evidence; and makes sure risks do not disappear between team boundaries. Ownership is strongest when authority, responsibility and escalation paths are explicit. Steward gives you a concrete system in which ownership spans the current application/data estate, retained delivery/platform capabilities, production operations and governance artifacts. Include Nexus or `steward-common` only when they remain active and the package extraction gate was earned; `tsa-test-core` does not exist yet at Technical Steward and is not a current ownership target. The goal is not heroics. The goal is a system where important decisions have owners, evidence and follow-through.", ["Map Steward's major technical responsibilities and current owners.", "Identify one responsibility that is fragmented, implicit or unowned.", "Define the decision rights, expected evidence, escalation path and review cadence for it.", "Explain what you own directly, what you influence, and what must remain owned elsewhere."]),
    lesson("technical-leadership-influence-without-authority", "Influence Without Authority", "Senior technical work often depends on people you do not manage. Influence therefore comes from credibility, context, evidence, clarity, relationships and the ability to frame a decision around shared goals. Effective influence starts by understanding the stakeholder's incentives and constraints, then making the problem legible: what is happening, why it matters, what options exist, what each option costs and what decision is needed. Technical stewards should avoid both command-and-control behavior and passive 'I only advise' behavior. For Steward, a proposal to change a package policy, production control, architecture boundary or delivery practice may require agreement from developers, QA, security, operations and business owners. The steward's job is to build alignment while preserving responsible challenge.", ["Choose one Steward improvement that requires cooperation from at least two roles you do not control.", "Write the shared objective, each stakeholder's likely concern, and the evidence that matters to them.", "Prepare a concise recommendation with options rather than a unilateral instruction.", "Record where compromise is acceptable and where a technical or risk boundary should not be traded away."]),
    lesson("technical-leadership-decision-making", "Decision-making", "Good technical decision-making separates facts, assumptions, constraints, preferences and unknowns. Reversible decisions should usually be lightweight; expensive, hard-to-reverse or high-risk decisions deserve deeper analysis and explicit records. A steward defines the decision, identifies the decision owner, gathers sufficient evidence, compares credible options including 'do nothing', makes trade-offs visible, sets a decision deadline, and records reconsideration triggers. Consensus is useful but is not always required. Endless consensus-seeking can be as harmful as unilateral decision-making. Steward's prior ADRs, incidents, SLOs, capacity results, security findings and architecture reviews provide the evidence base for disciplined technical decisions.\n\nWorked decision: a deployment pipeline sometimes fails during a shared integration test. The observation is three failures in twenty runs; the cause is not yet established. Option A disables the test, improving apparent delivery speed but removing coverage. Option B retains the gate, captures failing test output and investigates fixture isolation; it delays some releases but preserves a meaningful signal. Option C quarantines only the reproducibly flaky test with a named owner, expiry date and a separately enforced critical-path check. The decision owner chooses B initially because the failure's cause and risk are unknown; an agreed two-week review compares failure logs, rerun behavior and missed defect evidence. If logs demonstrate non-product nondeterminism, revisit C with an expiry rather than quietly disabling the gate. The 3/20 count is a hypothetical exercise input, not measured Steward performance.", ["Select one unresolved or hypothetical Steward technical decision.", "Separate observed facts, assumptions, constraints and unknowns.", "Compare at least two credible options plus retaining the current state where appropriate.", "Name the decision owner, decision deadline, chosen option and explicit reconsideration trigger."]),
    lesson("technical-leadership-technical-communication", "Technical Communication", "Technical communication is the ability to make the right level of detail available to the right audience so that decisions and actions can happen. The same issue may need an engineer-level explanation, an operational summary and an executive risk statement. Strong communication leads with the decision or consequence, then supplies evidence, trade-offs and details at progressively deeper levels. It avoids both jargon dumping and oversimplification that hides material risk. Written records are especially important because Steward's decisions outlive meetings and individual contributors. A good technical steward can explain why a change matters, what evidence supports it, what remains uncertain, who must act and what happens if no action is taken.", ["Take one Steward architecture, reliability, security or dependency issue.", "Write a one-paragraph engineer explanation, a one-paragraph service-owner explanation and a three-sentence executive summary.", "Ensure the facts and risk remain consistent across all three audiences.", "Identify what detail was intentionally omitted from each version and why."]),
    lesson("technical-leadership-mentoring", "Mentoring", "Mentoring is not giving answers faster. It is helping another engineer improve judgment, capability and independence. A steward diagnoses the learner's current mental model, asks questions that expose reasoning, provides targeted context, demonstrates when useful, and then returns ownership to the learner. Mentoring should distinguish skill gaps from missing context, unclear expectations or unsafe system boundaries. Review feedback should explain why something matters and what principle can transfer to the next problem. In Steward, prior curriculum artifacts create realistic mentoring material: ADRs, test design, incident analysis, package boundaries, security findings and operational runbooks can all be used to teach reasoning rather than rote procedure.\n\nWorked mentoring exchange: a learner proposes retrying every failed API request. Ask first whether a POST could have committed despite a timeout, then how a retry could create a duplicate and what evidence would distinguish those states. Offer a hint about idempotency keys and server-side deduplication, not a ready-made patch. Demonstrate with a hypothetical transfer request whose first response is lost: a second request with the same key should return the recorded result without applying the operation twice, while a distinct key represents a separate attempt. Ask the learner to design a negative test for mismatched payloads under the same key. Independent success is a runnable test and a reasoned explanation of ambiguous outcomes, not repetition of the mentor's answer.", ["Choose a Steward artifact containing a decision another engineer could reasonably misunderstand.", "Define the principle you want the engineer to learn rather than the answer you want them to copy.", "Prepare three diagnostic questions, one hint and one worked example.", "Define evidence that would show the engineer can now apply the principle independently."]),
    lesson("technical-leadership-knowledge-continuity", "Knowledge Continuity and Succession", "A system is not sustainably owned when safe operation depends on one person's memory, credentials or undocumented judgment. Technical stewardship deliberately reduces knowledge concentration through durable decisions, executable runbooks, shared access paths, pairing/review, cross-training and explicit ownership handoff. The goal is not for everyone to know everything; it is for critical responsibilities to have enough independent coverage that absence or role change does not turn into an incident. Steward should therefore distinguish healthy expertise from a single-person dependency.", ["Identify Steward responsibilities where only one person could currently diagnose, approve or recover the system.", "For each critical concentration, define the minimum second-person capability and durable evidence needed.", "Run a tabletop handoff in which the primary owner is unavailable and another engineer must use the existing ADRs, runbooks, access model and evidence.", "Record the gaps exposed by the handoff and assign remediation without turning documentation volume into the success metric."]),
    lesson("technical-leadership-engineering-reviews", "Engineering Reviews", "An engineering review is a structured challenge of an important technical proposal or system state. It is not a performance ritual and should not become an approval gate for every small change. Reviews are most valuable when risk, irreversibility, cross-team impact, architecture significance or operational consequences justify collective scrutiny. The steward sets the review question, ensures the right evidence and stakeholders are present, distinguishes blocking concerns from suggestions, captures decisions and owners, and avoids reopening settled questions without new evidence. Steward already has architecture, security, quality and reliability review material; this lesson combines those disciplines into one decision-focused review practice.", ["Select a Steward change significant enough to justify an engineering review.", "Define the review question, required pre-read evidence and required participants.", "Classify findings as blocker, material risk, improvement or informational observation.", "Produce the final decision, dissent if any, owners and follow-up evidence expected."]),
    lesson("technical-leadership-escalation-responsible-challenge", "Escalation and Responsible Challenge", "Responsible challenge means raising material technical, security, reliability, compliance or delivery concerns even when doing so is inconvenient. Escalation is appropriate when normal collaboration cannot resolve a risk, when the decision owner lacks required information, when accountability is unclear, or when accepting the risk exceeds someone's authority. Good escalation is specific and proportionate: state the issue, evidence, consequence, attempted resolution, decision needed, urgency and accountable owner. It should never be used to win ordinary disagreements or bypass colleagues. Conversely, fear of escalation should not allow known high-impact risk to remain invisible. Steward's risk registers, incidents, security findings, exceptions and architecture decisions give the learner evidence-based scenarios for practicing this boundary.", ["Choose a Steward scenario where a material concern remains unresolved after normal collaboration.", "Document the evidence, likely consequence, actions already attempted and why escalation is now justified.", "Identify the correct escalation level and the exact decision or support requested.", "Define what outcome would close the escalation and what evidence must be retained."]),
    {
        id: "technical-leadership-lab-lead-steward-technical-review",
        title: "Lab: Lead a Steward Technical Review",
        activities: [
            {
                id: "technical-leadership-lab-lead-steward-technical-review-001",
                title: "Activity 1: Prepare the Review",
                estimatedMinutes: 90,
                content: {
                    type: "practical",
                    objective: "Prepare an evidence-based cross-functional technical review of a meaningful Steward concern.",
                    scenario: "Select a real or credible Steward concern that crosses at least three technical perspectives such as architecture, delivery, quality, security, reliability, data, dependencies or service ownership.",
                    instructions: ["State the review question and why a formal review is proportionate.", "Build a concise pre-read using existing Steward evidence.", "Identify decision owner, contributors, affected stakeholders and any missing expertise.", "Separate facts, assumptions, risks, options and unresolved questions.", "Define which concerns could block the decision and which are advisory."],
                    deliverables: ["Technical review brief", "Stakeholder/decision-rights map", "Evidence pack", "Review agenda and decision criteria"],
                    completionCriteria: ["The review has a concrete decision or risk question.", "Evidence is sufficient for participants to challenge the proposal.", "Participants are selected for relevant expertise and accountability rather than hierarchy alone."],
                },
            },
            {
                id: "technical-leadership-lab-lead-steward-technical-review-002",
                title: "Activity 2: Facilitate Decision and Challenge",
                estimatedMinutes: 105,
                content: {
                    type: "practical",
                    objective: "Demonstrate leadership through facilitation, evidence, trade-offs and responsible challenge rather than positional authority.",
                    scenario: "Run the review as if participants disagree about risk, cost, delivery speed and technical direction.",
                    instructions: ["Present the problem and decision criteria before advocating an option.", "Surface dissent and ask what evidence would change each position.", "Keep discussion anchored to drivers, risks and consequences.", "Distinguish reversible decisions from expensive or high-risk commitments.", "Escalate only if the remaining risk exceeds the decision group's authority or cannot be responsibly resolved."],
                    deliverables: ["Decision log", "Material dissent and challenge record", "Risk/exception decisions", "Action owners and deadlines"],
                    completionCriteria: ["The decision follows from evidence rather than seniority.", "Material dissent is captured rather than suppressed.", "Every unresolved material issue has an owner, risk treatment or justified escalation."],
                },
            },
            {
                id: "technical-leadership-lab-lead-steward-technical-review-003",
                title: "Activity 3: Close the Leadership Loop",
                estimatedMinutes: 75,
                content: {
                    type: "practical",
                    objective: "Turn the review into durable ownership, communication and learning.",
                    scenario: "The value of a review is proven after the meeting through follow-through and improved future decisions.",
                    instructions: ["Publish the decision in the appropriate durable artifact such as ADR, risk record, standard, backlog item or exception.", "Communicate the outcome at the right level to engineers, service owners and other affected stakeholders.", "Define validation evidence and a reconsideration trigger.", "Identify one mentoring or knowledge-sharing opportunity created by the review.", "Retrospect on whether the review added value or unnecessary ceremony."],
                    deliverables: ["Durable decision artifact", "Audience-specific communication", "Validation/reconsideration plan", "Leadership retrospective"],
                    completionCriteria: ["The review outcome survives beyond the meeting.", "Ownership and evidence expectations are explicit.", "The learner can explain both the technical decision and how their leadership behavior improved the process."],
                },
            },
        ],
    },
];
