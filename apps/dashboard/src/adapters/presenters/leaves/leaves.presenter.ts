import type { StatusViewModel } from '../display.types';

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

export interface LeaveRequestItemModel {
  type: string;
  /** "29/10 – 30/10/2026" */
  period: string;
  /** "2 j" */
  days: string;
  status: StatusViewModel;
}

/**
 * Presents the leaves overview.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class LeavesPresenter {
  present(leaves: LeavesViewModel): LeavesViewModel {
    return leaves;
  }
}
