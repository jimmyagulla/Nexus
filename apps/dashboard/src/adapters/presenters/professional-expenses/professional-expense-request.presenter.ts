export interface ProfessionalExpenseRequestViewModel {
  request: ProfessionalExpenseFormModel;
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

/**
 * Presents the professional expense request form.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class ProfessionalExpenseRequestPresenter {
  present(professionalExpenseRequest: ProfessionalExpenseRequestViewModel): ProfessionalExpenseRequestViewModel {
    return professionalExpenseRequest;
  }
}
