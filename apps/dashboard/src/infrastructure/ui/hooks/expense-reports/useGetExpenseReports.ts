import { useQuery } from '@tanstack/react-query';
import type { ExpenseReportsPageComposition } from '../../../composition/expense-report/expense-reports-page.composition';
import { expenseReportsFixture } from '../../fixtures/expense-reports.fixture';

export const getExpenseReportsQueryKey = () => ['expense-reports'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetExpenseReports({ presenter }: ExpenseReportsPageComposition) {
  return useQuery({
    queryKey: getExpenseReportsQueryKey(),
    queryFn: async () => presenter.present(expenseReportsFixture),
  });
}
