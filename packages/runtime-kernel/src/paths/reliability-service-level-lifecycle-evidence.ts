import type { LessonBlock } from "../activities/content";
// Source-level, topic-specific teaching for the existing Service Level Engineering lessons.
// These classroom values are not observed Steward production SLOs.
type EvidenceSection = {heading:string;paragraphs:string[];code?:{language:string;caption:string;code:string}};
export const serviceLevelLifecycleEvidenceById: Record<string,EvidenceSection[]> = {
  "slis": [
    {
      "heading": "Reconstruct lifecycle success from committed operations, not HTTP acknowledgments",
      "paragraphs": [
        "An HTTP 202 means that a server accepted a request for processing; it does not certify that a required asynchronous consumer completed a side effect. The authoritative denominator for this example is every eligible committed operation in the selected event-time cohort, identified by a stable operation ID. The numerator counts only operations whose matching required consumer effect finished within 60 seconds after commit. A valid 202 that was not committed belongs to a different request-acceptance measure; it must not be silently inserted into the committed-operation denominator.",
        "The runnable Python 3 lab creates a temporary local SQLite database. Four actual operation rows are committed, but five HTTP acknowledgments are hypothesized to illustrate why status counts alone mislead. A separate SQLite connection reads four committed operations, matches effects by ID, then checks their completion times. Operation a completes in 25 seconds; d in 35 seconds; b takes 75 seconds (late); c has no effect row. Hence lifecycle success is 2/4, or 50%. A LEFT JOIN, rather than an INNER JOIN, keeps missing consumer effects visible in the denominator. The as_of=120 check ensures the entire four-operation cohort has passed its deadline before failures are classified.",
        "Copy the entire script into a single file and execute with python3. The measured SQLite state, timestamps and join are real local operations, but timestamps, five HTTP acknowledgments, target and traffic are classroom fixtures—not data from a Steward API, RabbitMQ, PostgreSQL or monitoring stack. A real deployment must define transaction boundaries, outcome ownership, event timestamps, clock quality, authorized identity and a durable completion source independently."
      ],
      "code": {
        "language": "python",
        "caption": "Python 3: committed lifecycle cohort, deadline, budget and telemetry coverage with independently queried SQLite evidence",
        "code": "# Local synthetic Steward-like lifecycle; committed SQLite rows, not actual Steward.\nfrom decimal import Decimal\nfrom pathlib import Path\nfrom tempfile import TemporaryDirectory\nimport sqlite3\n\ntarget = Decimal(\"0.90\")\nas_of = 120\ndeadline_seconds = 60\nwith TemporaryDirectory(prefix=\"tsa-service-level-\") as scratch:\n    location = str(Path(scratch) / \"lifecycle.sqlite\")\n    with sqlite3.connect(location) as db:\n        db.executescript(\"\"\"\n            CREATE TABLE operations(id TEXT PRIMARY KEY, committed_at INTEGER NOT NULL);\n            CREATE TABLE effects(id TEXT PRIMARY KEY, completed_at INTEGER NOT NULL,\n                FOREIGN KEY(id) REFERENCES operations(id));\n            CREATE TABLE observed_events(id TEXT PRIMARY KEY);\n        \"\"\")\n        db.executemany(\"INSERT INTO operations VALUES (?, ?)\",\n                       [(\"a\", 10), (\"b\", 20), (\"c\", 30), (\"d\", 40)])\n        db.executemany(\"INSERT INTO effects VALUES (?, ?)\",\n                       [(\"a\", 35), (\"b\", 95), (\"d\", 75)])\n        db.executemany(\"INSERT INTO observed_events VALUES (?)\",\n                       [(\"a\",), (\"b\",), (\"d\",)])\n        db.commit()\n\n    # An independent connection reads committed operations and effects.\n    with sqlite3.connect(location) as auditor:\n        rows = auditor.execute(\"\"\"\n            SELECT o.id, o.committed_at, e.completed_at\n            FROM operations AS o\n            LEFT JOIN effects AS e ON e.id = o.id\n            ORDER BY o.committed_at\n        \"\"\").fetchall()\n        observed = {r[0] for r in auditor.execute(\"SELECT id FROM observed_events\")}\n    assert len(rows) == 4\n\n    def timely(row):\n        _, committed_at, completed_at = row\n        return completed_at is not None and completed_at <= committed_at + deadline_seconds\n\n    # Cohort has matured; no event is judged before its 60-second deadline.\n    assert all(as_of >= committed_at + deadline_seconds for _, committed_at, _ in rows)\n    good = sum(timely(r) for r in rows)\n    bad = len(rows) - good\n    sli = Decimal(good) / Decimal(len(rows))\n    allowed_bad = Decimal(len(rows)) * (1 - target)\n    consumed = Decimal(bad) / allowed_bad\n    acknowledged_http = 5  # synthetic: four actual commits plus one false 202\n    assert (acknowledged_http, good, bad, sli) == (5, 2, 2, Decimal(\"0.5\"))\n    print(f\"api_acks={acknowledged_http} committed={len(rows)} timely={good} bad={bad} lifecycle_sli={sli:.2%}\")\n    print(f\"allowed_bad={allowed_bad:.1f} budget_consumption={consumed:.2f}x\")\n\n    # An event/metric stream omits one committed operation; 3/3 is not 100%.\n    telemetry_complete = observed == {r[0] for r in rows}\n    assert not telemetry_complete\n    telemetry_status = \"COMPLETE\" if telemetry_complete else \"INCOMPLETE\"\n    print(f\"telemetry_coverage={len(observed)}/{len(rows)} telemetry_status={telemetry_status}\")\n\n    short = [r for r in rows if 20 <= r[1] < 50]\n    assert len(short) == 3 and sum(timely(r) for r in short) == 1\n    sample_status = \"TOO_SMALL_FOR_AUTOMATIC_PAGE\" if len(short) < 20 else \"REVIEW_BURN\"\n    print(f\"short_window={sum(timely(r) for r in short)}/{len(short)} sample={sample_status}\")\n    gate = \"MANUAL_REVIEW_OBSERVABILITY_GAP\" if not telemetry_complete else \"EVALUATE_SLO_POLICY\"\n    assert gate == \"MANUAL_REVIEW_OBSERVABILITY_GAP\"\n    print(f\"deployment_gate={gate}\")"
      }
    },
    {
      "heading": "Independent transfer: change the outcome oracle",
      "paragraphs": [
        "Re-run after changing b's completed_at from 95 to 75. Predict the new timely numerator and resulting percentage before running; explain why the absence of c's effect still matters. Then restore b and simulate a 202 that never commits: defend why it cannot count as a completed lifecycle event. If your proposed SLI counts HTTP 2xx rather than committed effects, name the different user promise it measures and its missing correctness guarantee."
      ]
    }
  ],
  "error-budgets": [
    {
      "heading": "Derive budget and burn from the same committed event population",
      "paragraphs": [
        "For an event-based 90% classroom SLO over four fully matured committed operations, the theoretical permitted failure budget is 4 × (1 − 0.90) = 0.4 event-equivalents. There is no partial failed operation; fractional budgets are mathematical accounting units. Two actual failed outcomes consume 2 / 0.4 = 5.00 times this tiny window's budget. This is not a production alert threshold, monthly performance estimate or evidence of any real Steward incident. All budget calculations must use the exact same eligible event population, success contract and time interval as the indicator.",
        "The first SLIs lesson publishes and executes the exact SQLite source that prints allowed_bad=0.4 and budget_consumption=5.00x. A common wrong calculation divides bad consumer outcomes by five HTTP acknowledgments or three observed telemetry events. Both denominators refer to different populations and conceal failures. Independently test one new dataset with 100 eligible committed operations, 96 timely completions and a hypothetical 99% target: derive allowed failures, actual failures and consumption, and explain why one observed window cannot establish the correct long-term target."
      ]
    },
    {
      "heading": "Failure: budget exhaustion cannot repair incomplete measurement",
      "paragraphs": [
        "The source shows only three of four committed operations present in the event/metric stream. Its 50% completion result can be reconstructed from authoritative local SQLite, but any production dashboard using only the incomplete event stream must report coverage gaps and uncertainty. Raising an SLO because missing samples made its result look bad is not remediation. State the exact discrepancy, investigate instrumentation/consumer identity and decide which release decisions require separate evidence before proceeding."
      ]
    }
  ],
  "windowing": [
    {
      "heading": "Cohort maturity, event-time windows, and missing measurements",
      "paragraphs": [
        "A request time window and an asynchronous-completion observation window differ. A committed operation at t=40 with a 60-second completion objective cannot safely be labeled late at t=45. The demonstration evaluates the four commits only at as_of=120, after every deadline. For a real rolling window, keep immature operations explicitly PENDING, evaluate only matured cohorts or document the lag policy, and report coverage separately. Otherwise the newest committed operations can appear to fail before their deadlines.",
        "The same source isolates the synthetic event-time subwindow [20,50), containing b, c and d. Exactly one of three finishes within 60 seconds; three samples do not justify an automatic page under this classroom's explicit minimum-volume rule of 20. No claim is made that 20 is a universal statistical threshold. Choose a paging policy based on service impact, volume, target, operational cost and multi-window evidence rather than copying this number.",
        "Only a, b and d were emitted to observed_events; c is absent. The printed telemetry_coverage=3/4 and deployment_gate=MANUAL_REVIEW_OBSERVABILITY_GAP model a fail-closed review path. In a live system, a complete authoritative ledger and the telemetry export can fail independently; do not turn no traffic, missing scrape samples or lost events into green health. Explain which evidence would distinguish missing traffic from failed collection."
      ]
    },
    {
      "heading": "Independent transfer: a still-pending consumer effect",
      "paragraphs": [
        "Change as_of to 75 while keeping d committed at 40 with a 60-second objective. The current maturity assertion must fail: the observed cohort is not yet fully evaluable. Propose a precise rule for keeping d pending rather than misclassifying it as bad, and identify what to do if a 60-second deadline passes without an authoritative effect record. Separately, remove one observed event and verify that a telemetry-only dashboard cannot legitimately report 100% completion."
      ]
    }
  ]
};
export function serviceLevelLifecycleBlocks(id:string):LessonBlock[] {
  return (serviceLevelLifecycleEvidenceById[id]??[]).flatMap(section => [
    {type:"heading" as const,id:"sli-lifecycle-"+section.heading.toLowerCase().replace(/[^a-z0-9]+/g,"-"),text:section.heading,level:2 as const},
    ...section.paragraphs.map(text=>({type:"paragraph" as const,text})),
    ...(section.code?[{type:"code" as const,language:section.code.language,code:section.code.code,caption:section.code.caption}]:[])
  ]);
}
