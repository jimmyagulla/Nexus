import { useQuery } from '@tanstack/react-query';
import type { PersonalInfoUpdatedComposition } from '../../composition/personal-info-updated.composition';
import { personalInfoUpdatedFixture } from '../fixtures/personal-info.fixture';

export const getPersonalInfoUpdatedQueryKey = () => ['personal-info-updated'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetPersonalInfoUpdated({ presenter }: PersonalInfoUpdatedComposition) {
  return useQuery({
    queryKey: getPersonalInfoUpdatedQueryKey(),
    queryFn: async () => presenter.present(personalInfoUpdatedFixture),
  });
}
