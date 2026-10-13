import { useMutation } from '@tanstack/react-query';
import { ExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { openReceiptFile } from '../features/expense-reports/receipts/open-receipt-file';

export function useOpenReceipt(
  reportId: string,
  { controller }: ExpenseReportsComposition,
) {
  return useMutation({
    mutationFn: async (receiptId: string) => {
      openReceiptFile(await controller.getReceipt(reportId, receiptId));
    },
  });
}
