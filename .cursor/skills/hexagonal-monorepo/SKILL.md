---
name: hexagonal-monorepo
description: Hexagonal architecture in an Nx monorepo.
---

# Hexagonal Monorepo (Nx)

## Organization

- `libs/`: Shared hexagonal core (domain, ports, application, adapters, infrastructure).
- `apps/`: Delivery shells (NestJS API, Worker, CLI).
- `deploy/`: IaC, CI/CD, environment configuration.

## Allowed

- Centralize all business logic, ports, and domain in `libs/`.
- Use one Nx project per hexagonal layer under `libs/`.
- Inject in ports only in application adapters.

## Forbidden

- Create `domain`, `ports`, or `application` folders in `apps/`.
- Make applications depend on each other.
- Import IaC (`deploy/`) into business code (`libs/` or `apps/`).
- Put two runtimes in a single Nx application.

## Directives

- Maintain applications as "thin shells" without business logic.
- Use dependency injection for all collaboration across boundaries.
- Configure module constraints via ESLint `@nx/enforce-module-boundaries`.
- Register each layer in `HEXAGONAL_LAYER_TAGS` for tag tracking.
- New vertical slice (entity → ports → use case → adapter → HTTP): apply project skill `hexagonal-slice`.
