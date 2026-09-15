# Steward Distributed Tracing

## Decision

Reliability Engineer must implement distributed tracing in Steward using:

- OpenTelemetry for instrumentation and context propagation;
- Grafana Tempo as TSA's primary tracing backend;
- Grafana as the trace exploration/correlation UI where appropriate.

Jaeger and other tracing backends are comparison or future bounded-migration candidates. TSA does not permanently operate several tracing backends merely for exposure.

## Why tracing is now justified

Steward evolves across Kong, API handlers, PostgreSQL, Redis, RabbitMQ/background workers and platform boundaries. Metrics can reveal that a workflow is slow or failing and Graylog can reveal detailed events, but neither naturally reconstructs the complete causal path and latency contribution of one operation across those boundaries.

The curriculum therefore manufactures a controlled cross-boundary latency/failure scenario and requires the learner to implement tracing to solve that diagnostic problem.

## Signal ownership

- Prometheus: numeric/time-series metrics and service indicators.
- Grafana: operational visualization and correlation UI.
- Graylog: centralized structured log management and event-level investigation.
- OpenTelemetry + Tempo: request/span causality, cross-boundary propagation and latency decomposition.

These capabilities complement rather than replace one another.

## Mandatory evidence

The learner must:

1. deploy Tempo and a working OTLP ingestion path;
2. instrument Steward with OpenTelemetry;
3. propagate trace context across multiple synchronous boundaries and one RabbitMQ producer/consumer handoff;
4. capture PostgreSQL and at least one other meaningful dependency span;
5. investigate a deliberately introduced cross-boundary latency/failure using Prometheus/Grafana, Tempo and Graylog together;
6. prove what tracing explains that metrics and logs alone do not;
7. break the tracing/export pipeline and prove observability failure does not become an application availability dependency;
8. recover the tracing pipeline and characterize buffered versus lost telemetry;
9. keep secrets and uncontrolled high-cardinality data out of span attributes;
10. document evidence that could justify a future migration away from Tempo.

## Migration boundary

A future tracing backend replacement is a bounded migration: define compatibility and parity criteria, temporary coexistence if necessary, cutover, rollback and decommission. Permanent Tempo + Jaeger duplication is not the target architecture.
