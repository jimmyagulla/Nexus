import type { ProfessionalExpenseRequestViewModel } from './professional-expenses.view-models';

/**
 * Presents the professional expense request form.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class ProfessionalExpenseRequestPresenter {
  constructor(private readonly placeholder: ProfessionalExpenseRequestViewModel) {}

  present(): ProfessionalExpenseRequestViewModel {
    return this.placeholder;
  }
}
