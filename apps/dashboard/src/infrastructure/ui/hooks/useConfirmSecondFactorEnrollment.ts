import { useMutation } from '@tanstack/react-query';
import { SecondFactorComposition } from '../../composition/second-factor.composition';

export function useConfirmSecondFactorEnrollment({
  controller,
  recoveryCodesPresenter,
}: SecondFactorComposition) {
  return useMutation({
    mutationFn: async (code: string) =>
      recoveryCodesPresenter.present(await controller.confirmEnrollment(code)),
  });
}
