import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { getExpenseReportsQueryKey } from './useGetExpenseReports';

export function useRemoveExpense(
  reportId: string,
  { controller }: ExpenseReportsComposition,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseId: string) => {
      await controller.removeExpense(reportId, expenseId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getExpenseReportsQueryKey(),
      });
    },
  });
}
