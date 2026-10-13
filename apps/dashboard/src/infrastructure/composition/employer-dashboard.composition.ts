import { EmployerDashboardPresenter } from '../../adapters/presenters/employer-dashboard/employer-dashboard.presenter';

export type EmployerDashboardComposition = {
  presenter: EmployerDashboardPresenter;
};

export function createEmployerDashboardComposition(): EmployerDashboardComposition {
  return { presenter: new EmployerDashboardPresenter() };
}
