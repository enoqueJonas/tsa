# Release Engineering Review Questions

Use these questions for self-review, peer review or instructor review.

1. What makes a Steward build a release candidate rather than merely a CI output?
2. Why must promotion reuse the exact artifact already evaluated?
3. What information does an OCI digest provide that a tag alone does not?
4. Give one useful automated gate and state the risk question it answers.
5. Give one situation where a human approval is justified and one where it is ceremony.
6. Why does successful deployment automation not prove a successful release?
7. What client-level evidence would you use to verify Steward after deployment?
8. How would you trace a running Steward container back to the source revision that produced it?
9. When can starting the previous image be an unsafe rollback?
10. What is the difference between rollback and forward recovery?
11. Why should the last-known-good artifact remain retrievable from Nexus?
12. What makes a release runbook useful to an engineer who did not write it?
13. Which release evidence should be machine-generated where practical?
14. Which release-observation concerns belong here, and which should wait for Reliability Engineer?
15. Identify the weakest remaining manual or trust-dependent transition in your current Steward release path.
