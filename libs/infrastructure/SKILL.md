---
name: infrastructure-boundaries
description: Technical client boundaries for libs/infrastructure.
---

# Infrastructure

## Allowed

- Implement technical clients (DB wrappers, SDKs).
- Return raw records.
- Parse environment strings into primitives (`parsePort`, `parseBool`, `readOptional`). Throw when a value is present and invalid.

## Forbidden

- Import domain, ports, application, or adapter layers.
- Implement business types or management logic.
- Import NestJS.
- Assemble app-shaped config (PORT, auth flags, HTTP prefix). That belongs in the app composition root.

## Dependencies

- Import: Technical packages, language standard library.
- Never import: Any business hexagonal layer.
