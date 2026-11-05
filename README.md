# Regression Gauntlet

A benchmark for AI end-to-end testing tools: **Gauntlet Shop**, a small but realistic Next.js storefront, plus a set of pull requests that each introduce exactly one user-visible regression, with machine-readable ground truth and a scorer.

Milestone 1 (this commit): the app, a clean Playwright + axe-core baseline at 1440/834/390, and CI. The manifest, seeded bug branches, proofs, scorer and full documentation follow in later commits.

```bash
npm install
npm run dev            # http://localhost:3000
npx playwright install --with-deps
npx playwright test    # baseline suite (tests/)
```

License: MIT.
