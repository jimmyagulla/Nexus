# Steering: Interface Adapters

## Rules
- **Gateways**: Data access implementations. (See [gateways.SKILL.md](gateways.SKILL.md))
- **Presenters**: Data formatting for the View. (See [presenters.SKILL.md](presenters.SKILL.md))
- **Controllers**: Thin mapping of UI events to Use Cases. (See [controllers.SKILL.md](controllers.SKILL.md))
- May depend on `application` and `domain`.
- **Folders**: A presenter, gateway, or controller lives in a subfolder named after its domain. No such file at the root of `presenters/`, `gateways/`, or `controllers/`.
- **Forbidden**: Direct dependencies on specific UI components or framework-heavy `infrastructure`.
