import { useQuery } from '@tanstack/react-query';
import type { LoginVerificationComposition } from '../../composition/login-verification.composition';
import { loginVerificationFixture } from '../fixtures/auth.fixture';

export const getLoginVerificationQueryKey = () => ['login-verification'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetLoginVerification({ presenter }: LoginVerificationComposition) {
  return useQuery({
    queryKey: getLoginVerificationQueryKey(),
    queryFn: async () => presenter.present(loginVerificationFixture),
  });
}
