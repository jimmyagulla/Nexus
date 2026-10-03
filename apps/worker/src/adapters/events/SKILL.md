---
name: worker-event-adapters
description: Imperative rules for in event adapters.
---

# Worker Event Adapters

## Allowed

- Implement event handlers (`*.event-handler.ts`).
- Define event envelope types and mapping DTOs in `dto/`.
- Parse and reject invalid or unknown events.

## Forbidden

- Create an `in/` subfolder.
- Register NestJS HTTP globals (`APP_PIPE`, `APP_GUARD`, etc.).
- Implement business logic or management rules.
- Import classes from `application/` (use in ports).
- Use `eslint-disable` comments.
- Hold mutable business state between events.

## Dependencies

- Import: `@hexagonal-monorepo-template/ports`, `@hexagonal-monorepo-template/domain`, NestJS.
- Never import: `@hexagonal-monorepo-template/application`.
