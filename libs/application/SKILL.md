---
name: application-boundaries
description: >-
  Use case boundaries, file shape, and runtime neutrality for the shared
  application layer. Use when creating, moving, or reviewing a use case, when
  giving a use case a dependency, or when a use case needs a framework or
  runtime feature.
---

# Application

This folder is the only home for use cases — skill `hexagonal-monorepo`.

## Allowed

- Implement in ports from `@hexagonal-monorepo-template/ports`.
- Inject out ports and domain to orchestrate processes.
- Expose a single public `execute` method (excluding private helpers).

## File shape

- One file per use case. That file declares one use-case class and nothing else — skill `class-granularity`.
- A single public entry point. Everything else is private.
- Dependencies arrive through the constructor, and only as ports.
- A use case ignores which implementation of a port it is handed, so substituting one is never a reason to touch it — skill `no-test-doubles`.

## Runtime neutrality

The same use case must run unchanged from backend code and from frontend code.

- No framework, runtime, transport, or concrete technology — directly or transitively.
- No ambient access (environment variables, request context, server or browser globals). Anything environmental arrives as an injected port.

## Forbidden

- Create dependencies between use cases (a use case must not import another).
- Import adapter or infrastructure layers.
- Instantiate (`new`) a concrete adapter or technical client.
- Expose any public method other than `execute`.
- Declare two use-case classes in one file.
- Depend on anything that only exists on one side (backend or frontend).

## Dependencies

- Import: `@hexagonal-monorepo-template/domain`, `@hexagonal-monorepo-template/ports`.
- Never import: Application, adapter, infrastructure layers, or technical packages.
