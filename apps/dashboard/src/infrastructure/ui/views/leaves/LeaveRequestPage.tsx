import { leaveRequestFixture } from '../../fixtures/leaves.fixture';
import { LeaveRequest } from './LeaveRequest';

/** Placeholder data until the leaves presenter is wired. */
export function LeaveRequestPage() {
  return <LeaveRequest model={leaveRequestFixture} />;
}
