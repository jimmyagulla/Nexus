import { useMutation } from '@tanstack/react-query';
import { AccountComposition } from '../../composition/account.composition';

export function useActivateAccount({ controller }: AccountComposition) {
  return useMutation({
    mutationFn: async (input: { invitationToken: string; secret: string }) => {
      await controller.activate(input.invitationToken, input.secret);
    },
  });
}
