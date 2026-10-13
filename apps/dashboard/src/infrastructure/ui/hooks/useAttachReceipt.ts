import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReceiptDetailsInput } from '@hexagonal-monorepo-template/domain';
import { ExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { getExpenseReportsQueryKey } from './useGetExpenseReports';

export function useAttachReceipt(
  reportId: string,
  { controller }: ExpenseReportsComposition,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (receipt: ReceiptDetailsInput) => {
      await controller.attachReceipt(reportId, receipt);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getExpenseReportsQueryKey(),
      });
    },
  });
}
