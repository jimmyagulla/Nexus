import { EmployeeAttendancePresenter } from '../../../adapters/presenters/employees/employee-attendance.presenter';

export type EmployeeAttendancePageComposition = {
  presenter: EmployeeAttendancePresenter;
};

export function createEmployeeAttendancePageComposition(): EmployeeAttendancePageComposition {
  return { presenter: new EmployeeAttendancePresenter() };
}
