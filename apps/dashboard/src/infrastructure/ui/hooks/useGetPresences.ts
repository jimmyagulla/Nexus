import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { PresenceListFilter } from '@hexagonal-monorepo-template/domain';
import { PresenceComposition } from '../../composition/presence.composition';

export const getPresencesQueryKey = (filter: PresenceListFilter = {}) => [
  'presences',
  filter,
];

export function useGetPresences(
  { controller, presenter }: PresenceComposition,
  filter: PresenceListFilter = {},
) {
  return useQuery({
    queryKey: getPresencesQueryKey(filter),
    queryFn: async () => presenter.present(await controller.list(filter)),
    placeholderData: keepPreviousData,
  });
}
