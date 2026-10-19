import { useQuery } from '@tanstack/react-query';
import type { ShellCounters } from '../../../../adapters/presenters/shell/shell.presenter';
import type { EmployeeShellPageComposition } from '../../../composition/shell/employee-shell-page.composition';
import { employeeShellFixture } from '../../fixtures/employee-shell.fixture';

export const getEmployeeShellQueryKey = () => ['employee-shell'];

/**
 * Placeholder data until the session use case exists: the fixture goes
 * through the presenter, which fills in the live counters.
 */
export function useGetEmployeeShell(
  { presenter }: EmployeeShellPageComposition,
  counters: ShellCounters,
) {
  return useQuery({
    queryKey: getEmployeeShellQueryKey(),
    queryFn: async () => employeeShellFixture,
    select: (shell) => presenter.present(shell, counters),
  });
}
