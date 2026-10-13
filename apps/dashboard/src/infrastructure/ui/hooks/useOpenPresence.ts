import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PresenceComposition } from '../../composition/presence.composition';
import { getPresencesQueryKey } from './useGetPresences';

export function useOpenPresence({ controller }: PresenceComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { employeeId: string; month: string }) => {
      await controller.open(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: getPresencesQueryKey() });
    },
  });
}
