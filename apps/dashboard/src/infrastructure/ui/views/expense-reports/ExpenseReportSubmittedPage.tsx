import type { ExpenseReportsComposition } from '../../../composition/expense-reports.composition';
import { ExpenseReportSubmitted } from './ExpenseReportSubmitted';

interface ExpenseReportSubmittedPageProps {
  deps: ExpenseReportsComposition;
}

export function ExpenseReportSubmittedPage({ deps }: ExpenseReportSubmittedPageProps) {
  return <ExpenseReportSubmitted model={deps.expenseReportSubmittedPresenter.present()} />;
}
