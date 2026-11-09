/** Original CD author-source teaching sections; every example is a disposable training fixture. */
export interface DeliveryCDLessonSection {heading:string;paragraphs:string[];}
export const cdLearnerMechanisms:Record<string,{sections:DeliveryCDLessonSection[];resource:{title:string;url:string}}> = {
  "database-migrations": {
    "sections": [
      {
        "heading": "A schema version is shared mutable state, not a private application implementation",
        "paragraphs": [
          "A database is a persistent shared dependency: API, worker, publisher and consumer processes can read it while application versions A and B coexist during a rollout. A migration changes its contract. The compatibility question is not merely whether the new code passes tests, but whether the old and new readers/writers can safely coexist with the schema and existing rows. In the fictional Steward schema, adding a nullable `audit_note` or a column with a safe default is often an expand step; removing `status` while the old consumer still reads it is a contract step that can break that process immediately. A migration record showing `applied` is insufficient evidence that every active application role still functions.",
          "Test the actual reader SQL (or ORM operations) for both versions before and after a disposable expansion, and verify one relevant write plus a read by the other version. Document the version compatibility matrix: old app + old schema, old app + expanded schema, new app + expanded schema and new app + contracted schema. At each transition record current storage, data backfill and deployment order. Never use fabricated 'production data' to justify a destructive change."
        ]
      },
      {
        "heading": "Expand, migrate data, switch consumers, then contract",
        "paragraphs": [
          "In an expand-and-contract change, introduce the new representation without removing the old contract. Backfill real existing rows in batches with repeatable checkpoints, compare old/new read outcomes, and move all consumers before dropping a column. A backfill is not only an SQL statement: it has load, locking, retry, idempotency and partial-failure implications, which differ in PostgreSQL from a local SQLite fixture. A failing uniqueness check during backfill must stop contraction rather than delete the contradictory record to force green.",
          "A migration might be wrapped in a transaction, depending on backend and operation; do not assume every DDL change is reversible or that a failed deployment can restore deleted data. Explicitly identify the point of no return, backup/restore requirements, and the owner authorized to perform contraction. A happy-path ORM command by itself does not establish concurrent reader safety or acceptable lock duration."
        ]
      },
      {
        "heading": "Prove compatibility with a small executable falsifier",
        "paragraphs": [
          "Run the published disposable SQLite example that creates old rows, expands the schema, demonstrates old and new reads, then deliberately drops a column used by the old reader. That final old-read failure is intentional evidence of contract incompatibility. The code never connects to production PostgreSQL or a Steward database. Compare its observed outcomes to a separate PostgreSQL plan requiring real schema migrations, lock monitoring, a backup, durable data comparison and all worker versions exercised.",
          "A safe production progression needs explicit technical evidence before promotion. If the new API is healthy while the old lifecycle consumer is incompatible, the release is not operationally complete. The exercise should name one stop condition, a reversible application-only action before contraction and a forward-fix or state-restoration path after destructive contraction."
        ]
      }
    ],
    "resource": {
      "title": "Django migration operations and data migrations",
      "url": "https://docs.djangoproject.com/en/5.2/topics/migrations/"
    }
  },
  "rollback": {
    "sections": [
      {
        "heading": "Define exactly which state can be restored",
        "paragraphs": [
          "Rollback is often described as 'start the old image', but the running service also depends on deployed configuration, database schema/data, shared queues and externally emitted events. Restoring an image digest reverses executable code only. It cannot undo a destructive migration, a payment/notification already sent or a business decision made in the new release. For a fictional Steward change, API, publisher and consumer may each run image B; changing only the API back to A can leave an incompatible consumer producing events that A cannot interpret.",
          "Before promotion, record the last-known-good image digest, state compatibility with A, the current worker and message formats, the operator, the rollback stop time and the exact user journey to verify after recovery. When evidence is missing, report NOT_PROVEN instead of assuming a command that exits zero restored service."
        ]
      },
      {
        "heading": "Separate a safe revert from a forward repair",
        "paragraphs": [
          "For a backward-compatible schema expansion with no irreversible external effects, an authorized operator can often route traffic back to A while diagnosing B. The operator still has to confirm the original application behavior, durable state, API and worker versions. For a removed column or a shipped irreversible event, redeploying A can make the incident worse: contain traffic, assess affected data, stop further harmful work and use a planned forward fix or restore according to actual backups and risk authority.",
          "An RTO is a measured elapsed restoration duration, not the timestamp when the rollback command started. A recoverability claim needs before/after observations from a real authorized environment, not source-level reasoning. Explicitly distinguish a local decision oracle, a successful integration rehearsal and an independently witnessed service recovery."
        ]
      },
      {
        "heading": "Read a stop decision before a command",
        "paragraphs": [
          "Use the published release decision program to distinguish a candidate whose exact digest is known and whose previous schema works from one whose past data/effects are incompatible. It deliberately rejects a fail-open implementation that checks only 'the old tag exists'. A proposed rollback that is NOT_PROVEN is not 'best effort success': the operator must first find the missing schema compatibility, effect ledger or authorization evidence.",
          "Independent transfer: after a failed upgrade, the reviewer states that B already emitted a one-way change to another service. Explain why switching the API route alone cannot restore correctness and identify which event consumers, idempotency keys and compensating business process must be considered. If the real system has never performed this rehearsal, label its recovery capability NOT_TESTED."
        ]
      }
    ],
    "resource": {
      "title": "Docker container/image identity and lifecycle",
      "url": "https://docs.docker.com/reference/cli/docker/container/run/"
    }
  },
  "blue-green": {
    "sections": [
      {
        "heading": "Two environments reduce switch-over risk, not shared-state risk",
        "paragraphs": [
          "A blue-green rollout maintains separately addressable runtime targets, with production traffic initially routed to A and candidate B reachable directly for verification. The routing layer is the *promotion mechanism*: simply launching B does not make it production. A should remain usable during a bounded verification interval so the operator has a known destination for a reverse switch. The two sides can share a database, events and external services, so a traffic reversal is not an automatic data rollback.",
          "Before changing the active route, inspect candidate B's exact image identity and target-specific configuration, the actual authenticated business journey, storage compatibility and any required resource thresholds. A 200 from a generic HTTP listener is a weak readiness criterion: B may serve a banner correctly while its ownership-update path fails. Demonstrate a negative smoke result and require the route to remain on A."
        ]
      },
      {
        "heading": "A real disposable local traffic-switch rehearsal",
        "paragraphs": [
          "Run the actual source-published Bash example in an empty temporary workspace on a machine with Docker, curl and Linux-like shell tools. It builds two tiny BusyBox HTTP images, starts each on a dynamically allocated port bound explicitly to 127.0.0.1, inspects the distinct local image identities and probes both direct endpoints. A serves a healthy response; B deliberately serves a broken business marker despite HTTP 200. The gate must refuse to change the chosen client route to B. This tests executable images and HTTP responses, not a production reverse proxy, GitLab deployment job, registry digest, live database or real Steward release.",
          "The local route is a variable describing which loopback endpoint the test client calls; it is NOT a system-wide DNS/proxy change. The example tears down only its own two containers and images. A separate CI source test executes the program and mutates the readiness decision; the wrong implementation must fail the route-safety assertion even though both containers run and curl returns HTTP 200."
        ]
      },
      {
        "heading": "Identify the exact deployment and capacity preconditions",
        "paragraphs": [
          "Blue-green doubles some runtime capacity during overlap and needs two independently reachable targets, compatible shared persistent state, correct routing and an operator able to observe/cancel promotion. A single-host Docker exercise cannot prove multi-host high availability: the host, daemon or shared database can still fail both colors at once. Write the minimum network, identity, capacity, service dependencies and rollback conditions for a real homelab before considering this pattern.",
          "For the independent exercise, describe a case where a schema contraction happens before traffic shifts. Explain why keeping A's container warm does not save users: it may no longer read the same database. Contrast this with an application-only route failure and show which operational procedure would be justified."
        ]
      }
    ],
    "resource": {
      "title": "Docker loopback port publishing and container run",
      "url": "https://docs.docker.com/reference/cli/docker/container/run/"
    }
  },
  "canary": {
    "sections": [
      {
        "heading": "Partial traffic is an experiment with exposure and stopping rules",
        "paragraphs": [
          "A canary directs a bounded portion of requests or users to B while A continues serving the rest. The proposed benefit is narrower blast radius and earlier real user evidence; it only works if the groups, route, instrumentation and rollback are trustworthy. Define before exposure which critical user journey, latency, errors and durable side effects matter; health-only errors miss silently incorrect business state. A simple '5%' does not determine statistical confidence.",
          "Traffic mixes can confound the comparison: the first ten B requests might be harmless read-only routes while A handles difficult writes. Compare like-for-like behavior or stratify by endpoint/user segment. A tiny sample with zero failures cannot prove the new error rate; report insufficient evidence rather than manufacture a safe confidence threshold."
        ]
      },
      {
        "heading": "Build an observable decision that resists false confidence",
        "paragraphs": [
          "The published Python gate is an explicit teaching heuristic, not a statistical certification. It requires a minimum sample, a nonempty critical write sample, failure counts and no critical invariant violations. It rejects zero failures from ten requests and flags any observed ownership violation regardless of sample size. The heuristic threshold is fictional and must be justified afresh from business risk, request rate and confidence requirements; an actual service-level objective uses a proper observation window and statistical reasoning.",
          "Run positive and negative fixtures, then introduce the mutant that simply labels any zero-failure sample safe. The learner must explain exactly how the same ten requests can come from a faulty system with rare failures. If the homelab has almost no traffic, recommend a controlled synthetic rehearsal and mark production canary evidence NOT_TESTED."
        ]
      },
      {
        "heading": "Limit rollout scope and prove the off-ramp",
        "paragraphs": [
          "A useful canary experiment records who is exposed, duration, eligible user and feature types, a comparison baseline, telemetry ownership and a preauthorized reversal command. A failure needs observable STOP: reduce or stop B traffic, identify any unrolled data changes, and reconcile work that happened before the stop. Turning a route percentage back to zero does not undo external messages or committed database writes.",
          "Unseen transfer: a reviewer reports that the B group handles three times more writes than A despite both dashboards showing equal overall latency. Explain why an average across unequal request types is not proof of improvement, and propose a matched experiment before widening the rollout."
        ]
      }
    ],
    "resource": {
      "title": "Google SRE workbook: implementing SLOs",
      "url": "https://sre.google/workbook/implementing-slos/"
    }
  },
  "feature-flags": {
    "sections": [
      {
        "heading": "Distinguish deployment, targeting and side-effect authorization",
        "paragraphs": [
          "A feature flag chooses which application behavior executes at runtime, often independently of which image version is installed. It can support a dark deployment, limited audience, or emergency kill switch. A flag is a piece of mutable operational policy: its owner, default, storage, refresh/caching semantics, permission and event logging matter. A flag default that silently flips to enabled when its configuration provider is unavailable could expose unfinished functionality.",
          "An authorization check is not a feature flag. Disabling a UI button cannot substitute for server-side permission to modify another tenant's record, and enabling a flag cannot override the domain invariant that two people cannot hold the same item simultaneously."
        ]
      },
      {
        "heading": "Disabling a flag does not reverse committed effects",
        "paragraphs": [
          "In a fictional ownership-summary feature, enabling the flag may emit a notification or write an audit event. If the resulting summary is wrong, disabling the flag can prevent *new* executions of the flagged branch, but the existing event remains durable. The published executable program demonstrates a before/after flag toggle and a persistently recorded event, then rejects a false implementation that claims turning off the flag automatically undoes that event.",
          "A flag that controls a destructive migration or non-idempotent asynchronous process is especially hazardous: even a swift kill switch may not preserve historical correctness. Define a containment plan, read-only inspection of already committed effects, appropriate compensation/reconciliation and the authorized person deciding which users may be affected."
        ]
      },
      {
        "heading": "Test the two states and the lifecycle of the flag",
        "paragraphs": [
          "A safe test matrix covers disabled and enabled behavior, failure of the flag provider, stale flag caches and mixed versions during a rolling release. Use a default-off fixture, test one legitimate enabled request, verify an unauthorized request is still denied, and show exactly which event remains after disabling. Document the flag's owner, expiry/removal criteria and a clear revalidation trigger.",
          "If every temporary flag stays in place, the number of potential behavior combinations grows quickly and some paths stop being exercised. Remove accepted flags and their old branches on an intentional schedule. Flag deletion itself may be a compatibility change for old processes still reading the flag, so apply the same version-overlap discipline as deployment."
        ]
      }
    ],
    "resource": {
      "title": "Martin Fowler: Feature Toggles",
      "url": "https://martinfowler.com/articles/feature-toggles.html"
    }
  }
};
