import type { LeavesComposition } from '../../../composition/leaves.composition';
import { LeaveRequest } from './LeaveRequest';

interface LeaveRequestPageProps {
  deps: LeavesComposition;
}

export function LeaveRequestPage({ deps }: LeaveRequestPageProps) {
  return <LeaveRequest model={deps.leaveRequestPresenter.present()} />;
}
