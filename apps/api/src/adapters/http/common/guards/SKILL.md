---
name: api-http-guards
description: Global or common HTTP guards for apps/api.
---

# Common HTTP Guards

## Allowed

- Implement shared `CanActivate` guards.
- Inject ports to validate cross-cutting access policies.

## Forbidden

- Register `APP_GUARD` here.
- Implement domain-specific business logic.
- Use `eslint-disable` comments.

## Dependencies

- Import: NestJS, `@hexagonal-monorepo-template/ports`.
- Never import: `@hexagonal-monorepo-template/application`.
