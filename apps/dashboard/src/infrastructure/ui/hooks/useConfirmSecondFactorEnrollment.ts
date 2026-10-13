import { useMutation } from '@tanstack/react-query';
import { AccountComposition } from '../../composition/account.composition';

export function useConfirmSecondFactorEnrollment({
  enrollmentController,
}: AccountComposition) {
  return useMutation({
    mutationFn: (input: { enrollmentId: string; code: string }) =>
      enrollmentController.confirm(input.enrollmentId, input.code),
  });
}
