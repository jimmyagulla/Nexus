import { LeaveRequestSentPresenter } from '../../adapters/presenters/leaves/leave-request-sent.presenter';

export type LeaveRequestSentComposition = {
  presenter: LeaveRequestSentPresenter;
};

export function createLeaveRequestSentComposition(): LeaveRequestSentComposition {
  return { presenter: new LeaveRequestSentPresenter() };
}
