# Release Engineering Learner Checklist

Before starting the final release lab, confirm you can answer yes to the following.

- [ ] I can identify a Steward candidate by immutable artifact identity, not only a tag.
- [ ] I know which CI run and source commit produced it.
- [ ] I know which internal package versions belong to the release.
- [ ] I can retrieve the exact artifact from Nexus without rebuilding it.
- [ ] I know the migration and configuration assumptions for the release.
- [ ] I can explain every promotion gate and its risk question.
- [ ] I know the current last-known-good release and digest.
- [ ] I know whether the planned state changes remain compatible with rollback.
- [ ] I can trigger the existing automated deployment path.
- [ ] I can prove the artifact actually running after deployment.
- [ ] I can verify representative Steward behavior from a client perspective.
- [ ] I have explicit stop and recovery criteria.
- [ ] My runbook states expected results and stop conditions, not only commands.
- [ ] I know what evidence to preserve if the release fails.

If several answers are no, repair the release process before executing the lab rather than filling the gaps with undocumented manual work.
