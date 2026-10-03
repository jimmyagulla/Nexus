---
name: ports-boundaries
description: Contract boundaries for libs/ports.
---

# Ports

## Allowed

- Define interfaces (`interface`) and types (`type`) for in and out contracts.
- For an in port, expose a single `execute` method.
- Define dependency injection tokens (`Symbol`) colocated with their interfaces.

## Forbidden

- Implement any logic or orchestration.
- Create dependencies between ports (e.g., in port importing an out port).

## Dependencies

- Import: `@hexagonal-monorepo-template/domain`.
- Never import: Application, adapter, infrastructure layers, or technical packages.
