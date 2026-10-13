import type { ExpenseReportSubmittedViewModel } from './expense-reports.view-models';

/**
 * Presents the expense report submission confirmation.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class ExpenseReportSubmittedPresenter {
  constructor(private readonly placeholder: ExpenseReportSubmittedViewModel) {}

  present(): ExpenseReportSubmittedViewModel {
    return this.placeholder;
  }
}
