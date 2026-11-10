import type { LessonBlock } from "../activities/content";
// PED-005 original Working with Ambiguity: evidence classification, quantitative sensitivity and ethical experiment design.
// No classroom probability, payoff, intervention or permitted sample is empirical evidence.
export const ambiguityDecisionPython = "from fractions import Fraction\n\n# ALL payoffs, probabilities and costs below are synthetic teaching assumptions.\n# A real project must NOT claim these are field data or calibrated likelihoods.\nPAYOFFS = {\n    \"automate_supplier\": (100, -60),  # supplier bottleneck / document bottleneck\n    \"fix_intake\": (20, 65),\n    \"limited_pilot\": (30, 25),\n}\nBASE_P = Fraction(3, 5)  # illustrative 0.60, NOT an empirical probability\nRANGE = (Fraction(9, 20), BASE_P, Fraction(7, 10))\n\ndef expected(name: str, p: Fraction) -> Fraction:\n    supplier, documents = PAYOFFS[name]\n    return p * supplier + (1 - p) * documents\n\ndef best(p: Fraction) -> str:\n    return max(PAYOFFS, key=lambda name: expected(name, p))\n\ndef stable(probabilities: tuple[Fraction, ...]) -> bool:\n    return len({best(p) for p in probabilities}) == 1\n\ndef perfect_information_ceiling(p: Fraction) -> Fraction:\n    # This is EVPI only under the fictional complete two-state payoff model.\n    supplier_best = max(pair[0] for pair in PAYOFFS.values())\n    documents_best = max(pair[1] for pair in PAYOFFS.values())\n    return p * supplier_best + (1 - p) * documents_best - expected(best(p), p)\n\ndef study_gate(authorized: bool, safe: bool, study_cost: int, upper_bound: Fraction) -> str:\n    if not authorized:\n        return \"RESEARCH_NOT_AUTHORIZED\"\n    if not safe:\n        return \"UNSAFE_TO_RUN\"\n    if study_cost >= upper_bound:\n        return \"COST_AT_OR_ABOVE_PERFECT_INFO_CEILING\"\n    return \"STUDY_DESIGN_ONLY_NOT_APPROVED\"\n\nassert expected(\"fix_intake\", BASE_P) == 38\nassert expected(\"automate_supplier\", BASE_P) == 36\nassert best(BASE_P) == \"fix_intake\"\nassert best(Fraction(7, 10)) == \"automate_supplier\"\nassert stable(RANGE) is False\nceiling = perfect_information_ceiling(BASE_P)\nassert ceiling == 48\nassert study_gate(False, True, 12, ceiling) == \"RESEARCH_NOT_AUTHORIZED\"\nassert study_gate(True, False, 12, ceiling) == \"UNSAFE_TO_RUN\"\nassert study_gate(True, True, 49, ceiling) == \"COST_AT_OR_ABOVE_PERFECT_INFO_CEILING\"\nassert study_gate(True, True, 12, ceiling) == \"STUDY_DESIGN_ONLY_NOT_APPROVED\"\nprint(\"BASE synthetic_p=0.60 fix_intake=38 supplier_automation=36\")\nprint(\"SENSITIVITY p=0.70 leader=automate_supplier; DECISION_UNSTABLE\")\nprint(\"PERFECT_INFORMATION_CEILING=48, not expected study benefit\")\nprint(\"UNKNOWN_PROBABILITY_NOT_CALIBRATED\")\nprint(\"UNAUTHORIZED_OR_UNSAFE_STUDY_BLOCKED\")\nprint(\"AMBIGUITY_REVERSIBLE_DECISION_PROOF_PASS\")\n";
export const ambiguityInventoryBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "Ambiguity is not a defect in engineering documents to hide behind a decisive architecture diagram. It means the current evidence permits multiple materially different interpretations or choices. This lesson continues an entirely FICTIONAL warranty handoff case. A manager suspects supplier delay; a clerk suspects missing intake documents. Neither testimony is a verified causal account. The previous Problem Framing and Requirements lessons supply the context; no real stakeholder interviews, measured frequencies or authorizations have been completed here."
  },
  {
    "type": "heading",
    "id": "ambiguity-ontology",
    "level": 2,
    "text": "Uncertainty, ambiguity and disagreement are not interchangeable"
  },
  {
    "type": "paragraph",
    "text": "Uncertainty is a lack of knowledge about a defined question, such as the supplier-response distribution for eligible claims. Ambiguity means the question or meaning itself can be interpreted in multiple ways, for example whether 'closed' means an internal status change or a communicated customer outcome. Stakeholder disagreement means two people make incompatible claims; it can arise from different exposure, incentives, definitions or genuine exceptions rather than malice. An assumption is a proposition the project currently treats as true without adequate evidence. A risk links an uncertain event to possible consequences, but not every unknown can sensibly be assigned a numerical probability."
  },
  {
    "type": "paragraph",
    "text": "Use the same unit, timestamp and population definitions learned in Problem Framing: when a manager says 90% of cases are processed within a day, ask whether unresolved cases were excluded and whether a 'day' means working time or calendar time. Inadequately defined denominators are ambiguity about measurement, not just noisy data. A confidence score like 80% should not be invented to make an unsupported assertion look scientific. Prefer a qualitative confidence rationale, source type and precise unknown."
  },
  {
    "type": "heading",
    "id": "ambiguity-evidence-ledger",
    "level": 2,
    "text": "Build a register that supports decisions, not a list of vague concerns"
  },
  {
    "type": "paragraph",
    "text": "For each consequential unknown, record its ID, question and proposed interpretation, why it matters, evidence currently available and missing, alternative hypotheses, who can lawfully validate it, how to collect minimally necessary evidence, a decision that depends on it, consequences if wrong, reversibility, trigger/deadline and status. For example U-01: 'Is supplier latency the principal source of incomplete warranty handoffs?' Source: two conflicting accounts, no authorized event trace. Confidence: uncalibrated. Affected decision: invest in supplier automation versus improved intake. Next: request permitted, anonymized stage timings. If access is denied, the actual outcome is NOT_TESTED—not 50/50."
  },
  {
    "type": "paragraph",
    "text": "Add U-02: 'Does the external protocol require personal data exports?' This potentially intersects a binding privacy or contractual boundary, and cannot be deferred by assigning a small speculative probability. The decision must remain blocked until the competent contract/data owner verifies scope and a lawful test route. U-03: 'Will operators maintain the integration within six hours per month?' may be probed by a small safe operational spike under supervision. The correct research method follows the question and safety boundary, not which demo is easiest to build."
  },
  {
    "type": "heading",
    "id": "ambiguity-cost",
    "level": 2,
    "text": "Make the cost of being wrong explicit"
  },
  {
    "type": "paragraph",
    "text": "A reversibility test asks what happens if the assumption is false, how far the change propagates and whether reversal is credible. A mock screen backed by synthetic records can usually be discarded; migrating real customer data into a new vendor may require contracts, technical extraction, consent, decommissioning and incident recovery. A choice is not reversible just because source control supports git revert. Its dependencies, irreversible side effects and people harmed must be considered. Write an exit condition, rollback rehearsal, data-deletion obligations and an accountable owner for any claimed reversible pilot."
  },
  {
    "type": "paragraph",
    "text": "Prioritize unknowns by consequence, exposure, irreversibility and feasible cost of learning, not an invented product of arbitrary 1–5 scales. A low-confidence color preference may be postponed; unverified authority to export personal data is a hard gate. Another unknown may be high impact but untestable today; constrain the solution so it does not depend on it or explicitly defer the decision. Progress means resolving the right uncertainty or preserving optionality, not eliminating every question."
  },
  {
    "type": "heading",
    "id": "ambiguity-anti-patterns",
    "level": 2,
    "text": "Recognize five ways teams fake clarity"
  },
  {
    "type": "paragraph",
    "text": "False precision invents success percentages, dates or probabilities without an eligible cohort. Solution anchoring uses the first feasible architecture as proof it addresses the harm. Authority substitution treats a sponsor's explanation as a measurement. Over-investigation demands certainty about tiny reversible decisions while ignoring large irreversible ones. Deferred risk laundering puts 'will confirm later' in an appendix even though implementation already crossed the forbidden data or contractual boundary. Each error should be met by a concrete counterexample and an explicit decision status: PROCEED_WITH_GUARDRAILS, EXPERIMENT, DEFER, or BLOCKED_BY_AUTHORITY."
  },
  {
    "type": "paragraph",
    "text": "Independent first exercise: choose a non-warranty capstone idea and describe at least six genuine unanswered questions. For each, distinguish missing evidence, conflicting evidence and ambiguous terminology; mark hypothetical examples as FICTIONAL. Select one high-consequence assumption and explain what observation would falsify it. Do not propose microservices, blockchain, cloud hosting or another stack until the boundary and validation rights are clear. The next reading shows an exact classroom calculation for how a preference can reverse when assumptions change."
  },
  {
    "type": "resources",
    "title": "User research and delivery",
    "resources": [
      {
        "title": "GOV.UK Service Manual — User research",
        "url": "https://www.gov.uk/service-manual/user-research"
      }
    ]
  }
];
export const ambiguitySensitivityBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "Decision analysis under uncertainty can help express what assumptions are driving a choice, but it can just as easily manufacture confidence if probabilities and payoffs are invented and then reported as predictions. This reading shows a small Python 3 model with EXACTLY two fictional causal states for a warranty process: supplier bottleneck versus document bottleneck. Its numeric payoffs and belief probabilities are not empirical. The point is sensitivity and an upper bound on the benefit of information, not an approved architecture or research budget."
  },
  {
    "type": "heading",
    "id": "ambiguity-actions",
    "level": 2,
    "text": "Keep actions, outcomes and belief assumptions separate"
  },
  {
    "type": "paragraph",
    "text": "The table contains three hypothetical interventions: automate supplier interactions, fix the intake checklist, or conduct a bounded manual pilot. If supplier delay truly dominates, the first option yields +100 synthetic utility units, but if documents dominate it yields -60 because the wrong automation adds cost and confusion. Intake repair yields +20/+65 respectively; a limited pilot yields +30/+25. These values are assumptions for explaining the mathematics, NOT measured savings, patient/customer benefit or approval of any plan. A real payoff table would require stakeholder-defined outcomes, uncertainty and costs."
  },
  {
    "type": "paragraph",
    "text": "Assume solely for illustration a 0.60 chance of supplier bottleneck and 0.40 chance of document bottleneck. Expected utility is p×supplier-payoff+(1−p)×document-payoff. The intake option scores 0.6×20+0.4×65=38; supplier automation scores 0.6×100+0.4×(-60)=36. Thus intake wins by a tiny margin under the chosen assumption. There is no defensible reason yet to claim the actual probability is 60%. The outcome is 'under this toy assumption', not 'we should fix intake'."
  },
  {
    "type": "heading",
    "id": "ambiguity-sensitivity",
    "level": 2,
    "text": "Sensitivity analysis reveals whether the ranking is robust"
  },
  {
    "type": "paragraph",
    "text": "Change p to 0.70 without altering the payoff table. Supplier automation then has an expected 0.7×100+0.3×(-60)=52, while intake has 0.7×20+0.3×65=33.5. The recommendation flips. Equating the two expected values gives 160p−60=65−45p, so the boundary is p=125/205≈0.610. If the belief cannot be justified more accurately than the range 0.45–0.70, the favored option is not stable. This is a reason to investigate or choose a safe reversible path, not to cherry-pick 0.60 and declare a confident optimum."
  },
  {
    "type": "paragraph",
    "text": "Separate expected-value criteria from robust or precautionary criteria. A limited pilot might have a lower mean payoff under one hypothetical distribution but much smaller downside and much greater reversibility. The real choice depends on permission, risk tolerance, side effects, the possibility of learning and the cost of reversal. Without real likelihood calibration, a mathematical maximum is only a transparent statement of your model's assumptions; it does not become a decision authority."
  },
  {
    "type": "heading",
    "id": "ambiguity-information",
    "level": 2,
    "text": "Perfect-information value is a ceiling, not a forecast"
  },
  {
    "type": "paragraph",
    "text": "If someone could know the true two-state cause at zero cost before choosing, the hypothetical best conditional result would be 100 in the supplier state and 65 in the document state. At p=0.60 its expected value is 0.6×100+0.4×65=86. The best current expected utility is 38, so the expected value of PERFECT information (EVPI) is 48 synthetic utility units. Actual field research is imperfect and costs time, consent, sampling and analysis; its expected value of SAMPLE information (EVSI) cannot exceed that ceiling in this model, and is often much lower. A study costing 12 units is NOT automatically worthwhile merely because 12 is below 48."
  },
  {
    "type": "paragraph",
    "text": "The calculation can be invalid when important causal states are omitted, utilities ignore privacy, study selection is biased, affected groups are excluded or probabilities lack empirical support. Safety/permission constraints are not utilities to be traded for higher expected payoff. Even if EVPI is positive, an unauthorized or unsafe research method must not proceed. The script's study gate will block those cases, and label a low-cost authorized study only STUDY_DESIGN_ONLY_NOT_APPROVED."
  },
  {
    "type": "heading",
    "id": "ambiguity-source",
    "level": 2,
    "text": "Execute the exact Python and compare three beliefs"
  },
  {
    "type": "paragraph",
    "text": "Run the full code block locally with python3 ambiguity_sensitivity.py. It uses fractions.Fraction rather than floating-point rounding to make comparisons and assertions deterministic. Expected output includes base values intake 38 and supplier automation 36, a changed leader at p=0.70, an EVPI ceiling of 48, uncalibrated probability warning, unauthorized/unsafe study blocked and the final AMBIGUITY_REVERSIBLE_DECISION_PROOF_PASS marker. Every figure is a synthetic classroom assumption, not field evidence."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "Exact Python 3: fictional payoffs, assumption-sensitive decisions, EVPI ceiling and permission gates",
    "code": "from fractions import Fraction\n\n# ALL payoffs, probabilities and costs below are synthetic teaching assumptions.\n# A real project must NOT claim these are field data or calibrated likelihoods.\nPAYOFFS = {\n    \"automate_supplier\": (100, -60),  # supplier bottleneck / document bottleneck\n    \"fix_intake\": (20, 65),\n    \"limited_pilot\": (30, 25),\n}\nBASE_P = Fraction(3, 5)  # illustrative 0.60, NOT an empirical probability\nRANGE = (Fraction(9, 20), BASE_P, Fraction(7, 10))\n\ndef expected(name: str, p: Fraction) -> Fraction:\n    supplier, documents = PAYOFFS[name]\n    return p * supplier + (1 - p) * documents\n\ndef best(p: Fraction) -> str:\n    return max(PAYOFFS, key=lambda name: expected(name, p))\n\ndef stable(probabilities: tuple[Fraction, ...]) -> bool:\n    return len({best(p) for p in probabilities}) == 1\n\ndef perfect_information_ceiling(p: Fraction) -> Fraction:\n    # This is EVPI only under the fictional complete two-state payoff model.\n    supplier_best = max(pair[0] for pair in PAYOFFS.values())\n    documents_best = max(pair[1] for pair in PAYOFFS.values())\n    return p * supplier_best + (1 - p) * documents_best - expected(best(p), p)\n\ndef study_gate(authorized: bool, safe: bool, study_cost: int, upper_bound: Fraction) -> str:\n    if not authorized:\n        return \"RESEARCH_NOT_AUTHORIZED\"\n    if not safe:\n        return \"UNSAFE_TO_RUN\"\n    if study_cost >= upper_bound:\n        return \"COST_AT_OR_ABOVE_PERFECT_INFO_CEILING\"\n    return \"STUDY_DESIGN_ONLY_NOT_APPROVED\"\n\nassert expected(\"fix_intake\", BASE_P) == 38\nassert expected(\"automate_supplier\", BASE_P) == 36\nassert best(BASE_P) == \"fix_intake\"\nassert best(Fraction(7, 10)) == \"automate_supplier\"\nassert stable(RANGE) is False\nceiling = perfect_information_ceiling(BASE_P)\nassert ceiling == 48\nassert study_gate(False, True, 12, ceiling) == \"RESEARCH_NOT_AUTHORIZED\"\nassert study_gate(True, False, 12, ceiling) == \"UNSAFE_TO_RUN\"\nassert study_gate(True, True, 49, ceiling) == \"COST_AT_OR_ABOVE_PERFECT_INFO_CEILING\"\nassert study_gate(True, True, 12, ceiling) == \"STUDY_DESIGN_ONLY_NOT_APPROVED\"\nprint(\"BASE synthetic_p=0.60 fix_intake=38 supplier_automation=36\")\nprint(\"SENSITIVITY p=0.70 leader=automate_supplier; DECISION_UNSTABLE\")\nprint(\"PERFECT_INFORMATION_CEILING=48, not expected study benefit\")\nprint(\"UNKNOWN_PROBABILITY_NOT_CALIBRATED\")\nprint(\"UNAUTHORIZED_OR_UNSAFE_STUDY_BLOCKED\")\nprint(\"AMBIGUITY_REVERSIBLE_DECISION_PROOF_PASS\")\n"
  },
  {
    "type": "paragraph",
    "text": "In separate disposable copies, invert the probability weighting, erase the automation downside, force a fixed leader, make the decision look stable over all p, calculate the perfect-information payoff using the minimum instead of maximum, bypass research authorization, bypass safety, or ignore the information-value ceiling. Each incorrect edit should fail a published assertion. Explain which incorrect inference it would have induced. Python verification means only that the classroom mathematics and deliberate failure cases are reproducible."
  },
  {
    "type": "resources",
    "title": "Research planning",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Plan user research",
        "url": "https://www.gov.uk/service-manual/user-research/plan-user-research"
      }
    ]
  }
];
export const ambiguityExperimentBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "The next decision is not 'which architecture scored highest?' but 'which uncertainty should we reduce, by which permitted method, and which decisions can safely wait?' A pilot or experiment can be useful only if it has a falsifiable question, independent measurement, ethical access, bounded downside and an explicit stop/rollback condition. This final reading complements the probability exercise with real engineering judgment."
  },
  {
    "type": "heading",
    "id": "ambiguity-question-design",
    "level": 2,
    "text": "Choose one discriminating question, not a demonstration"
  },
  {
    "type": "paragraph",
    "text": "An engineering spike is a short technical investigation that reduces a particular unknown, such as whether a versioned supplier sandbox supports the existing authentication protocol; a prototype explores usability or behavior without necessarily implementing production controls; an observational sample examines how the present process behaves; an experiment compares interventions under an approved design. They are not interchangeable. A successful mock API call cannot prove production data rights, and a clickable demo cannot prove users will adopt a system. Define exactly what evidence each method can and cannot produce."
  },
  {
    "type": "paragraph",
    "text": "For the warranty example, if the disputed question is whether stage delay accumulates before or after documents-ready, an authorized time-aligned sample of handoff events is more relevant than a new microservice. If the question is whether an authenticated supplier endpoint exists, request the documented sanctioned sandbox and exercise a narrow contract test. If there is no approved research access, do not create production accounts, copy identifiers or run a live payment/approval transaction. Record the answer as NOT_TESTED and look for authorized documentation or defer the dependent decision."
  },
  {
    "type": "heading",
    "id": "ambiguity-stop",
    "level": 2,
    "text": "Design a bounded experiment with a stop rule"
  },
  {
    "type": "paragraph",
    "text": "An experiment charter should specify the hypothesis and alternative, eligible population or fixture, current baseline and evidence source, who approves participation, how confidentiality is protected, which observable result supports/refutes the hypothesis, a time/cost cap, safety monitoring, what decision follows each outcome and what stops the work. A stop rule might be: abort if the prototype exposes real customer identifiers or alters a production warranty state. A weak version—'we stop when management is satisfied'—is unfalsifiable and vulnerable to pressure to declare success."
  },
  {
    "type": "paragraph",
    "text": "Negative and inconclusive results count as outcomes. If a synthetic load test shows the prototype can tolerate 100 requests per second, it does not establish a business workflow benefit or legal data permission. If the data source is unavailable, the correct record is ACCESS_UNVERIFIED or DEFERRED. If all hypotheses are still plausible after a tiny convenience sample, explain the bias and avoid presenting the pilot as a statistically conclusive experiment."
  },
  {
    "type": "heading",
    "id": "ambiguity-reversibility",
    "level": 2,
    "text": "Preserve options while protecting irreversible boundaries"
  },
  {
    "type": "paragraph",
    "text": "A reversible decision requires realistic rollback time, migration/data-extraction ability, dependency isolation, ownership and a tested exit plan. A short-lived synthetic prototype behind a feature flag may be reversible; an externally advertised SLA, an unencrypted customer-data transfer or a signed multi-year hosting contract may not be. Classify decisions as reversible, costly-to-reverse or effectively irreversible, with an explanation rather than a numeric label invented for convenience. Defer irreversible choices until the source evidence and authority meet the threshold appropriate to their consequences."
  },
  {
    "type": "paragraph",
    "text": "A common counterexample is claiming database migration is reversible because a snapshot exists; the data may have changed, downstream integrations may rely on the new schema and personal data may already have been disclosed to a vendor. Ask which side effects cannot be undone. Conversely, spending weeks perfecting an easily revised label before verifying an external data-use restriction is a misallocation of discovery effort. Use short checkpoints for reversible choices and named approval gates for high-consequence decisions."
  },
  {
    "type": "heading",
    "id": "ambiguity-decision",
    "level": 2,
    "text": "Communicate a decision without hiding uncertainty"
  },
  {
    "type": "paragraph",
    "text": "A useful decision record contains: question and competing hypotheses; verified evidence and missing data; why particular sources are independent; current assumption ranges; options and rejected options; safety/permission boundary; consequence and reversibility; next discriminating test; owner; decision date and reevaluation trigger. It should explicitly say PROCEED_WITH_GUARDRAILS, RESEARCH_REQUESTED, DEFER, or NO_AUTHORIZATION_TO_ACT rather than an attractive but unsupported PASS. The quantitative program's 'STUDY_DESIGN_ONLY_NOT_APPROVED' is not an operational green light."
  },
  {
    "type": "paragraph",
    "text": "For example: 'At present we cannot conclude whether supplier or document processing dominates. The two-state toy model's ranking changes between synthetic p=0.60 and p=0.70. We recommend only drafting a permitted measurement protocol, not deploying supplier automation. Reassess when an authorized, suitably sampled stage-event cohort and contract interpretation are available. The service owner approves the research question; the appropriate privacy/data authority approves any necessary access.' This is a defensible outcome even if it includes no new product feature."
  },
  {
    "type": "heading",
    "id": "ambiguity-transfer",
    "level": 2,
    "text": "Transfer to another domain with a counterexample"
  },
  {
    "type": "paragraph",
    "text": "Choose a new capstone domain and write a six-entry uncertainty register, then isolate one high-impact, difficult-to-reverse choice. State two plausible competing explanations, what independent permitted observation would discriminate between them, what you would learn from a spike versus interview versus event sample, and what you may NOT infer from each. Build a small transparent payoff/sensitivity worksheet using explicitly FICTIONAL assumptions and show at least one reversal of the preferred choice. A toy calculation with invented p is not a real probabilistic forecast."
  },
  {
    "type": "paragraph",
    "text": "Propose an authorized, time-bounded experiment charter with success, falsification, inconclusive outcome and abort/rollback criteria, plus an owner and decision record. Inject two changes: the supposedly safe data-use permission is revoked, and the pilot's measured result contradicts the initial favorite. Show which architecture/requirements/testing decisions are suspended and how the conclusion changes. If no authorized study is available, the appropriate decision can be DEFER. This is the standard the original Working with Ambiguity practical should enforce."
  },
  {
    "type": "resources",
    "title": "Learning and validation",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Agile delivery",
        "url": "https://www.gov.uk/service-manual/agile-delivery"
      }
    ]
  }
];
