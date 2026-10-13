import type { ExpenseReportViewModel } from './expense-reports.view-models';

/**
 * Presents one expense report.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class ExpenseReportPresenter {
  constructor(private readonly placeholder: ExpenseReportViewModel) {}

  present(): ExpenseReportViewModel {
    return this.placeholder;
  }
}
