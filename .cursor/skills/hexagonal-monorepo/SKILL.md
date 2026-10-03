---
name: hexagonal-monorepo
description: Hexagonal architecture in an Nx monorepo.
---

# Hexagonal Monorepo (Nx)

## Organization

- `libs/`: Pure TypeScript use cases, ports, domain, and pure TypeScript adapters, plus shared infrastructure that is not specific to one application.
- `apps/`: One delivery shell per runtime (NestJS API, dashboard, worker, CLI).
- `deploy/`: IaC, CI/CD, environment configuration.

## Stays in the application

- Controllers
- Presenters
- View models
- Routing
- HTTP-specific code
- UI-specific code
- Configuration and wiring
- Gateways specific to that application

## Allowed

- Centralize pure business logic, ports, domain, and pure adapters in `libs/`.
- Use one Nx project per hexagonal layer under `libs/`.
- Inject in ports only in application adapters.

## Forbidden

- Create `domain`, `ports`, or `application` folders that hold code in `apps/`.
- Make applications depend on each other.
- Import IaC (`deploy/`) into business code (`libs/` or `apps/`).
- Put two runtimes in a single Nx application.

## Directives

- Maintain applications as "thin shells" without business logic.
- Use dependency injection for all collaboration across boundaries.
- Configure module constraints via ESLint `@nx/enforce-module-boundaries`.
- Register each layer in `HEXAGONAL_LAYER_TAGS` for tag tracking.
- New vertical slice (entity → ports → use case → adapter → HTTP): apply project skill `hexagonal-slice`.
