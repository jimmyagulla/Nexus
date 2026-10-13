import type { ExpenseReportRowModel } from './expense-reports.presenter';

export interface ExpenseReportSubmittedViewModel {
  confirmation: { title: string; description: string };
  draftId: string;
  reports: ExpenseReportRowModel[];
}

/**
 * Presents the expense report submission confirmation.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class ExpenseReportSubmittedPresenter {
  present(expenseReportSubmitted: ExpenseReportSubmittedViewModel): ExpenseReportSubmittedViewModel {
    return expenseReportSubmitted;
  }
}
