import { LeaveRequestPresenter } from '../../adapters/presenters/leaves/leave-request.presenter';
import { LeaveRequestSentPresenter } from '../../adapters/presenters/leaves/leave-request-sent.presenter';
import { LeavesPresenter } from '../../adapters/presenters/leaves/leaves.presenter';
import { leaveRequestFixture, leaveRequestSentFixture, leavesFixture } from '../ui/fixtures/leaves.fixture';

export type LeavesComposition = {
  leavesPresenter: LeavesPresenter;
  leaveRequestPresenter: LeaveRequestPresenter;
  leaveRequestSentPresenter: LeaveRequestSentPresenter;
};

/** Presenters of the leaves screens, fed with placeholder data for now. */
export function createLeavesComposition(): LeavesComposition {
  return {
    leavesPresenter: new LeavesPresenter(leavesFixture),
    leaveRequestPresenter: new LeaveRequestPresenter(leaveRequestFixture),
    leaveRequestSentPresenter: new LeaveRequestSentPresenter(leaveRequestSentFixture),
  };
}
