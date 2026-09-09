# Common Release Engineering mistakes

- Calling a Git tag a release candidate without recording artifact identity.
- Rebuilding the application for each environment.
- Treating a green deployment job as proof the service works.
- Adding approval buttons without defining what the approver evaluates.
- Using `latest` as the only production image reference.
- Assuming every database migration can be rolled back by starting the old container.
- Deleting old release artifacts before checking deployment/rollback references.
- Writing runbooks that contain commands but no stop conditions.
- Capturing screenshots instead of durable source/artifact/runtime identifiers.
- Solving later Reliability/Security topics prematurely instead of preserving a clear handoff.
