import { EmployeeDashboardPresenter } from '../../adapters/presenters/employee-dashboard/employee-dashboard.presenter';

export type EmployeeDashboardComposition = {
  presenter: EmployeeDashboardPresenter;
};

export function createEmployeeDashboardComposition(): EmployeeDashboardComposition {
  return { presenter: new EmployeeDashboardPresenter() };
}
