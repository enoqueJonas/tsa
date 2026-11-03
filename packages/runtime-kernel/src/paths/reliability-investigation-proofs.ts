import type { LessonBlock } from "../activities/content";

// Synthetic, exact source-derived local proofs; no production SLI or incident claim.
export const latencyTailPython = "from math import ceil\nfrom statistics import mean, median\n\nlatencies_ms = [10, 12, 12, 13, 14, 15, 18, 22, 25, 500]\nordered = sorted(latencies_ms)\np95_nearest_rank = ordered[ceil(0.95 * len(ordered)) - 1]\nassert round(mean(ordered), 1) == 64.1\nassert median(ordered) == 14.5\nassert p95_nearest_rank == 500\nprint(\"mean_ms=64.1 median_ms=14.5 nearest_rank_p95_ms=500\")";
export const incidentTimelinePython = "from datetime import datetime\n\nraw = [\n    {\"event_id\":\"e3\",\"at\":\"2026-11-03T10:00:03Z\",\"event\":\"http_502\",\"kind\":\"observed\"},\n    {\"event_id\":\"e1\",\"at\":\"2026-11-03T10:00:00Z\",\"event\":\"accepted\",\"kind\":\"observed\"},\n    {\"event_id\":\"e2\",\"at\":\"2026-11-03T10:00:02Z\",\"event\":\"db_timeout\",\"kind\":\"observed\"},\n    {\"event_id\":\"e2\",\"at\":\"2026-11-03T10:00:02Z\",\"event\":\"db_timeout\",\"kind\":\"observed\"},\n    {\"event_id\":\"h1\",\"at\":\"2026-11-03T10:00:04Z\",\"event\":\"db_overload\",\"kind\":\"hypothesis\"},\n]\nunique = {}\nfor record in raw:\n    unique.setdefault(record[\"event_id\"], record)\nobserved = [r for r in unique.values() if r[\"kind\"] == \"observed\"]\nobserved.sort(key=lambda r: datetime.fromisoformat(r[\"at\"].replace(\"Z\", \"+00:00\")))\nordered_events = [r[\"event\"] for r in observed]\nassert ordered_events == [\"accepted\", \"db_timeout\", \"http_502\"]\nassert len(unique) == 4 and len(observed) == 3\nassert \"db_overload\" not in ordered_events\nprint(\"timeline_order=accepted,db_timeout,http_502 duplicate_removed=true hypothesis_excluded=true\")";

export const performanceProofById: Record<string, LessonBlock[]> = {
 "latency-throughput": [
  {type:"heading",id:"latency-percentile-mechanics",text:"Averages can hide user-facing tail latency",level:2},
  {type:"paragraph",text:"Latency is elapsed time between a defined start and completion event. Throughput is completed operations per unit time, not merely attempts initiated. A service can increase throughput while making its slowest users wait longer because queues saturate or contention grows. A percentile needs a defined population/window and method; p95 is not the same as 95% of the average."},
  {type:"heading",id:"latency-negative-tail",text:"Compute a real synthetic tail counterexample",level:2},
  {type:"paragraph",text:"Run the local Python fixture with ten synthetic latencies. The median is 14.5 ms, mean 64.1 ms and nearest-rank p95 is 500 ms due to one slow operation. With only ten observations, the estimated high percentile is especially unstable; this model is not a production Prometheus histogram calculation or trustworthy SLA evidence."},
  {type:"code",language:"python",caption:"Exact local mean, median and nearest-rank p95 with one 500-ms outlier",code:latencyTailPython},
  {type:"heading",id:"latency-transfer",text:"Failure and transfer: a faster mean hides a deteriorating tail",level:2},
  {type:"paragraph",text:"Before choosing a remediation, compare the same request class across a controlled load step: attempted and completed throughput, error fraction, p50/p95/p99 and saturation. Separate client timeout/queuing from API work and database calls. If the histogram lacks sufficient observations or has inconsistent bucket boundaries, report unknown rather than a confident p95."}
 ],
 "performance-baselines": [
  {type:"heading",id:"baseline-controlled-load",text:"A baseline must state the workload and error budget",level:2},
  {type:"paragraph",text:"State exact request mix, concurrency, duration, warmup, data volume, cache state, machine limits and measurement population. Compare one change at a time and record error rate alongside latency; dropping timed-out requests from the distribution makes a broken system appear faster. Record confidence limits and repeatability, not only one pretty chart."}
 ]
};

export const incidentProofById: Record<string, LessonBlock[]> = {
 "timeline": [
  {type:"heading",id:"incident-timeline-evidence-source",text:"Build a timeline from observations rather than arrival order",level:2},
  {type:"paragraph",text:"A log's ingestion timestamp can differ from when the service emitted it. Centralized search may show late arrivals and duplicates, so reconstruct using normalized event timestamps, source, clock-offset uncertainty and stable identifiers. Separate a factual observation from a hypothesis about cause. A database timeout may explain the immediate API symptom without establishing WHY the database was slow."},
  {type:"heading",id:"incident-ordering-negative",text:"Run a shuffled, duplicated evidence fixture",level:2},
  {type:"paragraph",text:"This executable Python example sorts out-of-order synthetic events by UTC, deduplicates one repeated record and excludes an unproven overload hypothesis from the factual timeline. The fixture demonstrates record handling only; it does not reconstruct a real incident or prove time synchronization across hosts."},
  {type:"code",language:"python",caption:"Deduplicate events, order by event time and keep hypotheses separate",code:incidentTimelinePython},
  {type:"heading",id:"incident-uncertainty-transfer",text:"Failure and transfer: incomplete evidence is a finding",level:2},
  {type:"paragraph",text:"A missing or delayed Graylog event must remain a documented evidence gap until emission, shipping, parsing, indexing and query permissions are checked. The incident timeline should still record user impact, detection, mitigation, recovery and changes with source references. A neat chronological table is not proof of root cause."}
 ],
 "root-cause": [
  {type:"heading",id:"root-cause-counterevidence",text:"The first visible failure is often not the root cause",level:2},
  {type:"paragraph",text:"Observe that the API returned 502 and a database call timed out. Those facts do not establish database overload: connection pool exhaustion, deadlock, DNS, network path or dependency maintenance could produce the same symptom. Write candidate hypotheses, seek discriminating evidence such as active connections/locks, duration and trace spans, then downgrade unsupported claims rather than retrofitting a tidy narrative."}
 ]
};
