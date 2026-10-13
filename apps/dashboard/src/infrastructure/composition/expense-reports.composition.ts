import { ExpenseReportsPresenter } from '../../adapters/presenters/expense-reports/expense-reports.presenter';

export type ExpenseReportsComposition = {
  presenter: ExpenseReportsPresenter;
};

export function createExpenseReportsComposition(): ExpenseReportsComposition {
  return { presenter: new ExpenseReportsPresenter() };
}
