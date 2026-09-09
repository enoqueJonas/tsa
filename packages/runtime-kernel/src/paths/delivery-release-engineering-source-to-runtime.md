# Source-to-runtime trace exercise

Pick the currently running Steward release and trace backward:

1. running container/image digest;
2. Nexus repository artifact;
3. release candidate record;
4. approval/promotion evidence;
5. CI run;
6. source commit;
7. internal package identities used by the build.

Then trace forward from the same source commit and confirm you arrive at the same runtime identity.

Any gap, mutable pointer or undocumented manual replacement is a delivery risk to carry into the milestone.
