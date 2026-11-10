import type { LessonBlock } from "../activities/content";
// These are source-exact official Prometheus fixtures, not an independently simulated evaluator.
export const burnRateRulesYaml = "# Synthetic interactive registration HTTP SLI, not asynchronous completion.\n# Hypothetical 30-day 99.9% SLO => 0.001 allowed bad fraction.\n# Fast 2%-budget-in-1h threshold: 14.4 * 0.001 = 0.0144.\n# No paging authority or live Steward metrics: severity=ticket.\ngroups:\n  - name: steward-registration-burn\n    interval: 1m\n    rules:\n      - record: steward:slo_registration_requests:rate1h\n        expr: sum by (job) (rate(http_requests_total{job=\"steward-api\",route=\"/register\"}[1h]))\n      - record: steward:slo_registration_errors:rate1h\n        expr: sum by (job) (rate(http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}[1h]))\n      - record: steward:slo_registration_error_ratio:rate1h\n        expr: steward:slo_registration_errors:rate1h / steward:slo_registration_requests:rate1h\n      - record: steward:slo_registration_requests:rate5m\n        expr: sum by (job) (rate(http_requests_total{job=\"steward-api\",route=\"/register\"}[5m]))\n      - record: steward:slo_registration_errors:rate5m\n        expr: sum by (job) (rate(http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}[5m]))\n      - record: steward:slo_registration_error_ratio:rate5m\n        expr: steward:slo_registration_errors:rate5m / steward:slo_registration_requests:rate5m\n      - alert: StewardRegistrationFastBudgetBurn\n        expr: (steward:slo_registration_error_ratio:rate1h > 0.0144) and on(job) (steward:slo_registration_error_ratio:rate5m > 0.0144) and on(job) (steward:slo_registration_requests:rate5m > 0.1)\n        for: 2m\n        labels:\n          severity: ticket\n          team: reliability\n          evidence: synthetic\n        annotations:\n          summary: \"Synthetic request SLO burn exceeds 1h and 5m thresholds\"\n";
export const burnRateTestYaml = "# Official promtool semantics, not a hand-written PromQL evaluator.\n# Each scenario supplies initialized classic counters sampled every 1m.\nrule_files:\n  - steward-burn.rules.yml\nevaluation_interval: 1m\ntests:\n  - name: sustained_two_percent_failure_fires_after_both_windows\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0+98x70'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0+2x70'\n    promql_expr_test:\n      - expr: 'steward:slo_registration_error_ratio:rate1h{job=\"steward-api\"}'\n        eval_time: 70m\n        exp_samples:\n          - labels: 'steward:slo_registration_error_ratio:rate1h{job=\"steward-api\"}'\n            value: 0.02\n      - expr: 'steward:slo_registration_error_ratio:rate5m{job=\"steward-api\"}'\n        eval_time: 70m\n        exp_samples:\n          - labels: 'steward:slo_registration_error_ratio:rate5m{job=\"steward-api\"}'\n            value: 0.02\n    alert_rule_test:\n      - eval_time: 70m\n        alertname: StewardRegistrationFastBudgetBurn\n        exp_alerts:\n          - exp_labels:\n              job: steward-api\n              severity: ticket\n              team: reliability\n              evidence: synthetic\n            exp_annotations:\n              summary: Synthetic request SLO burn exceeds 1h and 5m thresholds\n\n  - name: healthy_half_percent_does_not_exceed_fourteen_point_four_burn\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0+199x70'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0+1x70'\n    alert_rule_test:\n      - eval_time: 70m\n        alertname: StewardRegistrationFastBudgetBurn\n        exp_alerts: []\n\n  - name: stale_long_window_after_healthy_recovery_does_not_fire\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0+100x70'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0+3x60 180+0x9'\n    alert_rule_test:\n      - eval_time: 70m\n        alertname: StewardRegistrationFastBudgetBurn\n        exp_alerts: []\n\n  - name: new_short_spike_without_long_budget_impact_does_not_fire\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0+100x70'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0+0x63 0+2x6'\n    alert_rule_test:\n      - eval_time: 70m\n        alertname: StewardRegistrationFastBudgetBurn\n        exp_alerts: []\n\n  - name: tiny_population_cannot_authorize_incident_page\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0+0x70'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0+1x70'\n    alert_rule_test:\n      - eval_time: 70m\n        alertname: StewardRegistrationFastBudgetBurn\n        exp_alerts: []\n\n  - name: initialized_zero_traffic_is_unknown_not_green\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0x71'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0x71'\n    alert_rule_test:\n      - eval_time: 70m\n        alertname: StewardRegistrationFastBudgetBurn\n        exp_alerts: []\n\n  - name: absent_metrics_are_unknown_not_a_pass\n    interval: 1m\n    alert_rule_test:\n      - eval_time: 70m\n        alertname: StewardRegistrationFastBudgetBurn\n        exp_alerts: []\n";
export const sloBurnRateEngineBlocks: LessonBlock[] = [
  {
    "type": "heading",
    "id": "slo-burn-derive",
    "level": 2,
    "text": "Derive burn rate from a stated SLO, not a copied threshold"
  },
  {
    "type": "paragraph",
    "text": "Start with a hypothetical 99.9% success SLO over a rolling 30-day period for eligible /register HTTP requests. The permitted bad-event fraction is 1−0.999=0.001 (0.1%). A burn rate is observed bad-event fraction divided by allowed bad-event fraction. For 2% errors, burn=0.02/0.001=20x. A 14.4x threshold therefore means error fraction >14.4×0.001=0.0144, or >1.44%. The Google SRE Workbook's illustrative 2%-of-budget-in-1-hour threshold derives 0.02×(30 days×24 hours)/1 hour=14.4. That is a starting example, not automatically the correct page policy for Steward."
  },
  {
    "type": "paragraph",
    "text": "Important event-based caveat: 2% of a 30-day request-error budget spent in a given hour presumes traffic is approximately evenly distributed across the SLO period. With variable traffic, the true proportion consumed uses actual eligible and bad request counts over the objective window. The temporal 14.4x value is a rate-based alert heuristic, NOT a guarantee that precisely 2% of the real request-count budget was consumed in an hour. Record this distinction before selecting a threshold."
  },
  {
    "type": "heading",
    "id": "slo-burn-two-clocks",
    "level": 2,
    "text": "Pair long-term significance with evidence of current failure"
  },
  {
    "type": "paragraph",
    "text": "A one-hour average by itself can remain above threshold long after a service recovers, delaying alert resolution. A five-minute average by itself can overreact to a brief, low-impact spike. Require BOTH the 1h and 5m ratios to exceed the same 1.44% threshold with PromQL and on(job), and enforce an explicitly chosen >0.1 requests/second five-minute minimum before making a ticket. An additional for:2m delay suppresses one-off evaluation noise. The low-volume guard is a deliberate lab policy, not a universal SRE convention; very low-volume critical user actions may require event-based or synthetic checks instead."
  },
  {
    "type": "paragraph",
    "text": "The lab ratio is calculated from initialized classic Prometheus http_requests_total{job=\"steward-api\",route=\"/register\",status_class} counters. The denominator includes BOTH successes and 5xx failures, rather than dividing failures by successes. The fixed route and matching job label prevent cross-traffic contamination. This is an HTTP request-failure proxy, not the asynchronous committed-to-consumer-completion SLI defined earlier in Steward's lifecycle exercises. Never claim the two populations are interchangeable."
  },
  {
    "type": "heading",
    "id": "slo-burn-executable",
    "level": 2,
    "text": "Copy the exact Prometheus rule file evaluated by official promtool"
  },
  {
    "type": "code",
    "language": "yaml",
    "caption": "Exact source: labs/reliability-slo-burn/steward-burn.rules.yml",
    "code": "# Synthetic interactive registration HTTP SLI, not asynchronous completion.\n# Hypothetical 30-day 99.9% SLO => 0.001 allowed bad fraction.\n# Fast 2%-budget-in-1h threshold: 14.4 * 0.001 = 0.0144.\n# No paging authority or live Steward metrics: severity=ticket.\ngroups:\n  - name: steward-registration-burn\n    interval: 1m\n    rules:\n      - record: steward:slo_registration_requests:rate1h\n        expr: sum by (job) (rate(http_requests_total{job=\"steward-api\",route=\"/register\"}[1h]))\n      - record: steward:slo_registration_errors:rate1h\n        expr: sum by (job) (rate(http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}[1h]))\n      - record: steward:slo_registration_error_ratio:rate1h\n        expr: steward:slo_registration_errors:rate1h / steward:slo_registration_requests:rate1h\n      - record: steward:slo_registration_requests:rate5m\n        expr: sum by (job) (rate(http_requests_total{job=\"steward-api\",route=\"/register\"}[5m]))\n      - record: steward:slo_registration_errors:rate5m\n        expr: sum by (job) (rate(http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}[5m]))\n      - record: steward:slo_registration_error_ratio:rate5m\n        expr: steward:slo_registration_errors:rate5m / steward:slo_registration_requests:rate5m\n      - alert: StewardRegistrationFastBudgetBurn\n        expr: (steward:slo_registration_error_ratio:rate1h > 0.0144) and on(job) (steward:slo_registration_error_ratio:rate5m > 0.0144) and on(job) (steward:slo_registration_requests:rate5m > 0.1)\n        for: 2m\n        labels:\n          severity: ticket\n          team: reliability\n          evidence: synthetic\n        annotations:\n          summary: \"Synthetic request SLO burn exceeds 1h and 5m thresholds\"\n"
  },
  {
    "type": "heading",
    "id": "slo-burn-test-fixtures",
    "level": 2,
    "text": "Falsify this policy with synthetic counter histories"
  },
  {
    "type": "paragraph",
    "text": "The official Prometheus promtool fixture tests seven distinct cases at a 1m scrape interval. A sustained 2% error fraction must produce 0.02 in BOTH recorded ratios and a ticket alert. A steady 0.5% fraction must not. After errors cease, an old one-hour average can remain high, but the five-minute ratio falls to zero and the alert must be absent. A fresh short-lived spike can raise the five-minute ratio while the full-hour average remains below threshold. One error a minute with almost no traffic must fail the explicit rate gate. Initialized all-zero counters and wholly absent counters must not be transformed into '100% healthy' by an invented zero-filling expression."
  },
  {
    "type": "code",
    "language": "yaml",
    "caption": "Exact source: labs/reliability-slo-burn/steward-burn.test.yml (real promtool unit tests)",
    "code": "# Official promtool semantics, not a hand-written PromQL evaluator.\n# Each scenario supplies initialized classic counters sampled every 1m.\nrule_files:\n  - steward-burn.rules.yml\nevaluation_interval: 1m\ntests:\n  - name: sustained_two_percent_failure_fires_after_both_windows\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0+98x70'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0+2x70'\n    promql_expr_test:\n      - expr: 'steward:slo_registration_error_ratio:rate1h{job=\"steward-api\"}'\n        eval_time: 70m\n        exp_samples:\n          - labels: 'steward:slo_registration_error_ratio:rate1h{job=\"steward-api\"}'\n            value: 0.02\n      - expr: 'steward:slo_registration_error_ratio:rate5m{job=\"steward-api\"}'\n        eval_time: 70m\n        exp_samples:\n          - labels: 'steward:slo_registration_error_ratio:rate5m{job=\"steward-api\"}'\n            value: 0.02\n    alert_rule_test:\n      - eval_time: 70m\n        alertname: StewardRegistrationFastBudgetBurn\n        exp_alerts:\n          - exp_labels:\n              job: steward-api\n              severity: ticket\n              team: reliability\n              evidence: synthetic\n            exp_annotations:\n              summary: Synthetic request SLO burn exceeds 1h and 5m thresholds\n\n  - name: healthy_half_percent_does_not_exceed_fourteen_point_four_burn\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0+199x70'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0+1x70'\n    alert_rule_test:\n      - eval_time: 70m\n        alertname: StewardRegistrationFastBudgetBurn\n        exp_alerts: []\n\n  - name: stale_long_window_after_healthy_recovery_does_not_fire\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0+100x70'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0+3x60 180+0x9'\n    alert_rule_test:\n      - eval_time: 70m\n        alertname: StewardRegistrationFastBudgetBurn\n        exp_alerts: []\n\n  - name: new_short_spike_without_long_budget_impact_does_not_fire\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0+100x70'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0+0x63 0+2x6'\n    alert_rule_test:\n      - eval_time: 70m\n        alertname: StewardRegistrationFastBudgetBurn\n        exp_alerts: []\n\n  - name: tiny_population_cannot_authorize_incident_page\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0+0x70'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0+1x70'\n    alert_rule_test:\n      - eval_time: 70m\n        alertname: StewardRegistrationFastBudgetBurn\n        exp_alerts: []\n\n  - name: initialized_zero_traffic_is_unknown_not_green\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0x71'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0x71'\n    alert_rule_test:\n      - eval_time: 70m\n        alertname: StewardRegistrationFastBudgetBurn\n        exp_alerts: []\n\n  - name: absent_metrics_are_unknown_not_a_pass\n    interval: 1m\n    alert_rule_test:\n      - eval_time: 70m\n        alertname: StewardRegistrationFastBudgetBurn\n        exp_alerts: []\n"
  },
  {
    "type": "heading",
    "id": "slo-burn-engine",
    "level": 2,
    "text": "Execute the official evaluator and make incorrect rules fail"
  },
  {
    "type": "code",
    "language": "bash",
    "caption": "From repository root on Linux with Docker; these are the exact read-only sources CI tests",
    "code": "docker run --rm --network none -v \"$PWD/labs/reliability-slo-burn:/rules:ro\" -w /rules --entrypoint /bin/promtool prom/prometheus:v3.13.3 check rules steward-burn.rules.yml\ndocker run --rm --network none -v \"$PWD/labs/reliability-slo-burn:/rules:ro\" -w /rules --entrypoint /bin/promtool prom/prometheus:v3.13.3 test rules steward-burn.test.yml"
  },
  {
    "type": "paragraph",
    "text": "To demonstrate test sensitivity, change AND to OR between long and short conditions in a disposable copy; the recovery and brief-spike cases should fail. Change 5xx to both 2xx and 5xx; the healthy case should fail. Remove the traffic gate; the low-volume case should fail. Keep expectations unchanged. Passing a syntax check alone is not evidence of correct alert state. Source byte identity between these displayed YAML blocks and the official files is enforced independently by CI."
  },
  {
    "type": "heading",
    "id": "slo-burn-operator",
    "level": 2,
    "text": "Do not convert a worked example into an unapproved page"
  },
  {
    "type": "paragraph",
    "text": "This lab labels the result severity=ticket, evidence=synthetic. It has no live SLO ownership approval, no measured current traffic baseline and no demonstration of on-call response. When counters are absent, an impact rule may have no vector; missing telemetry needs separate up/absent_over_time coverage like the earlier Prometheus lesson, not or vector(0). For actual operations, review minimum traffic, false-negative low-volume risk, release-stop rules and Alertmanager deduplication together. A correct promtool rule still does not prove a human was notified."
  },
  {
    "type": "resources",
    "title": "Primary SRE and Prometheus references",
    "resources": [
      {
        "title": "Google SRE Workbook — Alerting on SLOs",
        "url": "https://sre.google/workbook/alerting-on-slos/"
      },
      {
        "title": "Prometheus official unit testing for alert rules",
        "url": "https://prometheus.io/docs/prometheus/latest/configuration/unit_testing_rules/"
      },
      {
        "title": "Prometheus recording rules",
        "url": "https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/"
      }
    ]
  }
];
