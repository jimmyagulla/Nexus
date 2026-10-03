---
name: hexagonal-slice
description: >-
  Scaffolds a hexagonal vertical slice (entity, in/out ports, use
  case, Prisma adapter, API HTTP, Nest wiring). Use when adding a feature, use
  case, slice, or when the user asks to create or generate domain/ports/HTTP
  for a named capability.
---

# Hexagonal slice

Copy this checklist. One kebab-case name (e.g. `todo`) → one Pascal entity (`Todo`). Never split names.

```
- [ ] Name valid; targets do not already exist
- [ ] Read colocated SKILL.md on each folder before writing
- [ ] TDD per `tdd` (happy path, then each edge)
- [ ] Files + barrels + AppModule
```

## Name

- Pattern: `^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$`

## Layout (`name=todo`)

| Path | Role |
|------|------|
| `libs/domain/src/entities/todo.ts` + spec | Entity |
| `libs/ports/src/in/todo.port.ts` | `ITodoInPort` + `Symbol` (`execute`) |
| `libs/ports/src/out/todo.repository.port.ts` | `ITodoRepository` + `Symbol` |
| `libs/application/src/use-cases/todo/get-todo.use-case.ts` + spec | Implements in port |
| `apps/api/src/adapters/out/todo/prisma-todo.repository.ts` + spec | Implements out port via Prisma |
| `apps/api/src/adapters/http/todo/` | Controller + DTO + spec (`@Controller('todo')`) |
| `apps/api/src/infrastructure/todo/todo.module.ts` + spec | `useFactory` wiring |

Append `export *` on each lib barrel (`libs/*/src/index.ts`, and `libs/application/src/use-cases/index.ts` if present). Import `TodoModule` in `apps/api/src/infrastructure/app.module.ts`.

## Rules

- Follow colocated `SKILL.md` (domain, ports, application, adapters, api http, api infrastructure). Layer rules win over this skill.
- Controllers inject in ports, never use-case classes.
- Prisma out adapters live in `apps/api/src/adapters/out/`. No `libs/adapters/src/in/`.
- No `domain/`, `ports/`, or `application/` under `apps/`.
- Do not overwrite existing slice files.
- Default HTTP only. Worker/other in only if the user asks.
- Unit tests colocated. No e2e unless the user asked.

## Wiring

```typescript
provide: ITodoRepository,
useFactory: (prisma: PrismaDb) => new PrismaTodoRepository(prisma),
inject: [IPrismaDb],
```

Inbound port factory: `new GetTodoUseCase(items)` with `inject: [ITodoRepository]`.
