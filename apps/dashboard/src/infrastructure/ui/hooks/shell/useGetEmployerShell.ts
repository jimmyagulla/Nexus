import { useQuery } from '@tanstack/react-query';
import type { EmployerShellPageComposition } from '../../../composition/shell/employer-shell-page.composition';
import { employerShellFixture } from '../../fixtures/employer-shell.fixture';

export const getEmployerShellQueryKey = () => ['employer-shell'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetEmployerShell({ presenter }: EmployerShellPageComposition) {
  return useQuery({
    queryKey: getEmployerShellQueryKey(),
    queryFn: async () => presenter.present(employerShellFixture),
  });
}
