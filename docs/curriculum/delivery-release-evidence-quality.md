# Release Engineering Evidence Quality

Not all release evidence has equal strength.

## Stronger evidence

Prefer evidence produced directly by the systems involved:

- Git commit SHA;
- CI run identifier and stored test/build result;
- package hash;
- OCI digest from the repository/runtime;
- Nexus coordinates;
- deployment execution/log identifier;
- migration command/result;
- runtime version/digest observation;
- machine-executed health/client check result.

## Weaker evidence

Use with caution:

- manually typed version strings;
- screenshots when machine-readable output exists;
- mutable tags such as `latest`;
- a developer saying they ran the tests;
- intended configuration without runtime observation;
- a runbook checkbox without linked execution evidence.

## Principle

The goal is not to eliminate human judgment. It is to make factual claims—what source, what artifact, what environment, what result—independently verifiable so human judgment can focus on decisions rather than reconstructing facts.
