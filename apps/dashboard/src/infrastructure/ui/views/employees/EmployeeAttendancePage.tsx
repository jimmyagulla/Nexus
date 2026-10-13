import { employeeAttendanceFixture } from '../../fixtures/employees.fixture';
import { EmployeeAttendance } from './EmployeeAttendance';

/** Placeholder data until the employee attendance presenter is wired. */
export function EmployeeAttendancePage() {
  return <EmployeeAttendance model={employeeAttendanceFixture} />;
}
