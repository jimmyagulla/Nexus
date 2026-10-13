import { useQuery } from '@tanstack/react-query';
import type { ExpenseReportSubmittedPageComposition } from '../../composition/expense-report/expense-report-submitted-page.composition';
import { expenseReportSubmittedFixture } from '../fixtures/expense-reports.fixture';

export const getExpenseReportSubmittedQueryKey = () => ['expense-report-submitted'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetExpenseReportSubmitted({ presenter }: ExpenseReportSubmittedPageComposition) {
  return useQuery({
    queryKey: getExpenseReportSubmittedQueryKey(),
    queryFn: async () => presenter.present(expenseReportSubmittedFixture),
  });
}
