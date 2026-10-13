import type { EmployeeViewModel } from './employees.view-models';

/**
 * Presents one employee space.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class EmployeePresenter {
  constructor(private readonly placeholder: EmployeeViewModel) {}

  present(): EmployeeViewModel {
    return this.placeholder;
  }
}
