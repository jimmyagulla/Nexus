import { useQuery } from '@tanstack/react-query';
import type { EmployeePageComposition } from '../../composition/employee/employee-page.composition';
import { employeeFixture } from '../fixtures/employees.fixture';

export const getEmployeeQueryKey = () => ['employee'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetEmployee({ presenter }: EmployeePageComposition) {
  return useQuery({
    queryKey: getEmployeeQueryKey(),
    queryFn: async () => presenter.present(employeeFixture),
  });
}
