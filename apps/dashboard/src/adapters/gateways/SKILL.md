# Steering: Gateways (Adapters)

## Rules
- **Data Access Implementation.** Implement interfaces (ports) defined in `application` or `domain`.
- Handle mapping between technical data formats (JSON, DB records) and Domain Entities.
- A gateway is a class that implements a port and receives its dependencies by constructor (the HTTP client, never a framework).
- May depend on `application`, `domain`, and `infrastructure` only through ports (`HttpClient`).
- **HTTP**: Never import or call `fetch`, `axios`, or any other HTTP framework. Call the injected `HttpClient`. The concrete client (`FetchHttpClient`) lives in infrastructure and is the only place that uses `fetch`.
- **Routes**: Build URLs from `API_ROUTES` (single source in `libs/ports`). Do not hardcode path strings.
- **Query Params**: Use a generic method to build URLs from a flat object.
- **Formatting**: Private internal methods must handle data transformation (e.g., dates to strings) before passing params to the generic builder.
- **Envelopes**: Do not declare success or error envelopes in a feature gateway. Use the shared unwrap helper.
- **Forbidden**: NO UI concerns, NO business logic orchestration (that's for Use Cases).
