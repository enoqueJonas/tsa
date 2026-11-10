import type { LessonBlock } from "../activities/content";
// The exact displayed YAML must match the repo fixtures executed by promtool.
export const recordedStewardRulesYaml = "# Synthetic Steward registration metric contract. Lab-only; not deployed.\n# Prometheus classic counters, initialized for each bounded status class.\ngroups:\n  - name: steward-registration\n    interval: 1m\n    rules:\n      - record: steward:registration_requests:rate5m\n        expr: sum by (route) (rate(http_requests_total{job=\"steward-api\",route=\"/register\"}[5m]))\n      - record: steward:registration_errors:rate5m\n        expr: sum by (route) (rate(http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}[5m]))\n      - record: steward:registration_error_ratio:rate5m\n        expr: steward:registration_errors:rate5m / steward:registration_requests:rate5m\n      - alert: StewardRegistrationElevatedErrors\n        expr: (steward:registration_error_ratio:rate5m > 0.20) and on(route) (steward:registration_requests:rate5m > 0.10)\n        for: 2m\n        labels:\n          severity: ticket\n          team: reliability\n        annotations:\n          summary: \"Elevated registration failures\"\n      - alert: StewardMetricsScrapeFailed\n        expr: up{job=\"steward-api\"} == 0\n        for: 2m\n        labels:\n          severity: ticket\n          team: reliability\n        annotations:\n          summary: \"Prometheus cannot scrape a configured Steward target\"\n      - alert: StewardMetricsTargetMissing\n        expr: absent_over_time(up{job=\"steward-api\"}[5m])\n        for: 2m\n        labels:\n          severity: ticket\n          team: reliability\n        annotations:\n          summary: \"Expected Steward scrape series disappeared\"\n";
export const testedStewardRulesYaml = "# The official Prometheus promtool evaluates the real rule expressions here.\n# All data is synthetic. Do not confuse this with real Steward observations.\nrule_files:\n  - steward.rules.yml\nevaluation_interval: 1m\ntests:\n  - name: healthy_then_sustained_user_errors\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0+10x15'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0+0x5 0+10x9'\n      - series: 'up{job=\"steward-api\",instance=\"api:9464\"}'\n        values: '1x15'\n    promql_expr_test:\n      - expr: 'steward:registration_error_ratio:rate5m{route=\"/register\"}'\n        eval_time: 15m\n        exp_samples:\n          - labels: 'steward:registration_error_ratio:rate5m{route=\"/register\"}'\n            value: 0.5\n    alert_rule_test:\n      - eval_time: 5m\n        alertname: StewardRegistrationElevatedErrors\n        exp_alerts: []\n      - eval_time: 15m\n        alertname: StewardRegistrationElevatedErrors\n        exp_alerts:\n          - exp_labels:\n              route: /register\n              severity: ticket\n              team: reliability\n            exp_annotations:\n              summary: Elevated registration failures\n      - eval_time: 15m\n        alertname: StewardMetricsScrapeFailed\n        exp_alerts: []\n      - eval_time: 15m\n        alertname: StewardMetricsTargetMissing\n        exp_alerts: []\n\n  - name: initialized_zero_counters_no_traffic\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0x15'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0x15'\n      - series: 'up{job=\"steward-api\",instance=\"api:9464\"}'\n        values: '1x15'\n    alert_rule_test:\n      - eval_time: 10m\n        alertname: StewardRegistrationElevatedErrors\n        exp_alerts: []\n      - eval_time: 10m\n        alertname: StewardMetricsTargetMissing\n        exp_alerts: []\n\n  - name: configured_target_scrape_fails\n    interval: 1m\n    input_series:\n      - series: 'up{job=\"steward-api\",instance=\"api:9464\"}'\n        values: '1x1 0x8'\n    alert_rule_test:\n      - eval_time: 5m\n        alertname: StewardMetricsScrapeFailed\n        exp_alerts:\n          - exp_labels:\n              instance: api:9464\n              job: steward-api\n              severity: ticket\n              team: reliability\n            exp_annotations:\n              summary: Prometheus cannot scrape a configured Steward target\n      - eval_time: 5m\n        alertname: StewardMetricsTargetMissing\n        exp_alerts: []\n      - eval_time: 5m\n        alertname: StewardRegistrationElevatedErrors\n        exp_alerts: []\n\n  - name: brief_scrape_failure_does_not_fire\n    interval: 1m\n    input_series:\n      - series: 'up{job=\"steward-api\",instance=\"api:9464\"}'\n        values: '1 0 1 1 1 1'\n    alert_rule_test:\n      - eval_time: 5m\n        alertname: StewardMetricsScrapeFailed\n        exp_alerts: []\n\n  - name: entirely_absent_expected_target\n    interval: 1m\n    alert_rule_test:\n      - eval_time: 10m\n        alertname: StewardMetricsTargetMissing\n        exp_alerts:\n          - exp_labels:\n              job: steward-api\n              severity: ticket\n              team: reliability\n            exp_annotations:\n              summary: Expected Steward scrape series disappeared\n      - eval_time: 10m\n        alertname: StewardMetricsScrapeFailed\n        exp_alerts: []\n      - eval_time: 10m\n        alertname: StewardRegistrationElevatedErrors\n        exp_alerts: []\n";
export const recordingRulesEngineBlocks: LessonBlock[] = [
  {
    "type": "heading",
    "id": "record-rule-why",
    "level": 2,
    "text": "A recording rule is a stored time series, not proof of user health"
  },
  {
    "type": "paragraph",
    "text": "Prometheus evaluates recording rules on a schedule, stores new timestamped series with the expression's result, and reuses these series for queries and alerts. Rule groups control evaluation interval and sequence. A source counter, a rate recording rule, a fraction and an alert have different meanings. A valid rule cannot repair a missing scrape, incorrect source counters, label mismatch or incomplete business outcome."
  },
  {
    "type": "heading",
    "id": "record-rule-matched-population",
    "level": 2,
    "text": "Derive a matching numerator and denominator from counter rates"
  },
  {
    "type": "paragraph",
    "text": "Prerequisites: original PromQL, prior focused localhost /metrics exposition exercise, and official promtool installed or an approved isolated Prometheus Docker image. The application initializes both 2xx and 5xx counters with bounded route=/register and status_class labels. First record a request-per-second rate from per-instance rate() then sum by route. Second do the same for completed 5xx requests. Third divide the route-matched recorded error rate by the route-matched total request rate. Do not sum raw counters across resets, put request IDs in metric labels or substitute HTTP-accepted events for final lifecycle completion. A denominator of zero or missing numerator data does not prove 0% user errors."
  },
  {
    "type": "paragraph",
    "text": "The synthetic elevated-error condition uses a 20% five-minute error fraction and a minimum 0.10 requests/second traffic threshold, joined on route. These are classroom thresholds, NOT justified production SLOs or paging thresholds. for: 2m requires consecutive active evaluations before the alert becomes firing. severity=ticket is deliberately not page because this synthetic fixture has not established production user impact, responder ownership or a validated error budget."
  },
  {
    "type": "code",
    "language": "yaml",
    "caption": "Exact committed steward.rules.yml: three recordings plus user-impact, scrape-failure and missing-target alerts",
    "code": "# Synthetic Steward registration metric contract. Lab-only; not deployed.\n# Prometheus classic counters, initialized for each bounded status class.\ngroups:\n  - name: steward-registration\n    interval: 1m\n    rules:\n      - record: steward:registration_requests:rate5m\n        expr: sum by (route) (rate(http_requests_total{job=\"steward-api\",route=\"/register\"}[5m]))\n      - record: steward:registration_errors:rate5m\n        expr: sum by (route) (rate(http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}[5m]))\n      - record: steward:registration_error_ratio:rate5m\n        expr: steward:registration_errors:rate5m / steward:registration_requests:rate5m\n      - alert: StewardRegistrationElevatedErrors\n        expr: (steward:registration_error_ratio:rate5m > 0.20) and on(route) (steward:registration_requests:rate5m > 0.10)\n        for: 2m\n        labels:\n          severity: ticket\n          team: reliability\n        annotations:\n          summary: \"Elevated registration failures\"\n      - alert: StewardMetricsScrapeFailed\n        expr: up{job=\"steward-api\"} == 0\n        for: 2m\n        labels:\n          severity: ticket\n          team: reliability\n        annotations:\n          summary: \"Prometheus cannot scrape a configured Steward target\"\n      - alert: StewardMetricsTargetMissing\n        expr: absent_over_time(up{job=\"steward-api\"}[5m])\n        for: 2m\n        labels:\n          severity: ticket\n          team: reliability\n        annotations:\n          summary: \"Expected Steward scrape series disappeared\"\n"
  },
  {
    "type": "heading",
    "id": "record-rule-unknowns",
    "level": 2,
    "text": "Distinguish zero traffic, failed collection and entirely absent targets"
  },
  {
    "type": "paragraph",
    "text": "If a configured target fails a scrape, Prometheus normally evaluates up{job=\"steward-api\"} == 0 for that target. When the entire target disappears from discovery, up may be absent rather than zero: absent_over_time(up{job=\"steward-api\"}[5m]) addresses that separate case. Neither query by itself proves the API failed for its users. Use an independently maintained expected-target inventory to determine whether disappearance is itself abnormal, and inspect service discovery or relabeling. Do NOT globally use or vector(0) to convert no-data into a healthy error rate."
  },
  {
    "type": "heading",
    "id": "record-rule-promtool",
    "level": 2,
    "text": "Execute actual Prometheus expression and alert unit tests"
  },
  {
    "type": "paragraph",
    "text": "The second file is an official promtool unit-test fixture for real PromQL rule-engine evaluation, not a Python approximation. input_series defines synthetic counter and up samples every minute; alert_rule_test checks when alerts fire; promql_expr_test verifies the recorded ratio and its route label. Cases include healthy-to-sustained 5xx errors, zero traffic, sustained up=0, transient scrape failure and wholly absent discovery. Run both commands in the lab directory. A passing suite validates these synthetic rule evaluations; it does NOT imply a live Prometheus scrape, retained TSDB, Grafana state, Alertmanager route, notification receipt or real Steward SLO measurement."
  },
  {
    "type": "code",
    "language": "yaml",
    "caption": "Exact committed steward.test.yml: official promtool source fixtures for rule evaluation",
    "code": "# The official Prometheus promtool evaluates the real rule expressions here.\n# All data is synthetic. Do not confuse this with real Steward observations.\nrule_files:\n  - steward.rules.yml\nevaluation_interval: 1m\ntests:\n  - name: healthy_then_sustained_user_errors\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0+10x15'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0+0x5 0+10x9'\n      - series: 'up{job=\"steward-api\",instance=\"api:9464\"}'\n        values: '1x15'\n    promql_expr_test:\n      - expr: 'steward:registration_error_ratio:rate5m{route=\"/register\"}'\n        eval_time: 15m\n        exp_samples:\n          - labels: 'steward:registration_error_ratio:rate5m{route=\"/register\"}'\n            value: 0.5\n    alert_rule_test:\n      - eval_time: 5m\n        alertname: StewardRegistrationElevatedErrors\n        exp_alerts: []\n      - eval_time: 15m\n        alertname: StewardRegistrationElevatedErrors\n        exp_alerts:\n          - exp_labels:\n              route: /register\n              severity: ticket\n              team: reliability\n            exp_annotations:\n              summary: Elevated registration failures\n      - eval_time: 15m\n        alertname: StewardMetricsScrapeFailed\n        exp_alerts: []\n      - eval_time: 15m\n        alertname: StewardMetricsTargetMissing\n        exp_alerts: []\n\n  - name: initialized_zero_counters_no_traffic\n    interval: 1m\n    input_series:\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"2xx\"}'\n        values: '0x15'\n      - series: 'http_requests_total{job=\"steward-api\",route=\"/register\",status_class=\"5xx\"}'\n        values: '0x15'\n      - series: 'up{job=\"steward-api\",instance=\"api:9464\"}'\n        values: '1x15'\n    alert_rule_test:\n      - eval_time: 10m\n        alertname: StewardRegistrationElevatedErrors\n        exp_alerts: []\n      - eval_time: 10m\n        alertname: StewardMetricsTargetMissing\n        exp_alerts: []\n\n  - name: configured_target_scrape_fails\n    interval: 1m\n    input_series:\n      - series: 'up{job=\"steward-api\",instance=\"api:9464\"}'\n        values: '1x1 0x8'\n    alert_rule_test:\n      - eval_time: 5m\n        alertname: StewardMetricsScrapeFailed\n        exp_alerts:\n          - exp_labels:\n              instance: api:9464\n              job: steward-api\n              severity: ticket\n              team: reliability\n            exp_annotations:\n              summary: Prometheus cannot scrape a configured Steward target\n      - eval_time: 5m\n        alertname: StewardMetricsTargetMissing\n        exp_alerts: []\n      - eval_time: 5m\n        alertname: StewardRegistrationElevatedErrors\n        exp_alerts: []\n\n  - name: brief_scrape_failure_does_not_fire\n    interval: 1m\n    input_series:\n      - series: 'up{job=\"steward-api\",instance=\"api:9464\"}'\n        values: '1 0 1 1 1 1'\n    alert_rule_test:\n      - eval_time: 5m\n        alertname: StewardMetricsScrapeFailed\n        exp_alerts: []\n\n  - name: entirely_absent_expected_target\n    interval: 1m\n    alert_rule_test:\n      - eval_time: 10m\n        alertname: StewardMetricsTargetMissing\n        exp_alerts:\n          - exp_labels:\n              job: steward-api\n              severity: ticket\n              team: reliability\n            exp_annotations:\n              summary: Expected Steward scrape series disappeared\n      - eval_time: 10m\n        alertname: StewardMetricsScrapeFailed\n        exp_alerts: []\n      - eval_time: 10m\n        alertname: StewardRegistrationElevatedErrors\n        exp_alerts: []\n"
  },
  {
    "type": "code",
    "language": "bash",
    "caption": "Check the source rule syntax and execute its actual expression/alert tests",
    "code": "cd labs/reliability-prometheus-rules\npromtool check rules steward.rules.yml\npromtool test rules steward.test.yml"
  },
  {
    "type": "heading",
    "id": "record-rule-mutation",
    "level": 2,
    "text": "Falsify the rule, not the expected result"
  },
  {
    "type": "paragraph",
    "text": "Copy both YAML files into a disposable directory. Change the scrape-failure alert from up == 0 to up == 1; re-run promtool and verify a failing alert test, then restore it. Remove status_class=5xx from the error numerator and ensure the ratio or healthy/error state test fails. Change the missing-target expression to up == 0 and verify the absent-target test rejects that conflation. Keep fixtures unchanged while mutating the rule, or you risk teaching the test to accept the wrong behavior. The separate local /metrics experiment proves HTTP behavior; this test proves synthetic real PromQL engine semantics. Neither demonstrates actual production data availability."
  },
  {
    "type": "resources",
    "title": "Prometheus specification and rule tests",
    "resources": [
      {
        "title": "Recording rule syntax and evaluation",
        "url": "https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/"
      },
      {
        "title": "Promtool rule unit test format",
        "url": "https://prometheus.io/docs/prometheus/latest/configuration/unit_testing_rules/"
      },
      {
        "title": "Alert state and for duration",
        "url": "https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/"
      }
    ]
  }
];
