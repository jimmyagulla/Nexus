import { useMutation } from '@tanstack/react-query';
import { AccountComposition } from '../../composition/account.composition';

export function useActivateEmployeeAccount({ controller }: AccountComposition) {
  return useMutation({
    mutationFn: async (input: { invitationToken: string; secret: string }) => {
      await controller.activateEmployee(input.invitationToken, input.secret);
    },
  });
}
