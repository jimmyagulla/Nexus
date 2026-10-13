import { LeaveApprovalsPresenter } from '../../adapters/presenters/leave-approvals/leave-approvals.presenter';
import { leaveApprovalsFixture } from '../ui/fixtures/leave-approvals.fixture';

export type LeaveApprovalsComposition = {
  leaveApprovalsPresenter: LeaveApprovalsPresenter;
};

/** Presenters of the leave approvals screens, fed with placeholder data for now. */
export function createLeaveApprovalsComposition(): LeaveApprovalsComposition {
  return {
    leaveApprovalsPresenter: new LeaveApprovalsPresenter(leaveApprovalsFixture),
  };
}
