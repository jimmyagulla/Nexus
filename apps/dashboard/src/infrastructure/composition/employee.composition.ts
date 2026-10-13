import { EmployeePresenter } from '../../adapters/presenters/employees/employee.presenter';

export type EmployeeComposition = {
  presenter: EmployeePresenter;
};

export function createEmployeeComposition(): EmployeeComposition {
  return { presenter: new EmployeePresenter() };
}
