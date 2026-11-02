import type { LearningResource } from "../activities/content";
export type RequirementsTeachingSection = { title:string; paragraphs:string[]; example?:string; code?:{language:string;caption:string;code:string} };
// This material is unique to each lesson; it is not a generic end-of-lesson scaffold.
export const requirementsWorkedSections: Record<string,RequirementsTeachingSection[]> = {
  "From Requests to Problems": [
    {
      "title": "Perform discovery without turning a request into an answer",
      "paragraphs": [
        "Start with an observation, not the proposed UI. Suppose an engineering lead says, 'We need a dashboard.' The observable event is that an incident was escalated to the wrong team; the consequence was 24 minutes of handoff delay. The proposed dashboard is one hypothesis for reducing that delay. Write four separate lines: observation (what happened), problem (why it matters), outcome (what would improve), and candidate solution (what might achieve it). Keeping them distinct permits a simpler lookup API or corrected ownership data to win against a dashboard.",
        "Follow the causal chain with evidence requests rather than mechanically asking 'why' five times. The actual failure could be stale team membership, an outdated service-owner record, a discoverability problem or incident response training. Each possibility implies a different solution. Ask to inspect a real incident trace, the relevant service record and who last changed ownership. A proposed solution is not yet validated simply because the requester is senior.",
        "Worked discovery record: INCIDENT-17, 'owner lookup sent responders to retired team'; evidence: an incident ticket plus registry history; affected: on-call responder; desired outcome: the correct owning team can be identified during escalation using up-to-date records; unknown: how often wrong ownership occurs. Possible solutions: repair update process, expose an API query or build UI. The chosen intervention depends on the failure evidence.",
        "Counterexample: saying 'We will deliver a dashboard with a new table' as the problem statement prevents considering data freshness or process changes. Diagnostic check: remove every implementation noun from the problem sentence. If it no longer has meaning, you have described a feature, not a user problem."
      ],
      "example": "Independent variation: a team asks for Kafka to solve delayed notifications. Reframe the request into observations, measurable outcome, plausible causes and at least two technology-neutral alternatives before choosing infrastructure."
    },
    {
      "title": "Convert a hypothesis into a disconfirmable observation",
      "paragraphs": [
        "A useful assumption is falsifiable. 'Ownership is wrong because the edit form is confusing' predicts that errors cluster around form submissions. If the registry audit log instead shows no updates for six months, improving form layout may not fix the actual data-ownership process. This distinction between hypothesis and observation is what makes problem framing engineering rather than advocacy.",
        "Build an evidence table with Claim, Evidence now, Evidence missing, Next test, Decision threshold. For the dashboard proposal, sample a clearly defined set of recent escalation incidents and see whether incorrect ownership or poor discoverability dominates; ask an incident responder to locate the team using today's interface. Do not invent a reduction percentage before baseline measurement.",
        "Independent check: a solution can be implemented correctly while the organizational problem remains unchanged. Distinguish 'endpoint returns team ID' (verification) from 'responders identify the correct team reliably when incidents happen' (validation)."
      ]
    }
  ],
  "Stakeholders and Actors": [
    {
      "title": "Trace actors, stakeholders and operational ownership in one scenario",
      "paragraphs": [
        "An actor is a role that interacts with a system for a goal. A stakeholder is anyone whose needs, risks or obligations the result affects, even without interaction. In the Steward registration workflow, a service maintainer submits a registration, an incident responder later searches ownership, and a governance lead assesses coverage. They have different reasons to care about exactly the same data.",
        "Work the interaction rather than listing names: maintainer authenticates → is authorized as a member of the owning team → registers service → ownership record becomes available for authorized queries. The maintainer and a reporting tool are actors when they directly interact; governance can remain an indirect stakeholder. A corporate identity provider may be an external-system actor or dependency from Steward's perspective, but owning identity proof does not imply owning Steward's authorization rules.",
        "Build a matrix with Role, Goal, Direct interaction?, Concern, Evidence needed, Responsible for decision. Example: incident responder | find the current owning team | yes | stale ownership | locate the correct owner in an incident simulation | operational stakeholder. Example: governance lead | demonstrate data completeness | maybe no | missing service registration | sampling/completeness report | data-quality stakeholder. Ask each role how their preferred solution affects the others.",
        "Failure case: treating an employee's job title as a single stable system permission role mixes organizational identity and action-level policy. One person can act as a maintainer in one team and a read-only responder elsewhere; model the permission for the action and object, not the name. Test with someone who belongs to two teams."
      ],
      "example": "Do not infer that the engineering director has write permissions because the director is an influential stakeholder. Stakeholder influence and authorization are separate decisions."
    },
    {
      "title": "Resolve conflicts by making the trade-off and evidence explicit",
      "paragraphs": [
        "Suppose service teams want registration with only a name, while incident responders need a reliable owning team and governance wants a criticality value. A compromise is not 'all fields optional' or 'all fields mandatory' by default. Identify which data is necessary at creation versus at promotion to production; then tie each requirement to a concrete scenario. Lifecycle-specific mandatory fields can reduce entry friction without silently weakening production-readiness controls.",
        "Conduct an interview that asks for examples and counterexamples: 'Show a service that failed a real handoff'; 'What happens if ownership is absent in UAT?'; 'Who can correct it?'; 'What would make you reject an incomplete record?' Keep unresolved disagreements as decisions pending with an owner, not hidden architecture assumptions."
      ]
    }
  ],
  "Functional Requirements": [
    {
      "title": "Derive a requirement from a state-changing event",
      "paragraphs": [
        "Start with the concrete operation: an authorized member attempts to promote a Service to production. Preconditions: the service exists, the member may manage the owning team and a production Environment exists. Trigger: the member submits promotion. Required observable behavior: Steward changes lifecycle to production only when all preconditions hold, otherwise rejects the request without a partial state change.",
        "Example requirement FR-LIFE-01: 'For a service owned by Team A, when an authorized Team A maintainer requests production promotion, Steward shall require at least one production Environment and shall preserve the previous lifecycle if the requirement fails.' This statement includes both success and forbidden behavior. It does not prescribe a Django serializer or PostgreSQL table, although the implementation will need an atomic correctness boundary.",
        "Trace case table: (authorized, prod environment present) = (true,true) → promotion permitted; (true,false) → rejected and unchanged; (false,true) → rejected and unchanged; (false,false) → rejected and unchanged. Authorization must be checked for both read and write scopes. The exact HTTP error status and response field names are public-contract decisions to be reconciled with Builder, not fabricated here.",
        "Failure diagnosis: 'Promotion button is disabled' alone is not sufficient proof of the requirement. An unauthorized caller could invoke the API directly, and two concurrent requests could observe old state. Test the domain invariant at the actual API/database boundary, not just the UI."
      ],
      "example": "Independent transfer: define the authorized deletion of a production Environment and identify the invariant it could violate even if lifecycle stays production."
    },
    {
      "title": "Trace obligations without treating acceptance criteria as implementation",
      "paragraphs": [
        "Requirement IDs connect a stakeholder outcome to a business rule, acceptance case, executable evidence and change impact. One requirement may have multiple tests; a test may cover several requirements. Do not mistake a checklist entry such as 'create a PostgreSQL migration' for acceptance evidence that users receive the correct behavior.",
        "Worked trace: need 'production services have a deployable environment' → FR-LIFE-01 → negative case 'attempt production without production Environment' → observed API rejection + unchanged row → design consequence 'atomic transition and controlled mutation paths'. If a later product decision allows an exception, update the requirement and failing test deliberately; do not quietly loosen validation.",
        "Ambiguity test: two reviewers should be able to decide whether the system passes from the same given input and observed result. If 'authorized user' or 'valid service' has no defined rule, the requirement is not testable yet. Raise the ambiguity before building."
      ]
    }
  ],
  "Quality Requirements": [
    {
      "title": "Derive six-part measurable quality scenarios",
      "paragraphs": [
        "A quality attribute describes how well the behavior should work, not another endpoint. Use six questions when a requirement is consequential: who/what causes the stimulus, what event occurs, under which environment, which artifact is affected, what response is expected, and by which measurable threshold is success judged. The short form (context + event + response measure) can work for simple cases, but do not omit critical workload and measurement details.",
        "Candidate teaching scenario—not an approved Steward target: 'During an incident, an authorized responder (source) requests an owner lookup (stimulus) against the registry API (artifact), while 20 other clients are reading a populated dataset of 10,000 Services (environment). Steward returns the current authorized owner or an explicit failure (response) within 500 ms for at least 95% of completed requests during a defined 30-minute load run (measure).' The numbers are illustrative; agree on realistic targets with stakeholders before using them as acceptance.",
        "A functional requirement asks whether the response is correct. The quality scenario asks how consistently, quickly and recoverably that response is delivered. A 200 response with the wrong owner fails functional correctness even when the latency satisfies p95. A fast response cached across team scopes can violate security. Measure error rate and data correctness alongside latency.",
        "An 'available 99.9%' goal also needs a measurement window, eligible traffic and exclusion rules. Without them, planned downtime or probe-only requests can make the same system appear to satisfy or violate the target depending on the observer."
      ],
      "example": "Alternative: for a change-oriented quality scenario, specify the exact supported API contract addition, required backward compatibility and time/cost to deploy it. 'Maintainable' by itself has no acceptance evidence."
    },
    {
      "title": "Calculate a sample percentile and refuse false certainty",
      "paragraphs": [
        "The example below uses 20 observed request durations in milliseconds and the nearest-rank p95 definition. Sort the observations; the 19th smallest value is p95 because ceil(0.95 × 20) = 19. The 20th value is the maximum. A single outlier can therefore change max without changing p95 in this small set. Real monitoring systems sometimes use different percentile estimators; label the method and sample window.",
        "Execute the complete Python 3 snippet as quality_measure.py. The expected output is sample count: 20, p95_ms: 420, max_ms: 720, under_500_ms: True, under_400_ms: False. The stricter threshold is the negative scenario. These twenty synthetic observations are deliberately insufficient to certify an operational service objective; the learner must later collect a representative workload and distinguish measurement noise from a durable trend.",
        "Failure diagnosis: reporting a mean latency or a healthy minimum as proof of a p95 target is a metric mismatch. Reporting a synthetic script result as a successful Steward benchmark is fabricated evidence. The independent practice must state the workload, percentile estimator, measurement window and failure category explicitly."
      ],
      "code": {
        "language": "python",
        "caption": "Executable quality-scenario percentile, success and failure threshold trace",
        "code": "# Example measurements, not a real Steward benchmark.\nlatencies_ms = [95, 110, 115, 118, 120, 124, 127, 130, 132, 134,\n                138, 140, 145, 150, 156, 160, 171, 184, 420, 720]\nordered = sorted(latencies_ms)\np95 = ordered[18]  # ceil(0.95 * 20) - 1; nearest-rank method\nprint(\"sample count:\", len(ordered))\nprint(\"p95_ms:\", p95)\nprint(\"max_ms:\", ordered[-1])\nprint(\"under_500_ms:\", p95 < 500)\n# Negative path: a tail request violates a stricter p95 < 400 ms objective.\nprint(\"under_400_ms:\", p95 < 400)"
      }
    }
  ],
  "Constraints and Assumptions": [
    {
      "title": "Separate binding constraints, design choices and provisional beliefs",
      "paragraphs": [
        "A constraint is an imposed restriction on an acceptable solution. An assumption is a statement treated as true while evidence is missing. A design decision is a choice among permissible approaches. These are not interchangeable. For Steward, 'the existing released system persists to PostgreSQL' is a current implementation fact; 'the next increment must keep PostgreSQL' needs an explicit owner/decision to become a constraint. 'All teams will maintain their metadata weekly' is an unvalidated assumption unless a real agreement/evidence exists.",
        "Write a decision register: C-01 (confirmed) 'must use enterprise IdP' — imposed by security architecture, owner security platform, reason business identity policy; A-02 (unverified) 'the CMDB publishes one consistent nightly file' — test by observing three deliveries and interviewing the operator; D-03 (chosen) 'start with a modular monolith' — reversible architectural choice, justified by scope and team capacity. Record expiry/revisit triggers rather than treating today's assumptions as permanent architecture.",
        "If A-02 is false, the batch receiver may encounter partial deliveries, format drift or duplicate file IDs. The engineering consequence is not merely an updated note; the contract needs a completion marker or same-filesystem rename, idempotency policy and failure detection. This links uncertainty to a concrete validation plan.",
        "Failure case: labeling a self-imposed choice as a hard external constraint prematurely blocks cheaper alternatives. Diagnostic question: who has the authority to impose or change this condition? If nobody can name that owner, do not present it as an immutable requirement."
      ],
      "example": "Revisit the early Builder decision to use a particular framework. Separate what is already shipped from what stakeholders truly require for the next increment."
    },
    {
      "title": "Build an assumption-expiry and impact protocol",
      "paragraphs": [
        "For every consequential assumption, state owner, confidence, evidence, risk if false, next verification action and deadline or design milestone. Example: 'ownership changes are rare' affects cache invalidation strategy; evidence would be update-frequency telemetry or audit-log sampling. A one-off anecdote is weak evidence.",
        "When a constraint changes, update any dependent acceptance cases, ADRs and deployment assumptions. When an assumption is disproved, do not bury it as a known limitation: explicitly reconsider the component or contract that depended on it. This is why a living assumption log is more useful than a static list under an architecture diagram."
      ]
    }
  ],
  "Acceptance and Evidence": [
    {
      "title": "Trace claims to the kind of observation that could disprove them",
      "paragraphs": [
        "Verification asks whether the implementation conforms to its specified behavior; validation asks whether that behavior satisfies the stakeholder's real need. Example verification: an authorized Team A maintainer can update a Team A service, while a Team B maintainer receives a documented rejection with no state change. Example validation: during an actual on-call escalation, responders can identify the correct owning team quickly and reliably. Both are necessary; an HTTP 200 alone proves neither.",
        "Construct an evidence matrix with columns Claim → Preconditions → Stimulus → Observable result → Negative/counterexample → Evidence source → Who accepts. For FR-LIFE-01, record successful promotion when a production Environment exists and rejected promotion when it does not. Verify the persisted record after both requests, not just the returned body. For cross-team authorization, construct a user with a real different membership and attempt both direct API and nested-resource writes.",
        "Different mechanisms need different evidence. A schema parser test can demonstrate XML structure but cannot prove external SOAP compatibility. A pure Python idempotency function can show a decision branch but cannot prove RabbitMQ redelivery or transactional atomicity. A green build proves source compiles, not that a novice understands the content. Choose the observation at the same boundary as the claim.",
        "Failure case: write an acceptance criterion 'authorization works' and then test only that an authenticated owner gets status 200. The criterion omitted the negative decision and therefore cannot establish access isolation. Diagnostic response: specify a different-team identity, exact attempted action, expected rejection and unchanged persisted state."
      ],
      "example": "Evidence ladder: static/source review → executable local model → actual API/database integration → real external service/broker → rendered learner UX → independent novel task. Only credit the tier that was actually observed."
    },
    {
      "title": "Use counterexamples to discover requirement ambiguity before implementation",
      "paragraphs": [
        "Counterexamples deliberately change a dimension that the happy-path scenario assumed: actor, service owner, resource state, request timing, repeated delivery, external dependency availability or payload validity. Keep one dimension controlled per test when isolating behavior, then test interactions among dimensions when the system is stateful.",
        "Example: the team approves an authorized production promotion, but what if a concurrent request deletes the last production Environment? Both operations can pass a naive prior-state check and leave production without a production deployment. The requirement must specify the invariant across concurrent writes and the implementation must enforce it at an appropriate transaction/locking boundary. A single-thread mock does not prove that property.",
        "The independent exercise is to present a new requirement, ask the learner to derive two plausible interpretations, identify the unresolved stakeholder decision, propose an acceptance case for each and specify the evidence needed to discriminate. The learner should not invent a product rule to make the examples easier to implement."
      ]
    }
  ]
};
export const requirementsResearch: Record<string,LearningResource[]> = {
  "From Requests to Problems": [
    {
      "title": "SEBoK — Stakeholder Needs and Requirements",
      "url": "https://sebokwiki.org/wiki/Stakeholder_Needs_and_Requirements",
      "kind": "reference",
      "purpose": "Read the elicitation and stakeholder rationale sections; use evidence rather than assuming the first feature request is the problem."
    },
    {
      "title": "Ian Sommerville — Requirements and Design videos",
      "url": "https://software-engineering-book.com/videos/req/",
      "kind": "video",
      "purpose": "Optional lecture series on requirements discovery and problem framing. No need to watch to complete this TSA lesson."
    }
  ],
  "Stakeholders and Actors": [
    {
      "title": "SEBoK — Stakeholder Needs and Requirements",
      "url": "https://sebokwiki.org/wiki/Stakeholder_Needs_and_Requirements",
      "kind": "reference",
      "purpose": "First-party systems engineering framing of stakeholder life-cycle roles and competing needs."
    },
    {
      "title": "Ian Sommerville — Stakeholders, viewpoints and concerns",
      "url": "https://software-engineering-book.com/videos/req/",
      "kind": "video",
      "purpose": "Optional lecture from a software engineering textbook author; compare viewpoints with TSA's actor matrix."
    }
  ],
  "Functional Requirements": [
    {
      "title": "Oregon State University — Requirements chapter",
      "url": "https://open.oregonstate.education/setextbook/chapter/requirements/",
      "kind": "reference",
      "purpose": "Definitions and distinctions among functional requirements, nonfunctional constraints and acceptance."
    },
    {
      "title": "Ian Sommerville — Requirements engineering videos",
      "url": "https://software-engineering-book.com/videos/req/",
      "kind": "video",
      "purpose": "Optional requirements engineering follow-up after working through TSA's concrete transition rules."
    }
  ],
  "Quality Requirements": [
    {
      "title": "arc42 — Quality Scenarios",
      "url": "https://docs.arc42.org/section-10/",
      "kind": "reference",
      "purpose": "Six-part quality-scenario structure, usage/change/failure cases and response measures."
    },
    {
      "title": "CMU SEI — Quality Attribute Workshop webcast",
      "url": "https://www.sei.cmu.edu/library/architecting-in-a-complex-world-eliciting-and-specifying-quality-attribute-requirements/",
      "kind": "video",
      "purpose": "Optional scenario-elicitation webcast; the local worked percentile and quality scenario remain independently teachable."
    }
  ],
  "Constraints and Assumptions": [
    {
      "title": "SEBoK — Stakeholder Needs and Requirements",
      "url": "https://sebokwiki.org/wiki/Stakeholder_Needs_and_Requirements",
      "kind": "reference",
      "purpose": "Contrast constraint sources, stakeholder rationale and evidence needs."
    },
    {
      "title": "arc42 — Context and Scope",
      "url": "https://docs.arc42.org/section-3/",
      "kind": "reference",
      "purpose": "Separate system context and external dependencies from arbitrary implementation choices."
    }
  ],
  "Acceptance and Evidence": [
    {
      "title": "Oregon State University — Requirements",
      "url": "https://open.oregonstate.education/setextbook/chapter/requirements/",
      "kind": "reference",
      "purpose": "Check observable functional/quality requirements and acceptance links."
    },
    {
      "title": "CMU SEI — How to Address Poorly Defined Requirements",
      "url": "https://sei.cmu.edu/library/how-to-address-the-problem-of-poorly-defined-requirements-in-software-system-design/",
      "kind": "video",
      "purpose": "Optional webcast relating stakeholder scenarios to evaluated architectural trade-offs; not required to pass TSA's independent evidence matrix."
    }
  ]
};
