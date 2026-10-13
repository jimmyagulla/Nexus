import { useQuery } from '@tanstack/react-query';
import type { NavigationEntryViewModel } from '../../../adapters/presenters/navigation.presenter';
import { NavigationComposition } from '../../composition/navigation.composition';

export const navigationEntriesQueryKey = () => ['navigation-entries'];

const NO_ENTRY: NavigationEntryViewModel[] = [];

export function useNavigationEntries({
  controller,
  presenter,
}: NavigationComposition): NavigationEntryViewModel[] {
  const entries = useQuery({
    queryKey: navigationEntriesQueryKey(),
    queryFn: async () => presenter.present(await controller.currentRole()),
  });

  return entries.data ?? NO_ENTRY;
}
