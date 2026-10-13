import { EmployeeDashboardPresenter } from '../../../adapters/presenters/employee-dashboard/employee-dashboard.presenter';

export type EmployeeDashboardPageComposition = {
  presenter: EmployeeDashboardPresenter;
};

export function createEmployeeDashboardPageComposition(): EmployeeDashboardPageComposition {
  return { presenter: new EmployeeDashboardPresenter() };
}
