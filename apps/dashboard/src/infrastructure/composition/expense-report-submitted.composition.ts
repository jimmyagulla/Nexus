import { ExpenseReportSubmittedPresenter } from '../../adapters/presenters/expense-reports/expense-report-submitted.presenter';

export type ExpenseReportSubmittedComposition = {
  presenter: ExpenseReportSubmittedPresenter;
};

export function createExpenseReportSubmittedComposition(): ExpenseReportSubmittedComposition {
  return { presenter: new ExpenseReportSubmittedPresenter() };
}
