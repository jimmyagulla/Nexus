---
name: add-tech-mod
description: >-
  Appends one technical change to docs/technique/modifs.md as a single-line
  summary. Use when the user invokes add-tech-mod or asks to add a technical
  mod to the technique list.
disable-model-invocation: true
---

# Add tech mod

Add one point to `docs/technique/modifs.md`. Do not implement it. Do not commit.

## Gate

- The user must have invoked this skill and described the issue.
- If the description is missing, ask for it and stop.
- Do not add a point unless this skill was invoked.
- Do not remove a point. That is `implement-tech-mod` only.

## File

Path: `docs/technique/modifs.md`

Write it only in the **primary clone** (the worktree on `main`). If this chat is already in another worktree, resolve the primary path with `git worktree list` and edit that copy. Never edit this file from a feature worktree.

## Write

1. Read the file.
2. Summarize the issue in **one line max**. No second sentence, no justification, no file list.
3. Next id: highest existing `Tnn` + 1, padded to two digits (`T01`). If the list is empty, use `T01`. Never reuse an id still present in the file.
4. Append under `## Points`:

```markdown
- **T01** — résumé d'une ligne
```

5. Reply with the added line only.

## Summary

- French if the user wrote in French.
- Fact of the change, not the anecdote.
- Keep the user's wording when it is already one line.
