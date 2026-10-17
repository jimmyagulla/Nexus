---
name: dashboard-hooks
description: >-
  Placement and shape of the dashboard React hooks: one folder per domain or
  feature, TanStack Query for every data hook. Use when creating, moving, or
  editing a hook, or a query key, under the hooks folder.
---

# React Hooks (Infrastructure/UI)

## Layout (mandatory)

- A hook that belongs to a domain or to a feature lives in **`hooks/<domain>/`**, a folder named like the presenters and views folders of that domain: `hooks/documents/useGetDocuments.ts`, `hooks/company-settings/useRenameCompany.ts`, `hooks/leaves/useGetLeaves.ts`.
- Only a generic hook, tied to no domain or feature, stays at the root of `hooks/`: `use-toast.ts`, `useDebouncedValue.ts`, `useMediaQuery.ts`.
- A hook never sits at the root "for now": the moment it knows a domain (a composition, a presenter, a query key of a domain), it goes in that domain's folder.
- The spec of a hook sits next to it, in the same folder.
- A mutation hook imports the query keys it invalidates from the query hook of the same folder, or from another domain's folder (`../company-settings/useGetCompanySettings`).
- Review: fail when a domain hook is at the root of `hooks/`.

## Network

A hook never calls `fetch` and never reaches the network by itself: it goes through what the composition hands it (controller, `RemoteFileReader`…) — skill `dashboard-infrastructure`, section Network.

## TanStack Query

All hooks that perform data fetching or mutations MUST use TanStack Query (`@tanstack/react-query`).

### Rules

1.  **One Hook per File**: Each file MUST contain exactly one hook that wraps either `useQuery` or `useMutation`.
2.  **Naming Convention**:
    *   Query hooks: `useGet<Resource>.ts` (e.g., `useGetGoals.ts`, `useGetGoalDetails.ts`).
    *   Mutation hooks: `use<Action><Resource>.ts` (e.g., `useCreateAccount.ts`, `useContributeToGoal.ts`).
3.  **No "Bundle" Hooks**: Do NOT create a hook that returns multiple queries or mutations. The Page component should call each hook independently.
4.  **Query Keys as separate exports**: Each query hook MUST export its query key(s) as a constant or a function (if dynamic).
5.  **Invalidation**: Mutation hooks MUST use the exported query keys from the relevant query hooks to invalidate cache.
6.  **Handle status via TanStack**: Use `isLoading`, `isError`, `error`, `data` from the TanStack Query result.

### Example: Query Hook (`goals/useGetGoals.ts`)

```typescript
import { useQuery } from '@tanstack/react-query';

export const getGoalsQueryKey = () => ['goals'];

export function useGetGoals({ controller, presenter }: UseGetGoalsDeps) {
  return useQuery({
    queryKey: getGoalsQueryKey(),
    queryFn: async () => {
      const domainGoals = await controller.loadGoals();
      const asOf = new Date();
      return domainGoals.map((goal) => presenter.present(goal, asOf));
    },
  });
}
```

### Example: Mutation Hook (`goals/useContributeToGoal.ts`)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getGoalsQueryKey } from './useGetGoals';
import { getGoalDetailsQueryKey } from './useGetGoalDetails';

export function useContributeToGoal(id: string, { controller }: UseContributeDeps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      await controller.contribute(id, amount, new Date());
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: getGoalDetailsQueryKey(id) });
      void queryClient.invalidateQueries({ queryKey: getGoalsQueryKey() });
    },
  });
}
```
