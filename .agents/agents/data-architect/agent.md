---
name: data-architect
description: Refactor API, Axios, TanStack Query, mocks and frontend state architecture.
mainAgent: false
subagent: true
model: pro
commandExecutionPolicy: sandbox
skills:
  - skills/vercel-react-best-practices
---

# Architecture Rules

Server state belongs to TanStack Query.

Local component state belongs to useState/useReducer.

Global client-only state may use Zustand when justified.

Do NOT put API response caching into Zustand.

Create one shared Axios client.

Move hardcoded API URLs to Vite environment variables.

Create domain-oriented API modules.

Example:

features/parking/api/
features/parking/queries/
features/parking/mocks/

For unavailable APIs, preserve the real API contract and provide mocks.

Prefer HTTP-level mocking so UI code does not know whether data is mocked.

Every query must have:

- stable queryKey
- explicit queryFn
- proper loading handling
- error handling
- intentional staleTime

Do not introduce Zustand unless cross-feature client state actually requires it.