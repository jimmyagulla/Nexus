---
name: domain-aligned-modules
description: >-
  Aligns backend dependency-injection modules and frontend domains one to one
  with domain entities, and forbids an out adapter from serving more than one
  entity. Use when creating or extending a wiring module, a frontend domain, or
  an out adapter (repository, gateway, API client), or when deciding where a new
  operation belongs.
---

# Domain-aligned modules

The domain decides the split. Every layer downstream copies it.

## Invariant

One domain entity → one backend module → one frontend domain → one out adapter.

The split never follows a screen, a route, a user story, or a technical client.

## Backend modules

- One dependency-injection module per domain entity, named after that entity.
- A module wires the controllers, use cases, and adapter bindings of **its own** entity.
- Never group two entities in one module because a screen, a route, or a release consumes both.

## Frontend domains

- Frontend domains mirror the same entities, one for one.
- A feature spanning two entities consumes two domains. It does not create a third.

## Out adapters: the mistake to stop making

An out adapter contains **only** what belongs to its own domain entity.

- One entity = one adapter class = one file.
- A new entity means a **new** adapter. Never append its operations to an existing adapter.
- Sharing a backend route, a host, a base URL, or a technical client is **not** a reason to share an adapter.
- A screen needing two entities is wired with two adapters. A screen is not an entity.

## Review

Fail review when an out adapter exposes an operation whose payload or return type belongs to another entity, or when one module wires two entities.
