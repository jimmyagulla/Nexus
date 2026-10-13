import { useQuery } from '@tanstack/react-query';
import { ExpenseReportsScreenComposition } from '../../composition/expense-reports.composition';

export const getExpenseReportsQueryKey = () => ['expense-reports'];

export function useGetExpenseReports({
  reports,
  categories,
}: ExpenseReportsScreenComposition) {
  return useQuery({
    queryKey: getExpenseReportsQueryKey(),
    queryFn: async () => {
      const [list, offered] = await Promise.all([
        reports.controller.listReports(),
        categories.controller.listCategories(),
      ]);
      return reports.presenter.presentList(list, offered);
    },
  });
}
