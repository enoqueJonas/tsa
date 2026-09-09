# Release observability boundary

Release Engineering needs enough observation to decide whether a change should remain deployed.

Minimum useful evidence:
- deployment timestamp;
- running release/artifact identity;
- runtime health;
- dependency reachability relevant to startup/operation;
- representative Steward behavior;
- immediately available error evidence.

Reliability Engineer later turns this into continuous operational capability through metrics, structured logs, traces, dashboards, SLOs and alerts. Release Engineering should not pre-install that entire stack.
