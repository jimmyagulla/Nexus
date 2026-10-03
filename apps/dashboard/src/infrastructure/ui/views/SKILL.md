# UI Views and Pages (Infrastructure/UI)

## Separation of Concerns: Page vs. View

To ensure clean architecture and testability, we distinguish between **Page** components (Logic) and **View** components (Presentation).

### Rules

1.  **Page Components (`*Page.tsx`)**:
*   Responsible for **data orchestration** (calling hooks like `useQuery`).
*   MUST handle **Loading** and **Error** states.
*   MUST handle **Empty** states if they require specific logic.
*   Passes only the "Happy Path" data to the View component.

2.  **View Components (`*.tsx`)**:
*   Pure **Presentational** components.
*   Expect data to be present and valid (Happy Path).
*   Should NOT contain loading spinners or error messages related to data fetching.
*   Easily testable in isolation or via Storybook.

### Atomic Components

- **Extraction**: Systematically extract repetitive elements into sub-components. 
- *Example*: `TransactionCard.tsx` should be extracted from `Transactions.tsx` if the item logic grows or is reused.
