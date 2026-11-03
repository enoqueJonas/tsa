import type { LessonBlock } from "../activities/content";

// These examples are embedded in the original Metrics/Prometheus concept lessons.
const counterExperiment = `samples = [100, 105, 109, 2, 5]
naive_delta = samples[-1] - samples[0]
observed_increase = 0
for prev, now in zip(samples, samples[1:]):
    observed_increase += now - prev if now >= prev else now
assert naive_delta == -95
assert observed_increase == 14
print("naive_delta=-95 reset_aware_increase=14")
# This is a local model; PromQL rate() handles resets and time differently.`;

export const metricsDeepSections: Record<string, LessonBlock[]> = {
  "metric-types": [
    { type: "heading", id: "counter-reset-example", text: "Why counters need reset-aware queries", level: 2 },
    { type: "paragraph", text: "A process-level request counter increases while the process is alive, but it can restart at zero. Subtracting the first sample from the last can yield a negative total even though requests happened. The reset-aware calculation below demonstrates why Prometheus rate/increase semantics require timestamped samples; it does not implement PromQL rate itself." },
    { type: "code", language: "python", caption: "Executable counter reset counterexample", code: counterExperiment },
    { type: "paragraph", text: "A gauge is different: current queue depth may legitimately fall. A latency histogram has cumulative le buckets, count and sum; a bucket count alone is not a percentile. High-cardinality request identifiers belong in logs or traces, not Prometheus labels." }
  ],
  promql: [
    { type: "heading", id: "promql-rate-and-ratio", text: "Construct queries from matching populations", level: 2 },
    { type: "paragraph", text: "Assume http_requests_total increments on completed valid attempts with bounded method, route and status_class labels. The numerator and denominator of an error ratio must use the same job, time window, route population and request-completion event. A zero denominator means there was no matching traffic and should not be displayed as a confident zero failure rate." },
    { type: "code", language: "promql", caption: "Request rate per route over five minutes", code: "sum by (route) (rate(http_requests_total{job=\"steward-api\"}[5m]))" },
    { type: "code", language: "promql", caption: "5xx share per route; empty/no-traffic series must remain unknown", code: "sum by (route) (rate(http_requests_total{job=\"steward-api\",status_class=\"5xx\"}[5m])) / sum by (route) (rate(http_requests_total{job=\"steward-api\"}[5m]))" },
    { type: "heading", id: "histogram-buckets-correctness", text: "Recover a latency distribution without averaging away the tail", level: 2 },
    { type: "paragraph", text: "For a classic cumulative request-duration histogram with seconds as units, histogram_quantile needs rate of _bucket series grouped by le plus intended dimensions. A single summary average cannot recover p95. Validate bucket monotonicity and known synthetic request delays before adopting a latency SLO or dashboard." },
    { type: "code", language: "promql", caption: "p95 from classic cumulative duration buckets, seconds", code: "histogram_quantile(0.95, sum by (le, route) (rate(http_request_duration_seconds_bucket{job=\"steward-api\"}[5m])))" },
    { type: "paragraph", text: "Failure and transfer: if the request counter resets after a pod rollout, a naive delta is wrong. If labels differ, the numerator/denominator vector matching may yield absent data. If a scrape fails, the missing series is not proof of customer success. Use a controlled request fixture and cross-check logs before trusting the graph." }
  ]
};
