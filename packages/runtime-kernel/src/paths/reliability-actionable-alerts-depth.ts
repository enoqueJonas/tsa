import type { LessonBlock } from "../activities/content";
// Concept and acceptance, not duplicate YAML or false live-delivery claim.
export const actionableAlertEngineBlocks: LessonBlock[] = [
  {
    "type": "heading",
    "id": "actionable-alert-contract",
    "level": 2,
    "text": "An alert is a decision pipeline, not a Boolean dashboard color"
  },
  {
    "type": "paragraph",
    "text": "Separate four boundaries: a service must emit correct request/error measurements, Prometheus must scrape and evaluate the exact expression, an alert router must actually deliver the matching notification, and a responsible human must have enough evidence and a safe runbook to respond. The preceding recording-rule focused lesson tests only the rule-engine boundary using synthetic data and official promtool. A passing unit test cannot prove Alertmanager received a firing event, notification delivery, acknowledgment, escalation or production impact."
  },
  {
    "type": "heading",
    "id": "actionable-alert-severity",
    "level": 2,
    "text": "Decide whether to page, ticket, or only investigate"
  },
  {
    "type": "paragraph",
    "text": "The synthetic registration failure uses severity=ticket and for: 2m, not page. A real page requires grounded service objectives, high-confidence severe user impact, route and owner, action within the response timeframe and a tested runbook. The 20% failure threshold and minimum traffic rate are teaching values, not a universal operational recommendation. Transient failure can be pending then resolve; sustained breach becomes firing. A missing metrics series can cause an impact alert to disappear instead of turning green. Monitor telemetry coverage separately; never apply or vector(0) to conceal data loss."
  },
  {
    "type": "heading",
    "id": "actionable-alert-three-causes",
    "level": 2,
    "text": "Three symptoms with different owners and next observations"
  },
  {
    "type": "paragraph",
    "text": "A valid 5xx-rate alert is a service-symptom hypothesis: investigate which user requests failed, durable effects and related Graylog/trace evidence. A configured target with up=0 is a telemetry-transport or target health investigation: check discovery, endpoint, network and scrape errors before declaring business downtime. An entirely absent expected target needs an independent deployment inventory before absent_over_time can be treated as a reliable alert. In the YAML fixture each gets its own rule, severity and summary so a runbook starts at the first unproven boundary."
  },
  {
    "type": "heading",
    "id": "actionable-alert-test-gate",
    "level": 2,
    "text": "Prove real rule-engine states and real notification separately"
  },
  {
    "type": "paragraph",
    "text": "Run the two committed YAML sources from the earlier focused recording-rule reading with promtool check rules and promtool test rules. Confirm the synthetic high-error alert is not firing at minute 5 but is firing at minute 15; a sustained failed scrape fires while a brief one does not; entirely absent up series triggers the missing-target rule but not the up==0 rule. Then on an approved disposable Prometheus+Alertmanager environment, inspect /api/v1/rules and /api/v1/alerts, route one test-only notification and confirm its actual receipt and resolution. If that integration is not available, write RULE_ENGINE_VERIFIED and LIVE_ALERT_DELIVERY_UNVERIFIED, never 'alerting complete'."
  },
  {
    "type": "resources",
    "title": "Primary alert rules and tests",
    "resources": [
      {
        "title": "Prometheus alerting rules",
        "url": "https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/"
      },
      {
        "title": "Prometheus rule test specification",
        "url": "https://prometheus.io/docs/prometheus/latest/configuration/unit_testing_rules/"
      },
      {
        "title": "Google SRE workbook SLO alerting",
        "url": "https://sre.google/workbook/alerting-on-slos/"
      }
    ]
  }
];
