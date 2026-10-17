import type { ExpenseReportPageComposition } from '../../../composition/expense-report/expense-report-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetExpenseReport } from '../../hooks/expense-reports/useGetExpenseReport';
import { i18n } from '../../i18n/i18n';
import { ExpenseReport } from './ExpenseReport';

interface ExpenseReportPageProps {
  deps: ExpenseReportPageComposition;
}

export function ExpenseReportPage({ deps }: ExpenseReportPageProps) {
  const expenseReport = useGetExpenseReport(deps);

  if (expenseReport.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (expenseReport.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <ExpenseReport model={expenseReport.data} />;
}
