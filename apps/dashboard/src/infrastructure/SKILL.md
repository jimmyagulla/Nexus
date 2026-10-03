# Steering: Frameworks & Drivers

## Rules
- **UI Components (React/Vue/etc.)**: Must be "Humble Objects". (See [ui.SKILL.md](ui.SKILL.md))
- **Technical Details**: API clients (Axios), Storage (LocalStorage), Framework config.
- **UI Persistence (Zustand)**: Use for ALL UI-only state and non-server persistence (e.g., toasts, user preferences).
- **DI for Stores**: Stores MUST use Dependency Injection for external resources. Example: `createSettingsStore(storage: KeyValueStorage)`.
- **Storage**: All storage persistence MUST use the `KeyValueStorage` port.
- May depend on `adapters`, `application`, and `domain`.
- **Forbidden**: Business logic must not reside here.
