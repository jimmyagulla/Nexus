---
name: no-test-doubles
description: >-
  Bans dedicated test doubles: an in-memory implementation of a port is an
  adapter like any other, and a test imports it from the adapters layer. Use
  when a test needs an implementation of a port, when writing a fake, a stub, a
  dummy, or an in-memory class, when adding a folder or a helper that stands in
  for a contract, and when deciding where such an implementation lives and where
  it is injected.
---

# No test doubles

A port has implementations. It has no doubles. Whatever stands in for a port in a test is production code, and it lives where production code of that kind lives.

## Invariant

- A dedicated test double is forbidden: no folder of doubles, no class existing only for tests and duplicating an implementation of a port.
- An in-memory implementation of a port is an **adapter**, at the same level as any other implementation of that port. It lives in the adapters layer, obeys every rule of that layer, and carries its own spec, because it is production code.
- A test that needs an implementation of a port **imports it from the adapters layer**. It never writes one for itself alone.
- Dependencies are injected in the composition roots, and nowhere else.

## Forbidden

- A folder dedicated to test doubles, whatever it is called.
- An implementation of a port declared inside a spec file, or beside it, for the use of that file alone.
- A second implementation of a port whose only reason to exist is that a test found the first one inconvenient.
- Granting such an implementation a "test-only" status to exempt it from the rules of the adapters layer: its own file, its own spec, its naming, its dependency constraints.

## Why

- An implementation written for tests drifts from the one that ships. The suite keeps passing against a contract nobody honours any more.
- A double more permissive than reality turns red tests green. Every constraint the real implementation enforces and the double ignores is a defect the suite cannot see.
- One implementation per behaviour means one place to fix, and the fix reaches tests and production at the same instant.

## No impact on the use cases

This rule changes nothing in a use case, and that is the point.

- A use case receives its ports through its constructor and ignores which implementation it is handed.
- Choosing the implementation is a composition concern, settled where the injection happens.
- If applying this rule leads you to modify a use case, something else is misplaced. Find that instead of adapting the use case.

## Test files and layer constraints

With respect to layer constraints, test files form a category of their own. A test may import an implementation from a layer that the production code of its own layer is forbidden to import. That exemption is what makes this rule applicable, and it covers test files only — never production code, at any depth.

Assertion robustness: skill `unit-test-assertions`.
Which layer an implementation belongs to: skill `hexagonal-monorepo`.
