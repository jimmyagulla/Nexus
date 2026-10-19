---
name: dashboard-gateways
description: >-
  Out adapters of the dashboard: one adapter per domain entity, implementing a
  shared out port. Use when creating or editing a client-side data access
  adapter, or before adding an operation to an existing one.
---

# Steering: Out adapters (Adapters)

## One entity, one adapter (mandatory)

- An out adapter contains only what belongs to **its own** domain entity. One entity = one class = one file.
- A second entity means a **second** adapter. Never append its operations to an existing adapter.
- Sharing a backend route, a host, a base URL, or a technical client is **not** a reason to share an adapter.
- A screen that needs two entities is wired with two adapters. A screen is not an entity.
- Full rule: skill `domain-aligned-modules`.

## Gateway or Repository

The suffix follows the **nature of the access**, and nothing else:

- HTTP request → `Gateway`. An adapter of this folder is in that case, so its port is `I<Entity>Gateway` and the adapter is `<Origin><Entity>Gateway` in `<origin>-<entity>.gateway.ts`.
- Database access → `Repository`. Such a contract is implemented by a server-side adapter, never here.

Never the opposite suffix, and never a name derived from a technology, a vendor, or a library.

## Location (mandatory)

- The HTTP gateways of the dashboard live **here**, never in the shared libs: they call our API through this app's transport. Only their ports are shared (`libs/ports/src/out/<entity>/`).
- Their in-memory implementations (`InMemory<Entity>Gateway`) live in the shared adapters, so that use-case specs run without HTTP — skill `no-test-doubles`.

## Shared request helpers

- `gateway-request.ts` holds what every gateway repeats: `joinedParam` (a list as one query parameter), `optionalParam` (an empty text left out), `authorizedBy` (the bearer config of a request). Never re-declare them as private methods.
- A payload answered by several endpoints has one `<name>.payload.ts` (type and mapping), imported by every gateway that reads it — e.g. `company-settings.payload.ts`.
- Network only through the injected `IHttpClient` — skill `single-technical-entry`.

## Rules
- **Data Access Implementation.** Implement an out port declared in the shared ports folder; never declare the contract here (skill `ports-location`, naming in skill `ports-boundaries`).
- Handle mapping between technical data formats (JSON, DB records) and Domain Entities.
- May depend on the shared `application`, `domain`, and ports layers, and on `infrastructure` (e.g., API client).
- **Query Params**: Use a generic method to build URLs from a flat object.
- **Formatting**: Private internal methods handle the transformation specific to the gateway (e.g., criteria to query params) before passing params to the generic builder; generic transformations are the shared helpers above.
- **Forbidden**: NO UI concerns, NO business logic orchestration (that's for Use Cases).
