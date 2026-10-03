---
name: libs-hexagonal-steering
description: Enforces hexagonal architecture for all libraries in the libs/ folder.
---

The content of this folder must follow hexagonal architecture.

# Hexagonal Architecture

## Golden rule

One dependency direction. Never reverse it. All collaborations across boundaries use **dependency injection** — never `new` on a concrete adapter, use case, or infra service from another folder.

```
adapters → ports → domain
```

Use cases live in `application/`. They **are** in ports (orchestration). They may depend on out ports + domain. They are not in `ports/`.

`ports/` holds contracts only. No orchestration.

## Layers

| Folder                     | Layer                                | Allowed dependencies         | Forbidden dependencies              |
| :------------------------- | :----------------------------------- | :--------------------------- | :---------------------------------- |
| `domain/`                  | Domain                               | None (other layers / tech)   | All other layers and technical deps |
| `ports/`                   | Port                                 | Domain                       | Adapter, Application, Infra, Port   |
| `application/` (use cases) | Port                                 | Domain, Port                 | Adapter, Infra, Application         |
| `adapters/`                | Adapter                              | Port, Domain, Infra          | Adapter, Application                |
| `infrastructure/`          | Not a layer (project infrastructure) | libs, frameworks, tech tools | Port, Adapter, Domain, Application  |

Intra-domain imports are the only domain imports allowed (domain knows itself). Domain still forbids NestJS, ORM, HTTP, DB, config.

## Rules

1. **Ports** depend only on **domain**. Ports must not depend on other ports. No orchestration in `ports/`.
2. **Use cases** are in ports, **exclusively** under `application/`. They may depend on out ports (`ports/out`) and domain. A use case must **never** depend on another use case (`application` ↛ `application`).
3. **Adapters** may use ports, domain, and infra services (recommended: e.g. Postgres client in `infrastructure/`, mapped in the out adapter). An adapter must **never** call a use case or another adapter.
4. **Infrastructure** must not know the business: no domain, ports, adapters, or use cases.
5. **Place use cases in `application/`.** In port *interfaces* stay in `ports/in`. Use cases implement those interfaces.

## Imposed structure

```
src/
├── domain/            # pure business
│   ├── entities/
│   ├── value-objects/
│   └── services/
├── application/
│   └── use-cases/     # in-port implementations (orchestration)
├── ports/
│   ├── in/       # contracts the app exposes
│   └── out/      # contracts the app needs
├── adapters/
│   ├── in/http/  # controllers: call in ports, not use cases
│   └── out/      # implement out ports; may use infra
└── infrastructure/    # config, tech clients (e.g. Postgres). Not a layer
```

## What each folder MUST contain

| Folder                             | Contains                                                        | Never contains                                             |
| :--------------------------------- | :-------------------------------------------------------------- | :--------------------------------------------------------- |
| `domain/entities`, `value-objects` | Entities, immutable objects, business behaviors                 | NestJS, ORM, DB, HTTP, config, adapters                    |
| `domain/services`                  | Stateless business services                                     | Technical side effects                                     |
| `ports/in`, `out`        | Pure TypeScript contracts (`interface`, `type`)                | Implementation, orchestration                              |
| `application/use-cases`            | Use cases (in ports): orchestration, inject out ports | Adapter, infra, another use case, `new` of a concrete tech |
| `adapters/in/http`            | Controllers that inject in ports                           | Business logic, use-case classes, other adapters           |
| `adapters/out/`               | Repositories/gateways implementing out ports               | Calls to other adapters or use cases                       |
| `infrastructure/`                   | Config, technical clients, wiring modules                       | Business logic; imports of domain/ports/application/adapters |

## Nx (mandatory)

Monorepos use **Nx**. Multiple apps (API + worker, independent entrypoints): also apply `hexagonal-monorepo` (workspace overlay). Layer rules in this skill still govern `libs/`.

On every hexagonal project, encode this table as Nx ESLint `@nx/enforce-module-boundaries` **`depConstraints`** plus project tags so the linter fails illegal imports. Do not rely on review alone.

Tag libraries: `layer:domain`, `layer:port`, `layer:application`, `layer:adapter`, `layer:infra`.

If two use cases (or two adapters, or two ports) live in the same Nx project, add lint so intra-folder imports still fail — `depConstraints` only apply across projects. Prefer Nx libs split so the table is enforceable.

See [nx-dep-constraints.md](nx-dep-constraints.md).

## Checklist before validating a file

1. **Which folder/layer?**
2. **Imports match the table?** Illegal import = error. Fix it; do not justify it.
3. **Cross-boundary objects injected, not constructed?**
4. **Business logic outside `domain/`?** Move it.
5. **Out adapter implements an existing out port?** Create the port first.
6. **In adapter injects an in port, not a use-case class?**
7. **`depConstraints` would catch this?** If lint cannot see it, split libs or tighten ESLint.

## When you detect a violation

Never bypass the rule to "move the code forward". Report it, propose the port, move, or DI binding, and apply it. If `depConstraints` are missing or weaker than this table, add or tighten them in the same change when you own the scaffold — otherwise flag it as blocking.
