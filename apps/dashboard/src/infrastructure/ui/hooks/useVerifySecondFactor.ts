import { useMutation } from '@tanstack/react-query';
import { SecondFactorComposition } from '../../composition/second-factor.composition';

export function useVerifySecondFactor({ controller }: SecondFactorComposition) {
  return useMutation({
    mutationFn: async (code: string) => {
      await controller.verify(code);
    },
  });
}
