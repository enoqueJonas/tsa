# Curriculum code-output evidence: remaining source-level triage

The cross-school report (`pnpm report:curriculum-examples`) inspects code objects in the 196 runtime path files. It identified 407 source code records on the 2026-10-17 review. A candidate is **not automatically an instructional defect**: snippets can be declarative YAML, illustrations, or diagnostic commands whose genuine output depends on the learner's environment. Generated examples can also escape literal-source scanning.

The initial report flagged 32 code records for review. Worked, deterministic Python snippets, the Delivery Shell case and Docker persistence demonstration were corrected with executable inputs/output traces. The report now flags 16 contextual candidates, triaged below. These classifications are source-level decisions, not evidence of live learner execution.

| Module/source | Candidate(s) | Source-level disposition / verification required |
| --- | --- | --- |
| Builder Web/API | URL path/query diagram | Documentation-only URL examples, not a command; no stdout expected. |
| Builder Web/API | curl investigation templates | `example.test` is deliberately non-resolving. Lesson now explicitly requires replacing it with an authorized reachable API and recording actual status/headers/body. Do not invent one response. |
| Delivery Release Engineering | Docker inspect + health/authenticated curl | Host, image repository digest, token, status and API body are specific to the chosen release. Capture the real release's evidence; the learner must not copy an invented output. |
| Engineering Apprentice | Disposable shell directory listing | `ls -la` file metadata and timestamps vary. Learner must see two files and `cat` print the copied `first note`. |
| Engineering Apprentice | Diagnostic pwd/PATH/git commands | Location, PATH and Git version vary. Interpretation and exit status, not a fixed transcript, are the target. |
| Engineering Apprentice | Feature-branch creation and git log | Commit hash and author/time vary. Learner must prove the new branch and `docs: add runbook draft` commit exist. |
| Platform Builder Linux | Host inspection and Bash help | `pwd`, `ls`, `find /etc` and help output vary. Invalid `command --help` was replaced with working Bash `help command`. |
| Platform Builder Networking | Socket/transport diagnostics | Listen addresses and sockets depend on the host. Earlier shell angle placeholders were replaced with checked environment inputs. |
| Platform Builder Networking | DNS and endpoint comparison | Record expected name resolution and actual TCP/HTTP outcome; no universal result can be assumed. |
| Platform Builder Networking | Firewall and listener diagnostics | Rocky Linux `firewall-cmd`/nft commands replace the incompatible Ubuntu ufw example. Firewall state is deliberately environment-specific. |
| Platform Builder Networking | TLS/certificate diagnostics | Must select a real TLS-enabled hostname. Record certificate/SNI and connection outcome; cannot assume a fixed certificate or status. |
| Platform Builder Networking | Combined network diagnostic toolkit | Commands test different hypotheses. The lesson explicitly warns against interpreting one variable host transcript as universal success. |
| Platform Builder Virtualization | Guest IP/route/listener inspection | Guest addresses and listener state vary. Capture actual evidence from the Rocky guest. |
| Quality Containers/CI | GitLab CI foundational YAML | Declarative pipeline configuration, not shell output. Requires a real Runner pipeline result; a Maven runtime image is now shown. |
| Quality Containers/CI | GitLab stage/DAG YAML | Declarative pipeline configuration, not stdout. Corrected invalid nested `stages:` into GitLab top-level `stages:`. |
| Quality Containers/CI | Nexus package publish/consumer Maven sequence | Maven/Nexus output depends on a genuinely earned internal package or a clearly labeled fixture, repository access and credentials. The exercise now preserves that condition instead of fabricating release evidence. |

## Separate acceptance gates

- `pnpm check:python-examples` executes 12 curated, side-effect-free Python samples and verifies expected stdout.
- `pnpm check:java-examples` compiles and runs the Java constructor-injection example and verifies documented output.
- `pnpm audit:curriculum`, the code-evidence report and `pnpm build` run in GitHub Actions on each working-branch push.
- **Not yet proven:** every remaining dynamically composed lesson example, live network/container/Maven/Nexus outputs, all 134 modules' complete learner paths or browser-rendered navigation. Those require separate execution and visual review; static checks cannot replace them.
