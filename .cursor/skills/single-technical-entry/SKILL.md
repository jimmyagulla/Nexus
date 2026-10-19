---
name: single-technical-entry
description: >-
  One technical library or global, one entry point: reach it through a port
  implemented by a single adapter, injected everywhere else. Use when code is
  about to call fetch, an HTTP library, crypto.randomUUID, or any other
  side-effecting technical API directly, or when adding a helper that wraps one.
---

# Single technical entry

A side-effecting technical API (network, random identifiers, time…) is called in **one** file of the codebase: the adapter that implements its port. Everything else receives the port by injection.

## Invariant

| Need | Port | The only file that calls the library |
| :--- | :--- | :--- |
| Network (JSON, multipart forms, raw files) | `IHttpClient` | `apps/dashboard/src/infrastructure/network/fetch-http-client.ts` (`fetch`) |
| Random identifiers | `IIdGenerator` | `libs/adapters/src/out/id/random-uuid-generator.ts` (`crypto.randomUUID`) |
| Current instant in a use case | `IClock` | `libs/adapters/src/out/clock/system-clock.ts` |

- Valid for **all** code: adapters, infrastructure helpers, hooks, stores, in-memory adapters, and test helpers.
- Single exception: an API spec that drives the Nest test server over real HTTP plays the remote caller and may use `fetch` for that. It never exports a helper to production code.
- A new need of the same kind (a new body type, a binary read, a new id format) becomes a method of the existing port, implemented in that adapter and in its in-memory counterpart. It never becomes a second direct call.
- A helper that needs the network or an identifier takes the port in its constructor (`RemoteFileReader(httpClient)`), it never imports the library.

## Forbidden

- `fetch`, `XMLHttpRequest`, `axios` or any HTTP library outside the HTTP client adapter — including "small" helpers such as `sendJson` or `sendMultipart`.
- `crypto.randomUUID`, `node:crypto` or any id library outside the id generator adapter.
- A default parameter that builds the concrete adapter (`ids = new RandomUuidGenerator()`): inject it from the composition root.

## Review

Search for the library name: a hit outside the table above is a defect.
