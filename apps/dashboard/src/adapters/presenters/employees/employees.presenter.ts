import type { EmployeesViewModel } from './employees.view-models';

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
