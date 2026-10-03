---
name: no-eslint-disable
description: Prohibition of global ESLint enable/disable comments.
---

# No Global ESLint Disable

## Allowed (after explicit approval)

- Use `// eslint-disable-next-line <rule> -- <reason>` for exceptional and justified cases.

## Forbidden

- Use `/* eslint-disable */` or `/* eslint-disable <rule> */` (at file or block level).
- Use `// eslint-disable-line`.
- Add disable comments without explanation (`-- reason`).

## Directives

- Fix TypeScript or ESLint errors at the source.
- Modify global configuration or types if necessary.
- Prefer specific overrides in `tools/workspace/config/eslint.*.mjs`.
