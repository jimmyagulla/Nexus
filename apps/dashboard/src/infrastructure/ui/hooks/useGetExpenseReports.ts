import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ExpenseReportFilterInput } from '@hexagonal-monorepo-template/domain';
import { ExpenseReportsScreenComposition } from '../../composition/expense-reports.composition';

export const getExpenseReportsQueryKey = () => ['expense-reports'];

export function useGetExpenseReports(
  { reports, categories }: ExpenseReportsScreenComposition,
  filter: ExpenseReportFilterInput = {},
) {
  return useQuery({
    queryKey: [...getExpenseReportsQueryKey(), 'list', filter],
    queryFn: async () => {
      const [list, offered] = await Promise.all([
        reports.controller.listReports(filter),
        categories.controller.listCategories(),
      ]);
      return reports.presenter.presentList(list, offered);
    },
    placeholderData: keepPreviousData,
  });
}
