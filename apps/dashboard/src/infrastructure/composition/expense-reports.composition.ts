import { ExpenseReportPresenter } from '../../adapters/presenters/expense-reports/expense-report.presenter';
import { ExpenseReportSubmittedPresenter } from '../../adapters/presenters/expense-reports/expense-report-submitted.presenter';
import { ExpenseReportsPresenter } from '../../adapters/presenters/expense-reports/expense-reports.presenter';
import { expenseReportFixture, expenseReportSubmittedFixture, expenseReportsFixture } from '../ui/fixtures/expense-reports.fixture';

export type ExpenseReportsComposition = {
  expenseReportsPresenter: ExpenseReportsPresenter;
  expenseReportPresenter: ExpenseReportPresenter;
  expenseReportSubmittedPresenter: ExpenseReportSubmittedPresenter;
};

/** Presenters of the expense reports screens, fed with placeholder data for now. */
export function createExpenseReportsComposition(): ExpenseReportsComposition {
  return {
    expenseReportsPresenter: new ExpenseReportsPresenter(expenseReportsFixture),
    expenseReportPresenter: new ExpenseReportPresenter(expenseReportFixture),
    expenseReportSubmittedPresenter: new ExpenseReportSubmittedPresenter(expenseReportSubmittedFixture),
  };
}
