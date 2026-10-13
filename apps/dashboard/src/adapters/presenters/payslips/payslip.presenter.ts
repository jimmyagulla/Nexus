import type { PayslipViewModel } from './payslips.view-models';

/**
 * Presents one payslip.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class PayslipPresenter {
  constructor(private readonly placeholder: PayslipViewModel) {}

  present(): PayslipViewModel {
    return this.placeholder;
  }
}
