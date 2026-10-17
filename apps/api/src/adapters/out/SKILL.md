---
name: api-out-adapters
description: Outbound Prisma persistence adapters for apps/api.
---

# API out adapters

Prisma repositories live only in the API so the frontend and shared libs are not coupled to the ORM.

## Allowed

- Implement existing out ports from `@hexagonal-monorepo-template/ports`.
- Map Prisma rows to domain types.
- Use the Prisma client types from `apps/api/src/infrastructure/prisma`.
- Type a row of a single model with the generated model type (`import type { Document as DocumentRecord } from '…/prisma-client'`), never with a hand-written copy of its columns.
- Draw identifiers (storage keys…) through an injected `IIdGenerator` — skill `single-technical-entry`.

## Forbidden

- NestJS modules, controllers, or HTTP DTOs.
- Import another adapter.
- Call a use case.
- Put Prisma schema, generated client, or Prisma adapters under `libs/`.
