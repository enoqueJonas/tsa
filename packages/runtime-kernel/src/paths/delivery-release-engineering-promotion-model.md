# Steward release promotion model

Suggested conceptual states:

```text
source revision
  ↓ CI produces and verifies
immutable candidate
  ↓ technical gate
verified candidate
  ↓ acceptance/risk decision
approved release
  ↓ deployment automation
runtime deployment
  ↓ post-deploy evidence
verified runtime
```

A rejected candidate remains traceable but does not become an approved release. A deployment that completed but failed runtime verification is not a successful release merely because the deployment job was green.

The same application artifact should cross promotion boundaries. Environment configuration may vary intentionally; application bytes should not be rebuilt between gates.
