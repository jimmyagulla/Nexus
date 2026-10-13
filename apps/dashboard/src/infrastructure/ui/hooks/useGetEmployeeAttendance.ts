import { useQuery } from '@tanstack/react-query';
import type { EmployeeAttendanceComposition } from '../../composition/employee-attendance.composition';
import { employeeAttendanceFixture } from '../fixtures/employees.fixture';

export const getEmployeeAttendanceQueryKey = () => ['employee-attendance'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetEmployeeAttendance({ presenter }: EmployeeAttendanceComposition) {
  return useQuery({
    queryKey: getEmployeeAttendanceQueryKey(),
    queryFn: async () => presenter.present(employeeAttendanceFixture),
  });
}
