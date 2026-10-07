---
name: hexagonal-monorepo
description: >-
  Hexagonal architecture in an Nx monorepo, and what belongs to the shared libs
  versus an app. Use when creating or moving a use case, a domain class, a port,
  or an adapter, when deciding between libs/ and apps/, or when configuring Nx
  tags and module boundaries.
---

# Hexagonal Monorepo (Nx)

## Organization

- `libs/`: Shared hexagonal core (domain, ports, application, adapters, infrastructure).
- `apps/`: Delivery shells (NestJS API, Worker, CLI).
- `deploy/`: IaC, CI/CD, environment configuration.

## Placement (single source of truth)

The shared libs own the core. Every app — backend or frontend — consumes it, none owns it.

| Code                                | Home                                 |
| :---------------------------------- | :----------------------------------- |
| Use cases (application layer)       | Shared libs, mandatory               |
| Domain classes and methods          | Shared libs, mandatory               |
| Ports                               | Shared libs — skill `ports-location` |
| App-agnostic adapters               | Shared libs, mandatory               |
| App-specific adapters               | The app that needs them              |
| Delivery, wiring, configuration, UI | The app                              |

- An adapter is app-agnostic as soon as nothing in it depends on one app's delivery model. It then belongs to the shared libs so every app reuses it.
- An adapter is app-specific when it is bound to one app's delivery model: presenters, frontend controllers, and anything tied to one app's transport or UI.
- Duplicating a use case, a domain rule, or a port inside an app is a defect, even temporarily. Move it to the shared libs and import it.
- A use case must stay runnable from backend and frontend code alike — skill `application-boundaries`.

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
