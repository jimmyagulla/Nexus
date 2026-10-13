import type { LeaveRequestComposition } from '../../../composition/leave-request.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetLeaveRequest } from '../../hooks/useGetLeaveRequest';
import { i18n } from '../../i18n/i18n';
import { LeaveRequest } from './LeaveRequest';

interface LeaveRequestPageProps {
  deps: LeaveRequestComposition;
}

export function LeaveRequestPage({ deps }: LeaveRequestPageProps) {
  const leaveRequest = useGetLeaveRequest(deps);

  if (leaveRequest.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (leaveRequest.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <LeaveRequest model={leaveRequest.data} />;
}
