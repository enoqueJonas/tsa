import type { LessonBlock } from "../activities/content";
// PED-005: original discovery Risk: failure statements, source-exact control demonstration, and residual acceptance.
// All sources, permissions, assertions and customers in this example are FICTIONAL.
export const riskControlPython = "from dataclasses import dataclass, replace\n\n# FICTIONAL warranty-return handoff. No real probability, policy or consent verified.\n@dataclass(frozen=True)\nclass Risk:\n    active_incident: bool\n    failure_path_explicit: bool\n    evidence_verified: bool\n    owner_named: bool\n    prohibited_exposure: bool\n    control_implemented: bool\n    control_tested: bool\n    residual_decision_signed: bool\n\ndef assess(r: Risk) -> str:\n    if r.active_incident:\n        return \"ESCALATE_EXISTING_INCIDENT\"\n    if not r.failure_path_explicit:\n        return \"FAILURE_PATH_UNDEFINED\"\n    if not r.evidence_verified:\n        return \"SOURCE_NOT_VERIFIED\"\n    if not r.owner_named:\n        return \"RISK_OWNER_MISSING\"\n    if r.prohibited_exposure:\n        return \"STOP_PROHIBITED_DATA_EXPOSURE\"\n    if not r.control_implemented:\n        return \"CONTROL_NOT_IMPLEMENTED\"\n    if not r.control_tested:\n        return \"CONTROL_EFFECT_UNVERIFIED\"\n    if not r.residual_decision_signed:\n        return \"RESIDUAL_RISK_NOT_ACCEPTED\"\n    return \"REVIEWABLE_NOT_PRODUCTION_APPROVED\"\n\nbase = Risk(False, True, True, True, False, True, True, True)\ncases = {\n    \"existing_damage\": (replace(base, active_incident=True), \"ESCALATE_EXISTING_INCIDENT\"),\n    \"vague_concern\": (replace(base, failure_path_explicit=False), \"FAILURE_PATH_UNDEFINED\"),\n    \"rumored_dependency\": (replace(base, evidence_verified=False), \"SOURCE_NOT_VERIFIED\"),\n    \"owner_unknown\": (replace(base, owner_named=False), \"RISK_OWNER_MISSING\"),\n    \"forbidden_export\": (replace(base, prohibited_exposure=True), \"STOP_PROHIBITED_DATA_EXPOSURE\"),\n    \"proposed_only\": (replace(base, control_implemented=False), \"CONTROL_NOT_IMPLEMENTED\"),\n    \"untested_control\": (replace(base, control_tested=False), \"CONTROL_EFFECT_UNVERIFIED\"),\n    \"residual_unsigned\": (replace(base, residual_decision_signed=False), \"RESIDUAL_RISK_NOT_ACCEPTED\"),\n    \"synthetic_review\": (base, \"REVIEWABLE_NOT_PRODUCTION_APPROVED\"),\n}\nfor name, (risk, expected) in cases.items():\n    outcome = assess(risk)\n    assert outcome == expected, f\"{name}: {outcome} != {expected}\"\n    print(f\"{name}: {outcome}\")\n\ndef close_once(seen: set[str], effects: list[str], event_id: str) -> bool:\n    # Synthetic at-least-once delivery: a retry must NOT duplicate closure.\n    if event_id in seen:\n        return False\n    seen.add(event_id)\n    effects.append(\"CLOSED:\" + event_id)\n    return True\n\nseen: set[str] = set()\neffects: list[str] = []\nassert [close_once(seen, effects, \"W-09\") for _ in range(3)] == [True, False, False]\nassert effects == [\"CLOSED:W-09\"]\nprint(\"RETRY deliveries=3 recorded_closures=1\")\nprint(\"NINE_UNSAFE_SOURCE_MUTANTS_MUST_FAIL_ASSERTIONS\")\nprint(\"SYNTHETIC_RISK_GATE_NOT_ACTUAL_ACCEPTANCE\")\nprint(\"RISK_FAILURE_CONTROL_RESIDUAL_PROOF_PASS\")\n";
export const riskFoundationsBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "Risk is not an impressive-looking red square in a spreadsheet. Risk management begins with a credible uncertain future event and an explained consequence for a concrete stakeholder outcome. A real issue or incident is different: damage is already occurring and requires active response. This lesson develops the original Capstone Problem Discovery Risk topic using a FICTIONAL warranty-return handoff. It does not claim actual events, percentages, signed risk acceptance or legal permissions."
  },
  {
    "type": "heading",
    "id": "risk-language",
    "level": 2,
    "text": "Separate a risk, an issue, a threat, a vulnerability and a hazard"
  },
  {
    "type": "paragraph",
    "text": "A risk links a condition or cause, an uncertain event and a consequence: 'If the supplier sends a duplicate completion event during retry, the handler may close a return twice or send contradictory customer messages, harming case integrity.' The supplier's at-least-once delivery is a possible cause; duplicate state transition is a failure event; a customer losing a valid pending claim is the harm. An issue is already known to exist, for example a confirmed duplicate closure in the live case log. Do not bury that as a future low-probability risk. Escalate a live issue through incident management."
  },
  {
    "type": "paragraph",
    "text": "A threat describes an actor, force or event that might cause harm; a vulnerability is an exploitable weakness, such as accepting a webhook without authorization or without an idempotency key. A hazard is a source of possible harm, especially relevant to physical or safety-critical systems. Some risks concern business value, adoption, privacy or unreliable evidence rather than malicious actors. A full risk statement should identify the affected objective and who bears the loss, including customers who may never log into the planned app."
  },
  {
    "type": "heading",
    "id": "risk-discovery",
    "level": 2,
    "text": "Derive a credible failure path from the CURRENT workflow"
  },
  {
    "type": "paragraph",
    "text": "Start with the observed or explicitly hypothetical workflow, actors, trust boundaries and dependencies from the prior Problem Framing lesson. Trace where a handoff can fail, where a new design adds a failure mode, and where operators cannot detect incorrect outcomes. Ask 'What must be true for this bad outcome to occur?', 'Who would first observe it?', 'What other cause fits this evidence?' and 'Which current control already interrupts the chain?' Avoid filling a catalogue with generic entries such as 'security risk: high' that do not identify an event or observable violation."
  },
  {
    "type": "paragraph",
    "text": "In the fictional warranty case, consider four distinct causal paths. A supplier endpoint becomes unreachable while a return awaits authorization. A retry publishes a completion event twice. An operator outside the case's permission boundary reads a document. An off-hours restore loads a case state but omits the correlated decision event. These are different risks with different controls and recovery evidence. They must not all collapse into 'technical risk' because they share a database or appear in one incident report."
  },
  {
    "type": "heading",
    "id": "risk-likelihood",
    "level": 2,
    "text": "Use probability responsibly, including UNKNOWN"
  },
  {
    "type": "paragraph",
    "text": "Likelihood asks how plausible the uncertain event is within a specified horizon and operating population. Consequence asks what happens if it occurs, to whom and for how long. A 1–5 ordinal likelihood label multiplied by a 1–5 impact label does not become a calibrated quantitative expected loss: the gap between labels is arbitrary and a 'medium × medium' rank can hide a catastrophic safety consequence. Use a qualitative rationale with sources, assumptions and counterevidence when trustworthy frequencies are absent. Treat a rare but prohibited disclosure as a hard stop if an applicable policy says so, not as a small numerical risk budget."
  },
  {
    "type": "paragraph",
    "text": "If real data later exist, state event definitions, eligible population, observation period, detection coverage, censoring and confidence before calculating a rate. Zero observed incidents in ten unmonitored deployments is NOT proof of zero risk. Two independent sources are not created by copying the same incident spreadsheet twice. The learner should record LIKELIHOOD_UNCALIBRATED, not a fabricated 2% probability; this is especially important where the consequences could include unauthorized data use."
  },
  {
    "type": "heading",
    "id": "risk-register",
    "level": 2,
    "text": "Write a risk entry that drives a decision"
  },
  {
    "type": "paragraph",
    "text": "Each material entry should have ID, condition and credible causal path, uncertain event, affected actor/asset and outcome, evidence type and permission, likelihood confidence and horizon, impact rationale, owner, preventive/detective/recovery controls, planned independent evidence, residual uncertainty, decision deadline, risk-acceptance authority, and a monitoring/revisit trigger. Separate existing incidents and assumptions from prospective risks. If there is no accountable owner, the work is not risk-managed merely because a developer has assigned a color or created a Jira ticket."
  },
  {
    "type": "paragraph",
    "text": "Keep the register small enough to shape experiments and scope: rank by irreversibility, severity, exposure and whether learning is feasible. One catastrophic but poorly understood permission failure should usually outrank twenty cosmetic concerns. A dependency with an unknown contract should trigger a safe verification action, not an invented commitment to a new vendor. The next focused reading teaches how preventive controls, detection and recovery evidence differ and why a control's presence alone proves almost nothing."
  },
  {
    "type": "resources",
    "title": "Risk identification references",
    "resources": [
      {
        "title": "NIST SP 800-30 Revision 1 — Guide for Conducting Risk Assessments",
        "url": "https://csrc.nist.gov/pubs/sp/800/30/r1/final"
      },
      {
        "title": "OWASP Threat Modeling",
        "url": "https://owasp.org/www-community/Threat_Modeling"
      }
    ]
  }
];
export const riskControlsBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "A good risk register becomes useful only when it changes what is tested, what is blocked and who can accept residual exposure. This reading illustrates controls with one at-least-once supplier-event failure. It separates prevention (make the duplicate ineffective), detection (find unexpected repeated updates) and recovery (repair a corrupted case and communicate truthfully). The accompanying runnable Python proves only a narrow invariant on synthetic inputs; it is NOT a deployed idempotency or incident-handling system."
  },
  {
    "type": "heading",
    "id": "risk-controls",
    "level": 2,
    "text": "Prevent, detect, recover and test independently"
  },
  {
    "type": "paragraph",
    "text": "Prevention reduces a credible failure path before harm: verify the supplier's identity and event correlation, authorize the intended transition, and make repeated delivery of the same event idempotent. Detection exposes a failure that prevention missed: count duplicate event IDs, alert on impossible state transitions, inspect authorized event evidence and compare the customer message to the authoritative outcome. Recovery restores the correct case, preserves an auditable correction and notifies affected people under actual policy. These are separate barriers; a single green 'we have logs' line cannot establish that any barrier works."
  },
  {
    "type": "paragraph",
    "text": "An event ID is useful only if it has the right identity and scope. If a supplier reuses IDs across customers or the storage of seen IDs is not durable, simplistic deduplication can discard valid events or fail during restart. For an authorized real system, a correct design might require a transactional store that commits the event effect and deduplication token atomically, replay tests under process crash and a permitted way to reconcile missing outcomes. The classroom Python set is in memory: it does not implement durable consistency, concurrency, authorization or a real audit trail."
  },
  {
    "type": "heading",
    "id": "risk-proof",
    "level": 2,
    "text": "Define the observable failure and the source-exact experiment"
  },
  {
    "type": "paragraph",
    "text": "A test for the duplicate-transition failure must observe the side effect, not simply return HTTP 200. GIVEN a synthetic return W-09 and the same supplier completion event delivered three times, WHEN the handler applies it, THEN exactly one closure effect is recorded and further deliveries report no additional state change. A wrong implementation that ignores the seen-event check will append three effects and fail the oracle. This is a crisp acceptance example but says nothing about customer-data privacy, crash consistency or which supplier events are lawful."
  },
  {
    "type": "paragraph",
    "text": "For a control that claims to prevent unauthorized disclosure, the negative oracle must inspect response fields, storage writes, caches and audit events at the relevant real boundary. For a restore control, verify recovered case evidence and not merely an open TCP port. For a dependency retry, verify that the operation remains bounded and customer messages are not sent repeatedly. Record both the normal positive case and a harmful negative case for each material control, ideally against the actual permitted environment before allowing production change."
  },
  {
    "type": "heading",
    "id": "risk-source-gate",
    "level": 2,
    "text": "A mitigation proposal does not equal verified risk reduction"
  },
  {
    "type": "paragraph",
    "text": "The teaching gate distinguishes a known active incident, an undefined failure path, a source not verified, missing accountability, an explicitly prohibited exposure, a proposed-but-not-implemented control, an untested control, unsigned residual risk and a provisional reviewable case. Each condition is an independent reason to avoid a false green. In particular, a policy or lawful-use prohibition cannot be offset by a persuasive cost benefit score; an engineering team cannot self-authorize protected data use by writing 'mitigated' on a risk register."
  },
  {
    "type": "paragraph",
    "text": "Because this is a synthetic case, flags named evidence_verified and residual_decision_signed are classroom assumptions, NOT actual evidence or signatures. Even the strongest classification is REVIEWABLE_NOT_PRODUCTION_APPROVED. An actual signoff would require verified sources, competent authority, a real test plan, legitimate risk tolerance and follow-up monitoring. Treat the fixture as teaching about refusal states, not as permission to operate an actual system."
  },
  {
    "type": "heading",
    "id": "risk-python",
    "level": 2,
    "text": "Execute the original learner-visible Python 3 risk proof"
  },
  {
    "type": "paragraph",
    "text": "Save the full program as risk_gate.py and run `python3 risk_gate.py` with the standard library only. It prints distinct outcomes for existing damage, vague concern, unverified supplier, missing owner, forbidden export, proposed-only control, untested mitigation, unsigned residual decision and one fictional reviewable case. It also delivers the same W-09 event three times and verifies just one closure side effect. The last marker is RISK_FAILURE_CONTROL_RESIDUAL_PROOF_PASS."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "Exact Python 3: prospectively classified risk, source/control/residual gates and a narrow duplicate-closure negative oracle",
    "code": "from dataclasses import dataclass, replace\n\n# FICTIONAL warranty-return handoff. No real probability, policy or consent verified.\n@dataclass(frozen=True)\nclass Risk:\n    active_incident: bool\n    failure_path_explicit: bool\n    evidence_verified: bool\n    owner_named: bool\n    prohibited_exposure: bool\n    control_implemented: bool\n    control_tested: bool\n    residual_decision_signed: bool\n\ndef assess(r: Risk) -> str:\n    if r.active_incident:\n        return \"ESCALATE_EXISTING_INCIDENT\"\n    if not r.failure_path_explicit:\n        return \"FAILURE_PATH_UNDEFINED\"\n    if not r.evidence_verified:\n        return \"SOURCE_NOT_VERIFIED\"\n    if not r.owner_named:\n        return \"RISK_OWNER_MISSING\"\n    if r.prohibited_exposure:\n        return \"STOP_PROHIBITED_DATA_EXPOSURE\"\n    if not r.control_implemented:\n        return \"CONTROL_NOT_IMPLEMENTED\"\n    if not r.control_tested:\n        return \"CONTROL_EFFECT_UNVERIFIED\"\n    if not r.residual_decision_signed:\n        return \"RESIDUAL_RISK_NOT_ACCEPTED\"\n    return \"REVIEWABLE_NOT_PRODUCTION_APPROVED\"\n\nbase = Risk(False, True, True, True, False, True, True, True)\ncases = {\n    \"existing_damage\": (replace(base, active_incident=True), \"ESCALATE_EXISTING_INCIDENT\"),\n    \"vague_concern\": (replace(base, failure_path_explicit=False), \"FAILURE_PATH_UNDEFINED\"),\n    \"rumored_dependency\": (replace(base, evidence_verified=False), \"SOURCE_NOT_VERIFIED\"),\n    \"owner_unknown\": (replace(base, owner_named=False), \"RISK_OWNER_MISSING\"),\n    \"forbidden_export\": (replace(base, prohibited_exposure=True), \"STOP_PROHIBITED_DATA_EXPOSURE\"),\n    \"proposed_only\": (replace(base, control_implemented=False), \"CONTROL_NOT_IMPLEMENTED\"),\n    \"untested_control\": (replace(base, control_tested=False), \"CONTROL_EFFECT_UNVERIFIED\"),\n    \"residual_unsigned\": (replace(base, residual_decision_signed=False), \"RESIDUAL_RISK_NOT_ACCEPTED\"),\n    \"synthetic_review\": (base, \"REVIEWABLE_NOT_PRODUCTION_APPROVED\"),\n}\nfor name, (risk, expected) in cases.items():\n    outcome = assess(risk)\n    assert outcome == expected, f\"{name}: {outcome} != {expected}\"\n    print(f\"{name}: {outcome}\")\n\ndef close_once(seen: set[str], effects: list[str], event_id: str) -> bool:\n    # Synthetic at-least-once delivery: a retry must NOT duplicate closure.\n    if event_id in seen:\n        return False\n    seen.add(event_id)\n    effects.append(\"CLOSED:\" + event_id)\n    return True\n\nseen: set[str] = set()\neffects: list[str] = []\nassert [close_once(seen, effects, \"W-09\") for _ in range(3)] == [True, False, False]\nassert effects == [\"CLOSED:W-09\"]\nprint(\"RETRY deliveries=3 recorded_closures=1\")\nprint(\"NINE_UNSAFE_SOURCE_MUTANTS_MUST_FAIL_ASSERTIONS\")\nprint(\"SYNTHETIC_RISK_GATE_NOT_ACTUAL_ACCEPTANCE\")\nprint(\"RISK_FAILURE_CONTROL_RESIDUAL_PROOF_PASS\")\n"
  },
  {
    "type": "paragraph",
    "text": "In separate disposable copies, skip each of the eight independent assessment guards or bypass the seen-event condition. Preserve the suite of expected assertions: all nine wrong variants must fail for an actual AssertionError. Explain which falsely safe decision the corrupted version would have induced: treating an incident as future risk, missing an authority gap, ignoring forbidden data export, accepting an untested control, accepting residual risk without the owner, or duplicating a customer state transition. These tests teach review discipline; they do not certify a real security program."
  },
  {
    "type": "resources",
    "title": "Control verification and response",
    "resources": [
      {
        "title": "OWASP Cheat Sheet — Logging",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
      },
      {
        "title": "Google SRE Book — Postmortem Culture",
        "url": "https://sre.google/sre-book/postmortem-culture/"
      }
    ]
  }
];
export const riskResidualBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "After a control is implemented, risk does not vanish. The remaining possibility of harm is residual risk; its evidence, affected people and decision authority must be explicit. This reading shows how to reason about tradeoffs without hiding serious failures inside a multiplication score, how to prevent a control from creating a new hazard, and how to act when the team cannot lawfully obtain the evidence it needs."
  },
  {
    "type": "heading",
    "id": "risk-residual",
    "level": 2,
    "text": "Residual risk is a decision record, not a 'low' color"
  },
  {
    "type": "paragraph",
    "text": "Suppose a case-closure service now ignores repeated supplier event IDs. That may reduce one failure path in ordinary single-process tests. The residual questions include restart behavior, concurrent processing, supplier reuse of identifiers, incorrect source decisions, privacy exposure and operator remediation. A complete control record states exactly what was proved, under which stimuli/environment, what is not proved, which downstream quality and data requirements depend on it, an owner, permitted observation method and an interval for revalidation. 'Mitigation implemented' is not equivalent to 'risk gone'."
  },
  {
    "type": "paragraph",
    "text": "A real risk owner can accept residual risk only within their actual authority and applicable constraints. A service sponsor may accept a bounded delivery delay but cannot waive a law, a customer's data rights or someone else's contractual approval. If the remaining harm exceeds permitted tolerance, record BLOCK/DEFER/NARROW_SCOPE and an escalated decision. A named person in an Excel cell without evidence of agreement is not risk acceptance. Changes in system context, traffic or contract terms can invalidate previous signoff."
  },
  {
    "type": "heading",
    "id": "risk-prioritize",
    "level": 2,
    "text": "Use consequence and controllability instead of arbitrary precision"
  },
  {
    "type": "paragraph",
    "text": "Prioritization asks: what could harm people most, what may be irreversible, what is currently exposed, how credible and independently supported is the failure path, what existing barriers exist, and how much can be learned safely? Ordinal heatmaps can help sort discussion, but do not compare 2×5 and 5×2 as though they represent an equivalent expected loss. Unknown probabilities may justify a targeted authorized test, stronger guardrails or a decision hold, not an automatic red/green dot."
  },
  {
    "type": "paragraph",
    "text": "The absence of incidents is particularly weak evidence when monitoring is missing: no alerts can mean either no failure or no detection. Define a trigger, for example a repeated supplier completion or a missing original outcome after restore, and the specific observation that would change classification. Real monitoring needs eligible denominators, incident retention policies, role-limited access and privacy-safe records. High-volume alerting can itself create operational risk if a small team cannot respond."
  },
  {
    "type": "heading",
    "id": "risk-coupling",
    "level": 2,
    "text": "Model shared causes and risky mitigations"
  },
  {
    "type": "paragraph",
    "text": "Two superficially independent risks may share the same failure: a lost supplier correlation token can cause duplicate approvals and misleading customer notifications. A simple score per row hides that common cause. Model dependencies between external events, case state, authorization, notifications and recovery; when one barrier fails, ask which other risk entries become exposed. Conversely, a mitigation that mirrors all customer records into a second cloud to improve availability may create a more serious data-export violation. Reassess the risk introduced by each proposed control."
  },
  {
    "type": "paragraph",
    "text": "For a limited team, a new Kafka cluster may solve throughput but create unmaintainable operational and restore exposure. A lighter reconciliation queue might instead be suitable, but a classroom risk assessment should not select architecture prematurely. The right next step may be a permitted delivery/retry test with synthetic payloads, a verified vendor protocol, or a staffed recovery drill. Keep the alternative and its falsifying observation visible in the decision log."
  },
  {
    "type": "heading",
    "id": "risk-acceptance",
    "level": 2,
    "text": "Define escalation, stop conditions and a reversible decision"
  },
  {
    "type": "paragraph",
    "text": "Create a decision entry with: risk ID, causal claim and evidence, controls and test IDs, residual harms and affected non-users, actual decision authority, prohibited actions, time horizon and monitoring triggers, rejected alternatives and change events requiring reapproval. Immediate active harm gets an incident/escalation path. Potential unauthorized personal-data disclosure gets a hard stop pending the correct source/authority. Missing test access means NOT_TESTED rather than 'low probability'. A deploy/no-deploy decision is separate from completing this educational exercise."
  },
  {
    "type": "paragraph",
    "text": "A useful stop rule might be: no production customer-case events are replayed until written permission and privacy boundary are confirmed; abort a synthetic spike if it changes any real record or exposes identifiers; block release if retry is proven to duplicate an authoritative closure event. Reversibility requires checking external notifications and irreversible user harm, not just reverting source code. The authorizing owner decides when the residual exposure is acceptable, not the green program output."
  },
  {
    "type": "heading",
    "id": "risk-transfer",
    "level": 2,
    "text": "Independent domain exercise and counterexample"
  },
  {
    "type": "paragraph",
    "text": "Choose an unrelated capstone workflow and create six risk entries: one already occurring issue (and escalation), one confidentiality/hard-authority boundary, one third-party dependency, one correctness or duplication failure, one operator/recovery problem and one adoption/value harm. Each needs a causal path, actual evidence status, affected actor, uncertainty, severity consequence, prevention/detection/recovery, independent test, residual open question and accountable owner. Make the next action reflect the most consequential unresolved risk; do not invent probabilities, regulations or stakeholder signatures."
  },
  {
    "type": "paragraph",
    "text": "Run the exact published Python and all nine negative mutations, then devise a different failure/side-effect oracle for the new domain. Inject two events: a control stops a common failure but introduces a forbidden data copy, and the supplier integration begins using nonunique IDs. Show new risk paths, impacted requirements/quality tests, whether the old residual acceptance is invalid, and a justified DEFER/REVIEW/BLOCK decision. Distinguish an actually resolved incident from an unverified future risk; independent learner review and field validation still remain outside this automation."
  },
  {
    "type": "resources",
    "title": "Governance and resilience references",
    "resources": [
      {
        "title": "NIST Risk Management Framework",
        "url": "https://csrc.nist.gov/projects/risk-management/about-rmf"
      },
      {
        "title": "Google SRE Book — Managing Critical State",
        "url": "https://sre.google/sre-book/managing-critical-state/"
      }
    ]
  }
];
