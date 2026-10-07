---
name: unit-test-assertions
description: >-
  Favours assertions on observable results over assertions on call order in unit
  tests. Use when writing, reviewing, or repairing a unit test or spec file,
  when asserting against a mock, a spy, or a fake, or when a test breaks after a
  refactor that did not change behaviour.
---

# Unit test assertions

Assert what the behaviour produces, not how it was produced. Result assertions survive refactoring; call-order assertions do not.

## Prefer

- The returned value.
- The observable final state of the subject under test.
- The persisted effect, read back through the port that recorded it. Prefer an in-memory implementation you can query over a spy you can only interrogate. That implementation is imported from the adapters layer, never written for the test — skill `no-test-doubles`.

## Avoid

- The order in which collaborators were called.
- The order in which mocks were invoked, and call counts, when the behaviour does not depend on them.
- Any assertion that would turn red after a refactor leaving the behaviour identical.

## Exception

Order is only worth asserting when order **is** the specified behaviour (a sequence the caller can observe, a guarantee the specification names). Then assert it explicitly and make the test name say why.

Cycle, coverage, and isolation rules: skill `tdd`.
