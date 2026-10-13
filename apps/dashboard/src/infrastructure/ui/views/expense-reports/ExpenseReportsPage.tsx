import type { ExpenseReportsComposition } from '../../../composition/expense-reports.composition';
import { ExpenseReports } from './ExpenseReports';

interface ExpenseReportsPageProps {
  deps: ExpenseReportsComposition;
}

export function ExpenseReportsPage({ deps }: ExpenseReportsPageProps) {
  return <ExpenseReports model={deps.expenseReportsPresenter.present()} />;
}
