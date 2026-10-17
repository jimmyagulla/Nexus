import { useQuery } from '@tanstack/react-query';
import type { LeavesPageComposition } from '../../../composition/leave/leaves-page.composition';
import { leavesFixture } from '../../fixtures/leaves.fixture';

export const getLeavesQueryKey = () => ['leaves'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetLeaves({ presenter }: LeavesPageComposition) {
  return useQuery({
    queryKey: getLeavesQueryKey(),
    queryFn: async () => presenter.present(leavesFixture),
  });
}
