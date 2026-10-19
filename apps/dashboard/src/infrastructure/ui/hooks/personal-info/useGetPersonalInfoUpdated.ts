import { useQuery } from '@tanstack/react-query';
import type { PersonalInfoUpdatedPageComposition } from '../../../composition/personal-info/personal-info-updated-page.composition';
import { personalInfoUpdatedFixture } from '../../fixtures/personal-info.fixture';

export const getPersonalInfoUpdatedQueryKey = () => ['personal-info-updated'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetPersonalInfoUpdated({ presenter }: PersonalInfoUpdatedPageComposition) {
  return useQuery({
    queryKey: getPersonalInfoUpdatedQueryKey(),
    queryFn: async () => presenter.present(personalInfoUpdatedFixture),
  });
}
