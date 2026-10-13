import { EmployeesPresenter } from '../../../adapters/presenters/employees/employees.presenter';

export type EmployeesPageComposition = {
  presenter: EmployeesPresenter;
};

export function createEmployeesPageComposition(): EmployeesPageComposition {
  return { presenter: new EmployeesPresenter() };
}
