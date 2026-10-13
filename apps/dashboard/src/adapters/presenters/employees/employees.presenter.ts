import type { StatusViewModel } from '../display.types';

export interface EmployeesViewModel {
  summary: string;
  resultsSummary: string;
  serviceFilter: string;
  employees: EmployeeRowModel[];
}

export interface EmployeeRowModel {
  id: string;
  initials: string;
  name: string;
  position: string;
  service: string;
  status: StatusViewModel;
  startDate: string;
  lastActivity: string;
}

/**
 * Presents the employees list.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class EmployeesPresenter {
  constructor(private readonly placeholder: EmployeesViewModel) {}

  present(): EmployeesViewModel {
    return this.placeholder;
  }
}
