import {
  createLeavesPageComposition,
  type LeavesPageComposition,
} from './leaves-page.composition';
import {
  createLeaveRequestPageComposition,
  type LeaveRequestPageComposition,
} from './leave-request-page.composition';
import {
  createLeaveRequestSentPageComposition,
  type LeaveRequestSentPageComposition,
} from './leave-request-sent-page.composition';

/** Compositions of the leave pages. */
export type LeaveComposition = {
  leaves: LeavesPageComposition;
  leaveRequest: LeaveRequestPageComposition;
  leaveRequestSent: LeaveRequestSentPageComposition;
};

export function createLeaveComposition(): LeaveComposition {
  return {
    leaves: createLeavesPageComposition(),
    leaveRequest: createLeaveRequestPageComposition(),
    leaveRequestSent: createLeaveRequestSentPageComposition(),
  };
}
