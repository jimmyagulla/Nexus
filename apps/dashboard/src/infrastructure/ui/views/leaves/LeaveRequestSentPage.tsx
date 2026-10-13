import type { LeaveRequestSentPageComposition } from '../../../composition/leave/leave-request-sent-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetLeaveRequestSent } from '../../hooks/useGetLeaveRequestSent';
import { i18n } from '../../i18n/i18n';
import { LeaveRequestSent } from './LeaveRequestSent';

interface LeaveRequestSentPageProps {
  deps: LeaveRequestSentPageComposition;
}

export function LeaveRequestSentPage({ deps }: LeaveRequestSentPageProps) {
  const leaveRequestSent = useGetLeaveRequestSent(deps);

  if (leaveRequestSent.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (leaveRequestSent.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <LeaveRequestSent model={leaveRequestSent.data} />;
}
