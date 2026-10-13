/** View models of the employees screens, produced by their presenters. */

import type { StatusViewModel } from '../display.view-models';

export interface EmployeeViewModel {
  employee: EmployeeHeaderModel;
  summary: SpaceSummaryTileModel[];
  identity: IdentityRowModel[];
  history: ActionHistoryItemModel[];
}

export interface EmployeeAttendanceViewModel {
  employee: EmployeeHeaderModel;
  periodFilter: string;
  months: AttendanceMonthRowModel[];
}

export interface EmployeesViewModel {
  summary: string;
  resultsSummary: string;
  serviceFilter: string;
  employees: EmployeeRowModel[];
}

export interface ActionHistoryItemModel {
  label: string;
  date: string;
}

export interface AttendanceMonthRowModel {
  month: string;
  period: string;
  worked: string;
  absences: string;
  leaves: string;
  sickLeaves: string;
  otherEvents: string;
}

export interface EmployeeHeaderModel {
  id: string;
  initials: string;
  name: string;
  status: StatusViewModel;
  meta: string;
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

export interface IdentityRowModel {
  label: string;
  value: string;
}

export interface SpaceSummaryTileModel {
  icon: string;
  label: string;
  value: string;
  hint: string;
}
