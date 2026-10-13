import type { PayslipsViewModel } from './payslips.view-models';

/**
 * Presents the payslips list.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class PayslipsPresenter {
  constructor(private readonly placeholder: PayslipsViewModel) {}

  present(): PayslipsViewModel {
    return this.placeholder;
  }
}
