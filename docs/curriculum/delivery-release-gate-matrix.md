# Steward Promotion Gate Matrix

Use gates only when they answer a real release risk.

| Gate | Question | Typical evidence | Automation or judgment? | Failure action |
| --- | --- | --- | --- | --- |
| Source verification | Did the reviewed revision pass the required checks? | CI run + commit | Automated | Do not create/promote candidate |
| Artifact identity | Are the exact packages/images stored and traceable? | Nexus coordinates, hashes, OCI digest | Automated | Stop promotion |
| Migration compatibility | Is the planned schema/data transition understood and compatible with recovery? | Migration review + tested path | Mixed | Stop until resolved |
| Environment readiness | Are required target configuration/dependencies available? | Configuration validation | Mostly automated | Do not deploy |
| Acceptance | Has required behavior been accepted for this release? | UAT/acceptance evidence | Human judgment where genuinely required | Do not authorize target |
| Production authorization | Is this exact candidate approved for this target now? | Approval record tied to digest/version | Human or policy-driven | Do not deploy |
| Post-deployment verification | Is the approved candidate actually serving correctly? | Runtime identity + health + client checks | Automated where practical | Stop, rollback or recover |

## Review rule

For each gate ask:

1. What risk does this gate control?
2. What evidence answers that question?
3. Can the condition be deterministic and automated?
4. If human approval is required, what judgment is the human actually making?
5. What happens when the gate fails?

If those questions have no useful answers, the gate is probably ceremony.
