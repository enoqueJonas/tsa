import type { LessonBlock } from "../activities/content";
// PED-005: topic-specific authored sections attached to the ORIGINAL eight logging readings.
// Source-only additions. Real Graylog deployment and learner competence remain unverified.
type LoggingSection = { heading:string; paragraphs:string[]; list?:string[]; code?:{language:string;code:string;caption?:string} };
export const loggingDepthById: Record<string, LoggingSection[]> = {
  "structured-logs": [
    {
      "heading": "Event schema before JSON",
      "paragraphs": [
        "A log event is a statement about an occurrence, not a dump of the HTTP request. Begin with the diagnostic question: which Steward action failed, where, with which outcome and with which request context? A useful event contract separates event_name, service, environment, request_id, outcome, timestamp and duration_ms; the message may change while the fields retain stable meaning. A stringified exception object has JSON syntax but does not become structured operational evidence when every event uses different keys or field types.",
        "Worked trace: a denied API operation and an outbox publication failure are separate events. They can share request_id but should use distinct event_name values, component identity and severity so an operator can filter by either failure class. Emit only a route template, not a customer-bearing raw URL. Avoid serializing headers, tokens, request bodies or personally identifying attributes. The transport later maps selected fields to GELF extras; do not assume JSON logged to stdout is already centrally indexed."
      ],
      "list": [
        "Decide the question, then name immutable event_name and stable fields.",
        "Assign types: duration_ms numeric; status_code integer; outcome and service constrained strings.",
        "Generate request_id at an appropriate trusted boundary and propagate it.",
        "Run one successful and one denied operation, comparing actual emitted fields.",
        "A field absent from the emitted event cannot be reconstructed by a Graylog dashboard."
      ]
    },
    {
      "heading": "Failure diagnosis and transfer",
      "paragraphs": [
        "Bad example: log.error({request: req, error: e}) embeds passwords, high-volume bodies and unstable structures. Better: log.warning({event_name:'authorization_denied',request_id,route:'/services/{id}',status_code:403}) and redact upstream. Diagnostic challenge: if Graylog shows only short_message without the _request_id custom GELF field, which stages might have stripped the field? Separate emitter serialization, collector transformation, Graylog pipeline, indexing mapping and search syntax; inspect the raw received payload before editing the dashboard."
      ]
    }
  ],
  "log-levels": [
    {
      "heading": "Separate event semantics from paging policy",
      "paragraphs": [
        "Syslog severity numbers and application logging levels are not identical APIs. A normal policy denial may merit structured audit/event logging without a page; a database outage causing sustained user errors may merit an ERROR event and an SLO-driven alert. Debug output is not safe to enable permanently in production merely because it helps diagnose one issue. Define a policy based on whether a condition is expected, recoverable and operator-actionable, rather than emotional emphasis.",
        "Worked decision: authorization_denied with a valid policy decision uses warning/audit context but does not by itself indicate a failed authorization control; downstream outbox_publish_failed after durable commit is abnormal but does not prove the user request was rejected. Escalation requires user impact or lost progress evidence. Graylog's GELF `level` is a syslog numeric severity; map levels deliberately and verify the recipient's interpretation, instead of assuming every logger's ERROR value maps to the same numeric integer."
      ]
    },
    {
      "heading": "Failure and transfer: distinguish a log from an alert",
      "paragraphs": [
        "If a Graylog search returns 5,000 WARN events but requests have a 100% success SLI, identify which event type is unexpectedly noisy and whether retention/sampling or severity policy is wrong. A one-off fatal event from a crashed replica might be critical only if traffic shifted safely. Explain when a metric alert on error-budget burn should page even though individual application logs are only WARN."
      ]
    }
  ],
  "correlation-ids": [
    {
      "heading": "Context must survive asynchronous boundaries",
      "paragraphs": [
        "A request identifier groups related events only if each component carries the same contextual value. Steward may accept a client-supplied traceparent for standards-compliant tracing but must not treat an arbitrary header as proof of identity or as an authorization token. At the API boundary, create a server-controlled operation ID or validate and normalize accepted context; record it in the outbox record and published message metadata so the consumer sees the same logical operation even when a retry creates a new delivery attempt.",
        "A retry has its own attempt identity but may retain the original operation ID. If five deliveries share the same request_id, this does NOT prove the operation happened five distinct times; correlate with idempotency key and consumer result before deciding a side effect was duplicated. Search Graylog by indexed request_id and bounded time range; inspect actual GELF underscore field mapping rather than guessing the stored field name."
      ]
    },
    {
      "heading": "Failure and independent transfer",
      "paragraphs": [
        "Case: HTTP API logs request_id=R7, but worker logs delivery_id=D9 only. You cannot safely reconstruct causality from timestamps. Add/verify outbox propagation and run a controlled retry to prove request_id persists without ever logging message payloads. Explain why random guessing from time proximity is not trace correlation, and why a correlation ID is not an authentication control."
      ]
    }
  ],
  "request-trace-context": [
    {
      "heading": "Request and trace identifiers have different meanings",
      "paragraphs": [
        "A W3C trace_id typically identifies a distributed trace and span_id a single timed span; request_id may instead name one HTTP edge request, and an application operation_id may survive an asynchronous queue boundary. These fields overlap but should not be silently interchangeable. For Steward, propagate trace context deliberately through the HTTP entrypoint, database operation and asynchronous publisher where the instrumentation supports it; keep the correlation ID as a separate reliable event search key.",
        "A span's sampled status changes what traces you can actually find. A trace_id present in a sanitized log does not guarantee the full trace was exported, retained or sampled. Do not claim the complete request path from a single root span. High-cardinality route parameters and raw query strings should not be turned into Prometheus labels; use route templates."
      ]
    },
    {
      "heading": "Failure and transfer: missing downstream span",
      "paragraphs": [
        "An API log has trace_id T, but the RabbitMQ consumer has no matching trace. Candidate causes include loss of message-context injection, asynchronous trace separation, sampling or exporter failure. Inspect message metadata (synthetic only), consumer instrumented spans and collector status before treating this as an application outage. Explain which gaps can be reconstructed using stable request_id and which remain unprovable without span context."
      ]
    }
  ],
  "centralized-logging": [
    {
      "heading": "Follow one event across seven responsibility boundaries",
      "paragraphs": [
        "A local structured log is emitted by Steward; a sidecar/agent or logger sends it through a selected transport to a configured Graylog Input; input decoding makes a message object; processing/pipeline and stream rules transform, redact and route fields; a disk-backed journal may absorb spikes; the selected search backend/Data Node indexes the event; Graylog Search retrieves it using permissions, actual field names and a bounded time window. The ordering and storage dependencies depend on the Graylog release and deployment. A successful UDP send is not delivery proof. Even a GELF HTTP 202 means accepted for processing rather than durable indexing/search.",
        "Match a controlled error event using the exact indexed request ID with a query such as `request_id:tsa-req-001 AND service:steward-api` **only if** those fields appear under those names after ingestion; first inspect the indexed event. Check time zone/clock skew, input health, journal utilization, processing/stream routing, index state, retention and search permissions in that order. If an event is missing from search, do not begin by changing dashboard colors or increasing query timeouts."
      ]
    },
    {
      "heading": "A live Graylog lab is separate from the loopback GELF primer",
      "paragraphs": [
        "The source-published `logging-graylog-event-lifecycle` lesson provides a loopback datagram and malformed producer-field negative. Its success proves only local serialization, UDP receipt and strict producer checks; it does not operate Graylog or exercise its ingestion pipeline. For a real approval-gated instance, select a version-compatible Graylog plus supported Data Node or OpenSearch storage, configure a private GELF input, send a synthetic request_id, verify exact search hit, then break an isolated input or malformed mapping and restore. Record the actual search query, topology, timestamps, stream and index set. Mark every missing step UNVERIFIED."
      ]
    },
    {
      "heading": "Failure and independent transfer: accepted but not searchable",
      "paragraphs": [
        "A sender reports success and Graylog's journal backlog rises, yet searches return no results. The known facts are transport acceptance and queued work; inspect processing and indexing health before deciding data was dropped. Compare with a second case where the event is indexed at the wrong timestamp and outside the selected window. Identify a discriminating observation for each and name the safe recovery condition."
      ]
    }
  ],
  "useful-noisy": [
    {
      "heading": "Cardinality and retention have measurable consequences",
      "paragraphs": [
        "Logging every successful heartbeat every second per replica can create millions of low-value events in a week while obscuring customer failures. Prefer a service-health metric for routine aggregate behavior; retain discrete failure, audit and state-transition events where individual context is useful. Do not move a per-user ID into a Prometheus label to save log storage, because unbounded labels explode time-series cardinality.",
        "Estimate volume before retention decisions: ten replicas logging one 500-byte heartbeat per second produce roughly 432 MB/day of raw payload (10*86400*500), before indexing and replication overhead. One log per meaningful state transition might meet the operational question with much less noise. Measure your own workload before adopting either assumption."
      ]
    },
    {
      "heading": "Failure and transfer: sampling hides the only event",
      "paragraphs": [
        "A rare payment failure was sampled away while success messages were stored. Explain why sampled logs cannot be used as a complete audit trail; keep security-relevant and user-impactful events under explicit retention and access policy. For a particular request_id, determine which source is authoritative for completeness versus which signals can only estimate trends."
      ]
    }
  ],
  "privacy-security": [
    {
      "heading": "Redaction must happen before centralization",
      "paragraphs": [
        "A centralized log backend extends the audience, lifetime and blast radius of emitted values. Sensitive information can leak in URL queries, exception text, request headers, stack traces and trace baggage; UI masking after indexing is too late to prevent stored disclosure. Build an emitter allowlist and use typed fields for status code, route template and sanitized reason rather than raw body. Logs should never contain bearer tokens, passwords, session cookies or full identity-document content.",
        "Security operational events remain useful when they capture actor role (not raw identity), operation, resource class, decision, reason category and correlation ID. Retention, encryption, RBAC, segregation and access auditing are part of the design. Debug logging must not silently disable redaction. A Graylog pipeline can provide defense in depth, but it cannot reliably undo every source leak once messages reach a network or journal."
      ]
    },
    {
      "heading": "Failure and transfer: deliberately injected synthetic secret",
      "paragraphs": [
        "In a disposable test, create a synthetic `token=DO_NOT_LOG` request header and verify that neither source logs nor indexed events contain it; do not inject actual secrets. If the token appears at the collector, stop the flow, remove it at the emitter, restrict access and follow the incident retention/removal procedure. Distinguish protecting future events from revoking an already compromised real credential."
      ]
    }
  ],
  "retention": [
    {
      "heading": "Retention is an index and incident-evidence contract",
      "paragraphs": [
        "Retention duration is determined by investigation needs, legal or policy constraints, event sensitivity, ingestion volume and storage budget. A ten-day indexed search window is not a promise that archived events remain searchable, nor does an old index retained on disk prove all actors can query it. Define whether a Graylog index set rotates by age/size/count and what deletion or archive action follows. The exact data-management UI and capabilities vary with version and edition.",
        "Take one synthetic incident and reconstruct what would be queryable after one day, after the selected retention window and after off-cluster recovery. Specify if the archive is searchable, how access is approved and how personally sensitive fields are excluded. If the indexer is down or the journal fills, retention settings do not prevent fresh log loss."
      ]
    },
    {
      "heading": "Failure and transfer: evidence expired before investigation",
      "paragraphs": [
        "A request failed 20 days ago but indexes are retained only 7 days and no compliant archive exists. The absence of search results is expected deletion, not proof no error occurred. Do not increase retention blindly; assess evidentiary need, storage growth, privacy and lawful handling, then propose a bounded tiered policy and alert before capacity risk."
      ]
    }
  ]
};
export function extraLoggingBlocks(id:string): LessonBlock[] {
  const sections=loggingDepthById[id] ?? [];
  return sections.flatMap(section=>{
    const blocks:LessonBlock[]=[{type:"heading",id:`${id}-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,text:section.heading,level:2},
      ...section.paragraphs.map(text=>({type:"paragraph" as const,text}))];
    if(section.list) blocks.push({type:"list",items:section.list});
    if(section.code) blocks.push({type:"code",...section.code});
    return blocks;
  });
}
