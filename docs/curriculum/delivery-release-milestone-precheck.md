# Delivery Engineer Milestone — Release Precheck

Before entering the Delivery Engineer milestone, verify the release layer can consume the outputs of every earlier Delivery Engineer module.

## Software Delivery Foundations

- release/version meaning is defined;
- source-to-production lifecycle is understood.

## Automation and Shell

- recurring operator/developer commands have stable automation interfaces;
- failure is represented by meaningful exit status.

## Containers and Docker

- Steward application image is reproducible;
- persistent state is external to the application container.

## Continuous Integration

- reviewed source is checked automatically;
- image/build evidence is tied to the source revision.

## Continuous Delivery and Deployment

- deployment and rollback mechanisms exist;
- environment configuration is separated from artifact bytes.

## Configuration Management

- host/platform prerequisites can converge from declared configuration.

## Artifact, Dependency and Supply-Chain Management

- internal packages/images are distributed through Nexus;
- source-to-artifact provenance is recorded;
- last-known-good release artifacts can be retrieved.

## Release Engineering

- candidate, promotion, deployment, verification and recovery form one controlled process;
- a release runbook has been exercised;
- one controlled failed release has been recovered.

Do not begin the milestone by rebuilding all of these capabilities. The milestone exists to prove they compose into a working commit-to-deployment platform.
