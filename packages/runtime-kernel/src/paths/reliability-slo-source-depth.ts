import type { LessonBlock } from "../activities/content";

const sloExperiment = `from decimal import Decimal
events = [
  {"valid": True, "success": True},
  {"valid": True, "success": True},
  {"valid": True, "success": False},
  {"valid": False, "success": False},
]
valid = [e for e in events if e["valid"]]
good = sum(e["success"] for e in valid)
assert (len(valid), good) == (3, 2)
ratio = Decimal(good) / Decimal(len(valid))
target = Decimal("0.90")
allowed_bad = Decimal(len(valid)) * (1 - target)
actual_bad = len(valid) - good
print(f"valid={len(valid)} good={good} sli={ratio:.4f}")
print(f"allowed_bad={allowed_bad:.2f} actual_bad={actual_bad}")
assert actual_bad > allowed_bad
empty = []
print("empty_window=UNKNOWN" if not empty else "invalid")`;

export const sloDeepSections: Record<string, LessonBlock[]> = {
  slis: [
    { type: "heading", id: "sli-event-population", text: "Define the event population before calculating a ratio", level: 2 },
    { type: "paragraph", text: "A request success SLI requires an explicitly named boundary, valid-attempt denominator, successful-attempt numerator, measurement window and missing-data policy. Rejected attempts may or may not be valid depending on user intent and contract: document that decision instead of silently deleting them. Excluding failures because they make the ratio worse is measurement manipulation." },
    { type: "heading", id: "sli-counterexample", text: "Execute a small positive and negative SLI model", level: 2 },
    { type: "paragraph", text: "This synthetic Python example has three valid requests, two successes, one failure and one deliberately excluded event. It demonstrates a failed target and an empty measurement window. It does not create Prometheus metrics or establish an enterprise SLO." },
    { type: "code", language: "python", caption: "Exact SLI denominator and missing-data experiment", code: sloExperiment },
    { type: "paragraph", text: "Transfer: explain why a 100%-healthy VM could coexist with a poor API SLI. Investigate instrumentation gaps and asynchronous completion separately instead of treating HTTP 202 as evidence of background success." }
  ],
  "error-budgets": [
    { type: "heading", id: "error-budget-units", text: "Derive an error budget from the same population", level: 2 },
    { type: "paragraph", text: "For a ratio-based SLO, the permitted bad events over a window equal valid attempts times (1 - target). With 1000 valid attempts and 99.9% target, the budget is one bad event. With a synthetic three-attempt population and 90% target, the permitted 0.3 event is a theoretical budget fraction, not a physically fractional request. Comparisons must use consistent windows and exclude no data after viewing the results." },
    { type: "heading", id: "burn-budget-failure", text: "Failure and transfer: small denominators and missing data", level: 2 },
    { type: "paragraph", text: "A rolling window with no traffic has an undefined availability ratio, not 100% success. One bad attempt during very low traffic can consume a small-window budget while long-window impact remains small. Combine short and long windows and explicit missing-data handling rather than shipping a single noisy page rule. This is a decision model, not a validated burn-rate alert." }
  ],
  windowing: [
    { type: "heading", id: "window-selection-and-coverage", text: "Measurement windows change the question", level: 2 },
    { type: "paragraph", text: "A calendar-month SLO resets at a boundary; a rolling 30-day SLO always contains the most recent 30 days. A one-hour investigation is not itself the monthly objective. Specify timestamp clock, time zone, request sampling, late events and partial ingestion. Losing the metric scraper must be reported as an observability gap, not silently counted as successful user requests." },
    { type: "heading", id: "window-transfer", text: "Failure: a silent five-minute scraper outage", level: 2 },
    { type: "paragraph", text: "Compare a direct application request probe with the Prometheus scrape history. The absence of series is not evidence that no customer failure occurred. Record coverage and confidence separately from the computed SLI. Any release gate based on unknown observations must fail closed or demand manual review." }
  ],
};
