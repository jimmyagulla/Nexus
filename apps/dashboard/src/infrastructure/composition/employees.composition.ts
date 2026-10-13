import { EmployeeAttendancePresenter } from '../../adapters/presenters/employees/employee-attendance.presenter';
import { EmployeePresenter } from '../../adapters/presenters/employees/employee.presenter';
import { EmployeesPresenter } from '../../adapters/presenters/employees/employees.presenter';
import { employeeAttendanceFixture, employeeFixture, employeesFixture } from '../ui/fixtures/employees.fixture';

export type EmployeesComposition = {
  employeesPresenter: EmployeesPresenter;
  employeePresenter: EmployeePresenter;
  employeeAttendancePresenter: EmployeeAttendancePresenter;
};

/** Presenters of the employees screens, fed with placeholder data for now. */
export function createEmployeesComposition(): EmployeesComposition {
  return {
    employeesPresenter: new EmployeesPresenter(employeesFixture),
    employeePresenter: new EmployeePresenter(employeeFixture),
    employeeAttendancePresenter: new EmployeeAttendancePresenter(employeeAttendanceFixture),
  };
}
