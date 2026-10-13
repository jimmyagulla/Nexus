import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PresenceComposition } from '../../composition/presence.composition';
import { getPresencesQueryKey } from './useGetPresences';

export function useAdjustPresenceWorkedDays({ controller }: PresenceComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { presenceId: string; workedDays: number }) => {
      await controller.adjustWorkedDays(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: getPresencesQueryKey() });
    },
  });
}
