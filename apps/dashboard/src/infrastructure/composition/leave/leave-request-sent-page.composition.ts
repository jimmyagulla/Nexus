import { LeaveRequestSentPresenter } from '../../../adapters/presenters/leaves/leave-request-sent.presenter';

export type LeaveRequestSentPageComposition = {
  presenter: LeaveRequestSentPresenter;
};

export function createLeaveRequestSentPageComposition(): LeaveRequestSentPageComposition {
  return { presenter: new LeaveRequestSentPresenter() };
}
