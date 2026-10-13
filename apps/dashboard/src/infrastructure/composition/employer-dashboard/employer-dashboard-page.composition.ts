import { EmployerDashboardPresenter } from '../../../adapters/presenters/employer-dashboard/employer-dashboard.presenter';

export type EmployerDashboardPageComposition = {
  presenter: EmployerDashboardPresenter;
};

export function createEmployerDashboardPageComposition(): EmployerDashboardPageComposition {
  return { presenter: new EmployerDashboardPresenter() };
}
