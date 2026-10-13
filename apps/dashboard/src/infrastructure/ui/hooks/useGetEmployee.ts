import { useQuery } from '@tanstack/react-query';
import type { EmployeeComposition } from '../../composition/employee.composition';
import { employeeFixture } from '../fixtures/employees.fixture';

export const getEmployeeQueryKey = () => ['employee'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetEmployee({ presenter }: EmployeeComposition) {
  return useQuery({
    queryKey: getEmployeeQueryKey(),
    queryFn: async () => presenter.present(employeeFixture),
  });
}
