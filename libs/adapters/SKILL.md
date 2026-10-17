---
name: adapters-boundaries
description: Outbound adapter boundaries for libs/adapters.
---

# Adapters (out)

## Allowed

- Implement out ports existing in `src/out/`.
- Use technical clients from `@hexagonal-monorepo-template/infrastructure`.
- Host the in-memory implementation of an out port, as a full adapter with its own spec. Tests import it from here instead of declaring their own — skill `no-test-doubles`.

- Draw identifiers through an injected `IIdGenerator`; `RandomUuidGenerator` is the only file calling `randomUUID` — skill `single-technical-entry`.

## Forbidden

- Host an HTTP transport or an HTTP gateway (anything calling `fetch` or an `IHttpClient`): they belong to the app that calls the API — skill `hexagonal-monorepo`. Their in-memory counterparts (`InMemory<Entity>Gateway`) do belong here.

- Create a `src/in/` folder (in adapters reside in applications).
- Call a use case or another adapter.

## Dependencies

- Import: `@hexagonal-monorepo-template/ports`, `@hexagonal-monorepo-template/domain`, `@hexagonal-monorepo-template/infrastructure`.
- Never import: Application layer, or another adapter folder for orchestration.
