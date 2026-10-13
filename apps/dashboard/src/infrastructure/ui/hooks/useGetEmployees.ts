import { useQuery } from '@tanstack/react-query';
import type { EmployeesComposition } from '../../composition/employees.composition';
import { employeesFixture } from '../fixtures/employees.fixture';

export const getEmployeesQueryKey = () => ['employees'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetEmployees({ presenter }: EmployeesComposition) {
  return useQuery({
    queryKey: getEmployeesQueryKey(),
    queryFn: async () => presenter.present(employeesFixture),
  });
}
