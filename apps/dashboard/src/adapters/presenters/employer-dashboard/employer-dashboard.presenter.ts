import type { EmployerDashboardViewModel } from './employer-dashboard.view-models';

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
