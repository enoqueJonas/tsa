# Multimedia Learning Resource — Final Cross-school Quality Audit

**Status:** complete  
**Scope:** all 12 TSA schools, the shared multimedia matrix, and the completed per-school audit branches.

## Executive conclusion

The multimedia strategy is aligned with TSA's evidence-first, Microverse-style learning model: media is supporting material, not the curriculum itself. Labs, milestones, reviews, architecture decisions, operational drills and the Professional Engineer capstone remain dominated by direct evidence.

The audit did identify one repository-structure defect: the school audit branches were not a single linear chain, so the Professional Engineer branch contained older placeholder-heavy copies of several earlier school sections. The branch `curriculum/multimedia-final-quality-audit` now consolidates the completed Delivery Engineer through Professional Engineer school audits into one working branch. Historical sections remain in the append-only audit file and must not be interpreted as the latest decision when a later `complete school multimedia audit` section exists.

## Quality checks performed

- Verified all 12 school areas are represented in the audit history.
- Checked classification vocabulary: `RECOMMENDED VIDEO`, `OPTIONAL VIDEO`, and `NO VIDEO`.
- Checked completed-school rows for malformed classifications.
- Compared media density against the hands-on/evidence requirements of each school.
- Reviewed repeated-resource behavior for intentional reuse versus unnecessary duplication.
- Checked that higher schools progressively reduce tutorial dependence.
- Checked that milestones, operational drills, reviews and defences are not replaced by passive media.
- Checked authoritative-source preference and cross-school reuse.
- Checked branch lineage and whether the final branch actually contained the latest school decisions.

## Consolidated completed-school snapshot

| School | Rows | Recommended | Optional | No video | Recommended with no promoted candidate |
| --- | ---: | ---: | ---: | ---: | ---: |
| Delivery Engineer | 105 | 49 | 21 | 35 | 5 |
| Cloud Engineer | 99 | 63 | 9 | 27 | 6 |
| Quality Steward | 106 | 57 | 5 | 44 | 8 |
| Security Steward | 129 | 76 | 3 | 50 | 1 |
| Reliability Engineer | 153 | 82 | 1 | 70 | 2 |
| Architect | 112 | 45 | 18 | 49 | 0 |
| Technical Steward | 100 | 22 | 33 | 45 | 0 |
| Professional Engineer | 69 | 0 | 2 | 67 | 0 |

A recommended row without a promoted candidate is not automatically a defect. In the completed audits these are explicit gaps where a visual resource would add value but no candidate met the quality bar. A weak video must not be promoted merely to eliminate a blank.

## Progression assessment

### Early schools

Engineering Apprentice and Builder may use concise visual explanation to reduce initial cognitive load, but implementation and review remain primary.

### System and platform schools

System Thinker and Platform Builder legitimately carry more visual material because protocols, operating-system behavior, networks, virtualization, storage and enterprise service topology are often easier to understand through diagrams or demonstrations. Media should still precede or support a lab, not replace one.

### Delivery through Reliability

These schools have the highest legitimate media density because they introduce many operational systems and cross-cutting mechanisms. Reuse is preferred when the concept is already taught: Docker, Jenkins, Ansible, identity, TLS, pytest/Playwright, Prometheus and SRE concepts should not receive a second introductory tutorial simply because another school touches them.

### Architect and Technical Steward

Tutorial dependence correctly falls. Media is useful mainly for visual architecture patterns, framework orientation and observed review/leadership examples. Decisions, trade-offs, governance, exceptions, risk acceptance and reviews remain evidence work.

### Professional Engineer

The final capstone correctly contains no recommended video. Its 67/69 `NO VIDEO` decisions are a feature, not a coverage gap: the learner must retrieve prior knowledge, identify genuine gaps, and independently discover, design, build, operate and defend a new system.

## Duplicate and reuse policy

Resource reuse is acceptable when it demonstrates deliberate spiral learning: a concept is introduced once and later applied under a new constraint. Do not assign the same introductory media again by default. Later lessons should link back as an optional refresh and focus on the new engineering decision.

Repeated media becomes a defect when it adds no new lens, delays hands-on work, or makes a later school feel like a replay of an earlier one.

## Source-quality policy

Promotion priority remains:

1. canonical project or standards-body material;
2. first-party vendor engineering documentation/demonstrations;
3. established engineering organizations and recognized practitioners;
4. strong independent educational material only when it explains the concept materially better.

A recommendation may intentionally remain without a candidate. `No candidate promoted` means the quality bar won, not that the audit is unfinished.

## Repository-structure finding and closure

The multimedia audit file evolved as an append-only working log. This preserved decisions but created repeated historical school sections, and parallel school branches meant later branches did not automatically contain every completed predecessor.

For this reason:

- `curriculum/multimedia-final-quality-audit` is the consolidation branch for this audit cycle.
- A heading ending in `complete school multimedia audit` is authoritative over an older generic `lesson audit` heading for the same school.
- Historical rows should be retained only as audit history until a future documentation-cleanup pass moves them to an archive.
- Future multimedia changes should branch from the consolidation branch (or its eventual merged successor), not from an individual school branch.

## Closure criteria

This audit cycle is closed when:

- all school classifications use the controlled vocabulary;
- completed school sections are present on the consolidation branch;
- no recommended candidate is promoted merely to fill a slot;
- labs and milestones remain evidence-first;
- cross-school reuse is intentional and labeled as reuse/refresh;
- Professional Engineer remains an independent transfer-and-defence capstone;
- future multimedia maintenance starts from the consolidated lineage.

## Maintenance rule

Do not restart broad multimedia expansion after this audit. Change the matrix only when learner evidence shows a comprehension problem, a linked resource becomes unavailable or materially outdated, the live curriculum changes, or a clearly superior authoritative resource appears.
