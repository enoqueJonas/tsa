import type {LearningResource} from "../activities/content";
import type {RequirementsTeachingSection} from "./system-thinker-requirements-worked";

// Pedagogical audit: one continuous synthetic ownership-escalation case across
// all six lessons, distinguishing observation, hypothesis, authority and evidence.
// This is intentionally not a claim about any real bank or Steward production data.
export const requirementsRunningCase: Record<string,RequirementsTeachingSection[]> = {
  "From Requests to Problems": [
    {
      "title": "One fictional incident, two very different explanations",
      "paragraphs": [
        "Running case for this module (synthetic, not an FNB or Steward production incident): during a practice escalation, an incident responder searched for the owner of `svc-billing` and contacted an obsolete team. An instructor's sample timeline shows 09:02 request opened, 09:09 first team contacted, 09:18 redirected and 09:26 correct team engaged. The elapsed time is 24 minutes, but **it is not proof** the 24 minutes were caused entirely by Steward, or that this is a typical incident. A platform lead nevertheless requests an 'ownership dashboard'. Pause before treating that feature as the problem.",
        "Propose hypothesis H1: the underlying ownership record is inaccurate. If H1 is true, the same incorrect result appears in the API and any UI that reads it. Propose H2: the record is accurate, but responders search the wrong place. If H2 is true, a trustworthy direct lookup may help even without updating the data workflow. Proposed experiment: ask an independent responder to locate `svc-billing` through the current UI/API, inspect a non-sensitive registry history snapshot and compare against the designated owning team's approved record. Do not announce H1 or H2 as fact until the result is observed."
      ],
      "code": {
        "language": "text",
        "caption": "Problem discovery record — illustrative data, not measured production evidence",
        "code": "OBS-01 | Scenario: synthetic delayed ownership escalation\nREQUEST | Build an ownership dashboard\nH1 | Underlying Service.owner is outdated\nH2 | Service.owner is correct; lookup/discovery is confusing\nTEST H1 | Compare registry history with approved team ownership\nTEST H2 | Observe a responder using current discovery workflow\nOUTCOME | Responder identifies the currently approved owner at escalation\nOPEN | Who is authoritative for ownership? What baseline delay exists?"
      }
    },
    {
      "title": "Make the problem falsifiable before estimating its value",
      "paragraphs": [
        "Rewrite the proposal without solution nouns: 'During incidents, responders cannot consistently identify the approved accountable team for a service, potentially delaying escalation.' Notice 'cannot consistently' is still a claim; label it **unconfirmed** until observations support a frequency estimate. Define a sampling frame (for example, practice exercises from a known date window) and the **denominator**: successful lookups / all eligible lookups. Do not choose a percentage target from one anecdote.",
        "Counterfactual: if the API returns the correct owner instantly but the user does not know that endpoint exists, copying the same data into a dashboard might improve discoverability; if the registry contains the wrong team, a new dashboard will faithfully display the wrong team. Stop and choose which evidence would change your next action. Carry these two competing hypotheses into the next lesson instead of silently selecting the feature."
      ]
    }
  ],
  "Stakeholders and Actors": [
    {
      "title": "Trace the same incident through conflicting stakeholder evidence",
      "paragraphs": [
        "Continue OBS-01. The responder is a direct actor when looking up ownership. A service maintainer is a direct actor when updating a Service. An incident manager is a stakeholder whose escalation time depends on trustworthy ownership, even if they never call Steward. A governance reviewer is affected by completeness and auditability, and an operations team may be responsible for maintaining an organizational source of truth. The **system actor** is defined per interaction; an identity provider is an external dependency for authentication, not automatically the owner of Steward's Team permission rules.",
        "Compare what each wants: the responder requests one-click lookup; the maintainer wants few mandatory registration fields; governance wants approved ownership and traceable changes; operations wants a correction process with an accountable approver. These are not four independent feature requests. If registration accepts an arbitrary Team without approval, discoverability can improve while the truthfulness of results deteriorates. Expose this trade-off before designing the UI."
      ],
      "code": {
        "language": "text",
        "caption": "Stakeholder and interaction register — the same synthetic OBS-01 case",
        "code": "Role                 | Interaction           | Decision/evidence\nIncident responder   | reads owner           | approved owner found in drill\nTeam maintainer      | proposes owner change | authorized editor + evidence\nGovernance reviewer  | may not log in        | data provenance + audit trail\nIncident manager     | consumes outcome      | escalation delay distribution\nIdentity provider    | authenticates caller  | identity only; not Team policy\nOwner approval source| external or unknown   | MUST CLARIFY, not assume"
      }
    },
    {
      "title": "Resolve the tension by assigning decisions to owners",
      "paragraphs": [
        "Run a 15-minute scenario interview, not a vote on features. Ask the responder to replay the escalation; ask the maintainer how they learn that ownership changed; ask governance what evidence counts as approval; ask the person responsible for operations what happens when the approved source is temporarily unreachable. Capture the statement, evidence, disagreement and decision owner separately. A senior stakeholder can prioritize urgency but cannot by title alone authorize cross-Team writes.",
        "Decision record D-01 remains open: 'Which role can approve a transfer of Service ownership, and how is a disagreement resolved?' Assign an organizational decision owner and a due date. Until answered, mark the API/UI change **proposed** rather than inventing a global administrator. Independent variation: two teams both claim `svc-billing`; identify which stakeholder can offer information and who has authority to decide, without equating those roles."
      ]
    }
  ],
  "Functional Requirements": [
    {
      "title": "Derive two independent obligations from one verified need",
      "paragraphs": [
        "Assume OBS-01 investigation now finds a confirmed mismatch in the *synthetic* registry record. That observation supports two different system obligations: a responder must be able to read the effective current owning team, and a permitted maintainer must be able to propose or execute a change only through the agreed Team authorization rule. These are separate requirements, not one long 'manage owners' sentence. A notification or dashboard may be a solution later, but the requirement is written in terms of observable behavior.",
        "Bad requirement: 'Add a React ownership dashboard backed by a PostgreSQL owner table.' It embeds a UI and storage technology, says nothing about authorization, and cannot distinguish incorrect data from difficult lookup. Better FR-OWNER-01: 'For an existing Service, when an authorized responder requests its current ownership, Steward shall return the current recorded owning Team, or a defined not-found response if the Service does not exist.' This is *recorded* ownership, not proof the enterprise's approved source is correct. A second requirement FR-OWNER-02 covers authorized changes and explicit refusal for outsiders."
      ],
      "code": {
        "language": "text",
        "caption": "Behavioral requirements that can survive a framework change",
        "code": "FR-OWNER-01 | Read effective recorded Team for existing Service.\nWHEN  | Authorized reader requests Service S.\nTHEN  | Current recorded Team returned; missing S -> not found.\nFR-OWNER-02 | Change ownership only with applicable authorization.\nWHEN  | Caller seeks to move S from Team A to Team B.\nTHEN  | Only authorized transfer succeeds atomically.\nFORBID| Caller without transfer authority -> denied, state unchanged.\nOPEN  | Who grants transfer authority? D-01 must be resolved."
      }
    },
    {
      "title": "Test completeness with a counterexample before approving wording",
      "paragraphs": [
        "Challenge FR-OWNER-01: what if a Service has no owner, the owner belongs to a retired organizational unit, the caller may see the Service but not its owning team's contact details, or two transfers race? The first wording does not specify all these cases. Record those as open decisions rather than inventing behavior. For each gap identify who owns the decision and the evidence or policy needed. A requirement is not 'complete' merely because it contains the word 'shall'.",
        "Trace backward from FR-OWNER-02 to the responder's need for reliable escalation and the governance requirement for controlled change. Trace forward to a positive authorized-transfer test and a negative unauthorized-transfer test. An engineer changing Django to another framework should preserve those behaviors. Distinguish a requirement from the acceptance scenario that will attempt to disprove it in lesson six."
      ]
    }
  ],
  "Quality Requirements": [
    {
      "title": "Write a real workload envelope before quoting a percentile",
      "paragraphs": [
        "Continue the same ownership lookup. 'Fast and reliable' is not a testable scenario. State the source (an on-call responder), stimulus (lookup an existing Service by stable identifier), environment (normal operational load; specific dataset size, location and concurrency to be agreed), artifact (Steward lookup path), response (return the recorded effective owner or an explicit error) and measure (latency distribution plus correctness under that load). The **sample target numbers below are teaching proposals**, not measured baselines or approved SLAs.",
        "Proposed QR-LOOKUP-01: for 50 concurrent synthetic lookup clients against a 10,000-Service test dataset from one declared network vantage point, at least 95% of completed successful requests finish within 400 ms over a named 30-minute window, with no observed incorrect owner values. This leaves decisions to settle: timeouts count separately, p95 estimation method, warm/cold cache, load-generator limits, data freshness and whether 50 clients reflect reality. A fast wrong answer is not a success."
      ],
      "code": {
        "language": "text",
        "caption": "Six-part quality scenario with deliberately unapproved measurement targets",
        "code": "ID: QR-LOOKUP-01 [PROPOSED, not approved]\nSOURCE    Responder using the incident lookup client\nSTIMULUS  Request effective recorded owner for valid Service ID\nENV       10k synthetic Services, 50 concurrent clients, declared region\nARTIFACT  Steward ownership lookup API\nRESPONSE  Correct recorded owner or explicit documented error\nMEASURE   Example only: 95% successful requests <= 400 ms in 30 min\nGUARDS    Report timeouts/errors, correctness and sample size separately\nOPEN      Validate user concurrency, dataset and threshold with owner"
      }
    },
    {
      "title": "Avoid percentile theater and make a quality trade-off visible",
      "paragraphs": [
        "A percentile without a population, measurement window and error definition can mislead. If 5% of requests time out, a p95 computed only from successful requests can still look excellent while users suffer. Report total requests, successes, failed requests, timeouts, p50/p95/p99 of the explicitly defined population and whether the measured latency includes network time. Avoid averaging percentiles from independent workers as though they were raw durations.",
        "Trade-off: a long-lived shared cache may improve the measured response time while returning stale Team ownership during an incident. Reliability and correctness might matter more than extreme speed. Before adding Redis, compare database indexing, query shape and pagination, and ask what staleness budget is acceptable. Independent variation: change the workload to an emergency lookup during degraded network conditions, then rewrite the source, environment, response measure and acceptable fallback; do not retain the original target by reflex."
      ]
    }
  ],
  "Constraints and Assumptions": [
    {
      "title": "Separate what is true today from what binds the future design",
      "paragraphs": [
        "OBS-01 now leads to a plan, but engineers hear three statements: 'Steward currently runs on Django and PostgreSQL'; 'the security policy requires approved organizational identity for edits'; and 'service owners update records within 24 hours.' These are not the same kind of claim. The first is an **implementation fact** at a versioned checkpoint, the second could be a binding policy **constraint** but needs a policy owner/reference, and the third is an **assumption** until records or a formal agreement support it.",
        "Classify each entry by source, authority, ability to change, risk if false, and next verification action. If the identity policy cannot be located, do not fabricate a compliance requirement. If a temporary sandbox forbids extra services, that is an environment-specific limitation, not proof that Steward must remain monolithic. If the team-ownership source is not identified, record decision D-01 as blocking FR-OWNER-02's transfer authorization rule."
      ],
      "code": {
        "language": "text",
        "caption": "Versioned constraint and assumption register — sample, not signed policy",
        "code": "A-01 [ASSUMPTION] Owners update records within 24h.\nSource: informal statement; impact if false: inaccurate incident lookup.\nTest: sample audit timestamps against actual ownership changes.\nTrigger: observed delayed change; action: revisit update workflow.\nI-01 [FACT] Builder checkpoint uses Django + PostgreSQL.\nSource: source commit + running test; NOT a permanent constraint.\nC-01 [PROPOSED CONSTRAINT] Approved identity required for edits.\nSource: security policy citation PENDING; owner: security lead.\nD-01 [OPEN] Transfer authorization approver to confirm."
      }
    },
    {
      "title": "Track how one false assumption alters multiple artifacts",
      "paragraphs": [
        "Suppose A-01 is falsified by evidence that teams sometimes fail to update the registry for weeks. FR-OWNER-01 can still be implemented correctly while the returned Team is wrong from the organization's perspective. The quality scenario can meet its response-time target yet fail the responder outcome; the acceptance test must therefore distinguish *correct database read* from *approved ownership accuracy*. This is a change-impact path, not a request to add more technology.",
        "Write an explicit decision threshold before gathering evidence: for example, 'if the approved source and registry differ in any critical synthetic scenario, design a correction/attestation workflow before prioritizing a UI overhaul'. The threshold is a proposal to approve, not a retrospective rule chosen to justify a preferred feature. Independent transfer: classify a third-party billing API's fixed SOAP contract, an internal preference for RabbitMQ, and a legal retention rule that has not been evidenced. Explain which need clarification rather than being silently asserted."
      ]
    }
  ],
  "Acceptance and Evidence": [
    {
      "title": "Close the chain with two different kinds of proof",
      "paragraphs": [
        "The last step is not a list of test titles. For FR-OWNER-01, **verification** can show that a known Service's lookup returns the Team stored in PostgreSQL; for the original incident problem, **validation** needs a responder to correctly find the enterprise-approved owner in a realistic escalation exercise. Both can pass or fail independently. If the wrong approved Team was stored, a perfectly functioning API will pass verification but fail the organizational objective. Make the different oracles explicit.",
        "Create a trace graph from OBS-01 → confirmed or open hypothesis → FR-OWNER-01/02 → acceptance conditions → executed evidence → decision. Name every unresolved dependency: D-01 authorizer and A-01 update timeliness. A test that checks only HTTP 200 cannot establish the requested Team's authority or record accuracy. A dashboard screenshot does not establish responder performance."
      ],
      "code": {
        "language": "text",
        "caption": "Miniature bidirectional trace and evidence matrix — expected results, not executed results",
        "code": "OBS-01 -> H1 or H2 (both remain hypotheses until inspected)\nNEED-01 -> FR-OWNER-01 -> AT-READ-01 -> SQL/API evidence\nNEED-01 -> FR-OWNER-02 -> AT-AUTH-01 -> no-mutation proof\nNEED-01 -> QR-LOOKUP-01 -> PERF-01 -> measured sample report\nNEED-01 -> VAL-ESC-01 -> responder escalation simulation\nAT-READ-01: existing ID returns persisted Team, absent ID -> 404\nAT-AUTH-01: unauthorized transfer denied and state unchanged\nVAL-ESC-01: responder identifies approved owner in a blind drill\nBLOCKERS: D-01 approval authority; A-01 timeliness unverified"
      }
    },
    {
      "title": "Disconfirm an apparently successful delivery",
      "paragraphs": [
        "Consider a reported 'all green' release: 100% of synthetic lookups return HTTP 200, while a real responder chooses an obsolete team because the registry has stale ownership. This is a **valid implementation test** but not successful problem validation. Ask what missing data stewardship process would bring the registry and approved source into alignment, and who can authorize that process. Do not blame the responder or invent a technical fix before evidence supports the cause.",
        "Independent test: in a blank version of the matrix, remove one requirement's acceptance row and one accepted claim's upstream stakeholder need. Identify the orphan in each direction. For QR-LOOKUP-01, explain why a 30-minute automated load test might provide performance verification but cannot alone establish the quality target's relevance. Finish by recording which requirements are ready for baseline, which are conditional on D-01/A-01, and which hypotheses have not been validated. That is the actual handoff to System Boundaries and Context."
      ]
    }
  ]
};
export const requirementsRunningCaseReferences: LearningResource[] = [
  {
    "title": "NASA Systems Engineering Handbook — Appendix C: How to Write a Good Requirement",
    "url": "https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/",
    "kind": "reference",
    "purpose": "Implementation-independent, unambiguous, traceable, and verifiable requirement review checklist."
  },
  {
    "title": "SEBoK — Requirements Management",
    "url": "https://sebokwiki.org/wiki/Requirements_Management",
    "kind": "reference",
    "purpose": "Baseline management, bidirectional traceability, change impact, verification and validation evidence."
  },
  {
    "title": "arc42 — Quality scenarios",
    "url": "https://docs.arc42.org/section-10/",
    "kind": "reference",
    "purpose": "Six-part measurable quality attributes, usage, change, and failure scenarios."
  }
];
