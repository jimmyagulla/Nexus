---
name: ports-boundaries
description: >-
  Contract shape and naming for the shared ports folder. Use when defining,
  renaming, or reviewing an in or out port, a data-access contract, or an
  injection token.
---

# Ports

This folder is the only home for ports — skill `ports-location`.

## Allowed

- Define interfaces (`interface`) and types (`type`) for in and out contracts.
- For an in port, expose a single `execute` method.
- Define dependency injection tokens (`Symbol`) colocated with their interfaces.

## Naming

Both suffixes below apply to **data access ports** only: a contract whose job is to read or write the data of a domain entity. For those, the suffix follows the **nature of the access**, and nothing else:

- Database access → `I<Entity>Repository`, file `<entity>.repository.port.ts`. One repository port per domain entity.
- HTTP request → `I<Entity>Gateway`, file `<entity>.gateway.port.ts`.

A port whose job is a capability rather than a data access is named after that capability and takes neither suffix, even when it reaches a remote system over HTTP. A transport client is in that case too: it is the access mechanism, so it is never named after the access it performs.

## Forbidden

- Implement any logic or orchestration.
- Create dependencies between ports (e.g., in port importing an out port).
- Name a port `I<Entity>Repository` when the access is an HTTP request, or `I<Entity>Gateway` when the access is a database.
- Force a data access suffix onto a capability port, or onto a transport client.
- Derive a port name from a technology, a vendor, or a library.

## Dependencies

- Import: `@hexagonal-monorepo-template/domain`.
- Never import: Application, adapter, infrastructure layers, or technical packages.
