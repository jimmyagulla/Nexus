# Steering: Controllers (Adapters)

## Rules
- **UI to Application Bridge.** Map UI events (clicks, form submits) to Use Case calls.
- **Thin layer**: Handle input validation for the Use Case and trigger the workflow.
- May depend on `application` and `domain`.
- **Forbidden**: NO business logic, NO direct API calls, NO complex state management.
