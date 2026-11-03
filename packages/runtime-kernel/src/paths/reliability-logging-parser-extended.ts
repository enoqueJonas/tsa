import type { LessonBlock } from "../activities/content";

/** The exact examples here are taught in the original logging readings. */
const diagnosticFixture = `import json
from collections import defaultdict

records = [
  json.dumps({"service":"api","event":"request.accepted","request_id":"example-42"}),
  json.dumps({"service":"worker","event":"job.failed","request_id":"example-42"}),
  "{invalid json",
  json.dumps({"service":"worker","event":"job.retry"}),
]
joined = defaultdict(list)
malformed = 0
uncorrelated = 0
for line in records:
    try:
        event = json.loads(line)
    except json.JSONDecodeError:
        malformed += 1
        continue
    if "request_id" not in event:
        uncorrelated += 1
        continue
    joined[event["request_id"]].append(event["event"])
assert joined["example-42"] == ["request.accepted", "job.failed"]
assert malformed == 1 and uncorrelated == 1
print("correlated=2 malformed=1 uncorrelated=1")`;

export const loggingDeepSections: Record<string, LessonBlock[]> = {
  "structured-logs": [
    { type: "heading", id: "event-schema-vs-encoding", text: "An event schema is more than JSON", level: 2 },
    { type: "paragraph", text: "An event records an occurrence: timestamp, emitting service, stable event name, outcome, request identifier and appropriate diagnostic fields. JSON is only an encoding. A free-text message inside JSON does not make the request searchable by outcome or source. A matching request ID joins a synchronous API event to a later worker event, but does not authenticate the caller or establish a complete trace." },
    { type: "heading", id: "parser-and-context-negative-evidence", text: "Run a real parsing and correlation failure", level: 2 },
    { type: "paragraph", text: "Execute this disposable standard-library model. It accepts two valid correlated events, quarantines malformed input and identifies a worker event lacking correlation context. This demonstrates event parsing and schema boundaries locally; it is not a running Graylog installation." },
    { type: "code", language: "python", caption: "Correlate two events; reject malformed and incomplete records", code: diagnosticFixture },
    { type: "paragraph", text: "Transfer: if one event is absent from a Graylog search, distinguish non-emission, delivery loss, parse failure, wrong index/stream, mismatched time window, retention and permissions before claiming the event never happened." },
  ],
  "centralized-logging": [
    { type: "heading", id: "graylog-message-path", text: "Follow a log from code to Graylog search", level: 2 },
    { type: "paragraph", text: "The application emits an event. A collector or shipper forwards it to a correctly configured Graylog input. The version-specific processing and pipeline rules normalize fields; a search backend indexes the processed message; a search query filters by time, component and request ID. Streams/index sets, retention, access rules and storage dependencies affect what the operator sees. Receiving a TCP payload is not proof that the expected request_id is queryable." },
    { type: "heading", id: "graylog-failure-diagnosis", text: "Failure and transfer: the missing worker event", level: 2 },
    { type: "paragraph", text: "For synthetic request example-42, first confirm the API and worker emitted correctly structured local records. Next verify shipper buffers and the Graylog input, parse-rule outcomes, stream/index routing, UTC time range, retention and role permissions. A collector outage may delay or lose evidence while the API continues serving; demonstrate only with a disposable collector and explicit recovery gate. Do not expose production inputs, credentials or customer data." },
    { type: "paragraph", text: "Graylog is TSA's selected central log platform, not the metrics backend. Prometheus answers aggregated rate/latency questions; Graylog supplies event-specific causes; Grafana presents metrics views and incident navigation. A query screenshot without source and parser evidence is insufficient." },
  ],
};
