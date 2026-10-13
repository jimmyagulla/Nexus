/** View models of the leaves screens, produced by their presenters. */

import type { ProgressStepViewModel, StatusViewModel } from '../display.view-models';

export interface LeaveRequestViewModel {
  form: LeaveRequestFormValues;
  impact: LeaveBalanceImpactModel;
  detail: LeaveCountDetailModel;
  /** "Nadia Roussel, service RH" */
  validator: string;
}

export interface LeaveRequestSentViewModel {
  description: string;
  type: string;
  period: string;
  deducted: string;
  sentAt: string;
  status: StatusViewModel;
  steps: ProgressStepViewModel[];
}

export interface LeavesViewModel {
  /** "01/06/2026 – 31/05/2027" */
  referencePeriod: string;
  balance: {
    available: string;
    acquired: string;
    taken: string;
    pending: string;
  };
  calendar: LeaveCalendarModel;
  requests: LeaveRequestItemModel[];
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

export interface LeaveCalendarModel {
  /** "Octobre 2026" */
  month: string;
  /** Monday-first grid, padding cells included. */
  days: LeaveCalendarDayModel[];
}

export type LeaveCalendarDayState =
  | 'outside'
  | 'workday'
  | 'weekend'
  | 'accepted'
  | 'pending';

export interface LeaveCalendarDayModel {
  /** Day number; empty for the padding cells before the 1st. */
  label: string;
  state: LeaveCalendarDayState;
  today?: boolean;
}

export type LeaveCalendarLegendTone = 'accepted' | 'pending' | 'today' | 'weekend';

export interface LeaveCountDetailModel {
  /** "jeu. 29/10 → ven. 30/10" */
  range: string;
  calendarDays: string;
  weekendsExcluded: string;
  holidaysExcluded: string;
  countedDays: string;
  expectedReturn: string;
}

export interface LeaveRequestItemModel {
  type: string;
  /** "29/10 – 30/10/2026" */
  period: string;
  /** "2 j" */
  days: string;
  status: StatusViewModel;
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
