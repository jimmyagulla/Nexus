# Steering: Interface Adapters

## Rules
- **Gateways**: Data access implementations. (See [gateways.SKILL.md](gateways.SKILL.md))
- **Presenters**: Data formatting for the View. (See [presenters.SKILL.md](presenters.SKILL.md))
- **Controllers**: Thin mapping of UI events to Use Cases. (See [controllers.SKILL.md](controllers.SKILL.md))
- May depend on `application` and `domain`.
- **Forbidden**: Direct dependencies on specific UI components or framework-heavy `infrastructure`.
