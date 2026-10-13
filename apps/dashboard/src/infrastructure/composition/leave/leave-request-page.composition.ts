import { LeaveRequestPresenter } from '../../../adapters/presenters/leaves/leave-request.presenter';

export type LeaveRequestPageComposition = {
  presenter: LeaveRequestPresenter;
};

export function createLeaveRequestPageComposition(): LeaveRequestPageComposition {
  return { presenter: new LeaveRequestPresenter() };
}
