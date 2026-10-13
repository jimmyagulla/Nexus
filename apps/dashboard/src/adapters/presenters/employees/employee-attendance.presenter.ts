import type { EmployeeHeaderModel } from './employee.presenter';

export interface EmployeeAttendanceViewModel {
  employee: EmployeeHeaderModel;
  periodFilter: string;
  months: AttendanceMonthRowModel[];
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

/**
 * Presents the attendance of one employee.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class EmployeeAttendancePresenter {
  present(employeeAttendance: EmployeeAttendanceViewModel): EmployeeAttendanceViewModel {
    return employeeAttendance;
  }
}
