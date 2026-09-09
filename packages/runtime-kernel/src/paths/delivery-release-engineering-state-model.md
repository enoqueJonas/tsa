# Release state model

Do not collapse these states:

| State | Meaning |
| --- | --- |
| Validated source | source revision satisfied defined CI checks |
| Candidate | immutable built artifact set selected for evaluation |
| Approved release | candidate authorized under release policy |
| Deployed | automation placed/started release in target environment |
| Healthy runtime | runtime-level health evidence is acceptable |
| Verified runtime | representative application behavior also satisfies release checks |

A release can be deployed but not verified. A candidate can be technically valid but not approved. Source can pass CI without ever becoming a candidate.
