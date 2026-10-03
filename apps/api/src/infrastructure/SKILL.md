---
name: api-infrastructure
description: Composition root for apps/api.
---

# API Infrastructure

## Allowed

- Configure `AppModule` and global NestJS wiring (providers, imports).
- Bind in ports to use cases.
- Bind out ports to adapters and infrastructure clients via `useFactory` and `inject`.
- Register global NestJS artifacts via `APP_*` tokens (`APP_PIPE`, `APP_GUARD`, etc.).
- Assemble `ApiConfig` via `loadApiConfig` (uses infrastructure env parsers). Provide it as `API_CONFIG`.
- Derive `AUTH_GUARD_OPTIONS` from `ApiConfig` (`useFactory` + `inject`).
- Call `loadApiConfig` from the HTTP listen entry for `port` / `globalPrefix` (never read `process.env` elsewhere).
- Dual-bootstrap the same in HTTP: a long-lived listen entry and a serverless handler, both in this composition root.
- Provide a single factory that configures the Nest app (global prefix, API docs) without starting a server or initializing the HTTP transport.
- In the serverless wrapper: `init` the HTTP adapter, map the platform event to HTTP, export the handler.

## Forbidden

- Define DTOs or use `class-validator` / `class-transformer` decorators.
- Implement filters, interceptors, or pipes (import from `adapters`).
- Create `domain/`, `ports/`, or `application/` subfolders in `apps/api`.
- Use `app.useGlobalPipes()` in `main.ts` if `APP_PIPE` is already registered.
- Use `eslint-disable` comments.
- Duplicate pipe configuration if a factory already exists.
- Read `process.env` outside `loadApiConfig`.
- Hardcode `AUTH_GUARD_OPTIONS` with `useValue` when `ApiConfig` exists.
- Call `listen` (or bind a port) from the serverless entry.
- Recreate the Nest app on every invocation. Cache the instance **outside** the handler (warm start).
- Treat an in-memory / process-local store as shared truth. It does not survive cold starts or scale-out. Durable state belongs on an out client outside the process.

## Dependencies

- Import: NestJS, `@hexagonal-monorepo-template/application`, `@hexagonal-monorepo-template/ports`, `@hexagonal-monorepo-template/adapters`, `@hexagonal-monorepo-template/infrastructure`, serverless HTTP adapter, Lambda handler types.
- Never import: Domain business logic, DTO modules, `class-validator`, `class-transformer`.

## Wiring

- Perform dependency injection only in this layer.
- One wiring module per feature here (`<feature>.module.ts`): controller(s) + port/adapter bindings via `useFactory`. `new` lives only in these modules.
- Technical clients (e.g., `MockDb`) remain generic and business-agnostic: provide them once via a dedicated `@Global()` module (`<client>.module.ts`), never with business seeds. The feature injects the client and seeds its own data in its factory.
- `AppModule` aggregates: `imports` of technical (`@Global()`) and feature modules + registration of global components (`APP_*`). No inline feature binding.
- Systematically use adapter factories for global component configuration.
