# Hexagonal monorepo template

Nx workspace with hexagonal layers as separate libraries, a NestJS API, a React dashboard, and shared tooling in `@hexagonal-monorepo-template/workspace`.

```
libs/domain          layer:domain
libs/ports           layer:port
libs/application     layer:application
libs/adapters        layer:adapter
libs/infrastructure  layer:infra
apps/api             type:app
apps/dashboard       type:app (clean architecture frontend)
deploy/              IaC (not imported by apps or libs)
tools/workspace      shared tsconfig, ESLint, Vitest
```

Layer boundaries are enforced by ESLint `@nx/enforce-module-boundaries`.

The API stays hexagonal. The dashboard follows clean architecture (`domain`, `application`, `adapters`, `infrastructure`) inside `apps/dashboard`.

## Setup

```sh
npm install
```

## Main Commands

| Task              | Command                 | Description                                                              |
| :---------------- | :---------------------- | :----------------------------------------------------------------------- |
| **Dev**           | `npm start`             | API on `http://localhost:3000/api` and dashboard on `http://localhost:4200` |
| **Invoke Lambda** | `npm run invoke:lambda` | Call the bundled API Lambda handler locally with a sample event (no AWS) |
| **Build**         | `npm run build`         | Build all apps and libs                                                  |
| **Test**          | `npm run test`          | Run unit tests for all projects                                          |
| **E2E**           | `npm run test:e2e`      | Run end-to-end tests                                                     |
| **Lint**          | `npm run lint`          | Run linter for all projects                                              |
| **Graph**         | `npm run graph`         | Visually explore project dependencies                                    |

`npm start` is the path for manual HTTP tests and Swagger (`/api/docs`). `npm run invoke:lambda` exercises the serverless entry (`dist/apps/api/lambda.js` exports `handler`). Pass another event file as the first argument to the invoke script if needed.

Environment (see `.env.example`; no dotenv loader — export them or set them in the shell):

- `PORT` — HTTP port (default `3000`)
- `AUTH_ALLOWED` — auth gate, `true`/`false`/`1`/`0` (default `true`)
- `API_GLOBAL_PREFIX` — Nest global prefix (default `api`)

Produit RH : cahier des charges, référentiels et user stories priorisées dans [`docs/produit`](docs/produit/README.md).

New API features: ask the agent to scaffold a hexagonal slice (project skill `.cursor/skills/hexagonal-slice`).

## Advanced Nx Commands

If you need to target a specific project:

```sh
# Run one project
npx nx <target> <project-name>

# Example: test only domain
npx nx test domain
```

Libs only expose `build`, `test`, and `lint`.
