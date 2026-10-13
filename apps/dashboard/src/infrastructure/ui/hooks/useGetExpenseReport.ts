import { useQuery } from '@tanstack/react-query';
import type { ExpenseReportComposition } from '../../composition/expense-report.composition';
import { expenseReportFixture } from '../fixtures/expense-reports.fixture';

export const getExpenseReportQueryKey = () => ['expense-report'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetExpenseReport({ presenter }: ExpenseReportComposition) {
  return useQuery({
    queryKey: getExpenseReportQueryKey(),
    queryFn: async () => presenter.present(expenseReportFixture),
  });
}
