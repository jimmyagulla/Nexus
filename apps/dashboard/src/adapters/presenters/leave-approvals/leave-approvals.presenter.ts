import type { LeaveApprovalsViewModel } from './leave-approvals.view-models';

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
