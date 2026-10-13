---
name: implement-tech-mod
description: >-
  Implements one cited item from docs/technique/modifs.md in a git worktree,
  pushes the branch, opens a GitHub PR via MCP, then removes the item. Use when
  the user invokes implement-tech-mod. If no item is cited, ask before any work.
disable-model-invocation: true
---

# Implement tech mod

Treat **one** cited point from `docs/technique/modifs.md`. Work in a git worktree, push the branch, open a GitHub PR via MCP, then remove the point from the list.

## Gate

Stop before any worktree, edit, commit, or PR if the user did not cite a point (id `Tnn` or the exact line). Show the current list and ask which id to treat.

If the cited id is absent from the file, say so and stop.

Do not add points. Do not remove a point until the PR exists. Do not treat a second point in the same run.

## Isolate

Read and follow `isolated-chat` before the first code edit.

- Branch: `chat/tech-<id>-<slug>` (example: `chat/tech-t01-mapping-prisma`)
- Worktree: `../Nexus-chat-tech-<id>-<slug>` from `origin/main`
- `move_agent_to_root` into that worktree immediately after create or reuse

This skill overrides `isolated-chat` publishing: push this branch and open a PR. Never push this work to `main`.

Do not edit `docs/technique/modifs.md` inside the worktree.

## Implement

Follow `tdd`, `skill-priority`, and the colocated `SKILL.md` of every folder you touch.

One cited point only. No extra cleanup.

## Publish

Commit on the worktree branch (this skill is the explicit ask). Do not stage `docs/technique/modifs.md`.

```powershell
git fetch origin main
git rebase origin/main
git push -u origin HEAD
```

Never force-push.

## PR via MCP

Repo: `jimmyagulla/Nexus`. Base: `main`. Head: the worktree branch.

1. `GetDynamicTools` on namespace `user-github`, tool `create_pull_request`.
2. If the namespace is `needsAuth` or the call fails on auth, `CallDynamicTool` `mcp_auth` on `user-github` with empty arguments, then inspect again.
3. `CallDynamicTool` `create_pull_request`:

- `owner`: `jimmyagulla`
- `repo`: `Nexus`
- `title`: the point's one line
- `head`: the branch name
- `base`: `main`
- `body`: what changed and how to verify
- `mcpDetails.description`: one sentence on the PR being created

Do not use `gh`. Reply with the PR URL.

## Remove

Only after the PR is created.

Edit `docs/technique/modifs.md` in the **primary clone** (the `main` worktree from `git worktree list`). Delete the treated line. Do not renumber remaining ids. Do not commit that edit with the implementation.
