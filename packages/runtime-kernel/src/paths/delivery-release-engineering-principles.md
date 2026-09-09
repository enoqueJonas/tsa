# Release Engineering principles

1. Build once; evaluate and promote that build.
2. Prefer immutable identities over mutable labels.
3. Separate source, candidate, release, deployment and runtime state.
4. Every gate answers a risk question.
5. Pipeline completion is not runtime verification.
6. Plan failure handling before the release starts.
7. Rollback depends on state compatibility, not only an old image.
8. Retain a retrievable last-known-good artifact.
9. Runbooks describe state, decisions and verification, not only commands.
10. Release evidence should make the process transferable to another engineer.
