# Steward — Observability Stack Decision

## Purpose

This document fixes TSA's primary hands-on observability stack for Steward during Reliability Engineer while preserving the one-primary-implementation rule.

The required implementation is:

- **Graylog** — centralized log ingestion, parsing/processing, search, streams, retention and log-access governance;
- **Prometheus** — metrics collection, storage, target health and PromQL evaluation;
- **Grafana** — metrics-oriented dashboards and operational exploration, primarily over Prometheus;
- **the selected tracing backend** — distributed trace storage/query for trace/span analysis where tracing is justified.

These components are not considered redundant because they own different observability signals and workflows.

## Capability ownership

### Graylog owns logs

Graylog is TSA's primary centralized logging implementation for Steward.

It must be used to:

- ingest logs from the Steward API and supporting runtime/platform sources;
- parse and normalize stable fields;
- search by time, service/component, level, event and correlation/request context;
- organize operational log streams/searches;
- retain logs according to explicit policy;
- control access to potentially sensitive operational data;
- support incident reconstruction using event-level evidence.

Graylog's own dashboards may be used where they help log investigation, but they do not replace the metrics responsibilities below.

### Prometheus owns metrics

Prometheus is TSA's primary metrics implementation.

It must be used to:

- scrape Steward application and supporting infrastructure/dependency metrics;
- store labeled time series;
- evaluate PromQL;
- support service indicators such as traffic, error rate, latency and saturation;
- provide the metrics evidence used by dashboards, SLOs and alerting.

Prometheus does not replace event-level logs.

### Grafana owns metrics-oriented operational dashboards

Grafana remains required even though Graylog has its own UI.

It must be used to:

- visualize Prometheus metrics;
- provide Steward operational/service dashboards;
- expose service symptoms and supporting dependency/platform evidence;
- support first-pass incident detection and investigation;
- link or guide operators toward related evidence such as Graylog searches or tracing where useful.

Grafana is not the authoritative centralized log-management platform in the Steward stack.

## Required learning workflow

The Reliability Engineer exercises must require the learner to actually deploy and use **all three: Graylog, Prometheus and Grafana**.

A valid end-to-end investigation should demonstrate the distinction:

1. Prometheus observes a measurable service or dependency symptom.
2. Grafana makes the symptom and its time/context visible to the operator.
3. Graylog provides event-level evidence needed to reconstruct what happened.
4. Tracing may add request-path/span evidence when the scenario requires it.

For example, Grafana may reveal a rise in Steward API latency and error rate while Graylog reveals the correlated application, worker or dependency events explaining the failure.

## Alternative technologies

TSA should compare Graylog with credible alternatives such as:

- Loki;
- OpenSearch/ELK-style logging stacks.

These alternatives are not second permanent logging implementations.

A learner may perform a bounded proof-of-concept or later migration exercise when comparison itself is the objective, but Steward should normally have one primary centralized logging stack at a time.

## Duplication boundary

The following is not acceptable merely for technology exposure:

```text
Graylog
+ Loki
+ ELK/OpenSearch logging
```

all operating permanently as equivalent centralized log platforms.

Temporary coexistence is acceptable only for a migration/replacement exercise with:

- an authoritative primary log path;
- bounded coexistence;
- parity/validation criteria;
- cutover and rollback conditions;
- an explicit decommission/retention decision.

## Reliability requirements

The implementation exercises must cover more than successful installation. The learner must demonstrate:

- structured and correlated application logs;
- multiple log sources reaching Graylog;
- parsing/field extraction suitable for reliable search;
- safe retention/redaction/access decisions;
- behavior when Graylog or log shipping is unavailable;
- Prometheus target configuration and application/infrastructure metrics;
- validated PromQL;
- Grafana dashboards based on meaningful reliability questions;
- at least one incident investigated with both metrics and logs;
- explicit capability ownership across the stack.

## Curriculum rule

Graylog, Prometheus and Grafana are **required implementation technologies** in the Reliability Engineer Steward journey. Their use is justified by the scenario-forced learning model: by this stage Steward spans enough application, messaging, gateway, orchestration and delivery components that single-process/local-host observation is insufficient.

Learning all three does not violate the no-redundancy rule because they do not own the same primary capability.