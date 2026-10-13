import type { OvertimeViewModel } from './overtime.view-models';

/**
 * Presents the overtime overview.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class OvertimePresenter {
  constructor(private readonly placeholder: OvertimeViewModel) {}

  present(): OvertimeViewModel {
    return this.placeholder;
  }
}
