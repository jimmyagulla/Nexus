/** View models of the leave approvals screens, produced by their presenters. */

import type { StatusViewModel } from '../display.view-models';

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
