# Steering: Controllers (Adapters)

## Rules
- **Folder**: A controller file lives in a domain subfolder. No controller file at the root of `controllers/`.
- **UI to Application Bridge.** Map UI events (clicks, form submits) to Use Case calls from `libs/application`.
- **Thin layer**: Handle input validation for the Use Case and trigger the workflow.
- May depend on `application` and `domain`.
- **Forbidden**: NO business logic, NO direct API calls, NO complex state management.
