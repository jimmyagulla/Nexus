---
name: api-prisma
description: Prisma schema ownership for apps/api.
---

# Prisma

## Allowed

- Own `schema.prisma` and the generated client under `src/infrastructure/prisma`.
- Sync with `prisma db push` and `prisma db pull`. Never add a migrations folder.

## Forbidden

- Put Prisma under `libs/`.
- Read `process.env` in repositories. Receive the client via `IPrismaDb`.
