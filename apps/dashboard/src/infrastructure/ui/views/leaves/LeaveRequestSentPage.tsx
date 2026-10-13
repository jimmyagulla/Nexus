import type { LeavesComposition } from '../../../composition/leaves.composition';
import { LeaveRequestSent } from './LeaveRequestSent';

interface LeaveRequestSentPageProps {
  deps: LeavesComposition;
}

export function LeaveRequestSentPage({ deps }: LeaveRequestSentPageProps) {
  return <LeaveRequestSent model={deps.leaveRequestSentPresenter.present()} />;
}
