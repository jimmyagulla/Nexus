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
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class LeaveApprovalsPresenter {
  present(leaveApprovals: LeaveApprovalsViewModel): LeaveApprovalsViewModel {
    return leaveApprovals;
  }
}
