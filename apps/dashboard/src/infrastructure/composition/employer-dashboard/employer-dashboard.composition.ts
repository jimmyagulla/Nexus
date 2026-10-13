import {
  createEmployerDashboardPageComposition,
  type EmployerDashboardPageComposition,
} from './employer-dashboard-page.composition';

/** Compositions of the employer dashboard pages. */
export type EmployerDashboardComposition = {
  employerDashboard: EmployerDashboardPageComposition;
};

export function createEmployerDashboardComposition(): EmployerDashboardComposition {
  return {
    employerDashboard: createEmployerDashboardPageComposition(),
  };
}
