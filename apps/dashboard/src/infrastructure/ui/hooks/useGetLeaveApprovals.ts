import { useQuery } from '@tanstack/react-query';
import type { LeaveApprovalsPageComposition } from '../../composition/leave-approval/leave-approvals-page.composition';
import { leaveApprovalsFixture } from '../fixtures/leave-approvals.fixture';

export const getLeaveApprovalsQueryKey = () => ['leave-approvals'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetLeaveApprovals({ presenter }: LeaveApprovalsPageComposition) {
  return useQuery({
    queryKey: getLeaveApprovalsQueryKey(),
    queryFn: async () => presenter.present(leaveApprovalsFixture),
  });
}
