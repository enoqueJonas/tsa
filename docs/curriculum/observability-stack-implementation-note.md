# Reliability Engineer — Required Observability Implementation

This note records the curriculum decision introduced after the Steward requirements audit.

Reliability Engineer owns hands-on implementation of the canonical observability stack, but product selection follows reliability questions rather than preceding them. The required implementations are:

- **Graylog** for centralized log management;
- **Prometheus** for metrics collection/storage and PromQL;
- **Grafana** for operational metrics dashboards and exploration.

A learner does not satisfy the observability objective by installing only one of these products or by producing architecture diagrams without running them. Conversely, installing all three before defining SLIs, diagnostic questions and telemetry requirements also fails the curriculum contract.

The progression is intentionally: reliability risks/SLIs → telemetry requirements → logging/metrics/tracing implementations → cross-signal integration → alerting/operations. The required evidence is defined across the Reliability Engineer runtime paths, consolidated by `Observability Stack Integration`, and reinforced by the Reliability Engineer milestone.

The three tools do not violate TSA's no-redundancy rule because they own different capabilities. Graylog is the primary logging platform; Prometheus is the primary metrics platform; Grafana is the primary metrics-oriented dashboard surface. Distributed tracing additionally requires OpenTelemetry context/instrumentation plus one deliberately selected tracing backend; that backend is not a second logging or metrics platform. Loki and OpenSearch/ELK-style stacks remain alternatives for comparison or future evidence-backed migration, not simultaneous mandatory logging implementations.

Architect may later simplify or replace this topology when evidence justifies the change. Later schools must preserve implementation/migration history rather than treating every earlier product as permanently mandatory.