import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ExpenseReportForm } from '../../../../adapters/controllers/expense-reports.controller';
import type { ExpenseReportsPageComposition } from '../../../composition/expense-report/expense-reports-page.composition';
import { getExpenseReportsQueryKey } from './useGetExpenseReports';

export function useSubmitExpenseReport({ controller }: ExpenseReportsPageComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: ExpenseReportForm) => controller.submitExpenseReport(form),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getExpenseReportsQueryKey() }),
  });
}
