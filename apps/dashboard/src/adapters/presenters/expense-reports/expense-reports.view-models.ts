/** View models of the expense reports screens, produced by their presenters. */

import type { StatusViewModel } from '../display.view-models';

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

export interface ExpenseReportsViewModel {
  draftId: string;
  kpis: ExpenseKpiModel[];
  reports: ExpenseReportRowModel[];
}

export interface ExpenseReportSubmittedViewModel {
  confirmation: { title: string; description: string };
  draftId: string;
  reports: ExpenseReportRowModel[];
}

export interface ExpenseKpiModel {
  label: string;
  value: string;
  /** Remix Icon class of the leading tile, e.g. `ri-receipt-line`. */
  icon?: string;
}

export interface ExpenseReportRowModel {
  id: string;
  title: string;
  period: string;
  expenseCount: string;
  total: string;
  status: StatusViewModel;
  /** Freshly submitted note, tinted blue. */
  highlighted?: boolean;
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
