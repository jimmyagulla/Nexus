import type { StatusViewModel } from '../display.types';

export interface ExpenseReportViewModel {
  title: string;
  status: StatusViewModel;
  expenses: ExpenseRowModel[];
  /** "dont TVA 12,27 €" */
  vatTotal: string;
  total: string;
  /** "3 dépenses · 3 justificatifs · validation par …" */
  summary: string;
  /** Prefilled values of the "Ajouter une dépense" panel. */
  newExpense: ExpenseFormModel;
}

export interface ExpenseRowModel {
  id: string;
  date: string;
  category: string;
  /** Remix Icon class of the category, e.g. `ri-train-line`. */
  categoryIcon: string;
  description: string;
  paymentMethod: string;
  vat: string;
  amount: string;
}

export type ExpensePaymentMethod = 'personal' | 'company' | 'cash';

export interface ExpenseFormModel {
  date: string;
  category: string;
  categories: string[];
  amount: string;
  vat: string;
  vatOptions: string[];
  paymentMethod: ExpensePaymentMethod;
  description: string;
  project: string;
  projects: string[];
  proof: { name: string; details: string };
}

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
