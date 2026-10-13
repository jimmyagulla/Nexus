import { useQuery } from '@tanstack/react-query';
import type { LeaveApprovalsComposition } from '../../composition/leave-approvals.composition';
import { leaveApprovalsFixture } from '../fixtures/leave-approvals.fixture';

export const getLeaveApprovalsQueryKey = () => ['leave-approvals'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetLeaveApprovals({ presenter }: LeaveApprovalsComposition) {
  return useQuery({
    queryKey: getLeaveApprovalsQueryKey(),
    queryFn: async () => presenter.present(leaveApprovalsFixture),
  });
}
