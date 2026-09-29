# Technical Steward — Learning Resource Audit

Status: complete module-level resource audit

## Goal

Technical Steward resources must improve organizational technology judgment without turning the school into framework memorization. Frameworks are used where their concepts fit; they are not the curriculum structure.

## Selection rules

1. Prefer primary/authoritative governance, risk, assurance and engineering sources.
2. Route frameworks narrowly by lesson.
3. Reuse earlier-school technical evidence instead of linking implementation tutorials again.
4. Distinguish governance frameworks from service-management, risk, control and security frameworks.
5. Keep resources small enough that the learner knows why each one is present.

## Completed targeting

### Technical Leadership
- ownership/influence/mentoring → SRE engagement material
- decisions/reviews/communication → ADR discipline
- escalation/responsible challenge → SRE learning/postmortem culture

### Engineering Governance
- governance vs management/accountability → ISO/IEC 38500
- broader governance mechanisms → COBIT
- exceptions/lightweight durable decisions → ADRs

### IT and Technology Governance
- alignment/value/resources/performance → COBIT
- governance structures → ISO 38500 + COBIT
- COBIT lesson → COBIT
- ITIL lesson → ITIL
- ISO management systems lesson → ISO MSS
- NIST landscape lesson → NIST CSF
Frameworks are deliberately not bundled into every lesson.

### Technology Strategy and Capability Planning
This newly added module already carries lesson-specific ISO 38500, COBIT, Technology Radar and Team Topologies references.

### Technology Risk
- assessment/likelihood/impact → NIST SP 800-30
- inherent/residual and treatment context → NIST RMF
- appetite/tolerance/treatment/ownership → ISO 31000

### Controls, Compliance and Assurance
- control objectives/design → NIST SP 800-53
- control assessment/effectiveness/evidence/testing → NIST SP 800-53A
- audit fundamentals/findings → auditing standards + control assessment

### Architecture Governance
- decisions/exceptions/ownership → ADRs
- reviews/context/principles → SEI ATAM
- standards/selection/lifecycle → Technology Radar + ADR discipline

### Security and Data Governance
- security governance/roles/policy → NIST CSF
- data ownership/classification/retention/privacy → NIST Privacy Framework
- access governance → NIST SP 800-207 + CSF

### Change and Service Governance
- change/service concepts → ITIL
- release/operational readiness → Google SRE launch guidance
- incident/problem/change relationship and emergency change → ITIL + SRE incident material

### Third-party and Technology Lifecycle Risk
- vendor/dependency/cloud/EOL/continuity → NIST SP 800-161
- internal software/package lifecycle → NIST SSDF
- provenance/SBOM → SSDF + CISA SBOM
- version-support semantics → Semantic Versioning

### Technical Debt and Engineering Health
- debt meaning/prioritization → Martin Fowler technical debt
- engineering-health evidence → DORA research
- sustainable toil/remediation trade-offs → Google SRE toil material

### Engineering Handbook and Standards
- docs/standards/knowledge lifecycle → Docs as Code
- runbooks → Google SRE on-call material
- decision records/exceptions → ADRs
- versioned standards → Semantic Versioning + docs-as-code practices

## Important framework boundary

The curriculum does **not** teach:

```text
COBIT + ITIL + ISO + NIST = governance
```

Instead:

```text
organizational question
        ↓
appropriate concept
        ↓
relevant framework/reference
        ↓
Steward decision + evidence
```

Framework names are secondary to the decision capability.

## Regression checks

- Is the resource relevant to the exact governance question?
- Is a framework being linked merely because it is famous?
- Does the lesson consume technical evidence instead of re-teaching implementation?
- Are governance and management kept distinct?
- Does risk material avoid false numerical precision?
- Does assurance distinguish control design from operating effectiveness?
- Does change governance remain proportionate to risk?
- Does lifecycle material include exit/EOL/provenance rather than only vulnerabilities?
- Does engineering-health material connect to outcomes rather than aesthetic cleanup?
- Can the learner explain why a framework/reference is used and where it stops applying?
- Is repository-wide Jenkins search still clean?
