---
name: dashboard-infrastructure
description: >-
  Frameworks and drivers layer of the dashboard: UI, technical clients, UI
  state, storage, composition. Use when adding or editing a technical client, a
  store, a persistence access, or framework configuration in this app.
---

# Steering: Frameworks & Drivers

## Rules
- **UI Components (React/Vue/etc.)**: Must be "Humble Objects". (See [ui/SKILL.md](ui/SKILL.md))
- **Wiring**: All instantiation happens in the composition root. (See [composition/SKILL.md](composition/SKILL.md))
- **Technical Details**: API clients (Axios), Storage (LocalStorage), Framework config.
- **UI Persistence (Zustand)**: Use for ALL UI-only state and non-server persistence (e.g., toasts, user preferences).
- **DI for Stores**: Stores MUST use Dependency Injection for external resources. Example: `createSettingsStore(storage: KeyValueStorage)`.
- **Storage**: All storage persistence MUST use the `KeyValueStorage` port.
- May depend on `adapters`, `application`, and `domain`.

## Network (mandatory)
- `IHttpClient` is the only way to the network, for everything: API calls, multipart forms, files behind a signed link (`getBytes`).
- `network/fetch-http-client.ts` is the only file of the app that calls `fetch`; `network/in-memory-http-client.ts` is its in-memory counterpart. A new need (a body kind, a reading mode) is a new method of `IHttpClient`, implemented in both.
- Network helpers live in `network/` and go through `IHttpClient` (`RemoteFileReader`), or touch no network at all (`build-url`, `unwrap-response`).
- The transport belongs to this app, not to the shared libs: only its port is shared — skill `single-technical-entry`.
- **Forbidden**: Business logic must not reside here.
