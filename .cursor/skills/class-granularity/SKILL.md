---
name: class-granularity
description: >-
  One class per file named after the class, and complex public methods split
  into intention-named private methods. Use when creating or editing a file that
  declares a class, when a file would hold more than one class, or when a public
  method of a use case, an adapter, or a service grows past a few steps.
---

# Class granularity

## One class per file

- A file declares exactly one class. One class = one file.
- The file name is the class name, in the file-naming convention of its folder (`<Name>Repository` → `<name>.repository.ts`).
- A helper class, a small value holder, or a class "only used here" gets its own file.
- A class used by another class is imported, never co-declared beside it.

## Readable public methods

A public method reads as a sequence of named steps.

- Split a complex public method into private methods named after the business intention, not after the technique.
- The public method keeps the orchestration and the ordering. The private methods keep the detail.
- Apply this first to use cases and persistence adapters, where lookup, validation, mapping, and write steps accumulate.
- Splitting never widens the public surface: the extracted steps stay private.
