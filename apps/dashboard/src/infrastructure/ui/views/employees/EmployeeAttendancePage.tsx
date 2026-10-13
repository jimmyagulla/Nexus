import type { EmployeesComposition } from '../../../composition/employees.composition';
import { EmployeeAttendance } from './EmployeeAttendance';

interface EmployeeAttendancePageProps {
  deps: EmployeesComposition;
}

export function EmployeeAttendancePage({ deps }: EmployeeAttendancePageProps) {
  return <EmployeeAttendance model={deps.employeeAttendancePresenter.present()} />;
}
