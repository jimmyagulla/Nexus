---
name: adapters-boundaries
description: Outbound adapter boundaries for libs/adapters.
---

# Adapters (out)

## Allowed

- Implement out ports existing in `src/out/`.
- Use technical clients from `@hexagonal-monorepo-template/infrastructure`.
- Host the in-memory implementation of an out port, as a full adapter with its own spec. Tests import it from here instead of declaring their own — skill `no-test-doubles`.

## Forbidden

- Create a `src/in/` folder (in adapters reside in applications).
- Call a use case or another adapter.

## Dependencies

- Import: `@hexagonal-monorepo-template/ports`, `@hexagonal-monorepo-template/domain`, `@hexagonal-monorepo-template/infrastructure`.
- Never import: Application layer, or another adapter folder for orchestration.
