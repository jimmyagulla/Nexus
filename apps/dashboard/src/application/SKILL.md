# Steering: Application Layer (Use Cases)

## Rules
- **Application behavior.** Specific user actions/tasks.
- Orchestrates data flow between Entities and Gateways.
- May only depend on `domain`.
- **Forbidden**: Dependencies on `adapters` or `infrastructure`.
