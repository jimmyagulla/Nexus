import {
  createExpenseReportsPageComposition,
  type ExpenseReportsPageComposition,
} from './expense-reports-page.composition';
import {
  createExpenseReportPageComposition,
  type ExpenseReportPageComposition,
} from './expense-report-page.composition';
import {
  createExpenseReportSubmittedPageComposition,
  type ExpenseReportSubmittedPageComposition,
} from './expense-report-submitted-page.composition';

/** Compositions of the expense report pages. */
export type ExpenseReportComposition = {
  expenseReports: ExpenseReportsPageComposition;
  expenseReport: ExpenseReportPageComposition;
  expenseReportSubmitted: ExpenseReportSubmittedPageComposition;
};

export function createExpenseReportComposition(): ExpenseReportComposition {
  return {
    expenseReports: createExpenseReportsPageComposition(),
    expenseReport: createExpenseReportPageComposition(),
    expenseReportSubmitted: createExpenseReportSubmittedPageComposition(),
  };
}
