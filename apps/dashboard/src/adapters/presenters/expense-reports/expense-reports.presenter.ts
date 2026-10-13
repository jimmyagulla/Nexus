import type { ExpenseReportsViewModel } from './expense-reports.view-models';

/**
 * Presents the expense reports list.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class ExpenseReportsPresenter {
  constructor(private readonly placeholder: ExpenseReportsViewModel) {}

  present(): ExpenseReportsViewModel {
    return this.placeholder;
  }
}
