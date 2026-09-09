# Release Engineering Peer Review

Have another engineer review the release system before the final module exit.

Ask the reviewer to locate, without verbal hints:

1. the source commit for a chosen Steward candidate;
2. the CI run that produced it;
3. the exact `steward-common` and OCI artifacts in Nexus;
4. the gates required for promotion;
5. the deployment entry point;
6. the expected post-deployment checks;
7. the last-known-good release;
8. the condition under which rollback would be unsafe;
9. the release record after a successful deployment;
10. the controlled failure/recovery evidence.

## Record friction

For every question the reviewer cannot answer from repository/platform evidence, record whether the missing information is:

- documentation;
- automation;
- artifact identity;
- access/ownership;
- runtime evidence;
- recovery evidence.

Repair high-impact gaps before the Delivery Engineer milestone. Do not solve every future operational concern here; explicitly hand later reliability/security concerns to their schools.
