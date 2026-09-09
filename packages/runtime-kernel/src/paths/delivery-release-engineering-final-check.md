# Pre-merge check

Before merge:

1. pull `feature/delivery-release-engineering-rich-deep`;
2. run `pnpm build` from the repository root;
3. inspect any TypeScript/content-model mismatch rather than weakening lesson intent unnecessarily;
4. do not delete unrelated local modified/untracked files;
5. merge only after a clean local build is reported.
