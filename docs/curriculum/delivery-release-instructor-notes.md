# Release Engineering Instructor Notes

## Teaching intent

The learner already knows CI/CD mechanics before entering this module. Do not reteach pipeline syntax. The new capability is disciplined release reasoning across those mechanisms.

## Push on state distinctions

Repeatedly ask the learner to distinguish:

- source commit;
- CI output;
- release candidate;
- approved release;
- deployment execution;
- verified runtime.

If the learner uses these terms interchangeably, return to the release state model.

## Demand immutable evidence

Ask for actual hashes/digests and source/CI references. Friendly version labels are useful communication but weak proof by themselves.

## Challenge ceremonial gates

For each approval ask, “What decision is this person making that automation cannot?” If there is no answer, the learner should simplify the process.

## Make rollback reasoning concrete

Introduce a hypothetical backward-incompatible migration and ask whether deploying the previous image is still safe. The objective is not fear of migrations; it is explicit state compatibility reasoning.

## Keep the boundary clean

Do not require Prometheus, Grafana, distributed tracing or a full alerting stack here. Those belong later. Likewise, do not turn signing concepts into a key-management project before Security Steward.

## Review the failure drill carefully

The learner should choose a safe failure and predict detection/recovery before execution. A dramatic failure that destroys data teaches less than a controlled failure that validates the decision system.

## Milestone readiness

The module is ready to hand off only when release work composes the earlier CI, Nexus, Ansible and deployment capabilities. Reject a separate manual 'release demo' that bypasses the actual delivery platform.
