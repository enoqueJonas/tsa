import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";
import { alertDeliveryBlocks } from "./reliability-alert-delivery-proof";
import { alertmanagerRouteFocusedBlocks, alertmanagerRuntimeFocusedBlocks } from "./reliability-alertmanager-real-runtime";

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
                    "State the absent boundary: the synthetic driver submits to /api/v2/alerts directly; real Prometheus-to-Alertmanager transport, production paging receiver and human acknowledgment are UNVERIFIED unless separately tested."
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
                    "Explain the negative-source tests for incorrect grouping, routing and inhibition, and why all still require additional evidence for Prometheus alert forwarding and a real external responder.",
                    "Define monitoring for Alertmanager availability, Prometheus notification errors and receiver-delivery failures, plus the runbook first checks for each layer."
                ], deliverables: ["Healthy delivery baseline", "Alertmanager outage experiment", "Receiver failure experiment", "Recovery evidence", "Alert-delivery monitoring requirements", "Failure-layer runbook"], completionCriteria: ["Alertmanager unavailability is reproduced safely.", "The learner distinguishes a firing Prometheus rule from successful notification delivery.", "Receiver failure is distinguished from Alertmanager failure.", "Delivery recovers predictably.", "The alerting pipeline has explicit self-monitoring requirements." ] },
            },
            { id: "reliability-alertmanager-implementation-004", title: "Defend the Alerting Pipeline", estimatedMinutes: 20, content: { type: "reflection", prompt: "Explain the Steward alert path from Prometheus rule evaluation through Alertmanager grouping/routing/inhibition to the receiver. Describe one delivery failure you reproduced, why a firing rule is not proof that a human was notified, how duplicate noise is controlled, and what evidence would justify changing the routing design later.", minimumCharacters: 300 } },
        ],
    },
];
