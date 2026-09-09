# Release review evidence guidance

Prefer compact references to authoritative evidence over giant pasted logs.

For example:

```text
candidate: steward-api 1.4.0-rc.2
source: <commit>
ci: <run-id>
image: <nexus-repository>@sha256:<digest>
approval: <review-record>
deploy: <run-id>
runtime: sha256:<same-digest>
verification: <health-result>, <representative-api-result>
```

Attach or link detailed logs only when they explain a failure or decision. The goal is auditability and reproducibility, not evidence volume.
