import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";
import { alertDeliveryBlocks } from "./reliability-alert-delivery-proof";
import { alertmanagerRouteFocusedBlocks, alertmanagerRuntimeFocusedBlocks } from "./reliability-alertmanager-real-runtime";
import { prometheusToAlertmanagerBlocks } from "./reliability-prometheus-to-alertmanager-proof";
import { alertmanagerOutageRecoveryBlocks } from "./reliability-alertmanager-outage-recovery";
import { alertmanagerSameNotificationRetryBlocks } from "./reliability-alertmanager-same-notification-retry";
import { alertmanagerAmbiguousEffectBlocks } from "./reliability-alertmanager-ambiguous-effect";

const alertmanager: LearningResource = { title: "Prometheus Alertmanager", url: "https://prometheus.io/docs/alerting/latest/alertmanager/" };
const notificationExamples: LearningResource = { title: "Alertmanager notification examples", url: "https://prometheus.io/docs/alerting/latest/notification_examples/" };

const blocks: LessonBlock[] = [
    { type: "paragraph", text: "Steward already has Prometheus rules and an alerting policy. This path closes the operational gap between producing an alert and operating the component that groups, routes, suppresses and delivers it." },
    { type: "heading", id: "alertmanager-boundary", text: "Alertmanager owns notification routing", level: 2 },
    { type: "list", items: [
        "Prometheus evaluates alert rules and sends alert state to Alertmanager.",
        "Alertmanager groups, routes, inhibits and delivers notifications; it does not replace Prometheus metric evaluation.",
        "Grafana remains the operational visualization layer and Graylog remains the centralized event/log investigation layer.",
        "One real learner-owned notification receiver is enough for the lab; do not create a second alerting platform merely for exposure.",
        "Alertmanager availability and delivery failure are themselves operational conditions that must be visible."
    ] },
    ...alertDeliveryBlocks,
    { type: "resources", title: "Continue learning", resources: [alertmanager, notificationExamples] },
];

