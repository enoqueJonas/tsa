# Release Engineering evidence model

A Steward release record should be able to link:

1. source revision;
2. CI execution and required checks;
3. internal package version/hash;
4. OCI image tag and immutable digest in Nexus;
5. release-candidate version;
6. migrations/configuration assumptions;
7. promotion/approval decision;
8. target environment;
9. deployment execution;
10. observed running artifact identity;
11. health and representative client verification;
12. rollback or forward-recovery outcome when applicable.

The record is evidence of a release transition. It is not a substitute for the continuous telemetry that Reliability Engineer adds later.
