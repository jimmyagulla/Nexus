import {
  createLeaveApprovalsPageComposition,
  type LeaveApprovalsPageComposition,
} from './leave-approvals-page.composition';

/** Compositions of the leave approval pages. */
export type LeaveApprovalComposition = {
  leaveApprovals: LeaveApprovalsPageComposition;
};

export function createLeaveApprovalComposition(): LeaveApprovalComposition {
  return {
    leaveApprovals: createLeaveApprovalsPageComposition(),
  };
}
