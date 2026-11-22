import type { LessonBlock } from "../activities/content";
// PED-005 original Scope and Non-goals: explicit system/owner boundary, dependency closure, change protocol.
// Every source, permission, owner and acceptance flag in this example is FICTIONAL.
export const scopeBoundaryPython = "from dataclasses import dataclass, replace\n\n# FICTIONAL return-case service. These are design-review flags, NOT approvals.\n@dataclass(frozen=True)\nclass Slice:\n    required: bool\n    mandatory_control: bool\n    source_verified: bool\n    collection_permitted: bool\n    owner_named: bool\n    negative_oracle_written: bool\n    dependency_checked: bool\n    linked_outcome: bool\n    prohibited_export: bool\n    new_request: bool\n\ndef scope_gate(item: Slice) -> str:\n    if item.prohibited_export:\n        return \"STOP_PROHIBITED_EXPORT\"\n    if item.required or item.mandatory_control:\n        if not item.source_verified:\n            return \"HOLD_UNVERIFIED_SOURCE\"\n        if not item.collection_permitted:\n            return \"HOLD_NO_PERMISSION\"\n        if not item.owner_named:\n            return \"HOLD_NO_OWNER\"\n        if not item.negative_oracle_written:\n            return \"HOLD_NO_NEGATIVE_ORACLE\"\n        if not item.dependency_checked:\n            return \"HOLD_DEPENDENCY_UNKNOWN\"\n        if not item.linked_outcome:\n            return \"HOLD_NO_OUTCOME_LINK\"\n        return \"CORE_REVIEWABLE_NOT_APPROVED\"\n    if item.new_request:\n        return \"CHANGE_REQUEST_NOT_AUTO_INCLUDED\"\n    if not item.owner_named:\n        return \"NON_GOAL_HANDOFF_OWNER_MISSING\"\n    if not item.dependency_checked:\n        return \"NON_GOAL_HANDOFF_UNVERIFIED\"\n    return \"NON_GOAL_WITH_HANDOFF\"\n\ncore = Slice(True, False, True, True, True, True, True, True, False, False)\ncases = {\n    \"core\": (core, \"CORE_REVIEWABLE_NOT_APPROVED\"),\n    \"critical_control\": (replace(core, required=False, mandatory_control=True), \"CORE_REVIEWABLE_NOT_APPROVED\"),\n    \"prohibited_export\": (replace(core, prohibited_export=True), \"STOP_PROHIBITED_EXPORT\"),\n    \"unverified\": (replace(core, source_verified=False), \"HOLD_UNVERIFIED_SOURCE\"),\n    \"no_consent\": (replace(core, collection_permitted=False), \"HOLD_NO_PERMISSION\"),\n    \"no_owner\": (replace(core, owner_named=False), \"HOLD_NO_OWNER\"),\n    \"no_oracle\": (replace(core, negative_oracle_written=False), \"HOLD_NO_NEGATIVE_ORACLE\"),\n    \"unknown_dependency\": (replace(core, dependency_checked=False), \"HOLD_DEPENDENCY_UNKNOWN\"),\n    \"no_outcome\": (replace(core, linked_outcome=False), \"HOLD_NO_OUTCOME_LINK\"),\n    \"new_feature\": (replace(core, required=False, new_request=True), \"CHANGE_REQUEST_NOT_AUTO_INCLUDED\"),\n    \"excluded_marketing\": (replace(core, required=False), \"NON_GOAL_WITH_HANDOFF\"),\n    \"excluded_owner_missing\": (replace(core, required=False, owner_named=False), \"NON_GOAL_HANDOFF_OWNER_MISSING\"),\n    \"excluded_unverified_handoff\": (replace(core, required=False, dependency_checked=False), \"NON_GOAL_HANDOFF_UNVERIFIED\"),\n}\nfor name, (item, expected) in cases.items():\n    result = scope_gate(item)\n    assert result == expected, f\"{name}: {result} != {expected}\"\n    print(f\"{name}: {result}\")\n\n@dataclass(frozen=True)\nclass Change:\n    baseline_versioned: bool\n    effect_traced: bool\n    capacity_verified: bool\n    decision_owner_approved: bool\n\ndef change_gate(change: Change) -> str:\n    if not change.baseline_versioned:\n        return \"UNKNOWN_BASELINE_HOLD\"\n    if not change.effect_traced:\n        return \"MISSING_TRACEABILITY_HOLD\"\n    if not change.capacity_verified:\n        return \"CAPACITY_NOT_VERIFIED_HOLD\"\n    if not change.decision_owner_approved:\n        return \"OWNER_DECISION_PENDING\"\n    return \"CHANGE_REVIEWABLE_NOT_RELEASE_APPROVED\"\n\nproposed = Change(True, True, True, True)\nchange_cases = {\n    \"missing_baseline\": (replace(proposed, baseline_versioned=False), \"UNKNOWN_BASELINE_HOLD\"),\n    \"missing_impact\": (replace(proposed, effect_traced=False), \"MISSING_TRACEABILITY_HOLD\"),\n    \"capacity_claim_only\": (replace(proposed, capacity_verified=False), \"CAPACITY_NOT_VERIFIED_HOLD\"),\n    \"unsigned_change\": (replace(proposed, decision_owner_approved=False), \"OWNER_DECISION_PENDING\"),\n    \"reviewable_change\": (proposed, \"CHANGE_REVIEWABLE_NOT_RELEASE_APPROVED\"),\n}\nfor name, (change, expected) in change_cases.items():\n    result = change_gate(change)\n    assert result == expected, f\"{name}: {result} != {expected}\"\n    print(f\"{name}: {result}\")\nprint(\"BASELINE core control retained; out-of-scope marketing not silently deployed\")\nprint(\"NO_SIGNED_REAL_AUTHORITY; NO_PRODUCTION_OR_LEGAL_APPROVAL\")\nprint(\"SCOPE_BOUNDARY_AND_CHANGE_GATES_PASS\")\n";
export const scopeFoundationsBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "Scope is a falsifiable agreement about which outcomes the proposed system is accountable for, for which actors, within which workflow, interfaces, time horizon and operational capacity. A smaller feature list is not necessarily a smaller responsibility: deleting authentication, correction or recovery from a sensitive service can make a pilot easier to demo while making the scoped problem unsafe. All warranty-return participants and values below are FICTIONAL; no production access or client approval is implied."
  },
  {
    "type": "heading",
    "id": "scope-four-boundaries",
    "level": 2,
    "text": "Distinguish the problem, system, operating and evidence boundaries"
  },
  {
    "type": "paragraph",
    "text": "The problem boundary identifies whose harm is being addressed, and where the relevant work begins and ends. The system boundary defines which state and decisions the capstone owns. The operating boundary names human procedures, supplier integrations, external policies and the people who must respond when the system fails. The evidence boundary defines which claims the project will actually be able to test or observe. These can diverge: a service may record a handoff without moving funds, but still needs to handle false or missing handoff confirmation honestly."
  },
  {
    "type": "paragraph",
    "text": "For the fictional returns service, a defensible candidate is: accept an authorized return case, record document readiness, submit a permitted supplier handoff, preserve the authoritative status and notify the customer when evidence-backed completion occurs. It does NOT move customer funds, decide warranty policy or store unrestricted copies of all attachments. A supplier integration is a dependency, not a transfer of responsibility for wrong information shown to users. Name the actor and system responsible for each side of the handoff."
  },
  {
    "type": "heading",
    "id": "scope-vocabulary",
    "level": 2,
    "text": "In scope, non-goal, deferred, dependency and assumption mean different things"
  },
  {
    "type": "paragraph",
    "text": "IN SCOPE: a behavior that must be designed and verified in this delivery, with a source, owner and acceptance oracle. A NON-GOAL is deliberately excluded from this effort, with an explicit reason and safe operational handoff where people are affected. DEFERRED means potentially valuable future work pending a trigger or authority; it is not secretly promised in the current release. DEPENDENCY names an external service, decision or process the work requires but does not control. ASSUMPTION marks a proposition not yet confirmed. Treating all five as 'out of scope' hides accountability."
  },
  {
    "type": "paragraph",
    "text": "For example, automated refunds are a non-goal if the problem only requires evidence-backed communication; refund approval remains an external authorized operation. But 'we do not manage refunds' is incomplete if the UI falsely says REFUNDED after an internal status update. Define what the system is allowed to say, what authoritative evidence is needed and what the manual escalation route is. A real customer cannot be made responsible for a gap created by a developer's category label."
  },
  {
    "type": "heading",
    "id": "scope-minimum-coherent",
    "level": 2,
    "text": "Find the smallest coherent end-to-end slice, not the easiest demo"
  },
  {
    "type": "paragraph",
    "text": "A coherent scope preserves one truthful end-to-end outcome and its negative paths. For a return, that could include intake, valid document checks, one supplier handoff, read-only progress, explicit unresolved/failed states, authorized case access, correction and a basic recovery path. These safety and integrity behaviors can be essential even when the capstone does not offer analytics, mobile apps or multilingual themes. 'MVP' does not mean the system can discard evidence, privacy, recovery or the ability to handle a real unhappy path."
  },
  {
    "type": "paragraph",
    "text": "Identify a vertical slice from actor entry through an accountable outcome and an observable test, rather than choosing unrelated easy tickets. If a feature is excluded, check every dependency: do in-scope acceptance tests rely on its event? Does customer notification depend on an external refund confirmation? If yes, document the interface and a safe substitute or defer the entire dependent capability. The next reading teaches this dependency-and-evidence closure as a rigorous scope gate."
  },
  {
    "type": "heading",
    "id": "scope-exclusion-test",
    "level": 2,
    "text": "Write non-goals that a reviewer can challenge"
  },
  {
    "type": "paragraph",
    "text": "A complete non-goal states the excluded behavior, affected actor, reason and evidence status, remaining owner/process, consequence and trigger for reconsideration. Example: 'Automated payments are excluded because no permitted payment provider or owner signoff has been verified. A trained operator will document the actual external refund evidence under the existing authorized process. The capstone cannot advertise an automatically completed refund.' This is stronger than 'payments excluded for now.' A reviewer can inspect which promises and tests must consequently change."
  },
  {
    "type": "paragraph",
    "text": "Other examples: exclude cross-organization reporting where permissions are not established, without hiding necessary access controls; defer automated supplier SLA penalties without claiming to adjudicate disputes; postpone an aesthetic dashboard variant while retaining accessible core tasks. Scope is defensible only when there is a clear non-goal owner, no forbidden dependency, and no important harm transferred silently to users."
  },
  {
    "type": "heading",
    "id": "scope-counterexamples",
    "level": 2,
    "text": "Do not reward superficially smaller projects"
  },
  {
    "type": "paragraph",
    "text": "Removing case recovery reduces coding time but converts a recoverable error into a potential irreversible loss. Removing identity verification may shrink the codebase while exposing someone else's return details. Conversely, building five independent microservices creates new operational commitments without proving better handoff outcomes. An automatic 'score' of complexity points can not overrule a hard data restriction or compensate for a missing permission. If essential controls cannot be delivered, narrow the workflow or stop; do not label the resulting unsafe demo production-ready."
  },
  {
    "type": "paragraph",
    "text": "Draft an initial boundary map with explicit INPUT, IN_SCOPE, OUTPUT, DEPENDENCY, NON_GOAL, OWNER, TRIGGER and UNKNOWN labels. For every in-scope behavior cite a stakeholder outcome or risk and specify both success and forbidden-side-effect tests. For every excluded behavior identify the remaining safe path. Source type and real authorization are NOT_VERIFIED until genuinely obtained. The following Python example models classification, not real customer or contract signoff."
  },
  {
    "type": "resources",
    "title": "Scoping and service design",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Discovery phase",
        "url": "https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works"
      },
      {
        "title": "GOV.UK Service Manual — Working across organisational boundaries",
        "url": "https://www.gov.uk/service-manual"
      }
    ]
  }
];
export const scopeDependenciesBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "Cutting scope is engineering work because dependencies and invariants connect ostensibly separate features. A responsible reduction preserves the minimum behavior that delivers trustworthy evidence and contains failure. This reading introduces capability graphs, hard constraints, negative oracles and an exact Python 3 fixture that refuses unsafe scope claims. It does NOT measure actual workload, authorize data exports or replace real architecture review."
  },
  {
    "type": "heading",
    "id": "scope-dependency-graph",
    "level": 2,
    "text": "Trace prerequisites and negative paths before removing work"
  },
  {
    "type": "paragraph",
    "text": "Write a capability graph in which each proposed in-scope action has incoming events, state dependencies, approval authority, operating owner and a testable outcome. Example: a confirmed customer notice depends on a verified supplier decision, which depends on an authorized case handoff; both require access restrictions and a recoverable authoritative record. A 'fast' shortcut that skips the verified decision destroys the correctness claim. Ask whether an exclusion makes an included outcome impossible, unknowable or unsafe."
  },
  {
    "type": "paragraph",
    "text": "Classify links as MUST_HAPPEN_BEFORE, MUST_REMAIN_TRUE, EXTERNAL_HANDOFF and OPTIONAL_VALUE. A critical access or audit invariant should not disappear because it lives in a cross-cutting service rather than a visible feature. A dependency not controlled by the capstone needs a failure response, alternate manual procedure or explicit hold. Circular dependencies ('we can verify owner permission once the app is live') require a separate precondition, not optimistic scheduling."
  },
  {
    "type": "heading",
    "id": "scope-release-slices",
    "level": 2,
    "text": "Build a thin but trustworthy release boundary"
  },
  {
    "type": "paragraph",
    "text": "Use a release-slice ledger with ID, affected actor, outcome, reason for inclusion, evidence source/consent, dependencies, negative action oracle, accountable owner, test, residual unknown and status. For fictional core intake, the owner must specify eligible returns, forbidden access to other customers and how incomplete records remain OPEN. A mandatory access control can be in scope even if it has no stand-alone user-facing feature. Optional automated marketing analytics should not be included merely because the same database has the data."
  },
  {
    "type": "paragraph",
    "text": "Suppose a supplier sandbox becomes unavailable. Do not make an unauthorized live API call to satisfy the graph. Options: test a contract stub for bounded logic while marking end-to-end integration NOT_TESTED, request permission, or defer the supplier-dependent handoff. A synthetic stub verifies only local behavior. The scope decision may become HOLD_DEPENDENCY_UNKNOWN or NARROW_SCOPE, and the customer-facing promise must change accordingly."
  },
  {
    "type": "heading",
    "id": "scope-hard-gates",
    "level": 2,
    "text": "Hard constraints are not points in a feature score"
  },
  {
    "type": "paragraph",
    "text": "The teaching example's scope gate examines whether an item would export prohibited data; whether a core or mandatory-control capability has verified source, permission, owner, forbidden-action oracle, checked dependency and outcome link; whether a new optional request is merely a change proposal; or whether an optional capability can be a documented non-goal with handoff. A prohibited export is a STOP even when feature delivery looks cheap. A mandatory access control must be treated as core even when 'required' is false in a sponsor's feature list."
  },
  {
    "type": "paragraph",
    "text": "The model distinguishes SOURCE_UNVERIFIED from NO_PERMISSION and NO_OWNER because each requires a different action. For the fictional pass case, the strongest status is CORE_REVIEWABLE_NOT_APPROVED: the Boolean flags are invented, not real documents. A new optional feature returns CHANGE_REQUEST_NOT_AUTO_INCLUDED, not an automatic in-scope assignment. An optional exclusion is NON_GOAL_WITH_HANDOFF only if its remaining owner and external handoff dependency are represented by the teaching flags; when either is absent the source explicitly returns NON_GOAL_HANDOFF_OWNER_MISSING or NON_GOAL_HANDOFF_UNVERIFIED. Even those Boolean flags are fictional; a real person must independently confirm responsibility and capacity before any actual customer promise."
  },
  {
    "type": "heading",
    "id": "scope-published-python",
    "level": 2,
    "text": "Run the literal learner-visible source"
  },
  {
    "type": "paragraph",
    "text": "Save the complete block as `scope_boundaries.py` and execute `python3 scope_boundaries.py` with only Python 3's standard library. It prints core, critical control, forbidden export, unknown source, absent permission/owner, missing negative oracle, unknown dependency/outcome, requested extension and documented non-goal cases. It then checks four change-gate refusals and one fictional reviewable change. The final marker is SCOPE_BOUNDARY_AND_CHANGE_GATES_PASS. This output is a classroom assertion suite, never production or legal approval."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "Exact Python 3 — core/non-goal boundary, permission and acceptance gates, versioned change decisions",
    "code": "from dataclasses import dataclass, replace\n\n# FICTIONAL return-case service. These are design-review flags, NOT approvals.\n@dataclass(frozen=True)\nclass Slice:\n    required: bool\n    mandatory_control: bool\n    source_verified: bool\n    collection_permitted: bool\n    owner_named: bool\n    negative_oracle_written: bool\n    dependency_checked: bool\n    linked_outcome: bool\n    prohibited_export: bool\n    new_request: bool\n\ndef scope_gate(item: Slice) -> str:\n    if item.prohibited_export:\n        return \"STOP_PROHIBITED_EXPORT\"\n    if item.required or item.mandatory_control:\n        if not item.source_verified:\n            return \"HOLD_UNVERIFIED_SOURCE\"\n        if not item.collection_permitted:\n            return \"HOLD_NO_PERMISSION\"\n        if not item.owner_named:\n            return \"HOLD_NO_OWNER\"\n        if not item.negative_oracle_written:\n            return \"HOLD_NO_NEGATIVE_ORACLE\"\n        if not item.dependency_checked:\n            return \"HOLD_DEPENDENCY_UNKNOWN\"\n        if not item.linked_outcome:\n            return \"HOLD_NO_OUTCOME_LINK\"\n        return \"CORE_REVIEWABLE_NOT_APPROVED\"\n    if item.new_request:\n        return \"CHANGE_REQUEST_NOT_AUTO_INCLUDED\"\n    if not item.owner_named:\n        return \"NON_GOAL_HANDOFF_OWNER_MISSING\"\n    if not item.dependency_checked:\n        return \"NON_GOAL_HANDOFF_UNVERIFIED\"\n    return \"NON_GOAL_WITH_HANDOFF\"\n\ncore = Slice(True, False, True, True, True, True, True, True, False, False)\ncases = {\n    \"core\": (core, \"CORE_REVIEWABLE_NOT_APPROVED\"),\n    \"critical_control\": (replace(core, required=False, mandatory_control=True), \"CORE_REVIEWABLE_NOT_APPROVED\"),\n    \"prohibited_export\": (replace(core, prohibited_export=True), \"STOP_PROHIBITED_EXPORT\"),\n    \"unverified\": (replace(core, source_verified=False), \"HOLD_UNVERIFIED_SOURCE\"),\n    \"no_consent\": (replace(core, collection_permitted=False), \"HOLD_NO_PERMISSION\"),\n    \"no_owner\": (replace(core, owner_named=False), \"HOLD_NO_OWNER\"),\n    \"no_oracle\": (replace(core, negative_oracle_written=False), \"HOLD_NO_NEGATIVE_ORACLE\"),\n    \"unknown_dependency\": (replace(core, dependency_checked=False), \"HOLD_DEPENDENCY_UNKNOWN\"),\n    \"no_outcome\": (replace(core, linked_outcome=False), \"HOLD_NO_OUTCOME_LINK\"),\n    \"new_feature\": (replace(core, required=False, new_request=True), \"CHANGE_REQUEST_NOT_AUTO_INCLUDED\"),\n    \"excluded_marketing\": (replace(core, required=False), \"NON_GOAL_WITH_HANDOFF\"),\n    \"excluded_owner_missing\": (replace(core, required=False, owner_named=False), \"NON_GOAL_HANDOFF_OWNER_MISSING\"),\n    \"excluded_unverified_handoff\": (replace(core, required=False, dependency_checked=False), \"NON_GOAL_HANDOFF_UNVERIFIED\"),\n}\nfor name, (item, expected) in cases.items():\n    result = scope_gate(item)\n    assert result == expected, f\"{name}: {result} != {expected}\"\n    print(f\"{name}: {result}\")\n\n@dataclass(frozen=True)\nclass Change:\n    baseline_versioned: bool\n    effect_traced: bool\n    capacity_verified: bool\n    decision_owner_approved: bool\n\ndef change_gate(change: Change) -> str:\n    if not change.baseline_versioned:\n        return \"UNKNOWN_BASELINE_HOLD\"\n    if not change.effect_traced:\n        return \"MISSING_TRACEABILITY_HOLD\"\n    if not change.capacity_verified:\n        return \"CAPACITY_NOT_VERIFIED_HOLD\"\n    if not change.decision_owner_approved:\n        return \"OWNER_DECISION_PENDING\"\n    return \"CHANGE_REVIEWABLE_NOT_RELEASE_APPROVED\"\n\nproposed = Change(True, True, True, True)\nchange_cases = {\n    \"missing_baseline\": (replace(proposed, baseline_versioned=False), \"UNKNOWN_BASELINE_HOLD\"),\n    \"missing_impact\": (replace(proposed, effect_traced=False), \"MISSING_TRACEABILITY_HOLD\"),\n    \"capacity_claim_only\": (replace(proposed, capacity_verified=False), \"CAPACITY_NOT_VERIFIED_HOLD\"),\n    \"unsigned_change\": (replace(proposed, decision_owner_approved=False), \"OWNER_DECISION_PENDING\"),\n    \"reviewable_change\": (proposed, \"CHANGE_REVIEWABLE_NOT_RELEASE_APPROVED\"),\n}\nfor name, (change, expected) in change_cases.items():\n    result = change_gate(change)\n    assert result == expected, f\"{name}: {result} != {expected}\"\n    print(f\"{name}: {result}\")\nprint(\"BASELINE core control retained; out-of-scope marketing not silently deployed\")\nprint(\"NO_SIGNED_REAL_AUTHORITY; NO_PRODUCTION_OR_LEGAL_APPROVAL\")\nprint(\"SCOPE_BOUNDARY_AND_CHANGE_GATES_PASS\")\n"
  },
  {
    "type": "paragraph",
    "text": "In separate disposable copies, preserve expected assertions while bypassing each independently meaningful control: forbidden export, mandatory-control treatment, source, consent, owner, negative oracle, dependency, outcome link, new-feature change request, versioned baseline, traceability, capacity and decision authority. All fifteen deliberately wrong versions should raise AssertionError. Explain which wrong operational conclusion each mutation would have permitted. The actual Python is printed here exactly as executed by CI; a green script proves only those synthetic gates, not independent human governance."
  },
  {
    "type": "resources",
    "title": "Boundary and change reasoning",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Managing technology",
        "url": "https://www.gov.uk/service-manual/technology"
      },
      {
        "title": "OWASP ASVS",
        "url": "https://owasp.org/www-project-application-security-verification-standard/"
      }
    ]
  }
];
export const scopeChangeBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "Scope control is not resistance to change. New evidence should change the plan when it weakens the original boundary. The discipline is to make the effects visible before a request turns into code, an API contract or a customer promise. This reading covers baseline versioning, the cost of change, negotiation without unsafe compromises and an honest discovery exit decision."
  },
  {
    "type": "heading",
    "id": "scope-change-events",
    "level": 2,
    "text": "Separate request, investigation, decision and implementation"
  },
  {
    "type": "paragraph",
    "text": "A scope request is a proposal: a stakeholder wants refund automation or a wider reporting audience. An investigation compares it with the currently approved problem and evidence, verifies actual authority, identifies requirement and test impacts, checks new risks and estimates capacity. A decision belongs to the right owner and records why it was accepted, deferred, rejected or requires reframing. Implementation follows that decision. The words 'could be useful' and 'the sponsor wants it' do not collapse these four stages."
  },
  {
    "type": "paragraph",
    "text": "Create a change record with change ID, originator, reason, baseline version, affected user group and service promise, impacts on functional/quality/risk/constraint/evidence IDs, safe alternatives, estimated effort and operational support, permissions, decision authority, explicit outcome and reconsideration trigger. No unverified target or fabricated sponsor signature. Updating the non-goal list is also a change: it may transfer work to an operator, and that cost must be owned and tested rather than merely moved to a different document."
  },
  {
    "type": "heading",
    "id": "scope-tradeoffs",
    "level": 2,
    "text": "Evaluate opportunity cost and unowned work"
  },
  {
    "type": "paragraph",
    "text": "A new feature consumes engineering time, operation capacity, validation access and the attention needed to verify the core outcome. Its cost is not only story points. For example, adding multi-tenant reporting may require new tenancy boundaries, authorization tests, data retention policies and incident support. If the request offers no independently sourced benefit, its opportunity cost may exceed the value of completing a correct handoff flow. If a required integrity control is underfunded, do not solve capacity by excluding the control; reduce the delivered capability instead."
  },
  {
    "type": "paragraph",
    "text": "A cheaper alternative sometimes addresses the underlying need. A sponsor asking for automated refunds may actually need customers to know whether their return is awaiting refund authorization. A read-only, appropriately sourced status with a clear manual handoff may provide value without assuming payment rights. This is not proof that the alternative is best: validate the actual stakeholder question, allowed wording and operational process. The scope test is why the outcome matters, not how expensive the feature feels."
  },
  {
    "type": "heading",
    "id": "scope-pivot",
    "level": 2,
    "text": "Reopen the whole boundary when evidence changes the problem"
  },
  {
    "type": "paragraph",
    "text": "A change may be small within the approved outcome or invalidate the outcome itself. If the supplier cannot legally share decision state, the planned notification guarantee may be impossible; a local mock cannot cure that. Mark the dependent claim BLOCKED or REDUCE_SCOPE and revisit requirement, evidence, risk and success metric definitions. If new research reveals that missing documents rather than supplier delay dominate unresolved cases, a handoff integration may no longer be the highest-value slice. Revise the problem frame instead of completing the original architecture for sunk-cost reasons."
  },
  {
    "type": "paragraph",
    "text": "Guard against change laundering: labelling real data export a 'research spike' does not waive authorization, and postponing required restoration until after launch does not preserve recovery quality. A proposed non-goal cannot mean 'not our fault if it fails' when the app creates a customer-facing expectation. The reviewer should ask what happens to the person at the boundary and whether they can obtain a truthful, safe outcome through a named process."
  },
  {
    "type": "heading",
    "id": "scope-decision-log",
    "level": 2,
    "text": "Make a reversible decision with an explicit trigger"
  },
  {
    "type": "paragraph",
    "text": "A concise record should state: current scoped problem and source, options considered, in-scope/non-goal/deferred changes, noncompensatory permission/safety gates, workflow and technical dependencies, affected tests/metrics, owner and capacity evidence, expected downside, what can actually be rolled back, and when to reopen the decision. In the fictional example, adding marketing data export is STOP_PROHIBITED_EXPORT, while a visually polished animation remains NON_GOAL_WITH_HANDOFF only if no user journey depends on it."
  },
  {
    "type": "paragraph",
    "text": "If an operator loses half their availability, reassess the promised manual handoff; a non-goal may now be untenable because the remaining owner cannot perform it. If a regulator or actual data owner forbids an integration, the correct response may be to block the service claim until evidence/authority changes. A boundary that cannot survive its key dependencies is not delivery-ready, even if all mock tests pass. Be explicit about whose decision is pending and avoid unconditional promises."
  },
  {
    "type": "heading",
    "id": "scope-transfer",
    "level": 2,
    "text": "Independent scope review in a different domain"
  },
  {
    "type": "paragraph",
    "text": "Choose a capstone outside warranty returns and document a one-sentence solution-neutral outcome. Create a scope map with three truly core capabilities, two mandatory safety/integrity controls, two optional non-goals, one external dependency and one explicitly deferred capability. Map source/permission, responsible actor, required evidence, acceptance and forbidden-action tests, current baseline version and residual unknowns. Do not omit access/recovery controls solely to make the plan look deliverable."
  },
  {
    "type": "paragraph",
    "text": "Run the published Python and thirteen corrupted variants; for each failure write why the corrupted decision is unsafe. Inject three surprises: a third party withholds authorization, a previously non-goal manual process loses its owner, and a sponsor demands new exports before the core outcome is verified. Update your change ledger, downstream risk/test/evidence IDs and proposed stage gate. The acceptable outcomes include HOLD_PERMISSION, REDUCE_SCOPE, DEFER or REFRAME_PROBLEM; no toy fixture counts as actual authorized deployment."
  },
  {
    "type": "resources",
    "title": "Review and delivery",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Agile delivery",
        "url": "https://www.gov.uk/service-manual/agile-delivery"
      },
      {
        "title": "GOV.UK Service Manual — Service design",
        "url": "https://www.gov.uk/service-manual/service-design"
      }
    ]
  }
];
