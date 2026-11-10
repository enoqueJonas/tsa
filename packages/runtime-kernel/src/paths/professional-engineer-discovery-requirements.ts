import type { LessonBlock } from "../activities/content";
// PED-005: Requirements in the ORIGINAL discovery module.
// No fictional source or test is real approval, user research or security evidence.
export const requirementsReviewGatePython = "from dataclasses import dataclass, replace\n\n@dataclass(frozen=True)\nclass Requirement:\n    key: str\n    origin: str             # DOCUMENTED or CLAIMED\n    source_reference: str\n    authority_verified: bool\n    measurable_oracle: bool\n    denial_oracle: bool\n    test_reference: str\n\ndef review_gate(req: Requirement) -> str:\n    # Synthetic teaching data, NOT stakeholder approval or real consent.\n    if req.origin != \"DOCUMENTED\" or not req.source_reference:\n        return \"EVIDENCE_UNVERIFIED\"\n    if not req.authority_verified:\n        return \"OWNER_UNCONFIRMED\"\n    if not req.measurable_oracle or not req.test_reference:\n        return \"UNTESTABLE\"\n    if not req.denial_oracle:\n        return \"UNSAFE_NEGATIVE_PATH\"\n    return \"REVIEWABLE_NOT_APPROVED\"\n\ndef may_view(requester: str, record_owner: str) -> bool:\n    # Fictional authorization rule: same owner can view.\n    return requester == record_owner\n\nbase = Requirement(\"R-04\", \"DOCUMENTED\", \"synthetic-doc-1\", True, True, True, \"AC-04\")\ncases = {\n    \"claim_only\": (replace(base, origin=\"CLAIMED\"), \"EVIDENCE_UNVERIFIED\"),\n    \"no_owner\": (replace(base, authority_verified=False), \"OWNER_UNCONFIRMED\"),\n    \"vague_quality\": (replace(base, measurable_oracle=False), \"UNTESTABLE\"),\n    \"no_denial_test\": (replace(base, denial_oracle=False), \"UNSAFE_NEGATIVE_PATH\"),\n    \"documented\": (base, \"REVIEWABLE_NOT_APPROVED\"),\n}\nfor name, (requirement, expected) in cases.items():\n    actual = review_gate(requirement)\n    assert actual == expected, f\"{name}: {actual} != {expected}\"\n    print(f\"{name}: {actual}\")\n\nassert may_view(\"case-7\", \"case-7\") is True\nassert may_view(\"case-8\", \"case-7\") is False\nassert review_gate(replace(base, origin=\"CLAIMED\")) == \"EVIDENCE_UNVERIFIED\"\nprint(\"AUTHORIZATION_ALLOWED_AND_DENIED\")\nprint(\"REQUIREMENT_REVIEW_NOT_APPROVAL\")\nprint(\"REQUIREMENTS_EVIDENCE_ORACLE_PASS\")\n";
export const requirementsDerivationBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "Requirements work begins after problem framing, but the presence of a plausible problem does NOT prove any preferred product requirement. This lesson teaches how an engineer turns an evidenced need into a verifiable obligation without adopting an interviewee's solution request. The warranty handoff used here is a FICTIONAL teaching case: no stakeholder has approved or supplied production evidence."
  },
  {
    "type": "heading",
    "id": "req-definition",
    "level": 2,
    "text": "What a requirement is, and why a stakeholder request is not one"
  },
  {
    "type": "paragraph",
    "text": "A requirement is a condition or capability a proposed system or its surrounding service must satisfy within an agreed boundary; it should have a reason, a source, an owner and a way to determine whether it was met. A preference is a person's favored option, e.g. 'build a dashboard'. A problem is the undesirable condition, e.g. authorized operators cannot reliably tell which handoff is waiting on a supplier. A candidate requirement might be: 'An authorized operator can view the most recent verified handoff state and the reason the case is waiting, without seeing unrelated customer records.' This expresses an outcome and an access constraint but does not force a dashboard, API or vendor."
  },
  {
    "type": "paragraph",
    "text": "Write a chain, not a magic jump: current-state harm → affected actor and outcome → supporting evidence (or explicit missing evidence) → candidate requirement → acceptance example → verification activity → business owner decision. If the source is only a hypothetical interview, label its status CLAIMED/UNVERIFIED, not approved. If the organization or legal environment forbids use of a field, an enthusiastic sponsor cannot override that authority. A technically implementable request can be rejected because it lacks a valid owner, purpose, consent or operational justification."
  },
  {
    "type": "heading",
    "id": "req-taxonomy",
    "level": 2,
    "text": "Separate business goals, capabilities, domain rules and quality constraints"
  },
  {
    "type": "paragraph",
    "text": "A business objective states why change matters, e.g. reduce avoidable uncertainty for people with unresolved returns. A user capability says what an actor can do, e.g. a clerk can inspect the case's latest authorized stage. A domain rule defines permitted state transitions or decisions, e.g. a case cannot be marked closed before the outcome is recorded and communicated. An interface/data requirement describes an exchange and its meaning, e.g. a supplier response must identify the correlation token and verifiable decision state. Quality requirements constrain system behavior under conditions, e.g. only an authorized operator can read a case and the denial leaves no unauthorized state change."
  },
  {
    "type": "paragraph",
    "text": "These categories overlap in implementation but should not collapse into vague bullets. 'The system must be secure', 'must be user-friendly', 'must be scalable' and 'must use microservices' are not well-formed outcomes. For security, name the asset, principal, allowed action, forbidden action, evidence of prevention and applicable threat. For performance, name the exact operation, population, load and percentile, and where the threshold comes from. If the evidence is absent, keep the numeric target TO_BE_VALIDATED rather than inventing 99.9% availability to make the specification look professional."
  },
  {
    "type": "heading",
    "id": "req-source-status",
    "level": 2,
    "text": "Make provenance, consent and decision authority explicit"
  },
  {
    "type": "paragraph",
    "text": "A requirements ledger should contain ID, version, wording, requirement kind, affected role, upstream problem/harm ID, source reference, source type (observed/documented/reported/inferred), permission to use the evidence, confidence and gaps, decision authority, status and verification link. A statement quoted by a manager is useful discovery input but not automatically a mandated business rule. Multiple people repeating the same copied spreadsheet do not become multiple independent evidence sources. A legally mandated constraint requires identifying the relevant actual rule and competent reviewer, not guessing the legislation."
  },
  {
    "type": "paragraph",
    "text": "Use status transitions that prevent silent promotion: PROPOSED → EVIDENCE_PENDING → REVIEWABLE → APPROVED or REJECTED, with DEFERRED/REVISIT for conflict. REVIEWABLE means the candidate has enough structure to be discussed; it does not grant project approval. If the only evidence is illustrative teaching data, no requirement is approved for a real organization. Maintain the right for affected non-users to challenge requirements that privilege the service owner over the person bearing the harm."
  },
  {
    "type": "heading",
    "id": "req-comparison",
    "level": 2,
    "text": "Worked example: a bad specification and two defensible candidates"
  },
  {
    "type": "paragraph",
    "text": "Bad: 'Use microservices and an AI dashboard to reduce approval time 50%.' It specifies technology, assumes an unmeasured baseline, omits authorization and equates fast closure with correct outcomes. Candidate R-04: 'When an authorized operator opens a return, the service shows its verified current lifecycle state, its timestamp and which required evidence is missing; if data are unavailable it displays UNKNOWN, not CLOSED.' Candidate R-05: 'A requester without access to that return cannot view its identifiers, documents or status; a rejected read cannot change the record.' Neither sentence is certified as required until its problem source and owner are validated."
  },
  {
    "type": "paragraph",
    "text": "Do not create requirements merely because they are easy to test or demonstrate. A testable but unnecessary feature consumes implementation and maintenance budget. The learner's task is to defend why each candidate belongs to the scope, expose alternative non-technical interventions and write down what evidence could make the team remove it. The next reading will turn these candidates into concrete positive and negative acceptance contracts."
  },
  {
    "type": "resources",
    "title": "Primary service-design guidance",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Understanding user needs",
        "url": "https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs"
      }
    ]
  }
];
export const requirementsAcceptanceBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "A requirement needs an observable oracle: an independent way to decide whether the behavior is correct under stated preconditions. Writing 'the system is secure' or 'the status is accurate' offers no oracle. This focused reading translates candidate requirements R-04 and R-05 into acceptance examples, including failures that a status-only or happy-path-only test would miss. The executable Python example is a synthetic review gate, not a production security implementation."
  },
  {
    "type": "heading",
    "id": "req-acceptance-condition",
    "level": 2,
    "text": "Give an acceptance test a situation, action and independently checked result"
  },
  {
    "type": "paragraph",
    "text": "Use Given–When–Then or equivalent explicit precondition, action and expected observable result. Example for R-04: GIVEN an operator is authorized for case C7 AND its supplier answer has not been received, WHEN the operator requests the case status, THEN the displayed current state is WAITING_FOR_SUPPLIER and the last verified timestamp is shown; missing later events remain UNKNOWN. A denied read requires a separate example, not an omitted parameter in the happy path."
  },
  {
    "type": "paragraph",
    "text": "Example for R-05: GIVEN operator B is not entitled to case C7, WHEN B requests status or documents, THEN the request is denied, no sensitive fields appear in the response and the authoritative case record is unchanged. Make the oracle include state, returned data and audit trail as applicable; an HTTP 403 alone cannot prove that no row was updated before denial. In testing, choose fixtures with distinct actor ownership and inspect the appropriate persistent boundary. This example does not require learners to access production records."
  },
  {
    "type": "heading",
    "id": "req-domains-states",
    "level": 2,
    "text": "Test business rules through examples and counterexamples"
  },
  {
    "type": "paragraph",
    "text": "A domain rule governs state regardless of user-interface layout. For the invented warranty case: an operator may record DOCUMENTS_READY only after required evidence was validated; a supplier response correlates to an authorized return; CLOSED requires a recorded outcome and permitted communication. Test a permitted transition and a forbidden one. If a case marked CLOSED lacks the outcome event, the system must not silently infer that it was truly completed. This reuses Problem Framing's status-vs-evidence distinction rather than inventing a new absolute rule."
  },
  {
    "type": "paragraph",
    "text": "An exhaustive rule table has explicit inputs, actor, current state, event/evidence, expected next state, side effects, forbidden side effects and source of authority. Separate validation of source-record integrity from validation that a policy is ethically or legally correct. Don't confuse an attractive API response with business evidence. A change in legal or organizational policy may invalidate both an acceptance test and the associated requirement."
  },
  {
    "type": "heading",
    "id": "req-quality-oracle",
    "level": 2,
    "text": "Make quality attributes measurable without fabricating thresholds"
  },
  {
    "type": "paragraph",
    "text": "Functional acceptance answers 'what must happen?'; quality acceptance asks how the system must behave under a specified constraint or operating context. 'Fast' needs a defined path, percentile, workload, data size, measurement method, environment and a stakeholder-justified limit. 'Reliable' needs state consistency, failure scenario, recovery expectation and evidence. 'Private' needs a concrete principal, record boundary and denial behavior. Where service SLOs, risk tolerances or baseline loads are still unknown, the candidate quality requirement remains DRAFT with a measurement plan rather than a made-up numeric objective."
  },
  {
    "type": "paragraph",
    "text": "For a negative case, deliberately corrupt the authorization predicate, ignore the owner-confirmation gate or turn a missing test oracle into success. A good suite should detect wrong behavior from its observed effects rather than simply asserting that a function ran. A green check for a toy rule is not proof of production confidentiality, consent, regulator approval or capability under load."
  },
  {
    "type": "heading",
    "id": "req-python-example",
    "level": 2,
    "text": "Execute the learner-visible requirement review and denial oracle"
  },
  {
    "type": "paragraph",
    "text": "The following exact Python 3 standard-library program uses fictional requirements with distinct statuses: claim-only evidence, unknown decision authority, vague/no measurable oracle, missing denial test and a documented candidate eligible only for stakeholder REVIEW. It also checks a deliberately simplified same-owner authorization predicate in both allowed and denied cases. All synthetic flags model questions reviewers should ask; they do not establish real consent, lawful data access or verification of an entire deployed system."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "Exact Python 3: synthetic requirement provenance, acceptance-oracle and forbidden-access tests",
    "code": "from dataclasses import dataclass, replace\n\n@dataclass(frozen=True)\nclass Requirement:\n    key: str\n    origin: str             # DOCUMENTED or CLAIMED\n    source_reference: str\n    authority_verified: bool\n    measurable_oracle: bool\n    denial_oracle: bool\n    test_reference: str\n\ndef review_gate(req: Requirement) -> str:\n    # Synthetic teaching data, NOT stakeholder approval or real consent.\n    if req.origin != \"DOCUMENTED\" or not req.source_reference:\n        return \"EVIDENCE_UNVERIFIED\"\n    if not req.authority_verified:\n        return \"OWNER_UNCONFIRMED\"\n    if not req.measurable_oracle or not req.test_reference:\n        return \"UNTESTABLE\"\n    if not req.denial_oracle:\n        return \"UNSAFE_NEGATIVE_PATH\"\n    return \"REVIEWABLE_NOT_APPROVED\"\n\ndef may_view(requester: str, record_owner: str) -> bool:\n    # Fictional authorization rule: same owner can view.\n    return requester == record_owner\n\nbase = Requirement(\"R-04\", \"DOCUMENTED\", \"synthetic-doc-1\", True, True, True, \"AC-04\")\ncases = {\n    \"claim_only\": (replace(base, origin=\"CLAIMED\"), \"EVIDENCE_UNVERIFIED\"),\n    \"no_owner\": (replace(base, authority_verified=False), \"OWNER_UNCONFIRMED\"),\n    \"vague_quality\": (replace(base, measurable_oracle=False), \"UNTESTABLE\"),\n    \"no_denial_test\": (replace(base, denial_oracle=False), \"UNSAFE_NEGATIVE_PATH\"),\n    \"documented\": (base, \"REVIEWABLE_NOT_APPROVED\"),\n}\nfor name, (requirement, expected) in cases.items():\n    actual = review_gate(requirement)\n    assert actual == expected, f\"{name}: {actual} != {expected}\"\n    print(f\"{name}: {actual}\")\n\nassert may_view(\"case-7\", \"case-7\") is True\nassert may_view(\"case-8\", \"case-7\") is False\nassert review_gate(replace(base, origin=\"CLAIMED\")) == \"EVIDENCE_UNVERIFIED\"\nprint(\"AUTHORIZATION_ALLOWED_AND_DENIED\")\nprint(\"REQUIREMENT_REVIEW_NOT_APPROVAL\")\nprint(\"REQUIREMENTS_EVIDENCE_ORACLE_PASS\")\n"
  },
  {
    "type": "paragraph",
    "text": "Copy the source to requirements_gate.py and run python3 requirements_gate.py. Expected printed outcomes: claim_only EVIDENCE_UNVERIFIED; no_owner OWNER_UNCONFIRMED; vague_quality UNTESTABLE; no_denial_test UNSAFE_NEGATIVE_PATH; documented REVIEWABLE_NOT_APPROVED; AUTHORIZATION_ALLOWED_AND_DENIED; REQUIREMENT_REVIEW_NOT_APPROVAL; and REQUIREMENTS_EVIDENCE_ORACLE_PASS. The final state is intentionally NOT 'APPROVED'."
  },
  {
    "type": "paragraph",
    "text": "In separate disposable copies, make each incorrect change while leaving assertions intact: bypass DOCUMENTED provenance; bypass verified decision owner; bypass measurable-oracle requirement; bypass denial-oracle requirement; or make may_view return True for any record. Each unsafe variant must be rejected by a meaningful assertion. When moving this pattern into a real application, inspect responses, persisted state and authorized role assignment instead of relying on booleans. Never present the classroom test as a security audit."
  },
  {
    "type": "resources",
    "title": "Acceptance-test practice",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Test the service",
        "url": "https://www.gov.uk/service-manual/technology/testing-your-service"
      }
    ]
  }
];
export const requirementsTraceabilityBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "This last focused reading connects requirements to change governance. Requirement review is not finished when a user story receives a title: it must be traceable to a problem source, versioned policy/owner, acceptance oracle and expected outcome. A change in evidence or scope can invalidate a previously plausible requirement even when its implementation still passes every old test."
  },
  {
    "type": "heading",
    "id": "req-trace-graph",
    "level": 2,
    "text": "Trace upstream harm to downstream observable evidence"
  },
  {
    "type": "paragraph",
    "text": "Think of a graph: HARM-01 (unknown handoff) → SRC-03 (permitted field observation or explicitly pending evidence) → R-04 (authorized stage visibility) → AC-04-POS/AC-04-NEG (current state and forbidden read) → TEST-04 (automated and review evidence) → RELEASE-DECISION. Keep each link's status, owner, reason and reference. A line in a spreadsheet is not evidence until it identifies the actual source and a reviewer could retrieve it through authorized channels. No source? Label the link EVIDENCE_PENDING."
  },
  {
    "type": "paragraph",
    "text": "Traceability works in both directions. Forward tracing asks whether a stated need has a suitable verification path; backward tracing asks why a feature or test exists. A feature with no defensible problem source may be waste. A source with no acceptance oracle may be untestable. A passing test with no effective negative scenario may be an unsafe false green. Count those missing links and refuse to call the coverage figure 100% if the denominator omitted deferred or disputed requirements."
  },
  {
    "type": "heading",
    "id": "req-conflicts",
    "level": 2,
    "text": "Resolve conflicts without silently choosing the loudest sponsor"
  },
  {
    "type": "paragraph",
    "text": "In the fictional handoff, a manager wants all status records visible to reduce support calls; a customer or privacy owner wants unauthorized people denied; an operator needs enough context to resolve a stalled case. These do not become three equally valid features automatically. Write the conflict: broad visibility versus confidentiality. Establish the legitimate business purpose, actual policy/authority and least-exposure alternative. If policy is not yet available, mark the trade-off UNRESOLVED and defer implementing generalized access."
  },
  {
    "type": "paragraph",
    "text": "Record a decision with stakeholder roles, evidence and authority, alternatives considered, consequences, dissent, date/version and what new fact would cause revision. A reviewer should be able to challenge it with 'What happens to the person not using the app?' and 'Who may grant that access?' A role's organizational influence is not an authorization grant; an engineering team cannot resolve legal ambiguity by picking a convenient default."
  },
  {
    "type": "heading",
    "id": "req-change-impact",
    "level": 2,
    "text": "When evidence changes, re-evaluate the chain"
  },
  {
    "type": "paragraph",
    "text": "Suppose the approved four-week sample shows customers receive updates reliably but the supplier handoff actually fails because case identifiers are reused. The original 'status dashboard' request may no longer target the principal harm. Review R-04's source and priority, revise the correlation/integrity requirement, add a missing-identifier counterexample, and rerun linked verification. Maintain versions and do not edit away the earlier disputed decision. A passing old test says only the old rule still passes."
  },
  {
    "type": "paragraph",
    "text": "Use a change-impact checklist: which problem observation changed? which assumptions or policy references are now false? which requirements and tests depend on them? which data uses or permission scopes change? which risk, quality attribute, budget and operational plan must be revisited? which decision owner must reapprove? If the change invalidates a hard safety boundary, stop or defer implementation even when the new feature would be easy."
  },
  {
    "type": "heading",
    "id": "req-prioritization",
    "level": 2,
    "text": "Prioritize by consequence and reversibility, not volume"
  },
  {
    "type": "paragraph",
    "text": "Risk-based prioritization weighs affected outcome, severity, source confidence, number and kind of affected people, dependency and reversal cost. A requirement blocking unauthorized data exposure can be a noncompensatory gate: it must not be traded away against a feature that makes a manager's dashboard faster. MoSCoW or a scoring matrix can organize decisions but cannot manufacture legal authority or turn an undocumented claim into evidence. If two requirements compete for time, record what evidence could change the order."
  },
  {
    "type": "heading",
    "id": "req-transfer",
    "level": 2,
    "text": "Independent new-domain exercise"
  },
  {
    "type": "paragraph",
    "text": "Choose a different capstone workflow and deliver a six-row requirements ledger spanning one business outcome, two permitted user capabilities, one data/domain rule, one concrete quality attribute and one forbidden action. Every row needs source type/status, responsible owner, problem link, independent success/failure oracle, measurable condition or TODO to validate, and a reasoned priority. Write three Given–When–Then scenarios including an authorized success and a forbidden side effect. Do not fake real interviews or legal requirements."
  },
  {
    "type": "paragraph",
    "text": "Make an explicit change: a previously trusted source turns out to be stale, or a policy owner disallows the data field used by a proposed feature. Show the impacted requirement and test IDs, which are suspended, what must be redrafted and who can approve the revised boundary. Preserve a reversible decision record. Completing a beautiful table is not equivalent to a real customer's acceptance or a production assessment; approval and uncoached learner review remain separate."
  },
  {
    "type": "resources",
    "title": "Requirements management references",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Make a plan for the service",
        "url": "https://www.gov.uk/service-manual/agile-delivery"
      }
    ]
  }
];
