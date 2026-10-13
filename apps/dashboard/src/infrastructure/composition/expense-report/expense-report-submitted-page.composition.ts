import { ExpenseReportSubmittedPresenter } from '../../../adapters/presenters/expense-reports/expense-report-submitted.presenter';

export type ExpenseReportSubmittedPageComposition = {
  presenter: ExpenseReportSubmittedPresenter;
};

export function createExpenseReportSubmittedPageComposition(): ExpenseReportSubmittedPageComposition {
  return { presenter: new ExpenseReportSubmittedPresenter() };
}
