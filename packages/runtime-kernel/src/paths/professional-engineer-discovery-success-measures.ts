import type { LessonBlock } from "../activities/content";
// PED-005: original success/evidence source: eligible outcomes, denominator integrity and evidence claims.
// Every example is FICTIONAL, no real baseline, authorization, trial or causal proof exists.
export const successEvidencePython = "from dataclasses import dataclass, replace\nfrom fractions import Fraction\n\n# All records, permissions, 'improvements' and cohorts are FICTIONAL.\n@dataclass(frozen=True)\nclass Case:\n    case_id: str\n    eligible: bool\n    state: str\n    outcome_verified: bool\n    customer_notified: bool\n\ndef verified_success_rate(cases: list[Case]) -> Fraction:\n    cohort = [c for c in cases if c.eligible]\n    if not cohort:\n        raise ValueError(\"No eligible population\")\n    good = sum(c.state == \"CLOSED\" and c.outcome_verified and c.customer_notified for c in cohort)\n    return Fraction(good, len(cohort))\n\ndef completed_only_rate(cases: list[Case]) -> Fraction:\n    # Deliberately misleading comparison: drops open work from the denominator.\n    cohort = [c for c in cases if c.eligible and c.state != \"OPEN\"]\n    if not cohort:\n        raise ValueError(\"No recorded completed outcomes\")\n    good = sum(c.state == \"CLOSED\" and c.outcome_verified and c.customer_notified for c in cohort)\n    return Fraction(good, len(cohort))\n\ndef unknown_count(cases: list[Case]) -> int:\n    return sum(c.eligible and (c.state == \"OPEN\" or (c.state == \"CLOSED\" and not (c.outcome_verified and c.customer_notified))) for c in cases)\n\nbase = [\n    Case(\"B1\", True, \"CLOSED\", True, True),\n    Case(\"B2\", True, \"CLOSED\", True, True),\n    Case(\"B3\", True, \"CLOSED\", True, True),\n    Case(\"B4\", True, \"CLOSED\", False, False),\n    Case(\"B5\", True, \"FAILED\", True, True),\n    Case(\"B6\", True, \"FAILED\", True, True),\n    Case(\"B7\", True, \"OPEN\", False, False),\n    Case(\"B8\", True, \"OPEN\", False, False),\n]\ncandidate = [\n    Case(\"P1\", True, \"CLOSED\", True, True),\n    Case(\"P2\", True, \"CLOSED\", True, True),\n    Case(\"P3\", True, \"CLOSED\", True, True),\n    Case(\"P4\", True, \"CLOSED\", True, True),\n    Case(\"P5\", True, \"CLOSED\", False, False),\n    Case(\"P6\", True, \"OPEN\", False, False),\n    Case(\"P7\", True, \"OPEN\", False, False),\n    Case(\"P8\", True, \"OPEN\", False, False),\n]\nassert verified_success_rate(base) == Fraction(3, 8)\nassert verified_success_rate(candidate) == Fraction(4, 8)\nassert completed_only_rate(base) == Fraction(3, 6)\nassert completed_only_rate(candidate) == Fraction(4, 5)\nassert unknown_count(base) == 3\nassert unknown_count(candidate) == 4\nassert verified_success_rate(base + [Case(\"X\", False, \"CLOSED\", True, True)]) == Fraction(3, 8)\n\n@dataclass(frozen=True)\nclass Claim:\n    source_verified: bool\n    collection_authorized: bool\n    baseline_defined: bool\n    denominator_all_eligible: bool\n    unknowns_reported: bool\n    comparison_defensible: bool\n    harm_guardrails_checked: bool\n    decision_owner_approved: bool\n\ndef review_claim(c: Claim) -> str:\n    if not c.source_verified:\n        return \"SOURCE_UNVERIFIED\"\n    if not c.collection_authorized:\n        return \"DATA_COLLECTION_NOT_AUTHORIZED\"\n    if not c.baseline_defined:\n        return \"BASELINE_UNDEFINED\"\n    if not c.denominator_all_eligible:\n        return \"DENOMINATOR_EXCLUDES_ELIGIBLE\"\n    if not c.unknowns_reported:\n        return \"UNKNOWN_OUTCOMES_HIDDEN\"\n    if not c.comparison_defensible:\n        return \"CAUSAL_ATTRIBUTION_NOT_SUPPORTED\"\n    if not c.harm_guardrails_checked:\n        return \"HARM_GUARDRAIL_NOT_CHECKED\"\n    if not c.decision_owner_approved:\n        return \"DECISION_NOT_APPROVED\"\n    return \"REVIEWABLE_NOT_CAUSALLY_PROVEN\"\n\nagreed = Claim(True, True, True, True, True, True, True, True)\nchecks = [\n    (\"missing_source\", \"source_verified\", \"SOURCE_UNVERIFIED\"),\n    (\"no_permission\", \"collection_authorized\", \"DATA_COLLECTION_NOT_AUTHORIZED\"),\n    (\"no_baseline\", \"baseline_defined\", \"BASELINE_UNDEFINED\"),\n    (\"biased_denominator\", \"denominator_all_eligible\", \"DENOMINATOR_EXCLUDES_ELIGIBLE\"),\n    (\"unknown_hidden\", \"unknowns_reported\", \"UNKNOWN_OUTCOMES_HIDDEN\"),\n    (\"uncontrolled_comparison\", \"comparison_defensible\", \"CAUSAL_ATTRIBUTION_NOT_SUPPORTED\"),\n    (\"harm_ignored\", \"harm_guardrails_checked\", \"HARM_GUARDRAIL_NOT_CHECKED\"),\n    (\"no_owner_decision\", \"decision_owner_approved\", \"DECISION_NOT_APPROVED\"),\n]\nfor label, field, expected in checks:\n    actual = review_claim(replace(agreed, **{field: False}))\n    assert actual == expected, f\"{label}: {actual} != {expected}\"\n    print(f\"{label}: {actual}\")\nassert review_claim(agreed) == \"REVIEWABLE_NOT_CAUSALLY_PROVEN\"\nprint(\"BASE eligible=8 verified_success=3/8 completed_only=3/6 unknown=3\")\nprint(\"PILOT eligible=8 verified_success=4/8 completed_only=4/5 unknown=4\")\nprint(\"OBSERVED_COMPARISON_IS_NOT_CAUSAL_EFFECT\")\nprint(\"REVIEWABLE_NOT_CAUSALLY_PROVEN\")\nprint(\"SUCCESS_EVIDENCE_COHORT_GATES_PASS\")\n";
export const successOutcomesBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "A project can pass all builds, deploy an attractive interface and still make the user's original problem worse. Success Measures and Evidence connects the capstone's problem statement, eligible population, observed outcomes, quality attributes and decisions to a defensible assessment. The example throughout this lesson is a FICTIONAL warranty-return handoff; there are no real stakeholder interviews, real treatment cohorts, approvals or measured improvement claims."
  },
  {
    "type": "heading",
    "id": "success-outcome",
    "level": 2,
    "text": "Distinguish outputs, activities, outcomes and unintended effects"
  },
  {
    "type": "paragraph",
    "text": "Activity measures capture work performed: number of meetings, test cases written, commits, services deployed or invoices created. Outputs describe what was delivered: a status page, event integration or support procedure. Outcomes describe the actual effect on people and their objectives: customers receive a correct decision, returns are resolved without preventable repeat contacts, and unauthorized readers do not see the record. Impact describes a longer-term change that may involve external forces. Confusing one layer for another makes it possible to call an empty app successful because it was deployed on time."
  },
  {
    "type": "paragraph",
    "text": "For the warranty scenario, 'we built three APIs' is an output. 'The operator can read a state' may be a functional acceptance result. 'Customers receive a valid closure notification without losing their rights, including those with unresolved claims' is a more meaningful outcome. A metric must specify an affected actor and the particular harm it is supposed to reduce. A team that shortens internal queue time by simply marking cases CLOSED prematurely may improve its dashboard while harming customers."
  },
  {
    "type": "heading",
    "id": "success-metric-contract",
    "level": 2,
    "text": "Define one measurable outcome as a contract"
  },
  {
    "type": "paragraph",
    "text": "A measurement contract names a metric ID, purpose and stakeholder, eligible population, observation start/end, event-time or case-time basis, numerator, denominator, inclusion/exclusion rules, handling of missing data/censoring, authoritative source/version, safe collection permission, owner, cadence, and a target justification with approval status. It states what constitutes failure and how an independent reviewer could recompute the figure. 'Closure success rate' is meaningless until 'closure', 'success' and eligible returns are unambiguously defined."
  },
  {
    "type": "paragraph",
    "text": "One provisional metric could be verified customer closure per return initiated during a fixed cohort window: numerator = eligible returns with evidence-backed outcome AND a permitted notification; denominator = ALL eligible returns initiated in that window, including still-open work. Distinguish unknown/unresolved from verified failure, and show those counts separately. If a return is censored because not enough follow-up elapsed, document that and do not treat it as an observed success or quietly remove it. A current ineligible out-of-scope case is excluded according to a predeclared rule, not because its outcome is embarrassing."
  },
  {
    "type": "heading",
    "id": "success-baseline",
    "level": 2,
    "text": "A baseline is a reproducible observation, not a guessed target"
  },
  {
    "type": "paragraph",
    "text": "Before claiming improvement, collect a comparable baseline: same case definition, customer population, timing, quality boundaries, recording instruments and follow-up policy, with a named time period. Changes to intake volume, case complexity, source-system field names, service hours and supplier seasonality can change the measured rate even without an intervention. When there is no authorized or trustworthy historical sample, label BASELINE_UNDEFINED and propose a measurement plan, not a numerical target invented to impress a jury."
  },
  {
    "type": "paragraph",
    "text": "A target should be grounded in stakeholder consequences, available baseline, operational capacity and decision authority. Saying 'we will reduce delay by 50%' without baseline, comparison plan or harm limits gives false precision. Report both the observed metric and uncertainty/limitations, including denominator size and reasons for missing outcomes. A small synthetic fixture or green CI only demonstrates that code can reproduce an arithmetic definition, not that an organization achieved any benefit."
  },
  {
    "type": "heading",
    "id": "success-guardrails",
    "level": 2,
    "text": "Use balancing measures so improvement cannot mask harm"
  },
  {
    "type": "paragraph",
    "text": "One outcome measure is not enough when teams can optimize the number by excluding unfinished work or pressuring operators to close cases. Add balancing metrics: verified wrongful closure or reversal count, customer follow-up burden, accessibility of the outcome, exposure to unauthorized readers, and pending age or backlog. A throughput gain is not acceptable if data confidentiality or a mandatory notification rule is violated; those are noncompensatory stop conditions, not negative points to offset with revenue."
  },
  {
    "type": "paragraph",
    "text": "A measurement review should ask who is missing from the data: people who do not use the portal, claims abandoned before formal submission, customers with inaccessible devices, users with incomplete documents and cases whose supplier has not replied. Disaggregating by relevant process stage or channel helps reveal unequal effects, but data minimization, permission and small-group privacy still apply. The following reading demonstrates how changing a denominator can make an improvement look larger while incomplete records accumulate."
  },
  {
    "type": "resources",
    "title": "Service measures and research",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Measuring the performance of your service",
        "url": "https://www.gov.uk/service-manual/measuring-success"
      },
      {
        "title": "Google SRE — Service Level Objectives",
        "url": "https://sre.google/sre-book/service-level-objectives/"
      }
    ]
  }
];
export const successCohortsBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "A measurement's denominator is a substantive engineering decision. Counting only the claims that finished makes the slowest and most harmed customers disappear from the result. This reading provides a complete, runnable Python 3 program with a baseline and a purported pilot. Both cohorts are deliberately fabricated; they teach denominator integrity, open-case visibility and the distinction between observed change and causal effect."
  },
  {
    "type": "heading",
    "id": "success-cohort-definition",
    "level": 2,
    "text": "Fix the eligible cohort before looking at favorable outcomes"
  },
  {
    "type": "paragraph",
    "text": "The synthetic baseline contains eight eligible returns: three CLOSED with verified outcome AND notification, one incorrectly labeled CLOSED without either required proof, two recorded FAILED outcomes and two still OPEN. The pilot contains eight eligible returns: four valid CLOSED, one unverified CLOSED and three OPEN. The valid customer-outcome rates across all eligible cases are 3/8 (37.5%) and 4/8 (50%). Counting only states that are not OPEN produces 3/6 (50%) and 4/5 (80%), artificially exaggerating the contrast."
  },
  {
    "type": "paragraph",
    "text": "Notice a second problem: unknown/unverified outcomes increased from three to four, because an unverified CLOSED state is not a proved customer outcome. The pilot might have improved a narrow count while its incomplete evidence burden grew. These figures are not evidence that the intervention helped or harmed real customers; they are an intentionally designed counterexample to a misleading dashboard. Explain how a report containing only 80% and no cohort definition erases open work."
  },
  {
    "type": "heading",
    "id": "success-selection",
    "level": 2,
    "text": "Censoring, selection and case-mix affect every comparison"
  },
  {
    "type": "paragraph",
    "text": "For a real cohort, define intake date, eligible channels, a fixed follow-up period, and whether outstanding work is censored or assessed as pending. Cases started last week may have less time to finish than cases from three months ago. A better comparison might align follow-up time since initiation or use a justified time-to-event analysis; do not call open cases failures solely because measurement was premature. Record missing event times, duplicate IDs, invalid statuses and attempts to reclassify difficult cases out of scope."
  },
  {
    "type": "paragraph",
    "text": "An excluded noneligible fixture in the Python script deliberately verifies that exclusion is controlled by predeclared eligibility, not by whether it was successful. If the script started counting that noneligible success, the reported 3/8 would change. In a real dataset, eligibility changes demand a versioned policy and an audit of both historical periods. If new intake channels altered the case mix, a before-after delta cannot be attributed to a product change without an appropriately designed evaluation."
  },
  {
    "type": "heading",
    "id": "success-python",
    "level": 2,
    "text": "Execute source-exact outcome and reporting refusal gates"
  },
  {
    "type": "paragraph",
    "text": "Copy the exact displayed Python into success_evidence.py and run `python3 success_evidence.py`. The standard-library fixture computes verified successes and completed-only ratios, checks counts of open or unverified outcomes and evaluates eight separate reporting guards: source verification, authorized collection, defined baseline, complete eligible denominator, disclosure of unknowns, credible comparison, harm guardrails and approval by the decision owner. The strongest gate is REVIEWABLE_NOT_CAUSALLY_PROVEN; it does not sign off the pilot or prove impact."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "Exact Python 3: eligible-cohort outcome rates, misleading completion-only ratios, unknown evidence and eight review refusals",
    "code": "from dataclasses import dataclass, replace\nfrom fractions import Fraction\n\n# All records, permissions, 'improvements' and cohorts are FICTIONAL.\n@dataclass(frozen=True)\nclass Case:\n    case_id: str\n    eligible: bool\n    state: str\n    outcome_verified: bool\n    customer_notified: bool\n\ndef verified_success_rate(cases: list[Case]) -> Fraction:\n    cohort = [c for c in cases if c.eligible]\n    if not cohort:\n        raise ValueError(\"No eligible population\")\n    good = sum(c.state == \"CLOSED\" and c.outcome_verified and c.customer_notified for c in cohort)\n    return Fraction(good, len(cohort))\n\ndef completed_only_rate(cases: list[Case]) -> Fraction:\n    # Deliberately misleading comparison: drops open work from the denominator.\n    cohort = [c for c in cases if c.eligible and c.state != \"OPEN\"]\n    if not cohort:\n        raise ValueError(\"No recorded completed outcomes\")\n    good = sum(c.state == \"CLOSED\" and c.outcome_verified and c.customer_notified for c in cohort)\n    return Fraction(good, len(cohort))\n\ndef unknown_count(cases: list[Case]) -> int:\n    return sum(c.eligible and (c.state == \"OPEN\" or (c.state == \"CLOSED\" and not (c.outcome_verified and c.customer_notified))) for c in cases)\n\nbase = [\n    Case(\"B1\", True, \"CLOSED\", True, True),\n    Case(\"B2\", True, \"CLOSED\", True, True),\n    Case(\"B3\", True, \"CLOSED\", True, True),\n    Case(\"B4\", True, \"CLOSED\", False, False),\n    Case(\"B5\", True, \"FAILED\", True, True),\n    Case(\"B6\", True, \"FAILED\", True, True),\n    Case(\"B7\", True, \"OPEN\", False, False),\n    Case(\"B8\", True, \"OPEN\", False, False),\n]\ncandidate = [\n    Case(\"P1\", True, \"CLOSED\", True, True),\n    Case(\"P2\", True, \"CLOSED\", True, True),\n    Case(\"P3\", True, \"CLOSED\", True, True),\n    Case(\"P4\", True, \"CLOSED\", True, True),\n    Case(\"P5\", True, \"CLOSED\", False, False),\n    Case(\"P6\", True, \"OPEN\", False, False),\n    Case(\"P7\", True, \"OPEN\", False, False),\n    Case(\"P8\", True, \"OPEN\", False, False),\n]\nassert verified_success_rate(base) == Fraction(3, 8)\nassert verified_success_rate(candidate) == Fraction(4, 8)\nassert completed_only_rate(base) == Fraction(3, 6)\nassert completed_only_rate(candidate) == Fraction(4, 5)\nassert unknown_count(base) == 3\nassert unknown_count(candidate) == 4\nassert verified_success_rate(base + [Case(\"X\", False, \"CLOSED\", True, True)]) == Fraction(3, 8)\n\n@dataclass(frozen=True)\nclass Claim:\n    source_verified: bool\n    collection_authorized: bool\n    baseline_defined: bool\n    denominator_all_eligible: bool\n    unknowns_reported: bool\n    comparison_defensible: bool\n    harm_guardrails_checked: bool\n    decision_owner_approved: bool\n\ndef review_claim(c: Claim) -> str:\n    if not c.source_verified:\n        return \"SOURCE_UNVERIFIED\"\n    if not c.collection_authorized:\n        return \"DATA_COLLECTION_NOT_AUTHORIZED\"\n    if not c.baseline_defined:\n        return \"BASELINE_UNDEFINED\"\n    if not c.denominator_all_eligible:\n        return \"DENOMINATOR_EXCLUDES_ELIGIBLE\"\n    if not c.unknowns_reported:\n        return \"UNKNOWN_OUTCOMES_HIDDEN\"\n    if not c.comparison_defensible:\n        return \"CAUSAL_ATTRIBUTION_NOT_SUPPORTED\"\n    if not c.harm_guardrails_checked:\n        return \"HARM_GUARDRAIL_NOT_CHECKED\"\n    if not c.decision_owner_approved:\n        return \"DECISION_NOT_APPROVED\"\n    return \"REVIEWABLE_NOT_CAUSALLY_PROVEN\"\n\nagreed = Claim(True, True, True, True, True, True, True, True)\nchecks = [\n    (\"missing_source\", \"source_verified\", \"SOURCE_UNVERIFIED\"),\n    (\"no_permission\", \"collection_authorized\", \"DATA_COLLECTION_NOT_AUTHORIZED\"),\n    (\"no_baseline\", \"baseline_defined\", \"BASELINE_UNDEFINED\"),\n    (\"biased_denominator\", \"denominator_all_eligible\", \"DENOMINATOR_EXCLUDES_ELIGIBLE\"),\n    (\"unknown_hidden\", \"unknowns_reported\", \"UNKNOWN_OUTCOMES_HIDDEN\"),\n    (\"uncontrolled_comparison\", \"comparison_defensible\", \"CAUSAL_ATTRIBUTION_NOT_SUPPORTED\"),\n    (\"harm_ignored\", \"harm_guardrails_checked\", \"HARM_GUARDRAIL_NOT_CHECKED\"),\n    (\"no_owner_decision\", \"decision_owner_approved\", \"DECISION_NOT_APPROVED\"),\n]\nfor label, field, expected in checks:\n    actual = review_claim(replace(agreed, **{field: False}))\n    assert actual == expected, f\"{label}: {actual} != {expected}\"\n    print(f\"{label}: {actual}\")\nassert review_claim(agreed) == \"REVIEWABLE_NOT_CAUSALLY_PROVEN\"\nprint(\"BASE eligible=8 verified_success=3/8 completed_only=3/6 unknown=3\")\nprint(\"PILOT eligible=8 verified_success=4/8 completed_only=4/5 unknown=4\")\nprint(\"OBSERVED_COMPARISON_IS_NOT_CAUSAL_EFFECT\")\nprint(\"REVIEWABLE_NOT_CAUSALLY_PROVEN\")\nprint(\"SUCCESS_EVIDENCE_COHORT_GATES_PASS\")\n"
  },
  {
    "type": "paragraph",
    "text": "Keep the expected assertions unchanged and create ten disposable wrong variants: ignore each of the eight reporting guards, treat status CLOSED as sufficient for verified success, or count only non-open cases in the eligible success denominator. All must fail Python assertions. A correct arithmetic test does not prove the source events are authentic, the notifications were received, the study was authorized, the cases comparable or the intervention causal. Independent outcome verification needs its own source and assessment plan."
  },
  {
    "type": "heading",
    "id": "success-no-causality",
    "level": 2,
    "text": "Why an observed difference is not a treatment effect"
  },
  {
    "type": "paragraph",
    "text": "Even a correctly measured increase from 37.5% to 50% can reflect seasonal demand, improved staffing, easier claims, a policy revision, changed data completeness or random variation. A before-after comparison lacks a counterfactual: what would those same eligible cases have experienced without the intervention? Where feasible and ethically authorized, design a randomized rollout or comparable comparison group with predeclared metrics, baseline, follow-up, safety stops and sensitivity checks. When such evidence is unavailable, say OBSERVED_CHANGE_NOT_CAUSALLY_ESTABLISHED rather than announcing the product caused the change."
  },
  {
    "type": "paragraph",
    "text": "If some outcomes can be observed only from customer statements and others from system timestamps, say how the two sources might disagree. Triangulation and independent review matter more than a decorative A/B label. A pilot's sample size, assignment mechanism, interference, missing data and available statistical power constrain what can be concluded. A small educational cohort has no defensible precision interval or production effect estimate. The next reading turns these constraints into a claim-to-evidence ledger and an honest capstone defense."
  },
  {
    "type": "resources",
    "title": "Measurement design and experimentation",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Performance data",
        "url": "https://www.gov.uk/service-manual/measuring-success"
      },
      {
        "title": "GOV.UK Service Manual — User research",
        "url": "https://www.gov.uk/service-manual/user-research"
      }
    ]
  }
];
export const successClaimsBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "A defensible capstone defense separates code correctness, system behavior, user outcome, source validity and causal inference. They require different proof. A passing test can show that a function follows its assertions while the actual question 'Did customers receive the right decisions faster without losing rights?' remains unanswered. This reading builds an evidence map that states what each artifact can establish, what it cannot and which reviewer has authority to accept the claim."
  },
  {
    "type": "heading",
    "id": "success-claim-ladder",
    "level": 2,
    "text": "Build a hierarchy from claim to admissible evidence"
  },
  {
    "type": "paragraph",
    "text": "Use a claim-evidence matrix with ID, wording, scope/time, stakeholder, acceptance oracle, source and permission, method and repeatability, result, limits/uncertainty, decision status and independent reviewer. Claim C-01 'the UI renders the handoff status' may be supported by a screenshot and a browser test, but neither proves that the status is correct. C-02 'an unauthorized user cannot retrieve another customer's record' needs a permitted negative security test at the actual access boundary. C-03 'customers resolve more returns correctly' needs a valid complete cohort and customer outcome evidence, not a CI badge."
  },
  {
    "type": "paragraph",
    "text": "The strength of evidence depends on the claim. Unit tests can prove narrow logic against constructed inputs. Integration tests can show actual contract behavior in a sanctioned environment. Restore drills show operational recoverability when the data and steps are independently checked. Observation or interviews may explain causes but can contain recall and selection bias. An experiment may inform causal impact if assignment, comparability, data rights and missingness are handled. Do not let a higher number of test cases substitute for an independent outcome observation."
  },
  {
    "type": "heading",
    "id": "success-instrumentation",
    "level": 2,
    "text": "Design collection that protects people and data integrity"
  },
  {
    "type": "paragraph",
    "text": "Write down which event marks initiation, document validation, supplier handoff, verified decision and customer notification. Include event IDs and correlation, authoritative clocks, stage timestamps, reason for missing data, case eligibility version and permissible anonymized identifiers. A CLOSED label with no decision event or notification is not automatically a success. Instrumentation should capture consent/permission boundaries, minimize retained identifiers, define access/retention and support manual correction without silently rewriting history."
  },
  {
    "type": "paragraph",
    "text": "Instrumentation may itself alter outcomes: operators asked to log every handoff can slow the service, change behavior or fail to record the hardest cases. Track data completeness by stage and reporting channel and evaluate whether failures disproportionately disappear. A privacy-safe aggregate can hide a small but severe failure group; balance aggregate performance with permitted investigations and noncompensatory safety incidents. Collecting more personal data because 'analytics requires it' is not a sufficient lawful basis."
  },
  {
    "type": "heading",
    "id": "success-stopping",
    "level": 2,
    "text": "Predeclare success, falsification, inconclusive and stop rules"
  },
  {
    "type": "paragraph",
    "text": "A measurement plan should say which outcome and guardrails could support proceeding, which observed harm would stop the pilot, what counts as an inconclusive comparison, who may authorize continuation, and what safe reversible response is available. For example: if protected case identifiers are exposed, stop data collection regardless of improved processing time. If the eligible denominator cannot be reconstructed, report INCONCLUSIVE rather than a carefully chosen success percentage. If a current metric's threshold lacks an owner, retain TARGET_PENDING."
  },
  {
    "type": "paragraph",
    "text": "Avoid deciding success after examining all the results. Moving the target or dropping difficult cases makes an apparent win unfalsifiable. If multiple outcomes are examined, be candid about which were planned in advance and which arose during exploration. Data limitations and unintended harm must remain visible to a jury. An uncoached external evaluation is especially useful because people unfamiliar with the team's narrative may challenge the interpretation of CLOSED, the source of a baseline or a claim of causal impact."
  },
  {
    "type": "heading",
    "id": "success-defense",
    "level": 2,
    "text": "Present an evidence-backed claim without overstating it"
  },
  {
    "type": "paragraph",
    "text": "A strong defense statement would be: 'The synthetic code unit test verified that success requires a recorded decision and notification, and the browser smoke test displayed the correct fixture. We have NOT collected an authorized real-world baseline or independently verified customer outcomes. The hypothetical 3/8 versus 4/8 examples demonstrate how to compute a cohort metric but do not establish actual benefit. We recommend a bounded, approved measurement plan and explicitly leave impact UNVERIFIED.' This is more rigorous than calling a product effective because CI passed."
  },
  {
    "type": "paragraph",
    "text": "Present a one-page evidence dashboard: goals; intended users and affected nonusers; one primary outcome with numerator and denominator; two safety guardrails; baseline/source status; actual results if legitimately observed; risks/uncertainty; and next decision owner. Keep links to the requirements, risk and quality sections so the evidence chain can be challenged in both directions. Distinguish verified artifacts from planned tests and information you cannot lawfully obtain."
  },
  {
    "type": "heading",
    "id": "success-transfer",
    "level": 2,
    "text": "New-domain exercise and evidence audit"
  },
  {
    "type": "paragraph",
    "text": "Choose a capstone other than warranty returns. Define an eligible cohort, a baseline with clear observation dates, a primary outcome, an activity/output metric to reject as an outcome, a quality metric and two balancing/harm measures. Prepare a source/permission/denominator contract for every metric. If no real data exist, create labeled FICTIONAL fixtures and a lawful collection plan; never fabricate real interviews, targets, service-level achievements or signed owners."
  },
  {
    "type": "paragraph",
    "text": "Run the exact Python source and all ten wrong variants, then construct a new counterexample in which a completion-only metric improves while open or unverified outcomes accumulate. Provide a claim-to-evidence matrix and predeclared decision rules for SUCCESS, FAILED, INCONCLUSIVE or STOP_FOR_HARM. Inject two changes: the source data is found to omit a channel, and the apparent pilot improvement vanishes after matching case complexity. Show revised denominators, affected requirement/risk IDs and an honest revised conclusion. The learner must explain why an observed before-after difference is not automatically a causal product effect."
  },
  {
    "type": "resources",
    "title": "Service measurement and causal evidence",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Measuring success",
        "url": "https://www.gov.uk/service-manual/measuring-success"
      },
      {
        "title": "Google SRE — Monitoring distributed systems",
        "url": "https://sre.google/sre-book/monitoring-distributed-systems/"
      }
    ]
  }
];
