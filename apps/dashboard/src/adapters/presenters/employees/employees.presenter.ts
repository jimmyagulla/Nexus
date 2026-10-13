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
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class EmployeesPresenter {
  present(employees: EmployeesViewModel): EmployeesViewModel {
    return employees;
  }
}
