import { ExpenseReportsPresenter } from '../../../adapters/presenters/expense-reports/expense-reports.presenter';

export type ExpenseReportsPageComposition = {
  presenter: ExpenseReportsPresenter;
};

export function createExpenseReportsPageComposition(): ExpenseReportsPageComposition {
  return { presenter: new ExpenseReportsPresenter() };
}
