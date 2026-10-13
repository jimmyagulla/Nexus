export interface LeaveRequestViewModel {
  form: LeaveRequestFormValues;
  impact: LeaveBalanceImpactModel;
  detail: LeaveCountDetailModel;
  /** "Nadia Roussel, service RH" */
  validator: string;
}

export interface LeaveBalanceImpactModel {
  available: string;
  /** "− 2 j" */
  deducted: string;
  balanceAfter: string;
  /** Share of the acquired days left after approval, in %. */
  remainingPercent: number;
  /** Share of the acquired days this request deducts, in %. */
  deductedPercent: number;
}

export interface LeaveCountDetailModel {
  /** "jeu. 29/10 → ven. 30/10" */
  range: string;
  calendarDays: string;
  weekendsExcluded: string;
  holidaysExcluded: string;
  countedDays: string;
  expectedReturn: string;
}

export interface LeaveRequestFormValues {
  typeOptions: string[];
  type: string;
  startDate: string;
  endDate: string;
  /** Computed, read-only: "2 jours ouvrés". */
  dayCount: string;
  comment: string;
}

/**
 * Presents the leave request form.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class LeaveRequestPresenter {
  present(leaveRequest: LeaveRequestViewModel): LeaveRequestViewModel {
    return leaveRequest;
  }
}
