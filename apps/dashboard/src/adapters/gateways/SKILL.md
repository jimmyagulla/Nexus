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

## Rules
- **Data Access Implementation.** Implement an out port declared in the shared ports folder; never declare the contract here (skill `ports-location`, naming in skill `ports-boundaries`).
- Handle mapping between technical data formats (JSON, DB records) and Domain Entities.
- May depend on the shared `application`, `domain`, and ports layers, and on `infrastructure` (e.g., API client).
- **Query Params**: Use a generic method to build URLs from a flat object.
- **Formatting**: Private internal methods must handle data transformation (e.g., dates to strings) before passing params to the generic builder.
- **Forbidden**: NO UI concerns, NO business logic orchestration (that's for Use Cases).
