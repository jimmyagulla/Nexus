import { useQuery } from '@tanstack/react-query';
import type { PersonalInfoPageComposition } from '../../composition/personal-info/personal-info-page.composition';
import { personalInfoFixture } from '../fixtures/personal-info.fixture';

export const getPersonalInfoQueryKey = () => ['personal-info'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetPersonalInfo({ presenter }: PersonalInfoPageComposition) {
  return useQuery({
    queryKey: getPersonalInfoQueryKey(),
    queryFn: async () => presenter.present(personalInfoFixture),
  });
}
