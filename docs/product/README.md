# TSA Product Documentation

## Steward

Steward is the continuing product used across the Technical Stewardship Academy.

Read these documents together:

1. [`steward.md`](./steward.md) — canonical product and domain definition: what Steward is, its core entities, business rules, API direction and long-term product scope.
2. [`steward-api-evolution-map.md`](./steward-api-evolution-map.md) — learner-facing implementation roadmap: when each capability is introduced, what remains out of scope, what the learner must understand, and the exit condition for each stage.
3. [`steward-requirement-authoring-standard.md`](./steward-requirement-authoring-standard.md) — requirement quality and difficulty standard: how Steward work must be specified clearly without prescribing the solution, and how learner ownership increases across the academy.
4. [`steward-observability-stack.md`](./steward-observability-stack.md) — canonical Reliability Engineer observability decision: Graylog for centralized logs, Prometheus for metrics, Grafana for operational metrics dashboards, plus the selected tracing backend where required.
5. [`steward-enterprise-file-integration.md`](./steward-enterprise-file-integration.md) — canonical enterprise file/batch integration boundary: NFS for justified internal shared-file use, legacy FTP exposure, SFTP migration target, deterministic batch processing and file-contract authority rules.
6. [`steward-enterprise-directory-federation.md`](./steward-enterprise-directory-federation.md) — canonical workforce identity boundary: LDAP/corporate directory as identity source, Keycloak as federation/OIDC layer, and Steward as the owner of domain authorization.

The domain definition prevents product drift. The evolution map prevents capability overload. The requirement standard prevents hidden/vague requirements and step-by-step project recipes. The observability decision prevents duplicated telemetry platforms while guaranteeing hands-on implementation of Graylog, Prometheus and Grafana. The file-integration decision keeps legacy enterprise compatibility inside Steward's scope without turning files into a second source of truth. The directory-federation decision prevents duplicated workforce credentials while keeping Steward decoupled from directory-specific authentication mechanics.
