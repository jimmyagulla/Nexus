import { useQuery } from '@tanstack/react-query';
import { SecondFactorComposition } from '../../composition/second-factor.composition';

export const getSecondFactorChallengeQueryKey = () => [
  'second-factor-challenge',
];

export function useGetSecondFactorChallenge({
  controller,
  stepPresenter,
}: SecondFactorComposition) {
  return useQuery({
    queryKey: getSecondFactorChallengeQueryKey(),
    queryFn: async () => stepPresenter.present(await controller.openChallenge()),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
