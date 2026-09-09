# Interpreting release evidence

Suppose you have:

- Git commit `abc123`;
- CI run `500` passed;
- Nexus image digest `sha256:AAA`;
- production deployment job `900` succeeded;
- running container reports `sha256:BBB`.

The release is **not** proven correct. The deployment evidence reveals that the runtime does not match the candidate artifact. Investigate before claiming success, even if `/health` happens to return 200.

This exercise reinforces a central module rule: evidence should be compared, not merely collected.
