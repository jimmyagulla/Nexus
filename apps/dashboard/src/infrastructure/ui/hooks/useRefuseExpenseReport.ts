import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { getExpenseReportsQueryKey } from './useGetExpenseReports';

export function useRefuseExpenseReport(
  reportId: string,
  { controller }: ExpenseReportsComposition,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await controller.refuseReport(reportId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getExpenseReportsQueryKey(),
      });
    },
  });
}
