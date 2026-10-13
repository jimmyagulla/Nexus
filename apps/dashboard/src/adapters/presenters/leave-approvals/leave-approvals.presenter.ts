import type { StatusViewModel } from '../display.types';

export interface LeaveApprovalsViewModel {
  summary: string;
  statusFilter: string;
  requests: LeaveRequestRowModel[];
}

export interface LeaveRequestRowModel {
  id: string;
  initials: string;
  employee: string;
  type: string;
  period: string;
  days: string;
  balanceAfter: string;
  status: StatusViewModel;
}

/**
 * Presents the leave requests to approve.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class LeaveApprovalsPresenter {
  constructor(private readonly placeholder: LeaveApprovalsViewModel) {}

  present(): LeaveApprovalsViewModel {
    return this.placeholder;
  }
}
