import { LeaveRequestPresenter } from '../../adapters/presenters/leaves/leave-request.presenter';

export type LeaveRequestComposition = {
  presenter: LeaveRequestPresenter;
};

export function createLeaveRequestComposition(): LeaveRequestComposition {
  return { presenter: new LeaveRequestPresenter() };
}
