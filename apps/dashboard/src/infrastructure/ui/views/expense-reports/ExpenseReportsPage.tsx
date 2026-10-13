import type { ExpenseReportsComposition } from '../../../composition/expense-reports.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetExpenseReports } from '../../hooks/useGetExpenseReports';
import { i18n } from '../../i18n/i18n';
import { ExpenseReports } from './ExpenseReports';

interface ExpenseReportsPageProps {
  deps: ExpenseReportsComposition;
}

export function ExpenseReportsPage({ deps }: ExpenseReportsPageProps) {
  const expenseReports = useGetExpenseReports(deps);

  if (expenseReports.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (expenseReports.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <ExpenseReports model={expenseReports.data} />;
}
