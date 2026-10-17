import { useQuery } from '@tanstack/react-query';
import type { LeaveRequestSentPageComposition } from '../../../composition/leave/leave-request-sent-page.composition';
import { leaveRequestSentFixture } from '../../fixtures/leaves.fixture';

export const getLeaveRequestSentQueryKey = () => ['leave-request-sent'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetLeaveRequestSent({ presenter }: LeaveRequestSentPageComposition) {
  return useQuery({
    queryKey: getLeaveRequestSentQueryKey(),
    queryFn: async () => presenter.present(leaveRequestSentFixture),
  });
}
