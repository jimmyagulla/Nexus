import { useQuery } from '@tanstack/react-query';
import type { LoginVerificationPageComposition } from '../../../composition/auth/login-verification-page.composition';
import { loginVerificationFixture } from '../../fixtures/auth.fixture';

export const getLoginVerificationQueryKey = () => ['login-verification'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetLoginVerification({ presenter }: LoginVerificationPageComposition) {
  return useQuery({
    queryKey: getLoginVerificationQueryKey(),
    queryFn: async () => presenter.present(loginVerificationFixture),
  });
}
