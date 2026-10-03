---
name: application-boundaries
description: Use case boundaries for libs/application.
---

# Application

## Allowed

- Implement in ports from `@hexagonal-monorepo-template/ports`.
- Inject out ports and domain to orchestrate processes.
- Expose a single public `execute` method (excluding private helpers).

## Forbidden

- Create dependencies between use cases (a use case must not import another).
- Import adapter or infrastructure layers.
- Instantiate (`new`) a concrete adapter or technical client.
- Expose any public method other than `execute`.

## Dependencies

- Import: `@hexagonal-monorepo-template/domain`, `@hexagonal-monorepo-template/ports`.
- Never import: Application, adapter, infrastructure layers, or technical packages.
