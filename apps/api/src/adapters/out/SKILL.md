---
name: api-out-adapters
description: Outbound Prisma persistence adapters for apps/api.
---

# API out adapters

Prisma repositories live only in the API so the frontend and shared libs are not coupled to the ORM.

## Allowed

- Implement existing out ports from `@hexagonal-monorepo-template/ports`.
- Map Prisma rows to domain types.
- Use Prisma client types from `apps/api/src/infrastructure/prisma/prisma-client`.

## Forbidden

- NestJS modules, controllers, or HTTP DTOs.
- Import another adapter.
- Call a use case.
- Put the Prisma schema, `prisma-client`, or Prisma adapters under `libs/`.

## Prisma mappers

- Map a Prisma row to a domain object in a `*.mapper.ts` file next to the repository. Do not keep that mapping inside the repository class.
- The mapper input is a Prisma client type: the model, or `Prisma.*GetPayload` when the query includes relations. Do not redeclare the row as a handwritten structural type.
- The mapper output stays the domain type.
- Import those Prisma types from `prisma-client`.
