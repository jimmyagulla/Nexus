import { useQuery } from '@tanstack/react-query';
import { ExpenseReportsScreenComposition } from '../../composition/expense-reports.composition';
import { getExpenseReportsQueryKey } from './useGetExpenseReports';

export const getExpenseReportQueryKey = (reportId: string) => [
  ...getExpenseReportsQueryKey(),
  reportId,
];

export function useGetExpenseReport(
  reportId: string,
  { reports, categories }: ExpenseReportsScreenComposition,
) {
  return useQuery({
    queryKey: getExpenseReportQueryKey(reportId),
    queryFn: async () => {
      const [report, offered] = await Promise.all([
        reports.controller.getReport(reportId),
        categories.controller.listCategories(),
      ]);
      return reports.presenter.present(report, offered);
    },
  });
}
