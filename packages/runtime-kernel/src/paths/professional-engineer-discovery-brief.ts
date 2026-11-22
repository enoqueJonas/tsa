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
