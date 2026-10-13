import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { getExpenseReportsQueryKey } from './useGetExpenseReports';

export function useCreateExpenseReport({
  controller,
}: ExpenseReportsComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (label: string) => controller.createReport(label),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getExpenseReportsQueryKey(),
      });
    },
  });
}
