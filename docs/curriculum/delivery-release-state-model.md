# Steward Release State Model

Release Engineering uses distinct states so that a green pipeline, approved release and healthy runtime are never treated as synonyms.

```text
source revision
      │
      │ CI verification + build
      ▼
immutable build artifacts
      │
      │ candidate criteria satisfied
      ▼
release candidate
      │
      │ technical / migration / acceptance gates
      ▼
approved release
      │
      │ automated deployment
      ▼
deployment executed
      │
      │ runtime + client verification
      ▼
verified runtime
```

## Source revision

A commit identifies source content. It is not itself a deployable release.

## Immutable build artifacts

CI outputs such as `steward-common` distributions and the Steward OCI image. These must be traceable to the source revision and stored through the approved artifact path.

## Release candidate

A specific set of immutable artifacts plus recorded configuration/migration assumptions being evaluated for release.

## Approved release

A candidate that has satisfied the gates required for a target environment. Approval changes authorization/state, not artifact bytes.

## Deployment executed

Automation reports that the requested deployment actions completed. This still does not prove healthy user-visible behavior.

## Verified runtime

Observed runtime identity matches the approved release and defined post-deployment checks succeed from the relevant service/client perspective.

## Failure transitions

A failed gate returns the work to a new candidate or corrected release decision; it must not be bypassed by relabeling the same evidence.

A failed deployment or verification may result in stop, rollback or forward recovery depending on state already changed and compatibility with the known-good release.
