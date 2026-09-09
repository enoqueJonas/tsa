# Delivery Engineer — Release Engineering

Release Engineering turns Steward's existing CI, Nexus, configuration-management and deployment capabilities into one controlled release process.

## Learning outcomes

A learner completing this module can:

- distinguish source revision, build artifact, release candidate, approved release, deployment execution and verified runtime;
- preserve immutable artifact identity from CI through promotion and deployment;
- design promotion gates around explicit risk questions and evidence;
- produce source-to-runtime deployment evidence;
- verify a release from the runtime and client perspective rather than trusting pipeline completion;
- choose rollback, stop or forward recovery based on actual state compatibility;
- write and exercise a release runbook another engineer can follow.

## Lessons

1. Release Candidates
2. Promotion and Gates
3. Deployment Evidence
4. Release Observability
5. Release Failure Handling
6. Release Runbooks
7. Lab: Execute a Steward Release
8. Release Engineering Review

## Steward continuity

The module must reuse the delivery platform already built in earlier modules. The release candidate is an exact Steward artifact already produced by CI and stored in Nexus. Promotion must not rebuild it. Configuration may vary by environment, but application artifact identity must remain traceable.

The lab requires one successful release and one safe, controlled failed release. Evidence must connect source commit, CI run, internal package identity, OCI digest, gate decisions, deployment, runtime identity and client verification.

## Curriculum boundary

Release Engineering needs enough runtime evidence to decide whether a deployment is acceptable. It does not prematurely implement the full metrics, dashboards, SLOs and alerting program reserved for Reliability Engineer.

Likewise, signing/key management and stronger supply-chain enforcement remain Security Steward concerns. This module consumes the provenance and artifact identity established by Artifact, Dependency and Supply-Chain Management.

## Exit standard

The learner should be able to answer this without relying on personal memory:

> If you were absent for the next Steward release, could another engineer identify the candidate, decide whether it is promotable, deploy the exact approved artifact, verify it and recover from failure using only repository, pipeline, Nexus and runbook evidence?
