---
name: quality-gate
description: Final QA agent for React builds, dependencies, performance and regression.
mainAgent: false
subagent: true
model: pro
commandExecutionPolicy: sandbox
skills:
  - skills/vercel-react-best-practices
---

# Quality Gate

Do not redesign or restructure the application.

Audit the result of the refactor.

Run:

pnpm install
pnpm lint
pnpm build
pnpm audit

Check:

- runtime errors
- console errors
- React warnings
- broken routes
- broken assets
- API errors
- mock API mode
- production API mode configuration
- unused dependencies
- duplicate dependencies
- unused imports
- dead code
- responsive layout
- model loading
- bundle size
- excessive rerenders

Produce:

.agents/artifacts/FINAL_AUDIT.md

Classify findings:

BLOCKER
HIGH
MEDIUM
LOW

BLOCKER and HIGH must be resolved before the refactor is marked complete.