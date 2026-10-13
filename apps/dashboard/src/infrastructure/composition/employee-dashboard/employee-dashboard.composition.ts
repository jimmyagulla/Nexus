import {
  createEmployeeDashboardPageComposition,
  type EmployeeDashboardPageComposition,
} from './employee-dashboard-page.composition';

/** Compositions of the employee dashboard pages. */
export type EmployeeDashboardComposition = {
  employeeDashboard: EmployeeDashboardPageComposition;
};

export function createEmployeeDashboardComposition(): EmployeeDashboardComposition {
  return {
    employeeDashboard: createEmployeeDashboardPageComposition(),
  };
}
