import type { Activity } from "../activities";
import type { LessonBlock } from "../activities/content";
// PED-005: Stages build ONE discovery brief. Classroom code never certifies field permission.
export const discoveryBriefProofPython = "from dataclasses import dataclass, replace\n\n# FICTIONAL structural review fixture. No real permission or sign-off exists.\n@dataclass(frozen=True)\nclass Evidence:\n    source_id: str\n    verified: bool\n    permitted: bool\n\n@dataclass(frozen=True)\nclass Requirement:\n    requirement_id: str\n    source_id: str\n    denied_test: str\n\n@dataclass(frozen=True)\nclass Quality:\n    requirement_id: str\n    environment: str\n    max_ms: int | None\n\n@dataclass(frozen=True)\nclass Risk:\n    requirement_id: str\n    harm: str\n\n@dataclass(frozen=True)\nclass Metric:\n    requirement_id: str\n    includes_unresolved: bool\n\n@dataclass(frozen=True)\nclass Review:\n    objection: str\n    evidence_based_response: bool\n    owner_decision_recorded: bool\n\n@dataclass(frozen=True)\nclass Brief:\n    stakeholder: str\n    outcome: str\n    primary: Evidence\n    counter: Evidence\n    contradiction_disclosed: bool\n    requirement: Requirement\n    quality: Quality\n    risk: Risk\n    metric: Metric\n    non_goal_owner: str\n    review: Review\n\ndef review_brief(b: Brief) -> str:\n    if not b.stakeholder or not b.outcome:\n        return \"OUTCOME_OR_STAKEHOLDER_MISSING\"\n    if not b.primary.verified:\n        return \"PRIMARY_EVIDENCE_UNVERIFIED\"\n    if not b.primary.permitted:\n        return \"PRIMARY_EVIDENCE_NOT_PERMITTED\"\n    if not b.counter.verified or not b.counter.permitted:\n        return \"COUNTEREVIDENCE_UNVERIFIED_OR_UNPERMITTED\"\n    if not b.contradiction_disclosed:\n        return \"CONTRADICTION_HIDDEN\"\n    if b.requirement.source_id != b.primary.source_id:\n        return \"REQUIREMENT_NOT_SOURCE_LINKED\"\n    if not b.requirement.denied_test:\n        return \"FORBIDDEN_ACTION_ORACLE_MISSING\"\n    if b.quality.requirement_id != b.requirement.requirement_id or not b.quality.environment or b.quality.max_ms is None:\n        return \"QUALITY_SCENARIO_NOT_MEASURABLE\"\n    if b.risk.requirement_id != b.requirement.requirement_id or not b.risk.harm:\n        return \"RISK_NOT_CONNECTED_TO_HARM\"\n    if b.metric.requirement_id != b.requirement.requirement_id or not b.metric.includes_unresolved:\n        return \"OUTCOME_DENOMINATOR_BIASED\"\n    if not b.non_goal_owner:\n        return \"EXCLUDED_HANDOFF_OWNER_MISSING\"\n    if not b.review.objection:\n        return \"ADVERSARIAL_OBJECTION_MISSING\"\n    if not b.review.evidence_based_response:\n        return \"OBJECTION_NOT_ANSWERED_WITH_EVIDENCE\"\n    if not b.review.owner_decision_recorded:\n        return \"REVIEW_DECISION_NOT_RECORDED\"\n    return \"STRUCTURALLY_REVIEWABLE_NOT_FIELD_APPROVED\"\n\nprimary = Evidence(\"E-DOC-1\", True, True)\ncounter = Evidence(\"E-OBS-2\", True, True)\ngood = Brief(\n    \"customer awaiting warranty decision\",\n    \"know verified outcome without disclosure\",\n    primary, counter, True,\n    Requirement(\"R-ACCESS\", \"E-DOC-1\", \"other-customer denied and unchanged\"),\n    Quality(\"R-ACCESS\", \"fictional load and network\", 300),\n    Risk(\"R-ACCESS\", \"exposing another customer's case\"),\n    Metric(\"R-ACCESS\", True),\n    \"named external refund team (fictional)\",\n    Review(\"what if supplier status is stale?\", True, True),\n)\ncases = {\n    \"reference\": (good, \"STRUCTURALLY_REVIEWABLE_NOT_FIELD_APPROVED\"),\n    \"missing_actor\": (replace(good, stakeholder=\"\"), \"OUTCOME_OR_STAKEHOLDER_MISSING\"),\n    \"source_unverified\": (replace(good, primary=replace(primary, verified=False)), \"PRIMARY_EVIDENCE_UNVERIFIED\"),\n    \"source_unpermitted\": (replace(good, primary=replace(primary, permitted=False)), \"PRIMARY_EVIDENCE_NOT_PERMITTED\"),\n    \"counter_unpermitted\": (replace(good, counter=replace(counter, permitted=False)), \"COUNTEREVIDENCE_UNVERIFIED_OR_UNPERMITTED\"),\n    \"hidden_contradiction\": (replace(good, contradiction_disclosed=False), \"CONTRADICTION_HIDDEN\"),\n    \"orphan_requirement\": (replace(good, requirement=replace(good.requirement, source_id=\"E-NOPE\")), \"REQUIREMENT_NOT_SOURCE_LINKED\"),\n    \"denied_test_missing\": (replace(good, requirement=replace(good.requirement, denied_test=\"\")), \"FORBIDDEN_ACTION_ORACLE_MISSING\"),\n    \"unmeasured_quality\": (replace(good, quality=replace(good.quality, max_ms=None)), \"QUALITY_SCENARIO_NOT_MEASURABLE\"),\n    \"risk_no_harm\": (replace(good, risk=replace(good.risk, harm=\"\")), \"RISK_NOT_CONNECTED_TO_HARM\"),\n    \"unknowns_excluded\": (replace(good, metric=replace(good.metric, includes_unresolved=False)), \"OUTCOME_DENOMINATOR_BIASED\"),\n    \"ownerless_exclusion\": (replace(good, non_goal_owner=\"\"), \"EXCLUDED_HANDOFF_OWNER_MISSING\"),\n    \"no_objection\": (replace(good, review=replace(good.review, objection=\"\")), \"ADVERSARIAL_OBJECTION_MISSING\"),\n    \"unsupported_answer\": (replace(good, review=replace(good.review, evidence_based_response=False)), \"OBJECTION_NOT_ANSWERED_WITH_EVIDENCE\"),\n    \"unsigned_decision\": (replace(good, review=replace(good.review, owner_decision_recorded=False)), \"REVIEW_DECISION_NOT_RECORDED\"),\n}\nfor name, (candidate, expected) in cases.items():\n    result = review_brief(candidate)\n    assert result == expected, f\"{name}: {result} != {expected}\"\n    print(f\"{name}: {result}\")\nprint(\"FICTIONAL_SOURCE_FLAGS_ARE_NOT_FIELD_PERMISSION\")\nprint(\"REVIEWABILITY_DOES_NOT_PROVE_PRODUCT_IMPACT\")\nprint(\"DISCOVERY_BRIEF_TRACE_AND_ADVERSARIAL_GATES_PASS\")\n";
export const discoveryBriefEvidenceBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "The Discovery Brief is not a collage of worksheets from ten previous lessons. It is a falsifiable decision record: whose problem matters, how the current workflow produces harm, what evidence supports or contradicts that interpretation, what would overturn it, and which promises a proposed system may safely make. A working implementation of the wrong problem is still a failed capstone. All warranty-return cases and sources in these readings are FICTIONAL; do not submit them as actual field research."
  },
  {
    "type": "heading",
    "id": "brief-a-current-state",
    "level": 2,
    "text": "Start with an affected person, a unit of work and the current state"
  },
  {
    "type": "paragraph",
    "text": "In a fictional warranty-return workflow, a customer opens a case, an operator requests documents, a supplier reviews the evidence and someone communicates a decision. The problem is not automatically to build a status portal. Ask which specific decision or delay harms which eligible customer, what state is authoritative, whether the supplier owns it and what alternative cause could explain the observed symptom. Model each event and possible missing event before drawing any future architecture."
  },
  {
    "type": "paragraph",
    "text": "A current-state diagram must label actors, decision authority, source artifacts, timestamps, permitted access, handoff failures, recovery and exceptional outcomes. A support spreadsheet and supplier email can contradict one another; a UI may display the wrong status while its endpoint returns HTTP 200. Name the actual owner of every state and the user-facing consequence when the owner is unknown or unavailable. Do not silently treat an operator confirmation as a verified refund or final supplier decision."
  },
  {
    "type": "heading",
    "id": "brief-a-provenance",
    "level": 2,
    "text": "Make provenance and permission separate evidence fields"
  },
  {
    "type": "paragraph",
    "text": "Each significant claim needs a stable claim ID, source ID, source type, date or observed period, eligible work unit, affected actor, permission status, source independence, limitations and known counterevidence. Testimony, observed event, document and simulated transcript are not interchangeable. A real stakeholder promising later access is not collection consent. If actual permission or an independent source is absent, write UNVERIFIED or NOT_TESTED and design an authorized next action."
  },
  {
    "type": "paragraph",
    "text": "For this synthetic case E-DOC-1 is a hypothetical returns policy and E-OBS-2 is a contradictory hypothetical supplier-status observation. They can illustrate a ledger format but do not prove any organization behaves this way. Claim C-STATUS-1 might say a manual closure is mistaken for final supplier approval; the contrary hypothesis is that a trusted phone confirmation preceded the manual close. Keep both with their origin, competing interpretation and discriminating evidence instead of collapsing disagreement into a comfortable narrative."
  },
  {
    "type": "heading",
    "id": "brief-a-candidates",
    "level": 2,
    "text": "Reject tempting candidates with a reason that could be reversed"
  },
  {
    "type": "paragraph",
    "text": "Compare at least three substantial problems by affected nonusers, demonstrated harm, independent evidence access, lawful research feasibility, depth, team capacity and consequence if assumptions are false. A numerical 1–5 preference ranking without calibrated meaning is not proof; a compelling technical challenge does not override inability to obtain necessary authorized information. The selection record may legitimately conclude DEFER_ALL. For a rejected candidate, identify the specific contrary observation or changed permission that would reopen it."
  },
  {
    "type": "paragraph",
    "text": "A useful selection table records the candidate's outcome, most credible positive and disconfirming evidence, actual decision owner, unknown constraints, method to falsify the presumed cause and an achievable small coherent slice. Distinguish a solution-neutral problem from a vendor request. Do not change the original problem statement just to accommodate a framework you wish to learn; technology should be justified in a later proposal from supported domain behavior and quality needs."
  },
  {
    "type": "heading",
    "id": "brief-a-deliverable",
    "level": 2,
    "text": "Build one controlled evidence packet, not scattered artifacts"
  },
  {
    "type": "paragraph",
    "text": "Stage A is Brief v0.1 with candidate evaluation, a current workflow including at least one failure and forbidden-action branch, stakeholder-by-handoff map with affected nonuser, evidence/permission ledger, competing causal hypotheses, a defensible solution-neutral frame and a safe stop condition. Every figure, test and claim should reference stable IDs. If you have only illustrative examples, they belong in a clearly labelled teaching appendix rather than an invented empirical findings section."
  },
  {
    "type": "paragraph",
    "text": "Show unknown outcomes instead of silently dropping unresolved cases. Ask whether the pending supplier handoff, denied document retrieval and actual customer communication are represented in the current state. For each critical question, name the exact owner or permitted method needed to answer it. The resulting boundary should clarify what the proposed system will and will NOT decide, while leaving architecture unselected until scope, constraints and evidence are established."
  },
  {
    "type": "heading",
    "id": "brief-a-falsification",
    "level": 2,
    "text": "Define a test that could weaken the preferred explanation"
  },
  {
    "type": "paragraph",
    "text": "Two causal stories may fit the same symptom. If late refunds arise from missing paperwork rather than supplier processing delay, a supplier integration might be impressive but misdirected. A good discovery test specifies eligible cases, event definitions, alternative explanation, permissions, observation period and the result that would change the recommended focus. No real permission means NO_REAL_TEST, not a fake completed interview. When uncertainty is high, research may be more valuable than building."
  },
  {
    "type": "paragraph",
    "text": "Stage A cannot be called ready because all its fields contain text. A reviewer must independently follow one important claim to an actual source or explicit gap, identify a contradictory account, recognize who bears the harm and reconstruct the existing path without proposing technology. Passing this stage authorizes preparing the trace matrix, not actual deployment, data collection or a conclusion that a product causes benefit."
  },
  {
    "type": "resources",
    "title": "Discovery and evidence methodology",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Discovery phase",
        "url": "https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works"
      },
      {
        "title": "GOV.UK Service Manual — User research",
        "url": "https://www.gov.uk/service-manual/user-research"
      }
    ]
  }
];
export const discoveryBriefTraceBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "The second stage connects the original requirements, constraints, quality scenarios, risk register, success measures and scope into ONE inspectable argument. Tables that contain all the expected headings can still be wrong when their rows have no shared source, false acceptance tests, hidden denominators or undefined non-goal owners. The cross-domain trace is supposed to make those contradictions visible before architecture is chosen."
  },
  {
    "type": "heading",
    "id": "brief-b-trace",
    "level": 2,
    "text": "Connect evidence to consequence in both directions"
  },
  {
    "type": "paragraph",
    "text": "For a fictional return, a trace might be E-DOC-1 → C-STATUS-1 → R-ACCESS → T-ALLOW and T-DENY → Q-ACCESS under a named network and load → RISK-LEAK → M-VERIFIED-CLOSURE with ALL eligible cases → SCOPE-STATUS and NON-GOAL-AUTO-REFUND owned externally. Going backward should identify the harmed person, source and permission. Going forward should identify the allowed behavior, forbidden side effect, owner and event that could falsify the claimed outcome. A row with a fashionable technology but no source or outcome is an orphan."
  },
  {
    "type": "paragraph",
    "text": "A valid requirement must be traceable to a claim that has a legitimate source, and its negative oracle must say what must remain unchanged after rejection. For an unauthorized operator, simply observing HTTP 403 is insufficient if data leaked into response, logs or persisted state. A quality threshold also needs stimulus, environment, eligible population and approved objective status. A risk without a concrete harmed stakeholder or mechanism is just a category label. No confidence tag can convert hypothetical source content into real access authorization."
  },
  {
    "type": "heading",
    "id": "brief-b-evidence-ladder",
    "level": 2,
    "text": "Do not infer field success from software behavior"
  },
  {
    "type": "paragraph",
    "text": "Unit tests may show that a handler rejects a duplicated event in a mock. An integration test can verify permitted contract handling in a stated environment. A controlled restore drill can reveal which state is actually recovered. None alone demonstrates that customers understood the result, that a supplier is authoritative, that consent exists or that the product caused an improvement. Define separate proof for implementation behavior, operational correctness, real user outcomes and causal impact, including independent review and source provenance."
  },
  {
    "type": "paragraph",
    "text": "One example of a misleading metric is a high closure ratio calculated only among completed return cases. Open cases often bear the greatest harm. Preserve a predeclared eligible denominator, fixed observation/follow-up window, missing outcomes, baseline comparability and safety guardrails. A green synthetic p95, a passing denied-path test and a self-reported satisfaction survey are different kinds of evidence. If the real source is unavailable, the metric contract is planned, not observed."
  },
  {
    "type": "heading",
    "id": "brief-b-nongoals",
    "level": 2,
    "text": "An excluded capability still has consequences"
  },
  {
    "type": "paragraph",
    "text": "When automated refunds are out of scope, the system cannot claim money was refunded simply because a status field changed. Identify the actual human or external system that performs the excluded work, which evidence authorizes an in-scope notification, and what the customer is told if the handoff fails. If the responsible operator does not exist or has no available capacity, the exclusion is unsafe; narrow scope or suspend the downstream promise. Scope and risk registers should both reference that gap."
  },
  {
    "type": "paragraph",
    "text": "Revisit a dependency when proposed integration permission is revoked, a field contains protected data, an operating owner leaves, or the supplier cannot produce an authoritative event. Every change must identify affected requirements, negative tests, quality claims, outcome metrics and delivery feasibility. Do not describe a fake sandbox flag as a signed customer contract. A dependency graph with missing nodes is evidence of an honest hold, not proof of a working interface."
  },
  {
    "type": "heading",
    "id": "brief-b-code",
    "level": 2,
    "text": "Run and falsify the exact published structural review"
  },
  {
    "type": "paragraph",
    "text": "Save the entire Python block below as discovery_brief_review.py and execute python3 discovery_brief_review.py. The standard library fixture evaluates a FICTIONAL trace and fourteen distinct breakages: missing harmed actor, unverified or unpermitted source, unpermitted counterevidence, hidden contradiction, orphaned requirement, missing forbidden-action oracle, quality without measurable context, risk without harm, metric that drops unresolved cases, excluded handoff with no owner, missing reviewer objection, ungrounded answer and missing owner decision. The best result is STRUCTURALLY_REVIEWABLE_NOT_FIELD_APPROVED, never production or field approval."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "Source-exact Python 3 — discovery trace, negative acceptance and adversarial review refusals",
    "code": "from dataclasses import dataclass, replace\n\n# FICTIONAL structural review fixture. No real permission or sign-off exists.\n@dataclass(frozen=True)\nclass Evidence:\n    source_id: str\n    verified: bool\n    permitted: bool\n\n@dataclass(frozen=True)\nclass Requirement:\n    requirement_id: str\n    source_id: str\n    denied_test: str\n\n@dataclass(frozen=True)\nclass Quality:\n    requirement_id: str\n    environment: str\n    max_ms: int | None\n\n@dataclass(frozen=True)\nclass Risk:\n    requirement_id: str\n    harm: str\n\n@dataclass(frozen=True)\nclass Metric:\n    requirement_id: str\n    includes_unresolved: bool\n\n@dataclass(frozen=True)\nclass Review:\n    objection: str\n    evidence_based_response: bool\n    owner_decision_recorded: bool\n\n@dataclass(frozen=True)\nclass Brief:\n    stakeholder: str\n    outcome: str\n    primary: Evidence\n    counter: Evidence\n    contradiction_disclosed: bool\n    requirement: Requirement\n    quality: Quality\n    risk: Risk\n    metric: Metric\n    non_goal_owner: str\n    review: Review\n\ndef review_brief(b: Brief) -> str:\n    if not b.stakeholder or not b.outcome:\n        return \"OUTCOME_OR_STAKEHOLDER_MISSING\"\n    if not b.primary.verified:\n        return \"PRIMARY_EVIDENCE_UNVERIFIED\"\n    if not b.primary.permitted:\n        return \"PRIMARY_EVIDENCE_NOT_PERMITTED\"\n    if not b.counter.verified or not b.counter.permitted:\n        return \"COUNTEREVIDENCE_UNVERIFIED_OR_UNPERMITTED\"\n    if not b.contradiction_disclosed:\n        return \"CONTRADICTION_HIDDEN\"\n    if b.requirement.source_id != b.primary.source_id:\n        return \"REQUIREMENT_NOT_SOURCE_LINKED\"\n    if not b.requirement.denied_test:\n        return \"FORBIDDEN_ACTION_ORACLE_MISSING\"\n    if b.quality.requirement_id != b.requirement.requirement_id or not b.quality.environment or b.quality.max_ms is None:\n        return \"QUALITY_SCENARIO_NOT_MEASURABLE\"\n    if b.risk.requirement_id != b.requirement.requirement_id or not b.risk.harm:\n        return \"RISK_NOT_CONNECTED_TO_HARM\"\n    if b.metric.requirement_id != b.requirement.requirement_id or not b.metric.includes_unresolved:\n        return \"OUTCOME_DENOMINATOR_BIASED\"\n    if not b.non_goal_owner:\n        return \"EXCLUDED_HANDOFF_OWNER_MISSING\"\n    if not b.review.objection:\n        return \"ADVERSARIAL_OBJECTION_MISSING\"\n    if not b.review.evidence_based_response:\n        return \"OBJECTION_NOT_ANSWERED_WITH_EVIDENCE\"\n    if not b.review.owner_decision_recorded:\n        return \"REVIEW_DECISION_NOT_RECORDED\"\n    return \"STRUCTURALLY_REVIEWABLE_NOT_FIELD_APPROVED\"\n\nprimary = Evidence(\"E-DOC-1\", True, True)\ncounter = Evidence(\"E-OBS-2\", True, True)\ngood = Brief(\n    \"customer awaiting warranty decision\",\n    \"know verified outcome without disclosure\",\n    primary, counter, True,\n    Requirement(\"R-ACCESS\", \"E-DOC-1\", \"other-customer denied and unchanged\"),\n    Quality(\"R-ACCESS\", \"fictional load and network\", 300),\n    Risk(\"R-ACCESS\", \"exposing another customer's case\"),\n    Metric(\"R-ACCESS\", True),\n    \"named external refund team (fictional)\",\n    Review(\"what if supplier status is stale?\", True, True),\n)\ncases = {\n    \"reference\": (good, \"STRUCTURALLY_REVIEWABLE_NOT_FIELD_APPROVED\"),\n    \"missing_actor\": (replace(good, stakeholder=\"\"), \"OUTCOME_OR_STAKEHOLDER_MISSING\"),\n    \"source_unverified\": (replace(good, primary=replace(primary, verified=False)), \"PRIMARY_EVIDENCE_UNVERIFIED\"),\n    \"source_unpermitted\": (replace(good, primary=replace(primary, permitted=False)), \"PRIMARY_EVIDENCE_NOT_PERMITTED\"),\n    \"counter_unpermitted\": (replace(good, counter=replace(counter, permitted=False)), \"COUNTEREVIDENCE_UNVERIFIED_OR_UNPERMITTED\"),\n    \"hidden_contradiction\": (replace(good, contradiction_disclosed=False), \"CONTRADICTION_HIDDEN\"),\n    \"orphan_requirement\": (replace(good, requirement=replace(good.requirement, source_id=\"E-NOPE\")), \"REQUIREMENT_NOT_SOURCE_LINKED\"),\n    \"denied_test_missing\": (replace(good, requirement=replace(good.requirement, denied_test=\"\")), \"FORBIDDEN_ACTION_ORACLE_MISSING\"),\n    \"unmeasured_quality\": (replace(good, quality=replace(good.quality, max_ms=None)), \"QUALITY_SCENARIO_NOT_MEASURABLE\"),\n    \"risk_no_harm\": (replace(good, risk=replace(good.risk, harm=\"\")), \"RISK_NOT_CONNECTED_TO_HARM\"),\n    \"unknowns_excluded\": (replace(good, metric=replace(good.metric, includes_unresolved=False)), \"OUTCOME_DENOMINATOR_BIASED\"),\n    \"ownerless_exclusion\": (replace(good, non_goal_owner=\"\"), \"EXCLUDED_HANDOFF_OWNER_MISSING\"),\n    \"no_objection\": (replace(good, review=replace(good.review, objection=\"\")), \"ADVERSARIAL_OBJECTION_MISSING\"),\n    \"unsupported_answer\": (replace(good, review=replace(good.review, evidence_based_response=False)), \"OBJECTION_NOT_ANSWERED_WITH_EVIDENCE\"),\n    \"unsigned_decision\": (replace(good, review=replace(good.review, owner_decision_recorded=False)), \"REVIEW_DECISION_NOT_RECORDED\"),\n}\nfor name, (candidate, expected) in cases.items():\n    result = review_brief(candidate)\n    assert result == expected, f\"{name}: {result} != {expected}\"\n    print(f\"{name}: {result}\")\nprint(\"FICTIONAL_SOURCE_FLAGS_ARE_NOT_FIELD_PERMISSION\")\nprint(\"REVIEWABILITY_DOES_NOT_PROVE_PRODUCT_IMPACT\")\nprint(\"DISCOVERY_BRIEF_TRACE_AND_ADVERSARIAL_GATES_PASS\")\n"
  },
  {
    "type": "paragraph",
    "text": "Make fourteen disposable copies and replace ONE decision guard at a time with an always-false condition without changing the expected output assertions. Each wrong version must fail with Python AssertionError. Identify the false inference each mutation would have allowed. A synthetic record labelled verified=True is a premise of the classroom fixture; it is not a real signature or lawful permission. The test proves consistency of these stated checks, not that the learner has assembled correct field evidence or discovered the right problem."
  },
  {
    "type": "heading",
    "id": "brief-b-packet",
    "level": 2,
    "text": "Stage B requires an independently traceable artifact"
  },
  {
    "type": "paragraph",
    "text": "Produce Brief v0.2 with at least three important requirement chains in your OWN domain, named actual evidence and permission status, competing sources, allowed and denied-path tests with persisted-side-effect oracles, quality scenarios, causal risk statements, outcomes including unresolved eligible work, scope/non-goal ownership and explicit unknowns. A reviewer should be able to follow a randomly selected chain backward and forward without asking the author to invent links on the spot."
  },
  {
    "type": "paragraph",
    "text": "Attach the actual source program results and fourteen rejected mutants, but do not use the program result as a score for the authored brief. Add an explanation of one trace that is invalid or undecidable due to missing permission; state which owner or research action can resolve it. A stage complete marker is only a record of the learner submitting this work. Independent human or field validation remains a distinct, currently unproven claim."
  },
  {
    "type": "resources",
    "title": "Evidence and verification",
    "resources": [
      {
        "title": "OWASP ASVS",
        "url": "https://owasp.org/www-project-application-security-verification-standard/"
      },
      {
        "title": "Google SRE Workbook — Implementing SLOs",
        "url": "https://sre.google/workbook/implementing-slos/"
      }
    ]
  }
];
export const discoveryBriefReviewBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "An adversarial review is not a pleasant meeting where the presenter reads their conclusions aloud and receives polite approval. Its job is to find the most consequential way the discovery brief could be false. A complete set of project artifacts is not proof of a correct problem selection or safe implementation boundary. The reviewer should be able to force a change to a claim, a test, an operating responsibility or a decision."
  },
  {
    "type": "heading",
    "id": "brief-c-lenses",
    "level": 2,
    "text": "Use distinct skeptical review roles"
  },
  {
    "type": "paragraph",
    "text": "The affected-nonuser lens asks who bears costs or privacy harm while being absent from interviews. A domain reviewer checks authoritative state and exceptional workflows. A privacy/security reviewer tests unauthorized access and forbidden data reuse. A reliability/operations reviewer challenges retries, incomplete outcomes, restore integrity and staffing. An evidence/outcomes reviewer attacks denominators and causal interpretations. A delivery reviewer tests permission, dependency ownership, scope and capacity. If one author simulates all these roles, mark SELF-REVIEW rather than claiming independent acceptance."
  },
  {
    "type": "paragraph",
    "text": "A credible review question is designed to falsify something material. The customer claim that all closed cases received a verified decision can be refuted by one CLOSED status lacking authoritative supplier proof. Ask for the real source and permitted method before accepting the revised claim. The answer 'all unit tests passed' is irrelevant to whether real supplier evidence exists. A useful written defense states the claim, competing cause, unavailable evidence and exact next authorized step."
  },
  {
    "type": "heading",
    "id": "brief-c-counterarguments",
    "level": 2,
    "text": "Record what would reverse a claim"
  },
  {
    "type": "paragraph",
    "text": "An objection ledger should contain reviewer role and independence, attacked claim ID, a plausible counterexample, affected person, event and source, permission status, a discriminating observation, result (SUPPORTED, REFUTED, UNKNOWN or NOT_TESTED), impacted requirement/quality/risk/metric/scope IDs, owner, decision and next trigger. Record rebuttal sources rather than argumentative wording. If observation cannot be performed lawfully, maintain a hold; an unavailable test cannot be silently marked passed."
  },
  {
    "type": "paragraph",
    "text": "For a privacy objection, specify an unauthorized operator asking for another case and verify response fields, cached data, state and audit. If the environment only permits synthetic identifiers, do not call it a penetration assessment of the production system. For reliability, inject a supplier timeout followed by a repeated callback and ask whether two user-visible closures occur. For operations, remove the named manual refund team and test whether the non-goal has a safe handoff. For measurement, include cases still OPEN after the chosen follow-up."
  },
  {
    "type": "heading",
    "id": "brief-c-contradictions",
    "level": 2,
    "text": "Make adverse evidence change at least two conclusions"
  },
  {
    "type": "paragraph",
    "text": "Inject a contradictory supplier timestamp: processing time might not be the original bottleneck because document preparation consumed more time. Withdraw or narrow the causal claim. Next, find that a success ratio excluded open cases: recompute the eligible cohort and weaken the progress conclusion. Finally remove permission for an integration: the proposed status guarantee may no longer be an in-scope promise. A review that preserves all initial statements despite these falsifiers has not demonstrated useful correction."
  },
  {
    "type": "paragraph",
    "text": "A reviewer challenge is valuable when it leads to a document change that can be verified: a requirement ID is withdrawn, a negative acceptance test is added, a quality target becomes PENDING, a metric denominator changes or scope is reduced with a named handoff. Merely appending a list of issues to the final page does not repair the argument. Maintain versioned v0.1, v0.2 and v0.3 with a small change log showing previous wording, new evidence, updated decision and retained uncertainty."
  },
  {
    "type": "heading",
    "id": "brief-c-exit",
    "level": 2,
    "text": "Distinguish permission to propose from permission to deploy"
  },
  {
    "type": "paragraph",
    "text": "Discovery can end in RESEARCH_REQUIRED, REDUCE_SCOPE, REFRAME_PROBLEM or CONDITIONALLY_PROCEED_TO_PROPOSAL. Even conditional progress means only that the evidence and boundary are sufficient to investigate technical alternatives under stated restrictions; it is not production approval, lawful data collection consent or proof of customer benefit. A critical prohibited exposure is a stop even if estimated delivery value is high. Missing operating responsibility is not compensated by a beautiful UI."
  },
  {
    "type": "paragraph",
    "text": "The decision record must name the actual competent authority, status of that person's agreement, unresolved material issues, reversibility, conditions that trigger reopening and the first permitted next experiment. Do not fabricate reviewer signatures or label a simulated panel independent. The field evidence and review history must still be sufficient for another engineer to challenge the choice without meeting the author."
  },
  {
    "type": "heading",
    "id": "brief-c-final",
    "level": 2,
    "text": "Transfer the defensible single artifact to Engineering Proposal"
  },
  {
    "type": "paragraph",
    "text": "Final Brief v1.0 should open with the solution-neutral problem, evidence maturity and explicit discovery-exit recommendation. It should link the three candidate rationale, affected actors, real current-state flow, contradictory sources, requirements and forbidden oracles, hard constraints, quality trade-offs, failure risks, full-cohort outcome measures, scope/non-goals and safe handoffs, reviewed objections and the actual evidence limitations. The next module should be able to use it as a source of truth without pretending unknowns are validated."
  },
  {
    "type": "paragraph",
    "text": "Use Stage A for sourcing and framing, Stage B for bidirectional requirement/evidence links and the exact executable refusal tests, and Stage C for skepticism, revision and decision. Present a case in your OWN domain that a reviewer would not already know from the fictional warranty scenario. Show at least one change that invalidates a previous recommendation and one technology deliberately excluded despite its appeal. If the only supporting sources are invented, the correct result is an authorized research plan, not a counterfeit completed discovery."
  },
  {
    "type": "resources",
    "title": "Review and handoff guidance",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Discovery phase",
        "url": "https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works"
      },
      {
        "title": "NIST SP 800-30 — Risk assessment",
        "url": "https://csrc.nist.gov/pubs/sp/800/30/r1/final"
      }
    ]
  }
];
