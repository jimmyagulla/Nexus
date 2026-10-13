import { LeaveApprovalsPresenter } from '../../adapters/presenters/leave-approvals/leave-approvals.presenter';

export type LeaveApprovalsComposition = {
  presenter: LeaveApprovalsPresenter;
};

export function createLeaveApprovalsComposition(): LeaveApprovalsComposition {
  return { presenter: new LeaveApprovalsPresenter() };
}
