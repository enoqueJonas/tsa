# Reliability Engineer — Required Observability Implementation

This note records the curriculum decision introduced after the Steward requirements audit.

The Reliability Engineer journey must require hands-on implementation of all of the following:

- **Graylog** for centralized log management;
- **Prometheus** for metrics collection/storage and PromQL;
- **Grafana** for operational metrics dashboards and exploration.

A learner does not satisfy the observability objective by installing only one of these products or by producing architecture diagrams without running them.

The required evidence is defined in the `Observability Stack Integration` learning path and reinforced by the Reliability Engineer milestone.

The three tools do not violate TSA's no-redundancy rule because they own different capabilities. Graylog is the primary logging platform; Prometheus is the primary metrics platform; Grafana is the primary metrics-oriented dashboard surface. Loki and OpenSearch/ELK-style stacks remain alternatives for comparison or future migration exercises, not simultaneous mandatory logging implementations.