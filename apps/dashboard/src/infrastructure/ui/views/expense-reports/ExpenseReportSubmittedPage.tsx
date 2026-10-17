import type { ExpenseReportSubmittedPageComposition } from '../../../composition/expense-report/expense-report-submitted-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetExpenseReportSubmitted } from '../../hooks/expense-reports/useGetExpenseReportSubmitted';
import { i18n } from '../../i18n/i18n';
import { ExpenseReportSubmitted } from './ExpenseReportSubmitted';

interface ExpenseReportSubmittedPageProps {
  deps: ExpenseReportSubmittedPageComposition;
}

export function ExpenseReportSubmittedPage({ deps }: ExpenseReportSubmittedPageProps) {
  const expenseReportSubmitted = useGetExpenseReportSubmitted(deps);

  if (expenseReportSubmitted.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (expenseReportSubmitted.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <ExpenseReportSubmitted model={expenseReportSubmitted.data} />;
}
