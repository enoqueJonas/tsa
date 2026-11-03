import type { LessonBlock } from "../activities/content";
// Distinct worked evidence in original Service-Level and Metrics readings.
type WorkedSection = { heading:string; paragraphs:string[]; code?:{language:string;code:string;caption?:string} };
export const sliDepthById: Record<string,WorkedSection[]> = {
  "slis": [
    {
      "heading": "Define a real numerator before choosing an SLI target",
      "paragraphs": [
        "The SLI must define the precise eligible event population, successful subset, window, exclusions and missing-data policy. For Steward, registration HTTP attempts are not the same population as committed lifecycle effects. Counting HTTP 200 responses as completed asynchronous work is an invalid indicator: one committed event may remain undelivered. A green /health probe is not even an attempted user action. Before picking a 99.9% target, explicitly label which events are valid, why the synthetic probe is excluded, and how an empty denominator is reported."
      ],
      "code": {
        "language": "python",
        "code": "# Small synthetic data. Not a production SLI or measured Steward incident.\nevents = [\n    {\"operation\":\"registration\",\"valid\":True,\"good\":True},\n    {\"operation\":\"registration\",\"valid\":True,\"good\":True},\n    {\"operation\":\"registration\",\"valid\":True,\"good\":False},\n    {\"operation\":\"registration\",\"valid\":True,\"good\":True},\n    {\"operation\":\"registration\",\"valid\":True,\"good\":False},\n    {\"operation\":\"registration\",\"valid\":False,\"good\":False},  # approved synthetic probe excluded by explicit rule\n]\nvalid = [e for e in events if e[\"valid\"]]\nassert len(valid) == 5\ngood = sum(bool(e[\"good\"]) for e in valid)\nbad = len(valid) - good\nprint(f\"valid={len(valid)} good={good} bad={bad} SLI={good / len(valid):.2%}\")\nassert (good, bad) == (3, 2)\n# An empty denominator must be MISSING, not 100% healthy.\nempty_valid = []\nprint(\"no traffic:\", \"MISSING\" if not empty_valid else \"OBSERVED\")\n# Asynchronous completion must use its own event population.\ncommitted = [\"event-1\",\"event-2\",\"event-3\"]\ncompleted_within_60s = [\"event-1\",\"event-3\"]\nprint(f\"lifecycle completion SLI={len(completed_within_60s)/len(committed):.2%}\")",
        "caption": "Exact local event-population numerator/denominator and missing-data model"
      }
    },
    {
      "heading": "Failure and transfer: challenge the excluded events",
      "paragraphs": [
        "The local events have five valid attempts and three successes, so SLI=60.00%. If an engineer reclassifies both failures as excluded after they occur, the apparent SLI improves without the service improving. Exclusions must be defined before observing outcomes, with a stable source of truth and monitoring of excluded volume. Independently define a lifecycle completion SLI whose population is all committed mutations needing consumer completion, and whose numerator counts only effects confirmed within a declared time bound. Missing observer telemetry must be reported separately, not silently counted as success."
      ]
    }
  ],
  "error-budgets": [
    {
      "heading": "Calculate permitted misses from the same event population",
      "paragraphs": [
        "For a request-based 99% success objective across 1,000 eligible operations, at most ten can fail (1,000×0.01). Twelve failures consume 120% of the permitted budget; the window is already beyond target even if infrastructure uptime is green. With smaller populations, percentages can be noisy: one failure in ten requests makes the observed success rate 90%, but that does not estimate future behavior precisely. Establish when to page, pause rollouts or investigate missing data before applying burn thresholds."
      ],
      "code": {
        "language": "python",
        "code": "# 99% target for exactly 1000 valid operations in a synthetic window.\ntarget=0.99\nvalid_operations=1000\nactual_bad=12\nallowed_bad=valid_operations * (1-target)\nconsumed=actual_bad/allowed_bad\nprint(f\"allowed_bad={allowed_bad:.0f} actual_bad={actual_bad} burn={consumed:.2f}x\")\nassert round(allowed_bad)==10\nassert consumed>1\n# Low traffic or missing ingestion is not automatically a green SLO result.",
        "caption": "Source-executable synthetic request-budget breach"
      }
    },
    {
      "heading": "Failure and transfer: budget exhaustion changes release risk",
      "paragraphs": [
        "A fast-burning error budget under a new candidate may warrant halting its rollout even if there are enough available workers. A retrospective monthly budget is not a substitute for short-window detection of a current outage. Keep the measurement window and valid population identical between the SLI and budget; never divide a count of database errors by a count of only successful HTTP responses. Design a release gate with a deliberate low-volume path rather than treating zero observed errors as sufficient evidence."
      ]
    }
  ],
  "windowing": [
    {
      "heading": "A monthly average can hide a damaging local outage",
      "paragraphs": [
        "A monthly success ratio is useful for long-term objective performance, but a ten-minute outage might be severe during a small high-impact batch. Compute the same SLI on both the full measurement window and a short diagnostic window using identical eligible-event definitions. A rolling 30-day window and a calendar month have different edges; record them rather than silently swapping. When no eligible events exist in a short window, the SLI is missing/inconclusive, not automatically 100%."
      ]
    },
    {
      "heading": "Independent transfer: separate alert urgency from SLO target",
      "paragraphs": [
        "A hypothetical month has 100,000 successful requests and 100 failures, while the last five minutes contain only 10 requests with 8 failures. Monthly success is roughly 99.90%, but the current incident is catastrophic for active users. Explain why a short-window alert with request volume and a longer confirmation window can be more actionable than a monthly green chart. Prove the same excluded-event policy applies to both windows."
      ]
    }
  ],
  "burn-rate-alerting": [
    {
      "heading": "Burn is observed error fraction divided by allowed error fraction",
      "paragraphs": [
        "For a 99.9% target, the allowed error fraction is 0.001. An observed error fraction of 0.02 burns at 20× budget rate over the measured interval. Multi-window, multi-burn paging typically requires both fast/short and confirming/long windows to signal ongoing budget threat. A low-volume interval can produce extreme percentages from one error, and missing metric series must be diagnosed as an observation failure. Never page solely on a graph that omits denominators."
      ]
    },
    {
      "heading": "Failure and transfer: alert on impact, not only metric expression",
      "paragraphs": [
        "Describe the concrete rule owner, on-call route, runbook, low-traffic policy and explicit response when the underlying scrape target disappears. Derive a 20× burn value from 2% observed failures and 0.1% allowed failures. Then explain why an entirely missing success metric should not be classified as zero errors."
      ]
    }
  ]
};
export const metricDepthById: Record<string,WorkedSection[]> = {
  "promql": [
    {
      "heading": "Start with counter semantics, then read PromQL as operations",
      "paragraphs": [
        "A counter is cumulative and normally resets after process restart; `rate()` estimates its per-second increase over a lookback range, accounting for resets. `sum(rate(steward_api_requests_total[5m]))` aggregates all labeled series after computing each series rate; summing raw counter values across restarts is not a valid request rate. A matching error ratio must use the same denominator population, labels and time range. If the error numerator includes all 4xx/5xx but the denominator excludes excluded operations, the ratio is not the defined SLI. The expressions below assume the application actually exports those metric names/labels; they are a teaching query shape, NOT an observed Prometheus target."
      ],
      "code": {
        "language": "python",
        "code": "# PromQL illustrates metrics published by an application; this script does\n# not start Prometheus, scrape a target or evaluate queries in the server.\nqueries = {\n \"request_rate\": 'sum(rate(steward_api_requests_total[5m]))',\n \"error_ratio\": 'sum(rate(steward_api_requests_total{outcome=\"error\"}[5m])) / sum(rate(steward_api_requests_total[5m]))',\n \"latency_p95\": 'histogram_quantile(0.95, sum by (le) (rate(steward_api_request_duration_seconds_bucket[5m])))',\n}\nfor name, query in queries.items():\n    print(name + \": \" + query)\nassert \"by (le)\" in queries[\"latency_p95\"]\nassert \"request_id\" not in repr(queries)\nprint(\"server-side evaluation: UNVERIFIED\")",
        "caption": "Print and inspect three sample PromQL queries without server calls"
      }
    },
    {
      "heading": "Failure and transfer: empty query does not mean healthy",
      "paragraphs": [
        "If a scrape is absent, PromQL can return an empty vector; if the denominator is zero, a division can yield nonfinite/missing results. An empty Grafana panel is not proof of zero errors. Independently inspect `up`, expected discovered target set and current scrape health, then produce the real query and output. For a histogram, retain the `le` boundary when aggregating buckets for `histogram_quantile`, and label that the result is a bucket-based estimate rather than an individual request's measured p95."
      ]
    }
  ],
  "metric-types": [
    {
      "heading": "Cumulative histogram buckets are not independent counts",
      "paragraphs": [
        "Classic Prometheus histogram bucket counts include all observations ≤ each `le` bound, so the 0.3-second bucket already includes every observation in the 0.1-second bucket. Subtract adjacent bucket counts to recover disjoint counts. Bucket-based p95 is interpolated; it is not the exact 95th percentile of a complete raw request log, especially with coarse bucket boundaries. A summary's local quantiles generally cannot be correctly aggregated across instances; classic histograms can aggregate by compatible buckets."
      ],
      "code": {
        "language": "python",
        "code": "# Cumulative buckets: <=0.1s: 1, <=0.3s: 3, <=1s: 4, +Inf: 5.\n# Differencing adjacent cumulative values yields counts per bucket.\nbuckets=[1,3,4,5]\nincrements=[buckets[0]]+[b-a for a,b in zip(buckets,buckets[1:])]\nassert increments==[1,2,1,1]\nprint(\"per-bucket counts:\", increments)\n# histogram_quantile interpolates within buckets; it is an approximation,\n# not exact measured latency of an individual request.",
        "caption": "Local cumulative-to-disjoint bucket proof"
      }
    },
    {
      "heading": "Failure and transfer: median hides the tail",
      "paragraphs": [
        "Given five observations across cumulative buckets, explain what information is preserved and lost. A dashboard with mean latency 150 ms could still hide a few very slow requests. To diagnose the exact slow request, follow logs or traces using a request/trace ID; never add unbounded request IDs as metric labels. Choose meaningful bucket boundaries based on the target latency SLI, not the Grafana default."
      ]
    }
  ],
  "dashboard-antipatterns": [
    {
      "heading": "Rendered green can be a data-absence illusion",
      "paragraphs": [
        "A dashboard that defaults missing series to zero can show green when Prometheus cannot scrape a target. Distinguish zero measured errors from no measurements. Add independent expected-target checks and missing-data alerts. Panel colors should not override the semantics of the source SLI; test with a deliberately stopped exporter and record how the panel changes."
      ]
    },
    {
      "heading": "Transfer: stop a wrong decision based on screenshots",
      "paragraphs": [
        "An on-call sees a flat request-error graph and declares the outage resolved, but the user-facing synthetic transaction still fails and the `up` target is missing. State the evidence needed to disprove the claim, restore telemetry and independently verify a working user request. Preserve the PromQL query, label filters, time range and metric source with the screenshot."
      ]
    }
  ]
};
function addSections(items:WorkedSection[]):LessonBlock[] {
  return items.flatMap(item=>[
    {type:"heading" as const,id:item.heading.toLowerCase().replace(/[^a-z0-9]+/g,"-"),text:item.heading,level:2 as const},
    ...item.paragraphs.map(text=>({type:"paragraph" as const,text})),
    ...(item.code?[{type:"code" as const,language:item.code.language,code:item.code.code,caption:item.code.caption}]:[])
  ]);
}
export function extraSliBlocks(id:string):LessonBlock[] {return addSections(sliDepthById[id]??[]);}
export function extraMetricsBlocks(id:string):LessonBlock[] {return addSections(metricDepthById[id]??[]);}
