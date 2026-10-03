# Steering: UI Components (Infrastructure)

## Rules
- **Humble Objects**: Components must be as simple as possible. No business logic, no complex data transformation.
- **Purely Declarative**: Components should only handle display and routing events.
- **Dependency**:
    - Use **Controllers** to handle user actions (clicks, submits).
    - Use **Presenters** (or ViewModels prepared by them) for data display.
    - May use **Hooks of Liaison** to bridge React with the Application layer.
- **Forbidden**:
    - NO direct calls to Use Cases or API Gateways.
    - NO business logic calculation inside JSX or `useEffect`.
    - NO complex state management that should be in the Domain/Application layer.
