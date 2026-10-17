---
name: api-prisma
description: Prisma schema ownership for apps/api.
---

# Prisma

## Allowed

- Own `schema.prisma` and the generated client under `src/infrastructure/prisma`.
- Sync with `prisma db push` and `prisma db pull`. Never add a migrations folder.

- Keep in `prisma/sql/*.sql` what a Prisma schema cannot declare: CHECK constraints, Row Level Security, Supabase Storage buckets. `pnpm prisma:push` runs them right after the push. Each script is idempotent and names the domain constants it mirrors.

## Forbidden

- Put Prisma under `libs/`.
- Read `process.env` in repositories. Receive the client via `IPrismaDb`.
