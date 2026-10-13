import { useQuery } from '@tanstack/react-query';
import type { EmployeeShellPageComposition } from '../../composition/shell/employee-shell-page.composition';
import { employeeShellFixture } from '../fixtures/employee-shell.fixture';

export const getEmployeeShellQueryKey = () => ['employee-shell'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetEmployeeShell({ presenter }: EmployeeShellPageComposition) {
  return useQuery({
    queryKey: getEmployeeShellQueryKey(),
    queryFn: async () => presenter.present(employeeShellFixture),
  });
}
