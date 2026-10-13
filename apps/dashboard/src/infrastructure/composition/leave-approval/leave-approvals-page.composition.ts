import { LeaveApprovalsPresenter } from '../../../adapters/presenters/leave-approvals/leave-approvals.presenter';

export type LeaveApprovalsPageComposition = {
  presenter: LeaveApprovalsPresenter;
};

export function createLeaveApprovalsPageComposition(): LeaveApprovalsPageComposition {
  return { presenter: new LeaveApprovalsPresenter() };
}
