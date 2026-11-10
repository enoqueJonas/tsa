import type { LessonBlock } from "../activities/content";
// Focused outage-and-recovery reading; executable Python is already published in preceding reading.
export const alertmanagerOutageRecoveryBlocks: LessonBlock[] = [
  {
    "type": "heading",
    "id": "alertmanager-resilience-source-vs-delivery",
    "level": 2,
    "text": "A firing Prometheus rule does not imply a delivered page"
  },
  {
    "type": "paragraph",
    "text": "The previous focused lab established genuine Prometheus → Alertmanager → localhost webhook firing and resolved delivery. Its success case still leaves one operational hazard: what if Prometheus continues to evaluate an alert while Alertmanager cannot accept it? A rule evaluation, a sending attempt, Alertmanager receiving, receiver HTTP 200, and human acknowledgment are separate events. A firing rule can coexist with an empty receiver inbox and an increasing notification-error counter. The real experiment below tests that separation. It uses only synthetic signals and disposable Linux Docker containers; no real Steward events, email, PagerDuty or production destinations."
  },
  {
    "type": "heading",
    "id": "alertmanager-resilience-recovery-mechanism",
    "level": 2,
    "text": "Keep the producer alive while the routing component is unreachable"
  },
  {
    "type": "paragraph",
    "text": "Run the exact Python source from the immediately preceding Prometheus-forwarding reading with TSA_FORWARD_SCENARIO=alertmanager-outage. It starts an actual Prometheus v3.13.3 process scraping a localhost gauge and an actual Alertmanager v0.28.1 instance with localhost webhook. After both report ready and the baseline produces no notification, the lab uses Docker stop on ONLY the Alertmanager container. The synthetic metric becomes 1. The real Prometheus /api/v1/alerts must show TSAForwardingProbe state=firing even while the Alertmanager listener is stopped. Prometheus's own prometheus_notifications_errors_total and prometheus_notifications_dropped_total must rise; the receiver must not contain a firing receipt. These are queried directly from real Prometheus /metrics, not /api/v1/query: the disposable job does not scrape Prometheus's own internal metrics into its TSDB. A metric being exported does not mean a PromQL query can find it. This disambiguates failed notification transport from failed rule evaluation or a user-service outage."
  },
  {
    "type": "paragraph",
    "text": "The lab configures --rules.alert.resend-delay=5s ONLY for the disposable experiment (the normal Prometheus default is 1m). Prometheus periodically resends firing alerts. After the test observes failed forwarding, it starts a fresh disposable Alertmanager container with the same local configuration and demands an actual successful firing webhook, then sets the source gauge back to 0 and demands a resolved webhook. Avoid claiming an exact retry time, at-most-once delivery, guaranteed replay after arbitrary retention or a production paging SLA. Recovery is proved by independent received HTTP messages with matching alertname, status and reliability route."
  },
  {
    "type": "code",
    "language": "bash",
    "caption": "Execute the exact prior reading's Python source in normal mode, then require a real Alertmanager outage and recovery",
    "code": "python3 scripts/check-reliability-prometheus-to-alertmanager.py\nTSA_FORWARD_SCENARIO=alertmanager-outage python3 scripts/check-reliability-prometheus-to-alertmanager.py"
  },
  {
    "type": "heading",
    "id": "alertmanager-resilience-wrong-oracle",
    "level": 2,
    "text": "Falsify the outage assumption without changing expected evidence"
  },
  {
    "type": "paragraph",
    "text": "Run TSA_FORWARD_SCENARIO=outage-without-disconnect python3 scripts/check-reliability-prometheus-to-alertmanager.py in a disposable environment. This deliberately skips the Docker stop while leaving all expected-outage assertions intact. A genuine webhook receipt or absence of Prometheus notification errors must cause a nonzero exit. The negative outcome is meaningful only when it fails the outage oracle, not when the container cannot start or the Python script has a syntax error. Keep the baseline and receiver observation checks; do not hardcode a pass simply because the Python client can reach the Alertmanager API."
  },
  {
    "type": "code",
    "language": "bash",
    "caption": "Deliberately wrong scenario: the unchanged outage oracle must reject a healthy receiver",
    "code": "TSA_FORWARD_SCENARIO=outage-without-disconnect python3 scripts/check-reliability-prometheus-to-alertmanager.py"
  },
  {
    "type": "heading",
    "id": "alertmanager-resilience-monitor",
    "level": 2,
    "text": "What to investigate and how to monitor the alerting pipeline itself"
  },
  {
    "type": "paragraph",
    "text": "Investigate in order: (1) verify current rules via /api/v1/alerts and rule-evaluation health; (2) verify Prometheus target/Alertmanager discovery and the self-exposed prometheus_notifications_errors_total plus prometheus_notifications_dropped_total without equating error, queued and dropped events; (3) query Alertmanager readiness and the active alerts API; (4) examine alertmanager_notifications_failed_total and receiver HTTP status/latency; (5) verify the intended external recipient actually received and acknowledged the incident. An accepted 200 webhook response is still not proof that a human saw or acted on a page."
  },
  {
    "type": "paragraph",
    "text": "A long outage can exceed notification queues, retention and retry limits; no single successful recovery fixture establishes durability for all durations. A real high-availability design requires multiple independent Alertmanager targets, separate alerting-pipeline monitoring, tested network partitions, safe receiver credentials and an escalation fallback. Alertmanager's grouping, inhibition, repeat interval and deduplication should be assessed under that service's real fault model, not by blindly multiplying alert traffic or disabling production monitoring."
  },
  {
    "type": "resources",
    "title": "Official reference for resend and notification diagnosis",
    "resources": [
      {
        "title": "Prometheus command-line configuration and resend delay",
        "url": "https://prometheus.io/docs/prometheus/latest/command-line/prometheus/"
      },
      {
        "title": "Prometheus Alertmanager API client resend requirements",
        "url": "https://github.com/prometheus/alertmanager/blob/main/docs/alerts_api.md"
      },
      {
        "title": "Alertmanager notification grouping and wait timing",
        "url": "https://prometheus.io/docs/alerting/latest/configuration/"
      }
    ]
  }
];
