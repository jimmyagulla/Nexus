import { useQuery } from '@tanstack/react-query';
import { ExpenseReportsScreenComposition } from '../../composition/expense-reports.composition';
import { getExpenseReportQueryKey } from './useGetExpenseReport';

export function useOpenExpenseReport(
  reportId: string,
  { reports, categories }: ExpenseReportsScreenComposition,
) {
  return useQuery({
    queryKey: getExpenseReportQueryKey(reportId),
    queryFn: async () => {
      const [report, offered] = await Promise.all([
        reports.controller.openReport(reportId),
        categories.controller.listCategories(),
      ]);
      return reports.presenter.present(report, offered);
    },
  });
}
