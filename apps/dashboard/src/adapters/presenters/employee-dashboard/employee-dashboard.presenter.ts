import type { EmployeeDashboardViewModel } from './employee-dashboard.view-models';

/**
 * Presents the employee dashboard.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class EmployeeDashboardPresenter {
  constructor(private readonly placeholder: EmployeeDashboardViewModel) {}

  present(): EmployeeDashboardViewModel {
    return this.placeholder;
  }
}
