import type { StatusViewModel } from '../display.types';

export interface ProfessionalExpensesViewModel {
  pending: { title: string; description: string };
  requests: ProfessionalExpenseRowModel[];
}

export interface ProfessionalExpenseRowModel {
  id: string;
  type: string;
  /** Remix Icon class of the expense type, e.g. `ri-bus-2-line`. */
  icon: string;
  period: string;
  detail: string;
  amount: string;
  status: StatusViewModel;
}

/**
 * Presents the professional expenses list.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class ProfessionalExpensesPresenter {
  present(professionalExpenses: ProfessionalExpensesViewModel): ProfessionalExpensesViewModel {
    return professionalExpenses;
  }
}
