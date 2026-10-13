/** View models of the professional expenses screens, produced by their presenters. */

import type { StatusViewModel } from '../display.view-models';

export interface ProfessionalExpenseRequestViewModel {
  request: ProfessionalExpenseFormModel;
}

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

export interface ExpenseTypeOption {
  value: string;
  label: string;
  description: string;
  /** Remix Icon class, e.g. `ri-home-wifi-line`. */
  icon: string;
}

export interface ProfessionalExpenseFormModel {
  types: ExpenseTypeOption[];
  type: string;
  period: string;
  periods: string[];
  days: string;
  /** "2,50 € / jour" */
  rate: string;
  total: string;
  description: string;
  /** "Non requis pour ce type de frais" */
  proofNotice: string;
}
