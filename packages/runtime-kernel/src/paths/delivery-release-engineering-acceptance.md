# Release Engineering acceptance checklist

For the final release exercise, verify:

- [ ] candidate version recorded;
- [ ] source commit recorded;
- [ ] CI run recorded;
- [ ] internal package identity recorded where applicable;
- [ ] OCI digest recorded in Nexus;
- [ ] migration/config assumptions recorded;
- [ ] gates passed with evidence;
- [ ] target environment explicit;
- [ ] no application rebuild during promotion;
- [ ] running artifact identity verified;
- [ ] health verification passed;
- [ ] representative Steward behavior passed;
- [ ] controlled failure detected;
- [ ] recovery decision followed pre-defined criteria;
- [ ] acceptable final state verified;
- [ ] runbook and release record are usable by another engineer.
