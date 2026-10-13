import { useQuery } from '@tanstack/react-query';
import type { ExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { expenseReportsFixture } from '../fixtures/expense-reports.fixture';

export const getExpenseReportsQueryKey = () => ['expense-reports'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetExpenseReports({ presenter }: ExpenseReportsComposition) {
  return useQuery({
    queryKey: getExpenseReportsQueryKey(),
    queryFn: async () => presenter.present(expenseReportsFixture),
  });
}
