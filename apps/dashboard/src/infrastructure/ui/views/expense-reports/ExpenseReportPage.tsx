import type { ExpenseReportsComposition } from '../../../composition/expense-reports.composition';
import { ExpenseReport } from './ExpenseReport';

interface ExpenseReportPageProps {
  deps: ExpenseReportsComposition;
}

export function ExpenseReportPage({ deps }: ExpenseReportPageProps) {
  return <ExpenseReport model={deps.expenseReportPresenter.present()} />;
}
