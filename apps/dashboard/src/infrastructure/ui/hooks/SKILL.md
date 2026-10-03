# React Hooks (Infrastructure/UI)

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

### Example: Query Hook (`useGetGoals.ts`)

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

### Example: Mutation Hook (`useContributeToGoal.ts`)

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
