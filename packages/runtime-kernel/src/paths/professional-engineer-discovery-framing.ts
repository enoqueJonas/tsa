import type { LessonBlock } from "../activities/content";
// PED-005: Problem Framing, original ids remain stable. Synthetic evidence only.
export const problemFramingTimelinePython = "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Handoff:\n    key: str\n    opened: int\n    documents_ready: int | None\n    supplier_answered: int | None\n    closed: int | None\n    claimed_status: str\n\n# Fictional minutes since intake; NOT real stakeholder research.\nCASES = [\n    Handoff(\"W01\", 0, 10, 95, 110, \"RESOLVED\"),\n    Handoff(\"W02\", 0, 8, 80, 90, \"RESOLVED\"),\n    Handoff(\"W03\", 0, 40, 50, 60, \"RESOLVED\"),\n    Handoff(\"W04\", 0, 6, 7, 15, \"RESOLVED\"),\n    Handoff(\"W05\", 0, 7, 130, 140, \"RESOLVED\"),\n    Handoff(\"W06\", 0, 50, 70, 90, \"RESOLVED\"),\n    Handoff(\"W07\", 0, 12, None, None, \"OPEN\"),\n    Handoff(\"W08\", 0, None, None, None, \"OPEN\"),\n    Handoff(\"W09\", 0, 9, 20, None, \"RESOLVED\"),\n]\nBAD_ORDER = Handoff(\"X01\", 0, 40, 20, 60, \"RESOLVED\")\n\ndef inspect(case: Handoff):\n    times = [case.opened, case.documents_ready, case.supplier_answered, case.closed]\n    observed = [t for t in times if t is not None]\n    if observed != sorted(observed):\n        return (\"INVALID_CHRONOLOGY\", None)\n    if case.claimed_status != \"RESOLVED\" or any(t is None for t in times):\n        return (\"INCOMPLETE\", None)\n    document_wait = case.documents_ready - case.opened\n    supplier_wait = case.supplier_answered - case.documents_ready\n    total = case.closed - case.opened\n    return (\"COMPLETE\", (document_wait, supplier_wait, total))\n\noutcomes = {case.key: inspect(case) for case in CASES}\ncomplete = [metrics for status, metrics in outcomes.values() if status == \"COMPLETE\"]\nunverified = sum(status == \"INCOMPLETE\" for status, _ in outcomes.values())\nlong_supplier = sum(m[1] > 50 for m in complete)\nlong_document = sum(m[0] > 30 for m in complete)\nassert len(CASES) == 9\nassert len(complete) == 6\nassert unverified == 3\nassert long_supplier == 3\nassert long_document == 2\nassert outcomes[\"W03\"] == (\"COMPLETE\", (40, 10, 60))\nassert outcomes[\"W09\"][0] == \"INCOMPLETE\"\nassert inspect(BAD_ORDER)[0] == \"INVALID_CHRONOLOGY\"\nprint(f\"COHORT complete={len(complete)}/9 unverified={unverified}/9\")\nprint(f\"STAGES supplier_gt50={long_supplier}/6 document_gt30={long_document}/6\")\nprint(\"W03 document=40 supplier=10 total=60\")\nprint(\"W09 status_claim=RESOLVED evidence=INCOMPLETE\")\nprint(\"X01 INVALID_CHRONOLOGY\")\nprint(\"CAUSE_NOT_IDENTIFIED: descriptive times do not prove a root cause\")\nprint(\"PROBLEM_FRAMING_TIMELINE_PROOF_PASS\")\n";

