# Release Engineering review rubric

A reviewer should reject the module lab evidence if any of these are true:

- the production-target artifact was rebuilt after candidate verification;
- only a mutable tag identifies the deployed image;
- pipeline success is presented as proof of application health;
- release approval cannot be tied to a specific candidate;
- rollback means 'rebuild an old commit and hope';
- database/migration compatibility is ignored;
- the runbook lists commands without expected state, stop conditions or verification;
- the learner cannot distinguish candidate, approved release, deployment and healthy runtime;
- the process still depends on undocumented personal knowledge.

Passing evidence is concise but traceable, repeatable and explicit about remaining limitations.
