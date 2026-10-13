import type { EmployeeAttendanceViewModel } from './employees.view-models';

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