export const problemFramingWorkflowBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "A problem frame is a bounded, falsifiable description of a harmful current situation, not a synonym for a feature request. This fictional warranty-return example follows one case from the counter through document verification, supplier response and closure. No real employee, customer or supplier was interviewed, and the case is NOT field evidence. The previous stakeholder lesson teaches how to recruit and challenge the people who own these handoffs."
  },
  {
    "type": "heading",
    "id": "frame-state-chain",
    "level": 2,
    "text": "Define the unit of work and its observable states"
  },
  {
    "type": "paragraph",
    "text": "Start by declaring the unit of analysis: one warranty-return case, not one customer, HTTP request or device. A normal path is RECEIVED → DOCUMENTS_READY → SUPPLIER_ANSWERED → CLOSED. The clerk accepts the item and proof; an operator checks missing information; a supplier responds to a complete request; an authorized worker records and communicates the result. Each arrow requires an observable event, timestamp, information artifact and responsible actor. A drawn arrow cannot prove that a state transition actually happened."
  },
  {
    "type": "paragraph",
    "text": "The exceptional paths matter at least as much as the happy path. The return can lack a receipt, need resubmission, enter a supplier backlog, be rejected or be withdrawn. Ask who can observe and authorize each transition, which states are reversible, and whether a customer can be harmed without using the future interface. A dashboard showing RESOLVED without evidence that the outcome was communicated is an assertion, not a verified end state."
  },
  {
    "type": "heading",
    "id": "frame-symptom-cause",
    "level": 2,
    "text": "Distinguish symptoms, mechanisms and hypotheses"
  },
  {
    "type": "paragraph",
    "text": "The symptom might be 'some returns remain open longer than expected'. A mechanism could be missing purchase information, internal approval, supplier queueing or poor visibility. A causal hypothesis is a claim about which mechanism actually generates the symptom in a defined population. A manager saying 'the application is slow' is testimony about a suspected cause; a clerk reporting rejected receipts is testimony about another. Neither statement is measured latency or a causal experiment."
  },
  {
    "type": "paragraph",
    "text": "Write explicit competing hypotheses. H1: most long cases accumulate wait after documents become ready. H2: document validation and rework dominate instead. H3: a partial or biased case extract produces the impression of a bottleneck. A negative observation for H1 would be many cases with quick supplier responses but long pre-supplier waits. A negative observation for H2 would be a representative authorized sample showing little document rework. A source that includes only successfully closed cases cannot by itself falsify H3."
  },
  {
    "type": "heading",
    "id": "frame-scope-evidence",
    "level": 2,
    "text": "Map evidence, permissions and unknown states"
  },
  {
    "type": "paragraph",
    "text": "For each arrow, build a table with event, actor, actual source, time-unit semantics, permission, evidence quality and missing-data treatment. Example: RECEIVED from an authorized intake entry; DOCUMENTS_READY from an approved verification event rather than the date a form was uploaded; SUPPLIER_ANSWERED from an actual receipt; CLOSED from a verified outcome. A quoted complaint belongs in a REPORT, while an independently read event is DOCUMENTED or OBSERVED. If access is unavailable, the baseline remains NOT_TESTED."
  },
  {
    "type": "paragraph",
    "text": "The original problem statement must include the affected actor, undesirable outcome, bounded observation window, currently supportable evidence, alternative explanations and the outcome to improve without choosing a technology. An example of a still-provisional question is: 'Across eligible returns received during an agreed four-week window, where does the time to evidenced closure accumulate, and how many cases remain unresolved at the observation cutoff?' Do not turn this into a promised 50% improvement or a decision to implement microservices."
  },
  {
    "type": "heading",
    "id": "frame-construct",
    "level": 2,
    "text": "A frame must survive a counterexample"
  },
  {
    "type": "paragraph",
    "text": "Imagine that supplier response times improve, but unresolved returns increase because the team starts marking incomplete cases closed. A frame that tracked only average completed duration would report progress while customers lose visibility. Record both verified closed outcomes and unfinished cases, then ask which stakeholder can dispute your definition. Trace one happy case, one rejected-document case and one unresolved case through the current-state diagram. The next focused reading will compute the denominator from a source-exact fictitious trace rather than assume that statuses and events agree."
  },
  {
    "type": "resources",
    "title": "Primary user-research guidance",
    "resources": [
      {
        "title": "GOV.UK Service Manual — User research",
        "url": "https://www.gov.uk/service-manual/user-research"
      }
    ]
  }
];

