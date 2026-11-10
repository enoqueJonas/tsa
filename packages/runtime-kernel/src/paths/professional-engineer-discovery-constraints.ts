import type { LessonBlock } from "../activities/content";
// Original Capstone Problem Discovery Constraints: source/authority, feasibility, and conflicts are separate prerequisite readings.
// The contract, currency, legal assertions and options are FICTIONAL; never claim real authorization.
export const constraintsFeasibilityPython = "from dataclasses import dataclass, replace\n\n@dataclass(frozen=True)\nclass Constraint:\n    key: str\n    source_verified: bool\n    authority_confirmed: bool\n    applies_to_scope: bool\n    binding: bool\n\ndef classify(item: Constraint) -> str:\n    # Synthetic evidence only; not a legal or contract interpretation.\n    if not item.source_verified:\n        return \"UNVERIFIED_SOURCE\"\n    if not item.authority_confirmed:\n        return \"AUTHORITY_UNCONFIRMED\"\n    if not item.applies_to_scope:\n        return \"NOT_APPLICABLE\"\n    if not item.binding:\n        return \"NEGOTIABLE_PREFERENCE\"\n    return \"BINDING_FOR_THIS_SCENARIO\"\n\n@dataclass(frozen=True)\nclass Option:\n    name: str\n    exports_private_data: bool\n    monthly_cost: int\n    operator_hours: int\n    supports_contract_protocol: bool\n\ndef evaluate(option: Option) -> str:\n    # The caps and contract rules are invented classroom assumptions.\n    if option.exports_private_data:\n        return \"BLOCKED_DATA_EXPORT\"\n    if option.monthly_cost > 250:\n        return \"BLOCKED_BUDGET\"\n    if option.operator_hours > 6:\n        return \"BLOCKED_OPERATOR_CAPACITY\"\n    if not option.supports_contract_protocol:\n        return \"BLOCKED_CONTRACT_PROTOCOL\"\n    return \"FEASIBLE_NOT_APPROVED\"\n\nbase = Constraint(\"C-01\", True, True, True, True)\nevidence_cases = {\n    \"rumored_regulation\": (replace(base, source_verified=False), \"UNVERIFIED_SOURCE\"),\n    \"unknown_owner\": (replace(base, authority_confirmed=False), \"AUTHORITY_UNCONFIRMED\"),\n    \"other_service\": (replace(base, applies_to_scope=False), \"NOT_APPLICABLE\"),\n    \"preferred_database\": (replace(base, binding=False), \"NEGOTIABLE_PREFERENCE\"),\n    \"verified_contract\": (base, \"BINDING_FOR_THIS_SCENARIO\"),\n}\nfor name, (item, expected) in evidence_cases.items():\n    actual = classify(item)\n    assert actual == expected, f\"{name}: {actual} != {expected}\"\n    print(f\"{name}: {actual}\")\n\noptions = {\n    \"cloud_copy\": (Option(\"cloud_copy\", True, 180, 4, True), \"BLOCKED_DATA_EXPORT\"),\n    \"over_budget\": (Option(\"over_budget\", False, 350, 4, True), \"BLOCKED_BUDGET\"),\n    \"operator_heavy\": (Option(\"operator_heavy\", False, 150, 12, True), \"BLOCKED_OPERATOR_CAPACITY\"),\n    \"wrong_protocol\": (Option(\"wrong_protocol\", False, 120, 3, False), \"BLOCKED_CONTRACT_PROTOCOL\"),\n    \"bounded_local\": (Option(\"bounded_local\", False, 180, 4, True), \"FEASIBLE_NOT_APPROVED\"),\n}\nfor name, (option, expected) in options.items():\n    actual = evaluate(option)\n    assert actual == expected, f\"{name}: {actual} != {expected}\"\n    print(f\"{name}: {actual}\")\nprint(\"FEASIBLE_IS_NOT_DEPLOYMENT_APPROVAL\")\nprint(\"CONSTRAINT_SOURCE_AND_FEASIBILITY_PASS\")\n";
export const constraintsInventoryBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "A constraint narrows which solutions are feasible or permitted in a specified context. It is not the same as a requirement, an implementation choice or a confident stakeholder preference. This lesson continues the fictional warranty handoff case from Requirements: an organization has one existing protocol, a limited operations team and restrictions claimed over customer data. The cases and monetary figures are invented teaching inputs, not evidence of any Mozambican law, contract or company policy."
  },
  {
    "type": "heading",
    "id": "constraint-meaning",
    "level": 2,
    "text": "Constraint, need, assumption and decision are different objects"
  },
  {
    "type": "paragraph",
    "text": "A user need describes an outcome: a case handler must know the verified handoff status. A functional requirement expresses the necessary capability: authorized handlers can retrieve the latest evidenced state. A constraint limits the implementation space: the current vendor exposes only a documented message format, or the hosting contract forbids exporting an identified customer record without permission. An assumption is an unverified proposition that may narrow options if true; an architectural decision is a chosen solution within currently defensible constraints. The fact that someone calls a database 'mandatory' does not turn that database into a hard constraint."
  },
  {
    "type": "paragraph",
    "text": "Take 'we use PostgreSQL already'. What exactly is binding? A contract might require the existing schema to remain queryable through a particular interface; it does not automatically require that every service, log and analytic job use PostgreSQL. Ask whether the restriction applies to one dataset, one component, an audited approval workflow, or all applications. Record the narrowest justified scope before eliminating alternatives. Confusing an existing technology with a universal obligation manufactures architectural lock-in."
  },
  {
    "type": "heading",
    "id": "constraint-sources",
    "level": 2,
    "text": "Where constraints come from, and who can verify them"
  },
  {
    "type": "paragraph",
    "text": "Sources include enacted laws and regulator instructions, contracts and licensing terms, institutional policies, external interface specifications, security/data classification, physical and network realities, funding and delivery commitments, existing system compatibility and actual operational capacity. Each source has a different authority. A legal claim must reference an applicable law and competent interpretation; do not invent a legal duty from hearsay. A contract term requires its operative edition and responsible owner; a signed budget cap requires its scope and accounting period. A vendor brochure or manager's recollection is a discovery lead, not automatically a binding instrument."
  },
  {
    "type": "paragraph",
    "text": "The evidence register should contain ID, exact restriction, kind and source document/version, verification date, scope/population and location, decision authority, binding-versus-negotiable status, expiration or review trigger, measurable threshold, affected design alternatives, and next validation action. A copy of an outdated contract is not the current agreement; a person who maintains a server may not be authorized to reinterpret the customer's privacy obligations. Treat both missing source and unconfirmed authority as explicit blockers to declaring a candidate constraint mandatory."
  },
  {
    "type": "heading",
    "id": "constraint-hard-soft",
    "level": 2,
    "text": "Hard within a boundary does not mean immutable forever"
  },
  {
    "type": "paragraph",
    "text": "A hard constraint is a non-compensatory restriction for the current authorized decision, not an intrinsic property of a technology. If a verified current contract prohibits customer-data exports, an inexpensive hosted design still fails—even if all other factors score well. A soft constraint is a negotiable preference or target, such as favoring a familiar UI framework to minimize training. Negotiable never means irrelevant: retraining and migration have real costs that belong in the analysis. But preferences should not silently defeat more important safety outcomes."
  },
  {
    "type": "paragraph",
    "text": "Constraints can change when a legitimate authority changes the governing source, the time window ends, the scope is reduced or the proposal is renegotiated. You cannot override a binding data-use rule merely by documenting an 'accepted risk' as an engineer. Conversely, do not freeze the whole capstone indefinitely because an unverified manager casually says 'the law requires a particular cloud'. Mark the statement UNVERIFIED_SOURCE and arrange a lawful, competent source check. Uncertainty can defer design rather than force an arbitrary vendor choice."
  },
  {
    "type": "heading",
    "id": "constraint-warranty",
    "level": 2,
    "text": "Worked constraints register for a fictional handoff"
  },
  {
    "type": "paragraph",
    "text": "In this invented example, C-01 is a confirmed customer-data export prohibition in the hypothetical current contract; C-02 limits monthly spending to 250 synthetic currency units; C-03 says the available operations capacity is at most six hours per month; C-04 requires compatibility with a documented contractual supplier protocol. A fifth claim—'our country requires a particular database'—has no identified primary legal source, and is therefore NOT a verified constraint. A manager's preference for one vendor database is a negotiable preference until evidence establishes more."
  },
  {
    "type": "paragraph",
    "text": "Notice the differences. The contract and cost cap are policy or agreement boundaries for this exercise; operations capacity is an empirical capacity assumption that should be checked against staff rotas and incident load; protocol compatibility requires a versioned integration contract and a minimal successful conformance test. The budget may exclude tax, migration and incident overhead; six hours of maintenance may be unsafe even if the forecast is four. Source quality and sensitivity analysis matter as much as the yes/no classification. The next reading computes a deliberately simplified feasibility check; it does not claim real contract approval."
  },
  {
    "type": "resources",
    "title": "Primary infrastructure and technology decision references",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Technology",
        "url": "https://www.gov.uk/service-manual/technology"
      }
    ]
  }
];
export const constraintsFeasibilityBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "Feasibility is the act of comparing candidate solutions with verified, applicable boundaries, not giving every option a numerical attractiveness score. A must-not-export rule is a gate, not a weighted disadvantage that a cheaper subscription can cancel. This focused reading provides a standard-library Python 3 classroom model with traceable, fictional reasons why several plausible architectures must be rejected."
  },
  {
    "type": "heading",
    "id": "constraint-provenance-gate",
    "level": 2,
    "text": "Verify evidence, authority and applicability before enforcing a constraint"
  },
  {
    "type": "paragraph",
    "text": "First review each alleged restriction: is the quoted source genuine/current? Does the actor confirming it have the authority? Does it apply to this system, dataset and period? Is it binding or negotiable? A rumored regulation becomes UNVERIFIED_SOURCE, an unconfirmed owner's interpretation becomes AUTHORITY_UNCONFIRMED, a term governing another system becomes NOT_APPLICABLE and a preferred database becomes NEGOTIABLE_PREFERENCE. Only a verified, applicable, binding entry is BINDING_FOR_THIS_SCENARIO. These classifications are prompts for real review, not legal opinions."
  },
  {
    "type": "paragraph",
    "text": "A common failure is to classify an uncertain rule as 'not important' and proceed to production. If the potential consequence is unauthorized disclosure, absence of evidence should trigger defer/review, not an automatic green. Another failure is to treat an out-of-scope rule as binding and reject useful choices. Both errors arise when a register omits source version, application scope and reviewer authority. Preserve the unresolved status rather than fabricating a yes/no answer."
  },
  {
    "type": "heading",
    "id": "constraint-feasible-options",
    "level": 2,
    "text": "Eliminate infeasible designs with explicit reasons"
  },
  {
    "type": "paragraph",
    "text": "The fictional decision compares five technical arrangements against a synthetic no-export restriction, monthly cost ceiling of 250 units, six operations hours per month and an existing supplier protocol. A cloud copy costs only 180 and fits staff capacity, but exporting identified customer data violates the supposed active agreement. An over-budget option costs 350; an operations-heavy deployment requires twelve hours; a cheap option fails the mandated protocol. One bounded local option passes these teaching gates with cost 180 and four hours of maintenance."
  },
  {
    "type": "paragraph",
    "text": "The result FEASIBLE_NOT_APPROVED is deliberately conservative: this option is only compatible with the stated simplified assumptions. It might still be unfit for privacy, reliability, access control, restore, accessibility, security patching, procurement or real availability. Real capacity is uncertain and staff absence affects operations feasibility. Passing a synthetic four-check filter should authorize neither deployment nor payment. First prove the source facts and actual system behavior, then ask the real decision owner."
  },
  {
    "type": "heading",
    "id": "constraint-code",
    "level": 2,
    "text": "Execute the exact classification and candidate-elimination code"
  },
  {
    "type": "paragraph",
    "text": "Copy the full source into constraints_feasibility.py and execute python3 constraints_feasibility.py in a clean folder. The program prints five evidence classifications and five candidate outcomes, followed by FEASIBLE_IS_NOT_DEPLOYMENT_APPROVAL and CONSTRAINT_SOURCE_AND_FEASIBILITY_PASS. It uses immutable Python dataclasses with named fields; values in these fields are illustrative classroom assumptions, not a source of legal or operational truth."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "Exact Python 3 original Constraints lesson: verified-source classification and explicit non-compensatory feasibility gates",
    "code": "from dataclasses import dataclass, replace\n\n@dataclass(frozen=True)\nclass Constraint:\n    key: str\n    source_verified: bool\n    authority_confirmed: bool\n    applies_to_scope: bool\n    binding: bool\n\ndef classify(item: Constraint) -> str:\n    # Synthetic evidence only; not a legal or contract interpretation.\n    if not item.source_verified:\n        return \"UNVERIFIED_SOURCE\"\n    if not item.authority_confirmed:\n        return \"AUTHORITY_UNCONFIRMED\"\n    if not item.applies_to_scope:\n        return \"NOT_APPLICABLE\"\n    if not item.binding:\n        return \"NEGOTIABLE_PREFERENCE\"\n    return \"BINDING_FOR_THIS_SCENARIO\"\n\n@dataclass(frozen=True)\nclass Option:\n    name: str\n    exports_private_data: bool\n    monthly_cost: int\n    operator_hours: int\n    supports_contract_protocol: bool\n\ndef evaluate(option: Option) -> str:\n    # The caps and contract rules are invented classroom assumptions.\n    if option.exports_private_data:\n        return \"BLOCKED_DATA_EXPORT\"\n    if option.monthly_cost > 250:\n        return \"BLOCKED_BUDGET\"\n    if option.operator_hours > 6:\n        return \"BLOCKED_OPERATOR_CAPACITY\"\n    if not option.supports_contract_protocol:\n        return \"BLOCKED_CONTRACT_PROTOCOL\"\n    return \"FEASIBLE_NOT_APPROVED\"\n\nbase = Constraint(\"C-01\", True, True, True, True)\nevidence_cases = {\n    \"rumored_regulation\": (replace(base, source_verified=False), \"UNVERIFIED_SOURCE\"),\n    \"unknown_owner\": (replace(base, authority_confirmed=False), \"AUTHORITY_UNCONFIRMED\"),\n    \"other_service\": (replace(base, applies_to_scope=False), \"NOT_APPLICABLE\"),\n    \"preferred_database\": (replace(base, binding=False), \"NEGOTIABLE_PREFERENCE\"),\n    \"verified_contract\": (base, \"BINDING_FOR_THIS_SCENARIO\"),\n}\nfor name, (item, expected) in evidence_cases.items():\n    actual = classify(item)\n    assert actual == expected, f\"{name}: {actual} != {expected}\"\n    print(f\"{name}: {actual}\")\n\noptions = {\n    \"cloud_copy\": (Option(\"cloud_copy\", True, 180, 4, True), \"BLOCKED_DATA_EXPORT\"),\n    \"over_budget\": (Option(\"over_budget\", False, 350, 4, True), \"BLOCKED_BUDGET\"),\n    \"operator_heavy\": (Option(\"operator_heavy\", False, 150, 12, True), \"BLOCKED_OPERATOR_CAPACITY\"),\n    \"wrong_protocol\": (Option(\"wrong_protocol\", False, 120, 3, False), \"BLOCKED_CONTRACT_PROTOCOL\"),\n    \"bounded_local\": (Option(\"bounded_local\", False, 180, 4, True), \"FEASIBLE_NOT_APPROVED\"),\n}\nfor name, (option, expected) in options.items():\n    actual = evaluate(option)\n    assert actual == expected, f\"{name}: {actual} != {expected}\"\n    print(f\"{name}: {actual}\")\nprint(\"FEASIBLE_IS_NOT_DEPLOYMENT_APPROVAL\")\nprint(\"CONSTRAINT_SOURCE_AND_FEASIBILITY_PASS\")\n"
  },
  {
    "type": "heading",
    "id": "constraint-negative",
    "level": 2,
    "text": "Test which shortcuts make bad designs falsely pass"
  },
  {
    "type": "paragraph",
    "text": "In separate disposable copies, remove one guard at a time while leaving the source's expected outcomes unchanged. Bypass the source-verified or authority check: the corresponding false 'binding' status must violate an assertion. Bypass applicability or binding status: the unscoped or preferred item must be wrongly classified, and an assertion must fail. Bypass the export, budget, staffing or protocol gate: a previously forbidden option becomes FEASIBLE_NOT_APPROVED, which must fail. The exact source test exercises all eight wrong variants; the point is to explain each error, not merely celebrate a failed assertion."
  },
  {
    "type": "paragraph",
    "text": "The order of checks decides which first blocking reason is displayed when a candidate violates several constraints; it does not mean later violations are safe. In real design evaluation, collect all violated requirements for each option and name the business trade-offs, evidence gaps and options for renegotiation. A negative test does not certify that the production system truly prevents data export or that a real monthly budget is correct. The final reading will examine constraint conflict, temporal change and infeasibility without automatically selecting a technology."
  },
  {
    "type": "resources",
    "title": "Technology risk and architecture references",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Choose technology",
        "url": "https://www.gov.uk/service-manual/technology/choosing-technology"
      }
    ]
  }
];
export const constraintsNegotiationBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "A feasible shortlist must still survive changing facts, interactions between constraints and the possibility that no lawful solution fits the budget, deadline or staffing model. This reading moves beyond a classroom Boolean gate to explain what an engineer should do when real constraints conflict, are unknown, or change mid-delivery."
  },
  {
    "type": "heading",
    "id": "constraint-conflict",
    "level": 2,
    "text": "A set of individually valid constraints can be jointly impossible"
  },
  {
    "type": "paragraph",
    "text": "Imagine the fictional customer's current agreement prohibits data export, but its supplier now requires outbound replication of complete customer records to perform a verification step. If both are genuinely binding, the solution space may be empty. A system cannot simultaneously export and never export the same protected records in the same context. A design slide that labels the contradiction 'accepted risk' does not resolve it. Defer the integration, seek a legally and contractually permissible narrower data exchange, obtain proper authority to amend an agreement, or change scope. Do not manufacture a compliant interface by changing field names while sending the same sensitive information."
  },
  {
    "type": "paragraph",
    "text": "Use a conflict register with constraint IDs, exact scope/version, why they conflict, harm if one is violated, options for avoiding the conflict, authorized decision-maker and stop condition. Distinguish a true contradiction from ambiguity. A supplier may need only a random correlation token rather than raw identity data; that is a hypothesis to verify against the integration contract, not an assumed workaround. Record missing legal or security interpretation as UNRESOLVED and stop irreversible design decisions on that boundary."
  },
  {
    "type": "heading",
    "id": "constraint-budget",
    "level": 2,
    "text": "Make budgets, timelines and staffing testable assumptions"
  },
  {
    "type": "paragraph",
    "text": "A monthly infrastructure price is not the total cost of ownership. Include migration, backup, monitoring, bandwidth, data transfer, incident response, incident on-call and license renewals over a defined horizon. A 'free' service whose maintenance requires twelve hours from a six-hour team is not free. Capacity is time-bound and dependent on skill coverage: a four-hour estimate might be invalid when a single maintainer takes leave or the integration emits unfamiliar failures."
  },
  {
    "type": "paragraph",
    "text": "A delivery deadline might be externally fixed (e.g. an actual contract end date), internally negotiated or a preference. Verify who authorized it and what features or risks can be traded. If no option meets both a fixed deadline and a non-compensatory security constraint, propose scope reduction, resourcing or postponement rather than suppressing controls. Make estimates ranges with assumptions and test them through an approved spike or small pilot. Do not turn fictional currency caps into an actual quotation or an unverified four-week schedule into a binding obligation."
  },
  {
    "type": "heading",
    "id": "constraint-tech",
    "level": 2,
    "text": "Differentiate integration compatibility from implementation lock-in"
  },
  {
    "type": "paragraph",
    "text": "An existing supplier protocol is a real constraint only to the integration boundary where that protocol is necessary. Internal domain storage, queue technology, user interface and deployment approach remain decisions unless separately restricted. PostgreSQL may be the system of record that must be queried; it does not follow that every new component must use PostgreSQL. Conversely, an expensive replacement database that cannot read the authorized existing records may be infeasible even if it is otherwise elegant. Record the specific compatibility test: version, authentication method, allowed data types, error/retry semantics and who can grant access to a sandbox."
  },
  {
    "type": "paragraph",
    "text": "For an integration with limited staging availability, the actual constraint may be that the vendor has no test endpoint and contracts restrict use of production data. That affects test strategy, synthetic fixtures, delivery risk and the value of an emulator. It does not justify unauthorized production calls. Identify the verifying owner, ask for sanctioned test artifacts, and keep integration fitness NOT_TESTED when access is missing. Selecting an architecture without that evidence merely moves the uncertainty into deployment."
  },
  {
    "type": "heading",
    "id": "constraint-reversal",
    "level": 2,
    "text": "Revise decisions when a constraint changes or expires"
  },
  {
    "type": "paragraph",
    "text": "Suppose the current customer agreement is amended by the real contract owner to permit a restricted pseudonymous outbound token, while raw personal data remain prohibited. The old broad no-export assumption needs versioned revision; some architecture choices can be reconsidered, but it does not prove that a cloud design is now legal. Re-evaluate the new permission scope, security and audit conditions, data-flow diagram, corresponding requirements and forbidden-access tests. Maintain old and new constraint versions so an auditor can reconstruct why a design was previously rejected."
  },
  {
    "type": "paragraph",
    "text": "The inverse is more dangerous: operations staffing drops from six available hours to two per month. The once-acceptable bounded local option is no longer feasible under the changed capacity. A cached green architecture decision is not an assurance about the current environment. Create an explicit revalidation trigger and a stop, defer or renegotiate recommendation with an accountable owner. Source verification is continuous governance, not a checkbox set at project kickoff."
  },
  {
    "type": "heading",
    "id": "constraint-transfer",
    "level": 2,
    "text": "Independent new-domain exercise"
  },
  {
    "type": "paragraph",
    "text": "Create an eight-row constraint register for a capstone other than the warranty scenario, covering at least one verified or pending legal/contractual restriction, one data-use boundary, two integration assumptions, an operations-capacity limit, budget and deadline and a negotiable preference. For each state precise scope, source/version, owner, evidence status, hard or soft classification, alternative action and a falsifying observation. Unknown sources must not be presented as law; if the real evidence is unavailable, mark it NOT_VERIFIED."
  },
  {
    "type": "paragraph",
    "text": "Compare three candidate architectures using noncompensatory boundaries and quantified estimates, then inject two changes: remove permission for a previously allowed data exchange and halve operations staffing. Show the new exclusion/review results, affected requirements, tests and decisions. Deliver a justified recommendation that may be NO FEASIBLE SOLUTION, DEFER or NARROW SCOPE. Passing a software gate without actual source evidence remains a teaching demonstration, not an engineering signoff."
  },
  {
    "type": "resources",
    "title": "Architecture decision practice",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Technology",
        "url": "https://www.gov.uk/service-manual/technology"
      }
    ]
  }
];
