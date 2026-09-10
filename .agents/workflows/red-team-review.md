---
description: Red Team Adversarial Quality & Security Review Workflow
---

# Red Team Quality & Security Review Workflow

## Objective

Subject all major user authentication, biometric recognition, and customer-facing UI components to rigorous adversarial critique before acceptance.

## Steps

### Step 1: Pre-requisite Validation
- Execute `pnpm build` to guarantee zero syntax or bundling errors.
- Ensure all public assets (`/models/*`, images) are accessible.

### Step 2: Adversarial Assessment by Red Team
Run checks following the `red-team` checklist:
1. Probe camera failure states and photo upload fallbacks.
2. Probe negative biometric cases (corrupted images, non-face images, multiple faces).
3. Test edge-case form submissions (blank inputs, mismatched passwords, duplicate submissions).
4. Verify responsive integrity and inspect for CSS selector bleeding.

### Step 3: Reporting
Publish findings to:
`.agents/artifacts/RED_TEAM_AUDIT.md`

All BLOCKER and HIGH items must be resolved prior to final release.
