import { useMutation } from '@tanstack/react-query';
import { AccountComposition } from '../../composition/account.composition';

export function useSignIn({ controller }: AccountComposition) {
  return useMutation({
    mutationFn: async (input: { identifier: string; secret: string }) =>
      controller.signIn(input.identifier, input.secret),
  });
}
