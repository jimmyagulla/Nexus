import { useQuery } from '@tanstack/react-query';
import type { OvertimeComposition } from '../../composition/overtime.composition';
import { overtimeFixture } from '../fixtures/overtime.fixture';

export const getOvertimeQueryKey = () => ['overtime'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetOvertime({ presenter }: OvertimeComposition) {
  return useQuery({
    queryKey: getOvertimeQueryKey(),
    queryFn: async () => presenter.present(overtimeFixture),
  });
}