export const problemFramingMeasurementBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "A workflow drawing becomes testable when each state transition has a precise timestamp and the population is defined. This source-executable Python 3 exercise uses nine entirely fictional returns, not real interview or operations data. It demonstrates the difference between status text and actual closure evidence, stage time and total time, and a completed sample versus unresolved work."
  },
  {
    "type": "heading",
    "id": "frame-metrics",
    "level": 2,
    "text": "Count a lifecycle cohort before summarizing durations"
  },
  {
    "type": "paragraph",
    "text": "A complete trace contains intake, documents-ready, supplier-response and close events in chronological order. Its document preparation time is documents_ready minus opened, supplier wait is supplier_answered minus documents_ready, and total time is closed minus opened. These stage intervals have meaning only if the transitions refer to the same unit of work and have consistent time semantics. W03 spends 40 synthetic minutes on documentation and only 10 waiting on a supplier; subtracting from the original intake would falsely blame the supplier for 50 minutes."
  },
  {
    "type": "paragraph",
    "text": "The nine-case cohort includes six fully evidenced closed cases, two still open and one marked RESOLVED whose close event is missing. All three are incomplete for a verified-closure measure. Never silently drop them when describing end-to-end success. For a conditional comparison among the six complete cases, there are three supplier-stage waits exceeding 50 minutes and two document-stage waits exceeding 30. The two thresholds are classroom contrasts, not approved targets. Those ratios are 3/6 and 2/6, not a demonstrated population-wide failure rate."
  },
  {
    "type": "heading",
    "id": "frame-source-run",
    "level": 2,
    "text": "Run the full source and verify expected outputs"
  },
  {
    "type": "paragraph",
    "text": "The code uses a Python dataclass only to name the fields of each fictional record. The inspect function checks chronological order and requires both a RESOLVED claim and every lifecycle timestamp before computing durations. It deliberately returns INCOMPLETE for W09 despite its status label, and INVALID_CHRONOLOGY for X01 where supplier response precedes document verification. Copy the entire block to framing_timeline.py and execute python3 framing_timeline.py from a disposable directory. No packages, credentials or network access are required."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "Exact Python 3 original learner source: fictional time-stamped handoffs with a missing close and invalid chronology",
    "code": "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Handoff:\n    key: str\n    opened: int\n    documents_ready: int | None\n    supplier_answered: int | None\n    closed: int | None\n    claimed_status: str\n\n# Fictional minutes since intake; NOT real stakeholder research.\nCASES = [\n    Handoff(\"W01\", 0, 10, 95, 110, \"RESOLVED\"),\n    Handoff(\"W02\", 0, 8, 80, 90, \"RESOLVED\"),\n    Handoff(\"W03\", 0, 40, 50, 60, \"RESOLVED\"),\n    Handoff(\"W04\", 0, 6, 7, 15, \"RESOLVED\"),\n    Handoff(\"W05\", 0, 7, 130, 140, \"RESOLVED\"),\n    Handoff(\"W06\", 0, 50, 70, 90, \"RESOLVED\"),\n    Handoff(\"W07\", 0, 12, None, None, \"OPEN\"),\n    Handoff(\"W08\", 0, None, None, None, \"OPEN\"),\n    Handoff(\"W09\", 0, 9, 20, None, \"RESOLVED\"),\n]\nBAD_ORDER = Handoff(\"X01\", 0, 40, 20, 60, \"RESOLVED\")\n\ndef inspect(case: Handoff):\n    times = [case.opened, case.documents_ready, case.supplier_answered, case.closed]\n    observed = [t for t in times if t is not None]\n    if observed != sorted(observed):\n        return (\"INVALID_CHRONOLOGY\", None)\n    if case.claimed_status != \"RESOLVED\" or any(t is None for t in times):\n        return (\"INCOMPLETE\", None)\n    document_wait = case.documents_ready - case.opened\n    supplier_wait = case.supplier_answered - case.documents_ready\n    total = case.closed - case.opened\n    return (\"COMPLETE\", (document_wait, supplier_wait, total))\n\noutcomes = {case.key: inspect(case) for case in CASES}\ncomplete = [metrics for status, metrics in outcomes.values() if status == \"COMPLETE\"]\nunverified = sum(status == \"INCOMPLETE\" for status, _ in outcomes.values())\nlong_supplier = sum(m[1] > 50 for m in complete)\nlong_document = sum(m[0] > 30 for m in complete)\nassert len(CASES) == 9\nassert len(complete) == 6\nassert unverified == 3\nassert long_supplier == 3\nassert long_document == 2\nassert outcomes[\"W03\"] == (\"COMPLETE\", (40, 10, 60))\nassert outcomes[\"W09\"][0] == \"INCOMPLETE\"\nassert inspect(BAD_ORDER)[0] == \"INVALID_CHRONOLOGY\"\nprint(f\"COHORT complete={len(complete)}/9 unverified={unverified}/9\")\nprint(f\"STAGES supplier_gt50={long_supplier}/6 document_gt30={long_document}/6\")\nprint(\"W03 document=40 supplier=10 total=60\")\nprint(\"W09 status_claim=RESOLVED evidence=INCOMPLETE\")\nprint(\"X01 INVALID_CHRONOLOGY\")\nprint(\"CAUSE_NOT_IDENTIFIED: descriptive times do not prove a root cause\")\nprint(\"PROBLEM_FRAMING_TIMELINE_PROOF_PASS\")\n"
  },
  {
    "type": "paragraph",
    "text": "Expected output: COHORT complete=6/9 unverified=3/9; STAGES supplier_gt50=3/6 document_gt30=2/6; W03 document=40 supplier=10 total=60; W09 status_claim=RESOLVED evidence=INCOMPLETE; X01 INVALID_CHRONOLOGY; CAUSE_NOT_IDENTIFIED; and PROBLEM_FRAMING_TIMELINE_PROOF_PASS. The nine values are intentionally fabricated classroom evidence. A program printing them does not establish any operational issue, actual customer impact or statistically representative inference."
  },
  {
    "type": "heading",
    "id": "frame-mutants",
    "level": 2,
    "text": "Break the measurement without changing the expected answer"
  },
  {
    "type": "paragraph",
    "text": "Make four separate disposable copies of the code and leave every assertion unchanged. First calculate supplier wait from opened rather than documents_ready: W06 will be misattributed to the supplier and the count assertion must fail. Second replace the INCOMPLETE return with COMPLETE and zero durations: the 6/9 assertion must fail because missing outcomes have become fabricated successes. Third disable the invalid-chronology check: X01 must fail its assertion. Fourth measure long document waits using total elapsed time instead of the document interval: the document-stage count must fail."
  },
  {
    "type": "paragraph",
    "text": "When explaining the negative results, name the incorrect inference, not only that Python raised an AssertionError. This sample cannot distinguish congestion, missing documentation, staffing or supplier behavior as causes. For a real capstone, specify permission to collect a cohort, time-window/censoring rules, missing-source controls and an alternative explanation before claiming any baseline. If access is unavailable, record NOT_TESTED; do not reuse fictional W01–W09 as field measurements."
  },
  {
    "type": "resources",
    "title": "Performance evidence reference",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Measuring success",
        "url": "https://www.gov.uk/service-manual/measuring-success/measuring-success"
      }
    ]
  }
];

