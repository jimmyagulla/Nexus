---
name: worker-infrastructure
description: Composition root for apps/worker.
---

# Worker Infrastructure

## Allowed

- Configure `WorkerModule` / `AppModule` and NestJS application-context wiring.
- Bind in ports to use cases.
- Bind out ports to adapters and infrastructure clients via `useFactory` and `inject`.
- Cache a Nest `INestApplicationContext` for warm serverless invocations.

## Forbidden

- Define DTOs or use `class-validator` / `class-transformer` decorators.
- Implement event handlers (import from `adapters`).
- Create `domain/`, `ports/`, or `application/` subfolders in `apps/worker`.
- Register HTTP globals (`APP_PIPE`, `APP_GUARD`, `APP_INTERCEPTOR`, `APP_FILTER`).
- Use `eslint-disable` comments.

## Dependencies

- Import: NestJS, `@hexagonal-monorepo-template/application`, `@hexagonal-monorepo-template/ports`, `@hexagonal-monorepo-template/adapters`, `@hexagonal-monorepo-template/infrastructure`.
- Never import: Domain business logic, DTO modules, `class-validator`, `class-transformer`.

## Wiring

- Perform dependency injection only in this layer.
- One wiring module per feature here (`<feature>.module.ts`): handler(s) + port/adapter bindings via `useFactory`. `new` lives only in these modules.
- Technical clients (e.g., `MockDb`) remain generic and business-agnostic: provide them once via a dedicated `@Global()` module (`<client>.module.ts`), never with business seeds. The feature injects the client and seeds its own data in its factory.
- `AppModule` aggregates: `imports` of technical (`@Global()`) and feature modules. No inline feature binding.
