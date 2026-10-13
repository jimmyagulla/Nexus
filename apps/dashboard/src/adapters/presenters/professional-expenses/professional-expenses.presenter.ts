import type { ProfessionalExpensesViewModel } from './professional-expenses.view-models';

/**
 * Presents the professional expenses list.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class ProfessionalExpensesPresenter {
  constructor(private readonly placeholder: ProfessionalExpensesViewModel) {}

  present(): ProfessionalExpensesViewModel {
    return this.placeholder;
  }
}