export const problemFramingBoundaryBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "This third reading teaches what to conclude after the time trace. The observation that a stage lasted 85 minutes tells you where elapsed time accumulated, not why it happened or whether implementing software would shorten it. A persuasive problem frame has alternative causes, a scope boundary, explicit uncertainty and a falsification plan."
  },
  {
    "type": "heading",
    "id": "frame-causal",
    "level": 2,
    "text": "Use competing causes, not a vote among stakeholders"
  },
  {
    "type": "paragraph",
    "text": "H1 claims suppliers are capacity-constrained; H2 claims the desk repeatedly receives incomplete documentation. The synthetic six-complete-case calculation contains evidence consistent with both, including W03 and W06 where the documentation phase was long. Case complexity, staffing, customer response, supplier hours and missing-event instrumentation could all influence the durations. If all long cases were routed to one supplier because their documentation is complicated, comparing that supplier with others without controlling for case type would confound the interpretation."
  },
  {
    "type": "paragraph",
    "text": "A causal diagram is a proposed explanation, not a measurement. A known arithmetic relationship between stage duration and total elapsed time does not prove a specific actor caused the delay. State what would falsify each hypothesis: for H1, matched authorized cases with fast supplier answers despite long total delay; for H2, a suitable sample showing few document returns. Request only minimum authorized data. If a clean comparison or direct observation is unavailable, classify the cause UNTESTED instead of raising confidence based on repetitions of the same managerial report."
  },
  {
    "type": "heading",
    "id": "frame-statement",
    "level": 2,
    "text": "Translate symptoms into a bounded, solution-neutral statement"
  },
  {
    "type": "paragraph",
    "text": "A defensible provisional statement identifies (1) affected actor/workflow, (2) undesirable outcome, (3) time/population boundary, (4) actual versus missing evidence, (5) competing explanations and (6) the improved outcome to measure. Example: 'For eligible returns at one authorized warranty desk during a four-week period, some cases appear to remain unresolved after documents are ready, but stage durations, incomplete records and causal factors have not yet been established. We will measure verified end-to-end outcomes and unfinished cases before deciding whether a software change is necessary.' This is a question and plan, not a claimed field finding."
  },
  {
    "type": "paragraph",
    "text": "Reject 'Build an AI dashboard that reduces warranty approvals by 50%' as a problem frame: it chooses a stack, invents a target without a baseline, fails to name correct/authorized closure and assumes a dashboard would alter the supplier. Nontechnical outcomes are possible: repair the intake checklist, change a policy, train an operator, renegotiate a supplier handoff or deliberately do nothing. The course values a supported no-build decision over a polished solution to the wrong problem."
  },
  {
    "type": "heading",
    "id": "frame-boundary",
    "level": 2,
    "text": "Identify who can actually change the system"
  },
  {
    "type": "paragraph",
    "text": "The desk may control intake validation and status visibility, but may not control supplier staffing, manufacturer warranty law or another organization’s data. Draw an in-scope/out-of-scope boundary naming each human authority, input, output, external dependency and prohibited data access. A status API being technically callable does not create permission to read unrelated customer records. An out-of-scope dependency can still be a risk to the outcome and a reason to defer investment."
  },
  {
    "type": "paragraph",
    "text": "Choose measures resistant to cosmetic status changes: share of eligible cases with verified closure and communicated outcome, separately paired with the number unresolved and missing critical events. Explain why decreasing average elapsed time for completed cases while increasing unresolved cases is not success. Require the authorized decision owner and affected non-user perspective before freezing the boundary, and name what new evidence would cause reopening."
  },
  {
    "type": "heading",
    "id": "frame-transfer",
    "level": 2,
    "text": "Independent transfer and handoff to Requirements"
  },
  {
    "type": "paragraph",
    "text": "For a NEW domain, draw at least five present-state transitions with alternate and terminal states, then give two competing causal explanations for the same observed harm. Specify the eligible denominator, extraction provenance, consent/authority, missing-data treatment, discriminating test and one disconfirming finding for each hypothesis. Write a provisional six-field problem statement and explicit non-goals. If you have not collected permitted evidence, label real claims NOT_TESTED and use fiction only as a clearly marked practice example."
  },
  {
    "type": "paragraph",
    "text": "Change the conditions: suppose wait time falls but complaints rise because the system closes cases without notifying customers. Which success metric, scope decision and problem boundary need revision? Answer before proposing architecture. The original practice must deliver this counterexample and a real evidence/reversal register. Only after the framing uncertainty is appropriately bounded should the next Requirements lesson convert user outcomes into verifiable acceptance conditions."
  },
  {
    "type": "resources",
    "title": "Service discovery reference",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Discovery phase",
        "url": "https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works"
      }
    ]
  }
];
