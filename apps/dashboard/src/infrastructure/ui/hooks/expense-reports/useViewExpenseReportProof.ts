import { useMutation } from '@tanstack/react-query';
import type { ExpenseReportsPageComposition } from '../../../composition/expense-report/expense-reports-page.composition';
import { previewOf, type FilePreview } from '../../lib/file-preview';

/** Reads the receipt of a report for the in-app viewer. */
export function useViewExpenseReportProof({ controller, files }: ExpenseReportsPageComposition) {
  return useMutation({
    mutationFn: async (expenseReportId: string): Promise<FilePreview> => {
      const link = await controller.viewProof(expenseReportId);
      return previewOf(await files.read(link.url, link.contentType), link);
    },
  });
}
