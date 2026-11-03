import type { Lesson } from "./lesson";

export const observabilityStackIntegrationDeepLessons: Lesson[] = [
  {
    id: "reliability-observability-stack-integration",
    title: "Observability Stack Integration: Graylog, Prometheus and Grafana",
    activities: [
      {
        id: "reliability-observability-stack-integration-000",
        title: "Correlate One Incident Across Logs, Metrics and Traces",
        estimatedMinutes: 55,
        content: {
          type: "reading",
          body: "Follow a real user failure through separately owned telemetry contracts before implementing the Graylog, Prometheus and Grafana stack.",
          blocks: [
            { type: "heading", id: "correlation-goal", text: "Start with one user-visible failure and three diagnostic questions", level: 2 },
            { type: "paragraph", text: "Suppose a Steward registration request returns HTTP 503 after 2.8 seconds. The reliability question is not whether Grafana, Graylog and Tempo all have green dashboards. First establish impact: did users fail or time out and how often? A request counter and duration histogram can show the rate and latency distribution. Second establish what occurred for a specific request: a sanitized structured event with request ID, component, operation, outcome and dependency error. Third reconstruct timing and propagation: a trace containing the API span, database attempt and publisher/worker handoff if actually instrumented. Three signals are complementary, not interchangeable. A missing trace does not imply the database succeeded, and a green API /health does not imply registration succeeds." },
            { type: "heading", id: "correlation-identifiers", text: "Know which identifiers connect the evidence", level: 2 },
            { type: "paragraph", text: "A request ID identifies one application interaction, while a W3C trace ID identifies a distributed trace context that may cross boundaries. They can be stored together but are not identical. Neither is a user authentication token. Propagate trace context through HTTP and async messaging deliberately; record the relevant request and trace identifiers in sanitized logs and trace attributes. Prometheus label cardinality should remain bounded: putting every unique request ID into time-series labels is an anti-pattern, because each distinct label set creates a new series. A log store or tracing backend is the right place to find individual high-cardinality IDs." },
            { type: "heading", id: "causal-walkthrough", text: "Trace symptom → metric → log → span → action → verification", level: 2 },
            { type: "paragraph", text: "A user-facing SLI alert shows a higher error ratio over the last 10 minutes. Preserve the PromQL expression, numerator, denominator and missing-data policy, and first distinguish a real increase in user errors from missing scrape targets. Filter Graylog to the same environment/time range, service and event_name, then narrow by the sanitized request or trace ID. Inspect whether parsing, timestamp or stream rules could have omitted events; an HTTP 202 to a GELF input is not the same thing as an indexed search result. Open the trace for the same trace ID and compare API, DB and worker span timings. Choose one causal hypothesis backed by all available evidence, repair only the relevant failure boundary, and then repeat the same user-level request and SLI query. If spans are absent, mark the causal conclusion lower-confidence instead of inventing timing." },
            { type: "heading", id: "responsibility-ownership", text: "One owner per signal and a deliberate failure path", level: 2 },
            { type: "paragraph", text: "Graylog owns centralized, searchable, sanitized events plus ingestion/retention policy. Prometheus owns scraped, labeled metrics and PromQL evaluation. Grafana visualizes and links operational evidence; its panel being green is not source truth. The tracing backend (Tempo when selected by the prior decision) stores and retrieves traces. Each component has independent storage, access, reliability, cost, retention and failure boundaries. If Graylog ingestion stops, the application must follow its defined degradation and buffering contract; do not make core transactions wait forever for optional telemetry. If Prometheus goes down, silence is missing evidence, not zero errors. If a trace is sampled out, the absence of spans must not be misreported as a healthy dependency." },
            { type: "heading", id: "independent-diagnostic", text: "Failure and independent transfer before dashboard construction", level: 2 },
            { type: "paragraph", text: "Case A: Prometheus reports API error spikes, Graylog returns zero results because one synthetic event has a timestamp two hours in the past, and Tempo has a matching trace. Explain the correct Graylog time-range fix and why restarting Prometheus would not repair log search. Case B: Graylog contains multiple authorization_denied events but a dashboard's http_5xx counter remains flat: HTTP 403 failures need a separately defined policy/user-outcome metric, not automatic classification as server errors. Case C: request ID matches across API and gateway logs, but queue consumer trace context was not propagated: state exactly which causal timing is still unverified. Record the query, exact matching IDs, interpretation and next safe action for each." },
          ]
        }
      },
      {
        id: "reliability-observability-stack-integration-graylog-lab-guide",
        title: "Graylog First Run: Three Services, GELF Input and Query Evidence",
        estimatedMinutes: 90,
        content: {
          type: "reading",
          body: "Understand the actual Graylog components and versioned setup before the larger observability deployment. This is a learner-run procedure, not evidence that our audit deployed Graylog.",
          blocks: [
            { type: "heading", id: "graylog-three-service-topology", text: "Three components, three failure boundaries", level: 2 },
            { type: "paragraph", text: "In the documented Graylog 7.2 Docker Compose learning topology, MongoDB stores Graylog metadata and configuration; Graylog Data Node manages the search/storage role built on OpenSearch; the Graylog server exposes inputs, message processing, index/search control, REST and UI. A green Graylog container cannot prove MongoDB or Data Node is healthy. A search that returns zero results may reflect ingestion, routing, indexing, retention, time filtering or permissions." },
            { type: "heading", id: "graylog-versioned-prerequisites", text: "Check prerequisites without modifying a shared host", level: 2 },
            { type: "paragraph", text: "Use a disposable learner-owned Linux Docker host or Docker Desktop VM with sufficient memory and storage for MongoDB, Data Node and Graylog. Docker Compose must be available and the Docker Linux kernel needs vm.max_map_count >= 262144. On macOS, changing the macOS host sysctl does not configure Docker Desktop's Linux VM. Do not blindly apply host sysctl changes on a work machine. Consult the official Graylog 7.2 Compose documentation and document the selected image tags and configuration before running anything." },
            { type: "code", language: "bash", caption: "Read-only Docker and Linux-container-host preflight", code: "docker compose version\ndocker info --format '{{.ServerVersion}}'\n# On the authorized Docker Linux host/VM only (not the macOS host):\nsysctl vm.max_map_count" },
            { type: "heading", id: "graylog-first-run", text: "Deploy the official sandbox configuration, not a guessed production stack", level: 2 },
            { type: "paragraph", text: "Create a unique local directory and obtain the OFFICIAL version-matched open-core example Compose and .env.example from the Graylog project linked below. Inspect its image tags, service dependencies, bound ports and persistent volumes before starting. Set the randomly generated GRAYLOG_PASSWORD_SECRET and GRAYLOG_ROOT_PASSWORD_SHA2 (the SHA-256 digest of a strong learner-local admin password) in an untracked .env with restrictive permissions; never paste them into commits or audit evidence. Limit UI and input mappings to localhost or an explicitly isolated network, not public 0.0.0.0 host bindings. The example repository itself warns its Compose configurations are for testing/demo, not production." },
            { type: "code", language: "bash", caption: "After placing and configuring official version-matched files in this directory", code: "mkdir -p \"$HOME/tsa-graylog-lab\"\ncd \"$HOME/tsa-graylog-lab\"\n# First obtain the official compose YAML and .env.example (see resources).\n# Set local secrets, check binds and volume mounts; NEVER commit .env.\ndocker compose config --quiet\ndocker compose up -d\ndocker compose ps\n# Local diagnostic output may contain sensitive bootstrap credentials:\ndocker compose logs --tail=60 graylog\n# Do not publish unredacted logs or expose the UI to the Internet." },
            { type: "heading", id: "graylog-gelf-http", text: "Configure a real GELF HTTP input and send a synthetic event", level: 2 },
            { type: "paragraph", text: "After the official first-run/preflight login and Data Node setup, use Graylog System > Inputs to create a GELF HTTP input. Route it to a named lab stream/index set, and inspect Input Diagnosis. Configure the container's mapped input port as 127.0.0.1:12201 on the Docker HOST, with the actual container listener correctly bound inside the isolated network. This assumes the learner has intentionally mapped port 12201/TCP and selected matching GELF HTTP input. Send one synthetic event through POST /gelf, then query by the imported correlation field and a recent UTC window. Inspect the actual parsed field name in Graylog; some ingest formats normalize the leading underscore in GELF extension field names." },
            { type: "code", language: "bash", caption: "Only after the lab GELF HTTP input listens on host loopback port 12201", code: "curl --fail-with-body --silent --show-error --max-time 10 \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"version\":\"1.1\",\"host\":\"tsa-lab\",\"short_message\":\"synthetic request failed\",\"level\":4,\"_request_id\":\"tsa-ped005-42\",\"_service\":\"steward-demo\"}' \\\n  http://127.0.0.1:12201/gelf\n# Search Graylog in the latest 5 minutes for request_id:tsa-ped005-42\n# Then inspect the actual extracted field name, input counters and index set." },
            { type: "heading", id: "graylog-negative-verification", text: "Negative test: accepted transport does not prove searchable evidence", level: 2 },
            { type: "paragraph", text: "Send one deliberately malformed synthetic GELF JSON request, or temporarily stop the disposable input. Record the HTTP outcome AND input/parser diagnostics; do not assume a particular HTTP status across Graylog versions. If the valid event is missing, inspect emitted payload, port binding, input traffic, streams/pipelines, search index, time window, retention, and role permissions in order. A successful HTTP response establishes neither ingestion durability nor correct search fields. Restore the input, send a NEW fixture ID and verify it is searchable; never infer replay of earlier discarded events without evidence." },
            { type: "heading", id: "graylog-teardown", text: "Stop the sandbox without deleting unrelated state", level: 2 },
            { type: "paragraph", text: "When evidence is collected, run docker compose down from the dedicated lab directory. By default it removes that Compose project's containers and network while preserving named volumes; do not use -v or a global Docker prune as a shortcut. Record remaining owned volumes and delete them only with explicit consent after ensuring no important evidence or secrets remain." },
            { type: "code", language: "bash", caption: "Scoped cleanup of this learner-owned Compose project", code: "cd \"$HOME/tsa-graylog-lab\"\ndocker compose down\n# Check only lab-owned volumes before any separately approved deletion:\ndocker volume ls" },
            { type: "resources", title: "Version-matched Graylog setup and input reference", resources: [
              { title: "Graylog 7.2 — Containerized Deployment", url: "https://go2docs.graylog.org/current/downloading_and_installing_graylog/graylog_and_docker.htm", kind: "documentation" },
              { title: "Graylog 7.2 — Run Graylog in Docker", url: "https://go2docs.graylog.org/current/downloading_and_installing_graylog/docker_installation.htm", kind: "documentation" },
              { title: "Graylog Official Docker Compose Sandbox Examples", url: "https://github.com/Graylog2/docker-compose", kind: "documentation" },
              { title: "Graylog — Set Up an Input", url: "https://go2docs.graylog.org/current/getting_in_log_data/setup_an_input.htm", kind: "documentation" },
              { title: "Graylog — GELF Inputs", url: "https://go2docs.graylog.org/current/getting_in_log_data/gelf.html", kind: "documentation" }
            ] }
          ]
        }
      },
      {
        id: "reliability-observability-stack-integration-001",
        title: "Implement the Steward Observability Stack",
        estimatedMinutes: 300,
        content: {
          type: "practical",
          objective: "Implement Graylog, Prometheus and Grafana as the required Steward reliability stack and prove that each owns a distinct observability responsibility.",
          scenario: "Steward now spans API requests, PostgreSQL and the supporting dependencies still active in the inherited reliability baseline. Earlier implementation history may include Redis, RabbitMQ workers, Kong, Kubernetes/OpenShift workloads and Argo CD; observe those components when they remain active, or carry their explicit retirement/migration evidence rather than recreating them for this lab. Operators can no longer diagnose incidents by SSHing into one host or reading one process log. TSA therefore requires a real centralized logging path, a real metrics path and a real operational dashboard layer. Graylog is the primary centralized logging implementation; Prometheus is the primary metrics implementation; Grafana is the primary metrics/observability dashboard implementation.",
          instructions: [
            "Deploy Graylog in the learner environment with the supporting storage/runtime dependencies required by the selected Graylog version. Record the topology, resource cost and persistence assumptions rather than treating Graylog as a single opaque container.",
            "Configure a central log-ingestion path for the Steward API and at least two additional runtime sources chosen from RabbitMQ workers, Kong, Kubernetes/OpenShift workloads, Argo CD, GitLab CI/CD or selected infrastructure components.",
            "Ensure structured application events preserve timestamp, service/component identity, environment, level, event name and request/correlation identifier where applicable.",
            "Create Graylog parsing/processing rules, fields or pipelines needed to make the selected events reliably searchable without depending on free-text parsing at investigation time.",
            "Create useful Graylog streams/searches or equivalent organization for at least application errors, authentication/authorization events and one dependency/worker category.",
            "Define and apply retention, access-control and redaction rules. Prove that active tokens, passwords and secret material do not enter the centralized log path.",
            "Stop or isolate the Graylog/log-shipping path and prove that Steward continues serving requests according to its intended degradation model while log-loss/buffering risk is observable.",
            "Deploy Prometheus and configure it to scrape Steward application metrics plus at least two supporting targets/exporters relevant to the current topology.",
            "Instrument or expose Steward request rate, failures and latency with controlled labels, and add at least one dependency or domain-relevant metric.",
            "Write and validate PromQL for request rate, error ratio and latency distribution against known generated traffic or failures.",
            "Deploy Grafana and connect Prometheus as a data source.",
            "Build a Steward operational dashboard that starts with user-visible service symptoms—traffic, errors, latency and saturation—and includes supporting dependency/platform evidence needed for first-pass diagnosis.",
            "Where technically appropriate, add navigation or correlation hints between Grafana panels and Graylog searches without turning Graylog into a second metrics backend or Grafana into the authoritative log-management system.",
            "Document capability ownership explicitly: Graylog owns centralized log ingestion/search/retention; Prometheus owns metric time series and PromQL evaluation; Grafana owns metrics-oriented dashboards/exploration."
          ],
          deliverables: [
            "Running Graylog deployment and topology record",
            "Centralized log ingestion from Steward plus at least two supporting sources",
            "Graylog parsing/stream/search evidence",
            "Retention, redaction and access-control evidence",
            "Graylog/log-shipping failure experiment",
            "Running Prometheus deployment and target inventory",
            "Steward application/dependency metrics and validated PromQL",
            "Running Grafana deployment connected to Prometheus",
            "Steward operational dashboard",
            "Observability capability-ownership map"
          ],
          completionCriteria: [
            "Graylog is actually deployed and receives searchable logs from the Steward API and at least two additional sources.",
            "Prometheus is actually deployed and scrapes Steward plus supporting targets.",
            "Grafana is actually deployed and uses Prometheus data to answer defined reliability questions.",
            "The learner can trace one request or incident through centralized logs using correlation/context fields.",
            "The learner can detect a service symptom in Prometheus/Grafana and use Graylog for event-level investigation.",
            "Sensitive values are excluded or redacted before becoming centralized operational data.",
            "Failure of centralized logging does not silently become total Steward failure.",
            "Graylog and Prometheus/Grafana have distinct documented responsibilities rather than duplicating the same capability."
          ]
        }
      },
      {
        id: "reliability-observability-stack-integration-002",
        title: "Run a Cross-Signal Incident Investigation",
        estimatedMinutes: 180,
        content: {
          type: "practical",
          objective: "Use Prometheus/Grafana and Graylog together to detect and diagnose one realistic Steward incident.",
          scenario: "A user-visible Steward operation becomes slow or fails. The reliability workflow should begin from a symptom and move toward event-level evidence without manually inspecting every host or container.",
          instructions: [
            "Choose one bounded failure such as RabbitMQ consumer backlog/failure, PostgreSQL latency, Redis degradation, Kong routing error or a controlled API exception.",
            "Capture the healthy baseline in Grafana and Graylog before introducing the condition.",
            "Introduce the failure with explicit blast-radius and recovery controls.",
            "Use Prometheus/Grafana first to identify the timing, user-visible symptom and affected service/dependency indicators.",
            "Use Graylog next to query the relevant time window, service/component and correlation/request context and reconstruct the event sequence.",
            "Record which facts were easier to discover from metrics and which required logs.",
            "Recover the system and verify both metric recovery and cessation/resolution of the relevant log errors.",
            "Identify one missing field, metric or dashboard link that slowed diagnosis and improve the observability implementation."
          ],
          deliverables: [
            "Incident charter and baseline",
            "Grafana/Prometheus detection evidence",
            "Graylog investigation queries and correlated event evidence",
            "Incident timeline",
            "Recovery evidence",
            "Observability improvement applied after the exercise"
          ],
          completionCriteria: [
            "The incident is detected from metrics rather than from prior knowledge of the injected failure.",
            "Graylog evidence explains event-level behavior that the metric signal alone cannot provide.",
            "The investigation uses correlation, component and time context instead of manually browsing raw log files.",
            "Recovery is visible in both metrics and logs.",
            "At least one observability gap discovered during the exercise is corrected."
          ]
        }
      },
      {
        id: "reliability-observability-stack-integration-003",
        title: "Defend the Observability Architecture",
        estimatedMinutes: 30,
        content: {
          type: "reflection",
          prompt: "1. What responsibility belongs uniquely to Graylog in the current Steward stack?\n2. What responsibility belongs to Prometheus that Graylog should not replace?\n3. Why is Grafana still required when Graylog has its own dashboards/search UI?\n4. Describe one incident where Grafana/Prometheus tells you that something is wrong but Graylog is needed to explain what happened.\n5. What would be redundant about deploying Loki or a second ELK/OpenSearch logging path beside Graylog without a migration requirement?\n6. Which retention, redaction and access decisions are now part of operating Graylog?\n7. What evidence would justify replacing Graylog later, and how would you migrate without running two permanent logging stacks?",
          minimumCharacters: 500
        }
      }
    ]
  }
];
