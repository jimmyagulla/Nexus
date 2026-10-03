---
name: api-db
description: Technical persistence rules for any API that owns a Prisma schema.
---

# Prisma schema

The Prisma schema file is the only persistence contract. Do not add migration scripts, seed scripts, or a second schema.

## Typing

- A closed set of values is a Prisma `enum`. Do not store it as a free `String`.
- Enum names are PascalCase. Enum values are `SCREAMING_SNAKE_CASE` English identifiers, which is the Prisma convention.
- A list of enum values is a relation table whose column is that enum. Do not serialize the list into a text column.
- A known structure is columns or related models. Do not use a JSON or opaque text column when the schema can express the fields.
- Timestamps are `DateTime`. Technical identifiers are `String` or `@default(cuid())`.
- Extending a closed set means editing the enum in the schema. Callers map to the `prisma-client` enum.

## Forbidden columns

- A column that stores text already formatted for display (a sentence, a UI label, a localized message).
- A `String` column that repeats a value already represented by an enum.

## Client

- Generate the client from this schema into `apps/api/src/infrastructure/prisma/prisma-client`. Do not commit `prisma-client`. ESLint ignores that folder.
