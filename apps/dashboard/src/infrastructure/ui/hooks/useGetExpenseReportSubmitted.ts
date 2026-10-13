import { useQuery } from '@tanstack/react-query';
import type { ExpenseReportSubmittedComposition } from '../../composition/expense-report-submitted.composition';
import { expenseReportSubmittedFixture } from '../fixtures/expense-reports.fixture';

export const getExpenseReportSubmittedQueryKey = () => ['expense-report-submitted'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetExpenseReportSubmitted({ presenter }: ExpenseReportSubmittedComposition) {
  return useQuery({
    queryKey: getExpenseReportSubmittedQueryKey(),
    queryFn: async () => presenter.present(expenseReportSubmittedFixture),
  });
}