export const alertmanagerImplementationDeepLessons: Lesson[] = [
    {
        id: "reliability-alertmanager-implementation",
        title: "Operate Prometheus Alertmanager",
        activities: [
            { id: "reliability-alertmanager-implementation-001", title: "From Firing Rule to Delivered Notification", estimatedMinutes: 35, content: { type: "reading", body: "Treat alert delivery as an operated reliability path, not an unspecified webhook after a Prometheus rule fires.", blocks } },
            {
                id: "reliability-alertmanager-implementation-route-mechanics-reading",
                title: "Route, Group, and Inhibit Without Silencing the Wrong Incident",
                estimatedMinutes: 45,
                content: { type: "reading", body: "Explain actual Alertmanager receiver decisions, grouping clocks, label-based owner selection, fallback and scoped inhibition before operating a notifier.", blocks: alertmanagerRouteFocusedBlocks },
            },
            {
                id: "reliability-alertmanager-implementation-live-delivery-reading",
                title: "Execute Real Alertmanager Delivery and Recovery",
                estimatedMinutes: 85,
                content: { type: "reading", body: "Run the actual Alertmanager binary against a localhost webhook, prove grouped and inhibited delivery, receiver 503 failure, fresh recovery and resolved messages without claiming a production pager.", blocks: alertmanagerRuntimeFocusedBlocks },
            },
            {
                id: "reliability-alertmanager-implementation-same-notification-retry-reading",
                title: "Retry the Original Rejected Notification, Not a Fresh Alert",
                estimatedMinutes: 65,
                content: {
                    type: "reading",
                    body: "Execute real Alertmanager webhook 503-to-200 retry for the same fingerprint, compare non-retryable HTTP 400 and reject a permanently failed receiver.",
                    blocks: alertmanagerSameNotificationRetryBlocks,
                },
            },
            {
                id: "reliability-alertmanager-implementation-ambiguous-side-effect-reading",
                title: "Committed Side Effect Before HTTP 503: Prevent Duplicate Work",
                estimatedMinutes: 60,
                content: {
                    type: "reading",
                    body: "Exercise the same real Alertmanager notification when a SQLite effect commits before the receiver replies 503; prevent duplicate effects with a unique durable identity.",
                    blocks: alertmanagerAmbiguousEffectBlocks,
                },
            },
            {
                id: "reliability-alertmanager-implementation-prometheus-forwarding-reading",
                title: "Prove Actual Prometheus-to-Alertmanager Delivery",
                estimatedMinutes: 75,
                content: {
                    type: "reading",
                    body: "Execute a real Prometheus rule against a synthetic localhost metric, verify Alertmanager firing and resolved webhooks, and fail a deliberately inverted rule.",
                    blocks: prometheusToAlertmanagerBlocks,
                },
            },
            {
                id: "reliability-alertmanager-implementation-outage-recovery-reading",
                title: "Keep Alert Evaluation Visible During Alertmanager Outages",
                estimatedMinutes: 60,
                content: {
                    type: "reading",
                    body: "Diagnose a real Alertmanager outage without confusing Prometheus firing state, notification errors and an independently received webhook.",
                    blocks: alertmanagerOutageRecoveryBlocks,
                },
            },
            {
                id: "reliability-alertmanager-implementation-002",
                title: "Deploy and Route with Alertmanager",
                estimatedMinutes: 150,
                content: { type: "practical", objective: "Operate a real Alertmanager instance between Steward's Prometheus rules and a learner-owned notification channel.", scenario: "Steward has useful alert rules, but routing behavior must now be deterministic, testable and independently operable.", instructions: [
                    "Deploy Alertmanager in the learner-owned Reliability environment and configure Prometheus to send firing/resolved alert state to it.",
                    "Configure one real learner-owned receiver such as email or a webhook endpoint that can prove delivery; do not use a fake screenshot as notification evidence.",
                    "Define stable labels for service, environment, severity and owner, then build a routing tree that sends at least two representative Steward alerts through the intended route.",
                    "Configure grouping so related alerts from one controlled incident produce a coherent notification rather than avoidable duplicate noise.",
                    "Configure and prove one inhibition rule where a parent condition suppresses a known derivative symptom.",
                    "Capture Alertmanager status/configuration evidence without publishing live credentials or receiver secrets.",
                    "Before live Steward configuration, run the exact Python 3 source from the focused Alertmanager runtime reading with the pinned official Docker image. Retain actual receiver evidence for grouping, team routing, fallback, inhibition and duplicate suppression; do not infer these from configuration alone.",
                    "In a disposable copy of the YAML, change group_by to include alertname and verify the exact live container test rejects the broken grouping. Restore it, then break the security route and prove an unserved security alert is detected.",
                    "Run the exact additional Prometheus-forwarding source from the focused reading; prove Prometheus API up=1, no premature alert, an actual firing webhook and an actual resolved webhook. Then set TSA_FORWARD_RULE_VARIANT=wrong-condition and verify the real transport test fails before source activation.",
                    "Distinguish the directly submitted /api/v2/alerts Alertmanager grouping/route lab from the separate real Prometheus-to-Alertmanager source. Both use synthetic inputs; neither proves real Steward rules, production paging receiver or human acknowledgment.",
                ], deliverables: ["Alertmanager deployment", "Prometheus-to-Alertmanager configuration", "Receiver evidence", "Routing tree", "Grouping evidence", "Inhibition evidence"], completionCriteria: ["A real Alertmanager instance receives Steward alerts from Prometheus.", "At least one firing and resolved notification reaches the intended real receiver.", "Routing is label-driven and tested.", "Grouping reduces duplicate incident noise.", "One inhibition/suppression case is proven rather than only described." ] },
            },
            {
                id: "reliability-alertmanager-implementation-003",
                title: "Break Alert Delivery and Recover It",
                estimatedMinutes: 120,
                content: { type: "practical", objective: "Understand the failure boundary between metric evaluation, Alertmanager and external notification delivery.", scenario: "A Prometheus rule can be firing correctly while Alertmanager or the receiver path is unavailable. Operators must not confuse alert evaluation with successful notification.", instructions: [
                    "Capture a healthy baseline showing Prometheus rule state, Alertmanager receipt and receiver delivery for one controlled alert.",
                    "Stop or isolate Alertmanager while reproducing the same alert condition and observe Prometheus delivery/retry/error behavior.",
                    "Restore Alertmanager and determine which notification state is delivered after recovery; record any timing or deduplication behavior that matters operationally.",
                    "Create one safe receiver-delivery failure or invalid receiver configuration and distinguish it from Alertmanager unavailability.",
                    "Restore delivery and prove a fresh firing/resolved cycle reaches the receiver.",
                    "Record actual HTTP 503 attempts separately from 200 accepted notifications in the real Alertmanager loopback lab; never call a rejected request delivered.",
                    "Prove recovery with a fresh group after restoring the test receiver; independently verify the resolved notification for a previously delivered security alert. Do not infer retry of the original rejected delivery from fresh-group success.",
                    "From the focused same-notification retry reading, run TSA_AM_RETRY_MODE=transient-503 with real Alertmanager; prove the initial rejected HTTP 503 and later HTTP 200 have identical alert fingerprint, labels, startsAt, groupKey and firing status, without a second /api/v2/alerts submission.",
                    "Execute TSA_AM_RETRY_MODE=nonretryable-400 and verify the HTTP 400 receiver refusal is not immediately retried in the bounded eight-second test; do not claim the alert can never be sent again.",
                    "Execute TSA_AM_RETRY_MODE=permanent-503 and verify the unchanged positive retry oracle fails with SAME_ALERT_RETRY_NOT_PROVEN rather than passing on an API 200 or unrelated fresh notification.",
                    "Run TSA_AM_RETRY_MODE=ambiguous-503 against official Alertmanager. The localhost webhook must COMMIT the synthetic SQLite side effect before returning 503; after the identical webhook retry returns 200, a fresh SQLite connection must still observe exactly one committed effect under a UNIQUE identity index.",
                    "Run TSA_AM_RETRY_MODE=ambiguous-no-idempotency against the unchanged positive scenario with the unique index removed. Require the real duplicate committed effect to be rejected with DUPLICATE_NOTIFICATION_EFFECT_DETECTED; a successful 200 webhook does not imply exactly-once downstream processing.",
                    "Explain the negative-source tests for incorrect grouping, routing and inhibition, and why all still require additional evidence for Prometheus alert forwarding and a real external responder.",
                    "Run the exact source from the focused Prometheus-forwarding reading in TSA_FORWARD_SCENARIO=alertmanager-outage; require real /api/v1/alerts firing state, real prometheus_notifications_errors_total increase and no successful receiver receipt before unpausing Alertmanager.",
                    "After restarting a disposable Alertmanager, observe an actual firing HTTP webhook and a separately resolved notification. Keep errors, delayed transport and accepted delivery as distinct evidence; do not promise retry of arbitrary messages.",
                    "Prove the outage oracle rejects an intentionally healthy listener with TSA_FORWARD_SCENARIO=outage-without-disconnect, without modifying expected results or treating startup errors as a negative-test pass.",
                    "Define monitoring for Alertmanager availability, Prometheus notification errors and receiver-delivery failures, plus the runbook first checks for each layer."
                ], deliverables: ["Healthy delivery baseline", "Alertmanager outage experiment", "Receiver failure experiment", "Recovery evidence", "Alert-delivery monitoring requirements", "Failure-layer runbook", "Same-rejected-notification HTTP 503→200 identity evidence and HTTP 400/permanent-503 controls", "Committed-before-503 SQLite UNIQUE effect evidence and non-idempotent duplicate rejection", "Actual Prometheus firing + notification error + recovered receiver evidence with no-outage mutant"], completionCriteria: ["Alertmanager unavailability is reproduced safely.", "The learner distinguishes a firing Prometheus rule from successful notification delivery.", "Receiver failure is distinguished from Alertmanager failure.", "Delivery recovers predictably.", "The alerting pipeline has explicit self-monitoring requirements." ] },
            },
            { id: "reliability-alertmanager-implementation-004", title: "Defend the Alerting Pipeline", estimatedMinutes: 20, content: { type: "reflection", prompt: "Explain the Steward alert path from Prometheus rule evaluation through Alertmanager grouping/routing/inhibition to the receiver. Describe one delivery failure you reproduced, why a firing rule is not proof that a human was notified, how duplicate noise is controlled, and what evidence would justify changing the routing design later.", minimumCharacters: 300 } },
        ],
    },
];
