import type { FlowTone } from '../display.types';

export interface EmployerDashboardViewModel {
  greeting: string;
  summary: string;
  stats: StatTileModel[];
  taskCount: string;
  tasks: TaskItemModel[];
  activities: ActivityItemModel[];
}

export interface ActivityItemModel {
  icon: string;
  actor: string;
  action: string;
  date: string;
}

export interface StatTileModel {
  value: string;
  label: string;
  hint: string;
}

export interface TaskItemModel {
  icon: string;
  tone: FlowTone;
  count: string;
  label: string;
  hint: string;
  to: string;
}

/**
 * Presents the employer dashboard.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class EmployerDashboardPresenter {
  present(employerDashboard: EmployerDashboardViewModel): EmployerDashboardViewModel {
    return employerDashboard;
  }
}
