import { useQuery } from '@tanstack/react-query';
import type { EmployeeAttendancePageComposition } from '../../composition/employee/employee-attendance-page.composition';
import { employeeAttendanceFixture } from '../fixtures/employees.fixture';

export const getEmployeeAttendanceQueryKey = () => ['employee-attendance'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetEmployeeAttendance({ presenter }: EmployeeAttendancePageComposition) {
  return useQuery({
    queryKey: getEmployeeAttendanceQueryKey(),
    queryFn: async () => presenter.present(employeeAttendanceFixture),
  });
}
