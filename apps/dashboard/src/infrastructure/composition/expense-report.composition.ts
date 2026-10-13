import { ExpenseReportPresenter } from '../../adapters/presenters/expense-reports/expense-report.presenter';

export type ExpenseReportComposition = {
  presenter: ExpenseReportPresenter;
};

export function createExpenseReportComposition(): ExpenseReportComposition {
  return { presenter: new ExpenseReportPresenter() };
}
