import { EmployeeDashboardPresenter } from '../../adapters/presenters/employee-dashboard/employee-dashboard.presenter';
import { employeeDashboardFixture } from '../ui/fixtures/employee-dashboard.fixture';

export type EmployeeDashboardComposition = {
  employeeDashboardPresenter: EmployeeDashboardPresenter;
};

/** Presenters of the employee dashboard screens, fed with placeholder data for now. */
export function createEmployeeDashboardComposition(): EmployeeDashboardComposition {
  return {
    employeeDashboardPresenter: new EmployeeDashboardPresenter(employeeDashboardFixture),
  };
}
