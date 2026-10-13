import type { LeaveApprovalsComposition } from '../../../composition/leave-approvals.composition';
import { LeaveApprovals } from './LeaveApprovals';

interface LeaveApprovalsPageProps {
  deps: LeaveApprovalsComposition;
}

export function LeaveApprovalsPage({ deps }: LeaveApprovalsPageProps) {
  return <LeaveApprovals model={deps.leaveApprovalsPresenter.present()} />;
}
