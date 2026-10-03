---
name: hexagonal-slice
description: >-
  Scaffolds a hexagonal vertical slice (entity, in/out ports, use
  case, mock adapter, API HTTP, Nest wiring). Use when adding a feature, use
  case, slice, or when the user asks to create or generate domain/ports/HTTP
  for a named capability.
---

# Hexagonal slice

Copy this checklist. One kebab-case name (e.g. `todo`) → one Pascal entity (`Todo`). Never split names (do not copy hello vs greeting).

```
- [ ] Name valid; targets do not already exist
- [ ] Read colocated SKILL.md on each folder before writing
- [ ] TDD per `tdd` (happy path, then each edge)
- [ ] Files + barrels + AppModule
```

## Name

- Pattern: `^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$`
- `hello` / `greeting` are the sample slice — do not overwrite them; do not reuse that split naming

## Layout (`name=todo`)

| Path | Role |
|------|------|
| `libs/domain/src/entities/todo.ts` + spec | Entity |
| `libs/ports/src/in/todo.port.ts` | `ITodoInPort` + `Symbol` (`execute`) |
| `libs/ports/src/out/todo.repository.port.ts` | `ITodoRepository` + `Symbol` (`findDefault`) |
| `libs/application/src/use-cases/todo/get-todo.use-case.ts` + spec | Implements in port |
| `libs/adapters/src/todo/todo.mock-repository.ts` + spec | Implements out port via `MockDb` |
| `apps/api/src/adapters/http/todo/` | Controller + DTO + spec (`@Controller('todo')`) |
| `apps/api/src/infrastructure/todo/todo.module.ts` + spec | `useFactory` wiring, seed in factory |

Append `export *` on each lib barrel (`libs/*/src/index.ts`, and `libs/application/src/use-cases/index.ts` if present). Import `TodoModule` in `apps/api/src/infrastructure/app.module.ts`.

Shape (unified names): `libs/domain/src/entities/greeting.ts`, `libs/application/src/use-cases/greeting/get-hello.use-case.ts`, `apps/api/src/infrastructure/greeting/hello.module.ts`.

## Rules

- Follow colocated `SKILL.md` (domain, ports, application, adapters, api http, api infrastructure). Layer rules win over this skill.
- Controllers inject in ports, never use-case classes.
- Out adapters live in `libs/adapters`. No `libs/adapters/src/in/`.
- No `domain/`, `ports/`, or `application/` under `apps/`.
- Do not overwrite existing slice files.
- Default HTTP only. Worker/other in only if the user asks.
- Unit tests colocated. No e2e unless the user asked.

## Wiring

```typescript
provide: ITodoRepository,
useFactory: (db: MockDb) => {
  db.seed('todos', 'default', { message: 'Hello Todo' });
  return new TodoMockRepository(db);
},
inject: [MockDb],
```

Inbound port factory: `new GetTodoUseCase(items)` with `inject: [ITodoRepository]`.
