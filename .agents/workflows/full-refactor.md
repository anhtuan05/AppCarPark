---
description: # Carpark Comprehensive Refactor Workflow
---



## Principle

This is a brownfield refactor.

Preserve working behavior before improving architecture.

Never allow an implementation agent to approve its own work.

All significant changes require independent review.

## Required agents

- project-auditor
- platform-engineer
- data-engineer
- face-recognition-engineer
- react-architect
- responsive-ui-engineer
- dependency-security
- quality-gate

At least five distinct specialist agents must participate before the
project may be considered successfully refactored.

## Review policy

Every implementation phase requires:

IMPLEMENT
→ REVIEW
→ FIX
→ RE-REVIEW
→ QUALITY GATE

A reviewer must not be the implementation agent.

High-risk changes require two independent reviewers.

High-risk areas include:

- build configuration
- routing
- API architecture
- authentication
- face recognition
- model loading
- state architecture
- dependency upgrades
- deletion of existing code

## Artifacts

Agents create reports under:

.agents/artifacts/

Do not assume artifact files already exist.

Each agent must update or create its corresponding report.

## Safety

Never perform a repository-wide rewrite.

Never delete legacy code until its replacement has been validated.

Never remove a dependency merely because it appears unused.

Never replace a working API with mock data.

Never modify face recognition thresholds without recording the original value.

Never replace face-api.js during the React/Vite migration.

Never expose secrets using VITE_*.

Never use Zustand for server state.

Never put continuous camera frame data in Zustand.

Every major phase must finish with:

pnpm lint
pnpm build

and any applicable tests.