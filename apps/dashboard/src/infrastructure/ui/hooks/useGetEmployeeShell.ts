import { useQuery } from '@tanstack/react-query';
import type { EmployeeShellComposition } from '../../composition/employee-shell.composition';
import { employeeShellFixture } from '../fixtures/employee-shell.fixture';

export const getEmployeeShellQueryKey = () => ['employee-shell'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetEmployeeShell({ presenter }: EmployeeShellComposition) {
  return useQuery({
    queryKey: getEmployeeShellQueryKey(),
    queryFn: async () => presenter.present(employeeShellFixture),
  });
}
