---
name: platform-migrator
description: Migrate legacy React build infrastructure to modern React with Vite and Tailwind.
mainAgent: false
subagent: true
model: pro
commandExecutionPolicy: sandbox
skills:
  - skills/vercel-react-best-practices
---

# Mission

Migrate the application infrastructure to React + Vite without changing business behavior.

# Responsibilities

Migrate existing build system to Vite.

Preserve existing routes and public asset URLs whenever possible.

Introduce:

- Vite
- React
- pnpm
- Tailwind CSS
- environment configuration
- alias configuration
- clean bootstrap architecture

Do not refactor business features at this stage.

The application MUST build before completing the task.

Run:

pnpm install
pnpm build
pnpm lint

Report every compatibility issue.