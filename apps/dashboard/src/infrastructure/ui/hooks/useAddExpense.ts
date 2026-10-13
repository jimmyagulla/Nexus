import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExpenseDetailsInput } from '@hexagonal-monorepo-template/domain';
import { ExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { getExpenseReportsQueryKey } from './useGetExpenseReports';

export function useAddExpense(
  reportId: string,
  { controller }: ExpenseReportsComposition,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: ExpenseDetailsInput) => {
      await controller.addExpense(reportId, expense);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getExpenseReportsQueryKey(),
      });
    },
  });
}
