import type { LeaveApprovalsComposition } from '../../../composition/leave-approvals.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetLeaveApprovals } from '../../hooks/useGetLeaveApprovals';
import { i18n } from '../../i18n/i18n';
import { LeaveApprovals } from './LeaveApprovals';

interface LeaveApprovalsPageProps {
  deps: LeaveApprovalsComposition;
}

export function LeaveApprovalsPage({ deps }: LeaveApprovalsPageProps) {
  const leaveApprovals = useGetLeaveApprovals(deps);

  if (leaveApprovals.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (leaveApprovals.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <LeaveApprovals model={leaveApprovals.data} />;
}
