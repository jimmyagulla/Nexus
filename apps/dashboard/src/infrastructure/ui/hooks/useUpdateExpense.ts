import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExpenseDetailsInput } from '@hexagonal-monorepo-template/domain';
import { ExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { getExpenseReportsQueryKey } from './useGetExpenseReports';

export function useUpdateExpense(
  reportId: string,
  { controller }: ExpenseReportsComposition,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      expenseId: string;
      expense: ExpenseDetailsInput;
    }) => {
      await controller.updateExpense(reportId, input.expenseId, input.expense);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getExpenseReportsQueryKey(),
      });
    },
  });
}
