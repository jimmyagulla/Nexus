import { useQuery } from '@tanstack/react-query';
import type { PersonalInfoEditComposition } from '../../composition/personal-info-edit.composition';
import { personalInfoEditFixture } from '../fixtures/personal-info.fixture';

export const getPersonalInfoEditQueryKey = () => ['personal-info-edit'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetPersonalInfoEdit({ presenter }: PersonalInfoEditComposition) {
  return useQuery({
    queryKey: getPersonalInfoEditQueryKey(),
    queryFn: async () => presenter.present(personalInfoEditFixture),
  });
}
