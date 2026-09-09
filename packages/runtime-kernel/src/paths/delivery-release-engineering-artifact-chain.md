# Steward release artifact chain

```text
Git commit
   ↓
CI verification
   ↓
steward-common distribution + Steward OCI image
   ↓
Nexus immutable identities
   ↓
release candidate record
   ↓
promotion / approval gates
   ↓
deployment automation
   ↓
running OCI digest + migration/config state
   ↓
health + representative Steward behavior
   ↓
verified runtime / rollback / forward recovery
```

At review time, the learner should be able to move both forward and backward through this chain using evidence.
