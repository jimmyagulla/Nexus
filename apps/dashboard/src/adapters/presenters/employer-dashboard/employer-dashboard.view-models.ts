/** View models of the employer dashboard screens, produced by their presenters. */

import type { FlowTone } from '../display.view-models';

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
