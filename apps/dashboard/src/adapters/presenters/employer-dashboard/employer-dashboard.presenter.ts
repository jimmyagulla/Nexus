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
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class EmployerDashboardPresenter {
  constructor(private readonly placeholder: EmployerDashboardViewModel) {}

  present(): EmployerDashboardViewModel {
    return this.placeholder;
  }
}
