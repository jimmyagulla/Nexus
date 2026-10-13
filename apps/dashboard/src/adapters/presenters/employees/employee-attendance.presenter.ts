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
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class EmployeeAttendancePresenter {
  constructor(private readonly placeholder: EmployeeAttendanceViewModel) {}

  present(): EmployeeAttendanceViewModel {
    return this.placeholder;
  }
}
