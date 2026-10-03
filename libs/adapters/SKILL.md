---
name: adapters-boundaries
description: Outbound adapter boundaries for libs/adapters.
---

# Adapters (out)

## Allowed

- Implement out ports existing in `src/out/`.
- Use technical clients from `@hexagonal-monorepo-template/infrastructure`.

## Forbidden

- Create a `src/in/` folder (in adapters reside in applications).
- Call a use case or another adapter.

## Dependencies

- Import: `@hexagonal-monorepo-template/ports`, `@hexagonal-monorepo-template/domain`, `@hexagonal-monorepo-template/infrastructure`.
- Never import: Application layer, or another adapter folder for orchestration.
