import { useQuery } from '@tanstack/react-query';
import type { LoginComposition } from '../../composition/login.composition';
import { loginFixture } from '../fixtures/auth.fixture';

export const getLoginQueryKey = () => ['login'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetLogin({ presenter }: LoginComposition) {
  return useQuery({
    queryKey: getLoginQueryKey(),
    queryFn: async () => presenter.present(loginFixture),
  });
}
