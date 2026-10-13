import { useQuery } from '@tanstack/react-query';
import { SecondFactorComposition } from '../../composition/second-factor.composition';

export const getSecondFactorEnrollmentQueryKey = () => [
  'second-factor-enrollment',
];

export function useGetSecondFactorEnrollment({
  controller,
  enrollmentPresenter,
}: SecondFactorComposition) {
  return useQuery({
    queryKey: getSecondFactorEnrollmentQueryKey(),
    queryFn: async () =>
      enrollmentPresenter.present(await controller.beginEnrollment()),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
