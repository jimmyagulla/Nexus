import type { ExpenseReportComposition } from '../../../composition/expense-report.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetExpenseReport } from '../../hooks/useGetExpenseReport';
import { i18n } from '../../i18n/i18n';
import { ExpenseReport } from './ExpenseReport';

interface ExpenseReportPageProps {
  deps: ExpenseReportComposition;
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
