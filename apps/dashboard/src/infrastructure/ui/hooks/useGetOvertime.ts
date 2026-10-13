import { useQuery } from '@tanstack/react-query';
import type { OvertimePageComposition } from '../../composition/overtime/overtime-page.composition';
import { overtimeFixture } from '../fixtures/overtime.fixture';

export const getOvertimeQueryKey = () => ['overtime'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetOvertime({ presenter }: OvertimePageComposition) {
  return useQuery({
    queryKey: getOvertimeQueryKey(),
    queryFn: async () => presenter.present(overtimeFixture),
  });
}
