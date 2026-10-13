import { EmployeesPresenter } from '../../adapters/presenters/employees/employees.presenter';

export type EmployeesComposition = {
  presenter: EmployeesPresenter;
};

export function createEmployeesComposition(): EmployeesComposition {
  return { presenter: new EmployeesPresenter() };
}
