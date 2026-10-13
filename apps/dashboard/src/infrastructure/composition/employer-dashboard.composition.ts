import { EmployerDashboardPresenter } from '../../adapters/presenters/employer-dashboard/employer-dashboard.presenter';
import { employerDashboardFixture } from '../ui/fixtures/employer-dashboard.fixture';

export type EmployerDashboardComposition = {
  employerDashboardPresenter: EmployerDashboardPresenter;
};

/** Presenters of the employer dashboard screens, fed with placeholder data for now. */
export function createEmployerDashboardComposition(): EmployerDashboardComposition {
  return {
    employerDashboardPresenter: new EmployerDashboardPresenter(employerDashboardFixture),
  };
}
