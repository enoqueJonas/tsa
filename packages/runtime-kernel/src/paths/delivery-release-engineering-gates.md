# Release Engineering gate model

A gate is justified only when it answers a concrete release-risk question.

Examples for Steward:

| Gate | Question | Typical evidence |
| --- | --- | --- |
| Verification | Did this exact candidate satisfy the required technical checks? | CI run + artifact identity |
| Migration | Is the planned data transition compatible with the release/recovery strategy? | migration review/test evidence |
| Acceptance | Has the required stakeholder accepted the candidate behavior? | explicit approval linked to candidate |
| Production | Is this exact candidate authorized for this target now? | approval + target + release identity |
| Post-deploy | Is the intended artifact healthy and serving representative behavior? | runtime identity + health + client check |

Do not add a manual approval where deterministic automation can answer the question reliably.
