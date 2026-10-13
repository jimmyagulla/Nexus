import { useQuery } from '@tanstack/react-query';
import { PresenceComposition } from '../../composition/presence.composition';

export const getPresencesQueryKey = () => ['presences'];

export function useGetPresences({ controller, presenter }: PresenceComposition) {
  return useQuery({
    queryKey: getPresencesQueryKey(),
    queryFn: async () => presenter.present(await controller.list()),
  });
}
