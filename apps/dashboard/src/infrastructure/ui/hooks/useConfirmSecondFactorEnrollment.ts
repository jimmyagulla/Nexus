import { useMutation } from '@tanstack/react-query';
import { SecondFactorComposition } from '../../composition/second-factor.composition';

export function useConfirmSecondFactorEnrollment({
  controller,
}: SecondFactorComposition) {
  return useMutation({
    mutationFn: async (code: string) => {
      await controller.confirmEnrollment(code);
    },
  });
}
