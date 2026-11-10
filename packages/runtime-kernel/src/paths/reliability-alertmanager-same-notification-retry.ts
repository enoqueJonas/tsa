import type { LessonBlock } from "../activities/content";
// Focused same-notification receiver retry lab; source appears exactly once in prior real-runtime reading.
export const alertmanagerSameNotificationRetryBlocks: LessonBlock[] = [
  {
    "type": "heading",
    "id": "same-retry-why",
    "level": 2,
    "text": "A new successful alert is not a retry of a failed one"
  },
  {
    "type": "paragraph",
    "text": "The earlier direct Alertmanager lab sent SyntheticDeliveryFailure to a localhost webhook that returned HTTP 503. It then restored the receiver and successfully delivered a different alert named FreshRecovery. That verifies the receiver path works again; it says nothing about whether the original failed notification was retried. A real retry claim requires both attempts to represent the same alert and notification group, with no additional producer/API submission between them. This lesson closes that specific gap using the same source-published, official Alertmanager v0.28.1 executable in the preceding runtime reading."
  },
  {
    "type": "heading",
    "id": "same-retry-mechanism",
    "level": 2,
    "text": "Why 503 should be retried, but 400 should not"
  },
  {
    "type": "paragraph",
    "text": "Alertmanager's webhook notifier treats HTTP 2xx as delivered, HTTP 5xx as potentially recoverable, and other non-2xx responses (such as 400) as unrecoverable. A retry stage uses bounded backoff inside the notification context; its runtime is constrained by group_interval. The route also has a repeat_interval timer for future notifications, which is not equivalent to an immediate retry. Even a 503 does not guarantee eventual delivery: the notification may expire, the retry context can time out, the receiver can stay down, or Alertmanager can be terminated. The sender cannot infer a human acknowledgment from an HTTP 200."
  },
  {
    "type": "paragraph",
    "text": "The test adjusts only a disposable copy of its local YAML: group_wait=1s, group_interval=20s and repeat_interval=1m. This provides a bounded retry window before the next scheduled group repeat; it does not recommend these values for a real organization. It posts a single SyntheticDeliveryFailure through Alertmanager's v2 API and does not repost it while waiting. Its receiver captures the real HTTP response, notification groupKey and per-alert fingerprint, complete labels and startsAt; a different group, alert, status or source submission cannot satisfy the retry assertion."
  },
  {
    "type": "heading",
    "id": "same-retry-actual-503",
    "level": 2,
    "text": "Execute the positive case and inspect the exact identity"
  },
  {
    "type": "paragraph",
    "text": "From the repository root on an authorized disposable Linux host with Docker, execute the command below. The first actual webhook POST to /reliability must receive 503. The Python test then releases the same localhost receiver and awaits a 200 from a second actual POST with identical groupKey, alert fingerprint, labels, startsAt and firing status. There is only one POST to Alertmanager's /api/v2/alerts for this case; the receiver records at least two attempts. A successful result within 20s of rejection is evidence for the retry stage, not a later notification produced by the one-minute repeat interval."
  },
  {
    "type": "code",
    "language": "bash",
    "caption": "Same alert once: prove 503 rejected, then identical actual webhook retried and accepted",
    "code": "TSA_AM_RETRY_MODE=transient-503 python3 scripts/check-reliability-alertmanager-runtime.py"
  },
  {
    "type": "paragraph",
    "text": "Expected terminal markers are REAL_ALERTMANAGER_SAME_ALERT_REJECTED_PASS (first receiver HTTP 503, one API submission) followed by REAL_ALERTMANAGER_SAME_ALERT_503_RETRY_PASS (the same groupKey/fingerprint/startsAt/labels was accepted with HTTP 200). A 200 from the alert-ingestion API is not the 200 from the receiver; distinguish them in your evidence. The test records the first failed receiver attempt and a later accepted receiver attempt independently. It makes no claim about a production pager, durable outbox, Alertmanager cluster or human acknowledgment."
  },
  {
    "type": "heading",
    "id": "same-retry-4xx-case",
    "level": 2,
    "text": "Contrast a non-retryable 400 with the same webhook"
  },
  {
    "type": "paragraph",
    "text": "Run the nonretryable-400 mode with the same Alertmanager binary, local route and one submitted synthetic alert. The first receiver response must be HTTP 400; after the receiver becomes healthy, no immediate successful retry of that same group is allowed within an eight-second observation window. This is deliberately narrower than claiming the event will never be notified again: scheduled group reevaluation, a new alert or resubmission could create later traffic. Record which exception class changes the retry decision, and why a 400 caused by invalid payload or credentials should be fixed at the receiver/sender contract rather than blindly retried."
  },
  {
    "type": "code",
    "language": "bash",
    "caption": "Negative contrast: HTTP 400 must not immediately retry within the bounded test context",
    "code": "TSA_AM_RETRY_MODE=nonretryable-400 python3 scripts/check-reliability-alertmanager-runtime.py"
  },
  {
    "type": "heading",
    "id": "same-retry-permanent-failure",
    "level": 2,
    "text": "Falsify the retry success claim while the receiver never recovers"
  },
  {
    "type": "paragraph",
    "text": "Now run the permanent-503 mutation. It sends the same synthetic alert once but deliberately keeps the receiver rejecting HTTP 503. The positive retry oracle is unchanged and must fail with SAME_ALERT_RETRY_NOT_PROVEN, not a syntax error or Docker startup failure. If you merely assert Alertmanager accepted /api/v2/alerts, or if you substitute a FreshRecovery alert to make the test green, you have not proven retry of the original notification. The CI job explicitly requires this broken case to fail."
  },
  {
    "type": "code",
    "language": "bash",
    "caption": "Changed-case test: do not count endless 503 attempts as successful delivery",
    "code": "TSA_AM_RETRY_MODE=permanent-503 python3 scripts/check-reliability-alertmanager-runtime.py"
  },
  {
    "type": "heading",
    "id": "same-retry-production-transfer",
    "level": 2,
    "text": "Transfer the evidence without overclaiming delivery guarantees"
  },
  {
    "type": "paragraph",
    "text": "Present a short evidence table for each case with producer submissions, first and later receiver response, alert fingerprint, group key, start time, elapsed duration and accepted-receiver count. Explain whether a retry occurred and which boundary remains unverified. A 503 followed by a matching 200 in a disposable single-instance lab validates this scenario, not arbitrary retry persistence, crash recovery, exactly-once notification, HA deduplication, real external network behavior, downstream service processing or a human responding. A receiver should implement deduplication/idempotency using a stable delivery identity appropriate to its contract because an ambiguous HTTP failure can cause the same notification to be processed twice."
  },
  {
    "type": "resources",
    "title": "Official Alertmanager delivery semantics",
    "resources": [
      {
        "title": "Alertmanager webhook integration source, HTTP 5xx recoverability",
        "url": "https://github.com/prometheus/alertmanager/blob/main/notify/webhook/webhook.go"
      },
      {
        "title": "Alertmanager retry decision for HTTP response codes",
        "url": "https://github.com/prometheus/alertmanager/blob/main/notify/util.go"
      },
      {
        "title": "Alertmanager group interval limits notification pipeline duration",
        "url": "https://prometheus.io/docs/alerting/latest/configuration/"
      }
    ]
  }
];
