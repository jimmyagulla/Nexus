import { EmployeePresenter } from '../../../adapters/presenters/employees/employee.presenter';

export type EmployeePageComposition = {
  presenter: EmployeePresenter;
};

export function createEmployeePageComposition(): EmployeePageComposition {
  return { presenter: new EmployeePresenter() };
}
