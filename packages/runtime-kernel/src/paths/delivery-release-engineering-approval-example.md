# Meaningful approval example

Weak approval:

> CI is green. Approve?

Stronger contextual approval:

> Candidate `1.4.0-rc.2` passed required technical checks. It changes Steward lifecycle validation and includes migration `0044`. UAT evidence confirms existing service records remain valid. The migration is compatible with the documented application rollback path. Approve this exact candidate for the homelab production target?

The second approval identifies the candidate and the judgment being requested. It does not ask a human to manually re-check deterministic pipeline status.
