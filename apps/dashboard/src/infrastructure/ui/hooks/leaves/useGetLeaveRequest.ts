import { useQuery } from '@tanstack/react-query';
import type { LeaveRequestPageComposition } from '../../../composition/leave/leave-request-page.composition';
import { leaveRequestFixture } from '../../fixtures/leaves.fixture';

export const getLeaveRequestQueryKey = () => ['leave-request'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetLeaveRequest({ presenter }: LeaveRequestPageComposition) {
  return useQuery({
    queryKey: getLeaveRequestQueryKey(),
    queryFn: async () => presenter.present(leaveRequestFixture),
  });
}
