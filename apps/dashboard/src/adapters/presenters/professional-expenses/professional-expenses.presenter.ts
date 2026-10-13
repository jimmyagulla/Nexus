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
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class ProfessionalExpensesPresenter {
  constructor(private readonly placeholder: ProfessionalExpensesViewModel) {}

  present(): ProfessionalExpensesViewModel {
    return this.placeholder;
  }
}
