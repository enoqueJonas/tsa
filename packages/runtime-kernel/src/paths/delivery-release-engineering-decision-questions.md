# Release decision questions

Before promotion:
- What exact candidate are we approving?
- What evidence makes it acceptable?
- What changed since the previous release?
- What state/configuration changes accompany it?
- What would make us stop before deployment?

After deployment:
- Is the intended immutable artifact actually running?
- Did required state transitions complete?
- Is the service healthy from the runtime perspective?
- Does a representative Steward user/API path work?
- If not, is rollback safe or is forward recovery required?

These questions should be answerable from the release record and runbook, not from memory.
