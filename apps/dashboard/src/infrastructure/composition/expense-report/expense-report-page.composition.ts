import { ExpenseReportPresenter } from '../../../adapters/presenters/expense-reports/expense-report.presenter';

export type ExpenseReportPageComposition = {
  presenter: ExpenseReportPresenter;
};

export function createExpenseReportPageComposition(): ExpenseReportPageComposition {
  return { presenter: new ExpenseReportPresenter() };
}
