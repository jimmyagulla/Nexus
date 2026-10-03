# Steering: Gateways (Adapters)

## Rules
- **Data Access Implementation.** Implement interfaces (ports) defined in `application` or `domain`.
- Handle mapping between technical data formats (JSON, DB records) and Domain Entities.
- May depend on `application`, `domain`, and `infrastructure` (e.g., API client).
- **Query Params**: Use a generic method to build URLs from a flat object.
- **Formatting**: Private internal methods must handle data transformation (e.g., dates to strings) before passing params to the generic builder.
- **Forbidden**: NO UI concerns, NO business logic orchestration (that's for Use Cases).
