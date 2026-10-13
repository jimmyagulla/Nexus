import { useQuery } from '@tanstack/react-query';
import type { EmployerShellComposition } from '../../composition/employer-shell.composition';
import { employerShellFixture } from '../fixtures/employer-shell.fixture';

export const getEmployerShellQueryKey = () => ['employer-shell'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetEmployerShell({ presenter }: EmployerShellComposition) {
  return useQuery({
    queryKey: getEmployerShellQueryKey(),
    queryFn: async () => presenter.present(employerShellFixture),
  });
}
