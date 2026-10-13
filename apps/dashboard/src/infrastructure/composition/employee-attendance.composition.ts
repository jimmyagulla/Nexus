import { EmployeeAttendancePresenter } from '../../adapters/presenters/employees/employee-attendance.presenter';

export type EmployeeAttendanceComposition = {
  presenter: EmployeeAttendancePresenter;
};

export function createEmployeeAttendanceComposition(): EmployeeAttendanceComposition {
  return { presenter: new EmployeeAttendancePresenter() };
}
